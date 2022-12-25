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
  const [queryWord, setQueryWord] = useState<string>("");
  const [randomWord, setRandomWord] = useState<string>("");
  const [isQueryWord, setIsQueryWord] = useState<boolean | undefined>(
    undefined
  );
  const [forward, setForward] = useState<GetAssociationRes>();
  const [backward, setBackward] = useState<GetAssociationRes>();

  const { randomAssociation } = useRandomAssociation();
  const { forwardAssociation } = useForwardAssociation(queryWord);
  const { backwardAssociation } = useBackwardAssociation(queryWord);

  useEffect(() => {
    setForward(forwardAssociation);
    setBackward(backwardAssociation);
  }, [forwardAssociation, backwardAssociation]);

  useEffect(() => {
    /* Condition "isQueryWord !== undefined" prevents auto-population 
    of state (if randomAssociation already exist) on page render. Without condition,
    randomAssociation is automatically set when we click shuffle in Explore page, move 
    to the Visualise page and back to the Explore page. isQueryWord will be initialised 
    to "undefined" on Explore page render */
    if (isQueryWord !== undefined) {
      setForward(randomAssociation && randomAssociation.forward);
      setBackward(randomAssociation && randomAssociation.backward);
      setRandomWord((randomAssociation && randomAssociation.word) || "");
    }
  }, [randomAssociation]);

  const panels = [
    {
      header: "Word",
      /* If query word is undefined, default to the string "The searched/shuffled word". 
      Otherwise check if the word is queried or random. If it is a random word, we need to
      rely on the API response field "word" to check what word it is using randomWord. If
      it is a queried word, the queryWord which comes from the query params of the API call will 
      be rendered on the body */
      body:
        isQueryWord === undefined
          ? "The searched/shuffled word."
          : isQueryWord
          ? queryWord
          : randomWord,
    },
    {
      header: "Forward Associations",
      body:
        forward && forward.nodes.length !== 0
          ? forward.nodes /* Omit the queried/random node in the panel */
              .filter((node) =>
                node.name === queryWord || node.name === randomWord
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
          ? backward.nodes /* Omit the queried/random node in the panel */
              .filter((node) =>
                node.name === queryWord || node.name === randomWord
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
        queryWord={queryWord}
        setQueryWord={setQueryWord}
        setIsQueryWord={setIsQueryWord}
      />
      {panels.map((panel) => (
        <ExpansionPanel key={panel.header} panel={panel} />
      ))}
    </Stack>
  );
};
