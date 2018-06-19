import { all, fork } from 'redux-saga/effects';
import { 
  handlerAccount,
  handlerToken
} from './getAccount';

export default function* rootSaga() {
  yield all([
    fork(handlerAccount),
    fork(handlerToken)
  ]);
}