import * as React from 'react';

interface Props {
  children?: any;
}

class MainContainer extends React.Component<Props, {}> {

  render() {
    const { children } = this.props;

    return (
      <>
        {children}
      </>
    );
  }
}

export default MainContainer;