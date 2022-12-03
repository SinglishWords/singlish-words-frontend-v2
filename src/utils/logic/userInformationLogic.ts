import { FormType } from "src/utils/types";

export const checkCompulsoryFieldsForNonSingaporean = (values: FormType) => {
  return (
    values.age !== "" &&
    values.gender !== "" &&
    values.education !== "" &&
    values.countryOfBirth !== "" &&
    values.countryOfResidence !== "" &&
    values.isNative !== ""
  );
};

export const checkCountryOfBirthSingapore = (values: FormType) => {
  return values.countryOfBirth === "Singapore";
};

export const checkEthnicityFieldFilled = (values: FormType) => {
  return values.ethnicity !== "";
};
