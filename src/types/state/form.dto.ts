export type Form = {
  step: number;
  age: number;
  gender: string;
  education: string;
  countryOfBirth: string;
  countryOfResidence: string;
  ethnicity: string;
  isNative: string;
  languagesSpoken: string[];
  startTime: string;
  endTime: string;
  uuid: string;
  data: {
    question: {
      id: number;
      progress: number;
      word: string;
    };
    response: string[];
    timeOnPage: number;
  }[];
};
