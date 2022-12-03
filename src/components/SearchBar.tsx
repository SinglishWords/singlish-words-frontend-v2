import { useState } from "react";
import { Box, Fade, Modal, Stack, TextField, Typography } from "@mui/material";
import { Download, Shuffle, Settings } from "@mui/icons-material";

import { Dropdown } from "src/components/Dropdown";
import { UtilityButton } from "src/components/UtilityButton";

type SearchBarProps = {
  page: string;
};

export const SearchBar = ({ page }: SearchBarProps) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const handleChange = () => {
    setExpanded(!expanded);
  };

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={{ xs: 2, sm: 0 }}
      sx={{ justifyContent: { sm: "space-between" } }}
    >
      <TextField label="Search" variant="outlined" />
      <Stack spacing={1} direction="row" sx={{ justifyContent: "center" }}>
        <UtilityButton title="Download" Icon={Download} />
        <UtilityButton title="Shuffle" Icon={Shuffle} />
        {page === "Visualise" ? (
          <Stack sx={{ justifyContent: "center" }}>
            <UtilityButton
              title="Options"
              Icon={Settings}
              onClick={handleChange}
            />
            <Modal open={expanded} onClose={handleChange}>
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
                        value={""}
                        name={"relation_type"}
                        // onChange={}
                        listData={[
                          "Forward Associations",
                          "Backward Associations",
                        ]}
                      />
                    </Stack>
                    <Stack spacing={2}>
                      <Typography variant="body2">
                        Visualisation Type
                      </Typography>
                      <Dropdown
                        required={true}
                        helperText={"Select a visualisation type"}
                        value={""}
                        name={"visualisation_type"}
                        // onChange={}
                        listData={["One-hop Network"]}
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
