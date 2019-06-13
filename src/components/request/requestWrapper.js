import React from 'react';
import QRCode from 'qrcode.react';
import CopyToClipboard from '../toolbox/copyToClipboard';
import { PrimaryButtonV2 } from '../toolbox/buttons/button';
import styles from './request.css';

class RequestWrapper extends React.Component {
  constructor() {
    super();

    this.state = {
      showQRCode: false,
      linkCopied: false,
    };

    this.timeout = {
      copy: null,
    };

    this.toggleQRCode = this.toggleQRCode.bind(this);
    this.onCopy = this.onCopy.bind(this);
  }

  onCopy() {
    clearTimeout(this.timeout.copy);
    this.timeout.copy = setTimeout(() => this.setState({
      linkCopied: false,
    }), 3000);

    this.setState({
      linkCopied: true,
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timeout.copy);
  }

  toggleQRCode() {
    this.setState(prevState => ({
      showQRCode: !prevState.showQRCode,
    }));
  }


  render() {
    const {
      t, children, copyLabel, copyValue,
    } = this.props;
    const { showQRCode } = this.state;

    return (
      <div className={`${styles.container}`}>
        <section className={`${styles.formSection}`}>
          {children}
          <footer className={`${styles.sectionFooter}`}>
            <CopyToClipboard
              className='copy-button'
              Container={PrimaryButtonV2}
              value={copyValue}
              text={copyLabel}
              btnClassName='extra-small'
              copyClassName={styles.copyIcon}
            />
            <span className={`${styles.footerContent} ${showQRCode ? styles.hide : ''}`}>
              {t('Got the Lisk Mobile App?')} <span
                className={`${styles.footerActionable} toggle-qrcode`}
                onClick={this.toggleQRCode}>{t('Show the QR code')}
              </span>
            </span>
          </footer>
        </section>
        <section className={`${styles.qrSection} ${!showQRCode ? styles.hide : ''} qrcode-section`}>
          <span className={`${styles.label}`}>
            {t('Simply scan the QR code using the Lisk Mobile app or any other QR code reader')}
          </span>
          <div className={`${styles.qrCodeContainer}`}>
            <QRCode value={copyValue} size={235} />
          </div>
          <footer className={`${styles.sectionFooter}`}>
            <span
              className={`${styles.footerContent} ${styles.footerActionable}`}
              onClick={this.toggleQRCode}>{t('Hide the QR code')}</span>
          </footer>
        </section>
      </div>
    );
  }
}

export default RequestWrapper;

