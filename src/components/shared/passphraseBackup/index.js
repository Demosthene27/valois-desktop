import QRCode from 'qrcode.react';
import React from 'react';
import moment from 'moment';
import { SecondaryButton } from '../../toolbox/buttons/button';
import CopyToClipboard from '../../toolbox/copyToClipboard';
import Icon from '../../toolbox/icon';
import renderPaperwallet from '../../../utils/paperwallet';
import styles from './passphraseBackup.css';
import PassphraseRenderer from '../passphraseRenderer';

class PassphraseBackup extends React.Component {
  constructor(props) {
    super();
    this.state = {
      showTip: false,
    };

    this.walletName = `${props.paperWalletName}_${moment().format('YYYY_MM_DD_HH_mm')}.pdf`;
    this.generatePaperwallet = this.generatePaperwallet.bind(this);
    this.setCanvasRef = this.setCanvasRef.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  /* istanbul ignore next */
  generatePaperwallet() {
    const data = {
      ...this.props,
      qrcode: this.canvasRef.firstChild.toDataURL(),
    };
    renderPaperwallet(data, this.walletName);
  }

  setCanvasRef(node) {
    this.canvasRef = node;
  }

  handleClick() {
    this.setState({ showTip: true });
    setTimeout(() => { this.setState({ showTip: false }); }, 3000);
  }

  render() {
    const {
      t, account,
    } = this.props;

    return (
      <React.Fragment>
        <div className={`${styles.optionsHolder}`}>
          <div className={`${styles.option}`}>
            <div className={`${styles.optionContent}`}>
              <PassphraseRenderer showInfo values={account.passphrase.split(' ')} />
              <div className={styles.copyButtonContainer}>
                <CopyToClipboard
                  onClick={this.handleClick}
                  value={account.passphrase}
                  text={t('Copy to clipboard')}
                  copyClassName={styles.copyIcon}
                  Container={SecondaryButton}
                  containerProps={{ size: 'xs' }}
                />
                <span className={`${styles.tipContainer} ${!this.state.showTip && styles.hidden}`}>
                  <Icon color="red" name="warningRound" />
                  <p className="tip">{t('Make sure to store it somewhere safe')}</p>
                </span>
              </div>
            </div>
          </div>
          <div className={styles.hrSection} />
          <div className={`${styles.option}`}>
            <div className={`${styles.optionContent}`}>
              <h2>{t('Paper wallet')}</h2>
              <p className={styles.infoText}>{t('You can also download, print and store safely your pasphrase.')}</p>
              <div style={{ display: 'none' }} ref={this.setCanvasRef}>
                <QRCode value={account.passphrase} />
              </div>
              <div className={styles.downloadLisk}>
                <Icon name="fileOutline" />
                <p className="option-value">{this.walletName}</p>
              </div>
              <SecondaryButton className={styles.downloadBtn} size="xs" onClick={this.generatePaperwallet}>
                {t('Download')}
              </SecondaryButton>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default PassphraseBackup;
