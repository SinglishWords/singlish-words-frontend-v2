
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Container,
    Stack,
    Typography,
} from "@mui/material";

import { Form } from "src/types/state/form.dto";
import { Validator } from "src/types/state/validator.dto";
import { currentDateTime } from "src/utils/logic/timeLogic";
import { setFivePercentProbability } from "src/utils/logic/probabilityLogic";
import { HighlightSection } from "src/components/results/HighlightSection";
import { WordAssociationsSection } from "src/components/results/WordAssociationsSection";
import { ResultsExplanation } from "src/components/results/ResultsExplanation";
import { ResearchInfoSection } from "src/components/results/ResearchInfoSection";
import ShareContribution from "src/components/results/ShareContribution";
import NUSLogo from "src/assets/images/NUS_Logo.png";
import { useEffect, useMemo, useState } from "react";
import type { Answer } from "src/types/api/answer.dto";
import { fetchAllAnswers, fetchDirectForwardAssociations, fetchDirectBackwardAssociations, } from "src/services/ApiService";
import { buildResultsData } from "src/utils/logic/resultsLogic";
import type { GetDirectAssociationsRes } from "src/types/api/association.dto";
import { buildShareCloudCandidate } from "src/utils/logic/resultsLogic";

type EmailPageV2Props = {
    form: Form;
    setForm: React.Dispatch<React.SetStateAction<Form>>;
    setValidator: React.Dispatch<React.SetStateAction<Validator>>;
};

/*
 * TEMPORARY MOCK DATA
 *
 * These values are only for building the UI.
 *
 * Later:
 * - associationsContributed: derived from form.data
 * - cueWordsExplored: derived from form.data.length
 * - sharedWithOthers: derived from sharing functionality / actual metrics
 *
 * Do not use these hardcoded values in the final production version.
 */

/*
 * Contribution statistics card.
 *
 * Kept as a separate component so that we can reuse the same
 * visual style for other metrics in the future.
 */
type StatCardProps = {
    value: number | string;
    label: string;
};

type DirectAssociationsByCue = Record<string,
    {
        forward: GetDirectAssociationsRes;
        backward: GetDirectAssociationsRes;
    }
>;

const StatCard = ({ value, label }: StatCardProps) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                px: 1.75,
                py: 1,

                // Take the full available width on mobile.
                width: { xs: "100%", sm: "auto" },

                // Never allow the card to exceed its parent.
                maxWidth: "100%",
                minWidth: 0,
                boxSizing: "border-box",

                border: "1px solid #D9E6F5",
                borderRadius: 2,
                bgcolor: "#FFFFFF",
            }}
        >
            <Typography
                variant="h5"
                sx={{
                    fontWeight: 700,
                    color: "#123F73",
                    lineHeight: 1,
                    flexShrink: 0,
                }}
            >
                {value}
            </Typography>

            <Typography
                variant="body2"
                sx={{
                    color: "#344966",
                    fontSize: 13,
                    textAlign: "left",
                    overflowWrap: "anywhere",
                }}
            >
                {label}
            </Typography>
        </Box>
    );
};

export const EmailPageV2 = ({
    form,
    setForm,
    setValidator,
}: EmailPageV2Props) => {
    const navigate = useNavigate();

    const participantCueWords = useMemo(() => {
        const cueWords = form.data
            .filter(item =>
                item.question.word.trim().length > 0 &&
                item.response.some(response => response.trim().length > 0)
            )
            .map(item => item.question.word.trim());

        // Deduplicate cues case-insensitively while preserving
        // the original display form of the first occurrence.
        const uniqueCueWords = new Map<string, string>();

        cueWords.forEach(word => {
            const normalizedWord = word.toLowerCase();

            if (!uniqueCueWords.has(normalizedWord)) {
                uniqueCueWords.set(normalizedWord, word);
            }
        });

        return Array.from(uniqueCueWords.values());
    }, [form.data]);

    // All previously submitted answers retrieved from the backend.
    const [allAnswers, setAllAnswers] = useState<Answer[]>([]);
    const [isLoadingAnswers, setIsLoadingAnswers] = useState(true);
    const [answersError, setAnswersError] = useState<string | null>(null);
    const [directAssociationsByCue, setDirectAssociationsByCue] = useState<DirectAssociationsByCue>({});
    const [isLoadingDirectAssociations, setIsLoadingDirectAssociations] = useState(true);
    const [directAssociationsError, setDirectAssociationsError] = useState<string | null>(null);

    // Fetch the study-wide answer dataset.
    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                setIsLoadingAnswers(true);
                setAnswersError(null);

                const answers: Answer[] = await fetchAllAnswers();

                if (isMounted) {
                    setAllAnswers(answers);
                }
            } catch (error) {
                console.error("Error fetching answers:", error);

                if (isMounted) {
                    setAnswersError("Unable to load study statistics.");
                }
            } finally {
                if (isMounted) {
                    setIsLoadingAnswers(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        let isMounted = true;

        const fetchAssociations = async () => {
            if (participantCueWords.length === 0) {
                setDirectAssociationsByCue({});
                setIsLoadingDirectAssociations(false);
                setDirectAssociationsError(null);
                return;
            }

            try {
                setIsLoadingDirectAssociations(true);
                setDirectAssociationsError(null);

                const results = await Promise.all(
                    participantCueWords.map(async cueWord => {
                        const [forward, backward] = await Promise.all([
                            fetchDirectForwardAssociations(cueWord),
                            fetchDirectBackwardAssociations(cueWord),
                        ]);

                        return {
                            cue: cueWord.toLowerCase(),
                            forward,
                            backward,
                        };
                    })
                );

                if (isMounted) {
                    const associationsByCue: DirectAssociationsByCue = {};

                    results.forEach(result => {
                        associationsByCue[result.cue] = {
                            forward: result.forward,
                            backward: result.backward,
                        };
                    });

                    setDirectAssociationsByCue(associationsByCue);
                }
            } catch (error) {
                console.error(
                    "Error fetching direct associations:",
                    error
                );

                if (isMounted) {
                    setDirectAssociationsError(
                        "Unable to load association data."
                    );
                }
            } finally {
                if (isMounted) {
                    setIsLoadingDirectAssociations(false);
                }
            }
        };

        fetchAssociations();

        return () => {
            isMounted = false;
        };
    }, [participantCueWords]);

    useEffect(() => {
        console.log(
            "Direct associations by cue:",
            directAssociationsByCue
        );
    }, [directAssociationsByCue]);

    // Count every non-empty association submitted by the participant.
    const associationsContributed = useMemo(() => {
        return form.data.reduce((total, item) => {
            return total + item.response.filter(
                response => response.trim().length > 0
            ).length;
        }, 0);
    }, [form.data]);

    // Count distinct cue words for which the participant gave
    // at least one non-empty response.
    const cueWordsExplored = useMemo(() => {
        const answeredCueWords = form.data
            .filter(item =>
                item.question.word.trim().length > 0 &&
                item.response.some(response => response.trim().length > 0)
            )
            .map(item => item.question.word.trim().toLowerCase());

        return new Set(answeredCueWords).size;
    }, [form.data]);



    const resultsData = useMemo(
        () => buildResultsData(form, allAnswers),
        [form, allAnswers]
    );

    const shareCloudCandidate = useMemo(
        () => buildShareCloudCandidate(
            form,
            directAssociationsByCue
        ),
        [form, directAssociationsByCue]
    );

    console.log("[Selected Share Cloud Candidate]", shareCloudCandidate);

    const sharedWithOthers = useMemo(() => {
        return resultsData.highlights.filter(
            highlight => (highlight.matchingRespondents ?? 0) > 1
        ).length;
    }, [resultsData.highlights]);

    const shareAssociationsForCard = resultsData.shareAssociations;

    /*
     * Reset the survey state when the participant chooses
     * to participate again.
     *
     * This preserves the behaviour of the existing EmailPage.
     */
    const handleParticipateAgain = () => {
        setForm({
            ...form,
            step: 1,
            startTime: currentDateTime(),
            endTime: "",
            data: [],
        });

        setValidator({
            isVerified: false,
            showValidator: setFivePercentProbability(),
        });
    };

    /*
     * Navigate back to the application's home page.
     */
    const handleReturnHome = () => {
        navigate("/");
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "#F6F9FD",
                color: "#183B63",
                pb: 6,
            }}
        >

            {/* ================================================
    SECTION 1: NUS HEADER
    ================================================ */}


            <Box
                component="header"
                sx={{
                    bgcolor: "#FFFFFF",
                    borderBottom: "1px solid #DFE8F2",
                }}
            >
                <Container maxWidth="xl">
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{
                            minHeight: { xs: 76, sm: 88, md: 96 },
                            py: { xs: 1, sm: 1.25 },
                            gap: { xs: 1, sm: 2 },
                        }}
                    >
                        {/* NUS branding */}
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={{ xs: 1, sm: 1.5, md: 2 }}
                            sx={{
                                flex: 1,
                                minWidth: 0,
                            }}
                        >
                            <Box
                                component="img"
                                src={NUSLogo}
                                alt="National University of Singapore"
                                sx={{
                                    display: "block",
                                    width: { xs: 90, sm: 115, md: 130 },
                                    height: "auto",
                                    maxHeight: { xs: 56, sm: 68, md: 76 },
                                    objectFit: "contain",
                                    flexShrink: 0,
                                }}
                            />

                            <Box sx={{ minWidth: 0 }}>
                                <Typography
                                    sx={{
                                        fontSize: { xs: 16, sm: 20, md: 24 },
                                        fontWeight: 600,
                                        color: "primary.main",
                                        lineHeight: 1.2,
                                        mb: 0.35,
                                    }}
                                >
                                    A Small World of Singlish Words:
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: { xs: 13, sm: 15, md: 18 },
                                        fontWeight: 600,
                                        color: "primary.main",
                                        lineHeight: 1.2,
                                    }}
                                >
                                    A Word Association Study
                                </Typography>
                            </Box>
                        </Stack>

                        {/* Header navigation */}
                        <Stack
                            direction="row"
                            spacing={{ xs: 0.25, md: 1 }}
                            alignItems="center"
                            sx={{
                                display: { xs: "none", sm: "flex" },
                                flexShrink: 0,
                            }}
                        >
                            <Button
                                variant="text"
                                href="#research-information"
                                sx={{
                                    color: "primary.main",
                                    fontWeight: 600,
                                    textTransform: "none",
                                    whiteSpace: "nowrap",
                                    fontSize: { sm: 12, md: 14 },
                                    px: { sm: 1, md: 1.5 },
                                }}
                            >
                                About the study
                            </Button>

                            <Button
                                variant="outlined"
                                href="#share-section"
                                sx={{
                                    borderRadius: 2,
                                    borderColor: "primary.main",
                                    color: "primary.main",
                                    fontWeight: 600,
                                    textTransform: "none",
                                    whiteSpace: "nowrap",
                                    fontSize: { sm: 12, md: 14 },
                                    px: { sm: 1.5, md: 2 },
                                    py: 0.65,
                                }}
                            >
                                Share the study
                            </Button>
                        </Stack>
                    </Stack>
                </Container>
            </Box>



            {/* ================================================
          MAIN PAGE CONTENT
          ================================================ */}

            <Container
                maxWidth="xl"
                sx={{
                    pt: { xs: 2, sm: 3 },
                }}
            >
                <Stack spacing={{ xs: 3, sm: 4 }}>

                    {/* ================================================
              SECTION 2: CONTRIBUTION HERO
              ================================================ */}

                    {/* ================================================
    SECTION 2: CONTRIBUTION HERO
    ================================================ */}

                    <Box
                        sx={{
                            p: { xs: 2, sm: 3.5 },
                            border: "1px solid #DCE8F6",
                            borderRadius: 3,
                            background:
                                "linear-gradient(110deg, #EFF6FE 0%, #FFFFFF 75%)",
                            boxSizing: "border-box",
                            width: "100%",
                            minWidth: 0,
                            overflow: "hidden",
                        }}
                    >
                        <Stack
                            direction={{ xs: "column", md: "row" }}
                            spacing={{ xs: 2, md: 3 }}
                            alignItems="center"
                        >
                            {/* Thank-you message and statistics */}
                            <Box
                                sx={{
                                    flex: 1,
                                    width: "100%",
                                    minWidth: 0,
                                }}
                            >
                                <Stack spacing={1.5}>
                                    <Typography
                                        // variant="h3"
                                        sx={{
                                            fontSize: {
                                                xs: 27,
                                                sm: 34,
                                                md: 38,
                                            },
                                            fontWeight: 700,
                                            color: "#123F73",
                                            lineHeight: 1.15,
                                            textAlign: "left",
                                            overflowWrap: "break-word",
                                        }}
                                    >
                                        Thank you for contributing!
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: { xs: 14, sm: 16 },
                                            color: "#617D9F",
                                            textAlign: "left",
                                            lineHeight: 1.5,
                                        }}
                                    >
                                        Your responses help us map the mental lexicon
                                        of Singapore English.
                                    </Typography>

                                    {/* Responsive contribution statistics */}
                                    <Stack
                                        direction={{ xs: "column", sm: "row" }}
                                        spacing={1.25}
                                        sx={{
                                            pt: 0.5,
                                            width: "100%",
                                            alignItems: "stretch",
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        <StatCard
                                            value={associationsContributed}
                                            label="associations contributed"
                                        />

                                        <StatCard
                                            value={cueWordsExplored}
                                            label="cue words explored"
                                        />

                                        {sharedWithOthers > 0 && (
                                            <StatCard
                                                value={sharedWithOthers}
                                                label="associations shared with others"
                                            />
                                        )}
                                    </Stack>

                                    {answersError && (
                                        <Typography variant="caption" color="error">
                                            {answersError}
                                        </Typography>
                                    )}

                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: "#7187A2",
                                            pt: 0.5,
                                            textAlign: "left",
                                        }}
                                    >
                                    </Typography>
                                </Stack>
                            </Box>

                            {/* Singapore skyline illustration */}
                            {/* <Box
                                sx={{
                                    width: { md: "15%" },
                                    display: { xs: "none", md: "flex" },
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexShrink: 0,
                                }}
                            >
                                <Box
                                    component="img"
                                    src={singaporeSkyline}
                                    alt="Singapore skyline"
                                    sx={{
                                        display: "block",
                                        width: "100%",
                                        maxWidth: 350,
                                        height: "auto",
                                        objectFit: "contain",
                                    }}
                                />
                            </Box> */}
                        </Stack>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            textAlign: "center",
                            gap: 1.5,
                            py: { xs: 3, md: 4 },
                            px: 2,
                        }}
                    >
                        <Typography variant="h6" fontWeight={600}>
                            Want to explore more words?
                        </Typography>

                        <Typography color="text.secondary">
                            Participate again and discover new Singlish word associations.
                        </Typography>

                        <Button
                            variant="contained"
                            onClick={handleParticipateAgain}
                            sx={{
                                mt: 1,
                                px: 4,
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 600,
                            }}
                        >
                            Participate Again
                        </Button>
                    </Box>

                    {/* Step 2: Highlight cards showing common,
              less-common, and insufficient-data associations. */}
                    {/* SECTION 3: ASSOCIATION HIGHLIGHTS */}
                    {/* Association highlights */}
                    <Box id="highlight-section">
                        <HighlightSection
                            highlights={resultsData.highlights}
                        />
                    </Box>

                    {/* Participant's cue-by-cue association results */}
                    <Box id="word-associations-section">
                        <WordAssociationsSection
                            words={resultsData.wordAssociations}
                        />
                    </Box>

                    {/* Shareable contribution card */}
                    <Box id="share-section">
                        <ShareContribution
                            shareCloudCandidate={shareCloudCandidate}
                            associationsContributed={associationsContributed}
                            cueWordsExplored={cueWordsExplored}
                        />
                    </Box>

                    {/* ================================================
                        SECTION 5: RESULTS EXPLANATION
                        ================================================ */}

                    <Box id="results-explanation">
                        <ResultsExplanation />
                    </Box>

                    {/* ================================================
                        SECTION 6: RESEARCH INFORMATION, CONTACT AND FOOTER
                        ================================================ */}

                    <Box id="research-information">
                        <ResearchInfoSection
                            onParticipateAgain={handleParticipateAgain}
                            onReturnHome={handleReturnHome}
                        />
                    </Box>

                </Stack>
            </Container>
        </Box>
    );
};
