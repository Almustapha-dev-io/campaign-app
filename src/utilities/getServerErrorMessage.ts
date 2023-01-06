import axios from 'axios';

const getServerErrorMessage = (error: unknown): string => {
  let message = 'There was an error processing your request';
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const serverMsg = error.response.data.errorMessage;
      message = serverMsg || message;
    }
  }

  if ((error as any).data) {
    const serverMsg = (error as any).data.errorMessage;
    message = serverMsg || message;
  }

  return message;
};

export const getAuthServerErrorMessage = (error: unknown): string => {
  let message = 'There was an error processing your request';
  if (axios.isAxiosError(error)) {
    if (error.response) {
      message = 'Invalid username or password';
    }
  }

  return message;
};

export default getServerErrorMessage;
