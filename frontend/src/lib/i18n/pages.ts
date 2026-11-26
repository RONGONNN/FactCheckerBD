// Long text for the information pages. Keep it true to what the code actually does.
import type { Language } from '../../types/api';

export type InfoPageKey = 'howItWorks' | 'about' | 'privacy';

export interface InfoContent {
  title: string;
  sections: { heading: string; paragraphs: string[] }[];
}

const bn: Record<InfoPageKey, InfoContent> = {
  howItWorks: {
    title: 'কীভাবে কাজ করে',
    sections: [
      {
        heading: '১. দাবি জমা দিন',
        paragraphs: ['বাংলা বা ইংরেজিতে সর্বোচ্চ ১,০০০ অক্ষরের একটি দাবি লিখুন।'],
      },
      {
        heading: '২. অনুমোদিত উৎসে খোঁজা',
        paragraphs: ['শুধু অনুমোদিত ফ্যাক্ট-চেকিং ও সংবাদ ওয়েবসাইটে প্রাসঙ্গিক পাতা খোঁজা হয়।'],
      },
      {
        heading: '৩. প্রমাণ বিশ্লেষণ',
        paragraphs: [
          'AI শুধু খুঁজে পাওয়া প্রমাণ দাবিটির সাথে মিলিয়ে দেখে।',
          'প্রমাণ না থাকলে বা দুর্বল হলে ফলাফল হয় "অপর্যাপ্ত প্রমাণ"। কিছু না পাওয়া মানে দাবিটি মিথ্যা, এমন নয়।',
        ],
      },
      {
        heading: '৪. নিজে বিচার করুন',
        paragraphs: ['ফলাফল একটি প্রাথমিক মূল্যায়ন এবং ভুল হতে পারে। মূল উৎসগুলো পড়ে তারপর শেয়ার করুন।'],
      },
    ],
  },
  about: {
    title: 'প্রকল্প সম্পর্কে',
    sections: [
      {
        heading: 'উদ্দেশ্য',
        paragraphs: [
          'সামাজিক যোগাযোগমাধ্যমে ছড়ানো দাবি শেয়ার করার আগে প্রাসঙ্গিক প্রমাণ ও মূল প্রতিবেদন খুঁজে পেতে সাহায্য করা।',
          'এটি পেশাদার ফ্যাক্ট-চেকারের বিকল্প নয় এবং সব দাবি যাচাই করতে পারবে এমন নিশ্চয়তা দেয় না।',
        ],
      },
      {
        heading: 'থিসিসের সাথে সম্পর্ক',
        paragraphs: [
          'এটি Daffodil International University র Software Engineering বিভাগের একটি একাডেমিক প্রকল্প।',
          'সম্পর্কিত থিসিস: "The Impact of Social Media Rumors on Bangladeshi Social Media Users: A Survey-Based Study on Trust, Information Verification, and User Behavior"।',
        ],
      },
    ],
  },
  privacy: {
    title: 'গোপনীয়তা নীতি',
    sections: [
      {
        heading: 'অ্যাকাউন্ট',
        paragraphs: ['কোনো অ্যাকাউন্ট, লগইন, নাম বা ফোন নম্বর লাগে না।'],
      },
      {
        heading: 'আপনার দাবি কোথায় যায়',
        paragraphs: [
          'যাচাই করার জন্য দাবিটি আমাদের সার্ভার হয়ে OpenAI তে পাঠানো হয়, এবং তাদের নিজস্ব নীতি প্রযোজ্য।',
          'আমাদের সার্ভার দাবি সংরক্ষণ করে না। তবু কোনো ব্যক্তিগত তথ্য লিখবেন না।',
        ],
      },
      {
        heading: 'ইতিহাস',
        paragraphs: [
          'যাচাইয়ের ইতিহাস ও ভাষার পছন্দ শুধু আপনার ব্রাউজারে থাকে। ইতিহাস পেজ থেকে যেকোনো সময় মুছতে পারবেন।',
        ],
      },
      {
        heading: 'মতামত',
        paragraphs: ['মতামত পাঠালে রেটিং, মন্তব্য, সংশ্লিষ্ট যাচাইয়ের আইডি ও সময় সার্ভারে সংরক্ষিত হয়।'],
      },
    ],
  },
};

const en: Record<InfoPageKey, InfoContent> = {
  howItWorks: {
    title: 'How it works',
    sections: [
      {
        heading: '1. Submit a claim',
        paragraphs: ['Write a claim of up to 1,000 characters in Bangla or English.'],
      },
      {
        heading: '2. Search approved sources',
        paragraphs: [
          'Only approved fact-checking and news websites are searched for related pages.',
        ],
      },
      {
        heading: '3. Analyse the evidence',
        paragraphs: [
          'The AI compares the claim only with the evidence that was found.',
          'When evidence is missing or weak, the result is "Insufficient evidence". Finding nothing does not mean the claim is false.',
        ],
      },
      {
        heading: '4. Judge for yourself',
        paragraphs: [
          'The result is a preliminary assessment and can be wrong. Read the original sources before sharing.',
        ],
      },
    ],
  },
  about: {
    title: 'About the project',
    sections: [
      {
        heading: 'Purpose',
        paragraphs: [
          'To help people find related evidence and original reports before sharing a claim seen on social media.',
          'It does not replace professional fact-checkers and cannot promise that every claim can be verified.',
        ],
      },
      {
        heading: 'Connection to the thesis',
        paragraphs: [
          'This is an academic project of the Department of Software Engineering, Daffodil International University.',
          'Related thesis: "The Impact of Social Media Rumors on Bangladeshi Social Media Users: A Survey-Based Study on Trust, Information Verification, and User Behavior".',
        ],
      },
    ],
  },
  privacy: {
    title: 'Privacy policy',
    sections: [
      { heading: 'Accounts', paragraphs: ['No account, login, name or phone number is needed.'] },
      {
        heading: 'Where your claim goes',
        paragraphs: [
          'To be checked, the claim is sent through our server to OpenAI, whose own policies apply.',
          'Our server does not store claims. Even so, do not enter personal information.',
        ],
      },
      {
        heading: 'History',
        paragraphs: [
          'Your check history and language choice stay in your browser. You can delete the history from the History page at any time.',
        ],
      },
      {
        heading: 'Feedback',
        paragraphs: [
          'When you send feedback, the rating, comment, related check ID and time are stored on the server.',
        ],
      },
    ],
  },
};

export const infoPages: Record<Language, Record<InfoPageKey, InfoContent>> = { bn, en };
