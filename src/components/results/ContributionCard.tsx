
import {
    Box,
    Stack,
    Typography,
} from "@mui/material";

import NUSLogo from "src/assets/images/NUS_Logo.png";
import type { ShareAssociation } from "src/utils/logic/resultsLogic";

// Re-export so existing imports from ContributionCard can be migrated
// gradually without duplicating the type definition.
export type { ShareAssociation } from "src/utils/logic/resultsLogic";

const SURVEY_URL = "https://singlishwords.nus.edu.sg/";

type ContributionCardProps = {
    participantName?: string;
    shareAssociations: ShareAssociation[];
    associationsContributed: number;
    cueWordsExplored: number;
    format?: "story" | "linkedin";
};

type SelectedCloudGroup = {
    cue: string;
    associations: ShareAssociation[];
};

/**
 * Calculate the proportion of respondents who supplied an association.
 */
const getFrequency = (association: ShareAssociation): number => {
    if (association.totalRespondents <= 0) return 0;

    return (
        association.matchingRespondents /
        association.totalRespondents
    );
};

/**
 * Group the selected associations by cue word and choose the
 * strongest group for the share card.
 *
 * Preference is given to groups containing more of the participant's
 * own associations, followed by groups with stronger overall frequency.
 */
const selectCloudGroup = (
    associations: ShareAssociation[]
): SelectedCloudGroup | null => {
    const groups = new Map<string, ShareAssociation[]>();

    associations.forEach(association => {
        const cue = association.cue.trim();

        if (!cue || !association.association.trim()) return;

        const existing = groups.get(cue) ?? [];
        existing.push(association);
        groups.set(cue, existing);
    });

    const candidates = Array.from(groups.entries()).map(
        ([cue, items]) => {
            const sortedAssociations = [...items].sort((a, b) => {
                // Show the participant's own contributions first.
                if (
                    a.isParticipantAssociation !==
                    b.isParticipantAssociation
                ) {
                    return a.isParticipantAssociation ? -1 : 1;
                }

                return getFrequency(b) - getFrequency(a);
            });

            const participantCount = sortedAssociations.filter(
                item => item.isParticipantAssociation
            ).length;

            const frequencyScore = sortedAssociations.reduce(
                (sum, item) => sum + getFrequency(item),
                0
            );

            return {
                cue,
                associations: sortedAssociations.slice(0, 6),
                participantCount,
                frequencyScore,
            };
        }
    );

    candidates.sort((a, b) => {
        if (a.participantCount !== b.participantCount) {
            return b.participantCount - a.participantCount;
        }

        if (a.frequencyScore !== b.frequencyScore) {
            return b.frequencyScore - a.frequencyScore;
        }

        return a.cue.localeCompare(b.cue);
    });

    if (candidates.length === 0) return null;

    return {
        cue: candidates[0].cue,
        associations: candidates[0].associations,
    };
};

/**
 * Display one cue word surrounded by up to six associations.
 *
 * Participant contributions: NUS orange.
 * Other study associations: NUS blue.
 */
const WordCloud = ({
    group,
}: {
    group: SelectedCloudGroup | null;
}) => {
    if (!group || group.associations.length === 0) {
        return (
            <Typography
                color="#647A91"
                fontSize={13}
                textAlign="center"
            >
                Your word associations will appear here.
            </Typography>
        );
    }

    const associationPositions = [
        { x: -155, y: -65 },
        { x: 155, y: -65 },
        { x: -165, y: 20 },
        { x: 165, y: 20 },
        { x: -95, y: 85 },
        { x: 95, y: 85 },
    ];

    return (
        <svg
            viewBox="0 0 600 300"
            width="100%"
            height="100%"
            role="img"
            aria-label={`Word associations for ${group.cue}`}
        >
            <g transform="translate(300, 150)">
                {group.associations.map((association, index) => {
                    const position = associationPositions[index];

                    // Reduce font size for longer associations.
                    const fontSize =
                        association.association.length > 13
                            ? 13
                            : association.association.length > 9
                                ? 15
                                : 18;

                    return (
                        <text
                            key={`${group.cue}-${association.association}`}
                            x={position.x}
                            y={position.y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontFamily="Roboto, Arial, sans-serif"
                            fontSize={fontSize}
                            fontWeight={700}
                            fill={
                                association.isParticipantAssociation
                                    ? "#EF7C00"
                                    : "#003D7C"
                            }
                        >
                            {association.association}
                        </text>
                    );
                })}

                {/* Central cue word */}
                <text
                    x={0}
                    y={0}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontFamily="Roboto, Arial, sans-serif"
                    fontSize={27}
                    fontWeight={800}
                    fill="#EF7C00"
                >
                    {group.cue}
                </text>
            </g>
        </svg>
    );
};

export const ContributionCard = ({
    participantName,
    shareAssociations,
    associationsContributed,
    cueWordsExplored,
    format = "linkedin",
}: ContributionCardProps) => {
    const selectedCloudGroup = selectCloudGroup(shareAssociations);

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
                        A Small World of Singlish Words:
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 11,
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
                        fontSize: 10,
                        fontWeight: 800,
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
                    sx={{
                        fontSize: 14,
                        fontWeight: 700,
                        mb: 0.5,
                        flexShrink: 0,
                    }}
                >
                    A glimpse of your Singlish connections
                </Typography>

                <Box
                    sx={{
                        flex: 1,
                        minHeight: 0,
                        bgcolor: "#F2F8FD",
                        borderRadius: "48%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        px: 1,
                        overflow: "hidden",
                    }}
                >
                    <WordCloud group={selectedCloudGroup} />
                </Box>
            </Box>

            <Box
                sx={{
                    height: "1px",
                    bgcolor: "#DCE8F2",
                    flexShrink: 0,
                }}
            />

            {/* Legend */}
            <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
                sx={{ flexShrink: 0 }}
            >
                <Stack direction="row" alignItems="center" spacing={0.6}>
                    <Box
                        sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: "#EF7C00",
                        }}
                    />
                    <Typography fontSize={9.5} color="#547895">
                        Your contribution
                    </Typography>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={0.6}>
                    <Box
                        sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: "#003D7C",
                        }}
                    />
                    <Typography fontSize={9.5} color="#547895">
                        Community associations
                    </Typography>
                </Stack>
            </Stack>

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
