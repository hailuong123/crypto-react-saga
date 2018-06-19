import * as React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RefreshIndicator from 'material-ui/RefreshIndicator';

interface Props {
  children?: any;
}

class Loading extends React.Component<Props, {}> {
  render() {
    const { children } = this.props;
    return (
      <div className="loading">
        <div>
          <MuiThemeProvider>
            <RefreshIndicator
              size={40}
              left={10}
              top={0}
              status="loading"
            />
          </MuiThemeProvider>
          {children}
        </div>
      </div>
    );
  }
}

export default Loading;