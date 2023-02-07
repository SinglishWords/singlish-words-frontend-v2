import { generateNumericRange } from "src/utils/logic/userInformationLogic";

export const agesList = [
  "Less Than 18",
  ...generateNumericRange(18, 80).map(String),
  "More Than 80",
];
