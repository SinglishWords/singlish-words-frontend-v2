import { Stack } from "@mui/material";

import { ExpansionPanel } from "src/components/ExpansionPanel";
import { SearchBar } from "src/components/SearchBar";

export const ExplorePage = () => {
  const panels = ["Forward Associations", "Backward Associations"];

  return (
    <Stack sx={{ width: "60%", alignSelf: "center" }}>
      <SearchBar page="Explore" />
      {panels.map((title) => (
        <ExpansionPanel title={title} />
      ))}
    </Stack>
  );
};
