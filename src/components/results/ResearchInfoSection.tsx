import {
    Box,
    Button,
    Divider,
    Link,
    Stack,
    Typography,
} from "@mui/material";

/*
 * The parent page owns the survey state and navigation.
 * These callbacks allow this component to trigger those actions
 * without duplicating survey logic.
 */
type ResearchInfoSectionProps = {
    onParticipateAgain: () => void;
    onReturnHome: () => void;
};

const STUDY_URL = "https://singlishwords.nus.edu.sg/";
const PROJECT_EMAIL = "singlishwords@nus.edu.sg";
const INVESTIGATOR_EMAIL = "cynthia@nus.edu.sg";

export const ResearchInfoSection = ({
    onParticipateAgain,
    onReturnHome,
}: ResearchInfoSectionProps) => {
    return (
        <Box
            sx={{
                width: "100%",
                textAlign: "left",

                // Explicitly override centring inherited from parent layouts.
                "& .MuiTypography-root": {
                    textAlign: "left",
                    alignSelf: "flex-start",
                    width: "100%",
                },
                "& .MuiLink-root": {
                    alignSelf: "flex-start",
                    textAlign: "left",
                },
            }}
        >
            {/* =====================================================
                SECTION 1: WHAT ARE WE TRYING TO DO?
                ===================================================== */}

            <Stack
                spacing={1.25}
                sx={{
                    width: "100%",
                    alignItems: "flex-start",
                    pb: 3,
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 700,
                        color: "#123F73",
                        fontSize: { xs: 21, sm: 23 },
                    }}
                >
                    What are we trying to do?
                </Typography>

                {/*
                    This description is based on the existing EmailPage
                    research description in src/utils/data.ts.

                    Keeping the original research explanation helps preserve
                    the project's existing framing.
                */}
                <Typography
                    sx={{
                        fontSize: 13,
                        lineHeight: 1.8,
                        color: "#344966",
                    }}
                >
                    The mental lexicon is the part of long-term memory where
                    words and their meanings are stored. The connections between
                    these words and concepts can be represented as a language
                    network, similar to a social network of words, to model the
                    large-scale structure of the mental lexicon.
                </Typography>

                <Typography
                    sx={{
                        fontSize: 13,
                        lineHeight: 1.8,
                        color: "#344966",
                    }}
                >
                    In this study, you were asked to respond with words that
                    came to mind when presented with Singapore English words.
                    These responses are called free associations. Researchers
                    plan to use free associations across thousands of words in
                    Singapore English to study the structure of the Singaporean
                    mental lexicon.
                </Typography>

                <Typography
                    sx={{
                        fontSize: 13,
                        lineHeight: 1.8,
                        color: "#344966",
                    }}
                >
                    Thank you for helping us with this research!
                </Typography>
            </Stack>

            <Divider sx={{ borderColor: "#DCE5EF" }} />

            {/* =====================================================
                SECTION 2: GET IN TOUCH
                ===================================================== */}

            <Stack
                spacing={1.25}
                sx={{
                    width: "100%",
                    alignItems: "flex-start",
                    py: 3,
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        color: "#123F73",
                        fontSize: 16,
                    }}
                >
                    Get in touch
                </Typography>

                <Typography
                    sx={{
                        fontSize: 13,
                        lineHeight: 1.7,
                        color: "#344966",
                    }}
                >
                    Questions or concerns about the research? Contact the
                    project team at{" "}
                    <Link
                        href={`mailto:${PROJECT_EMAIL}`}
                        underline="hover"
                        sx={{
                            color: "#174F89",
                            fontWeight: 700,
                            overflowWrap: "anywhere",
                        }}
                    >
                        {PROJECT_EMAIL}
                    </Link>
                    .
                </Typography>

                <Stack
                    spacing={0.5}
                    sx={{
                        width: "100%",
                        alignItems: "flex-start",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 12,
                            color: "#7186A2",
                        }}
                    >
                        Principal Investigator
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#344966",
                        }}
                    >
                        Dr. Cynthia Siew
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 12,
                            color: "#7186A2",
                            overflowWrap: "anywhere",
                        }}
                    >
                        Department of Psychology, National University of Singapore
                    </Typography>

                    <Link
                        href={`mailto:${INVESTIGATOR_EMAIL}`}
                        underline="hover"
                        sx={{
                            fontSize: 12,
                            color: "#174F89",
                            fontWeight: 600,
                            width: "fit-content",
                            overflowWrap: "anywhere",
                        }}
                    >
                        {INVESTIGATOR_EMAIL}
                    </Link>
                </Stack>
            </Stack>

            <Divider sx={{ borderColor: "#DCE5EF" }} />

            {/* =====================================================
                SECTION 3: SHARE THE STUDY
                ===================================================== */}

            <Stack
                spacing={1.25}
                sx={{
                    width: "100%",
                    alignItems: "flex-start",
                    py: 3,
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        color: "#123F73",
                        fontSize: 16,
                    }}
                >
                    Share the study
                </Typography>

                <Typography
                    sx={{
                        fontSize: 13,
                        lineHeight: 1.7,
                        color: "#344966",
                    }}
                >
                    Help us build a more complete picture of Singapore
                    English by inviting family and friends to participate.
                    You can also come back another time to contribute to
                    new words.
                </Typography>

                <Link
                    href={STUDY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    sx={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: "#174F89",
                        width: "fit-content",
                        overflowWrap: "anywhere",
                    }}
                >
                    singlishwords.nus.edu.sg
                </Link>
            </Stack>

            {/* =====================================================
                SECTION 4: PARTICIPANT ACTIONS
                ===================================================== */}

            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.25}
                sx={{
                    width: "100%",
                    pt: 1,
                    pb: 3,
                    alignItems: { xs: "flex-start", sm: "center" },
                }}
            >
                <Button
                    variant="outlined"
                    onClick={onParticipateAgain}
                    sx={{
                        minHeight: 42,
                        px: 3,
                        borderRadius: 2,
                        borderColor: "#1B5E9E",
                        color: "#174B83",
                        fontSize: 12,
                        fontWeight: 800,
                        textTransform: "none",
                        width: { xs: "100%", sm: "auto" },
                    }}
                >
                    Participate again
                </Button>

                <Button
                    variant="contained"
                    onClick={onReturnHome}
                    sx={{
                        minHeight: 42,
                        px: 3,
                        borderRadius: 2,
                        bgcolor: "#1B5E9E",
                        fontSize: 12,
                        fontWeight: 800,
                        textTransform: "none",
                        boxShadow: "none",
                        width: { xs: "100%", sm: "auto" },
                        "&:hover": {
                            bgcolor: "#174B83",
                            boxShadow: "none",
                        },
                    }}
                >
                    Return to home page
                </Button>
            </Stack>

            {/* =====================================================
                SECTION 5: FOOTER
                ===================================================== */}

            <Divider sx={{ borderColor: "#DCE5EF" }} />

            <Box
                component="footer"
                sx={{
                    width: "100%",
                    pt: 2,
                    pb: 1,
                    textAlign: "left",
                }}
            >
                <Typography
                    sx={{
                        fontSize: 11,
                        color: "#7186A2",
                        textAlign: "left",
                    }}
                >
                    A Small World of Singlish Words · National University of Singapore
                </Typography>
            </Box>
        </Box>
    );
};
