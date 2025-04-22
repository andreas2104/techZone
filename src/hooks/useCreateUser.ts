// hooks/useCreateUser.ts
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

interface CreateUserInput {
  username: string;
  password: string;
  sessionTimeOut: string;
  limitBytesIn?: string;
  limitBytesOut?: string;
}

interface CreateUserResponse {
  message: string;
}

export const useCreateUser = () => {
  return useMutation<CreateUserResponse, Error, CreateUserInput>({
    mutationFn: async (data) => {
      const response = await axios.post('/api/users', data);
      return response.data;
    },
  });
};
