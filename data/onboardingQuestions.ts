import { OnboardingQuestion } from '../types';

export const onboardingQuestions: OnboardingQuestion[] = [
  {
    id: 'bio',
    question: 'Tell us about yourself',
    type: 'text',
    required: true,
  },
  {
    id: 'photos',
    question: 'Add your photos',
    type: 'photo',
    required: true,
  },
  {
    id: 'religiousCommitment',
    question: 'How would you describe your religious commitment?',
    options: [
      'Very Practicing',
      'Practicing',
      'Moderately Practicing',
      'Somewhat Practicing',
      'Not Practicing',
    ],
    type: 'select',
    required: true,
  },
  {
    id: 'educationLevel',
    question: 'What is your highest level of education?',
    options: [
      'High School',
      'Associate Degree',
      'Bachelors',
      'Masters',
      'PhD',
      'Medical Degree',
      'Law Degree',
      'Other Professional Degree',
    ],
    type: 'select',
    required: true,
  },
  {
    id: 'occupation',
    question: 'What do you do for work?',
    type: 'text',
    required: true,
  },
  {
    id: 'interests',
    question: 'What are your interests?',
    options: [
      'Reading',
      'Travel',
      'Cooking',
      'Fitness',
      'Art',
      'Music',
      'Sports',
      'Photography',
      'Technology',
      'Outdoors',
      'Volunteering',
      'Movies & TV',
      'Fashion',
      'Languages',
      'Writing',
      'Entrepreneurship',
    ],
    type: 'multiselect',
    required: true,
  },
  {
    id: 'ageRange',
    question: 'What age range are you looking for?',
    type: 'slider',
    required: true,
  },
  {
    id: 'religiousPreference',
    question: 'What religious commitment are you looking for in a partner?',
    options: [
      'Very Practicing',
      'Practicing',
      'Moderately Practicing',
      'Somewhat Practicing',
    ],
    type: 'multiselect',
    required: true,
  },
  {
    id: 'location',
    question: 'Where are you located?',
    type: 'text',
    required: true,
  },
];