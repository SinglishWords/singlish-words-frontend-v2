
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Stack,
    Typography,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

/*
 * This component explains how participants should interpret
 * the results displayed above.
 *
 * IMPORTANT:
 * The exact classification thresholds are not final yet.
 * Once the research team approves them, update this explanation
 * to match the actual calculation logic.
 */
const explanationItems = [
    {
        title: "How are my associations compared?",
        content:
            "Your responses are compared with associations provided by other participants for the same cue word. We look at how frequently each association appears in the available responses.",
    },
    {
        title: "What does Common mean?",
        content:
            "Your association has been provided by a relatively large proportion of respondents for that cue word. This indicates that the association is frequently observed in the current sample.",
    },
    {
        title: "What does Rare mean?",
        content:
            "Your association has been observed, but it appears less frequently than more common associations in the current sample.This means that your response is shared by some other participants, but is a more distinctive way of associating with this word.",
    },
    {
        title: "What does Unique mean?",
        content:
            "You were the first person to provide this association. However, with more data and more participants, it is possible that someone else might produce this same association eventually.",
    },
    {
        title: "Why does an association need more data?",
        content:
            "Some cue words have fewer responses than others. When there are not enough responses to make a meaningful comparison, we avoid assigning a frequency-based classification. As more people participate, we may be able to provide a clearer picture.",
    },
    {
        title: "Does this mean my association is right or wrong?",
        content:
            "No. Word associations are personal responses. There are no right or wrong answers. The purpose of this study is to understand the connections people make between words and concepts in Singapore English.",
    },
];

export const ResultsExplanation = () => {
    return (
        <Box
            sx={{
                border: "1px solid #D8E5F3",
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: "#EFF6FE",
            }}
        >
            <Accordion
                disableGutters
                elevation={0}
                sx={{
                    bgcolor: "transparent",
                    "&:before": {
                        display: "none",
                    },
                }}
            >
                {/* Accordion heading */}
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: "#174B83" }} />}
                    sx={{
                        px: 2,
                        minHeight: 48,
                        "& .MuiAccordionSummary-content": {
                            my: 1.25,
                        },
                    }}
                >
                    <Stack direction="row" alignItems="center" gap={1.25}>
                        <Box
                            sx={{
                                width: 24,
                                height: 24,
                                border: "2px solid #2869A5",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#2869A5",
                                fontSize: 14,
                                fontWeight: 800,
                                flexShrink: 0,
                            }}
                        >
                            ?
                        </Box>

                        <Typography
                            sx={{
                                fontSize: 13,
                                fontWeight: 800,
                                color: "#123F73",
                            }}
                        >
                            How are these results calculated?
                        </Typography>
                    </Stack>
                </AccordionSummary>

                {/* Expandable explanation content */}
                <AccordionDetails sx={{ px: 2, pb: 2 }}>
                    <Stack spacing={1}>
                        {explanationItems.map((item) => (
                            <Box key={item.title} sx={{ py: 0.75 }}>
                                <Typography
                                    sx={{
                                        fontSize: 13,
                                        fontWeight: 800,
                                        color: "#123F73",
                                        mb: 0.5,
                                    }}
                                >
                                    {item.title}
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: 12,
                                        lineHeight: 1.7,
                                        color: "#465E79",
                                    }}
                                >
                                    {item.content}
                                </Typography>
                            </Box>
                        ))}

                        {/* Research transparency note */}
                        <Typography
                            sx={{
                                fontSize: 11,
                                color: "#7186A2",
                                pt: 1,
                                borderTop: "1px solid #D8E5F3",
                            }}
                        >
                            These results reflect the responses collected so far.
                            They may change as more participants contribute.
                        </Typography>
                    </Stack>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};
