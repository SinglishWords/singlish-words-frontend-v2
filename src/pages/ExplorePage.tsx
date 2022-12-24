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
  const [searchWord, setSearchWord] = useState<string>("");
  const [randomWord, setRandomWord] = useState<string>("");
  const [forward, setForward] = useState<GetAssociationRes>();
  const [backward, setBackward] = useState<GetAssociationRes>();

  var { randomAssociation } = useRandomAssociation();
  const { forwardAssociation } = useForwardAssociation(searchWord);
  const { backwardAssociation } = useBackwardAssociation(searchWord);

  useEffect(() => {
    setForward(forwardAssociation);
    setBackward(backwardAssociation);
  }, [forwardAssociation, backwardAssociation]);

  useEffect(() => {
    setForward(randomAssociation && randomAssociation.forward);
    setBackward(randomAssociation && randomAssociation.backward);
    setRandomWord((randomAssociation && randomAssociation.word) || "");
  }, [randomAssociation]);

  const panels = [
    {
      header: "Forward Associations",
      body:
        forward && forward.nodes.length !== 0
          ? forward.nodes // Omit subject node with filter
              .filter((node) =>
                node.name === searchWord || node.name === randomWord
                  ? false
                  : true
              )
              .map((node) => node.name + " " + node.value + " | ")
          : forward && forward.nodes.length === 0
          ? "Forward associations of the given word not found."
          : "The formation of an associative link between one item and an item that follows it in a series or sequence.",
    },
    {
      header: "Backward Associations",
      body:
        backward && backward.nodes.length !== 0
          ? backward.nodes // Omit subject node with filter
              .filter((node) =>
                node.name === searchWord || node.name === randomWord
                  ? false
                  : true
              )
              .map((node) => node.name + " " + node.value + " | ")
          : backward && backward.nodes.length === 0
          ? "Backward associations of the given word not found."
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
      <SearchBar
        page="Explore"
        searchWord={searchWord}
        setSearchWord={setSearchWord}
      />
      {panels.map((panel) => (
        <ExpansionPanel key={panel.header} panel={panel} />
      ))}
    </Stack>
  );
};
