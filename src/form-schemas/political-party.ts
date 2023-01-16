import { TPoliticalParty } from 'types/political-party';
import * as yup from 'yup';

export type TPoliticalPartyForm = TPoliticalParty;

const politicalPartySchema = yup.object().shape({
  id: yup.string().required(),
  name: yup.string().required(),
});

export default politicalPartySchema;
