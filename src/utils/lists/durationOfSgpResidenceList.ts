import { generateNumericRange } from "src/utils/logic/userInformationLogic";

export const durationOfSgpResidenceList = [
  "Never",
  "Less than 6 months",
  "More than 6 months and less than a year",
  ...generateNumericRange(1, 80).map(String),
  "More than 80 years",
];
