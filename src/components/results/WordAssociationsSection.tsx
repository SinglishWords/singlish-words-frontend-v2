
import {
    Box,
    Chip,
    Collapse,
    IconButton,
    Stack,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { useState } from "react";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import {
    WordAssociationCard,
    WordAssociationItem,
} from "./WordAssociationCard";

import { HighlightCategory } from "./HighlightCard";


/*
 * Classification belongs to each association, not to the cue.
 * A single cue can have several associations with different categories.
 */
const categoryStyles = {
    common: {
        label: "common",
        bg: "#E1EEFF",
        color: "#174B83",
    },
    "less-common": {
        label: "rare",
        bg: "#FFF0E0",
        color: "#A64B12",
    },
    distinctive: {
        label: "unique",
        bg: "#FCE8D5",
        color: "#873D0C",
    },
    "more-data-needed": {
        label: "not enough data",
        bg: "#ECEFF2",
        color: "#596579",
    },
};

const AssociationStatus = ({
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
                fontSize: 10,
                height: 22,
            }}
        />
    );
};

/*
 * Desktop-only table row.
 *
 * Its expansion reveals the respondent count
 * for each individual association.
 */
const DesktopWordRow = ({
    item,
}: {
    item: WordAssociationItem;
}) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1.8fr 1.5fr 32px",
                    alignItems: "center",
                    gap: 1,
                    px: 2,
                    py: 1.25,
                    borderBottom: "1px solid #E3EAF2",
                }}
            >
                <Typography fontSize={13} fontWeight={700}>
                    {item.cueWord}
                </Typography>

                {/* Participant associations */}
                <Stack direction="row" flexWrap="wrap" gap={0.5}>
                    {item.associations.map((association, index) => (
                        <Chip
                            key={`${association.word}-${index}`}
                            label={association.word}
                            size="small"
                            sx={{
                                bgcolor: "#E1EEFF",
                                color: "#174B83",
                                fontSize: 11,
                            }}
                        />
                    ))}
                </Stack>

                {/* Individual association classifications */}
                <Stack spacing={0.5} sx={{ minWidth: 0 }}>
                    {item.associations.map((association, index) => (
                        <Stack
                            key={`${association.word}-status-${index}`}
                            direction="row"
                            alignItems="center"
                            spacing={0.75}
                            sx={{
                                minWidth: 0,
                                flexWrap: "wrap",
                            }}
                        >
                            <Typography
                                fontSize={11}
                                color="text.secondary"
                                sx={{ overflowWrap: "anywhere" }}
                            >
                                {association.word}
                            </Typography>

                            <AssociationStatus
                                category={association.category}
                            />
                        </Stack>
                    ))}

                    {item.associations.length === 0 && (
                        <Typography fontSize={11} color="text.secondary">
                            No associations
                        </Typography>
                    )}
                </Stack>

                {/* Expand / collapse */}
                <IconButton
                    size="small"
                    onClick={() => setExpanded((previous) => !previous)}
                    aria-label="Toggle association details"
                    sx={{
                        transform: expanded
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        transition: "transform 0.2s",
                    }}
                >
                    <ExpandMoreIcon />
                </IconButton>
            </Box>

            {/* Expanded association frequencies */}
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Box
                    sx={{
                        px: 2,
                        py: 1,
                        bgcolor: "#F6F9FD",
                        borderBottom: "1px solid #E3EAF2",
                    }}
                >
                    {item.associations.map((association, index) => (
                        <Stack
                            key={`${association.word}-desktop-${index}`}
                            direction="row"
                            alignItems="baseline"
                            flexWrap="wrap"
                            columnGap={3}
                            rowGap={0.5}
                            sx={{
                                py: 0.5,
                                minHeight: 30,
                                "&:not(:last-of-type)": {
                                    borderBottom: "1px solid #E3EAF2",
                                },
                            }}
                        >
                            {/* Association word */}
                            <Typography
                                fontSize={12}
                                fontWeight={600}
                                sx={{
                                    minWidth: 120,
                                    overflowWrap: "anywhere",
                                }}
                            >
                                {association.word}
                            </Typography>

                            {/* Respondent frequency */}
                            <Typography
                                fontSize={11}
                                color="text.secondary"
                            >
                                {association.matchingRespondents !== undefined &&
                                    association.totalRespondents !== undefined
                                    ? `${association.matchingRespondents} of ${association.totalRespondents} respondents`
                                    : "Insufficient comparison data"}
                            </Typography>
                        </Stack>
                    ))}
                </Box>
            </Collapse>
        </>
    );
};

type WordAssociationsSectionProps = {
    words: WordAssociationItem[];
};

export const WordAssociationsSection = ({
    words,
}: WordAssociationsSectionProps) => {
    const theme = useTheme();

    /*
     * Use the theme breakpoint to switch between desktop and mobile.
     * This ensures the table is not squeezed onto small screens.
     */
    const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

    return (
        <Stack spacing={1.5}>
            {/* Section heading */}
            <Stack spacing={0.25}>
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 700,
                        color: "#123F73",
                        fontSize: { xs: 21, sm: 23 },
                    }}
                >
                    Explore all your words
                </Typography>

                <Typography
                    sx={{
                        fontSize: 13,
                        color: "#7186A2",
                    }}
                >
                    See your responses and what we know so far.
                </Typography>
            </Stack>

            {isDesktop ? (
                /*
                 * DESKTOP TABLE
                 *
                 * Header and rows share the same grid column definition.
                 */
                <Box
                    sx={{
                        border: "1px solid #D8E5F3",
                        borderRadius: 2,
                        overflow: "hidden",
                        bgcolor: "#FFFFFF",
                    }}
                >
                    {/* Table header */}
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1.8fr 1.5fr 32px",
                            gap: 1,
                            px: 2,
                            py: 1.25,
                            bgcolor: "#EAF2FB",
                            color: "#123F73",
                            fontWeight: 800,
                            fontSize: 12,
                        }}
                    >
                        <Box>Cue word</Box>
                        <Box>Your association(s)</Box>
                        <Box>Association status</Box>
                        <Box />
                    </Box>

                    {/* Cue rows */}
                    {words.map((item) => (
                        <DesktopWordRow
                            key={item.cueWord}
                            item={item}
                        />
                    ))}
                </Box>
            ) : (
                /*
                 * MOBILE LAYOUT
                 *
                 * Each cue becomes its own expandable card.
                 */
                <Stack spacing={1.25}>
                    {words.map((item) => (
                        <WordAssociationCard
                            key={item.cueWord}
                            item={item}
                        />
                    ))}
                </Stack>
            )}
        </Stack>
    );
};
