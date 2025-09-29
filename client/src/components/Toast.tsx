import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#333',
          color: '#fff',
          fontSize: '16px',
          borderRadius: '15px',
          padding: '18px 22px',
        },
        success: {
          style: {
            background: '#16a34a',
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#16a34a',
          },
        },
        error: {
          style: {
            background: '#dc2626',
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#dc2626',
          },
        },
        loading: {
          style: {
            background: '#2563eb',
            color: '#fff',
          },
        },
      }}
    />
  );
}
