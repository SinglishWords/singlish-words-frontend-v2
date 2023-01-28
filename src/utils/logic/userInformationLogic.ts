import { Form } from "src/types/state/form.dto";

export const checkCompulsoryFieldsForNonSingaporean = (values: Form) => {
  return (
    values.age !== -1 &&
    values.gender !== "" &&
    values.education !== "" &&
    values.countryOfBirth !== "" &&
    values.countryOfResidence !== "" &&
    values.isNative !== "" &&
    values.durationOfSgpResidence !== ""
  );
};

export const checkCountryOfBirthSingapore = (values: Form) => {
  return values.countryOfBirth === "Singapore";
};

export const checkCountryOfResidenceSingapore = (values: Form) => {
  return values.countryOfResidence === "Singapore";
};

export const checkEthnicityFieldFilled = (values: Form) => {
  return values.ethnicity !== "";
};

export const generateNumericRange = (start: number, end: number) => {
  return new Array(end - start + 1).fill(undefined).map((d, i) => i + start);
};
