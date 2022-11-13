import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import DOMPurify from "dompurify";
import parse from "html-react-parser";

import { AppButton } from "src/components/AppButton";
import { Dropdown } from "src/components/Dropdown";
import { data } from "src/utils/data";
import {
  checkCompulsoryFieldsForNonSingaporean,
  checkCountryOfBirthSingapore,
  checkEthnicityFieldFilled,
} from "src/utils/logic/userInformationLogic";
import { Form } from "src/utils/types";

type UserDetailPageProps = {
  nextStep: () => void;
  handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleAddElementToArray: (
    event: React.ChangeEvent<HTMLSelectElement>,
    array: string[]
  ) => void;
  handleArrayReset: React.MouseEventHandler<HTMLButtonElement>;
  values: Form;
};

export const UserDetailPage = ({
  nextStep,
  handleChange,
  handleAddElementToArray,
  handleArrayReset,
  values,
}: UserDetailPageProps) => {
  /* The below block of code disables/enables the "Continue" button.
    Firstly, check that all compulsory fields (Age, Gender, Education, Birth Country, 
    Residence Country, Native Speaker) are filled.
    Secondly, if participant is a Singaporean, check that Ethnicity Field is filled. */
  const compusloryFieldsFilled = checkCompulsoryFieldsForNonSingaporean(values);
  const isSingaporean = checkCountryOfBirthSingapore(values);
  const isEnabled = isSingaporean
    ? compusloryFieldsFilled && checkEthnicityFieldFilled(values)
    : compusloryFieldsFilled;

  return (
    <Stack sx={{ alignItems: "center", pb: 10 }}>
      <Typography variant="h4" sx={{ py: 4 }}>
        {parse(DOMPurify.sanitize(data.userDetailPage.title))}
      </Typography>

      {/* Content */}
      <Stack spacing={3} sx={{ width: 750 }}>
        <Divider sx={{ background: "black" }} />

        {/* User Detail Input Instructions */}
        <Typography variant="body1" sx={{ alignSelf: "start" }}>
          {parse(DOMPurify.sanitize(data.userDetailPage.instruction))}
        </Typography>

        {/* Age */}
        <Dropdown
          required={true}
          inputLabel={data.userDetailPage.age}
          value={values.age}
          name={"age"}
          listData={data.userDetailPage.agesList}
          handleChange={handleChange}
        />

        {/* Gender */}
        <Dropdown
          required={true}
          inputLabel={data.userDetailPage.gender}
          value={values.gender}
          name={"gender"}
          listData={data.userDetailPage.genderList}
          handleChange={handleChange}
        />

        {/* Education */}
        <Dropdown
          required={true}
          inputLabel={data.userDetailPage.education}
          value={values.education}
          name={"education"}
          listData={data.userDetailPage.educationLevelList}
          handleChange={handleChange}
        />

        {/* Country-of-Birth */}
        <Dropdown
          required={true}
          inputLabel={data.userDetailPage.birthCountry}
          value={values.countryOfBirth}
          name={"countryOfBirth"}
          listData={data.userDetailPage.countriesList}
          handleChange={handleChange}
        />

        {/* Ethnicity (Show ethnicity only if Country-of-Birth is Singapore) */}
        {isSingaporean ? (
          <Dropdown
            required={true}
            inputLabel={data.userDetailPage.ethnicity}
            value={values.ethnicity}
            name={"ethnicity"}
            listData={data.userDetailPage.ethicGroupList}
            handleChange={handleChange}
          />
        ) : null}

        {/* Country-of-Residence */}
        <Dropdown
          required={true}
          inputLabel={data.userDetailPage.residenceCountry}
          value={values.countryOfResidence}
          name={"countryOfResidence"}
          listData={data.userDetailPage.countriesList}
          handleChange={handleChange}
        />

        {/* Native Speaker? */}
        <Dropdown
          required={true}
          inputLabel={data.userDetailPage.native}
          value={values.isNative}
          name={"isNative"}
          listData={data.userDetailPage.yesNoList}
          handleChange={handleChange}
        />

        {/* Other Languages Spoken */}
        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
          <Stack spacing={2} sx={{ width: 360, justifyContent: "center" }}>
            {/* If "The `value` prop supplied to <select> must be a scalar value if `multiple` is false."
            error appears in console, ignore it. State should not be array if Dropdown
            component is used. However, Material-UI Multi-Select is buggy. Hence a normal
            Select component is used in Dropdown instead of Multi-Select */}
            <Dropdown
              required={false}
              inputLabel={data.userDetailPage.languages}
              value={values.languagesSpoken}
              name={"languagesSpoken"}
              listData={data.userDetailPage.languagesSpokenList}
              handleChange={(event) =>
                handleAddElementToArray(event, values.languagesSpoken)
              }
            />
            <AppButton
              id="languagesSpoken"
              name={"Reset Chosen Languages"}
              onClick={handleArrayReset}
            />
          </Stack>
          <Stack
            sx={{
              width: 360,
              alignItems: "center",
              maxHeight: "150px",
              overflow: "auto",
            }}
          >
            <Typography variant="button" sx={{ fontWeight: "bold" }}>
              Languages Chosen
            </Typography>
            <List dense={true}>
              {values.languagesSpoken.map((language) => {
                return (
                  <ListItem key={language}>
                    <ListItemText primary={language} />
                  </ListItem>
                );
              })}
            </List>
          </Stack>
        </Stack>

        <Stack direction="row" sx={{ justifyContent: "center" }}>
          <AppButton
            name={data.userDetailPage.continueButton}
            onClick={nextStep}
            disabled={!isEnabled}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};
