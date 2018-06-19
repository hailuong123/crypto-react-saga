import { GET_ACCOUNT, GET_LIST_TOKEN } from '../actions/constants';
import { takeEvery, fork, take } from 'redux-saga/effects';

export function* handlerAccount()  {
  const { account } = yield take(GET_ACCOUNT);
  yield fork(GetAccount, account);
}

function* GetAccount(account: string) {
  yield;
}

export function* handlerToken() {
  yield takeEvery(GET_LIST_TOKEN, getListToken);
}

function* getListToken() {
  yield console.log('Get list token');
}