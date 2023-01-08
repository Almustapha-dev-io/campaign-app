import { FeedbackChannels } from 'types/feedback';
import * as yup from 'yup';

export type TFeedbackForm = {
  // lgaId: string;
  // wardId: string;
  comment: string;
  channel: FeedbackChannels;
};

const feedbackSchema = yup.object().shape({
  // lgaId: yup.string().required(),
  // wardId: yup.string().required(),
  comment: yup.string().required(),
  channel: yup.string().required(),
});

export default feedbackSchema;
