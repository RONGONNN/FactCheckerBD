// Text for the landing dashboard and footer. Keep it true: no invented numbers or promises.
import type { Language } from '../../types/api';

interface TitledText {
  title: string;
  text: string;
}

export interface HomeContent {
  badge: string;
  titleTop: string;
  titleAccent: string;
  lead: string;
  start: string;
  learnMore: string;
  features: TitledText[];
  stepsTitle: string;
  stepsIntro: string;
  steps: TitledText[];
  bannerTitle: string;
  bannerText: string;
  footerAbout: string;
  footerExplore: string;
  footerProject: string;
}

export const homeContent: Record<Language, HomeContent> = {
  bn: {
    badge: 'AI সহায়তায় তথ্য যাচাই',
    titleTop: 'শেয়ার করার আগে',
    titleAccent: 'সত্যতা যাচাই করুন',
    lead: 'বাংলা বা ইংরেজিতে যেকোনো দাবি লিখুন। দেশ-বিদেশের অনুমোদিত ফ্যাক্ট-চেকিং ও সংবাদ উৎস থেকে প্রমাণ খুঁজে মূল লিংকসহ ফলাফল দেখানো হবে।',
    start: 'যাচাই শুরু করুন',
    learnMore: 'কীভাবে কাজ করে',
    features: [
      { title: 'অনুমোদিত উৎস', text: 'নির্বাচিত ওয়েবসাইটে খোঁজা হয়' },
      { title: 'মূল লিংক', text: 'প্রতিটি উৎস নিজে পড়ে দেখুন' },
      { title: 'বাংলা ও ইংরেজি', text: 'যে ভাষায় সুবিধা, সে ভাষায়' },
      { title: 'লগইন লাগে না', text: 'সরাসরি ব্যবহার করুন' },
    ],
    stepsTitle: 'কীভাবে কাজ করে',
    stepsIntro: 'দাবি থেকে ফলাফল পর্যন্ত চারটি সহজ ধাপ',
    steps: [
      { title: 'দাবি লিখুন', text: 'যে কথাটি যাচাই করতে চান' },
      { title: 'উৎসে খোঁজা', text: 'প্রাসঙ্গিক প্রতিবেদন খোঁজা হয়' },
      { title: 'প্রমাণ বিশ্লেষণ', text: 'AI পাওয়া প্রমাণ মিলিয়ে দেখে' },
      { title: 'নিজে বিচার করুন', text: 'মূল উৎস পড়ে সিদ্ধান্ত নিন' },
    ],
    bannerTitle: 'গুজব ছড়ানোর আগে একবার থামুন।',
    bannerText: 'একটি যাচাই অনেক মানুষকে ভুল তথ্য থেকে বাঁচাতে পারে।',
    footerAbout: 'সামাজিক যোগাযোগমাধ্যমে ছড়ানো দেশ-বিদেশের দাবি যাচাইয়ের একটি একাডেমিক প্রকল্প।',
    footerExplore: 'ঘুরে দেখুন',
    footerProject: 'প্রকল্প',
  },
  en: {
    badge: 'AI-assisted fact-checking',
    titleTop: 'Before you share,',
    titleAccent: 'check the facts',
    lead: 'Write any claim in Bangla or English. Evidence is gathered from approved fact-checking and news sources around the world and shown with links to the originals.',
    start: 'Start checking',
    learnMore: 'How it works',
    features: [
      { title: 'Approved sources', text: 'Only selected websites are searched' },
      { title: 'Original links', text: 'Read every source yourself' },
      { title: 'Bangla and English', text: 'Use the language you prefer' },
      { title: 'No login', text: 'Start straight away' },
    ],
    stepsTitle: 'How it works',
    stepsIntro: 'Four simple steps from a claim to a result',
    steps: [
      { title: 'Write the claim', text: 'The statement you want to check' },
      { title: 'Search sources', text: 'Related reports are collected' },
      { title: 'Analyse evidence', text: 'AI compares what was found' },
      { title: 'Judge for yourself', text: 'Read the originals and decide' },
    ],
    bannerTitle: 'Pause before a rumour spreads.',
    bannerText: 'One check can keep many people away from false information.',
    footerAbout:
      'An academic project for checking claims shared on social media, from Bangladesh and around the world.',
    footerExplore: 'Explore',
    footerProject: 'Project',
  },
};
