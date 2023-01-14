import { TPollingUnit } from './polling-unit';

export type TVote = {
  id: number;
  addedBy: string;
  dateAdded: string;
  pollingUnit: TPollingUnit;
  numberOfVotes: number;
  party: 'APC' | 'PDP' | 'OTHERS';
  lastUpdatedBy: string;
  lastUpdatedOn: string;
};

export type VoteDTO = {
  id?: number;
  pollingUnitId: string;
  numberOfVotes: number;
  party: 'APC' | 'PDP' | 'OTHERS';
};

export type TOfflineVote = {
  party: string;
  votes: number;
  pollingUnit: TPollingUnit;
};
