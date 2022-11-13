export const startTimer = () => {
  return performance.now();
};

export const endTimer = () => {
  return performance.now();
};

/* This function calculates date time in Singapore in ISO format*/
export const currentDateTime = () => {
  let date = new Date();
  let isoDateTime = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  ).toISOString();
  return isoDateTime;
};
