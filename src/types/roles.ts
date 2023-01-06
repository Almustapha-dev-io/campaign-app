export type TRole = {
  id: number;
  name: Roles;
};

export enum Roles {
  SuperAdmin = 'SUPER_ADMIN',
  CallCenterAgent = 'CALL_CENTER_AGENT',
  ObservationRoomAgent = 'OBSERVATION_ROOM_AGENT',
  PartyAgent = 'PARTY_AGENT',
}
