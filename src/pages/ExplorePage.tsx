import { Stack } from "@mui/material";

import { ExpansionPanel } from "src/components/ExpansionPanel";
import { SearchBar } from "src/components/SearchBar";

export const ExplorePage = () => {
  const panels = ["Forward Associations", "Backward Associations"];

  return (
    <Stack sx={{ width: "60%", alignSelf: "center", pb: 10 }}>
      <SearchBar page="Explore" />
      {panels.map((title) => (
        <ExpansionPanel key={title} title={title} />
      ))}
    </Stack>
  );
};
