import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name?: string;
  userName?: string;
  email: string;
  role: string;
  companyName?: string;
  ownerName?: string;
  isApproved?: boolean;
  isBlocked?: boolean;
  phone?: number;
  createdAt?: string;
}

interface UserState {
  selectedUser: User | null;
}

const initialState: UserState = {
  selectedUser: null,
};

const detailsSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setSelectedUser(state, action: PayloadAction<User>) {
      state.selectedUser = action.payload;
    },
    clearSelectedUser(state) {
      state.selectedUser = null;
    },
  },
});

export const { setSelectedUser, clearSelectedUser } = detailsSlice.actions;
export default detailsSlice.reducer;
