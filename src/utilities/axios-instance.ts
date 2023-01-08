import axios from 'axios';
import { apiBaseURL, cloudinaryUploadAPI } from 'utilities/env';

export const apiAxios = axios.create({
  baseURL: apiBaseURL,
});

export const cloudinaryApiAxios = axios.create({
  baseURL: cloudinaryUploadAPI,
});
