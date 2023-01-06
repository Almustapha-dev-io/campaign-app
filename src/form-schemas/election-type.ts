import * as yup from 'yup';

export type TElectionTypeForm = {
  type: string;
  description: string;
};

const electionTypeSchema = yup.object().shape({
  type: yup.string().required(),
  description: yup.string().required(),
});

export default electionTypeSchema;
