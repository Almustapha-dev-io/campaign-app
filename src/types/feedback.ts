import { TWard } from './ward';

export enum FeedbackChannels {
  Facebook = 'FACEBOOK',
  Twitter = 'TWITTER',
  Instagram = 'INSTAGRAM',
  Others = 'OTHERS',
}

export type TFeedback = {
  id: number;
  ward: TWard;
  madeBy: string;
  dateAdded: string;
  comment: string;
  channel: FeedbackChannels;
};

export type FeedbackDTO = {
  feedbackId?: number;
  comment: string;
  wardId: string;
  channel: FeedbackChannels;
};
