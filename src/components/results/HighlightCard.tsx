
import {
    Box,
    Chip,
    LinearProgress,
    Stack,
    Typography,
} from "@mui/material";

/*
 * The classification is supplied by the parent component.
 *
 * IMPORTANT:
 * These categories are currently visual labels only.
 * The research team should confirm the actual thresholds
 * before we derive them from real response data.
 */
export type HighlightCategory =
    | "common"
    | "less-common"
    | "distinctive"
    | "more-data-needed";

/*
 * Data required to render a single highlight card.
 *
 * Later, these properties will be derived from resultsLogic.ts:
 *
 * cueWord:
 *   The cue word from the participant's form.data.
 *
 * association:
 *   The participant's association being compared.
 *
 * matchingRespondents:
 *   Number of distinct respondents who supplied this association.
 *
 * totalRespondents:
 *   Number of eligible respondents for this cue.
 *
 * category:
 *   Classification derived from the agreed research rules.
 *
 * description:
 *   Human-readable explanation of the result.
 */
export type HighlightCardData = {
    cueWord: string;
    association: string;
    matchingRespondents?: number;
    totalRespondents?: number;
    category: HighlightCategory;
};

/*
 * Styling configuration for each classification.
 *
 * Keeping this separate avoids repeating conditional styling
 * throughout the JSX.
 */
const categoryStyles = {
    common: {
        label: "common",
        chipBg: "#E1EEFF",
        chipColor: "#174B83",
    },
    "less-common": {
        label: "rare",
        chipBg: "#FFF0E0",
        chipColor: "#A64B12",
    },
    distinctive: {
        label: "unique",
        chipBg: "#FCE8D5",
        chipColor: "#873D0C",
    },
    "more-data-needed": {
        label: "not enough data",
        chipBg: "#ECEFF2",
        chipColor: "#596579",
    },
};

type HighlightCardProps = {
    item: HighlightCardData;
};

export const HighlightCard = ({ item }: HighlightCardProps) => {
    const {
        cueWord,
        association,
        matchingRespondents,
        totalRespondents,
        category,
    } = item;

    const style = categoryStyles[category];

    /*
     * Only calculate a percentage when we have valid denominators.
     *
     * This avoids division by zero and prevents displaying
     * misleading percentages when data is unavailable.
     */
    const percentage =
        totalRespondents !== undefined &&
            totalRespondents > 0 &&
            matchingRespondents !== undefined
            ? Math.round((matchingRespondents / totalRespondents) * 100)
            : null;

    const hasFrequencyData =
        (category === "common" || category === "less-common") &&
        percentage !== null &&
        matchingRespondents !== undefined &&
        totalRespondents !== undefined;

    const isDistinctive = category === "distinctive";

    return (
        <Box
            sx={{
                height: "100%",
                width: "100%",
                minWidth: 0,
                boxSizing: "border-box",
                p: 2.5,
                border: "1px solid #D8E5F3",
                borderRadius: 3,

                // Give the insufficient-data card a slightly different background.
                bgcolor:
                    category === "more-data-needed" ? "#F0F7FF" : "#FFFFFF",

                display: "flex",
                flexDirection: "column",
                gap: 1.5,
            }}
        >
            {/* =====================================================
        1. CARD HEADER
        Cue word and classification badge
        ===================================================== */}
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                gap={1}
            >
                <Typography
                    sx={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#123F73",
                        overflowWrap: "anywhere",
                    }}
                >
                    {cueWord}
                </Typography>

                <Chip
                    label={style.label}
                    size="small"
                    sx={{
                        bgcolor: style.chipBg,
                        color: style.chipColor,
                        fontSize: 10,
                        fontWeight: 800,
                        flexShrink: 0,
                        height: 25,
                    }}
                />
            </Stack>

            {/* =====================================================
        2. PARTICIPANT'S ASSOCIATION
        Display the association supplied by the participant.
        ===================================================== */}
            <Stack
                direction="row"
                alignItems="center"
                gap={1}
                flexWrap="wrap"
            >
                <Typography
                    variant="body2"
                    sx={{
                        color: "#7186A2",
                        fontSize: 12,
                    }}
                >
                    Your association
                </Typography>

                <Chip
                    label={association}
                    size="small"
                    sx={{
                        bgcolor: "#E1EEFF",
                        color: "#174B83",
                        fontWeight: 700,
                        maxWidth: "100%",
                        "& .MuiChip-label": {
                            overflowWrap: "anywhere",
                            whiteSpace: "normal",
                        },
                    }}
                />
            </Stack>



            {/* =====================================================
    3. RESULT DETAILS

    Common and rare: show frequency and percentage.
    Distinctive: show zero matching respondents.
    Not enough data: no frequency is displayed.
    ===================================================== */}

            {hasFrequencyData ? (
                <>
                    <Typography
                        sx={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#263F5D",
                            mt: 0.25,
                        }}
                    >
                        {matchingRespondents} of {totalRespondents} respondents
                    </Typography>

                    <Stack direction="row" alignItems="center" gap={1}>
                        <LinearProgress
                            variant="determinate"
                            value={percentage ?? 0}
                            sx={{
                                flex: 1,
                                height: 8,
                                borderRadius: 5,
                                bgcolor: "#E3EAF2",
                                "& .MuiLinearProgress-bar": {
                                    bgcolor:
                                        category === "common" ? "#2869A5" : "#D97732",
                                    borderRadius: 5,
                                },
                            }}
                        />

                        <Typography
                            sx={{
                                fontSize: 11,
                                fontWeight: 800,
                                color: "#123F73",
                                minWidth: 30,
                                textAlign: "right",
                            }}
                        >
                            {percentage}%
                        </Typography>
                    </Stack>
                </>
            ) : isDistinctive &&
                matchingRespondents !== undefined &&
                totalRespondents !== undefined ? (
                <Typography
                    sx={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#263F5D",
                    }}
                >
                    {matchingRespondents} of {totalRespondents} respondents
                </Typography>
            ) : null}

            {/* =====================================================
        4. EXPLANATORY DESCRIPTION
        Keep the description at the bottom for consistent
        card alignment when cards have different content.
        ===================================================== */}
            <Typography
                variant="caption"
                sx={{
                    color: "#7186A2",
                    fontSize: 11,
                    mt: "auto",
                    pt: 0.5,
                }}
            >
            </Typography>
        </Box>
    );
};
