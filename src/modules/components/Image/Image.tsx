import * as React from 'react';
import { Button } from '../';
import { Tag } from 'modules/components/Button/Button';

interface Props {
  src: string;
  className?: string;
  to?: string;
  alt?: string;
  height?: number;
  width?: number;
  type?: string;
  style?: any;
}

interface State {}

class Image extends React.Component<Props, State> {
  render() {
    const {
      src,
      className,
      to,
      alt,
      height,
      width,
      style
    } = this.props;
    return (
      <>
        { 
          !to ? (
            <img 
              className={className}
              src={src}
              alt={alt}
              height={height}
              width={width}
              style={style}
            />
          ) : (
            <Button
              to={to}
              RootComponent={Tag['a']}
            >
              <img 
                className={className}
                src={src}
                alt={alt}
                height={height}
                width={width}
                style={style}
              />
            </Button>
          )
        }
      </>
    );
  }
}

export default Image;