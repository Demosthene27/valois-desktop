import React, { useState } from 'react';
import { AutoResizeTextarea } from '../../../toolbox/inputs';
import { messageMaxLength } from '../../../../constants/transactions';
import CircularProgress from '../../../toolbox/circularProgress/circularProgress';
import FormBase from './formBase';
import Icon from '../../../toolbox/icon';
import Tooltip from '../../../toolbox/tooltip/tooltip';
import styles from './form.css';
import useAmountField from './useAmountField';
import useMessageField from './useMessageField';
import useRecipientField from './useRecipientField';
import { toRawLsk } from '../../../../utils/lsk';
import TransactionPriority from '../../../shared/transactionPriority';
import useDynamicFeeCalculation from './useDynamicFeeCalculation';
import useTransactionPriority from './useTransactionPriority';

const txType = 'transfer';

const FormLsk = ({
  t, token, getInitialValue, account, ...restProps
}) => {
  const [customFee, setCustomFee] = useState();
  const [
    transactionPriority, selectTransactionPriority, priorityOptions,
  ] = useTransactionPriority(token);
  const [reference, onReferenceChange] = useMessageField(getInitialValue('reference'));
  const [amount, setAmountField] = useAmountField(getInitialValue('amount'), token);
  const [recipient, setRecipientField] = useRecipientField(getInitialValue('recipient'));

  const [fee, maxAmount] = useDynamicFeeCalculation(transactionPriority, {
    amount: toRawLsk(amount.value),
    txType,
    recipient: recipient.value,
    nonce: account.nonce,
    senderPublicKey: account.publicKey,
    data: reference.value,
  }, token, account);

  const fieldUpdateFunctions = { setAmountField, setRecipientField };
  const fields = {
    amount,
    recipient,
    reference,
    fee: customFee ? { value: customFee, feedback: '', error: false } : fee,
    processingSpeed: transactionPriority,
  };

  const changeCustomFee = (value) => {
    setCustomFee(value);
  };

  return (
    <FormBase
      {...restProps}
      fields={fields}
      fieldUpdateFunctions={fieldUpdateFunctions}
      maxAmount={maxAmount}
    >
      <label className={`${styles.fieldGroup} reference`}>
        <span className={`${styles.fieldLabel}`}>{t('Message (optional)')}</span>
        <span className={styles.referenceField}>
          <AutoResizeTextarea
            maxLength={100}
            spellCheck={false}
            onChange={onReferenceChange}
            name="reference"
            value={reference.value}
            placeholder={t('Write message')}
            className={`${styles.textarea} ${reference.error ? 'error' : ''} message`}
          />
          <CircularProgress
            max={messageMaxLength}
            value={reference.byteCount}
            className={`${styles.byteCounter} ${reference.error ? styles.hide : ''}`}
          />
          <Icon
            className={`${styles.status} ${styles.referenceStatus} ${!reference.value ? styles.hide : styles.show}`}
            name={reference.error ? 'alertIcon' : 'okIcon'}
          />
        </span>
        <span className={`${styles.feedback} ${reference.error || messageMaxLength - reference.byteCount < 10 ? 'error' : ''} ${styles.show}`}>
          {reference.feedback}
          <Tooltip
            position="top left"
            title={t('Bytes counter')}
          >
            <p className={styles.tooltipText}>
              {
                t(`Lisk counts your message by bytes so keep in mind 
                that the length on your message may vary in different languages. 
                Different characters may consume different amount of bytes space.`)
              }
            </p>
          </Tooltip>
        </span>
      </label>
      <TransactionPriority
        token={token}
        fee={fee}
        customFee={customFee}
        setCustomFee={changeCustomFee}
        priorities={priorityOptions}
        selectedPriority={transactionPriority.selectedIndex}
        setSelectedPriority={selectTransactionPriority}
      />
    </FormBase>
  );
};

export default FormLsk;
