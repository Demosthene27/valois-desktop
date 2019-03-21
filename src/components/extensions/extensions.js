import React from 'react';

import ToolBoxInput from '../toolbox/inputs/toolBoxInput';
import Box from '../box';
import { PrimaryButtonV2, SecondaryButtonV2 } from '../toolbox/buttons/button';
import localJSONStorage from './../../utils/localJSONStorage';
import loadRemoteComponent from './../../utils/extensions';
import routes from '../../constants/routes';
import feedbackLinks from '../../constants/feedbackLinks';

import styles from './extensions.css';

class Extensions extends React.Component {
  constructor() {
    super();

    this.state = {
      url: localJSONStorage.get('url', ''),
      error: '',
    };
  }

  handleInput(value, key) {
    // const regex = /^(https:\/\/raw.githubusercontent.
    // com\/michaeltomasik\/extensions-lisk\/master\/)/g;
    const error = '';
    // if (!value.match(regex)) {
    //   error = this.props.t('Use extensions from https://raw.githubusercontent.com/michaeltomasik/extensions-lisk/master/');
    // }

    this.setState({ [key]: value, error });
  }

  removeExtension() {
    // TODO Multiple extensions
    // let urls = localJSONStorage.get('url', '');
    // urls = urls.filter(url => url !== this.state.url);
    this.setState({ url: '' });
    localJSONStorage.set('url', '');
  }

  addExtension() {
    // TODO Multiple extensions
    // const urls = localJSONStorage.get('url', '');
    // urls.push(this.state.url);
    localJSONStorage.set('url', this.state.url);
    loadRemoteComponent(this.state.url);
    this.props.history.push(`${routes.dashboard.path}`);
  }

  render() {
    return (
      <Box>
        <div className={styles.container}>
          <header className={styles.headerWrapper}>
            <h2>{this.props.t('Add Extension')}</h2>
          </header>
          <div className={styles.feedbackWrapper}>
            <div
              className={styles.label}>
              {this.props.t('Beta: in order to see changes fully please reload the app when removing extension')}
            </div>
            <a
              className={styles.link}
              target='_blank'
              href={feedbackLinks.extensions}
              rel='noopener noreferrer'>
              {this.props.t('Give feedback about this feature')}
            </a>
          </div>
          <div className={styles.extentionsWrapper}>
            <ToolBoxInput
              error={this.state.error}
              label={this.props.t('Enter URL of the *.js file with the extension')}
              value={this.state.url}
              onChange={val => this.handleInput(val, 'url')} >
            </ToolBoxInput>
          </div>
          <div className={styles.footer}>
            <SecondaryButtonV2
              disabled={PRODUCTION || this.state.url.length === 0}
              label={this.props.t('Remove Extension')}
              onClick={() => this.removeExtension()} />

            <PrimaryButtonV2
              disabled={ PRODUCTION && (this.state.error !== '' ||
                this.state.url === localJSONStorage.get('url', ''))}
              label={this.props.t('Add Extension')}
              onClick={() => this.addExtension()} />
          </div>
          <div className={`${styles.footer} ${styles.error}`}>
            {(PRODUCTION) ? this.props.t('In production mode these buttons are disabled') : ''}
          </div>
        </div>
      </Box>
    );
  }
}

export default Extensions;
