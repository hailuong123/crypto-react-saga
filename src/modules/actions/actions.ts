import { GET_ACCOUNT, GET_LIST_TOKEN } from './constants';

export const getAccount = (account: string) => {
  return {
    type: GET_ACCOUNT,
    account: account
  }; 
};

export const getListToken = (token: any) => {
  return {
    type: GET_LIST_TOKEN,
    token
  };
};
