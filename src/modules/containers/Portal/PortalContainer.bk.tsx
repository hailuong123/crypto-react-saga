import * as React from 'react';
import { connect } from 'react-redux';
import * as _ from 'lodash';
import DatePickerDialog from 'material-ui/DatePicker';
import TimePickerDialog from 'material-ui/TimePicker';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import * as injectTapEventPlugin from 'react-tap-event-plugin';
import * as moment  from 'moment';

import { BigNumber } from '@0xproject/utils';
import { ZeroEx } from '0x.js';

import { getAccount, getListToken } from '../../actions/actions';

import { Order } from '@0xproject/types';
import { TitlePage, Label, Modal, Image, Icon, Input, Button, Loading, List } from '../../components';
import { numberField, notZero, addressValid, compareValue, maxLength } from '../../../utility/validate';

import ListItem from '../../components/List/List.item';

const Web3 = require('web3');
// const WethAbi = require('../../json/wethAbi.json');

let zeroEx: any;
let metamask: any;
// let contract: any;
let wethTokenAddress: any;

interface Props {
  getAccount: Function;
  getListToken: Function;
  ListToken: any;
}

interface State {
  ownerAddress: string;
  selling: string;
  buying: string;
  date: any;
  taker: string;
  orderhash: string;
  modal: boolean;
  modalSignHash: boolean;
  modalType: string;
  sellingInfo: TokenSelect;
  buyingInfo: TokenSelect;
  validField: ValidField;
  balanceTokens: Array<any>;
  balanceSelling: number;
  balanceBuying: number;
  account: string;

  order: Order | Object;
  address: Array<any>;
  jsonSignHash: any;
  copied: boolean;
}

export type ValidField = {
  readonly selling: string;
  readonly buying: string;
  readonly date: string;
  readonly taker: string;
};

type TokenSelect = {
  balance: number;
  address: string;
  decimals: number;
  name: string;
  symbol: string;
};

injectTapEventPlugin();

class PortalContainer extends React.Component<Props, State> {
  state = {
    ownerAddress: '',
    selling: '',
    buying: '',
    date: 0,
    taker: '',
    orderhash: '',
    modal: false,
    modalSignHash: false,
    modalType: '',
    sellingInfo: {
      balance: 0,
      address: '',
      decimals: 0,
      name: '',
      symbol: ''
    },
    buyingInfo: {
      balance: 0,
      address: '',
      decimals: 0,
      name: '',
      symbol: ''
    },
    validField: {
      ...this.validFieldDefault
    },
    balanceTokens: [],
    balanceBuying: 0,
    balanceSelling: 0,
    account: '',

    order: {},
    address: [],
    jsonSignHash: null,
    copied: false
  };

  validFieldDefault = {
    selling: '',
    buying: '',
    date: '',
    taker: ''
  };

  validate = {
    selling: ['numberField', 'notZero', 'compareValue', 'maxLength'],
    buying: ['numberField', 'notZero'],
    date: ['minDate'],
    taker: ['addressValid']
  };

  message: string = '';

  checkVaid = (array: Array<any>, name: string, value: any) => {
    this.message = '';
    const { sellingInfo } = this.state;
    for (let valid of this.validate[name]) {
      if (valid === 'maxLength' && maxLength(value, sellingInfo.decimals)) {
        this.message = `Decimals is ${sellingInfo.decimals}`;
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
      if (valid === 'addressValid' && !addressValid(value)) {
        this.message = 'Invalid address';
        break;
      }
      if (valid === 'compareValue' && compareValue(Number(value), Number(sellingInfo.balance))) {
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

      await this.setState({
        ...this.state,
        [name]: value,
        validField: {
          ...validField,
          [name]: this.message
        }
      });
    }

    if (!this.message) { this.order(); }

  }
  setDate = (e: any, date: Date) => {
    this.setState({
      ...this.state,
      date: +moment(date).utc()
    });
    
    if (+moment(date).utc() < +moment(new Date()).utc()) {
      this.message = 'Must be greater than current date';
      this.setState({
        validField: {
          ...this.state.validField,
          date: this.message
        }
      });
    } else {
      this.message = '';
      this.setState({
        validField: {
          ...this.state.validField,
          date: ''
        }
      });
      this.order();
    }
  }

  clearTime = () => {
    this.setState({
      ...this.state,
      date: 0,
      validField: {
        ...this.state.validField,
        date: ''
      }
    });

    this.order();
  }

  swap = () => {
    const { 
      buyingInfo, sellingInfo, validField
    } = this.state;

    this.setState({
      selling: '',
      buying: '',
      sellingInfo: buyingInfo,
      buyingInfo: sellingInfo,
      validField: {
        ...validField,
        selling: '',
        buying: ''
      }
    });

    if (!validField.taker || !validField.date) {
      this.order();
    }
  }

  copy = () => {
    var copyText: any = document.getElementById('jsonHash');
    copyText.select();
    document.execCommand('copy');

    this.setState({
      copied: true
    });

    setTimeout(() => { this.setState({ copied: true }); }, 2000);

  }

  signHash = (): any => {
    if (this.message) {
      return false;
    }
    const self = this;
    // const contractAddress   = '0xc778417e063141139fce010982780140aa0cd5ab';
    // const ownerAddress      = '0x4f26ffbe5f04ed43630fdc30a87638d53d0b0876';
    const _window = window as any;

    if (typeof(_window.web3) !== 'undefined') {
      metamask = new Web3(_window.web3.currentProvider);
      // contract = new metamask.eth.Contract(WethAbi, contractAddress, {
      //     from: ownerAddress
      // });
      
      metamask.eth.net.getId().then((id: number) => {
        return zeroEx.tokenRegistry.getTokenAddressBySymbolIfExistsAsync('WETH');
      }).then((address: string) => {
          wethTokenAddress = address;
          self.signOrderHash();
      });
    } else {
      console.log('No web3? You should consider trying MetaMask!');
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      _window.web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/sOabGYzDK8MjzepbSkxy'));
    }

  }

  signOrderHash = () => {
    const { order, orderhash, ownerAddress, buyingInfo, sellingInfo } = this.state;
    zeroEx.signOrderHashAsync(orderhash, ownerAddress.toLowerCase(), true).then((result: any) => {
      const data = {
        signedOrder: {
            ...order,
            ecSignature: result
        },
        metadata: {
            takerToken: {
                name: sellingInfo.name,
                symbol: sellingInfo.symbol,
                decimals: sellingInfo.decimals
            },
            makerToken: {
                name: buyingInfo.name,
                symbol: buyingInfo.symbol,
                decimals: buyingInfo.decimals
            }
        }
      };
      this.setState({
        modalSignHash: true,
        jsonSignHash: JSON.stringify(data, null, 4)
      });
      console.log(JSON.stringify(data));
      return data;
    }).catch((err: any) => { 
      console.log('err: ', err);
    });
  }

  order = () => {
    const { ownerAddress, date, selling, buying, taker, sellingInfo, buyingInfo } = this.state;
    const order = {
      exchangeContractAddress: zeroEx.exchange.getContractAddress(),
      expirationUnixTimestampSec: new BigNumber(date),
      feeRecipient: '0x0000000000000000000000000000000000000000',
      maker: ownerAddress.toLowerCase(), 
      makerFee: new BigNumber(0),
      makerTokenAddress: zeroEx.exchange.getZRXTokenAddress(),
      takerTokenAddress: wethTokenAddress,
      salt: ZeroEx.generatePseudoRandomSalt(),
      taker: taker.toLowerCase() || '0x0000000000000000000000000000000000000000',
      takerFee: new BigNumber(0),
      makerTokenAmount: ZeroEx.toBaseUnitAmount(new BigNumber(Number(selling)), sellingInfo.decimals),
      takerTokenAmount: ZeroEx.toBaseUnitAmount(new BigNumber(Number(buying)), buyingInfo.decimals),
    } as Order;

    const hash = ZeroEx.getOrderHashHex(order);
    
    this.setState({
      orderhash: hash,
      order
    });
  }

  showToken = (type: string) => {
    // const listToken = zeroEx.tokenRegistry.getTokensAsync();
    const { modal } = this.state;

    this.setState({
      modal: !modal,
      modalType: type
    });
  }
  
  changeToken = (type: string, info: TokenSelect) => {
    const { modal } = this.state;
    if (type === 'selling') {
      this.setState({
        sellingInfo: {
          ...info
        },
        modal: !modal
      });
    } else {
      this.setState({
        buyingInfo: {
          ...info
        },
        modal: !modal
      });
    }
  }

  getBalanceAccount = async (account: string) => {
    const { sellingInfo, buyingInfo } = this.state;
    let join: Array<any> = [];
    const tokensSimbol  = await zeroEx.tokenRegistry.getTokensAsync();

    const sellingDefault    = '0xc778417e063141139fce010982780140aa0cd5ab';
    const buyingDefault     = '0x00f58d6d585f84b2d7267940cede30ce2fe6eae8';

    await tokensSimbol.map((to: any, index: number) => {
        // '0x70a08231' is the function 'balanceOf()' ERC20 token function in hex. A zero buffer is required and then we add the previously defined address with tokens
        const contractData = '0x70a08231000000000000000000000000' + account.substring(2);
        
        metamask.eth.call({
            to: to.address,
            data: contractData
        }).then((balance: string) => {
          let objectBalance: any = {};
          objectBalance['name'] = to.name;
          objectBalance['address'] = to.address;
          objectBalance['symbol'] = to.symbol;
          objectBalance['decimals'] = to.decimals;
          objectBalance['balance'] = metamask.utils.hexToNumberString(balance) / (10 ** to.decimals);
          if (sellingInfo.address === '' && objectBalance['address'] === sellingDefault) {
            this.setState({
              sellingInfo: {
                ...objectBalance
              }
            });
          }

          if (buyingInfo.address === '' && objectBalance['address'] === buyingDefault) {
            this.setState({
              buyingInfo: {
                ...objectBalance
              }
            });
          }

          join.push(objectBalance);
        });
    });
    this.props.getListToken(join);
  }

  componentDidMount() {
    const self = this;
    const _window = window as any;

    window.addEventListener('load', async function() {
      // Checking if Web3 has been injected by the browser (Mist/MetaMask)
      if (typeof(_window.web3) !== 'undefined') {
          // Use Mist/MetaMask's provider
          metamask = new Web3(_window.web3.currentProvider);

          await metamask.eth.net.getId().then((id: number) => {
            zeroEx = new ZeroEx(_window.web3.currentProvider, { networkId: id });
            return zeroEx;
          });

          metamask.eth.getAccounts().then((results: any) => {
              results.map((result: any) => {
                  self.setState({
                    account: result
                  });
                  
                  self.getBalanceAccount(result);
                  self.props.getAccount(result);
                  self.setState({
                    ownerAddress: result
                  });
              });

          });

      } else {
          console.log('No web3? You should consider trying MetaMask!');
          // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
          _window.web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/sOabGYzDK8MjzepbSkxy'));
      }
    });
  }

  async componentWillReceiveProps(nextProps: any) {
    const { ListToken } = nextProps;

    await this.setState({
      balanceTokens: ListToken.token
    });
  }

  cancel = () => {
    this.setState({
      modal: false,
      modalSignHash: false
    });
  }
  render() {
    const {
      ownerAddress,
      selling,
      buying,
      date,
      taker,
      orderhash,
      modal,
      modalSignHash,
      validField,
      balanceTokens,
      buyingInfo,
      sellingInfo,
      modalType,
      jsonSignHash,
      copied
    } = this.state;

    // const { ListToken } = this.props;

    return (
      <>
        { 
          ownerAddress === '' && <Loading />
        }
        <TitlePage title="Generate an order" className="titlePage" />
        <form>
          <div className="text-center">
              <div className="column-3">
                <Label className="selling" text="Selling" />
                <div className="box" onClick={() => this.showToken('selling')}>
                  <Image width={80} height={80} src={require(`../../../assets/images/${sellingInfo.symbol ? sellingInfo.symbol : 'WETH' }.png`)} />
                  <span className="nameToken">{sellingInfo.name}</span>
                </div>
              </div>
              <div className="column-1">
                <span className="swap" onClick={this.swap}>
                  <Icon className="refresh-ccw" fontSize={30} decimals="px" />
                </span>
              </div>
              <div className="column-3">
                <Label className="buying" text="Buying" />
                <div className="box" onClick={() => this.showToken('buying')}>
                  <Image width={80} height={80} src={require(`../../../assets/images/${buyingInfo.symbol ? buyingInfo.symbol : 'ZRX' }.png`)} />
                  <span className="nameToken">{buyingInfo.name}</span>
                </div>
              </div>
          </div>
          <div className="text-center amountValue">
            <div className="column-3">
              <Label className="sell" text="Sell amount" required={true} />
              <div className="field-controls">
                <Input 
                  type="text"
                  placeHolder="Amount"
                  name="selling"
                  unit={`${sellingInfo.symbol ? sellingInfo.symbol : 'WETH' }`}
                  value={selling}
                  onChange={this.onChange}
                  className={validField.selling && 'error'}
                />
                {
                  validField.selling && <span className="error">{validField.selling}</span>}
              </div>
            </div>
            <div className="column-1" />
            <div className="column-3">
              <Label className="buying" text="Receive amount" required={true} />
              <div className="field-controls">
                <Input 
                  type="text"
                  placeHolder="Amount"
                  name="buying"
                  unit={`${buyingInfo.symbol ? buyingInfo.symbol : 'ZRX' }`}
                  value={buying}
                  onChange={this.onChange}
                  className={validField.buying && 'error'}
                />
                {
                  validField.buying && <span className="error">{validField.buying}</span>}
              </div>
            </div>
          </div>

          <div className="text-center timeHash">
            <div className="column-2">
              <Label className="expiration" text="Expiration" />
              <div className="field-controls">
                <MuiThemeProvider>
                  <DatePickerDialog
                    minDate={new Date()}
                    onChange={this.setDate}
                    hintText="Date"
                    value={date > 0 ? new Date(date) : undefined}
                    formatDate={(dateFormat) => moment(dateFormat).format('DD/MM/YYYY')}
                    inputStyle={{
                      border: 0,
                      borderBottom: '1px solid #333',
                    }}
                    hintStyle={{
                      fontSize: 14,
                      bottom: 0,
                      color: '#757575'
                    }}
                    className={`${validField.date ? 'error' : ''} datePicker`}
                  />
                  <span className="fe fe-calendar iconInput" />
                </MuiThemeProvider>
                {
                  validField.date && <span className="error">{validField.date}</span>}
              </div>
            </div>
            <div className="column-2">
              <Label className="" text="" />
              <div className="field-controls">
              <MuiThemeProvider>
                  <TimePickerDialog
                    onChange={this.setDate}
                    value={date > 0 ? new Date(date) : undefined}
                    hintText="Time"
                    format="ampm"
                    inputStyle={{
                      border: 0,
                      borderBottom: '1px solid #333',
                    }}
                    hintStyle={{
                      fontSize: 14,
                      bottom: 0,
                      color: '#757575'
                    }}
                    className={`${validField.date ? 'error' : ''} datePicker`}
                  />
                  <span className="fe fe-clock iconInput" />
                </MuiThemeProvider>
              </div>
            </div>
            <span className="fe fe-x clearTime" onClick={this.clearTime} />
          </div>

          <div className="text-center taker">
            <div className="text-center imageToken column-1">
              <Image 
                src={require('../../../assets/images/demo.png')}
                width={26}
                height={26}
              />
            </div>
            <div className="column-6">
                
                <Label className="taker" text="Taker" />
                <div className="field-controls">
                  <Input 
                    type="text"
                    placeHolder="e.g 0x6612d368b5dd3278ed489f3fbcdffede8..."
                    name="taker"
                    value={taker}
                    onChange={this.onChange}
                    className={validField.taker && 'error'}
                  />
                  {
                    validField.taker && <span className="error">{validField.taker}</span>}
                </div>
            </div>
          </div>

          <div className="text-center taker">
            <div className="column-7">
                
                <Label className="orderhash" text="Order Hash" />
                <div className="field-controls">
                  <Input 
                    type="orderhash"
                    placeHolder="e.g 0x6612d368b5dd3278ed489f3fbcdffede8..."
                    name="orderhash"
                    value={orderhash}
                    readOnly={true}
                    onChange={this.onChange}
                  />
                </div>
            </div>
          </div>

          <div className="buttonSignHash text-center">
            <div className="column-7">
              { 
                ownerAddress !== '' && 
                <Button 
                  RootComponent="button"
                  type="button"
                  onClick={this.signHash}
                  disabled={
                    (this.message !== '' ||
                    selling === '' ||
                    buying === '') ?
                      true : false
                  }
                >
                  SIGN HASH
                </Button>
              }
            </div>
            
          </div>
        </form>

        {
          modal &&
            (
              <Modal title="Select Token" cancel={this.cancel}>
                <List className="listToken">
                  {
                    !_.isEmpty(this.props.ListToken) 
                    && !_.isNull(this.props.ListToken)
                    && balanceTokens.map((token: TokenSelect, i: number) => (
                      <ListItem key={i} onClick={() => this.changeToken(modalType, token)}>
                        <Image
                          src={require(`../../../assets/images/${token.symbol}.png`)}
                          height={100}
                          width={100}
                          style={{imageRendering: 'pixelated', borderRadius: '50%'}}
                        />
                        <p className="nameToken">{token.name}</p>
                      </ListItem>
                    )) 
                  }
                  {
                    _.isEmpty(balanceTokens) 
                    && _.isNull(balanceTokens) 
                    && <div className="loading" />
                  }
                </List>
              </Modal>
            )
        }
        
        {
          modalSignHash && 
            (
              <Modal title="Order JSON" cancel={this.cancel}>
                <p className="success_signHash">You have successfully generated and cryptographically signed an order! The following JSON contains the order parameters and cryptographic signature that your counterparty will need to execute a trade with you.</p>
                <span className="copy" onClick={this.copy}>
                  <Icon prefix="fe" className="copy" /> 
                  Copy JSON {copied && (<span>- Copied</span>)}
                </span>
                <div id="json">
                  <textarea id="jsonHash" readOnly={true}>{jsonSignHash}</textarea>
                </div>
              </Modal>
            )
        }
      </>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    ListToken: state.getListToken
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    getAccount: (account: string) => dispatch(getAccount(account)),
    getListToken: (token: Array<any>) => dispatch(getListToken(token))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PortalContainer as any);