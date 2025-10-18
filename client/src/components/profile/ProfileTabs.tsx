// components/profile/ProfileTabs.tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Mail, Phone } from 'lucide-react';

interface ProfileTabsProps<T, D> {
  profile: T;
  documents: D;
  onRemoveDocument: (key: string, url: string | undefined) => void;
  deleteLoad: string | null;
}

export function ProfileTabs<T, D>({ profile, documents, onRemoveDocument, deleteLoad }: ProfileTabsProps<T, D>) {
  return (
    <Tabs defaultValue="profile" className="mt-8">
      <TabsList className="grid grid-cols-3 w-full max-w-2xl mx-auto">
        <TabsTrigger value="profile">Profile Info</TabsTrigger>
        <TabsTrigger value="bank">Bank Details</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg shadow-sm">
            <Mail className="text-emerald-500" size={20} />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-800">{(profile as any).email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg shadow-sm">
            <Phone className="text-emerald-500" size={20} />
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium text-gray-800">{(profile as any).phone || 'N/A'}</p>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="bank">
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-800">Bank Details</h3>
          <div className="mt-4 space-y-3">
            <p><b>Account Holder:</b> {(profile as any).bankDetails?.accountHolder || 'N/A'}</p>
            <p><b>Account Number:</b> {(profile as any).bankDetails?.accountNumber || 'N/A'}</p>
            <p><b>Bank Name:</b> {(profile as any).bankDetails?.bankName || 'N/A'}</p>
            <p><b>IFSC Code:</b> {(profile as any).bankDetails?.ifscCode || 'N/A'}</p>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="documents">
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-800">Documents</h3>
          {documents &&
            Object.entries(documents).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center py-2 px-4 border-b border-gray-200">
                <span className="font-medium capitalize text-gray-800">{key.replace(/([A-Z])/g, ' $1')}</span>
                {typeof value === 'string' ? (
                  <div className="flex items-center space-x-3">
                    <a href={value} target="_blank" className="text-blue-600 hover:underline">
                      View
                    </a>
                    <button
                      onClick={() => onRemoveDocument(key, value)}
                      className={`text-red-600 hover:text-red-800 ${deleteLoad === key ? 'cursor-not-allowed' : ''}`}
                      disabled={deleteLoad === key}
                    >
                      {deleteLoad === key ? (
                        <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        'Remove'
                      )}
                    </button>
                  </div>
                ) : (
                  <span className="text-red-500 font-medium">Required - Not Uploaded</span>
                )}
              </div>
            ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}