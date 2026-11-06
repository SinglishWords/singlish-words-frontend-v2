
import type { Answer } from "src/types/api/answer.dto";
import type { Form } from "src/types/state/form.dto";
import type {
    HighlightCategory,
    HighlightCardData,
} from "src/components/results/HighlightCard";
import type { WordAssociationItem } from "src/components/results/WordAssociationCard";

const MIN_RESPONDENTS_FOR_CLASSIFICATION = 5;
const COMMON_THRESHOLD = 0.1;
const MAX_COMMON_RANK = 3;
const MAX_SHARE_ASSOCIATIONS = 6;

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

export type ShareAssociation = {
    cue: string;
    association: string;
    category: HighlightCategory;
    matchingRespondents: number;
    totalRespondents: number;
    isParticipantAssociation: boolean;
};

export type ResultsData = {
    highlights: HighlightCardData[];
    wordAssociations: WordAssociationItem[];
    shareAssociations: ShareAssociation[];
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
    const shareCandidates: ShareAssociation[] = [];

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

        // Record the participant's associations for this cue.
        const participantAssociationSet = new Set(
            uniqueParticipantResponses.map(
                response => response.normalizedWord
            )
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

        /**
         * Build share-card candidates from ALL associations collected
         * for this cue, not only the participant's own responses.
         *
         * This allows the card to show the wider association patterns
         * while visually distinguishing the participant's contribution.
         */
        rankedAssociations.forEach(([normalizedWord, stats]) => {
            const matchingRespondents = stats.respondentIds.size;
            const totalRespondents = cue.totalRespondents;

            // Only include associations with enough data to be useful
            // and at least two respondents contributing the association.
            if (
                totalRespondents < MIN_RESPONDENTS_FOR_CLASSIFICATION ||
                matchingRespondents < 2
            ) {
                return;
            }

            const rank = associationRanks.get(normalizedWord) ?? -1;

            shareCandidates.push({
                cue: cue.cueWord,
                association: stats.displayWord,
                category: getCategory(
                    matchingRespondents,
                    totalRespondents,
                    rank
                ),
                matchingRespondents,
                totalRespondents,
                isParticipantAssociation:
                    participantAssociationSet.has(normalizedWord),
            });
        });
    });

    /**
     * Select up to six associations for the share card.
     *
     * Priority:
     * 1. Associations contributed by the participant.
     * 2. Associations with the highest respondent frequency.
     * 3. Higher raw respondent count as a tie-breaker.
     */
    const shareAssociations = shareCandidates
        .sort((a, b) => {
            if (
                a.isParticipantAssociation !== b.isParticipantAssociation
            ) {
                return a.isParticipantAssociation ? -1 : 1;
            }

            const frequencyA =
                a.matchingRespondents / a.totalRespondents;

            const frequencyB =
                b.matchingRespondents / b.totalRespondents;

            if (frequencyA !== frequencyB) {
                return frequencyB - frequencyA;
            }

            return b.matchingRespondents - a.matchingRespondents;
        })
        .slice(0, MAX_SHARE_ASSOCIATIONS);

    return {
        highlights,
        wordAssociations,
        shareAssociations,
    };
};
