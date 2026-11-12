
import { useState } from "react";

import {
    Box,
    Chip,
    Collapse,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { HighlightCategory } from "./HighlightCard";

/*
 * Data model for one cue and its participant associations.
 *
 * Later, this will be populated using:
 * form.data + derived results from allAnswers.
 *
 * Each association has its own classification and frequency.
 */
export type WordAssociation = {
    word: string;
    category: HighlightCategory;

    // Optional because insufficient data may prevent comparison.
    matchingRespondents?: number;
    totalRespondents?: number;
};

export type WordAssociationItem = {
    cueWord: string;
    associations: WordAssociation[];
};

type WordAssociationCardProps = {
    item: WordAssociationItem;
};

/*
 * Reuse the same visual classification colours as HighlightCard.
 * In the future, move this shared configuration into a common
 * resultsStyles.ts file to avoid duplication.
 */
const categoryStyles = {
    common: {
        label: "Common",
        bg: "#DDF5E9",
        color: "#126B45",
    },
    "less-common": {
        label: "Less common",
        bg: "#FFF0C7",
        color: "#875000",
    },
    distinctive: {
        label: "Distinctive",
        bg: "#EFE7FF",
        color: "#6941A5",
    },
    "more-data-needed": {
        label: "More data needed",
        bg: "#DCEEFF",
        color: "#164D85",
    },
};

/*
 * Small reusable badge for an association's classification.
 */
const CategoryBadge = ({
    category,
}: {
    category: HighlightCategory;
}) => {
    const style = categoryStyles[category];

    return (
        <Chip
            label={style.label}
            size="small"
            sx={{
                bgcolor: style.bg,
                color: style.color,
                fontWeight: 700,
                fontSize: 11,
            }}
        />
    );
};

export const WordAssociationCard = ({
    item,
}: WordAssociationCardProps) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <Box
            sx={{
                border: "1px solid #D8E5F3",
                borderRadius: 2,
                bgcolor: "#FFFFFF",
                overflow: "hidden",
            }}
        >
            {/* Main card content: always visible */}
            <Stack spacing={1.5} sx={{ p: 2 }}>

                {/* Cue word and expand button */}
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Typography
                        sx={{
                            fontWeight: 800,
                            color: "#183B63",
                            fontSize: 15,
                        }}
                    >
                        {item.cueWord}
                    </Typography>

                    <IconButton
                        size="small"
                        onClick={() => setExpanded((previous) => !previous)}
                        aria-label={
                            expanded ? "Collapse details" : "Expand details"
                        }
                        sx={{
                            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.2s",
                        }}
                    >
                        <ExpandMoreIcon />
                    </IconButton>
                </Stack>

                {/* Participant associations */}
                <Box>
                    <Typography
                        sx={{
                            fontSize: 11,
                            color: "#7186A2",
                            mb: 1,
                        }}
                    >
                        YOUR ASSOCIATIONS
                    </Typography>

                    <Stack direction="row" flexWrap="wrap" gap={0.75}>
                        {item.associations.length > 0 ? (
                            item.associations.map((association, index) => (
                                <Chip
                                    key={`${association.word}-${index}`}
                                    label={association.word}
                                    size="small"
                                    sx={{
                                        bgcolor: "#E1EEFF",
                                        color: "#174B83",
                                        fontWeight: 600,
                                    }}
                                />
                            ))
                        ) : (
                            <Typography variant="caption" color="text.secondary">
                                No associations provided.
                            </Typography>
                        )}
                    </Stack>
                </Box>

                {/* Expandable details */}
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <Stack spacing={1.5} sx={{ pt: 1 }}>

                        <Typography
                            sx={{
                                fontSize: 12,
                                fontWeight: 800,
                                color: "#123F73",
                            }}
                        >
                            ASSOCIATION DETAILS
                        </Typography>

                        {item.associations.map((association, index) => (
                            <Box
                                key={`${association.word}-details-${index}`}
                                sx={{
                                    p: 1.5,
                                    bgcolor: "#F6F9FD",
                                    borderRadius: 2,
                                }}
                            >
                                <Stack
                                    direction="row"
                                    alignItems="baseline"
                                    flexWrap="wrap"
                                    columnGap={3}
                                    rowGap={0.5}
                                >
                                    <Typography
                                        fontWeight={700}
                                        fontSize={13}
                                        sx={{ minWidth: 110, overflowWrap: "anywhere" }}
                                    >
                                        {association.word}
                                    </Typography>

                                    {association.totalRespondents !== undefined &&
                                        association.totalRespondents > 0 &&
                                        association.matchingRespondents !== undefined ? (
                                        <Typography
                                            sx={{
                                                fontSize: 11,
                                                color: "#7186A2",
                                            }}
                                        >
                                            {association.matchingRespondents} of{" "}
                                            {association.totalRespondents} respondents
                                            ({Math.round(
                                                (association.matchingRespondents /
                                                    association.totalRespondents) *
                                                100
                                            )}%)
                                        </Typography>
                                    ) : (
                                        <Typography
                                            sx={{
                                                fontSize: 11,
                                                color: "#7186A2",
                                            }}
                                        >
                                            Insufficient comparison data
                                        </Typography>
                                    )}
                                </Stack>
                            </Box>
                        ))}
                    </Stack>
                </Collapse>
            </Stack>
        </Box>
    );
};
