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

export const VisualisePage = () => {
  const [currentWord, setCurrentWord] = useState<string>("");
  const [relation, setRelation] = useState<string>("Forward Associations");
  const [association, setAssociation] = useState<GetAssociationRes>();
  console.log(association);

  const { randomAssociation } = useRandomAssociation();
  const { forwardAssociation } = useForwardAssociation(currentWord);
  const { backwardAssociation } = useBackwardAssociation(currentWord);

  useEffect(() => {
    if (relation === "Forward Associations") {
      setAssociation(forwardAssociation);
    } else if (relation === "Backward Associations") {
      setAssociation(backwardAssociation);
    } else {
      return;
    }
  }, [forwardAssociation, backwardAssociation, relation]);

  useEffect(() => {
    // TODO
    // To target forward and backward in random association (eg randomAssociation.forward/randomAssociation.backward)
    // once random association is consolidated into a single endpoint
    if (relation === "Forward Associations") {
      setAssociation(randomAssociation);
    } else if (relation === "Backward Associations") {
      setAssociation(randomAssociation);
    } else {
      return;
    }
  }, [randomAssociation]);

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
        setCurrentWord={setCurrentWord}
        setRelation={setRelation}
      />
      <Typography variant="body1" sx={{ alignSelf: "start" }}>
        Visualisation: <i>One-hop Network</i>
        <br />
        Relation: <i>{relation}</i>
      </Typography>
      <NetworkChart />
      <Stack spacing={2}>
        {panels.map((panel) => (
          <ExpansionPanel key={panel.header} panel={panel} />
        ))}
      </Stack>
    </Stack>
  );
};
