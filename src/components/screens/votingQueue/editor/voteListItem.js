import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import AccountVisual from '../../../toolbox/accountVisual';
import Box from '../../../toolbox/box';
import { SecondaryButton, TertiaryButton } from '../../../toolbox/buttons';
import Icon from '../../../toolbox/icon';
import LiskAmount from '../../../shared/liskAmount';
import { tokenMap } from '../../../../constants/tokens';
import useVoteAmountField from '../../editVote/useVoteAmountField';
import { voteEdited } from '../../../../actions/voting';
import { toRawLsk } from '../../../../utils/lsk';
import AmountField from '../../../shared/amountField';
import styles from './editor.css';

const ComponentState = Object.freeze({ editing: 1, notEditing: 2 });
const token = tokenMap.LSK.key;

const VoteListItem = ({
  t = s => s, data: {
    address, username, confirmed, unconfirmed,
  },
}) => {
  const [state, setState] = useState(ComponentState.notEditing);
  const dispatch = useDispatch();
  const [voteAmount, setVoteAmount] = useVoteAmountField(unconfirmed || confirmed);

  const handleFormSubmission = (e) => {
    e.preventDefault();
    dispatch(voteEdited([{
      address,
      amount: toRawLsk(voteAmount.value),
    }]));
    setState(ComponentState.notEditing);
  };

  const discard = () => {
    dispatch(voteEdited([{
      address,
      amount: confirmed,
    }]));
  };

  const changeToEditingMode = () => {
    setState(ComponentState.editing);
  };

  const changeToNotEditingMode = () => {
    setState(ComponentState.notEditing);
  };

  return (
    <Box className={styles.voteItemContainer}>
      <div className={`${styles.infoColumn} ${styles.delegateInfoContainer}`}>
        <AccountVisual address={address} />
        <div className={styles.delegateInfo}>
          <span className={styles.delegateAddress}>{address}</span>
          <span className={styles.delegateUsername}>{username}</span>
        </div>
      </div>
      <span className={`${styles.oldAmountColumn} ${styles.centerContent}`}>
        <LiskAmount val={confirmed} token={token} />
      </span>
      {state === ComponentState.notEditing
        ? (
          <>
            <span className={`${styles.newAmountColumn} ${styles.centerContent}`}>
              <LiskAmount val={unconfirmed} token={token} />
            </span>
            <div className={`${styles.editIconsContainer} ${styles.centerContent}`}>
              <span onClick={changeToEditingMode}>
                <Icon name="edit" className={styles.editIcon} />
              </span>
              <span onClick={discard}>
                <Icon name="deleteIcon" className={styles.editIcon} />
              </span>
            </div>
          </>
        )
        : (
          <form
            className={`${styles.editVoteForm} ${styles.centerContent}`}
            onSubmit={handleFormSubmission}
          >
            <AmountField
              amount={voteAmount}
              setAmountField={setVoteAmount}
              title={t('Vote amount (LSK)')}
              inputPlaceHolder={t('Vote amount')}
              name="vote"
              className={styles.editAmountInput}
            />
            <div className={styles.formButtonsContainer}>
              <SecondaryButton
                size="s"
                className={styles.formButtons}
                onClick={changeToNotEditingMode}
              >
                {t('Cancel')}
              </SecondaryButton>
              <TertiaryButton
                size="s"
                className={styles.formButtons}
                onClick={handleFormSubmission}
              >
                {t('Save')}
              </TertiaryButton>
            </div>
          </form>
        )
      }
    </Box>
  );
};

export default VoteListItem;
