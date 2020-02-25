import liskClient from 'Utils/lisk-client'; // eslint-disable-line
import i18next from 'i18next';
import { toast } from 'react-toastify';
import actionTypes from '../../constants/actions';
import { tokenMap } from '../../constants/tokens';
import networks from '../../constants/networks';
import { getNetworkNameBasedOnNethash } from '../../utils/getNetwork';
import { version as AppVersion } from '../../../package.json';

const isStaging = () => (
  localStorage.getItem('useLiskServiceStaging')
  || AppVersion.includes('beta')
  || AppVersion.includes('rc')
    ? '-staging' : '');

const getServerUrl = (networkConfig) => {
  console.log('>getServerUrl>>', networkConfig);
  const name = getNetworkNameBasedOnNethash(networkConfig);
  const { nodeUrl } = networkConfig.networks.LSK;
  if (name === networks.mainnet.name || name === networks.testnet.name) {
    return `https://${name.toLowerCase()}-service${isStaging()}.lisk.io`;
  }
  if (/liskdev.net:\d{2,4}$/.test(nodeUrl)) {
    return nodeUrl.replace(/:\d{2,4}/, ':9901');
  }
  if (/\.(liskdev.net|lisk.io)$/.test(nodeUrl)) {
    return nodeUrl.replace(/\.(liskdev.net|lisk.io)$/, $1 => `-service${$1}`);
  }
  return null;
};

const generateAction = (data, config) => ({
  data: {
    name: data.name,
    token: tokenMap.LSK.key,
    network: config,
  },
  type: actionTypes.networkSet,
});

export const getConnectionErrorMessage = error => (
  error && error.message
    ? i18next.t(`Unable to connect to the node, Error: ${error.message}`)
    : i18next.t('Unable to connect to the node, no response from the server.')
);

const getNetworkInfo = async nodeUrl => (
  new Promise(async (resolve, reject) => {
    const Lisk = liskClient();
    new Lisk.APIClient([nodeUrl], {}).node.getConstants().then((response) => {
      resolve(response.data);
    }).catch((error) => {
      reject(getConnectionErrorMessage(error));
    });
  })
);

export const networkSet = data => async (dispatch) => {
  const nodeUrl = data.name === networks.customNode.name
    ? data.network.address
    : networks[data.name.toLowerCase()].nodes[0];
  await getNetworkInfo(nodeUrl).then(({ nethash, version, networkId }) => {
    const networkConfig = {
      nodeUrl,
      custom: data.network.custom,
      code: data.network.code,
      apiVersion: version.substring(0, 1),
      nethash,
      networkIdentifier: networkId,
    };
    dispatch(generateAction(data, networkConfig));
    dispatch({
      data: getServerUrl({ networks: { LSK: networkConfig } }),
      type: actionTypes.serviceUrlSet,
    });
  }).catch((error) => {
    dispatch(generateAction(data, {
      nodeUrl: data.network.address,
      custom: data.network.custom,
      code: data.network.code,
    }));
    toast.error(error);
  });
};
