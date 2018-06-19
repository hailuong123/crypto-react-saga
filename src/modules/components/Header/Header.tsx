import * as React from 'react';
import Container from '../Container';
import { connect } from 'react-redux';
import { getAccount } from '../../actions/actions';

import NavHref from '../Nav/Nav.link';
import { Image } from '../';

interface Props {
  account: Account;
  getAccount: Function;
}

type Account = {
  readonly isLoading: boolean;
  readonly account: string;
};

interface State {}

const Web3 = require('web3');
let metamask: any;

class Header extends React.Component<Props, State> {

  async componentWillMount() {
    const _window = window as any;

    if (typeof(_window.web3) !== 'undefined') {
      metamask = new Web3(_window.web3.currentProvider);

      await metamask.eth.getAccounts().then((results: any) => {
        results.map((result: any) => {
          this.props.getAccount(result);
        });
      });
    } else {
      console.log('No web3? You should consider trying MetaMask!');
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      _window.web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/sOabGYzDK8MjzepbSkxy'));
    }
  }

  render() {
    const { account } = this.props.account;
    
    return (
      <header>
        <Container>
          <div className="leftHeader">
            <h1 className="logo">
              <NavHref to={'/'}>
                <Image src={require('../../../assets/images/bacoor.png')} width={100} />
                <span style={{fontSize: 10, fontWeight: 700}}>Portal Demo</span>
              </NavHref>
            </h1>
          </div>
          <div className="rightHeader">
            {
              account !== '' ? (
                <NavHref RootComponent="p" hasSubNav={true}>
                  <Image src={require('../../../assets/images/demo.png')} height={32} width={32} />
                  <span className="hashText">{account}</span>
                </NavHref>
              ) : (
                <p>
                  <span className="notAccount">Haven't account</span>
                </p>
              )
            }
            
          </div>
        </Container>
      </header>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    account: state.getAccountReducer
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    getAccount: (account: string) => dispatch(getAccount(account)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header as any);