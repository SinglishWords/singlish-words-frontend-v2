import { Form } from "src/types/state/form.dto";

export const checkCompulsoryFieldsForNonSingaporean = (values: Form) => {
  /* If durationOfSgpResidence is Never, then the country of birth or country of residence cannot be Singapore */
  return values.durationOfSgpResidence == "Never"
    ? !(
        values.countryOfBirth == "Singapore" ||
        values.countryOfResidence == "Singapore"
      )
    : values.age !== "" &&
        values.gender !== "" &&
        values.education !== "" &&
        values.countryOfBirth !== "" &&
        values.countryOfResidence !== "" &&
        values.isNative !== "" &&
        values.durationOfSgpResidence !== "";
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
