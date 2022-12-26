import { agesList } from "src/utils/lists/agesList";
import { countriesList } from "src/utils/lists/countriesList";
import { educationLevelList } from "src/utils/lists/educationLevelList";
import { ethicGroupList } from "src/utils/lists/ethicGroupList";
import { genderList } from "src/utils/lists/genderList";
import { languagesSpokenList } from "src/utils/lists/languagesSpokenList";
import { yesNoList } from "src/utils/lists/yesNoList";

export const data = {
  /* Introduction Page */
  introductionPage: {
    title: `A Small World of Singlish Words:`,
    subtitle: `A Word Association Study`,
    introduction: `Welcome to this study on word associations in Singapore English. Singaporeans have a unique vocabulary, consisting of Singlish words and phrases that originate from various local languages, on top of the Standard English vocabulary. As researchers studying language and memory we are interested in the nature and organization of this unique mental dictionary of Singapore English. 

      You can help us capture this knowledge by playing a simple game of word associations. This game takes no more than 15 minutes of your time. All you have to do is to respond with the first three words that come to your mind for a list of Singapore English words.
      
      If you are between 18 to 80 years old, and consider yourself to be a native speaker of Singapore English, you are eligible to take part in our study.
            
      If you proceed, you consent to your demographic and linguistic data to be collected for research purposes. This data is completely anonymous, and never linked to your personal or contact information. Your anonymized data could be shared with other researchers for the purpose of scientific exploration.`,
    continueButton: `I want to participate!`,
  },

  /* User Detail Page */
  userDetailPage: {
    title: `Information about you`,
    instruction: `Before we get started, please provide the following info.
    <b>Asterisk (*) indicates a compulsory field.</b>`,
    age: `Please select your age`,
    gender: `Please select your gender`,
    education: `Please select your highest attained educational qualification`,
    birthCountry: `Please select your country of birth`,
    ethnicity: `Please select your ethnic group`,
    residenceCountry: `Please select your current country of residence`,
    native: `Are you a native English speaker?`,
    languages: `What other languages do you speak?`,
    continueButton: `continue`,
    agesList: agesList,
    genderList: genderList,
    educationLevelList: educationLevelList,
    countriesList: countriesList,
    ethicGroupList: ethicGroupList,
    yesNoList: yesNoList,
    languagesSpokenList: languagesSpokenList,
  },

  /* Instructions Page */
  instructionPage: {
    title: `Instructions`,
    firstHeader: `<b>How it works...</b>`,
    firstParagraph: `On the top of the screen a Singapore English word will appear. <b>Enter the first word that comes to mind</b> when reading this word.
      
    Press <i>Enter</i> to add a second and third word or proceed to the next word if you can't think of any.
      
    If you don't know the word at all, you can just proceed to the next word.`,
    secondHeader: `<b>Some tips</b>`,
    secondParagraph: `Only give associations to the word on top of the screen (not to your previous responses!)

    Try to avoid full sentences or long phrases as responses.

    Simply type a word and press <i>Enter</i> to go to the next one.`,
    continueButton: `continue`,
  },

  /* Quiz Page */
  quizPage: {
    instruction: `Enter a word that comes to your mind`,
    progress: `Progress`,
    needHelpButton: `Need Help?`,
    continueButton: `continue`,
    help: `<b>How it works...</b>
    On the top of the screen a Singapore English word will appear. Enter the first word that comes to mind when reading this word. Press Enter to add a second and third word or proceed to the next word if you can't think of any. If you don't know the word at all, you can just proceed to the next word.
      
    <b>Some tips</b>
    Only give associations to the word on top of the screen (not to your previous responses!) Try to avoid full sentences or long phrases as responses. Simply type a word and press Enter to go to the next one.`,
  },

  /* Email Page */
  emailPage: {
    title: `Thank You!`,
    firstHeader: `<b>What are we trying to do</b>`,
    firstParagraph: `The mental lexicon is the part of long-term memory where all of the words that you know and their meanings are stored. The connections between these words and concepts can be represented as a language network (akin to a “social network” of words) to model the large-scale structure of the mental lexicon.
      
    In this study, you were asked to respond with words that came to your mind upon the presentation of Singapore English words. These responses are called free associations, and we and other language researchers plan to use these free associations across thousands of words in Singapore English to study the structure of the Singaporean mental lexicon. Thank you for your help with this research!`,
    secondHeader: `<b>Get in touch</b>`,
    secondParagraph: {
      description1: `If you have any concerns or questions regarding this research, please do not hesitate to contact the project team at: `,
      description2: `<b>Principal Investigator: Dr. Cynthia Siew
        Department of Psychology, National University of Singapore.
        Email: </b>`,
    },

    thirdHeader: `<b>Share the study</b>`,
    thirdParagraph: `To get enough words and make the mental dictionary useful, we need many helping hands. If you want to help, just share the study with family and friends or come back some other time for new words! - `,
  },

  footer: {
    footerTop: `This project was inspired by the Small World of Words project. We thank the creators for giving us permission to expand this work into the words that make up the Singaporean lexicon.`,
    footerBottom: `Small World of Words - `,
  },

  email: {
    html: {
      singlishwords: `<b><u>singlishwords@nus.edu.sg</u></b>`,
      professor: `<b><u>cynthia@nus.edu.sg</u></b>`,
    },
    link: {
      singlishwords: `mailto:singlishwords@nus.edu.sg`,
      professor: `mailto:cynthia@nus.edu.sg`,
    },
  },

  url: {
    html: {
      smallworldofwords: `<b><u>https://smallworldofwords.org/</u></b>`,
      singlishwords: `<b><u>https://singlishwords.nus.edu.sg/</u></b>`,
    },
    link: {
      smallworldofwords: `https://smallworldofwords.org/`,
      singlishwords: `https://singlishwords.nus.edu.sg/`,
    },
  },
};
