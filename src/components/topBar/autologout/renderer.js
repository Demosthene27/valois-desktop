import React from 'react';
import Options from '../../dialog/options';
import routes from './../../../constants/routes';
import Piwik from '../../../utils/piwik';

class CustomCountDown extends React.Component {
  componentDidUpdate() {
    const {
      t, setActiveDialog,
    } = this.props;
    const minutes = parseInt(this.props.minutes, 10);
    const seconds = parseInt(this.props.seconds, 10);

    if (minutes === 0 && seconds === 59) {
      setActiveDialog({
        childComponent: Options,
        childComponentProps: {
          title: t('Timeout soon'),
          text: t('You will be signed out in a minute due to no network activity. You can turn off Auto-Logout in the settings.'),
          firstButton: {
            text: t('Go to settings'),
            onClickHandler: this.goTo.bind(this, routes.setting.path),
          },
          secondButton: {
            text: t('Reset timer & continue'),
            onClickHandler: this.onResetTimer.bind(this),
          },
        },
      });
    }
    if (minutes === 0 && seconds === 1) {
      setActiveDialog({
        childComponent: Options,
        childComponentProps: {
          title: t('Session timeout'),
          text: t('Your session was timed out after 10 minutes of no network activity. You may continue to use certain sections of your Lisk Hub or sign back in to access everything.'),
          firstButton: {
            text: t('Sign back in'),
            onClickHandler: this.goTo.bind(this, routes.loginV2.path),
          },
          secondButton: {
            text: t('Continue to Dashboard'),
            onClickHandler: this.goTo.bind(this, routes.dashboard.path),
          },
        },
      });
    }
  }

  /* istanbul ignore next */
  goTo(path) {
    this.props.history.replace(path);
    this.props.closeDialog();
  }

  /* istanbul ignore next */
  onResetTimer() {
    Piwik.trackingEvent('CustomCountDown', 'button', 'Reset timer');
    this.props.resetTimer();
    this.props.closeDialog();
  }

  // eslint-disable-next-line class-methods-use-this
  render() {
    return null;
  }
}
export default CustomCountDown;
