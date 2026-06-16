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
  profilePicture?: string;
  logo?: string;
  gender?: string;
  phoneNumber?: string;
  createdOn?: string;
  bio?: string;
  interest?: string[];
  address?: any;
  bankDetails?: any;
}

interface UserState {
  selectedUser: User | null;
  currentUser: User | null;
}

const initialState: UserState = {
  selectedUser: null,
  currentUser: null,
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
    setCurrentUser(state, action: PayloadAction<User>) {
      state.currentUser = action.payload;
    },
    clearCurrentUser(state) {
      state.currentUser = null;
    },
  },
});

export const { setSelectedUser, clearSelectedUser, setCurrentUser, clearCurrentUser } = detailsSlice.actions;
export default detailsSlice.reducer;
