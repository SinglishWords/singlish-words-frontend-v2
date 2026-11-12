
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import { QuizPage } from "./QuizPage";
import { Form } from "src/types/state/form.dto";
import { Validator } from "src/types/state/validator.dto";

// Mock quiz data
const mockWords = [
    { id: 1, word: "shiok", enable: 1, count: 10 },
    { id: 2, word: "lah", enable: 1, count: 10 },
];

const mockRefetchWords = jest.fn();
const mockSubmitForm = jest.fn();
const mockNavigate = jest.fn();

jest.mock("src/hooks/useWords", () => ({
    useWords: () => ({
        words: mockWords.length > 0 ? mockWords : undefined,
        refetchWords: mockRefetchWords,
    }),
}));

jest.mock("src/hooks/useForm", () => ({
    useSubmitForm: () => ({
        submitForm: mockSubmitForm,
        isSubmitFormLoading: false,
    }),
}));

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

jest.mock("src/utils/logic/timeLogic", () => ({
    startTimer: jest.fn(() => 1000),
    endTimer: jest.fn(() => 5000),
    currentDateTime: jest.fn(() => "2026-11-09T00:00:00"),
}));

jest.mock("src/utils/logic/probabilityLogic", () => ({
    setFivePercentProbability: jest.fn(() => false),
}));

const initialForm: Form = {
    step: 0,
    age: "25-34",
    gender: "Male",
    education: "University",
    countryOfBirth: "Singapore",
    countryOfResidence: "Singapore",
    durationOfSgpResidence: "Lifelong",
    ethnicity: "Chinese",
    isNative: "Yes",
    languagesSpoken: ["English"],
    startTime: "2026-11-09T00:00:00",
    endTime: "",
    uuid: "test-uuid",
    data: [],
};

const formOnFinalCue: Form = {
    ...initialForm,
    data: [
        {
            question: {
                id: 99,
                progress: 1,
                word: "previous-word",
            },
            isRecognisedWord: true,
            response: ["previous-answer", "", ""],
            timeOnPage: 5,
        },
    ],
};

const initialValidator: Validator = {
    isVerified: false,
    showValidator: false,
};

const renderQuizPage = (
    form: Form = initialForm,
    validator: Validator = initialValidator
) => {
    const setForm = jest.fn();
    const setValidator = jest.fn();
    const nextStep = jest.fn();

    render(
        <QuizPage
            form={form}
            setForm={setForm}
            validator={validator}
            setValidator={setValidator}
            nextStep={nextStep}
        />
    );

    return { setForm, setValidator, nextStep };
};

const getResponseInputs = () =>
    screen.getAllByRole("textbox");

const getContinueButton = () =>
    screen.getByRole("button", { name: /continue/i });

describe("QuizPage", () => {
    beforeEach(() => {
        mockWords.splice(
            0,
            mockWords.length,
            { id: 1, word: "shiok", enable: 1, count: 10 },
            { id: 2, word: "lah", enable: 1, count: 10 }
        );

        jest.clearAllMocks();
        mockSubmitForm.mockResolvedValue(undefined);
    });

    // -----------------------------------------------
    // Response validation
    // -----------------------------------------------

    it("disables Continue when all responses are empty", () => {
        renderQuizPage();

        expect(getContinueButton()).toBeDisabled();
    });

    it("disables Continue when all responses contain only whitespace", async () => {
        const user = userEvent.setup();
        renderQuizPage();

        const inputs = getResponseInputs();

        await user.type(inputs[0], "   ");
        await user.type(inputs[1], "  ");
        await user.type(inputs[2], "    ");

        expect(getContinueButton()).toBeDisabled();
    });

    it("enables Continue when at least one meaningful response is provided", async () => {
        const user = userEvent.setup();
        renderQuizPage();

        const inputs = getResponseInputs();

        await user.type(inputs[0], "kopi");

        expect(getContinueButton()).toBeEnabled();
    });

    it("allows Continue when the participant does not recognise the word", async () => {
        const user = userEvent.setup();
        renderQuizPage();

        const unknownWordCheckbox = screen.getByRole("checkbox");

        await user.click(unknownWordCheckbox);

        expect(getContinueButton()).toBeEnabled();
    });

    // -----------------------------------------------
    // Response submission
    // -----------------------------------------------

    it("trims responses before saving them", async () => {
        const user = userEvent.setup();
        const { setForm } = renderQuizPage();

        const inputs = getResponseInputs();

        await user.type(inputs[0], "  kopi  ");
        await user.type(inputs[1], "  teh ");
        await user.click(getContinueButton());

        await waitFor(() => {
            expect(setForm).toHaveBeenCalledTimes(1);
        });

        const updatedForm = setForm.mock.calls[0][0] as Form;

        expect(updatedForm.data[0].response).toEqual([
            "kopi",
            "teh",
            "",
        ]);
    });

    // -----------------------------------------------
    // Duplicate submission prevention
    // -----------------------------------------------

    it("submits the final form only once when Continue is clicked repeatedly", async () => {
        const user = userEvent.setup();

        let resolveSubmission!: () => void;

        mockSubmitForm.mockImplementation(
            () =>
                new Promise<void>((resolve) => {
                    resolveSubmission = resolve;
                })
        );

        const { nextStep } = renderQuizPage(formOnFinalCue);

        const inputs = getResponseInputs();
        await user.type(inputs[0], "kopi");

        const continueButton = getContinueButton();

        await user.dblClick(continueButton);

        expect(mockSubmitForm).toHaveBeenCalledTimes(1);
        expect(nextStep).not.toHaveBeenCalled();

        resolveSubmission();

        await waitFor(() => {
            expect(nextStep).toHaveBeenCalledTimes(1);
        });
    });

    it("does not advance after a failed submission and allows retry", async () => {
        const user = userEvent.setup();

        mockSubmitForm
            .mockRejectedValueOnce(new Error("Network error"))
            .mockResolvedValueOnce(undefined);

        const consoleError = jest
            .spyOn(console, "error")
            .mockImplementation(() => { });

        const { nextStep } = renderQuizPage(formOnFinalCue);

        const inputs = getResponseInputs();
        await user.type(inputs[0], "kopi");

        await user.click(getContinueButton());

        await waitFor(() => {
            expect(mockSubmitForm).toHaveBeenCalledTimes(1);
        });

        expect(nextStep).not.toHaveBeenCalled();

        await user.click(getContinueButton());

        await waitFor(() => {
            expect(mockSubmitForm).toHaveBeenCalledTimes(2);
            expect(nextStep).toHaveBeenCalledTimes(1);
        });

        consoleError.mockRestore();
    });

    // -----------------------------------------------
    // Cue navigation
    // -----------------------------------------------

    it("advances to the next cue after a valid response", async () => {
        const user = userEvent.setup();
        const { setForm, nextStep } = renderQuizPage();

        const inputs = getResponseInputs();

        await user.type(inputs[0], "kopi");
        await user.click(getContinueButton());

        expect(await screen.findByText("lah")).toBeInTheDocument();
        expect(setForm).toHaveBeenCalledTimes(1);
        expect(nextStep).not.toHaveBeenCalled();
        expect(mockSubmitForm).not.toHaveBeenCalled();
    });

    it("does not process the same cue twice on a rapid double-click", async () => {
        const user = userEvent.setup();
        const { setForm, nextStep } = renderQuizPage();

        const inputs = getResponseInputs();

        await user.type(inputs[0], "kopi");

        const continueButton = getContinueButton();

        await act(async () => {
            fireEvent.click(continueButton);
            fireEvent.click(continueButton);
        });

        expect(await screen.findByText("lah")).toBeInTheDocument();

        expect(setForm).toHaveBeenCalledTimes(1);
        expect(nextStep).not.toHaveBeenCalled();
        expect(mockSubmitForm).not.toHaveBeenCalled();
    });
    it("disables all response fields when the participant does not recognise the word", async () => {
        const user = userEvent.setup();
        renderQuizPage();

        const inputs = getResponseInputs();
        const recognitionCheckbox = screen.getByRole("checkbox");

        await user.click(recognitionCheckbox);

        inputs.forEach((input) => {
            expect(input).toBeDisabled();
        });
    });

    it("re-enables response fields and clears previous answers when recognition is toggled back on", async () => {
        const user = userEvent.setup();
        renderQuizPage();

        const inputs = getResponseInputs();
        const recognitionCheckbox = screen.getByRole("checkbox");

        await user.type(inputs[0], "kopi");

        await user.click(recognitionCheckbox);

        expect(inputs[0]).toBeDisabled();

        await user.click(recognitionCheckbox);

        expect(inputs[0]).toBeEnabled();
        expect(inputs[0]).toHaveValue("");
    });

    it("disables Continue until the validator checkbox is ticked", async () => {
        const validator: Validator = {
            isVerified: false,
            showValidator: true,
        };

        const user = userEvent.setup();
        renderQuizPage(initialForm, validator);

        const inputs = getResponseInputs();
        await user.type(inputs[0], "kopi");

        expect(getContinueButton()).toBeDisabled();

        const checkboxes = screen.getAllByRole("checkbox");

        // First checkbox: word recognition.
        // Second checkbox: validator.
        await user.click(checkboxes[1]);

        expect(getContinueButton()).toBeDisabled();
    });

    it("marks the validator as verified when its checkbox is ticked", async () => {
        const validator: Validator = {
            isVerified: false,
            showValidator: true,
        };

        const user = userEvent.setup();
        const { setValidator } = renderQuizPage(initialForm, validator);

        const checkboxes = screen.getAllByRole("checkbox");

        await user.click(checkboxes[1]);

        expect(setValidator).toHaveBeenCalledWith({
            ...validator,
            isVerified: true,
        });
    });

    it("does not require validator verification when it is already verified", async () => {
        const validator: Validator = {
            isVerified: true,
            showValidator: true,
        };

        const user = userEvent.setup();
        renderQuizPage(initialForm, validator);

        const inputs = getResponseInputs();
        await user.type(inputs[0], "kopi");

        expect(getContinueButton()).toBeEnabled();
    });

    it("moves focus to the next response field when Enter is pressed", () => {
        renderQuizPage();

        const inputs = getResponseInputs();

        fireEvent.keyPress(inputs[0], {
            key: "Enter",
            charCode: 13,
        });

        expect(inputs[1]).toHaveFocus();

        fireEvent.keyPress(inputs[1], {
            key: "Enter",
            charCode: 13,
        });

        expect(inputs[2]).toHaveFocus();
    });

    it("activates Continue when Enter is pressed in the third response field", async () => {
        const user = userEvent.setup();
        const { setForm } = renderQuizPage();

        const inputs = getResponseInputs();

        await user.type(inputs[0], "kopi");

        fireEvent.keyPress(inputs[2], {
            key: "Enter",
            charCode: 13,
        });

        await waitFor(() => {
            expect(setForm).toHaveBeenCalledTimes(1);
        });
    });

    it("updates the progress indicator when moving to the next cue", async () => {
        const user = userEvent.setup();
        renderQuizPage();

        const progressBar = screen.getByRole("progressbar");

        expect(progressBar).toHaveAttribute("aria-valuenow", "0");

        const inputs = getResponseInputs();
        await user.type(inputs[0], "kopi");
        await user.click(getContinueButton());

        await waitFor(() => {
            expect(progressBar).toHaveAttribute("aria-valuenow", "50");
        });
    });

    it("fetches quiz words when the component mounts", () => {
        renderQuizPage();

        expect(mockRefetchWords).toHaveBeenCalledTimes(1);
    });

    it("shows the return-home fallback when no words are available", () => {
        mockWords.splice(0, mockWords.length);

        renderQuizPage();

        expect(screen.getByRole("progressbar")).toBeInTheDocument();

        const homeButton = screen.getByRole("button", {
            name: /return to home page/i,
        });

        expect(homeButton).toBeInTheDocument();

        fireEvent.click(homeButton);

        expect(mockNavigate).toHaveBeenCalledWith("/");
    });
});
