import { useEffect, useState } from "react";
import { Stack, Typography } from "@mui/material";

import { ExpansionPanel } from "src/components/ExpansionPanel";
import { NetworkChart } from "src/components/NetworkChart";
import { SearchBar } from "src/components/SearchBar";
import { GetAssociationRes } from "src/types/api/association.dto";
import {
  useBackwardAssociation,
  useForwardAssociation,
  useRandomAssociation,
} from "src/hooks/useAssociation";
import { replaceDashWithSpace } from "src/utils/logic/textTransformationLogic";

// TODO - Figure out how to normalize properly / normalize on the backend
const normalize = (association: GetAssociationRes | undefined) => {
  if (association) {
    // Get min max (Excluiding subject node)
    var max = -1;
    var min = 10000000000;
    association.nodes.map((node) => {
      if (node.symbolSize === 10000000000) {
      }
      if (node.symbolSize > max) {
        max = node.symbolSize;
      }
      if (node.symbolSize < min) {
        min = node.symbolSize;
      }
      return node;
    });

    // Normalise to range of 0 and 60
    association.nodes.map((node) => {
      if (node.symbolSize === 10000000000) {
        node.symbolSize = 60;
        return node;
      } else {
        node.symbolSize = Math.round(
          ((node.symbolSize - min) / (max - min)) * 60
        );
        return node;
      }
    });

    // Convert 0 to 20
    association.nodes.map((node) => {
      if (node.symbolSize < 20) {
        node.symbolSize = 20;
      }
      return node;
    });

    return association;
  }
};

export const VisualisePage = () => {
  const [queryWord, setQueryWord] = useState<string>("");
  const [randomWord, setRandomWord] = useState<string>("");
  const [isQueryWord, setIsQueryWord] = useState<boolean | undefined>(
    undefined
  );
  const [relation, setRelation] = useState<string>("Forward Associations");
  const [association, setAssociation] = useState<GetAssociationRes>();

  const { randomAssociation } = useRandomAssociation();
  const { forwardAssociation } = useForwardAssociation(queryWord);
  const { backwardAssociation } = useBackwardAssociation(queryWord);
  normalize(association);
  console.log(association);

  useEffect(() => {
    /* If the page is initialised and a word is queried, run this hook. */
    if (isQueryWord && isQueryWord !== undefined) {
      if (relation === "Forward Associations") {
        setAssociation(forwardAssociation);
      } else if (relation === "Backward Associations") {
        setAssociation(backwardAssociation);
      } else {
        return;
      }
    } else {
      return;
    }
  }, [forwardAssociation, backwardAssociation, relation, isQueryWord]);

  useEffect(() => {
    /* If the page is initialised and a word is randomized, run this hook */
    if (!isQueryWord && isQueryWord !== undefined) {
      if (relation === "Forward Associations") {
        setAssociation(randomAssociation && randomAssociation.forward);
        setRandomWord((randomAssociation && randomAssociation.word) || "");
      } else if (relation === "Backward Associations") {
        setAssociation(randomAssociation && randomAssociation.backward);
        setRandomWord((randomAssociation && randomAssociation.word) || "");
      } else {
        return;
      }
    } else {
      return;
    }
  }, [randomAssociation, relation, isQueryWord]);

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
      <SearchBar
        page="Visualise"
        queryWord={queryWord}
        relation={relation}
        setIsQueryWord={setIsQueryWord}
        setQueryWord={setQueryWord}
        setRelation={setRelation}
      />
      <Typography variant="body1" sx={{ alignSelf: "start" }}>
        Word:{" "}
        <i>
          {/*  If query word is undefined, default empty string. Otherwise check if 
          the word is queried or random. */}
          {isQueryWord === undefined
            ? ""
            : isQueryWord
            ? replaceDashWithSpace(queryWord)
            : randomWord}
        </i>
        <br />
        Visualisation: <i>One-hop Network</i>
        <br />
        Relation: <i>{relation}</i>
      </Typography>
      {association?.nodes.length === 0 ? (
        <Typography variant="body1" sx={{ alignSelf: "center", color: "red" }}>
          No associations found!
        </Typography>
      ) : (
        <NetworkChart association={association} />
      )}
      <Stack spacing={2}>
        {panels.map((panel) => (
          <ExpansionPanel key={panel.header} panel={panel} />
        ))}
      </Stack>
    </Stack>
  );
};
