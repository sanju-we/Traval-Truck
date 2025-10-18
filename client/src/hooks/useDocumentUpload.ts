// hooks/useDocumentUpload.ts
import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '@/services/api';

export function useDocumentUpload<T>(endpoint: string, profileSetter: (data: T) => void) {
  const [isUpload, setIsUpload] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteLoad, setDeleteLoad] = useState<string | null>(null);

  async function handleDocumentSubmit(formData: FormData) {
    setIsSaving(true);
    try {
      const { data } = await api.put(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (!data.success) {
        toast.error(data.message || 'Upload failed');
        return false;
      }
      profileSetter(data.data);
      toast.success('Documents uploaded successfully!');
      setIsUpload(false);
      return true;
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload documents');
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function handleRemoveDocument(key: string, documentUrl: string | undefined) {
    if (!documentUrl) {
      toast.error('No document to remove.');
      return;
    }
    setDeleteLoad(key);
    try {
      const response = await api.delete('/restaurant/profile/delete-image', {
        data: { documentUrl, key },
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.data.success) {
        profileSetter(response.data.data);
        toast.success(`${key} removed successfully!`);
      } else {
        toast.error('Failed to remove document.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error removing document.');
    } finally {
      setDeleteLoad(null);
    }
  }

  return { isUpload, setIsUpload, isSaving, deleteLoad, handleDocumentSubmit, handleRemoveDocument };
}