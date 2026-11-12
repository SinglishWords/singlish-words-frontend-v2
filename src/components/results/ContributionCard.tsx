
import {
    Box,
    Stack,
    Typography
} from "@mui/material";

import NUSLogo from "src/assets/images/NUS_Logo.png";
import type { ShareAssociation, ShareCloudCandidate } from "src/utils/logic/resultsLogic";


const SURVEY_URL = "https://singlishwords.nus.edu.sg/";

type ContributionCardProps = {
    participantName?: string;
    shareCloudCandidate: ShareCloudCandidate | null;
    associationsContributed: number;
    cueWordsExplored: number;
    format?: "story" | "linkedin";
};

// Cloud outline, authored for yScale = 1 (LinkedIn).
const CLOUD_START: [number, number] = [21, 262];
const CLOUD_CURVES: number[][] = [
    [-46, 262, -92, 232, -89, 190],
    [-88, 158, -58, 138, -21, 128],
    [-53, 105, -45, 62, -2, 44],
    [42, 24, 96, 34, 123, 52],
    [158, 14, 228, 10, 294, 36],
    [335, 6, 411, 16, 430, 52],
    [484, 22, 563, 42, 568, 84],
    [625, 94, 654, 132, 616, 164],
    [662, 202, 621, 262, 554, 262],
    [435, 272, 192, 272, 21, 262],
];

// Stretch the outline vertically only; x values stay untouched.
const buildCloudPath = (yScale: number): string => {
    const round = (n: number) => Math.round(n * 10) / 10;
    const [sx, sy] = CLOUD_START;
    const curves = CLOUD_CURVES.map(
        curve =>
            "C " +
            curve
                .map((value, i) => (i % 2 === 0 ? value : round(value * yScale)))
                .join(" ")
    ).join(" ");
    return `M ${sx} ${round(sy * yScale)} ${curves} Z`;
};

const WordCloud = ({
    candidate,
    isStory = false,
}: {
    candidate: ShareCloudCandidate | null;
    isStory?: boolean;
}) => {
    if (!candidate || candidate.words.length === 0) {
        return (
            <Typography color="#647A91" fontSize={13} textAlign="center">
                Your word associations will appear here.
            </Typography>
        );
    }

    // Taller cloud for the story card, unchanged for LinkedIn.
    const yScale = isStory ? 1.9 : 1;

    const positions = [
        { x: -105, y: -65, size: 38 },
        { x: 105, y: -75, size: 29 },
        { x: -195, y: 0, size: 28 },
        { x: 190, y: -5, size: 36 },
        { x: -155, y: 65, size: 30 },
        { x: 15, y: 90, size: 27 },
        { x: 130, y: 65, size: 33 },
        { x: 0, y: -92, size: 27 },
        { x: -5, y: 65, size: 28 },
    ];

    return (
        <svg
            viewBox={`-62 0 724 ${Math.round(285 * yScale)}`}
            width="100%"
            height="100%"
            role="img"
            aria-label={`Word associations for ${candidate.cue}`}
        >
            <defs>
                <linearGradient id="cloudGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F7FBFE" />
                    <stop offset="100%" stopColor="#E6F1FA" />
                </linearGradient>
            </defs>

            <path
                d={buildCloudPath(yScale)}
                fill="url(#cloudGradient)"
                stroke="#DCEAF5"
                strokeWidth={1.5}
            />

            <g transform={`translate(300, ${150 * yScale})`}>
                {candidate.words.slice(0, 9).map((item, index) => {
                    const position = positions[index];

                    const lengthAdjustment =
                        item.word.length > 13
                            ? 0.68
                            : item.word.length > 10
                                ? 0.82
                                : 1;

                    const fontSize = Math.round(position.size * lengthAdjustment);

                    return (
                        <text
                            key={`${item.source}-${item.word}`}
                            x={position.x * 1.3}
                            y={position.y * yScale}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontFamily="Roboto, Arial, sans-serif"
                            fontSize={fontSize}
                            fontWeight={700}
                            fill={
                                item.isParticipantAssociation
                                    ? "#003D7C"
                                    : "#70797d"
                            }
                        >
                            {item.word}
                        </text>
                    );
                })}

                <text
                    x={0}
                    y={5}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontFamily="Roboto, Arial, sans-serif"
                    fontSize={60}
                    fontWeight={800}
                    fill="#EF7C00"
                >
                    {candidate.cue}
                </text>
            </g>
        </svg>
    );
};

export const ContributionCard = ({
    participantName,
    shareCloudCandidate,
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
                border: "3px solid #B7D9F5",
                borderRadius: "22px",
                p: "15px",
                background: "#FFFFFF",
                color: "#003D7C",
                display: "flex",
                flexDirection: "column",
                fontFamily: "Roboto, Arial, sans-serif",
                gap: isStory ? 1.5 : 1,
            }}
        >
            {/* NUS and study identity */}
            <Stack
                direction="row"
                alignItems="center"
                spacing={1.2}
                sx={{ minHeight: 48, flexShrink: 0 }}
            >
                <Box
                    component="img"
                    src={NUSLogo}
                    alt="National University of Singapore"
                    sx={{
                        width: 67,
                        height: 43,
                        objectFit: "contain",
                        flexShrink: 0,
                    }}
                />

                <Box
                    sx={{
                        width: "1px",
                        height: 38,
                        bgcolor: "#B7D0E5",
                        flexShrink: 0,
                    }}
                />

                <Box sx={{ minWidth: 0 }}>
                    <Typography
                        sx={{
                            fontSize: 13,
                            fontWeight: 800,
                            lineHeight: 1.15,
                            color: "#003D7C",
                        }}
                    >
                        A Small World of Singlish Words
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 9,
                            fontWeight: 700,
                            lineHeight: 1.2,
                            mt: 0.4,
                        }}
                    >
                        A Word Association Study
                    </Typography>
                </Box>
            </Stack>

            <Box
                sx={{
                    height: "1px",
                    bgcolor: "#DCE8F2",
                    flexShrink: 0,
                }}
            />
            <Typography
                sx={{
                    fontSize: 16,
                    fontWeight: 700,
                    mb: 0.5,
                    flexShrink: 0,
                }}
            >
                I helped grow the Singlish word map!
            </Typography>

            {/* Participant contribution statistics */}
            <Box
                sx={{
                    bgcolor: "#EDF6FD",
                    borderRadius: 3,
                    px: 2,
                    py: isStory ? 2 : 1.5,
                    flexShrink: 0,
                }}
            >
                <Typography
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
                </Typography>

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
                                color: "#547895",
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

            <Box
                sx={{
                    height: "1px",
                    bgcolor: "#DCE8F2",
                    flexShrink: 0,
                }}
            />

            {/* Word cloud */}
            <Box
                sx={{
                    flex: 1,
                    minHeight: 0,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Typography
                    sx={{ fontSize: 14, fontWeight: 700, mb: 0.5, flexShrink: 0 }}
                >
                    A glimpse of your Singlish associations
                </Typography>

                {/* Cloud now provides its own background */}
                <Box
                    sx={{
                        flex: 1,
                        minHeight: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <WordCloud candidate={shareCloudCandidate} isStory={isStory} />
                </Box>
            </Box>

            <Box
                sx={{
                    height: "1px",
                    bgcolor: "#DCE8F2",
                    flexShrink: 0,
                }}
            />

            {/* Closing message */}
            <Box
                sx={{
                    textAlign: "center",
                    pt: 0.25,
                    flexShrink: 0,
                }}
            >
                <Box
                    sx={{
                        width: 34,
                        height: 3,
                        borderRadius: 2,
                        bgcolor: "#EF7C00",
                        mx: "auto",
                        mb: 0.8,
                    }}
                />

                <Typography
                    sx={{
                        fontSize: 14,
                        fontWeight: 700,
                        lineHeight: 1.2,
                    }}
                >
                    Every word tells a story.
                </Typography>

                <Typography
                    sx={{
                        fontSize: 10.5,
                        color: "#547895",
                        lineHeight: 1.35,
                        mt: 0.35,
                    }}
                >
                    Discover how Singapore connects through Singlish.
                </Typography>

                <Typography
                    sx={{
                        fontSize: 10,
                        color: "#003D7C",
                        fontWeight: 800,
                        mt: 0.65,
                    }}
                >
                    {SURVEY_URL.replace("https://", "")}
                </Typography>
            </Box>
        </Box>
    );
};

export default ContributionCard;
