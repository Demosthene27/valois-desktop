import React from 'react';
import { getNetworkNameBasedOnNethash } from '../../../../utils/getNetwork';
import styles from './network.css';

const Network = ({ network, t, token }) => {
  const networksList = {
    Mainnet: t('Mainnet'),
    Testnet: t('Testnet'),
    'Custom Node': t('Devnet'),
  };

  const activeNetwork = getNetworkNameBasedOnNethash(network, token);

  const statusColor = network.status.online ? styles.online : styles.offline;

  return (
    <section className={`${styles.wrapper} network-status`}>
      <span className={`${styles.status} ${statusColor}`} />
      <p>
        <span>{t('Connected to:')}</span>
        <span>{(networksList[activeNetwork] || '').toLowerCase()}</span>
      </p>
    </section>
  );
};

export default Network;
