import * as React from 'react';
import { TitlePage } from '../';

interface Props {
  children?: any;
  title?: string;
  ok?: Function;
  cancel?: Function;
  submit?: Function;
  close?: Function;
  disabled?: boolean;
}
class Modal extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
    this.cancel = this.cancel.bind(this);
    this.ok = this.ok.bind(this);
    this.submit = this.submit.bind(this);
  }

  cancel = (e: any) => {
    const { cancel } = this.props;
    if (cancel) {
      cancel();
    }
  }

  ok = (e: any) => {
    const { ok } = this.props;
    if (ok) {
      ok();
    }
  }

  submit = (e: any) => {
    const { submit } = this.props;
    if (submit) {
      submit();
    }
  }

  render() {
    const { children, title, ok, cancel, submit, close, disabled } = this.props;
    return (
      <>
        <div className="modal">
          <div className="overlay" onClick={this.cancel} />

          <div className="innerModal">
            <div>
                <TitlePage title={title} />
                <div className="contentModal">
                  {children}
                </div>
                <div className="footerModal">
                  {
                    cancel && 
                      (<div className="leftBottomModal cancel">
                          <button onClick={this.cancel}>
                            CANCEL
                          </button>
                      </div>)
                  }

                  {
                    close && 
                      (<div className="centerBottomModal close">
                          <button onClick={this.cancel}>
                            CLOSE
                          </button>
                      </div>)
                  }

                  {
                    ok && 
                      (<div className="rightBottomModal ok">
                          <button onClick={this.ok} disabled={disabled}>
                            OK
                          </button>
                      </div>)
                  }

                  {
                    submit && 
                      (<div className="rightBottomModal submit">
                          <button onClick={this.submit} disabled={disabled}>
                            SUBMIT
                          </button>
                      </div>)
                  }
                </div>
              </div>
            </div>
        </div>
      </>
    );
  }
}

export default Modal;