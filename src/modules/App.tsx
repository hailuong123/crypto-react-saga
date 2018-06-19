import * as React from 'react';
import { Component } from 'react';
import { 
  Route,
  Switch
} from 'react-router-dom';

import { Header, Nav } from './components';

import Container from './components/Container';
import NavItem from './components/Nav/Nav.item';
import NavHref from './components/Nav/Nav.link';

import Portal from '../modules/containers/Portal/PortalContainer';
import Fill from '../modules/containers/Fill/FillContainer';
import WrapEth from '../modules/containers/WrapETH/WrapEth';

import '../assets/css/main.min.css';

type NavObj = {
  readonly icon: string;
  readonly text: string;
  readonly to: string;
  readonly exact: boolean;
};

class App extends Component {

  render() {
    const navItem = [{
      icon: 'arrow-up-right',
      text: 'Generate order',
      to  : '/portal',
      exact: true
    },
    {
      icon: 'arrow-down-left',
      text: 'Fill order',
      to  : '/portal/fill',
      exact: true
    },
    {
      icon: 'circle',
      text: 'Wrap ETH',
      to  : '/portal/weth',
      exact: true
    }];
    
    return (
      <div className="wrapper">
        <Header />
        
        <section id="content">
          <Container>
            <Nav>
              {
                navItem.map((nav: NavObj, i: number) => (
                  <NavItem key={i}>
                    <NavHref to={nav.to} icon={nav.icon} exact={nav.exact}>
                      {nav.text}
                    </NavHref>
                  </NavItem>
                ))
              }
            </Nav>
            <div className="mainContent">
              <div className="innerContent">
                <Switch>
                  <Route path="/portal/weth" render={props => <WrapEth {...props} />} />
                  <Route path="/portal/fill" render={props => <Fill {...props} />} />
                  <Route exact={true} path="/portal" render={props => <Portal {...props} />} />
                  <Route exact={true} path="/" render={props => <Portal {...props} />} />
                </Switch>
              </div>
            </div>
            
          </Container>
        </section>

      </div>
    );
  }
}

export default App;