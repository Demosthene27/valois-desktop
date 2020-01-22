import Lisk from '@liskhq/lisk-client';
import i18next from 'i18next';
import { toast } from 'react-toastify';
import actionTypes from '../../constants/actions';
import { tokenMap } from '../../constants/tokens';
import networks from '../../constants/networks';

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

const getNethash = async nodeUrl => (
  new Promise(async (resolve, reject) => {
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
  await getNethash(nodeUrl).then(({ nethash, version }) => {
    dispatch(generateAction(data, {
      nodeUrl,
      custom: data.network.custom,
      code: data.network.code,
      nethash,
      apiVersion: version.substring(0, 1),
    }));
  }).catch((error) => {
    dispatch(generateAction(data, {
      nodeUrl: data.network.address,
      custom: data.network.custom,
      code: data.network.code,
    }));
    toast.error(error);
  });
};
