import { Stack, Typography } from "@mui/material";

import { ExpansionPanel } from "src/components/ExpansionPanel";
import { NetworkChart } from "src/components/NetworkChart";
import { SearchBar } from "src/components/SearchBar";

export const VisualisePage = () => {
  const panels = [
    {
      header: "Legend 1",
      body: "Some Text",
    },
    {
      header: "Legend 2",
      body: "Some Text",
    },
    {
      header: "Legend 3",
      body: "Some Text",
    },
  ];

  return (
    <Stack
      spacing={4}
      sx={{ width: { xs: "80%", sm: "60%" }, alignSelf: "center", pb: 10 }}
    >
      {/* <SearchBar page="Visualise" /> */}
      <Typography variant="body1" sx={{ alignSelf: "start" }}>
        Visualization: <i>One-hop network </i>
        <br />
        Relation: <i>Forward associations</i>
      </Typography>
      <NetworkChart />
      <Stack spacing={2}>
        {panels.map((panel) => (
          <ExpansionPanel key={panel.header} panel={panel} />
        ))}
      </Stack>
    </Stack>
  );
};
