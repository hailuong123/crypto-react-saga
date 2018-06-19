import * as React from 'react';
import { connect } from 'react-redux';
import { ZeroEx } from '0x.js';
import { BigNumber } from '@0xproject/utils';

const Web3 = require('web3');

import { TitlePage, Loading, Icon, Image, Button, Modal, Input } from '../../components';
import { numberField, notZero, compareValue, maxLength } from '../../../utility/validate';

interface Props {
  account: any;
  getListToken?: Function;
}
interface State {
  balanceEth: any;
  balanceWEth: any;
  modal: boolean;
  isloading: boolean;
  amount: string;
  ethAddress: string;
  typeSubmit: string;
  decimalsEth: number;
  decimalsWEth: number;
  validField: ValidField;
}
type ValidField = {
  readonly amount: string;
};

let zeroEx: any;
let metamask: any;

class WrapEthContainer extends React.Component<Props, State> {
  state = {
    balanceEth: '',
    balanceWEth: '',
    modal: false,
    isloading: false,
    amount: '',
    ethAddress: '',
    typeSubmit: '',
    validField: {
      ...this.validFieldDefault
    },
    decimalsEth: 0,
    decimalsWEth: 0
  };
  validFieldDefault = {
    amount: '',
  };

  validate = {
    amount: ['numberField', 'notZero', 'compareValue', 'maxLength'],
  };
  
  message: string = '';

  getEthBalanceAsync = async (owner: string) => {
    const { account } = this.props.account;
    const balanceStr = await metamask.eth.getBalance(owner);
    const balance = metamask.utils.hexToNumberString(balanceStr) / 1e18;
    // let join: Array<any> = [];
    const tokensSimbol  = await zeroEx.tokenRegistry.getTokensAsync();
    await tokensSimbol.map((to: any, index: number) => {
      const contractData = '0x70a08231000000000000000000000000' + account.substring(2);

      if (to.symbol === 'WETH') {
        metamask.eth.call({
          to: to.address,
          data: contractData
        }).then((bl: string) => {
          this.setState({
            decimalsEth: 18,
            decimalsWEth: to.decimals,
            balanceEth: balance.toFixed(5),
            balanceWEth: (metamask.utils.hexToNumberString(bl) / (10 ** to.decimals)).toFixed(5)
          });
        });
      }
    });
  }

  checkVaid = (array: Array<any>, name: string, value: any) => {
    this.message = '';
    const { decimalsEth, balanceEth } = this.state;
    for (let valid of this.validate[name]) {
      if (valid === 'maxLength' && maxLength(value, decimalsEth)) {
        this.message = `Decimals is ${decimalsEth}`;
        break;
      }

      if (valid === 'numberField' && numberField(Number(value))) {
        this.message = 'Must be a number';
        break;
      }
      if (valid === 'notZero' && !notZero(value)) {
        this.message = 'Must be bigger 0';
        break;
      }
      if (valid === 'compareValue' && compareValue(Number(value), Number(balanceEth))) {
        this.message = 'Insufficient balance.';
        break;
      }
    }
  }

  onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (this.validate[name]) {
      const { validField } = this.state;

      this.checkVaid(this.validate[name], name, value);

      this.setState({
        ...this.state,
        [name]: [value],
        validField: {
          ...validField,
          [name]: this.message
        }
      });
    }
  }

  submit = async () => {
    const { ethAddress, amount, decimalsEth, typeSubmit } = this.state;
    const { account } = this.props.account;
    let result: any;
    if (!this.message) {
      this.setState({
        isloading: true
      });

      if (typeSubmit === 'wrap') {
        result = 
          await zeroEx.etherToken.depositAsync(
            ethAddress, 
            ZeroEx.toBaseUnitAmount(new BigNumber(Number(amount)), decimalsEth),
            account
          ).catch((error: any) => {
            this.message = error.message;

            this.setState({
              ...this.state,
              isloading: false,
              validField: {
                amount: error.message
              }
            });
          });
        
        console.log('Wrap: ', result);
      } else {
        result = 
          await zeroEx.etherToken.withdrawAsync(
            ethAddress, 
            ZeroEx.toBaseUnitAmount(new BigNumber(Number(amount)), decimalsEth),
            account
          ).catch((error: any) => {
            this.message = error.message;

            this.setState({
              ...this.state,
              isloading: false,
              validField: {
                amount: error.message
              }
            });
          });
        
        console.log('Wrap: ', result);
      }
      const txReceipt = await zeroEx.awaitTransactionMinedAsync(result);
      console.log(txReceipt.logs);
      this.getEthBalanceAsync(account);
      this.setState({
        modal: false
      });
      alert('Wrap is success!');
    }
  }

  cancel = () => {
    this.setState({
      modal: false,
    });
  }

  wrap = (typeSubmit: string) => {
    this.setState({
      modal: true,
      typeSubmit: typeSubmit
    });
  }

  async UNSAFE_componentWillMount() {
    const _window = window as any;
  
    if (typeof(_window.web3) !== 'undefined') {
      metamask = new Web3(_window.web3.currentProvider);
      
      await metamask.eth.net.getId().then((id: number) => {
        zeroEx = new ZeroEx(_window.web3.currentProvider, { networkId: id });
        return zeroEx;
      });

      const wethAddress = await zeroEx.tokenRegistry.getTokenAddressBySymbolIfExistsAsync('WETH');
      
      this.setState({
        ethAddress: wethAddress
      });
      
      await zeroEx.getAvailableAddressesAsync().then((result: any) => {
        this.getEthBalanceAsync(result[0]);
      });
    } else {
      console.log('No web3? You should consider trying MetaMask!');
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      _window.web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/sOabGYzDK8MjzepbSkxy'));
    }
  }
  render() {
    const { balanceEth, balanceWEth, modal, amount, validField, isloading } = this.state;
    const { account } = this.props.account;
    return (
      <>
        {
          !account && <Loading />
        }
         <div className="subPage">
          <TitlePage title="ETH Wrapper" className="titlePage" />
          <div className="text">
            <p>Wrap ETH into an ERC20-compliant Ether token. 1 ETH = 1 WETH.</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>ETH Token</th>
                <th>Balance</th>
                <th>ETH <Icon className="refresh-ccw" /> WETH</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Image src={require('../../../assets/images/ether.png')} width={40} height={40} /> <span>ETH</span>
                </td>
                <td>
                  {
                    balanceEth ? balanceEth : '...'
                  } ETH
                </td>
                <td>
                  <Button RootComponent="a" className="btnWrap" onClick={() => this.wrap('wrap')}>WRAP</Button>
                </td>
              </tr>
              <tr>
                <td>
                  <Image src={require('../../../assets/images/WETH.png')} width={40} height={40} /> <span>Wrapped Ether</span>
                </td>
                <td>
                  {
                    balanceWEth ? balanceWEth : '...'
                  } WETH
                </td>
                <td>
                  <Button RootComponent="a" className="btnWrap" onClick={() => this.wrap('unwrap')}>UNWRAP</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {
          modal &&
          <div className="wrapEth">
            <Modal title="Wrap ETH" cancel={this.cancel} submit={this.submit}>

              {isloading && <Loading />}
              <p>Convert your Ether into a tokenized, tradable form.</p>
              <div className="tokenWrap text-center">
                <div className="column-3">
                  <span>Ether</span>
                  <Image src={require('../../../assets/images/ether.png')} width={60} />
                  <span className="unit">(ETH)</span>
                </div>
                <div className="column-1 icon">
                  <Icon className="arrow-right" prefix="fe" />
                </div>
                <div className="column-3">
                  <span>Wrapped Ether</span>
                  <Image src={require('../../../assets/images/WETH.png')} width={60} />
                  <span className="unit">(WETH)</span>
                </div>
              </div>

              <div className="controls text-center">
                <div className="column-5">
                  <Input 
                    name="amount"
                    type="text" 
                    placeHolder="Amount" 
                    value={amount}
                    unit="ETH"
                    onChange={this.onChange}
                  />
                  {
                  validField.amount && <span className="error">{validField.amount}</span>}
                </div>
              </div>
              <div className="text-center rate" style={{clear: 'both', display: 'block', marginTop: 30}}>
                <div className="column-5" style={{textAlign: 'left'}}>
                  <p>1 ETH = 1 WETH</p>
                </div>
              </div>
            </Modal>
          </div>
        }
      </>
    );
  }
}

const mapStateToProps = (state: any) => {
  return  {
    account: state.getAccountReducer
  };
};

export default connect(mapStateToProps)(WrapEthContainer as any);