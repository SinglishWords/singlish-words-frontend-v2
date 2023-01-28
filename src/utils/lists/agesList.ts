import { generateNumericRange } from "src/utils/logic/userInformationLogic";

/* Age range : < 18, 18-80, >80 
  <18 is represented by 17
  >80 is represented by 81 */
export const agesList = generateNumericRange(17, 81);
