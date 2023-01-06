import { VotedParty, VoterStatus } from 'types/voter';
import * as yup from 'yup';

export type TVoterResponseForm = {
  votedParty: VotedParty;
  electionTypeId: string;
  reasonForVoting: string;
  status: VoterStatus;
  dateCalled: Date;
  agentRemark: string;
};

const voterResponseSchema = yup.object().shape({
  votedParty: yup
    .string()
    .oneOf([VotedParty.APC, VotedParty.PDP, VotedParty.OTHERS])
    .required()
    .label('Party'),
  electionTypeId: yup.string().required().label('Election type'),
  reasonForVoting: yup.string().required().label('Reason for voting'),
  status: yup
    .string()
    .oneOf([VoterStatus.DONE, VoterStatus.PENDING])
    .required()
    .label('Status'),
  dateCalled: yup
    .date()
    .typeError('Enter a valid date')
    .required()
    .label('Date called'),
  agentRemark: yup.string().required().label('Agent remarks'),
});

export default voterResponseSchema;
