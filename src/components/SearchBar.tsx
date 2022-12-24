import { useState } from "react";
import { Box, Fade, Modal, Stack, TextField, Typography } from "@mui/material";
import { Download, Shuffle, Settings } from "@mui/icons-material";

import { Dropdown } from "src/components/Dropdown";
import { UtilityButton } from "src/components/UtilityButton";
import { useRandomAssociation } from "src/hooks/useAssociation";

type SearchBarProps = {
  page: string;
  currentWord: string;
  relation?: string;
  setCurrentWord: React.Dispatch<React.SetStateAction<string>>;
  setVisualisation?: React.Dispatch<React.SetStateAction<string>>;
  setRelation?: React.Dispatch<React.SetStateAction<string>>;
};

export const SearchBar = ({
  page,
  currentWord,
  relation,
  setCurrentWord,
  setRelation,
}: SearchBarProps) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const { refetchRandomWord } = useRandomAssociation();

  const handleModalChange = () => {
    setExpanded(!expanded);
  };

  const handleShuffleClick = () => {
    refetchRandomWord();
  };

  /* Update text field value, but don't call association API yet */
  const handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCurrentWord(event.target.value.replace(/\s+/g, "-").toLowerCase());
  };

  const handleVisualisationChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setRelation && setRelation(event.target.value);
  };

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={{ xs: 2, sm: 0 }}
      sx={{ justifyContent: { sm: "space-between" } }}
    >
      <TextField
        value={currentWord}
        label="Search"
        variant="outlined"
        onChange={handleTextFieldChange}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <Stack spacing={1} direction="row" sx={{ justifyContent: "center" }}>
        <UtilityButton title="Download" Icon={Download} />
        <UtilityButton
          title="Shuffle"
          Icon={Shuffle}
          onClick={handleShuffleClick}
        />
        {page === "Visualise" ? (
          <Stack sx={{ justifyContent: "center" }}>
            <UtilityButton
              title="Options"
              Icon={Settings}
              onClick={handleModalChange}
            />
            <Modal open={expanded} onClose={handleModalChange}>
              <Fade in={expanded}>
                <Box
                  sx={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    border: "1px solid rgba(0,0,0,0.23)",
                    borderRadius: 1,
                    p: 4,
                  }}
                >
                  <Stack
                    spacing={3}
                    sx={{ "& .MuiTypography-root": { alignSelf: "start" } }}
                  >
                    <Typography variant="h5">Options</Typography>
                    <Stack spacing={2}>
                      <Typography variant="body2">Relation Type</Typography>
                      <Dropdown
                        required={true}
                        helperText={"Select a relation type"}
                        value={relation || ""}
                        name={"relationType"}
                        handleChange={handleVisualisationChange}
                        listData={[
                          "Forward Associations",
                          "Backward Associations",
                        ]}
                      />
                    </Stack>
                  </Stack>
                </Box>
              </Fade>
            </Modal>
          </Stack>
        ) : null}
      </Stack>
    </Stack>
  );
};
