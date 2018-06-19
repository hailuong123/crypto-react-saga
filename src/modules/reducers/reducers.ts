import { GET_ACCOUNT, GET_LIST_TOKEN } from '../actions/constants';

const initialState = {
  isLoading: true,
  account: ''
};

const initialStateToken = {
  isLoading: false,
  token: null
};

export function getAccountReducer(state: any = initialState, action: any) {
  switch (action.type) {
    case GET_ACCOUNT:
      return {
        isLoading: false,
        account: action.account
      };
    default:
      return state;
  }
}

export function getListToken(state: any = initialStateToken, action: any) {
  switch (action.type) {
    case GET_LIST_TOKEN:
      return {
        isLoading: false,
        token: action.token
      };
    default:
      return state;
  }
}

export default {
  getAccountReducer,
  getListToken
};
