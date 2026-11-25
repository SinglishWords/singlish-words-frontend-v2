import { Box, Stack, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import NUSLogo from "src/assets/images/National_University_of_Singapore-Logo.wine.png";
import SWOSWQR from "src/assets/images/SWOSW_QR.png";
import type { SinglishScore } from "src/utils/logic/resultsLogic";

const CARD_THEMES = {
    ivory: { background: "#FFF8E7", panel: "#FFFFFF", line: "#E6D9B8" },
    offWhite: { background: "#F8F9FA", panel: "#FFF8E7", line: "#D5DEE6" },
    paleBlue: { background: "#EAF3FA", panel: "#FFFFFF", line: "#C5D9EA" },
    paleBlueWithIvory: { background: "#EAF3FA", panel: "#F8F9FA", line: "#C5D9EA" },
    azureWithOrange: { background: "#E6F0F8", panel: "#FFF6EA", line: "#C5D9EA" }
} as const;

// Change this one value to switch the card's look.
const CARD_THEME = CARD_THEMES.azureWithOrange;

// Secondary text; passes 4.5:1 on all three backgrounds.
const MUTED_TEXT = "#4A6D8C";

const SURVEY_URL = "https://singlishwords.nus.edu.sg/";

type ContributionCardProps = {
    participantName?: string;
    singlishScore: SinglishScore | null;
    isScoreUnavailable?: boolean;
    associationsContributed: number;
    cueWordsExplored: number;
    format?: "story" | "linkedin";
};

/**
 * Placeholder for the QR code. Once `qrcode.react` is installed, replace
 * the "QR" text with:
 *   <QRCodeSVG value={SURVEY_URL} size={size - 10} level="M" />
 * Keep the white background and padding: scanners need the quiet zone.
 */
const QrCode = ({ size }: { size: number }) => (
    <Box
        component="img"
        src={SWOSWQR}
        alt="QR code linking to the Singlish Words study website"
        sx={{
            width: size,
            height: size,
            flexShrink: 0,
            display: "block",
            objectFit: "contain",
            boxSizing: "border-box",
            p: "3px",
            bgcolor: "#FFFFFF",
            border: `1px solid ${CARD_THEME.line}`,
            borderRadius: "6px",
        }}
    />
);

const EMOJI_FONTS =
    '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';

const ScoreBlock = ({
    score,
    isStory,
    isScoreUnavailable = false,
}: {
    score: SinglishScore | null;
    isStory: boolean;
    isScoreUnavailable?: boolean;
}) => {
    const center = { textAlign: "center" as const };
    const smallText = {
        ...center,
        fontSize: isStory ? 20 : 15,
        fontWeight: 300,
        lineHeight: 1.2,
    };

    return (
        <Box
            role={score ? "img" : undefined}
            aria-label={
                score
                    ? `I am ${score.score}% Singlish. ${score.band.comment}`
                    : undefined
            }
            sx={{
                flexShrink: 0, // height follows the content, not the card
                bgcolor: CARD_THEME.panel,
                borderRadius: "14px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                rowGap: isStory ? 2 : 1.25, // score group -> comment
                px: 2,
                py: isStory ? 2 : 1.5,
            }}
        >
            {score ? (
                <>
                    <Box>
                        <Typography sx={smallText}>I am</Typography>

                        <Typography
                            sx={{
                                ...center,
                                fontSize: isStory ? 72 : 54,
                                fontWeight: 800,
                                lineHeight: 1,
                                my: isStory ? 1 : 0.5,
                            }}
                        >
                            {score.score}%
                        </Typography>

                        <Typography sx={smallText}>Singlish</Typography>
                    </Box>

                    <Typography
                        sx={{
                            ...center,
                            fontSize: isStory ? 26 : 19,
                            fontWeight: 800,
                            lineHeight: 1.2,
                        }}
                    >
                        {score.band.comment}{" "}
                        <span
                            style={{
                                fontFamily: EMOJI_FONTS,
                                fontWeight: 400,
                            }}
                        >
                            {score.band.emoji}
                        </span>
                    </Typography>
                </>
            ) : (
                <Typography
                    sx={{ ...center, fontSize: 13, color: MUTED_TEXT }}
                >
                    {isScoreUnavailable
                        ? "Your Singlish score is unavailable right now."
                        : "Calculating your Singlish score…"}
                </Typography>
            )}
        </Box>
    );
};

export const ContributionCard = ({
    participantName,
    singlishScore,
    isScoreUnavailable,
    associationsContributed,
    cueWordsExplored,
    format,
}: ContributionCardProps) => {

    const isStory = format === "story";

    return (
        <Box
            sx={{
                width: 360,
                height: isStory ? 640 : 450,
                boxSizing: "border-box",
                overflow: "hidden",
                position: "relative",
                px: "18px",
                pt: isStory ? "72px" : "18px",
                pb: isStory ? "88px" : "18px",
                justifyContent: "space-between",
                gap: 1, // minimum gap; extra space is distributed by space-between
                background: CARD_THEME.background,
                color: "#003D7C",
                display: "flex",
                flexDirection: "column",
                fontFamily: "Roboto, Arial, sans-serif",
                // gap: isStory ? 1.25 : 0.75,
            }}
        >
            {/* NUS and study identity */}
            <Stack
                direction="row"
                alignItems="center"
                spacing={1.2}
                sx={{ minHeight: 40, flexShrink: 0 }}
            >
                <Box
                    component="img"
                    src={NUSLogo}
                    alt="National University of Singapore"
                    sx={{
                        width: 58,
                        height: 37,
                        objectFit: "contain",
                        flexShrink: 0,
                    }}
                />

                <Box
                    sx={{
                        width: "1px",
                        height: 32,
                        bgcolor: "#B7D0E5",
                        flexShrink: 0,
                    }}
                />

                <Box sx={{ minWidth: 0 }}>
                    <Typography
                        sx={{
                            fontSize: 12,
                            fontWeight: 700,
                            lineHeight: 1.15,
                            color: "#003D7C",
                        }}
                    >
                        A Small World of Singlish Words
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 9,
                            fontWeight: 400,
                            lineHeight: 1.2,
                            mt: 0.3,
                        }}
                    >
                        A Word Association Study
                    </Typography>
                </Box>
            </Stack>

            {/* <Box
                sx={{
                    height: "1px",
                    bgcolor: CARD_THEME.line,
                    flexShrink: 0,
                }}
            /> */}
            <Typography
                sx={{
                    fontSize: 16,
                    fontWeight: 700,
                    flexShrink: 0,
                }}
            >
                I helped grow the Singlish word map!
            </Typography>

            {/* Participant contribution statistics */}
            <Box
                sx={{
                    bgcolor: CARD_THEME.panel,
                    borderRadius: 0,
                    px: 2,
                    py: isStory ? 2 : 1.5,
                    flexShrink: 0,
                }}
            >
                {/* <Typography
                    sx={{
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: 1,
                        mb: 0.75,
                    }}
                >
                    {participantName?.trim()
                        ? `${participantName.trim().toUpperCase()}'S CONTRIBUTION`
                        : "MY CONTRIBUTION"}
                </Typography> */}

                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                >
                    <Typography
                        sx={{
                            fontSize: 44,
                            fontWeight: 700,
                            lineHeight: 1,
                            flexShrink: 0,
                        }}
                    >
                        {associationsContributed}
                    </Typography>

                    <Box
                        sx={{
                            width: "1px",
                            height: 43,
                            bgcolor: "#B7D0E5",
                            flexShrink: 0,
                        }}
                    />

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            sx={{
                                fontSize: 14,
                                fontWeight: 700,
                                lineHeight: 1.2,
                                whiteSpace: "nowrap",
                            }}
                        >
                            associations contributed
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 11,
                                color: MUTED_TEXT,
                                mt: 0.4,
                            }}
                        >
                            Across{" "}
                            {cueWordsExplored}{" "}
                            cue words
                        </Typography>
                    </Box>
                </Stack>
            </Box>

            {/* <Box
                sx={{
                    height: "1px",
                    bgcolor: CARD_THEME.line,
                    flexShrink: 0,
                }}
            /> */}

            {/* <Typography
                sx={{ fontSize: 14, fontWeight: 700, mb: 0.5, flexShrink: 0 }}
            >
                A glimpse of your Singlish associations
            </Typography> */}

            {/* Singlish score */}
            <ScoreBlock
                score={singlishScore}
                isStory={isStory}
                isScoreUnavailable={isScoreUnavailable}
            />

            {/* Closing message + QR */}
            <Stack
                direction="row"
                alignItems="center"
                spacing={1.5}
                sx={{ flexShrink: 0 }}
            >
                <QrCode size={isStory ? 64 : 56} />

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                        sx={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}
                    >
                        Think your Singlish better than mine?
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 10.5,
                            fontWeight: 400,
                            lineHeight: 1.35,
                            mt: 0.35,
                        }}
                    >
                        Play the 5-minute game for yourself
                    </Typography>

                    <Box
                        sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.75,
                            mt: 0.75,
                            bgcolor: "#003D7C",
                            color: "#FFFFFF",
                            borderRadius: "999px",
                            pl: 1.25,
                            pr: 0.5,
                            py: 0.5,
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: 10,
                                fontWeight: 700,
                                lineHeight: 1,
                                whiteSpace: "nowrap",
                            }}
                        >
                            {SURVEY_URL.replace("https://", "")}
                        </Typography>

                        <Box
                            sx={{
                                width: 18,
                                height: 18,
                                borderRadius: "50%",
                                bgcolor: "#EF7C00",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <ArrowForwardRoundedIcon
                                sx={{ fontSize: 12, color: "#FFFFFF" }}
                            />
                        </Box>
                    </Box>
                </Box>
            </Stack>
        </Box>
    );
};

export default ContributionCard;
