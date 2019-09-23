import React from 'react';
import externalLinks from '../../constants/externalLinks';
import { Input } from '../toolbox/inputs';
import { getPublicKey, validatePin } from '../../utils/hwManager';
import { PrimaryButton, TertiaryButton } from '../toolbox/buttons/button';
import styles from './requestPin.css';

class RequestPin extends React.Component {
  constructor() {
    super();

    this.state = {
      pin: '',
      error: false,
      feedback: '',
    };

    this.onButtonClicked = this.onButtonClicked.bind(this);
    this.onSubmitPin = this.onSubmitPin.bind(this);
  }

  componentDidMount() {
    const { nextStep, deviceId } = this.props;
    if (this.selectedDevice.model !== 'Trezor Model One') nextStep({ deviceId });
    else this.checkDeviceUnlocked();
  }

  async checkDeviceUnlocked() {
    const { t, deviceId } = this.props;
    this.setState({ error: false, feedback: '' });
    const res = await getPublicKey({ index: 0, deviceId });
    if (res) {
      this.props.nextStep({ deviceId });
    } else {
      this.setState({ error: true, feedback: t('Invalid PIN') });
    }
  }

  get selectedDevice() {
    return this.props.devices.find(device => device.deviceId === this.props.deviceId);
  }

  onButtonClicked(e) {
    e.stopPropagation();
    if (this.state.error) this.checkDeviceUnlocked();
    this.setState({ pin: `${this.state.pin}${e.target.value}` });
  }

  onSubmitPin(e) {
    e.preventDefault();
    validatePin(this.state.pin);
  }

  render() {
    const { error, feedback, pin } = this.state;
    const { t, goBack } = this.props;
    const device = this.selectedDevice;

    return (
      <div>
        <h1>{t('{{deviceModel}} connected! Please provide a PIN number', { deviceModel: device.model })}</h1>
        <p>
          { t('If you’re not sure how to do this please follow the') }
          {' '}
          <a
            href={externalLinks.trezorOneHelp}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('Official guidelines')}
          </a>
        </p>

        <div className={styles.content}>
          <div className={styles.gridContainer}>
            <Input
              isMasked
              error={error}
              feedback={feedback}
              maxLength="9"
              type="password"
              value={pin}
            />

            <div className={styles.gridSystem}>
              <div className={styles.gridSystemRow}>
                <button className={styles.squareBtn} onClick={this.onButtonClicked} value="7" />
                <button className={styles.squareBtn} onClick={this.onButtonClicked} value="8" />
                <button className={styles.squareBtn} onClick={this.onButtonClicked} value="9" />
              </div>
              <div className={styles.gridSystemRow}>
                <button className={styles.squareBtn} onClick={this.onButtonClicked} value="4" />
                <button className={styles.squareBtn} onClick={this.onButtonClicked} value="5" />
                <button className={styles.squareBtn} onClick={this.onButtonClicked} value="6" />
              </div>
              <div className={styles.gridSystemRow}>
                <button className={styles.squareBtn} onClick={this.onButtonClicked} value="1" />
                <button className={styles.squareBtn} onClick={this.onButtonClicked} value="2" />
                <button className={styles.squareBtn} onClick={this.onButtonClicked} value="3" />
              </div>
            </div>

            <div className={styles.buttonsContainer}>
              <PrimaryButton
                className="primary-btn"
                onClick={this.onSubmitPin}
                disabled={error}
              >
                {t('Unlock')}
              </PrimaryButton>
              <TertiaryButton
                className="tertiary-btn"
                onClick={goBack}
              >
                {t('Go back')}
              </TertiaryButton>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RequestPin;
