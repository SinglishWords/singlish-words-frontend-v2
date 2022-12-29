import { useState } from "react";
import { Button, Stack } from "@mui/material";

import { ExpansionPanel } from "src/components/ExpansionPanel";
import { SearchBar } from "src/components/SearchBar";
import {
  useBackwardAssociation,
  useForwardAssociation,
} from "src/hooks/useAssociation";
import {
  replaceDashWithSpace,
  replaceSpaceWithDash,
} from "src/utils/logic/textTransformationLogic";

export const ExplorePage = () => {
  const [queryWord, setQueryWord] = useState<string>("");

  const { forwardAssociation } = useForwardAssociation(queryWord);
  const { backwardAssociation } = useBackwardAssociation(queryWord);

  const panels = [
    {
      header: "Word",
      body:
        queryWord === ""
          ? "The searched/shuffled word."
          : replaceDashWithSpace(queryWord),
    },
    {
      header: "Forward Associations",
      body:
        forwardAssociation && forwardAssociation.links.length !== 0
          ? forwardAssociation.nodes /* Omit the queried/random node in the panel */
              .filter((node) =>
                node.name === replaceDashWithSpace(queryWord) ? false : true
              )
              .map((node) => [
                <Button
                  size="small"
                  sx={{ fontWeight: 800 }}
                  onClick={() => {
                    setQueryWord(replaceSpaceWithDash(node.name));
                  }}
                >
                  {node.name}
                </Button>,
                node.value + "\t",
              ])
          : forwardAssociation && forwardAssociation.links.length === 0
          ? "Forward associations of the given word not found."
          : "The formation of an associative link between one item and an item that follows it in a series or sequence.",
    },
    {
      header: "Backward Associations",
      body:
        backwardAssociation && backwardAssociation.links.length !== 0
          ? backwardAssociation.nodes /* Omit the queried/random node in the panel */
              .filter((node) =>
                node.name === replaceDashWithSpace(queryWord) ? false : true
              )
              .map((node) => [
                <Button
                  size="small"
                  sx={{ fontWeight: 800 }}
                  onClick={() => {
                    setQueryWord(replaceSpaceWithDash(node.name));
                  }}
                >
                  {node.name}
                </Button>,
                "\t" + node.value + "\t",
              ])
          : backwardAssociation && backwardAssociation.links.length === 0
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
        queryWord={queryWord}
        setQueryWord={setQueryWord}
      />
      {panels.map((panel) => (
        <ExpansionPanel
          key={panel.header}
          header={panel.header}
          body={panel.body}
        />
      ))}
    </Stack>
  );
};
