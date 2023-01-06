import axios from 'axios';
import { apiBaseURL } from 'utilities/env';

export const apiAxios = axios.create({
  baseURL: apiBaseURL,
});
