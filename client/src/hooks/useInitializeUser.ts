'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentUser } from '@/redux/userDetailsSlice';
import { RootState } from '@/redux/store';
import api from '@/services/api';

export function useInitializeUser() {
    const dispatch = useDispatch();
    const currentUser = useSelector((state: RootState) => state.details.currentUser);

    useEffect(() => {
        const fetchAndStoreUser = async () => {
            // Only fetch if user is not already in Redux
            if (!currentUser) {
                try {
                    const { data } = await api.get('/user/profile/profile');
                    if (data.success) {
                        dispatch(setCurrentUser(data.data));
                    }
                } catch (err) {
                    console.error('Error fetching user:', err);
                }
            }
        };

        fetchAndStoreUser();
    }, [currentUser, dispatch]);

    return currentUser;
}
