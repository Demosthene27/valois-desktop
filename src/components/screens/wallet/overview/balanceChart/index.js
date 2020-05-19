import React, { useState, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import Box from '../../../../toolbox/box';
import BoxHeader from '../../../../toolbox/box/header';
import BoxEmptyState from '../../../../toolbox/box/emptyState';
import * as ChartUtils from '../../../../../utils/balanceChart';
import { tokenMap } from '../../../../../constants/tokens';
import i18n from '../../../../../i18n';
import { LineChart } from '../../../../toolbox/charts';
import styles from './balanceChart.css';

const BalanceGraph = ({
  t, transactions, token, isDiscreetMode, balance, address,
}) => {
  const [data, setData] = useState(null);
  const [options, setOptions] = useState({});

  useEffect(() => {
    if (data) {
      setData(null);
    }
  }, [token]);

  useEffect(() => {
    if (!data && transactions.length && balance !== undefined) {
      const format = ChartUtils.getChartDateFormat(transactions);
      setOptions(ChartUtils.graphOptions({
        format,
        token,
        isDiscreetMode,
        locale: i18n.language,
      }));

      setData(ChartUtils.getBalanceData({
        transactions,
        balance,
        address,
        format,
      }));
    }
  }, [transactions]);

  return (
    <Box className={`${styles.wrapper}`}>
      <BoxHeader>
        <h1>{t('{{token}} balance', { token: tokenMap[token].label })}</h1>
      </BoxHeader>
      <div className={styles.content}>
        { data
          ? (
            <LineChart
              data={data}
              options={options}
            />
          )
          : (
            <BoxEmptyState>
              <p>
                {t('There are no transactions.')}
              </p>
            </BoxEmptyState>
          )
          }
      </div>
    </Box>
  );
};

export default withTranslation()(BalanceGraph);
