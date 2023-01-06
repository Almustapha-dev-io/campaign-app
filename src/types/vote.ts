import { TWard } from './ward';

export type TVote = {
  id: number;
  addedBy: string;
  dateAdded: string;
  ward: TWard;
  numberOfVotes: number;
  party: 'APC' | 'PDP' | 'OTHERS';
  lastUpdatedBy: string;
  lastUpdatedOn: string;
};

export type VoteDTO = {
  id?: number;
  wardId: string;
  numberOfVotes: number;
  party: 'APC' | 'PDP' | 'OTHERS';
};
