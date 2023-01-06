export type TElectionType = {
  id: number;
  type: string;
  description: string;
  addedBy: string;
};

export type ElectionTypeDTO = Omit<TElectionType, 'addedBy' | 'id'>;
