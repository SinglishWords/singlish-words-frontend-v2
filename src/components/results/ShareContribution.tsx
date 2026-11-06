
import { useRef, useState } from "react";
import {
    Box,
    Button,
    Stack,
    Typography,
    Snackbar,
} from "@mui/material";

import { ContributionCard } from "./ContributionCard";
import {
    exportCardAsPng,
    downloadBlob,
} from "./shareCardUtils";

import {
    WordAssociationItem,
} from "./WordAssociationCard";
import type { ShareAssociation } from "src/utils/logic/resultsLogic";

type ShareContributionProps = {
    participantName?: string;
    shareAssociations: ShareAssociation[];
    associationsContributed: number;
    cueWordsExplored: number;
};

const ShareContribution = ({
    participantName,
    shareAssociations,
    associationsContributed,
    cueWordsExplored,
}: ShareContributionProps) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const [isExporting, setIsExporting] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const SHARE_URL = "https://singlishwords.nus.edu.sg/";

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(SHARE_URL);
            setIsCopied(true);
        } catch (error) {
            console.error("Failed to copy study link:", error);
            alert("Unable to copy the link. Please copy it manually.");
        }
    };

    const handleDownload = async () => {
        if (!cardRef.current) return;

        try {
            setIsExporting(true);

            const blob = await exportCardAsPng(cardRef.current);

            downloadBlob(blob, "my-singlishwords-contribution.png");
        } catch (error) {
            console.error("Failed to export contribution card:", error);

            const errorMessage =
                error instanceof Error ? error.message : String(error);

            alert(`Unable to generate your card: ${errorMessage}`);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Stack spacing={3} alignItems="center">
                <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h5" fontWeight={700}>
                        Share your contribution
                    </Typography>

                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                        Show your Singlish word associations and invite others
                        to participate.
                    </Typography>
                </Box>

                {/* Responsive card preview */}
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        overflow: "hidden",
                    }}
                >
                    <Box
                        sx={{
                            width: 360,
                            maxWidth: "100%",
                        }}
                    >
                        <Box
                            ref={cardRef}
                            sx={{
                                width: 360,
                                transform: {
                                    xs: "scale(0.85)",
                                    sm: "scale(1)",
                                },
                                transformOrigin: "top left",
                                mb: { xs: -8, sm: 0 },
                            }}
                        >
                            <ContributionCard
                                participantName={participantName}
                                shareAssociations={shareAssociations}
                                associationsContributed={associationsContributed}
                                cueWordsExplored={cueWordsExplored}
                            />
                        </Box>
                    </Box>
                </Box>

                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    sx={{ width: "100%", maxWidth: 360 }}
                >
                    <Button
                        variant="contained"
                        onClick={handleDownload}
                        disabled={isExporting}
                        fullWidth
                    >
                        {isExporting ? "Generating image..." : "Download card"}
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={handleCopyLink}
                        fullWidth
                    >
                        {isCopied ? "Link copied!" : "Copy link"}
                    </Button>
                </Stack>

                <Snackbar
                    open={isCopied}
                    autoHideDuration={2500}
                    onClose={() => setIsCopied(false)}
                    message="SinglishWords link copied to clipboard!"
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                    }}
                />
            </Stack>
        </Box>
    );
};

export default ShareContribution;
