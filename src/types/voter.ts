import { TElectionType } from './election-type';
import { TPoliticalParty } from './political-party';

export type TVoter = {
  id: number;
  phoneNumber: string;
  email: string;
  name: string;
  dateAdded: string;
  status: VoterStatus;
  dateCalled: string;
  agentRemark: string;
  calledBy: string;
  reasonForVoting: string;
  party: TPoliticalParty;
  electionType: TElectionType;
};

export type UploadVotersDTO = {
  file: File;
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
  votedParty: string;
  electionTypeId: string;
  reasonForVoting: string;
  status: VoterStatus;
  dateCalled: string;
  agentRemark: string;
  votersDetailsId: number;
};
