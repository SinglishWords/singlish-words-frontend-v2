
import { buildResultsData } from "./resultsLogic";
import type { Answer } from "src/types/api/answer.dto";
import type { Form } from "src/types/state/form.dto";

const createForm = (
    responses: string[] = ["afraid"]
): Form => ({
    step: 0,
    age: "25",
    gender: "Male",
    education: "University",
    countryOfBirth: "Singapore",
    countryOfResidence: "Singapore",
    durationOfSgpResidence: "10 years",
    ethnicity: "Chinese",
    isNative: "yes",
    languagesSpoken: ["English"],
    startTime: "",
    endTime: "",
    uuid: "test-uuid",
    data: [
        {
            question: {
                id: 1,
                progress: 1,
                word: "kiasu",
            },
            isRecognisedWord: true,
            response: responses,
            timeOnPage: 10,
        },
    ],
});

const createAnswer = (
    overrides: Partial<Answer> = {}
): Answer => ({
    id: 1,
    association1: "afraid",
    association2: "",
    association3: "",
    isRecognisedWord: 1,
    timeSpend: 10,
    questionId: 1,
    respondentId: 1,
    ...overrides,
});

describe("buildResultsData", () => {
    describe("respondent counting", () => {
        it("counts distinct respondents who supplied usable associations", () => {
            const answers = [
                createAnswer({ respondentId: 1 }),
                createAnswer({ id: 2, respondentId: 2 }),
                createAnswer({ id: 3, respondentId: 3 }),
            ];

            const result = buildResultsData(
                createForm(["afraid"]),
                answers
            );

            expect(result.highlights[0].matchingRespondents).toBe(3);
            expect(result.highlights[0].totalRespondents).toBe(3);
        });

        it("counts a respondent only once for the same association", () => {
            const answers = [
                createAnswer({
                    respondentId: 1,
                    association1: "afraid",
                    association2: "AFRAID",
                    association3: " afraid ",
                }),
                createAnswer({
                    id: 2,
                    respondentId: 2,
                    association1: "afraid",
                }),
            ];

            const result = buildResultsData(
                createForm(["afraid"]),
                answers
            );

            expect(result.highlights[0].matchingRespondents).toBe(2);
            expect(result.highlights[0].totalRespondents).toBe(2);
        });

        it("ignores answers without any non-empty associations", () => {
            const answers = [
                createAnswer({ respondentId: 1 }),
                createAnswer({
                    id: 2,
                    respondentId: 2,
                    association1: "",
                    association2: "   ",
                    association3: "",
                }),
            ];

            const result = buildResultsData(
                createForm(["afraid"]),
                answers
            );

            expect(result.highlights[0].matchingRespondents).toBe(1);
            expect(result.highlights[0].totalRespondents).toBe(1);
        });

        it("excludes unrecognized responses from both numerator and denominator", () => {
            const answers = [
                createAnswer({
                    respondentId: 1,
                    association1: "afraid",
                    isRecognisedWord: 1,
                }),
                createAnswer({
                    id: 2,
                    respondentId: 2,
                    association1: "afraid",
                    isRecognisedWord: 0,
                }),
                createAnswer({
                    id: 3,
                    respondentId: 3,
                    association1: "losing",
                    isRecognisedWord: 1,
                }),
            ];

            const result = buildResultsData(
                createForm(["afraid"]),
                answers
            );

            expect(result.highlights[0].matchingRespondents).toBe(1);
            expect(result.highlights[0].totalRespondents).toBe(2);
            expect(result.highlights[0].category).toBe("more-data-needed");
        });
    });

    describe("association normalization", () => {
        it("matches associations regardless of case and surrounding spaces", () => {
            const answers = [
                createAnswer({
                    respondentId: 1,
                    association1: "Kiasu",
                }),
                createAnswer({
                    id: 2,
                    respondentId: 2,
                    association1: " kiasu ",
                }),
                createAnswer({
                    id: 3,
                    respondentId: 3,
                    association1: "KIASU",
                }),
            ];

            const result = buildResultsData(
                createForm([" kiasu "]),
                answers
            );

            expect(result.highlights[0].matchingRespondents).toBe(3);
        });

        it("does not combine associations belonging to different cues", () => {
            const form = createForm(["afraid"]);

            form.data.push({
                question: {
                    id: 2,
                    progress: 2,
                    word: "shiok",
                },
                isRecognisedWord: true,
                response: ["happy"],
                timeOnPage: 10,
            });

            const answers = [
                createAnswer({
                    respondentId: 1,
                    questionId: 1,
                    association1: "afraid",
                }),
                createAnswer({
                    id: 2,
                    respondentId: 2,
                    questionId: 2,
                    association1: "happy",
                }),
            ];

            const result = buildResultsData(form, answers);

            expect(result.wordAssociations).toHaveLength(2);
            expect(result.wordAssociations[0].associations[0].word)
                .toBe("afraid");
            expect(result.wordAssociations[1].associations[0].word)
                .toBe("happy");
        });
    });

    describe("classification", () => {
        it("requires at least five usable respondents", () => {
            const answers = Array.from(
                { length: 4 },
                (_, index) =>
                    createAnswer({
                        id: index + 1,
                        respondentId: index + 1,
                    })
            );

            const result = buildResultsData(
                createForm(["afraid"]),
                answers
            );

            expect(result.highlights[0].category)
                .toBe("more-data-needed");
        });

        it("allows classification when there are exactly five usable respondents", () => {
            const answers = Array.from(
                { length: 5 },
                (_, index) =>
                    createAnswer({
                        id: index + 1,
                        respondentId: index + 1,
                    })
            );

            const result = buildResultsData(
                createForm(["afraid"]),
                answers
            );

            expect(result.highlights[0].category)
                .toBe("common");
        });

        it("classifies an association supplied by only one respondent as distinctive", () => {
            const answers = [
                createAnswer({
                    respondentId: 1,
                    association1: "afraid",
                }),
                createAnswer({
                    id: 2,
                    respondentId: 2,
                    association1: "losing",
                }),
                createAnswer({
                    id: 3,
                    respondentId: 3,
                    association1: "losing",
                }),
                createAnswer({
                    id: 4,
                    respondentId: 4,
                    association1: "losing",
                }),
                createAnswer({
                    id: 5,
                    respondentId: 5,
                    association1: "losing",
                }),
            ];

            const result = buildResultsData(
                createForm(["afraid"]),
                answers
            );

            expect(result.highlights[0].category)
                .toBe("distinctive");
        });
    });

    describe("participant responses", () => {
        it("removes duplicate participant associations", () => {
            const result = buildResultsData(
                createForm(["afraid", "AFRAID", " afraid "]),
                [
                    createAnswer({
                        respondentId: 1,
                        association1: "afraid",
                    }),
                ]
            );

            expect(result.highlights).toHaveLength(1);
            expect(result.wordAssociations[0].associations)
                .toHaveLength(1);
        });

        it("preserves the participant's original display text", () => {
            const result = buildResultsData(
                createForm(["  Afraid  "]),
                [
                    createAnswer({
                        respondentId: 1,
                        association1: "afraid",
                    }),
                ]
            );

            expect(result.highlights[0].association).toBe("Afraid");
        });
    });

    describe("share associations", () => {
        it("limits share associations to six", () => {
            const words = [
                "afraid",
                "losing",
                "competitive",
                "selfish",
                "anxious",
                "greedy",
                "ambitious",
                "worried",
            ];

            const answers = words.map((word, index) =>
                createAnswer({
                    id: index + 1,
                    respondentId: index + 1,
                    association1: word,
                })
            );

            const result = buildResultsData(
                createForm(["afraid"]),
                answers
            );

            expect(result.shareAssociations.length).toBeLessThanOrEqual(6);
        });

        it("returns no share associations when the participant supplied no associations", () => {
            const result = buildResultsData(
                createForm([]),
                [
                    createAnswer({
                        respondentId: 1,
                        association1: "afraid",
                    }),
                ]
            );

            expect(result.shareAssociations).toHaveLength(0);
        });
    });


    describe("classification boundaries", () => {
        it("classifies an association as common at exactly 10% frequency", () => {
            // 2 out of 20 respondents = exactly 10%.
            const answers = [
                createAnswer({
                    id: 1,
                    respondentId: 1,
                    association1: "afraid",
                }),
                createAnswer({
                    id: 2,
                    respondentId: 2,
                    association1: "afraid",
                }),
                ...Array.from({ length: 18 }, (_, index) =>
                    createAnswer({
                        id: index + 3,
                        respondentId: index + 3,
                        association1: `other-${index}`,
                    })
                ),
            ];

            const result = buildResultsData(
                createForm(["afraid"]),
                answers
            );

            expect(result.highlights[0].matchingRespondents).toBe(2);
            expect(result.highlights[0].totalRespondents).toBe(20);
            expect(result.highlights[0].category).toBe("common");
        });

        it("classifies an association below 10% as less-common", () => {
            // 2 out of 21 respondents = approximately 9.52%.
            const answers = [
                createAnswer({
                    id: 1,
                    respondentId: 1,
                    association1: "afraid",
                }),
                createAnswer({
                    id: 2,
                    respondentId: 2,
                    association1: "afraid",
                }),
                ...Array.from({ length: 19 }, (_, index) =>
                    createAnswer({
                        id: index + 3,
                        respondentId: index + 3,
                        association1: `other-${index}`,
                    })
                ),
            ];

            const result = buildResultsData(
                createForm(["afraid"]),
                answers
            );

            expect(result.highlights[0].matchingRespondents).toBe(2);
            expect(result.highlights[0].totalRespondents).toBe(21);
            expect(result.highlights[0].category).toBe("less-common");
        });

        it("does not classify an association outside the top three as common", () => {
            const answers: Answer[] = [];

            const words = ["alpha", "bravo", "charlie", "zebra"];

            // Each association has exactly two respondents.
            words.forEach((word, wordIndex) => {
                answers.push(
                    createAnswer({
                        id: wordIndex * 2 + 1,
                        respondentId: wordIndex * 2 + 1,
                        association1: word,
                    }),
                    createAnswer({
                        id: wordIndex * 2 + 2,
                        respondentId: wordIndex * 2 + 2,
                        association1: word,
                    })
                );
            });

            // Add 12 respondents with unique associations.
            for (let i = 0; i < 12; i++) {
                answers.push(
                    createAnswer({
                        id: i + 9,
                        respondentId: i + 9,
                        association1: `other-${i}`,
                    })
                );
            }

            const result = buildResultsData(
                createForm(["zebra"]),
                answers
            );

            // All four associations have equal frequency.
            // Alphabetical ordering places zebra fourth.
            expect(result.highlights[0].matchingRespondents).toBe(2);
            expect(result.highlights[0].totalRespondents).toBe(20);
            expect(result.highlights[0].category).toBe("less-common");
        });
    });


    describe("respondent deduplication", () => {
        it("counts a respondent only once in the total even when multiple answer records exist", () => {
            const answers = [
                createAnswer({
                    id: 1,
                    respondentId: 1,
                    association1: "afraid",
                }),
                createAnswer({
                    id: 2,
                    respondentId: 1,
                    association1: "losing",
                }),
                createAnswer({
                    id: 3,
                    respondentId: 2,
                    association1: "afraid",
                }),
                createAnswer({
                    id: 4,
                    respondentId: 3,
                    association1: "losing",
                }),
                createAnswer({
                    id: 5,
                    respondentId: 4,
                    association1: "losing",
                }),
                createAnswer({
                    id: 6,
                    respondentId: 5,
                    association1: "losing",
                }),
            ];

            const result = buildResultsData(
                createForm(["afraid"]),
                answers
            );

            // Respondents 1, 2, 3, 4 and 5 = 5 distinct respondents.
            expect(result.highlights[0].totalRespondents).toBe(5);
            expect(result.highlights[0].matchingRespondents).toBe(2);
        });

        it("does not count an unrecognized response even if it has multiple associations", () => {
            const answers = [
                createAnswer({
                    respondentId: 1,
                    association1: "afraid",
                    association2: "losing",
                    isRecognisedWord: 1,
                }),
                createAnswer({
                    respondentId: 2,
                    association1: "afraid",
                    association2: "losing",
                    association3: "competitive",
                    isRecognisedWord: 0,
                }),
            ];

            const result = buildResultsData(
                createForm(["afraid"]),
                answers
            );

            expect(result.highlights[0].matchingRespondents).toBe(1);
            expect(result.highlights[0].totalRespondents).toBe(1);
        });
    });


    describe("share association selection", () => {
        it("limits the share card to six associations", () => {
            const words = [
                "afraid",
                "losing",
                "competitive",
                "selfish",
                "anxious",
                "greedy",
                "ambitious",
                "worried",
            ];

            const answers = words.map((word, index) =>
                createAnswer({
                    id: index + 1,
                    respondentId: index + 1,
                    association1: word,
                })
            );

            const result = buildResultsData(
                createForm(["afraid", "losing"]),
                answers
            );

            expect(result.shareAssociations).toHaveLength(6);
        });

        it("prioritizes the participant's own associations on the share card", () => {
            const words = [
                "afraid",
                "losing",
                "competitive",
                "selfish",
                "anxious",
                "greedy",
                "ambitious",
            ];

            const answers = words.map((word, index) =>
                createAnswer({
                    id: index + 1,
                    respondentId: index + 1,
                    association1: word,
                })
            );

            const result = buildResultsData(
                createForm(["afraid", "losing"]),
                answers
            );

            expect(
                result.shareAssociations
                    .slice(0, 2)
                    .map(item => item.association)
            ).toEqual(["afraid", "losing"]);

            expect(result.shareAssociations).toHaveLength(6);
        });

        it("selects the cue with the most distinct associations", () => {
            const form = createForm(["afraid"]);

            form.data.push({
                question: {
                    id: 2,
                    progress: 2,
                    word: "shiok",
                },
                isRecognisedWord: true,
                response: ["happy"],
                timeOnPage: 10,
            });

            const answers = [
                createAnswer({
                    id: 1,
                    respondentId: 1,
                    questionId: 1,
                    association1: "afraid",
                }),
                createAnswer({
                    id: 2,
                    respondentId: 2,
                    questionId: 1,
                    association1: "losing",
                }),

                createAnswer({
                    id: 3,
                    respondentId: 3,
                    questionId: 2,
                    association1: "happy",
                }),
                createAnswer({
                    id: 4,
                    respondentId: 4,
                    questionId: 2,
                    association1: "good",
                }),
                createAnswer({
                    id: 5,
                    respondentId: 5,
                    questionId: 2,
                    association1: "excellent",
                }),
                createAnswer({
                    id: 6,
                    respondentId: 6,
                    questionId: 2,
                    association1: "amazing",
                }),
            ];

            const result = buildResultsData(form, answers);

            expect(result.shareAssociations.length).toBeGreaterThan(0);

            expect(
                result.shareAssociations.every(item => item.cue === "shiok")
            ).toBe(true);
        });
    });


    describe("empty and incomplete data", () => {
        it("handles an empty API response without throwing", () => {
            const result = buildResultsData(
                createForm(["afraid"]),
                []
            );

            expect(result.highlights).toHaveLength(1);

            expect(result.highlights[0].category)
                .toBe("more-data-needed");

            expect(result.highlights[0].matchingRespondents)
                .toBeUndefined();

            expect(result.highlights[0].totalRespondents)
                .toBeUndefined();
        });

        it("keeps the participant's own association in the share card when their API record is missing", () => {
            const result = buildResultsData(
                createForm(["afraid"]),
                []
            );

            expect(result.shareAssociations).toHaveLength(1);

            expect(result.shareAssociations[0].association)
                .toBe("afraid");

            expect(result.shareAssociations[0].isParticipantAssociation)
                .toBe(true);
        });
    });

});
