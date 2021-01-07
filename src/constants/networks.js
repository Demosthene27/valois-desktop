export const networkKeys = {
  mainNet: 'mainnet',
  testNet: 'testnet',
  customNode: 'customNode',
};

const networks = {
  [networkKeys.mainNet]: { // network name translation t('Mainnet');
    name: 'Mainnet',
    code: 0,
    nodes: [
      'https://hub21.lisk.io',
      'https://hub22.lisk.io',
      'https://hub23.lisk.io',
      'https://hub24.lisk.io',
      'https://hub25.lisk.io',
      'https://hub26.lisk.io',
      'https://hub27.lisk.io',
      'https://hub28.lisk.io',
      'https://hub31.lisk.io',
      'https://hub32.lisk.io',
      'https://hub33.lisk.io',
      'https://hub34.lisk.io',
      'https://hub35.lisk.io',
      'https://hub36.lisk.io',
      'https://hub37.lisk.io',
      'https://hub38.lisk.io',
    ],
    initialSupply: 10000000000000000,
  },
  [networkKeys.testNet]: { // network name translation t('Testnet');
    name: 'Testnet',
    testnet: true,
    code: 1,
    nodes: ['https://testnet.lisk.io'],
    initialSupply: 10000000000000000,
  },
  [networkKeys.customNode]: { // network name translation t('Custom Node');
    name: 'Custom Node',
    custom: true,
    address: 'http://localhost:4000',
    code: 2,
    initialSupply: 10000000000000000,
  },
};

export default networks;
