import * as React from 'react';

interface Props {
  children?: any;
}
class TableHeader extends React.Component<Props, {}> {
  render() {
    const { children } = this.props;
    return (
      <thead>
        {children}
      </thead>
    );
  }
}

export default TableHeader;