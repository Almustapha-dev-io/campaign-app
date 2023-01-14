import { TUser } from 'types/user';
import { TOfflineVote } from 'types/vote';

const OFFLINE_USER_KEY = 'offlineUser';
const OFFLINE_VOTES_KEY = 'offlineVotes';

function isUser(
  obj: any
): obj is { user: TUser; password: string; token: string } {
  if (!obj || !obj.user || !obj.password || !obj.token) return false;
  return obj.user.id !== undefined && obj.user.email !== undefined;
}

export const storeOfflineUser = (
  user: TUser,
  password: string,
  token: string
) => {
  const data = { user, password, token };
  localStorage.setItem(OFFLINE_USER_KEY, JSON.stringify(data));
};

export const getOfflineUser = () => {
  const dataString = localStorage.getItem(OFFLINE_USER_KEY);
  if (!dataString) return null;

  try {
    const parsedData = JSON.parse(dataString);
    if (!isUser(parsedData)) return null;
    return parsedData;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const clearOfflineData = () => {
  localStorage.removeItem(OFFLINE_USER_KEY);
};

export const getOfflineVotes = () => {
  const dataString = localStorage.getItem(OFFLINE_VOTES_KEY);
  if (!dataString) return [] as TOfflineVote[];

  try {
    const parsedData = JSON.parse(dataString);
    if (!(parsedData instanceof Array)) {
      return [] as TOfflineVote[];
    }
    return parsedData as TOfflineVote[];
  } catch (error) {
    console.log(error);
    return [] as TOfflineVote[];
  }
};

export const setOfflineVotes = (votes: TOfflineVote[]) => {
  localStorage.setItem(OFFLINE_VOTES_KEY, JSON.stringify(votes));
};

export const addOfflineVote = (vote: TOfflineVote) => {
  const votes = getOfflineVotes();

  const existingVoteIndex = votes.findIndex((v) => v.party === vote.party);
  if (existingVoteIndex > -1) {
    votes[existingVoteIndex] = vote;
  } else {
    votes.push(vote);
  }

  setOfflineVotes(votes);
};

export const clearOfflineVotes = () => {
  localStorage.removeItem(OFFLINE_VOTES_KEY);
};
