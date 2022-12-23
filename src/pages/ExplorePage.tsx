import { useEffect, useState } from "react";
import { Stack } from "@mui/material";

import { ExpansionPanel } from "src/components/ExpansionPanel";
import { SearchBar } from "src/components/SearchBar";
import { GetAssociationRes } from "src/types/api/association.dto";
import {
  useBackwardAssociation,
  useForwardAssociation,
  useRandomAssociation,
} from "src/hooks/useAssociation";

export const ExplorePage = () => {
  const [currentWord, setCurrentWord] = useState<string>("");
  const [forward, setForward] = useState<GetAssociationRes>();
  const [backward, setBackward] = useState<GetAssociationRes>();

  const { randomAssociation } = useRandomAssociation();
  const { forwardAssociation } = useForwardAssociation(currentWord);
  const { backwardAssociation } = useBackwardAssociation(currentWord);

  useEffect(() => {
    setForward(forwardAssociation);
    setBackward(backwardAssociation);
  }, [forwardAssociation, backwardAssociation]);

  useEffect(() => {
    // TODO
    // To target forward and backward in random association once random association is consolidated into a single endpoint
    setForward(randomAssociation);
    setBackward(randomAssociation);
  }, [randomAssociation]);

  const panels = [
    {
      header: "Forward Associations",
      body:
        forward && forward.nodes.length !== 0
          ? forward.nodes.map((node) => node.name + " " + node.value + " | ")
          : forward && forward.nodes.length === 0
          ? "Forward associations of the word `" + currentWord + "` not found."
          : "The formation of an associative link between one item and an item that follows it in a series or sequence.",
    },
    {
      header: "Backward Associations",
      body:
        backward && backward.nodes.length !== 0
          ? backward.nodes.map((node) => node.name + " " + node.value + " | ")
          : backward && backward.nodes.length === 0
          ? "Backward associations of the word `" + currentWord + "` not found."
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
