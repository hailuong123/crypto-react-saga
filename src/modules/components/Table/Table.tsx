import * as React from 'react';
import TableBody from './Table.body';
import TableHeader from './Table.header';
import TableHeaderColumn from './Table.colheader';
import TableRow from './Table.row';
import TableColumn from './Table.column';

interface Props {
  responsive?: boolean;
  rowHover?: boolean;
  headerItem?: Array<any>;
  bodyItem?: Array<any>;
  className?: string;
}

interface State {}

class Table extends React.Component<Props, State> {
  static defaultProps = {
    responsive: false
  };
  
  render() {
    const { 
      responsive, 
      headerItem,
      bodyItem,
      className
    } = this.props;

    // Header of table
    const header = headerItem && (
      <TableHeader>
        <TableRow>
          {
            headerItem.map((item: any, i: number) => (
              <TableHeaderColumn key={i} className={item.className}>
                {item.text}
              </TableHeaderColumn>
            ))
          }
        </TableRow>
      </TableHeader>
    );

    // Body of table
    const body = bodyItem && (
      <TableBody>
        {
          bodyItem.map((row: any, i: number) => (
            <TableRow key={i}>
              {
                (headerItem || []).map((col: any, idx: number) => (
                  <TableColumn key={idx} className={col.className} alignContent={col.alignContent}>
                    {row[col.key]}
                  </TableColumn>
                ))
              }
            </TableRow>
          ))
        }
        
      </TableBody>
    );

    const table = (
      <table className={className}>
        {header}
        {body || React.Children}
      </table>
    );

    return (
      <>
        {
          !responsive ? (
            table
          ) : (
            <div className="table-responsive">{table}</div>
          )
        }
      </>
    );
  }
}

export default Table;
