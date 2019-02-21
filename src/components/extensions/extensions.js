import React from 'react';

import ToolBoxInput from '../toolbox/inputs/toolBoxInput';
import Box from '../box';
import { PrimaryButtonV2, SecondaryButtonV2 } from '../toolbox/buttons/button';
import localJSONStorage from './../../utils/localJSONStorage';
import loadRemoteComponent from './../../utils/extensions';
import routes from '../../constants/routes';

import styles from './extensions.css';

class Extensions extends React.Component {
  constructor() {
    super();

    this.state = {
      url: localJSONStorage.get('url', ''),
    };
  }

  handleInput(value, key) {
    this.setState({ [key]: value });
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
          <div className={styles.extentionsWrapper}>
            <ToolBoxInput
              label={this.props.t('Enter URL of the *.js file with the extension')}
              value={this.state.url}
              onChange={val => this.handleInput(val, 'url')} >
            </ToolBoxInput>
          </div>
          <div className={styles.footer}>
            <SecondaryButtonV2
              disabled={this.state.url.length === 0}
              label={this.props.t('Remove Extension')}
              onClick={() => this.removeExtension()} />

            <PrimaryButtonV2
              label={this.props.t('Add Extension')}
              onClick={() => this.addExtension()} />
          </div>
        </div>
      </Box>
    );
  }
}

export default Extensions;
