/* Generates an age range from start age to end age */
const ageRange = (start: number, end: number) => {
  return new Array(end - start + 1).fill(undefined).map((d, i) => i + start);
};

/* Age range : < 18, 18-80, >80 
  <18 is represented by 0
  >80 is represented by 1 */
export const agesList = ageRange(17, 81);
