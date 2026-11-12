
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { EmailPageV2 } from "./EmailPageV2";
import { Form } from "src/types/state/form.dto";
import { Validator } from "src/types/state/validator.dto";
import { Answer } from "src/types/api/answer.dto";
import { fetchAllAnswers } from "src/services/ApiService";
import { currentDateTime } from "src/utils/logic/timeLogic";
import { setFivePercentProbability } from "src/utils/logic/probabilityLogic";

// --------------------------------------------------
// Mocks
// --------------------------------------------------

const mockNavigate = jest.fn();

jest.mock("src/utils/logic/timeLogic", () => ({
    currentDateTime: jest.fn(),
}));

jest.mock("src/utils/logic/probabilityLogic", () => ({
    setFivePercentProbability: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

jest.mock("src/services/ApiService", () => ({
    fetchAllAnswers: jest.fn(),
}));

jest.mock("src/components/results/HighlightSection", () => ({
    HighlightSection: ({ highlights }: any) => (
        <div data-testid="highlight-section">
            {JSON.stringify(highlights)}
        </div>
    ),
}));

jest.mock("src/components/results/WordAssociationsSection", () => ({
    WordAssociationsSection: ({ words }: any) => (
        <div data-testid="word-associations-section">
            {JSON.stringify(words)}
        </div>
    ),
}));

jest.mock("src/components/results/ResultsExplanation", () => ({
    ResultsExplanation: () => (
        <div data-testid="results-explanation" />
    ),
}));

jest.mock("src/components/results/ShareContribution", () => ({
    __esModule: true,
    default: ({
        shareAssociations,
        associationsContributed,
        cueWordsExplored,
    }: any) => (
        <div data-testid="share-contribution">
            {JSON.stringify({
                shareAssociations,
                associationsContributed,
                cueWordsExplored,
            })}
        </div>
    ),
}));

jest.mock("src/components/results/ResearchInfoSection", () => ({
    ResearchInfoSection: ({
        onParticipateAgain,
        onReturnHome,
    }: any) => (
        <div data-testid="research-info-section">
            <button onClick={onParticipateAgain}>
                Research Participate Again
            </button>
            <button onClick={onReturnHome}>
                Research Return Home
            </button>
        </div>
    ),
}));

// --------------------------------------------------
// Fixtures
// --------------------------------------------------

const initialForm: Form = {
    step: 3,
    age: "25-34",
    gender: "Male",
    education: "University",
    countryOfBirth: "Singapore",
    countryOfResidence: "Singapore",
    durationOfSgpResidence: "Lifelong",
    ethnicity: "Chinese",
    isNative: "Yes",
    languagesSpoken: ["English"],
    startTime: "2026-11-09T09:00:00",
    endTime: "2026-11-09T09:30:00",
    uuid: "test-uuid",
    data: [
        {
            question: {
                id: 1,
                progress: 1,
                word: "shiok",
            },
            isRecognisedWord: true,
            response: [" happy ", "joy", "   "],
            timeOnPage: 5,
        },
        {
            question: {
                id: 2,
                progress: 2,
                word: "lah",
            },
            isRecognisedWord: true,
            response: ["excited", "", ""],
            timeOnPage: 5,
        },
        {
            question: {
                id: 3,
                progress: 3,
                word: "blur",
            },
            isRecognisedWord: false,
            response: ["", "", ""],
            timeOnPage: 5,
        },
    ],
};

const initialValidator: Validator = {
    isVerified: true,
    showValidator: false,
};

// Five distinct respondents for each cue.
// The participant's own responses are included in the study data.

const createAnswers = (): Answer[] => {
    const answers: Answer[] = [];

    const cueOneAssociations = [
        ["happy", "joy", ""],
        ["happy", "excited", ""],
        ["happy", "joy", ""],
        ["happy", "good", ""],
        ["sad", "joy", ""],
    ];

    const cueTwoAssociations = [
        ["excited", "casual", ""],
        ["casual", "relaxed", ""],
        ["excited", "relaxed", ""],
        ["casual", "happy", ""],
        ["excited", "happy", ""],
    ];

    [cueOneAssociations, cueTwoAssociations].forEach(
        (associations, cueIndex) => {
            associations.forEach((values, respondentIndex) => {
                answers.push({
                    id: answers.length + 1,
                    association1: values[0],
                    association2: values[1],
                    association3: values[2],
                    isRecognisedWord: 1,
                    timeSpend: 5,
                    questionId: cueIndex + 1,
                    respondentId: respondentIndex + 1,
                });
            });
        }
    );

    return answers;
};

const renderResultsPage = (
    form: Form = initialForm,
    validator: Validator = initialValidator
) => {
    const setForm = jest.fn();
    const setValidator = jest.fn();

    render(
        <EmailPageV2
            form={form}
            setForm={setForm}
            setValidator={setValidator}
        />
    );

    return { setForm, setValidator };
};

// --------------------------------------------------
// Tests
// --------------------------------------------------

describe("EmailPageV2", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (currentDateTime as jest.Mock).mockReturnValue(
            "2026-11-09T10:00:00"
        );

        (setFivePercentProbability as jest.Mock).mockReturnValue(true);

        (fetchAllAnswers as jest.Mock).mockResolvedValue(createAnswers());
    });

    // -----------------------------------------------
    // Initial rendering and API behaviour
    // -----------------------------------------------

    it("renders the results page heading and main sections", async () => {
        renderResultsPage();

        expect(
            screen.getByText("Thank you for contributing!")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Want to explore more words?")
        ).toBeInTheDocument();

        expect(
            screen.getByTestId("highlight-section")
        ).toBeInTheDocument();

        expect(
            screen.getByTestId("word-associations-section")
        ).toBeInTheDocument();

        expect(
            screen.getByTestId("share-contribution")
        ).toBeInTheDocument();

        expect(
            screen.getByTestId("results-explanation")
        ).toBeInTheDocument();

        expect(
            screen.getByTestId("research-info-section")
        ).toBeInTheDocument();
    });

    it("fetches all study answers when the page mounts", async () => {
        renderResultsPage();

        await waitFor(() => {
            expect(fetchAllAnswers).toHaveBeenCalledTimes(1);
        });
    });

    it("handles an API failure and displays an error message", async () => {
        const consoleError = jest
            .spyOn(console, "error")
            .mockImplementation(() => { });

        (fetchAllAnswers as jest.Mock).mockRejectedValueOnce(
            new Error("Network error")
        );

        renderResultsPage();

        expect(
            await screen.findByText(
                "Unable to load study statistics."
            )
        ).toBeInTheDocument();

        consoleError.mockRestore();
    });

    it("renders successfully when the API returns no answers", async () => {
        (fetchAllAnswers as jest.Mock).mockResolvedValueOnce([]);

        renderResultsPage();

        await waitFor(() => {
            expect(fetchAllAnswers).toHaveBeenCalledTimes(1);
        });

        expect(
            screen.getByText("Thank you for contributing!")
        ).toBeInTheDocument();

        expect(
            screen.getByTestId("highlight-section")
        ).toBeInTheDocument();
    });

    // -----------------------------------------------
    // Participant contribution statistics
    // -----------------------------------------------

    it("calculates the number of non-empty associations contributed", async () => {
        renderResultsPage();

        await waitFor(() => {
            expect(
                screen.getByText("associations contributed")
            ).toBeInTheDocument();
        });

        // "happy", "joy", and "excited".
        expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("counts distinct cue words with at least one response", () => {
        renderResultsPage();

        // "shiok" and "lah" have responses.
        // "blur" has none.
        expect(screen.getByText("2")).toBeInTheDocument();

        expect(
            screen.getByText("cue words explored")
        ).toBeInTheDocument();
    });

    // -----------------------------------------------
    // Results data passed to child components
    // -----------------------------------------------

    it("passes the calculated highlights to HighlightSection", async () => {
        renderResultsPage();

        await waitFor(() => {
            const section = screen.getByTestId("highlight-section");

            expect(section.textContent).toContain("shiok");
            expect(section.textContent).toContain("happy");
        });
    });

    it("passes cue-by-cue associations to WordAssociationsSection", async () => {
        renderResultsPage();

        await waitFor(() => {
            const section = screen.getByTestId(
                "word-associations-section"
            );

            expect(section.textContent).toContain("shiok");
            expect(section.textContent).toContain("happy");
            expect(section.textContent).toContain("lah");
            expect(section.textContent).toContain("excited");
        });
    });

    it("passes the contribution statistics and share associations to ShareContribution", async () => {
        renderResultsPage();

        await waitFor(() => {
            const shareCard = screen.getByTestId("share-contribution");

            expect(shareCard.textContent).toContain(
                '"associationsContributed":3'
            );

            expect(shareCard.textContent).toContain(
                '"cueWordsExplored":2'
            );

            expect(shareCard.textContent).toContain("happy");
            expect(shareCard.textContent).toContain("excited");
        });
    });

    // -----------------------------------------------
    // Participate Again
    // -----------------------------------------------

    it("resets survey form data when Participate Again is selected", async () => {
        const user = userEvent.setup();
        const { setForm } = renderResultsPage();

        await user.click(
            screen.getByRole("button", {
                name: "Participate Again",
            })
        );

        expect(setForm).toHaveBeenCalledWith({
            ...initialForm,
            step: 1,
            startTime: "2026-11-09T10:00:00",
            endTime: "",
            data: [],
        });
    });

    it("resets validator state when Participate Again is selected", async () => {
        const user = userEvent.setup();
        const { setValidator } = renderResultsPage();

        await user.click(
            screen.getByRole("button", {
                name: "Participate Again",
            })
        );

        expect(setValidator).toHaveBeenCalledWith({
            isVerified: false,
            showValidator: true,
        });

        expect(setFivePercentProbability).toHaveBeenCalledTimes(1);
    });

    // -----------------------------------------------
    // Navigation
    // -----------------------------------------------

    it("navigates home when the return-home action is selected", async () => {
        const user = userEvent.setup();

        renderResultsPage();

        await user.click(
            screen.getByRole("button", {
                name: "Research Return Home",
            })
        );

        expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("does not navigate when the page is initially rendered", () => {
        renderResultsPage();

        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
