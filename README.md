[GitHub - SinglishWords/singlish-words-frontend: Singlish Words Application's Frontend Code (v2)](https://github.com/SinglishWords/singlish-words-frontend-v2)

This repository consists of the working files for the frontend of the SinglishWords project. The code is written using the React framework.

- [Installation](#installation)
- [Setting up CORS Everywhere](#setting-up-cors-everywhere)
- [Editing pages](#editing-pages)
  - [App hierarchy](#app-hierarchy)
  - [Editing structure and layout](#editing-structure-and-layout)
    - [Example, changing element tags](#example-changing-element-tags)
  - [Editing content and wordings](#editing-content-and-wordings)
  - [Editing data lists](#editing-data-lists)
  - [Editing cues](#editing-cues)
- [Building the app](#building-the-app)
- [Next steps](#next-steps)
- [Additional Information for Developers](#additional-information-for-developers)

# Installation

To deploy the SinglishWords frontend on your local system, open your terminal and first clone the repository

```bash
$ git clone https://github.com/SinglishWords/singlish-words-frontend-v2.git
$ cd singlish-words-frontend-v2 # to enter the directory
```

Use `npm` to install all the packages that the project uses

```bash
$ npm install
```

Check for outdated packages and update

```bash
$ npm outdated
$ npm update
```

After all the packages are installed, use `npm start` to run the application on your `localhost`

```bash
$ npm start
```

This will deploy the frontend of the application to `https://localhost:3000`. Enter this address into a browser of your choice to run and test the application.

# Setting up CORS Everywhere

For the purpose of frontend testing on `[localhost](http://localhost)`, it is recommended to install the CORS Everywhere browser extension on [Firefox](https://addons.mozilla.org/en-US/firefox/addon/cors-everywhere/) or [Google Chrome](https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf?hl=en). This will allow `localhost` to retrieve cues from the backend on [singlishwords.nus.edu.sg](http://singlishwords.nus.edu.sg).

Follow the steps on the pages linked above to install and enable the browser extension

Please remember to disable CORS Everywhere after using it to test the application, as it poses a minor security risk during general web browsing.

<a name="edit"></a>

# Editing pages

To make edits to the text, colours, fonts, etc. that are visible to the users, the frontend files must be modified.

Making and saving any edits to the frontend in your code editor will automatically refresh the React app on `[localhost:3000](http://localhost:3000)` with the same changes.

## App hierarchy

Pages are stored in the `./src/pages` directory. Components are stored in the `./src/components` directory.

This project’s frontend consists of the following page components in this hierarchy (these are not directories):

```
App
  |_TopbarLayout (/)
      |_NavigationBar
      |_Outlet
          |_ HomePage (/)
          |_ ExplorePage (/explore)
          |_ VisualisePage (/visualise)
  |_FormPage (/form)
      |_UserDetailPage
      |_InstructionPage
      |_QuizPage
      |_Email

Legend:
() - Routing Path
```

## Editing structure and layout

The positioning of elements, HTML-rendered components, and styles such as element heights, fonts, colors, etc. are stored in `.tsx` files.

### Example, changing element tags

For example, let’s say the title in the `HomePage` component is to be changed from `<h2>` to `<h1>`. Below is what the `./src/pages/HomePage.tsx` file looks like.

```tsx
export const HomePage = () => {
  const navigate = useNavigate();

  return (
    ...
    <Typography variant="h2" sx={{ fontSize: { xs: 21, sm: 31 } }}>
        {parse(DOMPurify.sanitize(data.homePage.title))}
    </Typography>
     <Typography variant="h2" sx={{ fontSize: { xs: 19, sm: 22 } }}>
       {parse(DOMPurify.sanitize(data.homePage.subtitle))}
    </Typography>
    ...
  );
};
```

The `<h2>` tags can be changed to `<h1>` by changing `variant="h2"` to `variant="h1"`. Saving the file with these changes will automatically refresh the React application running in the browser.

## Editing content and wordings

The content and wordings on every page in the frontend are served as `props` to the components. These properties can be found in `./src/utils/data.ts`. Here is a brief look at what the file contains:

```ts
export const data = {
  /* Home Page, as an example */
  homePage: {
    title: `A Small World of Singlish Words:`,
    subtitle: `A Word Association Study`,
    introduction: `Welcome to this study on word associations ...`
    ...
  },
  /* All other pages */
}
```

The contents from `data.ts` is imported to every component file. When a component is loaded, for example `<HomePage/>`, the HTML content `A Small World of Singlish Words:` is retrieved using the code snippet `{data.homePage.title}`.

Hence, making changes to the wordings on any page or component involves changing the string values in `data.ts`. Tags such as bold `<b></b>` and italics `<i></i>` can be added between words in `data.ts` to format text where necessary.

Once changes are saved, the React application running in the browser will automaticaly update these changes.

## Editing data lists

On the `UserDetails` page, there are several user input fields (dropdown) which ask for the users’

1. Age
2. Gender
3. Education Level
4. Country of Birth
5. Ethnic Group
6. Country of Residence
7. Fluency of English
8. Other Languages Spoken

The options which are available in these drop-down lists can be changed by navigating to `./src/utils/lists` and updating the corresponding `.ts` file containing the choices.

For example, if an ‘Other’ option needs to be added to the Education Level dropdown, the option can be added to the list of choices in `.src/utils/lists/educationLevelList.ts`.

```ts
export const educationLevelList = [
  "None",
  "PSLE",
  "GCE N / O-Levels",
  "GCE A-Levels",
  "Bachelor's Degree",
  "Master's Degree",
  "Ph.D.(Doctor of Philosophy) / Doctorate",
  "Other", // Add `Other` Option
];
```

## Editing cues

The cues that are displayed to the user cannot be modified in the frontend. This is because the MySQL database containing the cues itself must be updated, which cannot be done from the frontend or using React.

To learn more about how to change our cues, follow the instructions on the `singlish-words-backend` [repository](https://github.com/SinglishWords/singlish-words-backend) and `deployment` [repository](https://github.com/SinglishWords/deployment).

# Building the app

After all the changes have been made, a production build containing all the minified assets with HTML, CSS, and JavaScript files can be created. The shell command to do so is

```bash
$ npm run build
```

This will create a `build` folder containing all the assets in the root directory `./`

> This is an important step, since we push these files to GitHub as well, and our deployment script will later use the contents of `build` folder when we create a Docker container

# Next steps

At this point, the changes can be commited and pushed to the `master` branch of this repo. The next steps include:

1. Making changes to the backend, if any ([refer to this link](https://github.com/SinglishWords/singlish-words-backend))
2. Deploying the whole application in a Docker container ([refer to this link](https://github.com/SinglishWords/deployment))

# Additional Information for Developers

Libraries/Packages:

1. Axios + React Query (Asynchronous State Management, Server-state Utilities, Data Fetching) https://react-query-v3.tanstack.com/
2. React Router v6 (Routing) https://reactrouter.com/en/main
3. Apache eCharts (Graph Data Visualisation) https://echarts.apache.org/en/index.html

Test Cases:

| Test ID | Test Objective                                                                                                                          | Steps Taken and Expected Results                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 01      | Check that survey participants can view introductory information of the study                                                           | 1. Head to the survey form site URL. 2. Check that the landing home page shows the following - An introduction to the study, brief survey instructions, and personal data collection policy.                                                                                                                                                                                                                                                                                                                                              |
| 02      | Check that survey participants can indicate their ethnic group if “Singapore” is selected as “country of birth”                         | 1. Head to "Information about you" page. 2. Verify that Singapore is selected by default under the "Country of Birth" and the "Current Country of Residence" dropdown boxes. 3. The "Ethnic Group" dropdown box is visible. 4. Upon selecting a different country of birth, the "Ethnic Group" dropdown box disappears. 5. Upon populating the "Country of Birth" dropdown box with "Singapore" again, the "Ethnic Group" dropdown box appears.                                                                                           |
| 03      | Check that survey participants can fill in personal details on the “Information about you” page                                         | 1. "Head to Information about you" page. 2. The "Continue" button is initially disabled. 3. Upon filling in every compulsory field indicated with an asterisk (\*), the "Continue" button is enabled. 4. Select a few languages under the "What other languages do you speak" dropdown box. 5. The "Languages Chosen" header is populated with the languages chosen. 6. Click on "Reset Chosen Languages". 7. Verify that there are no languages in the "Languages Chosen" body.                                                          |
| 04      | Check that survey participants can read the instructions of the study                                                                   | 1. Head to the "Instructions" page. 2. Ensure that the instructions of the study are correct written.                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 05      | Check that survey participants can respond with word associations for a given word on the Quiz page                                     | 1. Head to the "Quiz" page. 2. Verify that users can input text into the text fields. 3. Verify that users can move from one text field to another chronologically by pressing the "Enter" key on the keyboard. 4. Verify that users can move to the next word by clicking on the "Continue" button regardless of the number of word associations (0/1/2/3) they enter into the textbox. 5. Once the progress bar reaches 100% and the "Continue" button is clicked, a snack bar appears indicating successful quiz responses submission. |
| 06      | Check that users can be reminded of the survey instructions if they forget about it                                                     | 1. Head to the "Quiz" page. 2. Click on the "Need Help?" button. 3. Upon click, a popover apperas and reiterates the survey instructions. The survey instructions of this popover is identical to that of the instructions found on the Instructions page.                                                                                                                                                                                                                                                                                |
| 07      | Check that users are able to view the "Thank You" Page                                                                                  | 1. Head to the "Thank You!" page. 2. Verify that users are able to view contact information of the SinglishWords team.                                                                                                                                                                                                                                                                                                                                                                                                                    |
| 08      | Check that users are able to view both forward and backward associations of a queried/randomized word on the Explore Page               | 1. Head to the "Explore" page. 2. Click on the Shuffle button to generate a random word. 3. The word, forward association and backward association panels are populated with data of the random word. 4. Type the word "abang" into the search bar and press the "Enter key". 5. The word, forward association and backward association panels are populated with data of the word "abang".                                                                                                                                               |
| 09      | Check that users are able to download CSV data of both forward and backward associations of the current word on the Explore Page        | 1. Head to the "Explore" page. 2. Click on the Shuffle button to generate a random word. 3. Click on the Download button. 4. Verify that two CSV files are downloaded. The first and second CSV files should contain the forward and backward associations of the word respectively.                                                                                                                                                                                                                                                      |
| 10      | Check that users are able to view the graph visualisation of either the forward or backward association on the Visualise Page           | 1. Head to the "Visualise" page. 2. Verify that the Relation configuration is set to "Forward Associations". 3. Click on the Shuffle button to generate a random word. 4. Assuming that there exist forward associations, verify that a graph visualisation of the random word is generated. 5. Click on the Settings button. Set the Relation configuration to "Backward Associations". Repeat steps 1 to 4 for backward associations.                                                                                                   |
| 11      | Check that users are able to download CSV data of either the forward or backward associations of the current word on the Visualise Page | 1. Head to the "Visualise" page. 2. Verify that the Relation configuration is set to "Forward Associations". 3. Click on the Shuffle button to generate a random word. 4. Click on the Download button. 5. Verify that a CSV file is downloaded. The CSV file should contain the forward associations of the word. 6. Click on the Settings button. Set the Relation configuration to "Backward Associations". Repeat steps 1 to 5 for backward associations.                                                                             |
| 12      | Check that a legend describing graph visualisation features can be seen on the Visualise Page                                           | 1. Head to the "Visualise page". 2. Verify that a legend describing graph visualisation features can be seen on the page.                                                                                                                                                                                                                                                                                                                                                                                                                 |
