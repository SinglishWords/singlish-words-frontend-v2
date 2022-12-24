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

    // Normalise to range of 0 and 50
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

    // Convert 0 to 5
    association.nodes.map((node) => {
      if (node.symbolSize < 5) {
        node.symbolSize = 5;
      }
      return node;
    });

    return association;
  }
};

export const VisualisePage = () => {
  const [currentWord, setCurrentWord] = useState<string>("");
  const [relation, setRelation] = useState<string>("Forward Associations");
  const [association, setAssociation] = useState<GetAssociationRes>();

  const { randomAssociation } = useRandomAssociation();
  const { forwardAssociation } = useForwardAssociation(currentWord);
  const { backwardAssociation } = useBackwardAssociation(currentWord);
  normalize(association);

  useEffect(() => {
    if (relation === "Forward Associations") {
      // TODO
      // SET CURRENT WORD
      setAssociation(forwardAssociation);
    } else if (relation === "Backward Associations") {
      // TODO
      // SET CURRENT WORD
      setAssociation(backwardAssociation);
    } else {
      return;
    }
  }, [forwardAssociation, backwardAssociation, relation]);

  useEffect(() => {
    if (relation === "Forward Associations") {
      setAssociation(randomAssociation && randomAssociation.forward);
      setCurrentWord((randomAssociation && randomAssociation.word) || "");
    } else if (relation === "Backward Associations") {
      setAssociation(randomAssociation && randomAssociation.backward);
      setCurrentWord((randomAssociation && randomAssociation.word) || "");
    } else {
      return;
    }
  }, [randomAssociation, relation]);

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
        currentWord={currentWord}
        setCurrentWord={setCurrentWord}
        relation={relation}
        setRelation={setRelation}
      />
      <Typography variant="body1" sx={{ alignSelf: "start" }}>
        Visualisation: <i>One-hop Network</i>
        <br />
        Relation: <i>{relation}</i>
      </Typography>
      <NetworkChart association={association} />
      <Stack spacing={2}>
        {panels.map((panel) => (
          <ExpansionPanel key={panel.header} panel={panel} />
        ))}
      </Stack>
    </Stack>
  );
};
