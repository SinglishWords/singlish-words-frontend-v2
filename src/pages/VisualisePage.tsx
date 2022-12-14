import { useEffect, useState } from "react";
import { Stack, Typography } from "@mui/material";
import DOMPurify from "dompurify";
import parse from "html-react-parser";

import { ExpansionPanel } from "src/components/ExpansionPanel";
import { NetworkChart } from "src/components/NetworkChart";
import { SearchBar } from "src/components/SearchBar";
import { GetAssociationRes } from "src/types/api/association.dto";
import {
  useBackwardAssociation,
  useForwardAssociation,
} from "src/hooks/useAssociation";
import { replaceDashWithSpace } from "src/utils/logic/textTransformationLogic";
import { data } from "src/utils/data";

export const VisualisePage = () => {
  const [queryWord, setQueryWord] = useState<string>("");
  const [relation, setRelation] = useState<string>("Forward Associations");
  const [association, setAssociation] = useState<GetAssociationRes>();

  const { forwardAssociation } = useForwardAssociation(queryWord);
  const { backwardAssociation } = useBackwardAssociation(queryWord);

  useEffect(() => {
    if (relation === "Forward Associations") {
      setAssociation(forwardAssociation);
    } else if (relation === "Backward Associations") {
      setAssociation(backwardAssociation);
    } else {
      return;
    }
  }, [forwardAssociation, backwardAssociation, relation]);

  const panels = [
    {
      header: data.visualisePage.panels.firstHeader,
      body: data.visualisePage.panels.firstBody,
    },
    {
      header: data.visualisePage.panels.secondHeader,
      body: data.visualisePage.panels.secondBody,
    },
    {
      header: data.visualisePage.panels.thirdHeader,
      body: data.visualisePage.panels.thirdBody,
    },
    {
      header: data.visualisePage.panels.fourthHeader,
      body: data.visualisePage.panels.fourthBody,
    },
    {
      header: data.visualisePage.panels.fifthHeader,
      body: data.visualisePage.panels.fifthBody,
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
        setQueryWord={setQueryWord}
        setRelation={setRelation}
      />
      {queryWord === "" ? (
        <Stack sx={{ bgcolor: "lightgrey", p: 3 }}>
          <Typography>
            {parse(DOMPurify.sanitize(data.visualisePage.instructions))}
          </Typography>
        </Stack>
      ) : null}
      <Typography variant="body1" sx={{ alignSelf: "start" }}>
        Word: <i>{queryWord === "" ? "" : replaceDashWithSpace(queryWord)}</i>
        <br />
        Visualisation: <i>One-hop Network</i>
        <br />
        Relation: <i>{relation}</i>
      </Typography>
      {association?.links.length === 0 ? (
        <Typography variant="body1" sx={{ alignSelf: "center", color: "red" }}>
          No {relation} Found!
        </Typography>
      ) : (
        <NetworkChart association={association} />
      )}
      <Typography
        variant="body1"
        sx={{ alignSelf: "center", fontWeight: "bold" }}
      >
        Legend
      </Typography>
      <Stack spacing={2}>
        {panels.map((panel) => (
          <ExpansionPanel
            key={panel.header}
            header={parse(DOMPurify.sanitize(panel.header))}
            body={parse(DOMPurify.sanitize(panel.body))}
          />
        ))}
      </Stack>
    </Stack>
  );
};
