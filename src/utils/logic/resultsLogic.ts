
import type { Answer } from "src/types/api/answer.dto";
import type { Form } from "src/types/state/form.dto";
import type {
    HighlightCategory,
    HighlightCardData,
} from "src/components/results/HighlightCard";
import type { WordAssociationItem } from "src/components/results/WordAssociationCard";
import { normalizeForMatch } from "src/utils/logic/singlishDictionaryLogic";

const MIN_RESPONDENTS_FOR_CLASSIFICATION = 5;
const COMMON_THRESHOLD = 0.1;
const MAX_COMMON_RANK = 3;

type AssociationStats = {
    displayWord: string;
    respondentIds: Set<number>;
};

type CueStats = {
    cueWord: string;
    questionId: number;
    totalRespondents: number;
    associations: Map<string, AssociationStats>;
};

export type ResultsData = {
    highlights: HighlightCardData[];
    wordAssociations: WordAssociationItem[];
};

const normalize = (word: string): string =>
    word.trim().toLocaleLowerCase();


const getNonEmptyAssociations = (answer: Answer): string[] =>
    [
        answer.association1,
        answer.association2,
        answer.association3,
    ].filter(
        (association): association is string =>
            typeof association === "string" &&
            association.trim().length > 0
    );

/**
 * Builds the results displayed on the participant's results page.
 *
 * Answers are grouped by questionId. Each respondent is counted
 * at most once per association for a given cue word.
 */
export const buildResultsData = (
    form: Form,
    allAnswers: Answer[]
): ResultsData => {
    const participantCues = form.data.filter(
        item => item.question.word.trim().length > 0
    );

    const cueStats = new Map<number, CueStats>();

    // Initialise statistics for the participant's cue words.
    participantCues.forEach(item => {
        cueStats.set(item.question.id, {
            cueWord: item.question.word.trim(),
            questionId: item.question.id,
            totalRespondents: 0,
            associations: new Map(),
        });
    });

    // Collect distinct respondents and their associations per cue.
    cueStats.forEach(cue => {
        const answersForCue = allAnswers.filter(
            answer => answer.questionId === cue.questionId
        );

        const respondentsForCue = new Set<number>();

        answersForCue.forEach(answer => {
            // Only responses from participants who recognize the cue
            // contribute to association statistics.
            if (answer.isRecognisedWord !== 1) return;

            const associations = getNonEmptyAssociations(answer);

            // A respondent counts toward the denominator if they
            // supplied at least one non-empty association.
            if (associations.length === 0) return;

            respondentsForCue.add(answer.respondentId);

            // Count each respondent only once per association,
            // even if they entered the same word more than once.
            const respondentWords = new Set(
                associations.map(normalize).filter(Boolean)
            );

            respondentWords.forEach(normalizedWord => {
                const originalWord = associations.find(
                    word => normalize(word) === normalizedWord
                ) ?? normalizedWord;

                let stats = cue.associations.get(normalizedWord);

                if (!stats) {
                    stats = {
                        displayWord: originalWord.trim(),
                        respondentIds: new Set<number>(),
                    };

                    cue.associations.set(normalizedWord, stats);
                }

                stats.respondentIds.add(answer.respondentId);
            });
        });

        cue.totalRespondents = respondentsForCue.size;
    });

    /**
     * Returns the classification for an association.
     *
     * Rank is zero-based and is calculated across all associations
     * for the cue, ordered by the number of respondents.
     */
    const getCategory = (
        matchingRespondents: number,
        totalRespondents: number,
        rank: number
    ): HighlightCategory => {
        if (totalRespondents < MIN_RESPONDENTS_FOR_CLASSIFICATION) {
            return "more-data-needed";
        }

        // Assumes the current participant's submitted response is
        // included in allAnswers. A count of one means no other
        // respondent supplied this association.
        if (matchingRespondents === 1) {
            return "distinctive";
        }

        const frequency = matchingRespondents / totalRespondents;

        if (
            rank < MAX_COMMON_RANK &&
            frequency >= COMMON_THRESHOLD
        ) {
            return "common";
        }

        return "less-common";
    };

    const highlights: HighlightCardData[] = [];
    const wordAssociations: WordAssociationItem[] = [];

    participantCues.forEach(participantCue => {
        const cue = cueStats.get(participantCue.question.id);
        if (!cue) return;

        // Normalise the participant's own responses while preserving
        // their original display text and response order.
        const participantResponses = participantCue.response
            .filter(response => response.trim().length > 0)
            .map(response => ({
                displayWord: response.trim(),
                normalizedWord: normalize(response),
            }))
            .filter(response => response.normalizedWord.length > 0);

        // Remove duplicate responses from this participant.
        const seenResponses = new Set<string>();

        const uniqueParticipantResponses = participantResponses.filter(
            response => {
                if (seenResponses.has(response.normalizedWord)) {
                    return false;
                }

                seenResponses.add(response.normalizedWord);
                return true;
            }
        );

        // Rank all study associations by the number of respondents.
        // This ranking is shared by the results and share-card logic.
        const rankedAssociations = Array.from(
            cue.associations.entries()
        ).sort((a, b) => {
            const countDifference =
                b[1].respondentIds.size - a[1].respondentIds.size;

            return countDifference !== 0
                ? countDifference
                : a[1].displayWord.localeCompare(b[1].displayWord);
        });

        const associationRanks = new Map<string, number>();

        rankedAssociations.forEach(([normalizedWord], index) => {
            associationRanks.set(normalizedWord, index);
        });

        // Build the participant-facing association results.
        const associations = uniqueParticipantResponses.map(response => {
            const stats = cue.associations.get(response.normalizedWord);
            const matchingRespondents = stats?.respondentIds.size ?? 0;
            const totalRespondents = cue.totalRespondents;

            const rank =
                associationRanks.get(response.normalizedWord) ?? -1;

            const category = getCategory(
                matchingRespondents,
                totalRespondents,
                rank
            );

            highlights.push({
                cueWord: cue.cueWord,
                association: response.displayWord,
                matchingRespondents:
                    totalRespondents > 0
                        ? matchingRespondents
                        : undefined,
                totalRespondents:
                    totalRespondents > 0
                        ? totalRespondents
                        : undefined,
                category,
            });

            return {
                word: response.displayWord,
                category,
                matchingRespondents:
                    totalRespondents > 0
                        ? matchingRespondents
                        : undefined,
                totalRespondents:
                    totalRespondents > 0
                        ? totalRespondents
                        : undefined,
            };
        });

        wordAssociations.push({
            cueWord: cue.cueWord,
            associations,
        });

    });

    return {
        highlights,
        wordAssociations
    };
};

/* ---------------- Singlish score ---------------- */

const SCORE_WEIGHTS = {
    knownCues: 0.3,
    commonResponses: 0.5,
    singlishResponses: 0.2,
} as const;

const MAX_RESPONSES_PER_CUE = 3;

// Applied to the 0-1 weighted score: displayed = 100 * weighted ** exponent.
// 1 = no transform. Andrew suggested 0.5 if scores turn out too low;
// confirm against the real score distribution before settling on a value.
const SCORE_EXPONENT = 0.5;

export type SinglishScoreBand = {
    min: number;
    comment: string;
    emoji: string;
};

// Highest band first. Thresholds apply to the displayed score.
export const SINGLISH_SCORE_BANDS: SinglishScoreBand[] = [
    { min: 80, comment: "Walao eh!", emoji: "😎" },
    { min: 60, comment: "Swee lah!", emoji: "✨" },
    { min: 30, comment: "Shag bro", emoji: "😮‍💨" },
    { min: 0, comment: "Why so cui one?", emoji: "🫠" },
];

export type SinglishScore = {
    score: number;         // displayed: transformed and rounded
    weightedScore: number; // 0-100 weighted average before the exponent
    band: SinglishScoreBand;
    factors: {
        totalCues: number;
        knownCues: number;
        possibleResponses: number;
        commonResponses: number;
        singlishResponses: number;
        insufficientDataCues: number;
    };
};

/**
 * Singlish score, 0-100:
 *   0.3 x known cues / total cues
 * + 0.5 x common responses / possible responses
 * + 0.2 x Singlish responses / possible responses
 * where possible responses = 3 x total cues, then raised to SCORE_EXPONENT.
 *
 * "Common" reuses the results-page classification, so cues with too few
 * respondents ("more-data-needed") never count as common.
 * A participant with no responses at all scores exactly 0.
 */
export const buildSinglishScore = ({
    form,
    highlights,
    singlishWords,
    exponent = SCORE_EXPONENT,
}: {
    form: Form;
    highlights: HighlightCardData[];
    singlishWords: ReadonlySet<string>; // normalised with normalizeForMatch
    exponent?: number;
}): SinglishScore => {
    const cues = form.data.filter(
        item => item.question.word.trim().length > 0
    );
    const knownCues = cues.filter(item => item.isRecognisedWord);
    const knownCueWords = new Set(
        knownCues.map(item => item.question.word.trim())
    );

    const totalCues = cues.length;
    const possibleResponses = totalCues * MAX_RESPONSES_PER_CUE;

    const commonResponses = highlights.filter(
        item =>
            item.category === "common" && knownCueWords.has(item.cueWord)
    ).length;

    const insufficientDataCues = new Set(
        highlights
            .filter(
                item =>
                    item.category === "more-data-needed" &&
                    knownCueWords.has(item.cueWord)
            )
            .map(item => item.cueWord)
    ).size;

    let responsesGiven = 0;
    let singlishResponses = 0;

    knownCues.forEach(item => {
        const uniqueResponses = new Set(
            item.response.map(normalizeForMatch).filter(Boolean)
        );

        responsesGiven += uniqueResponses.size;

        uniqueResponses.forEach(response => {
            if (singlishWords.has(response)) singlishResponses += 1;
        });
    });

    const factors = {
        totalCues,
        knownCues: knownCues.length,
        possibleResponses,
        commonResponses,
        singlishResponses,
        insufficientDataCues,
    };

    const lowestBand =
        SINGLISH_SCORE_BANDS[SINGLISH_SCORE_BANDS.length - 1];

    // No responses at all: exactly 0%.
    if (totalCues === 0 || responsesGiven === 0) {
        return { score: 0, weightedScore: 0, band: lowestBand, factors };
    }

    const weighted =
        SCORE_WEIGHTS.knownCues * (knownCues.length / totalCues) +
        SCORE_WEIGHTS.commonResponses *
        (commonResponses / possibleResponses) +
        SCORE_WEIGHTS.singlishResponses *
        (singlishResponses / possibleResponses);

    const score = Math.round(100 * Math.pow(weighted, exponent));

    const band =
        SINGLISH_SCORE_BANDS.find(item => score >= item.min) ?? lowestBand;

    return { score, weightedScore: weighted * 100, band, factors };
};