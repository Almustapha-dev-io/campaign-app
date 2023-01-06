import { TElectionType } from './election-type';
import { TWard } from './ward';

export type TVoterTest = {
  phoneNumber: string;
  status: 'pending' | 'called';
  dateAdded: string;
  dateUpdated: string;
  partyVotedFor: string;
  comment: string;
};

export type TVoter = {
  id: number;
  phoneNumber: string;
  email: string;
  name: string;
  ward: TWard;
  dateAdded: string;
  status: VoterStatus;
  dateCalled: string;
  agentRemark: string;
  calledBy: string;
  reasonForVoting: string;
  votedParty: VotedParty;
  electionType: TElectionType;
};

export type UploadVotersDTO = {
  file: File;
  wardId: string;
  electionTypeId: string;
};

export enum VotedParty {
  PDP = 'PDP',
  APC = 'APC',
  OTHERS = 'OTHERS',
}

export enum VoterStatus {
  PENDING = 'PENDING',
  DONE = 'DONE',
}

export type VoterResponseDTO = {
  votedParty: VotedParty;
  electionTypeId: string;
  reasonForVoting: string;
  status: VoterStatus;
  dateCalled: string;
  agentRemark: string;
  votersDetailsId: number;
};
