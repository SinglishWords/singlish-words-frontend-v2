import { useEffect, useRef, useState } from "react";
import { Box, Fade, Modal, Stack, TextField, Typography } from "@mui/material";
import { Download, Shuffle, Settings } from "@mui/icons-material";

import { Dropdown } from "src/components/Dropdown";
import { UtilityButton } from "src/components/UtilityButton";
import { useRandomAssociation } from "src/hooks/useAssociation";
import {
  useDownloadForwardAssociation,
  useDownloadBackwardAssociation,
} from "src/hooks/useDownload";
import { replaceSpaceWithDash } from "src/utils/logic/textTransformationLogic";

type SearchBarProps = {
  page: string;
  queryWord: string;
  relation?: string;
  setQueryWord: React.Dispatch<React.SetStateAction<string>>;
  setRelation?: React.Dispatch<React.SetStateAction<string>>;
};

export const SearchBar = ({
  page,
  relation,
  queryWord,
  setQueryWord,
  setRelation,
}: SearchBarProps) => {
  const [text, setText] = useState<string>("");
  const [expanded, setExpanded] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { randomAssociation, refetchRandomWord } = useRandomAssociation();
  const { downloadForwardAssociation } =
    useDownloadForwardAssociation(queryWord);
  const { downloadBackwardAssociation } =
    useDownloadBackwardAssociation(queryWord);

  useEffect(() => {
    randomAssociation &&
      setQueryWord(
        replaceSpaceWithDash(randomAssociation && randomAssociation.word)
      );
  }, [randomAssociation, setQueryWord]);

  const handleModalChange = () => {
    setExpanded(!expanded);
  };

  const handleShuffleClick = () => {
    refetchRandomWord();
  };

  const download = (data: BlobPart, relation: string) => {
    const blob = new Blob([data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `${relation}_${queryWord}.csv`);
    a.click();
  };

  const handleDownloadClick = () => {
    if (page === "Explore") {
      downloadForwardAssociation &&
        download(downloadForwardAssociation, "forward");
      downloadBackwardAssociation &&
        download(downloadBackwardAssociation, "backward");
    } else if (page === "Visualise") {
      if (relation === "Forward Associations") {
        downloadForwardAssociation &&
          download(downloadForwardAssociation, "forward");
      } else if (relation === "Backward Associations") {
        downloadBackwardAssociation &&
          download(downloadBackwardAssociation, "backward");
      }
    }
  };

  /* Update text field value, but don't call association API yet */
  const handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setText(event.target.value);
  };

  /* Call association API when user press `Enter` on keyboard */
  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      setQueryWord(replaceSpaceWithDash(text).toLowerCase());
      /* Remove text from search bar once the entered key is pressed */
      if (inputRef.current) inputRef.current.value = "";
    }
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
        label="Search"
        variant="outlined"
        inputRef={inputRef}
        onChange={handleTextFieldChange}
        onKeyPress={handleKeyPress}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <Stack spacing={1} direction="row" sx={{ justifyContent: "center" }}>
        <UtilityButton
          title="Download"
          Icon={Download}
          onClick={handleDownloadClick}
        />
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
