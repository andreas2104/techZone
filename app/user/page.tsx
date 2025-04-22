// app/page.tsx
'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CreateUserForm from '@/components/users/createUserForm';

const queryClient = new QueryClient();

const Page = () => (
  <QueryClientProvider client={queryClient}>
    <CreateUserForm />
  </QueryClientProvider>
);

export default Page;
