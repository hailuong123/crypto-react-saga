import * as React from 'react';
import { connect } from 'react-redux';
import { ZeroEx } from '0x.js';
import { BigNumber } from '@0xproject/utils';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import LinearProgress from 'material-ui/LinearProgress';
import { Label, Icon, Image, Input, Button, Loading } from '../../components';
import { jsonCheck } from '../../../utility/validate';
import { formatTime } from '../../../utility/format';

const Web3 = require('web3');

import { TitlePage } from '../../components';

interface Props {
  account: any;
}
interface State {
  pending: boolean;
  valid: boolean;
  message: string;
  fillTakerTokenAmount: number;
  amountTakerAvailable: number;
  amountMakerAvailable: number;
  maker: string;
  amount: string;
  timeExpire: string;
  takerTokenAddress: string;
  makerTokenAddress: string;
  takerToken?: TokenTrans;
  makerToken?: TokenTrans;
}

type TokenTrans = {
  name: string;
  symbol: string;
  decimals: number;
};

let zeroEx: any;
let metamask: any;
let signedOrder: any;
let metadata: any;

class FillContainer extends React.Component<Props, State> {
  state = {
    pending: false,
    valid: false,
    message: '',
    fillTakerTokenAmount: 0,
    amountTakerAvailable: 0,
    amountMakerAvailable: 0,
    maker: '',
    amount: '',
    timeExpire: '',
    takerTokenAddress: '',
    makerTokenAddress: '',
    takerToken: {
      name: '',
      symbol: '',
      decimals: 0
    },
    makerToken: {
      name: '',
      symbol: '',
      decimals: 0
    }
  };

  async componentWillMount() {
    const _window = window as any;

    if (typeof(_window.web3) !== 'undefined') {
      metamask = new Web3(_window.web3.currentProvider);

      await metamask.eth.net.getId().then((id: number) => {
        zeroEx = new ZeroEx(_window.web3.currentProvider, { networkId: id });
        return zeroEx;
      });
    }
  }

  getBalanceAvailable = async (hash: string) => {
    const UnavailableTakerAmount = await zeroEx.exchange.getUnavailableTakerAmountAsync(hash);
    const convertUnavailableAmountToNumber  = metamask.utils.hexToNumberString(UnavailableTakerAmount) / (10 ** metadata['takerToken'].decimals);
    const convertTakerTokenAmountToNumber = metamask.utils.hexToNumberString(signedOrder['takerTokenAmount']) / (10 ** metadata['takerToken'].decimals);
    return {
      makerAmountAvalable: convertUnavailableAmountToNumber,
      takerAmountAvalable: convertTakerTokenAmountToNumber
    };
  }

  onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState({
      ...this.state,
      [name]: value,
    });
  }

  onChangeTextarea = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const targetValue = e.target.value;
    this.setState({
      pending: true,
    });

    if (!targetValue) {
      return this.setState({
        pending: false,
        valid: false,
        message: ''
      });
    }
    
    if (jsonCheck(e.target.value)) {
      return this.setState({
        pending: false,
        message: 'Submitted order JSON is not valid JSON'
      });
    }
    
    const value = JSON.parse(e.target.value.replace(/\r?\n/g, ''));

    signedOrder = value['signedOrder'] ? value['signedOrder'] : false;
    metadata = value['metadata'] ? value['metadata'] : false;
    
    if (!signedOrder) {
      return this.setState({
        pending: false,
        message: 'Submitted order JSON is not valid JSON'
      });
    }

    this.setState({
      maker: signedOrder['maker'],
      timeExpire: signedOrder['expirationUnixTimestampSec'],
      takerTokenAddress: signedOrder['takerTokenAddress'],
      makerTokenAddress: signedOrder['makerTokenAddress'],
      makerToken: metadata['makerToken'],
      takerToken: metadata['takerToken']
    });
    
    signedOrder['makerFee'] = new BigNumber(signedOrder['makerFee']);
    signedOrder['takerTokenAmount'] = new BigNumber(signedOrder['takerTokenAmount']);
    signedOrder['makerTokenAmount'] = new BigNumber(signedOrder['makerTokenAmount']);
    signedOrder['salt'] = new BigNumber(signedOrder['salt']);
    signedOrder['expirationUnixTimestampSec'] = new BigNumber(signedOrder['expirationUnixTimestampSec']);
    
    const hash = ZeroEx.getOrderHashHex(signedOrder);
    const getBalanceAvailable = await this.getBalanceAvailable(hash);

    this.setState({
      amountTakerAvailable: getBalanceAvailable['takerAmountAvalable'] - getBalanceAvailable['makerAmountAvalable'],
      amountMakerAvailable: signedOrder['makerTokenAmount'] * (getBalanceAvailable['takerAmountAvalable'] - getBalanceAvailable['makerAmountAvalable']) / signedOrder['takerTokenAmount']
    });

    await zeroEx.exchange.validateOrderFillableOrThrowAsync(signedOrder)
            .catch((error: any) => {
              
              this.setState({
                pending: false,
                message: error.message
              });
              throw error;
            });
    
    this.setState({
      pending: false,
      valid: true,
      message: ''
    });
  }

  submit = async (e: any, type: string) => {
    const { amount } = this.state;
    const { account } = this.props.account;
    if (type === 'fill') {
      await zeroEx.exchange.validateFillOrderThrowIfInvalidAsync(
        signedOrder,
        ZeroEx.toBaseUnitAmount(new BigNumber(Number(amount)), metadata['takerToken'].decimals),
        account
      ).catch((error: any) => {
        this.setState({
          message: error.message
        });
      });

      const txHash = await zeroEx.exchange.fillOrderAsync(
        signedOrder,
        ZeroEx.toBaseUnitAmount(new BigNumber(Number(amount)), metadata['takerToken'].decimals),
        true,
        account,
        {
          gasPrice: new BigNumber(2 * 1e9),
          gasLimit: 3000000,
          shouldValidate: true,
        }
      ).catch((error: any) => {
        this.setState({
          message: error.message
        });
      });

      console.log('cancel order: ', txHash);
      const txReceipt = await zeroEx.awaitTransactionMinedAsync(txHash);
      
      console.log(txReceipt.logs);
    } else {
      console.log(signedOrder);
      const txHash = await zeroEx.exchange.cancelOrderAsync(
        signedOrder,
        ZeroEx.toBaseUnitAmount(new BigNumber(Number(amount)), metadata['takerToken'].decimals),
        account,
        {
          gasPrice: new BigNumber(2 * 1e9),
          gasLimit: 3000000,
          shouldValidate: true,
        }
      );

      console.log('cancel order: ', txHash);
      const txReceipt = await zeroEx.awaitTransactionMinedAsync(txHash);
      console.log(txReceipt.logs);
    }
  }

  async UNSAFE_componentWillMount() {
    const _window = window as any;

    if (typeof(_window.web3) !== 'undefined') {
      metamask = new Web3(_window.web3.currentProvider);

      await metamask.eth.net.getId().then((id: number) => {
        zeroEx = new ZeroEx(_window.web3.currentProvider, { networkId: id });
        return zeroEx;
      });
      
    } else {
      console.log('No web3? You should consider trying MetaMask!');
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      _window.web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/sOabGYzDK8MjzepbSkxy'));
    }
  }

  render() {
    const { pending, valid, message, maker, amount, timeExpire, makerToken, takerToken, takerTokenAddress, makerTokenAddress, amountMakerAvailable, amountTakerAvailable } = this.state;
    const { account } = this.props.account;
    const placeholder = {
      'signedOrder': {
        'maker': '',
        'taker': '',
        'makerFee': '0',
        'takerFee': '0',
        'makerTokenAmount': '35',
        'takerTokenAmount': '89',
        'makerTokenAddress': '0x6ff6c0ff1d68b964901f986d4c9fa3ac68346570',
        'takerTokenAddress': '0x323b5d4c32345ced77393b3530b1eed0f346429d',
        'expirationUnixTimestampSec': '2524582800',
        'feeRecipient': '0x0000000000000000000000000000000000000000',
        'salt': '82682906530220237993344815246321742854697026932793228928036482891577748572973',
        'ecSignature': '...',
      }
    };
    return (
      <>
        {
          !account && <Loading />
        }
        <div className="subPage">
          <TitlePage title="Fill an order" className="titlePage" />
          <div className="text">
            <p>Paste an order JSON snippet below to begin</p>
            <p>Order JSON</p>
          </div>

          <div className="fill">
            <textarea defaultValue="" placeholder={JSON.stringify(placeholder, null, 4)} onChange={this.onChangeTextarea} />
          </div>
          {
            pending &&
            <MuiThemeProvider>
              <LinearProgress mode="indeterminate" />
            </MuiThemeProvider>
          }

          {
            valid &&
            <div className="OrderDetail text-center">
              <h4>
                Order details
              </h4>

              <div className="text-center">
                  <div className="column-3">
                    <Label className="selling" text="Send" />
                    <div className="box">
                      <Image width={80} height={80} src={require(`../../../assets/images/${makerToken.symbol ? makerToken.symbol : 'TKN1'}.png`)} />
                      <span className="address">
                        {takerTokenAddress.substr(0, 4) + `...` + takerTokenAddress.substr(takerTokenAddress.length - 4)} 
                        <a href="#" target="_blank"><Icon className="external-link" prefix="fe" /></a>
                      </span>
                    </div>
                  </div>
                  <div className="column-1" style={{marginTop: 20}}>
                    <span className="amount">{amountTakerAvailable.toFixed(5)} {takerToken.symbol}</span>
                    <span className="swap">
                      <Icon className="refresh-ccw" fontSize={30} decimals="px" />
                    </span>
                    <span className="amount">{amountMakerAvailable.toFixed(5)} {makerToken.symbol}</span>
                  </div>
                  <div className="column-3">
                    <Label className="buying" text="Receive" />
                    <div className="box">
                      <Image width={80} height={80} src={require(`../../../assets/images/${takerToken.symbol ? takerToken.symbol : 'TKN2'}.png`)} />
                      <span className="address">
                        {makerTokenAddress.substr(0, 4) + `...` + makerTokenAddress.substr(makerTokenAddress.length - 4)} 
                        <a href="#" target="_blank"><Icon className="external-link" prefix="fe" /></a>
                      </span>
                    </div>
                  </div>
              </div>

              <div className="expireTime text-center">
                <p>Expires: {formatTime(timeExpire)}</p>
              </div>

              <div className="text-center amountHandlerOrder">
                <div className="column-3 text-left">
                    <Label className="sell" text={`${maker === account.toLowerCase() ? 'Cancel Amount' : 'Sell Amount'}`} required={true} />
                    <div className="field-controls">
                      <Input 
                        type="text"
                        placeHolder="Amount"
                        name="amount"
                        unit={takerToken.symbol}
                        value={amount}
                        className=""
                        onChange={this.onChange}
                      />
                    </div>
                    <span className="exchangeAmount">= {((Number(amount) * amountMakerAvailable) / amountTakerAvailable).toFixed(5)} WETH</span>
                  </div>
              </div>

              <div className="buttonSignHash text-center">
                <div className="column-7">
                    <Button 
                      RootComponent="button"
                      type="button"
                      name={`${maker === account.toLowerCase() ? 'cancel' : 'fill' }`}
                      onClick={
                        (e: any) => {
                          this.submit(e, `${maker === account.toLowerCase() ? 'cancel' : 'fill' }`);
                        }
                      }
                    >
                      {`${maker === account.toLowerCase() ? 'CANCEL ORDER' : 'FILL ORDER'}`} 
                    </Button>
                </div>
                
              </div>

            </div>
          }
          {
            message &&
              <div className="errorOrderJson">{message}</div>
          }
        </div>
      </>
    );
  }
}

const mapStateToProps = (state: any) => {
  return  {
    account: state.getAccountReducer
  };
};

export default connect(mapStateToProps)(FillContainer as any);