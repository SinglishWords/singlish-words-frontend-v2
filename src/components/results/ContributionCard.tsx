
import { Box, Stack, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { useEffect, useMemo, useState } from "react";

import NUSLogo from "src/assets/images/NUS_Logo.png";
import type { ShareCloudCandidate } from "src/utils/logic/resultsLogic";
import SWOSWQR from "src/assets/images/SWOSW_QR.png";

const CARD_THEMES = {
    ivory: { background: "#FFF8E7", panel: "#FFFFFF", line: "#E6D9B8" },
    offWhite: { background: "#F8F9FA", panel: "#FFF8E7", line: "#D5DEE6" },
    paleBlue: { background: "#EAF3FA", panel: "#FFFFFF", line: "#C5D9EA" },
    paleBlueWithIvory: { background: "#EAF3FA", panel: "#F8F9FA", line: "#C5D9EA" },
} as const;

// Change this one value to switch the card's look.
const CARD_THEME = CARD_THEMES.paleBlueWithIvory;

// Secondary text; passes 4.5:1 on all three backgrounds.
const MUTED_TEXT = "#4A6D8C";

const SURVEY_URL = "https://singlishwords.nus.edu.sg/";

type ContributionCardProps = {
    participantName?: string;
    shareCloudCandidate: ShareCloudCandidate | null;
    associationsContributed: number;
    cueWordsExplored: number;
    format?: "story" | "linkedin";
};

type CloudWord = ShareCloudCandidate["words"][number];

type PlacedWord = CloudWord & {
    x: number;        // centre of the word's box
    y: number;
    fontSize: number;
    width: number;
    height: number;
};

// ---- Layout tuning knobs ----
const MIN_FONT = 22;          // layout units; the SVG scales them to fit
const MAX_FONT = 56;
const SIZE_CURVE = 0.7;       // <1 lifts mid-frequency words; 1 = linear
const WORD_GAP = 3;           // minimum gap between word boxes
const HEIGHT_FACTOR = 0.8;    // word box height as a share of font size
const BASELINE_SHIFT = 0.28;  // moves the baseline below the box centre
const LINKEDIN_ASPECT = 2.2;  // wide spiral for the 4:5 card
const STORY_ASPECT = 1.15;    // rounder spiral for the story card
const MAX_WORDS = 10;

/**
 * Stable numeric hash for a word. Used to vary each word's starting
 * angle on the spiral without Math.random().
 */
const hashWord = (word: string): number => {
    let hash = 2166136261;

    for (let i = 0; i < word.length; i++) {
        hash ^= word.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }

    return hash >>> 0;
};

let measureContext: CanvasRenderingContext2D | null | undefined;

/** Width of a word in px at the given font size (bold Roboto). */
const measureWord = (word: string, fontSize: number): number => {
    if (measureContext === undefined) {
        measureContext =
            typeof document !== "undefined"
                ? document.createElement("canvas").getContext("2d")
                : null;
    }

    if (!measureContext) {
        // Rough fallback if canvas is unavailable.
        return word.length * fontSize * 0.58;
    }

    measureContext.font = `700 ${fontSize}px Roboto, Arial, sans-serif`;
    return measureContext.measureText(word).width;
};

const collides = (
    a: { x: number; y: number; width: number; height: number },
    b: { x: number; y: number; width: number; height: number }
): boolean =>
    Math.abs(a.x - b.x) < (a.width + b.width) / 2 + WORD_GAP &&
    Math.abs(a.y - b.y) < (a.height + b.height) / 2 + WORD_GAP;

/**
 * Packs words around the centre: largest first, each one moved outward
 * along a spiral until it no longer overlaps an already placed word.
 */
const layoutWords = (words: CloudWord[], aspect: number) => {
    const items = words.slice(0, MAX_WORDS);
    const counts = items.map(item => item.count);
    const maxCount = Math.max(...counts);
    const minCount = Math.min(...counts);

    const sized = items
        .map(item => {
            const ratio =
                maxCount === minCount
                    ? 1
                    : (item.count - minCount) / (maxCount - minCount);

            const baseSize =
                MIN_FONT + Math.pow(ratio, SIZE_CURVE) * (MAX_FONT - MIN_FONT);

            const lengthAdjustment =
                item.word.length > 15
                    ? 0.75
                    : item.word.length > 11
                        ? 0.88
                        : 1;

            const fontSize = Math.round(baseSize * lengthAdjustment);

            return {
                ...item,
                fontSize,
                width: measureWord(item.word, fontSize),
                height: fontSize * HEIGHT_FACTOR,
            };
        })
        // Placement order only: biggest first, then alphabetical.
        .sort(
            (a, b) =>
                b.fontSize - a.fontSize || a.word.localeCompare(b.word)
        );

    const placed: PlacedWord[] = [];

    sized.forEach(item => {
        let x = 0;
        let y = 0;

        if (placed.length > 0) {
            const startAngle = (hashWord(item.word) % 628) / 100;

            for (let step = 0; step < 6000; step++) {
                const t = step * 0.08;
                const radius = 0.9 * t;
                const angle = startAngle + t;

                const candidate = {
                    x: radius * Math.cos(angle) * aspect,
                    y: radius * Math.sin(angle),
                    width: item.width,
                    height: item.height,
                };

                if (!placed.some(other => collides(candidate, other))) {
                    x = candidate.x;
                    y = candidate.y;
                    break;
                }
            }
        }

        placed.push({ ...item, x, y });
    });

    const pad = 6;
    const minX = Math.min(...placed.map(p => p.x - p.width / 2)) - pad;
    const maxX = Math.max(...placed.map(p => p.x + p.width / 2)) + pad;
    const minY = Math.min(...placed.map(p => p.y - p.height / 2)) - pad;
    const maxY = Math.max(...placed.map(p => p.y + p.height / 2)) + pad;

    return {
        placed,
        viewBox: `${minX} ${minY} ${maxX - minX} ${maxY - minY}`,
    };
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
            borderRadius: 0,
        }}
    />
);

const WordCloud = ({
    candidate,
    isStory = false,
}: {
    candidate: ShareCloudCandidate | null;
    isStory?: boolean;
}) => {
    // Re-measure once Roboto has loaded so widths are exact.
    const [fontsReady, setFontsReady] = useState(false);

    useEffect(() => {
        let cancelled = false;
        document.fonts?.ready.then(() => {
            if (!cancelled) setFontsReady(true);
        });
        return () => {
            cancelled = true;
        };
    }, []);

    const layout = useMemo(() => {
        if (!candidate || candidate.words.length === 0) return null;

        return layoutWords(
            candidate.words,
            isStory ? STORY_ASPECT : LINKEDIN_ASPECT
        );
        // fontsReady is intentionally a dependency: it triggers a re-measure.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [candidate, isStory, fontsReady]);

    if (!layout) {
        return (
            <Typography color="#647A91" fontSize={13} textAlign="center">
                Your word associations will appear here.
            </Typography>
        );
    }

    return (
        <svg
            viewBox={layout.viewBox}
            width="100%"
            height="100%"
            role="img"
            // style={{ backgroundColor: '#f0f0f0' }}
            aria-label="Global participant word associations"
        >
            {layout.placed.map(item => (
                <text
                    key={item.word}
                    x={item.x}
                    y={item.y + item.fontSize * BASELINE_SHIFT}
                    textAnchor="middle"
                    dominantBaseline="alphabetic"
                    fontFamily="Roboto, Arial, sans-serif"
                    fontSize={item.fontSize}
                    fontWeight={700}
                    fill="#003D7C"
                >
                    {item.word}
                </text>
            ))}
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
                p: "18px",
                background: CARD_THEME.background,
                color: "#003D7C",
                display: "flex",
                flexDirection: "column",
                fontFamily: "Roboto, Arial, sans-serif",
                gap: isStory ? 1.25 : 0.75,
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
                            fontWeight: 700,
                            lineHeight: 1.2,
                            mt: 0.3,
                        }}
                    >
                        A Word Association Study
                    </Typography>
                </Box>
            </Stack>

            <Box
                sx={{
                    height: "1px",
                    bgcolor: CARD_THEME.line,
                    flexShrink: 0,
                }}
            />
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

            <Box
                sx={{
                    height: "1px",
                    bgcolor: CARD_THEME.line,
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
                        backgroundColor: CARD_THEME.panel,
                    }}
                >
                    <WordCloud candidate={shareCloudCandidate} isStory={isStory} />
                </Box>
            </Box>

            <Box
                sx={{
                    height: "1px",
                    bgcolor: CARD_THEME.line,
                    flexShrink: 0,
                }}
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
                        sx={{ fontSize: 14, fontWeight: 700, lineHeight: 1.2 }}
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
