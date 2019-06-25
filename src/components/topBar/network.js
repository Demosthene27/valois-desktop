import React from 'react';
import Lisk from '@liskhq/lisk-client';
import networks from '../../constants/networks';
import styles from './network.css';

const Network = ({ peers, t, token }) => {
  const net = ['mainnet', 'testnet', 'devnet'];
  const activeNetwork = net.map(code => t(code));

  let iconCode = peers.options.code;
  if (iconCode === 2) {
    iconCode = peers.options.nethash === Lisk.constants.MAINNET_NETHASH ?
      networks.mainnet.code : iconCode;
    iconCode = peers.options.nethash === Lisk.constants.TESTNET_NETHASH ?
      networks.testnet.code : iconCode;
    iconCode = token === 'BTC' ? networks.testnet.code : iconCode;
  }

  const statusColor = peers.status && peers.status.online ? styles.online : styles.offline;

  return (
    <section className={`${styles.wrapper} network-status`}>
      <span className={`${styles.status} ${statusColor}`}></span>
      <p>
        <span>{t('Connected to:')}</span>
        <span>{activeNetwork[iconCode]}</span>
      </p>
    </section>
  );
};

export default Network;
