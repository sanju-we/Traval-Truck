'use client';

import { Provider } from 'react-redux';
import { store, persistor } from '@/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { ChatNotificationProvider } from '@/components/shared/ChatNotificationProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ChatNotificationProvider>
          {children}
        </ChatNotificationProvider>
      </PersistGate>
    </Provider>
  );
}
