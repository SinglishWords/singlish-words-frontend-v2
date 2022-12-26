/* When setting the queried word, replace space with dash.
When rendering the queried word / doing comparative checks using 
filter to determine if a word should be rendered, use replace dash
with space.*/

export const replaceSpaceWithDash = (text: string) => {
  return text.replace(/\s+/g, "-");
};

export const replaceDashWithSpace = (text: string) => {
  return text.replace(/-/g, " ");
};
