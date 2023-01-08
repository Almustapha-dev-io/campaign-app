import { TWard } from './ward';

export type TPollingUnit = {
  id: number;
  name: string;
  ward: TWard;
  registeredVoters: number;
  accreditedVoters: number;
  recordedVoters: number;
  invalidVoters: number;
};

export type PollingUnitIssueDTO = {
  id?: number;
  issue: string;
  pollingUnitId: number;
  comment: string;
  mediaUrl: string;
};

export type TPollingUnitIssue = {
  id: number;
  issue: string;
  pollingUnit: TPollingUnit;
  comment: string;
  mediaUrl: string;
  madeBy: string;
  dateMade: string;
  lastUpdatedBy: string;
  lastUpdatedOn: string;
};

export type PollingUnitDTO = {
  id?: number;
  name: string;
  wardId: number;
  registeredVoters: number;
  accreditedVoters: number;
  recordedVoters: number;
  invalidVoters: number;
};
