export type TState = {
  id: number;
  name: string;
};

export type TLocalGovernment = {
  id: number;
  name: string;
  state: TState;
};

export type TWard = {
  id: number;
  name: string;
  localGovernment: TLocalGovernment;
};
