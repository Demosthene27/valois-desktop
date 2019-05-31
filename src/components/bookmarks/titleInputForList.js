import React from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import styles from './bookmarks.css';
import { bookmarkUpdated } from '../../actions/bookmarks';
import { getTokenFromAddress } from '../../utils/api/transactions';
import TitleInput from './accountTitleInput';

class TitleInputForList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { title: { value: props.account.title } };
  }

  componentWillReceiveProps(props) {
    const { value: newTitle, error } = this.state.title;
    const oldTitle = props.account.title;

    if (!props.edit && newTitle.length && oldTitle !== newTitle && !error) {
      this.props.updateAccount({
        account: {
          ...props.account,
          title: this.state.title.value,
        },
        token: getTokenFromAddress(props.account.address),
      });
    } else if (!props.edit && (!newTitle.length || error)) {
      this.setState({ title: { value: oldTitle } });
    }
  }

  handleChange(value, validateInput) {
    this.setState({
      title: {
        value,
        error: validateInput(value),
      },
    });
  }

  render() {
    return <TitleInput
      className={styles.title}
      title={this.state.title}
      disabled={!this.props.edit || this.props.account.isDelegate}
      hideLabel={true}
      onChange={this.handleChange.bind(this)}
    />;
  }
}

const mapDispatchToProps = {
  updateAccount: bookmarkUpdated,
};

export default connect(null, mapDispatchToProps)(translate()(TitleInputForList));
