import { generateNumericRange } from "src/utils/logic/userInformationLogic";

export const generateDurationOfSgpResidenceList = (
  age: string,
  hasBeenInSingapore: boolean
) => {
  if (age == "") {
    return [];
  }

  let defaultOptions = [
    "Never",
    "Less than 6 months",
    "More than 6 months and less than a year",
  ];

  /* Check if the user is born or has resided in Singapore. If so, we remove the "Never" option in the 
  "How many years have you lived in Singapore?" question.*/
  if (hasBeenInSingapore) {
    defaultOptions = defaultOptions.filter((element) => element !== "Never");
  }

  return age == "Less Than 18"
    ? defaultOptions.concat(...generateNumericRange(1, 17).map(String))
    : age == "More Than 80"
    ? defaultOptions.concat(
        ...generateNumericRange(1, 80).map(String),
        "More than 80 years"
      )
    : defaultOptions.concat(
        ...generateNumericRange(1, parseInt(age)).map(String)
      );
};
