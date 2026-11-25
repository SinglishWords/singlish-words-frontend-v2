import { Box, LinearProgress, Stack, Typography } from "@mui/material";

import type { SinglishScore } from "src/utils/logic/resultsLogic";

type SinglishScoreSectionProps = {
    score: SinglishScore | null;
    isUnavailable?: boolean;
};

const EMOJI_FONTS =
    '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';

export const SinglishScoreSection = ({
    score,
    isUnavailable = false,
}: SinglishScoreSectionProps) => {
    if (isUnavailable) return null;

    return (
        <Box
            sx={{
                p: { xs: 2, sm: 3.5 },
                border: "1px solid #DCE8F6",
                borderRadius: 3,
                bgcolor: "#FFFFFF",
                boxSizing: "border-box",
                width: "100%",
                minWidth: 0,
            }}
        >
            <Stack spacing={2}>
                {/* Score */}
                <Stack
                    direction="row"
                    alignItems="baseline"
                    flexWrap="wrap"
                    columnGap={1.25}
                >
                    <Typography
                        sx={{
                            fontSize: { xs: 20, sm: 23 },
                            fontWeight: 700,
                            color: "#123F73",
                            textAlign: "left",
                        }}
                    >
                        Your Singlish score:
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: { xs: 36, sm: 44 },
                            fontWeight: 800,
                            color: "#123F73",
                            lineHeight: 1,
                            textAlign: "left",
                        }}
                    >
                        {score ? `${score.score}%` : "…"}
                    </Typography>
                </Stack>

                {score && (
                    <LinearProgress
                        variant="determinate"
                        value={score.score}
                        aria-label={`Singlish score: ${score.score} out of 100`}
                        sx={{
                            height: 10,
                            borderRadius: 5,
                            bgcolor: "#E6F0F8",
                            "& .MuiLinearProgress-bar": {
                                borderRadius: 5,
                                bgcolor: "secondary.main",
                            },
                        }}
                    />
                )}

                {/* Comment */}
                <Box
                    sx={{
                        pt: 2,
                        borderTop: "1px solid #E4EDF7",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: { xs: 22, sm: 26 },
                            fontWeight: 700,
                            color: "#123F73",
                            textAlign: "left",
                        }}
                    >
                        {score ? (
                            <>
                                {score.band.comment}{" "}
                                <span
                                    style={{
                                        fontFamily: EMOJI_FONTS,
                                        fontWeight: 400,
                                    }}
                                >
                                    {score.band.emoji}
                                </span>
                            </>
                        ) : (
                            "Calculating your score…"
                        )}
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: { xs: 14, sm: 16 },
                            color: "#617D9F",
                            lineHeight: 1.5,
                            mt: 0.75,
                            textAlign: "left",
                        }}
                    >
                        This score reflects how much Singlish you know, and
                        how well it aligns with other people.
                    </Typography>
                </Box>
            </Stack>
        </Box>
    );
};

export default SinglishScoreSection;