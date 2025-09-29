'use client';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { setAnswer, nextStep, prevStep, resetDrive } from '@/redux/userDriveSlice';
import api from '@/services/api';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const questions = [
  {
    question: 'What kind of trip are you dreaming of?',
    options: ['Adventure', 'Chill & Relax', 'Sea side', 'Mountain', 'Off-road'],
  },
  {
    question: 'What’s your preferred travel duration?',
    options: ['1-3 days', '4-7 days', '1-2 weeks', '1 month+'],
  },
  {
    question: 'Who are you traveling with?',
    options: ['Solo', 'Family', 'Friends', 'Partner'],
  },
  {
    question: 'What’s your budget range?',
    options: ['Budget', 'Mid-range', 'Luxury'],
  },
  {
    question: 'What kind of activities do you enjoy?',
    options: ['Hiking', 'Cultural tours', 'Food trips', 'Wildlife'],
  },
];

export default function UserDrivePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentStep, answers } = useSelector((state: RootState) => state.userDrive);

  const totalSteps = questions.length;

  const handleSelect = (answer: string) => {
    dispatch(setAnswer({ step: currentStep, answer }));
  };

  const handleNext = async () => {
    if (currentStep < totalSteps - 1) {
      dispatch(nextStep());
    } else {
      try {
        const { data } = await api.post('/user/profile/intrest', { interests: answers });
        console.log(data);
        if (data.success) {
          dispatch(resetDrive());
          toast.success('submited successfully');
          router.push('/');
          return;
        }
        toast.error(data.message);
      } catch (err) {
        console.error('Error submitting interests:', err);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 px-6">
      <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
        <motion.div
          className="bg-black h-2 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <h2 className="text-xl font-bold mb-6">
        Question {currentStep + 1} of {totalSteps}
      </h2>
      <p className="text-2xl font-semibold mb-6">{questions[currentStep].question}</p>

      <div className="flex flex-wrap gap-3 mb-8">
        {questions[currentStep].options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleSelect(opt)}
            className={`px-4 py-2 rounded-lg border ${
              answers[currentStep] === opt ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="flex justify-between">
        {currentStep > 0 && (
          <button
            onClick={() => dispatch(prevStep())}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Back
          </button>
        )}
        <button
          onClick={handleNext}
          className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {currentStep === totalSteps - 1 ? 'Submit' : 'Next'}
        </button>
      </div>
    </div>
  );
}
