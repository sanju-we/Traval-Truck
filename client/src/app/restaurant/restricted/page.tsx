'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function VendorRestrictedPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
      {/* Warning Icon */}
      <div className="flex flex-col items-center">
        <AlertTriangle className="w-20 h-20 text-red-500 mb-6" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Access Restricted</h1>
        <p className="text-gray-600 text-center max-w-md mb-6">
          Your vendor account has been{' '}
          <span className="font-semibold text-red-600">restricted by the admin</span>. Please
          contact our support team for further assistance.
        </p>

        {/* Actions */}
        <div className="flex gap-4">
          <Button variant="secondary" onClick={() => router.push('/restaurant')}>
            Back to Home
          </Button>
          <Button variant="default" onClick={() => router.push('/support')}>
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}
