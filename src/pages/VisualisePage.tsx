import { Stack, Typography } from "@mui/material";

import { ExpansionPanel } from "src/components/ExpansionPanel";
import { NetworkChart } from "src/components/NetworkChart";
import { SearchBar } from "src/components/SearchBar";

export const VisualisePage = () => {
  const panels = ["Legend 1", "Legend 2", "Legend 3"];

  return (
    <Stack spacing={4} sx={{ width: "60%", alignSelf: "center", pb: 10 }}>
      <SearchBar page="Visualise" />
      <Typography variant="body1" sx={{ alignSelf: "start" }}>
        Visualization: <i>One-hop network </i>| Relation:{" "}
        <i>Forward associations</i>
      </Typography>
      <NetworkChart />
      <Stack spacing={2}>
        {panels.map((title) => (
          <ExpansionPanel key={title} title={title} />
        ))}
      </Stack>
    </Stack>
  );
};
