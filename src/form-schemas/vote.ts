import * as yup from 'yup';

export type TVoteForm = {
  pollingUnitId: string;
  numberOfVotes: number;
  party: 'PDP' | 'APC' | 'OTHERS';
};

export const voteSchema = yup.object().shape({
  pollingUnitId: yup.string().required(),
  numberOfVotes: yup.number().min(0).required().typeError('Enter a number'),
  party: yup.string().oneOf(['APC', 'PDP', 'OTHERS']).required(),
});
