import * as React from 'react';

interface Props {
  children?: any;
}

class TableBody extends React.Component<Props, {}> {
  render() {
    const { children } = this.props;
    return (
      <tbody>
        {children}
      </tbody>
    );
  }
}

export default TableBody;