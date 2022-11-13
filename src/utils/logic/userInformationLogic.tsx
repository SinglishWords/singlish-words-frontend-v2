import { Form } from "src/utils/types";

export const checkCompulsoryFieldsForNonSingaporean = (values: Form) => {
  return (
    values.age !== "" &&
    values.gender !== "" &&
    values.education !== "" &&
    values.countryOfBirth !== "" &&
    values.countryOfResidence !== "" &&
    values.isNative !== ""
  );
};

export const checkCountryOfBirthSingapore = (values: Form) => {
  return values.countryOfBirth === "Singapore";
};

export const checkEthnicityFieldFilled = (values: Form) => {
  return values.ethnicity !== "";
};
