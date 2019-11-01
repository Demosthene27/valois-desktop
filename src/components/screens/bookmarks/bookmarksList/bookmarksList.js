import { Link } from 'react-router-dom';
import React from 'react';
import { Input } from '../../../toolbox/inputs';
import Illustration from '../../../toolbox/illustration';
import { PrimaryButton, SecondaryButton, WarningButton } from '../../../toolbox/buttons/button';
import { tokenMap } from '../../../../constants/tokens';
import AccountVisual from '../../../toolbox/accountVisual';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import BoxFooter from '../../../toolbox/box/footer';
import BoxEmptyState from '../../../toolbox/box/emptyState';
import regex from '../../../../utils/regex';
import routes from '../../../../constants/routes';
import styles from './bookmarksList.css';
import Icon from '../../../toolbox/icon';

class BookmarksList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: '',
    };

    this.onFilterChange = this.onFilterChange.bind(this);
    this.deleteBookmark = this.deleteBookmark.bind(this);
    this.editBookmark = this.editBookmark.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onRowClick = this.onRowClick.bind(this);
  }

  getBookmarkListBasedOnSelectedToken() {
    const { bookmarks, token, limit } = this.props;
    const { filter } = this.state;

    return bookmarks[token.active].filter(({ title, address }) => (
      filter === ''
      || title.toLowerCase().indexOf(filter.toLowerCase()) !== -1
      || address.toLowerCase().indexOf(filter.toLowerCase()) !== -1
    )).slice(0, limit);
  }

  displayAddressBasedOnSelectedToken(address) {
    const { token } = this.props;

    return token.active === tokenMap.LSK.key
      ? address
      : address.replace(regex.btcAddressTrunk, '$1...$3');
  }

  onFilterChange({ target }) {
    this.setState({
      filter: target.value,
    });
  }

  editBookmark(e, bookmark) {
    this.updateBookmark(e, bookmark);
    e.preventDefault();
    setTimeout(() => {
      this.editInput.select();
    }, 10);
  }

  updateBookmark(e, { address, title }) {
    this.setState({
      eddittedAddress: address,
      eddittedTitle: {
        feedback: '',
        value: title,
      },
    });
  }

  deleteBookmark(e, { address }) {
    const { token, bookmarkRemoved } = this.props;
    bookmarkRemoved({ address, token: token.active });
    e.preventDefault();
  }

  saveChanges(e) {
    const { token, bookmarkUpdated } = this.props;
    const { eddittedAddress, eddittedTitle } = this.state;
    bookmarkUpdated({
      account: {
        address: eddittedAddress,
        title: eddittedTitle.value,
      },
      token: token.active,
    });
    this.updateBookmark(e, {});
  }

  onTitleChange({ target }) {
    this.setState({
      ...this.state,
      eddittedTitle: {
        value: target.value,
        feedback: target.value.length > 20 ? this.props.t('Label name is too long') : '',
      },
    });
  }

  onRowClick(e) {
    const { eddittedAddress } = this.state;
    if (eddittedAddress) {
      e.preventDefault();
    }
  }

  render() {
    const {
      t, token, className, enableFilter, title, isEditable, bookmarks, emptyStateClassName, limit,
    } = this.props;
    const {
      filter, eddittedAddress, eddittedTitle,
    } = this.state;

    const selectedBookmarks = this.getBookmarkListBasedOnSelectedToken();

    return (
      <Box className={` ${styles.box} ${className} bookmarks-list`}>
        <BoxHeader>
          <h2>{title || t('Bookmarks')}</h2>
          { enableFilter
            ? (
              <span>
                <Input
                  className="bookmarks-filter-input"
                  size="xs"
                  onChange={this.onFilterChange}
                  value={filter}
                  placeholder={t('Filter by name or address...')}
                />
              </span>
            )
            : null
          }
        </BoxHeader>
        <BoxContent className={`${styles.bookmarkList} bookmark-list-container`}>
          {
          selectedBookmarks.length
            ? selectedBookmarks.map(bookmark => (
              <Link
                onClick={this.onRowClick}
                key={bookmark.address}
                className={`${styles.row} ${eddittedAddress === bookmark.address ? styles.editting : ''} bookmark-list-row`}
                to={`${routes.accounts.path}/${bookmark.address}`}
              >
                <div className={styles.avatarAndDescriptionWrapper}>
                  {
                    token.active === tokenMap.LSK.key
                      ? (
                        <AccountVisual
                          className={styles.avatar}
                          address={bookmark.address}
                          size={40}
                        />
                      )
                      : null
                  }
                  {
                    eddittedAddress === bookmark.address
                      ? (
                        <Input
                          autoComplete="off"
                          className={`bookmarks-edit-input ${styles.editInput}`}
                          onChange={this.onTitleChange}
                          placeholder={t('Filter by name or address...')}
                          setRef={(input) => { this.editInput = input; }}
                          size="m"
                          value={eddittedTitle.value}
                          name="bookmarkName"
                          error={!!eddittedTitle.feedback}
                          feedback={eddittedTitle.feedback}
                          status={eddittedTitle.feedback ? 'error' : 'ok'}
                        />
                      )
                      : (
                        <span className={styles.description}>
                          <span>{bookmark.title}</span>
                          <span>{this.displayAddressBasedOnSelectedToken(bookmark.address)}</span>
                        </span>
                      )
                  }
                </div>
                { isEditable
                  ? (
                    <div className={styles.buttonContainer}>
                      { eddittedAddress === bookmark.address
                        ? (
                          <React.Fragment>
                            <SecondaryButton
                              onClick={e => this.updateBookmark(e, {})}
                              className="bookmarks-cancel-button"
                              size="m"
                            >
                              {t('Cancel')}
                            </SecondaryButton>
                            <PrimaryButton
                              onClick={e => this.saveChanges(e)}
                              className="bookmarks-save-changes-button"
                              size="m"
                              disabled={!!eddittedTitle.feedback}
                            >
                              {t('Save changes')}
                            </PrimaryButton>
                          </React.Fragment>
                        )
                        : (
                          <React.Fragment>
                            <SecondaryButton
                              onClick={e => this.editBookmark(e, bookmark)}
                              className="bookmarks-edit-button"
                              size="m"
                              disabled={bookmark.isDelegate}
                            >
                              {t('Edit')}
                            </SecondaryButton>
                            <WarningButton
                              onClick={e => this.deleteBookmark(e, bookmark)}
                              className="bookmarks-delete-button"
                              size="m"
                            >
                              {t('Delete')}
                            </WarningButton>
                          </React.Fragment>
                        )
                  }
                    </div>
                  )
                  : null
              }
              </Link>
            ))
            : (
              <React.Fragment>
                { bookmarks[token.active].length
                  ? (
                    <BoxEmptyState className={emptyStateClassName}>
                      <Illustration name="emptyBookmarkFiler" className="bookmark-empty-filter-illustration" />
                      <p>{t('There are no results matching this filter.')}</p>
                    </BoxEmptyState>
                  )
                  : (
                    <BoxEmptyState className={emptyStateClassName}>
                      { limit
                        ? (
                          <React.Fragment>
                            <Icon name="bookmarksIconEmptyState" />
                            <h1>{t('No Bookmarks added yet')}</h1>
                            <p>{t('Start adding some addresses to bookmarks, to keep track of them.')}</p>
                            <Link to={routes.addBookmark.path}>
                              <SecondaryButton>{t('Add a new bookmark')}</SecondaryButton>
                            </Link>
                          </React.Fragment>
                        )
                        : (
                          <React.Fragment>
                            <Illustration name="emptyBookmarksList" className="bookmarks-empty-illustration" />
                            <p>{t('You don’t have any bookmarks yet.')}</p>
                          </React.Fragment>
                        )
                  }
                    </BoxEmptyState>
                  )
            }
              </React.Fragment>
            )
        }
        </BoxContent>
        {
          selectedBookmarks.length && limit
            ? (
              <BoxFooter className={styles.footer}>
                <Link to={routes.bookmarks.path}>
                  <SecondaryButton size="s">{t('View All')}</SecondaryButton>
                </Link>
              </BoxFooter>
            )
            : null
        }
      </Box>
    );
  }
}

BookmarksList.defaultProps = {
  emptyStateClassName: '',
};

export default BookmarksList;
