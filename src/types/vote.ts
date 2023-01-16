import { TPoliticalParty } from './political-party';
import { TPollingUnit } from './polling-unit';

export type TVote = {
  id: number;
  addedBy: string;
  dateAdded: string;
  pollingUnit: TPollingUnit;
  numberOfVotes: number;
  party: TPoliticalParty;
  lastUpdatedBy: string;
  lastUpdatedOn: string;
};

export type VoteDTO = {
  id?: number;
  pollingUnitId: string;
  numberOfVotes: number;
  party: string;
};

export type TOfflineVote = {
  party: string;
  votes: number;
  pollingUnit: TPollingUnit;
};
