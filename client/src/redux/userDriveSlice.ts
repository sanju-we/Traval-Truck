import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserDriveState {
  currentStep: number;
  answers: string[];
}

const initialState: UserDriveState = {
  currentStep: 0,
  answers: Array(5).fill(''),
};

const userDriveSlice = createSlice({
  name: 'userDrive',
  initialState,
  reducers: {
    setAnswer: (state, action: PayloadAction<{ step: number; answer: string }>) => {
      state.answers[action.payload.step] = action.payload.answer;
    },
    nextStep: (state) => {
      if (state.currentStep < 4) state.currentStep += 1;
    },
    prevStep: (state) => {
      if (state.currentStep > 0) state.currentStep -= 1;
    },
    resetDrive: () => initialState,
  },
});

export const { setAnswer, nextStep, prevStep, resetDrive } = userDriveSlice.actions;
export default userDriveSlice.reducer;
