import { useNavigate } from "react-router-dom";
import { Link, Stack, Typography, LinearProgress, Chip, Box, Switch, Grid, Tabs, Tab } from "@mui/material";
import DOMPurify from "dompurify";
import parse from "html-react-parser";

import { AppButton } from "src/components/AppButton";
import { data } from "src/utils/data";
import { Form } from "src/types/state/form.dto";
import { setFivePercentProbability } from "src/utils/logic/probabilityLogic";
import { currentDateTime } from "src/utils/logic/timeLogic";
import { Validator } from "src/types/state/validator.dto";
import { Answer } from "src/types/api/answer.dto";
import { useEffect, useState } from "react";
import { fetchAllAnswers } from "src/services/ApiService";


const PERCENT_DONE = 39;
const NUM_OF_TOTAL_PPL = 1000;
const NUM_OF_TOTAL_ASSOCIATIONS = 3000;

const CHIP_COLORS = {
  "0%": "#c2dfff",
  "10%": "#a7cffa",
  "20%": "#80beff",
  "30%": "#4da1f7",
  "40%": "#146bc4",
  "50%": "#003d7c",
}

type EmailPageProps = {
  form: Form;
  setForm: React.Dispatch<React.SetStateAction<Form>>;
  setValidator: React.Dispatch<React.SetStateAction<Validator>>;
};

export const EmailPage = ({ form, setForm, setValidator }: EmailPageProps) => {
  const [allAnswers, setAnswers] = useState<Answer[]>([]);

  /* Fetch answers data when component mounts */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: Answer[] = await fetchAllAnswers();
        setAnswers(data);
      } catch (error) {
        console.error("Error fetching answers:", error);
      }
    };

    fetchData();
  }, []);

  const navigate = useNavigate();

  const handleHomePageClick = () => {
    navigate("/");
  };

  const handleParticipateClick = () => {
    setForm({
      ...form,
      step: 1,
      startTime: currentDateTime(),
      endTime: "",
      data: [],
    });

    setValidator({
      isVerified: false,
      /* 5% chance of validator rendering to catch bots */
      showValidator: setFivePercentProbability(),
    });
  };

  const [isMoreDetailsChecked, setMoreDetailsChecked] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMoreDetailsChecked(event.target.checked);
  };

  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const userQuestionAnswerData = form.data

  const totalAssociations = userQuestionAnswerData.reduce((total, item) => {
    const nonEmptyResponses = item.response.filter(response => response.trim() !== "").length;
    return total + nonEmptyResponses;
  }, 0);

  const recognizedQuestions = userQuestionAnswerData.filter(item => item.isRecognisedWord);

  const recognizedQuestionIdToWord: { [key: number]: string } = recognizedQuestions.reduce((acc, item) => {
    acc[item.question.id] = item.question.word;
    return acc;
  }, {} as { [key: number]: string });

  const recognizedQuestionIdToResponse: { [key: number]: string[] } = recognizedQuestions.reduce((acc, item) => {
    acc[item.question.id] = item.response.filter(response => response.trim() !== "");
    return acc;
  }, {} as { [key: number]: string[] });

  const getAssociationsMap = (allAnswers: Answer[], questionIdToWord: { [key: number]: string }) => {
    return allAnswers
      .filter(answer => questionIdToWord.hasOwnProperty(answer.questionId))
      .reduce((acc, answer) => {
        const associations = [answer.association1, answer.association2, answer.association3].filter(Boolean);
        if (associations.length > 0) {
          if (!acc[answer.questionId]) {
            acc[answer.questionId] = new Set();
          }
          // Check if associations is not null or undefined before adding to the set
          associations.forEach(association => acc[answer.questionId].add(association));
        }
        return acc;
      }, {} as { [key: number]: Set<string> });
  };

  const recognizedQuestionsAssociationsMap = getAssociationsMap(allAnswers, recognizedQuestionIdToWord);

  const getAssociationsMapWithCount = (allAnswers: Answer[], questionIdToWord: { [key: number]: string }) => {
    return allAnswers
      .filter(answer => questionIdToWord.hasOwnProperty(answer.questionId))
      .reduce((acc, answer) => {
        const associations = [answer.association1, answer.association2, answer.association3].filter(Boolean);
        if (associations.length > 0) {
          if (!acc[answer.questionId]) {
            acc[answer.questionId] = {};
          }
          associations.forEach(association => {
            if (!acc[answer.questionId][association]) {
              acc[answer.questionId][association] = 0;
            }
            acc[answer.questionId][association]++;
          });
        }
        return acc;
      }, {} as { [key: number]: { [association: string]: number } });
  };

  const recognizedAssociationsMapWithCount = getAssociationsMapWithCount(allAnswers, recognizedQuestionIdToWord);

  // Go through each question in questionIdToResponse
  // For each response, check if it is in associationsMap[questionId]
  // If it is, decrement the count in associationsMapWithCount[questionId][response]
  // If the count is 0, remove the response from associationsMap[questionId]
  recognizedQuestions.forEach(item => {
    const questionId = item.question.id;
    recognizedQuestionIdToResponse[questionId].forEach(response => {
      // Convert associationsMap[questionId] to an array to iterate through
      if (recognizedQuestionsAssociationsMap[questionId]) {
        const associationsArray = Array.from(recognizedQuestionsAssociationsMap[questionId]);

        // Iterate through the array to check for membership
        associationsArray.forEach(association => {
          if (association === response) {
            recognizedAssociationsMapWithCount[questionId][association]--;
            if (recognizedAssociationsMapWithCount[questionId][association] === 0) {
              recognizedQuestionsAssociationsMap[questionId].delete(association);
            }
          }
        });
      }
    });
  });


  // Get me the list of matching associations for a given questionId
  // A matching association for a questionId is an association that is present in questionIdToResponse[questionId] and associationsMap[questionId]
  const getMatchingAssociations = (questionId: number, questionIdToResponse: { [key: number]: string[] }, associationsMap: { [key: number]: Set<string> }) => {
    const associationsSet = associationsMap[questionId];
    if (!associationsSet) {
      return []; // Return empty array if associationsSet is undefined or null
    }

    return questionIdToResponse[questionId].reduce((acc, response) => {
      let found = false;
      // Iterate through the set manually to check for membership
      associationsSet.forEach(item => {
        if (item === response) {
          found = true;
        }
      });

      if (found) {
        acc.push(response);
      }

      return acc;
    }, [] as string[]);
  };


  // Now create a map of matching associations for each questionId
  const matchingAssociationsMap = recognizedQuestions.reduce((acc, item) => {
    acc[item.question.id] = getMatchingAssociations(item.question.id, recognizedQuestionIdToResponse, recognizedQuestionsAssociationsMap);
    return acc;
  }, {} as { [key: number]: string[] });


  // Get me a total count of matching associations across all questions
  const totalMatchingAssociations = recognizedQuestions.reduce((total, item) => {
    return total + matchingAssociationsMap[item.question.id].length;
  }, 0);

  const GradientScale = () => {
    return (
      <Stack spacing={1} sx={{ alignItems: 'center' }}>
        <Typography variant="body1" sx={{ alignItems: 'center' }} >
          {parse(DOMPurify.sanitize(`Popularity %`))}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '200px' }}>
              <Box sx={{ textAlign: 'center', backgroundColor: CHIP_COLORS["0%"] }}>
                <Typography sx={{ color: CHIP_COLORS["0%"] }}>50</Typography>
              </Box>
              <Box sx={{ textAlign: 'center', backgroundColor: CHIP_COLORS["10%"] }}>
                <Typography sx={{ color: CHIP_COLORS["10%"] }}>50</Typography>
              </Box>
              <Box sx={{ textAlign: 'center', backgroundColor: CHIP_COLORS["20%"] }}>
                <Typography sx={{ color: CHIP_COLORS["20%"] }}>50</Typography>
              </Box>
              <Box sx={{ textAlign: 'center', backgroundColor: CHIP_COLORS["30%"] }}>
                <Typography sx={{ color: CHIP_COLORS["30%"] }}>50</Typography>
              </Box>
              <Box sx={{ textAlign: 'center', backgroundColor: CHIP_COLORS["40%"] }}>
                <Typography sx={{ color: CHIP_COLORS["40%"] }}>50</Typography>
              </Box>
              <Box sx={{ textAlign: 'center', backgroundColor: CHIP_COLORS["50%"] }}>
                <Typography sx={{ color: CHIP_COLORS["50%"] }}>50</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '200px' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography>{DOMPurify.sanitize(`>0`)}</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography>10</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography>20</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography>30</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography>40</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography>50</Typography>
              </Box>
            </Box>

          </Box>
        </Box>

      </Stack>
    );
  };

  const styledChipMyAssociations = (text: string, totalAssociationForQuestion: number, currentAssociationCount: number) => {
    const color = totalAssociationForQuestion === 0 ? 'white' :
      currentAssociationCount / totalAssociationForQuestion < 0.1 ? CHIP_COLORS["0%"] :
        currentAssociationCount / totalAssociationForQuestion < 0.2 ? CHIP_COLORS["20%"] :
          currentAssociationCount / totalAssociationForQuestion < 0.3 ? CHIP_COLORS["30%"] :
            currentAssociationCount / totalAssociationForQuestion < 0.4 ? CHIP_COLORS["40%"] :
              currentAssociationCount / totalAssociationForQuestion < 0.5 ? CHIP_COLORS["50%"] :
                CHIP_COLORS["50%"];

    return (
      <Chip
        size="small"
        label={text}
        sx={{
          backgroundColor: color,
          // the color should be white if the background color is chipColors["50%"] or chipColors["40%"]
          color: color === CHIP_COLORS["50%"] || color === CHIP_COLORS["40%"] ? "white" : "black",
          // fontWeight: "bold",
          // fontSize: "1rem",
          // Italic if totalAssociationForQuestion is 0
          fontStyle: totalAssociationForQuestion === 0 ? "italic" : "normal",
        }}
      />
    );
  }

  const getMyAssociationStyledChipsRow = (questionId: number, questionIdToResponse: { [key: number]: string[] }, associationsMapWithCount: { [key: number]: { [association: string]: number } }) => {
    // Check if questionIdToResponse[questionId] is undefined or null
    if (!questionIdToResponse[questionId]) {
      return styledChipMyAssociations("No response", 0, 0);
    }

    // Check if associationsMapWithCount[questionId] is undefined or null
    if (!associationsMapWithCount[questionId]) {
      return styledChipMyAssociations("No associations", 0, 0);
    }

    // totalAssociationForQuestion is the total counts from the associationsMapWithCount
    const totalAssociationForQuestion = Object.keys(associationsMapWithCount[questionId]).reduce((acc, key) => acc + associationsMapWithCount[questionId][key], 0);

    // Return a row stacked with styled chips
    return (
      <Stack
        spacing={1}
        direction="row"
        sx={{
          // justifyContent: "center",
          // alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {questionIdToResponse[questionId] && questionIdToResponse[questionId].map(response => {
          const currentAssociationCount = associationsMapWithCount[questionId][response] || 0;
          return styledChipMyAssociations(response, totalAssociationForQuestion, currentAssociationCount);
        })}
      </Stack>
    );
  }

  const myAssociationComplete = () => {
    return (
      <Stack spacing={1}>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <GradientScale />
        </Box>

        <Stack spacing={1}>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <Typography variant="body1">
                {parse(DOMPurify.sanitize(`<strong>Cue</strong>`))}
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="body1">
                {parse(DOMPurify.sanitize(`<strong>Your Associations</strong>`))}
              </Typography>
            </Grid>
          </Grid>
          {recognizedQuestions.map(item => (
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <Typography variant="body1">
                  {parse(DOMPurify.sanitize(item.question.word))}
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Stack key={item.question.id} spacing={1}>
                  {getMyAssociationStyledChipsRow(item.question.id, recognizedQuestionIdToResponse, recognizedAssociationsMapWithCount)}
                </Stack>
              </Grid>
            </Grid>
          ))}
        </Stack>

        <Typography variant="body1">
          {parse(DOMPurify.sanitize(`\nYour unique associations are <i>italic</i>.`))}
        </Typography>
      </Stack>
    )
  }

  const styledChipsAllAssociations = (text: string, totalAssociationForQuestion: number, currentAssociationCount: number, myAssociations: string[]) => {
    const color = totalAssociationForQuestion === 0 ? 'white' :
      currentAssociationCount / totalAssociationForQuestion < 0.1 ? CHIP_COLORS["0%"] :
        currentAssociationCount / totalAssociationForQuestion < 0.2 ? CHIP_COLORS["20%"] :
          currentAssociationCount / totalAssociationForQuestion < 0.3 ? CHIP_COLORS["30%"] :
            currentAssociationCount / totalAssociationForQuestion < 0.4 ? CHIP_COLORS["40%"] :
              currentAssociationCount / totalAssociationForQuestion < 0.5 ? CHIP_COLORS["50%"] :
                CHIP_COLORS["50%"];

    return (
      <Chip
        size="small"
        label={text}
        sx={{
          backgroundColor: color,
          // the color should be white if the background color is chipColors["50%"] or chipColors["40%"]
          color: color === CHIP_COLORS["50%"] || color === CHIP_COLORS["40%"] ? "white" : "black",
          // Bold if the association is in myAssociations
          fontWeight: (myAssociations && myAssociations.includes(text)) ? "bold" : "normal",
        }}
      />
    );
  }

  const getTop3Associations = (questionId: number, questionIdToResponse: { [key: number]: string[] }, associationsMapWithCount: { [key: number]: { [association: string]: number } }) => {
    // Check if associationsMapWithCount[questionId] is undefined or null
    if (!associationsMapWithCount[questionId]) {
      return styledChipsAllAssociations("No associations", 0, 0, []);
    }

    // totalAssociationForQuestion is the total counts from the associationsMapWithCount
    const totalAssociationForQuestion = Object.keys(associationsMapWithCount[questionId]).reduce((acc, key) => acc + associationsMapWithCount[questionId][key], 0);

    // Get the top 3 associations
    const top3Associations = Object.keys(associationsMapWithCount[questionId]).sort((a, b) => associationsMapWithCount[questionId][b] - associationsMapWithCount[questionId][a]).slice(0, 3);

    // Return a row stacked with styled chips
    return (
      <Stack
        spacing={1}
        direction="row"
        sx={{
          // justifyContent: "center",
          // alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {top3Associations.map(response => {
          const currentAssociationCount = associationsMapWithCount[questionId][response] || 0;
          return styledChipsAllAssociations(response, totalAssociationForQuestion, currentAssociationCount, questionIdToResponse[questionId]);
        })}
      </Stack>
    );
  }

  const unrecognizedQuestions = userQuestionAnswerData.filter(item => !item.isRecognisedWord);

  const unrecognizedQuestionsQuestionIdToWord: { [key: number]: string } = unrecognizedQuestions.reduce((acc, item) => {
    acc[item.question.id] = item.question.word;
    return acc;
  }, {} as { [key: number]: string });

  const unrecognizedQuestionsAssociationsMapWithCount = getAssociationsMapWithCount(allAnswers, { ...recognizedQuestionIdToWord, ...unrecognizedQuestionsQuestionIdToWord });

  const allAssociationsComplete = () => {
    return (
      <Stack spacing={1}>
        {/* <Typography variant="h5">
          {parse(DOMPurify.sanitize(`All Users Associations`))}
        </Typography> */}

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <GradientScale />
        </Box>

        <Stack spacing={1}>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <Typography variant="body1">
                {parse(DOMPurify.sanitize(`<strong>Cue</strong>`))}
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="body1">
                {parse(DOMPurify.sanitize(`<strong>Top 3 Associations</strong>`))}
              </Typography>
            </Grid>
          </Grid>
          {[...recognizedQuestions, ...unrecognizedQuestions].map(item => (
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <Typography variant="body1" sx={{ textAlign: 'left' }}>
                  {parse(DOMPurify.sanitize(item.question.word))}
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Stack key={item.question.id} spacing={1}>
                  {getTop3Associations(item.question.id, recognizedQuestionIdToResponse, { ...recognizedAssociationsMapWithCount, ...unrecognizedQuestionsAssociationsMapWithCount })}
                </Stack>
              </Grid>
            </Grid>
          ))}
        </Stack>

        <Typography variant="body1">
          {parse(DOMPurify.sanitize(`\nYour matched associations are <strong>bold</strong>.`))}
        </Typography>
      </Stack>
    )
  }

  const moreDetailsTabs = () => {
    return (
      <>
        <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
          <Tab label="My Associations" />
          <Tab label="All Users Associations" />
        </Tabs>

        {tabValue === 0 && myAssociationComplete()}
        {tabValue === 1 && allAssociationsComplete()}
      </>
    )
  }


  return (
    <Stack
      spacing={5}
      sx={{
        width: { xs: "80%", sm: "60%" },
        margin: "auto",
        pb: { xs: 25, sm: 10 },
      }}
    >
      <Typography variant="h3" sx={{ py: 4 }}>
        {parse(DOMPurify.sanitize(data.emailPage.title))}
      </Typography>
      <Stack
        spacing={6}
        sx={{
          flex: 1,
          alignSelf: "center",
          "& .MuiTypography-root": { alignSelf: "start" },
        }}
      >

        <Stack spacing={3}>
          <Typography variant="h5">
            {parse(DOMPurify.sanitize(data.emailPage.yourAssosciations))}
          </Typography>
          <Typography variant="body1">
            {parse(
              DOMPurify.sanitize(data.emailPage.numAssociationsParagraphPart1) +
              `<strong>${totalAssociations}</strong>` +
              DOMPurify.sanitize(data.emailPage.numAssociationsParagraphPart2) +
              `<strong>${totalMatchingAssociations} (${(100 * totalMatchingAssociations / totalAssociations).toFixed(2)}%)</strong>` +
              DOMPurify.sanitize(data.emailPage.numAssociationsParagraphPart3)
            )}
          </Typography>

          <Typography variant="body1">
            More details:
            <Switch
              checked={isMoreDetailsChecked}
              onChange={handleChange}
            />
          </Typography>
        </Stack>

        {isMoreDetailsChecked && moreDetailsTabs()}

        <Stack spacing={3}>
          <Typography variant="h5">
            {parse(DOMPurify.sanitize(data.emailPage.projectStatusHeader))}
          </Typography>
          <Typography variant="body1">
            {parse(
              DOMPurify.sanitize(`${PERCENT_DONE}% <strong>complete</strong> `) +
              DOMPurify.sanitize(`(${NUM_OF_TOTAL_PPL} <strong>people</strong> | `) +
              DOMPurify.sanitize(`${NUM_OF_TOTAL_ASSOCIATIONS} <strong>associations</strong>)`)
            )}
          </Typography>
          <LinearProgress
            className="progress"
            variant="determinate"
            value={PERCENT_DONE}
          />
        </Stack>

        {/* Paragraph 1 - What we are trying to do */}
        <Stack spacing={3}>
          <Typography variant="h5">
            {parse(DOMPurify.sanitize(data.emailPage.firstHeader))}
          </Typography>
          <Typography variant="body1">
            {parse(DOMPurify.sanitize(data.emailPage.firstParagraph))}
          </Typography>
        </Stack>
        
        {/* Participation Code */}
        {*/
         
         
         
        */}
        

        {/* Paragraph 2 - Get in touch*/}
        <Stack spacing={3}>
          <Typography variant="h5">
            {parse(DOMPurify.sanitize(data.emailPage.secondHeader))}
          </Typography>
          <Typography variant="body1">
            {parse(
              DOMPurify.sanitize(data.emailPage.secondParagraph.description1)
            )}
            <Link
              sx={{
                cursor: "pointer",
                "&:hover": { color: "secondary.main" },
              }}
              onClick={() =>
                window.open(data.email.link.singlishwords, "_blank")
              }
            >
              {parse(DOMPurify.sanitize(data.email.html.singlishwords))}
            </Link>
          </Typography>
          <Typography variant="body1">
            {parse(
              DOMPurify.sanitize(data.emailPage.secondParagraph.description2)
            )}
            <Link
              sx={{
                cursor: "pointer",
                "&:hover": { color: "secondary.main" },
              }}
              onClick={() => window.open(data.email.link.professor, "_blank")}
            >
              {parse(DOMPurify.sanitize(data.email.html.professor))}
            </Link>
          </Typography>
        </Stack>

        {/* Paragraph 3 - Share the study*/}
        <Stack spacing={3}>
          <Typography variant="h5">
            {parse(DOMPurify.sanitize(data.emailPage.thirdHeader))}
          </Typography>
          <Typography variant="body1">
            {parse(DOMPurify.sanitize(data.emailPage.thirdParagraph))}
            <Link
              sx={{
                cursor: "pointer",
                "&:hover": { color: "secondary.main" },
              }}
              onClick={() => window.open(data.url.link.singlishwords, "_blank")}
            >
              {parse(DOMPurify.sanitize(data.url.html.singlishwords))}
            </Link>
          </Typography>
        </Stack>
        <Stack
          spacing={2}
          direction="row"
          sx={{ justifyContent: "space-evenly" }}
        >
          <AppButton
            name={"PARTICIPATE AGAIN"}
            sx={{ alignSelf: "center", fontWeight: "bold" }}
            onClick={handleParticipateClick}
          />
          <AppButton
            name={"RETURN TO HOME PAGE"}
            sx={{ alignSelf: "center", fontWeight: "bold" }}
            onClick={handleHomePageClick}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};
