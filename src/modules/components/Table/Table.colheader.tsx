import * as React from 'react';

interface Props {
  children?: any;
  className?: string;
  alignContent?: Algin;
  colSpan?: number;
}

enum Algin {
  left   = 'left',
  right  = 'right',
  center = 'center'
}

class TableColumnHeader extends React.Component<Props, {}> {
  render() {
    const { children, className, alignContent, colSpan } = this.props;
    return (
      <th colSpan={colSpan} className={`${className} ${alignContent ? 'text-' + alignContent : null }`}>
        {children}
      </th>
    );
  }
}

export default TableColumnHeader;