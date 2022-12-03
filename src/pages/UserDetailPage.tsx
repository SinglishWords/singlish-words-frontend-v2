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
import { FormType } from "src/utils/types";

type UserDetailPageProps = {
  form: FormType;
  setForm: React.Dispatch<React.SetStateAction<FormType>>;
  nextStep: () => void;
};

export const UserDetailPage = ({
  form,
  setForm,
  nextStep,
}: UserDetailPageProps) => {
  /* The below block of code disables/enables the "Continue" button.
    Firstly, check that all compulsory fields (Age, Gender, Education, Birth Country, 
    Residence Country, Native Speaker) are filled.
    Secondly, if participant is a Singaporean, check that Ethnicity Field is filled. */
  const compusloryFieldsFilled = checkCompulsoryFieldsForNonSingaporean(form);
  const isSingaporean = checkCountryOfBirthSingapore(form);
  const isEnabled = isSingaporean
    ? compusloryFieldsFilled && checkEthnicityFieldFilled(form)
    : compusloryFieldsFilled;

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    /* If user changes to another country of birth, then we should clear the ethnicity field because default country of birth is Singapore*/
    event.target.name === "countryOfBirth"
      ? setForm({
          ...form,
          ethnicity: "",
          [event.target.name]: event.target.value,
        })
      : setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleAddElementToArray = (
    event: React.ChangeEvent<HTMLSelectElement>,
    array: string[]
  ) => {
    /* Duplicate elements not allowed */
    if (!array.includes(event.target.value)) {
      array.push(event.target.value);
    }
    setForm({ ...form, [event.target.name]: array });
  };

  const handleArrayReset = (event: React.MouseEvent<HTMLButtonElement>) => {
    setForm({ ...form, [event.currentTarget.id]: [] });
  };

  return (
    <Stack
      sx={{
        width: { xs: "80%", sm: "60%" },
        margin: "auto",
        pb: { xs: 25, sm: 10 },
      }}
    >
      {/* good to have - refactor to theme breakpoints https://github.com/mui/material-ui/issues/30484 */}
      <Typography variant="h4" sx={{ py: 4, fontSize: { xs: 30, sm: 35 } }}>
        {parse(DOMPurify.sanitize(data.userDetailPage.title))}
      </Typography>

      {/* Content */}
      <Stack spacing={6}>
        <Divider sx={{ background: "black" }} />

        {/* User Detail Input Instructions */}
        <Typography variant="body1" sx={{ alignSelf: "start" }}>
          {parse(DOMPurify.sanitize(data.userDetailPage.instruction))}
        </Typography>

        {/* Age */}
        <Dropdown
          required={true}
          helperText={data.userDetailPage.age}
          value={form.age}
          name={"age"}
          listData={data.userDetailPage.agesList}
          handleChange={handleChange}
        />

        {/* Gender */}
        <Dropdown
          required={true}
          helperText={data.userDetailPage.gender}
          value={form.gender}
          name={"gender"}
          listData={data.userDetailPage.genderList}
          handleChange={handleChange}
        />

        {/* Education */}
        <Dropdown
          required={true}
          helperText={data.userDetailPage.education}
          value={form.education}
          name={"education"}
          listData={data.userDetailPage.educationLevelList}
          handleChange={handleChange}
        />

        {/* Country-of-Birth */}
        <Dropdown
          required={true}
          helperText={data.userDetailPage.birthCountry}
          value={form.countryOfBirth}
          name={"countryOfBirth"}
          listData={data.userDetailPage.countriesList}
          handleChange={handleChange}
        />

        {/* Ethnicity (Show ethnicity only if Country-of-Birth is Singapore) */}
        {isSingaporean ? (
          <Dropdown
            required={true}
            helperText={data.userDetailPage.ethnicity}
            value={form.ethnicity}
            name={"ethnicity"}
            listData={data.userDetailPage.ethicGroupList}
            handleChange={handleChange}
          />
        ) : null}

        {/* Country-of-Residence */}
        <Dropdown
          required={true}
          helperText={data.userDetailPage.residenceCountry}
          value={form.countryOfResidence}
          name={"countryOfResidence"}
          listData={data.userDetailPage.countriesList}
          handleChange={handleChange}
        />

        {/* Native Speaker? */}
        <Dropdown
          required={true}
          helperText={data.userDetailPage.native}
          value={form.isNative}
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
              helperText={data.userDetailPage.languages}
              value={form.languagesSpoken}
              name={"languagesSpoken"}
              listData={data.userDetailPage.languagesSpokenList}
              handleChange={(event) =>
                handleAddElementToArray(event, form.languagesSpoken)
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
              {form.languagesSpoken.map((language) => {
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
