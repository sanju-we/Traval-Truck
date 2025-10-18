// hooks/useProfile.ts
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/services/api';

export function useProfile<T>(endpoint: string, redirectPath: string = '/') {
  const [profile, setProfile] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data } = await api.get(endpoint);
        if (!data.success) {
          toast.error(data.message);
          if (data.message === 'This user is Restricted by the admin') {
            router.push(redirectPath);
          }
          return;
        }
        setProfile(data.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [endpoint, router, redirectPath]);

  async function updateProfile(formData: FormData) {
    try {
      const { data } = await api.patch(endpoint, formData);
      if (!data.success) {
        toast.error(data.message || 'Update failed');
        return false;
      }
      setProfile(data.data);
      toast.success('Profile updated successfully');
      return true;
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile');
      return false;
    }
  }

  return { profile, setProfile, loading, updateProfile };
}