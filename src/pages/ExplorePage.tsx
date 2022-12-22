import { useState } from "react";
import { Stack } from "@mui/material";

import { ExpansionPanel } from "src/components/ExpansionPanel";
import { SearchBar } from "src/components/SearchBar";
import {
  useRandomAssociation,
  useForwardAssociation,
  useBackwardAssociation,
} from "src/hooks/useAssociation";

export const ExplorePage = () => {
  const [currentWord, setCurrentWord] = useState<string>("");
  const { randomAssociation } = useRandomAssociation();
  const { forwardAssociation } = useForwardAssociation(currentWord);
  const { backwardAssociation } = useBackwardAssociation(currentWord);

  const panels = [
    {
      header: "Forward Associations",
      body: forwardAssociation
        ? forwardAssociation.nodes.map(
            (node) => node.name + " " + node.value + " | "
          )
        : "The formation of an associative link between one item and an item that follows it in a series or sequence.",
    },
    {
      header: "Backward Associations",
      body: backwardAssociation
        ? backwardAssociation.nodes.map(
            (node) => node.name + " " + node.value + " | "
          )
        : "The formation of an associative link between an item and the one preceding it in a series or sequence.",
    },
  ];

  return (
    <Stack
      sx={{
        width: { xs: "80%", sm: "60%" },
        alignSelf: "center",
        pb: 10,
        minHeight: "100vh",
      }}
    >
      <SearchBar page="Explore" setCurrentWord={setCurrentWord} />
      {panels.map((panel) => (
        <ExpansionPanel key={panel.header} panel={panel} />
      ))}
    </Stack>
  );
};
