import * as React from 'react';

interface Props {
  className?: string;
  title?: string;
  description?: string;
}

interface State {}

class TitlePage extends React.Component<Props, State> {
  render() {
    const { className, title, description } = this.props;
    return (
      <h1 className={`${className ? className : ''}`}>
        {title}
        {
          description && 
          <span>{description}</span>
        }
      </h1>
    );
  }
}

export default TitlePage;