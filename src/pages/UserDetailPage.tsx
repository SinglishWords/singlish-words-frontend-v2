import { Divider, Stack, Typography } from "@mui/material";
import DOMPurify from "dompurify";
import parse from "html-react-parser";

import { AppButton } from "src/components/AppButton";
import { Dropdown } from "src/components/Dropdown";
import { data } from "src/utils/data";

type UserDetailPageProps = {
  nextPage: () => void;
};

export const UserDetailPage = ({ nextPage }: UserDetailPageProps) => {
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
          value={""}
          name={"age"}
          listData={data.userDetailPage.agesList}
        />

        {/* Gender */}
        <Dropdown
          required={true}
          inputLabel={data.userDetailPage.gender}
          value={""}
          name={"gender"}
          listData={data.userDetailPage.genderList}
        />

        {/* Education */}
        <Dropdown
          required={true}
          inputLabel={data.userDetailPage.education}
          value={""}
          name={"education"}
          listData={data.userDetailPage.educationLevelList}
        />

        {/* Country-of-Birth */}
        <Dropdown
          required={true}
          inputLabel={data.userDetailPage.birthCountry}
          value={""}
          name={"education"}
          listData={data.userDetailPage.countriesList}
        />

        {/* Ethnicity (Show ethnicity only if Country-of-Residence is Singapore) */}
        <Dropdown
          required={true}
          inputLabel={data.userDetailPage.ethnicity}
          value={""}
          name={"ethnicity"}
          listData={data.userDetailPage.ethicGroupList}
        />

        {/* Country-of-Residence */}
        <Dropdown
          required={true}
          inputLabel={data.userDetailPage.residenceCountry}
          value={""}
          name={"ethnicity"}
          listData={data.userDetailPage.countriesList}
        />

        {/* Native Speaker? */}
        <Dropdown
          required={true}
          inputLabel={data.userDetailPage.native}
          value={""}
          name={"isNative"}
          listData={data.userDetailPage.yesNoList}
        />

        <Stack direction="row" sx={{ justifyContent: "center" }}>
          <AppButton
            name={data.userDetailPage.continueButton}
            onClick={nextPage}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};
