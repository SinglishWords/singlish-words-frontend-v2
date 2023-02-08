export type Form = {
  step: number;
  age: string;
  gender: string;
  education: string;
  countryOfBirth: string;
  countryOfResidence: string;
  durationOfSgpResidence: string;
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
    // isRecognisedWord: boolean;
    response: string[];
    timeOnPage: number;
  }[];
};
