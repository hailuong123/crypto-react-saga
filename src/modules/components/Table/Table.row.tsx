import * as React from 'react';

interface Props {
  children?: any;
}

class TableRow extends React.Component<Props, {}> {
  render() {
    const { children } = this.props;
    return (
      <tr>
        {children}
      </tr>
    );
  }
}

export default TableRow;