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
      
      Upon completion of the study, you can enter a <b>monthly lucky draw (refer to "Lucky Draw T&C")</b> to stand a chance of winning $5 Grab vouchers by entering your email address in the last page. The more times you complete the study, the more chances you get. <i>Don't say bojio!<i/>
      
      If you proceed, you consent to your demographic and linguistic data to be collected for research purposes. This data is completely anonymous, and never linked to your personal or contact information. Your anonymized data could be shared with other researchers for the purpose of scientific exploration.`,
    luckyDrawButton: `Lucky Draw T&C`,
    luckyDrawDescription: `The lucky draw will be active from 1st January 2022 to 31st December 2022. In order to participate, please email the unique code shown at the end of the survey to singlishwords@nus.edu.sg. 
      
      Your decision to participate is voluntary. The chance that each participant has to win a voucher is proportional to the number of times they had completed the study and entered their email address on the final page. Participants who have been identified as exhibiting bot-like behavior are not permitted to participate in the lucky draw.
      
      Winners of the lucky draw will be randomly selected on the final day of the month. All participants will be notified of the outcome regardless of whether they had won or not. 100 $5 Grab Vouchers will be awarded each month.
      
      After winners have been selected, the pool from which the lucky draw winners are selected is reset for the next month.`,
    continueButton: `I want to participate!`,
    footerTop: `This project was inspired by the Small World of Words project. We thank the creators for giving us permission to expand this work into the words that make up the Singaporean lexicon.`,
    footerBottom: `Small World of Words - `,
    urlHtml: `<b><u>https://smallworldofwords.org/</u></b>`,
    urlLink: `https://smallworldofwords.org/`,
  },

  // /* Introduction Page (Student) */
  // introductionPageStudent: {
  //   title: `A Small World of Singlish Words:`,
  //   subtitle: `A Word Association Study`,
  //   introduction: `Welcome to this study on word associations in Singapore English. Singaporeans have a unique vocabulary, consisting of Singlish words and phrases that originate from various local languages, on top of the Standard English vocabulary. As researchers studying language and memory we are interested in the nature and organization of this unique mental dictionary of Singapore English.

  //     You can help us capture this knowledge by playing a simple game of word associations. This game takes no more than 30 minutes of your time. All you have to do is to respond with the first three words that come to your mind for a list of Singapore English words.

  //     If you are between 18 to 25 years old, and consider yourself to be a native speaker of Singapore English, you are eligible to take part in our study.

  //     Upon completion of the study, if you are a current NUS student, you are eligible to be reimbursed $5 for your time by emailing us, with your `,
  //   introductionEmail: `NUS student email address`,
  //   introduction2: `, your participation code presented to you only upon completion of this study. `,
  //   introduction3: `Don't say bojio!`,
  //   introduction4: `If you proceed, you consent to your demographic and linguistic data to be collected for research purposes. This data is completely anonymous, and never linked to your personal or contact information. Your anonymized data could be shared with other researchers for the purpose of scientific exploration.`,
  //   continueButtonDescription: `I want to participate!`,
  //   footerTop: `This project was inspired by the Small World of Words project. We thank the creators for giving us permission to expand this work into the words that make up the Singaporean lexicon.`,
  //   footerBottom: `Small World of Words - `,
  // },

  /* Information about you Page */
  informationAboutYouPage: {
    title: `Information about you`,
    instruction1: `Before we get started, please provide the following info.`,
    instruction2: `Asterisk (*) indicates a compulsory field.`,
    ageInstruction: `Please select your age`,
    genderInstruction: `Please select your gender`,
    educationInstruction: `Please select your highest attained educational qualification`,
    birthCountryInstruction: `Please select your country of birth`,
    ethnicityInstruction: `Please select your ethnic group`,
    residenceCountryInstruction: `Please select your current country of residence`,
    nativeSpeakerInstruction: `Are you a native English speaker?`,
    otherLanguagesInstruction: `What other languages do you speak?`,
    buttonDescription: `continue`,
    ages: agesList,
    genderTypes: genderList,
    educationLevels: educationLevelList,
    countries: countriesList,
    ethnicities: ethicGroupList,
    yesAndNo: yesNoList,
    languagesSpoken: languagesSpokenList,
  },

  /* Instructions Page */
  instructionsPage: {
    title: `Instructions`,
    firstParagraphHeader: `How it works...`,
    firstParagraphDescription: {
      description1: `On the top of the screen a Singapore English word will appear.`,
      description2: `Enter the first word that comes to mind`,
      description3: `when reading this word.`,
      description4: `Press`,
      description5: `Enter`,
      description6: `to add a second and third word or proceed to the next word if you can't think of any.
        
        If you don't know the word at all, you can just proceed to the next word.`,
    },
    secondParagraphHeader: `Some tips`,
    secondParagraphDescription: {
      description1: `Only give associations to the word on top of the screen (not to your previous responses!)`,
      description2: `Try to avoid full sentences or long phrases as responses.`,
      description3: `Simply type a word and press `,
      description4: `Enter`,
      description5: ` to go to the next one.`,
      buttonDescription: `continue`,
    },
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
    firstParagraphHeader: `What are we trying to do`,
    firstParagraphDescription: `The mental lexicon is the part of long-term memory where all of the words that you know and their meanings are stored. The connections between these words and concepts can be represented as a language network (akin to a “social network” of words) to model the large-scale structure of the mental lexicon.
      
      In this study, you were asked to respond with words that came to your mind upon the presentation of Singapore English words. These responses are called free associations, and we and other language researchers plan to use these free associations across thousands of words in Singapore English to study the structure of the Singaporean mental lexicon. Thank you for your help with this research!`,
    secondParagraphHeader: `If you would like to take part in the lucky draw or receive updates about this research`,
    secondParagraphDescription: {
      description1: `Please email the following code to `,
      email: `singlishwords@nus.edu.sg`,
      description2: ` to take part in the lucky draw.`,
      enterCode: `Your code is:`,
      description3: `Note that your contact information is never connected to the data you provided previously. Your responses remain confidential and anonymous.`,
    },
    thirdParagraphHeader: `Lucky Draw Terms & Conditions`,
    thirdParagraphDescription: `The lucky draw will be active from 1st January 2022 to 31st December 2022. Your decision to participate is voluntary. The chance that each participant has to win a voucher is proportional to the number of times they had completed the study and entered their email address on the final page. Participants who have been identified as exhibiting bot-like behavior are not permitted to participate in the lucky draw.
      Winners of the lucky draw will be randomly selected on the final day of the month. All participants will be notified of the outcome regardless of whether they had won or not. 100 $5 Grab Vouchers will be awarded each month.
      
      After winners have been selected, the pool from which the lucky draw winners are selected is reset for the next month.`,
    fourthParagraphHeader: `Get in touch`,
    fourthParagraphDescription: {
      description1: `If you have any concerns or questions regarding this research, please do not hesitate to contact the project team at: `,
      email: `singlishwords@nus.edu.sg`,
      description2: `Principal Investigator: Dr. Cynthia Siew
        Department of Psychology, National University of Singapore.
        Email: `,
      email2: `cynthia@nus.edu.sg`,
    },

    fifthParagraphHeader: `Share the study`,
    fifthParagraphDescription: `To get enough words and make the mental dictionary useful, we need many helping hands. If you want to help, just share the study with family and friends or come back some other time for new words! - `,
  },

  // /* Email Page (Student) */
  // emailPageStudent: {
  //   title: `Thank You!`,
  //   firstParagraphHeader: `What are we trying to do`,
  //   firstParagraphDescription: `The mental lexicon is the part of long-term memory where all of the words that you know and their meanings are stored. The connections between these words and concepts can be represented as a language network (akin to a “social network” of words) to model the large-scale structure of the mental lexicon.

  //     In this study, you were asked to respond with words that came to your mind upon the presentation of Singapore English words. These responses are called free associations, and we and other language researchers plan to use these free associations across thousands of words in Singapore English to study the structure of the Singaporean mental lexicon. Thank you for your help with this research!`,
  //   secondParagraphHeader: `If you would like to be reimbursed or receive updates about this research`,
  //   secondParagraphDescription: {
  //     description1: `Please email the following code to `,
  //     email: `singlishwords@nus.edu.sg`,
  //     description2: ` to be reimbursed.`,
  //     enterCode: `Your code is:`,
  //     description3: `Note that your contact information is never connected to the data you provided previously. Your responses remain confidential and anonymous.`,
  //   },
  //   //    thirdParagraphHeader: `Get in touch`,
  //   //    thirdParagraphDescription: {
  //   //      description1: `If you have any concerns or questions regarding this research, please do not hesitate to contact the project team at: `,
  //   //      email: `smallworldofsinglishwords@gmail.com`,
  //   //      description2: `Principal Investigator: Dr. Cynthia Siew
  //   //      Department of Psychology, National University of Singapore.
  //   //      Email: `,
  //   //      email2: `cynthia@nus.edu.sg`,
  //   //    },
  // },
};
