
import { Box, Stack, Typography } from "@mui/material";

import {
    HighlightCard,
    HighlightCardData,
} from "./HighlightCard";

type HighlightSectionProps = {
    highlights: HighlightCardData[];
};

const selectHighlights = (
    items: HighlightCardData[]
): HighlightCardData[] => {
    const common = items
        .filter(item => item.category === "common")
        .sort(
            (a, b) =>
                (b.matchingRespondents ?? 0) / (b.totalRespondents ?? 1) -
                (a.matchingRespondents ?? 0) / (a.totalRespondents ?? 1)
        )
        .slice(0, 3);

    const rare = items
        .filter(item => item.category === "less-common")
        .sort(
            (a, b) =>
                (a.matchingRespondents ?? 0) -
                (b.matchingRespondents ?? 0)
        )
        .slice(0, 1);

    const unique = items
        .filter(item => item.category === "distinctive")
        .slice(0, 1);

    return [...common, ...rare, ...unique];
};

export const HighlightSection = ({
    highlights,
}: HighlightSectionProps) => {
    const selectedHighlights = selectHighlights(highlights);
    if (selectedHighlights.length === 0) {
        return null;
    }

    return (
        <Stack spacing={1.75}>
            <Typography
                variant="h5"
                sx={{
                    fontWeight: 700,
                    color: "#123F73",
                    fontSize: { xs: 21, sm: 23 },
                }}
            >
                A few things we found
            </Typography>

            {selectedHighlights.length === 0 ? (
                <Typography color="text.secondary" fontSize={13}>
                    No highlights are available yet. More responses will help
                    us discover patterns in your associations.
                </Typography>
            ) : (
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "minmax(0, 1fr)",
                            sm: "repeat(2, minmax(0, 1fr))",
                            lg: "repeat(3, minmax(0, 1fr))",
                        },
                        gap: 1.75,
                        alignItems: "stretch",
                        minWidth: 0,
                        width: "100%",
                    }}
                >
                    {selectedHighlights.map((item, index) => (
                        <Box
                            key={`${item.cueWord}-${item.association}-${index}`}
                            sx={{ minWidth: 0, display: "flex" }}
                        >
                            <HighlightCard item={item} />
                        </Box>
                    ))}
                </Box>
            )}
        </Stack>
    );
};
