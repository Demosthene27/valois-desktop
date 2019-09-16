/**
 * This file is use for the exchange messages with the HWManager.
 * The communication message is through IPC (window.ipc)
 */
import { IPC_MESSAGES, RESPONSE, REQUEST } from './constants';

const IPC = window.ipc;

/**
 * executeCommand - Function.
 * Use for send and request data to the HWManager.
 */
const executeCommand = (action, payload) => (
  new Promise((resolve, reject) => {
    // Listening for response
    IPC.once(`${action}.${RESPONSE}`, (event, response) => {
      if (response.success) return resolve(response.data);
      return reject(new Error(`${action} failed`));
    });
    // Requesting data
    IPC.send(`${action}.${REQUEST}`, payload);
  })
);

/**
 * getPublicKey - Function.
 * Use for get the public key from the device for a specific account(s)
 * @param {object} data -> Object that contain the information about the device and data
 * @param {string} data.deviceId -> Id of the hw device
 * @param {number} data.index -> index of the account of wich will extact information
 * @param {boolean} data.showOnDevice -> Boolean value to inform device if show or
 * not information in screen
 */
const getPublicKey = async (data) => {
  const response = await executeCommand(IPC_MESSAGES.GET_PUBLICK_KEY, data);
  return response;
};

/**
 * signTransaction - Function.
 * Use for sign a transaction, this could be send or vote
 * @param {object} data -> Object that contain the information about the device and data
 * @param {string} data.deviceId -> Id of the hw device
 * @param {number} data.index -> index of the account of wich will extact information
 * @param {object} data.tx -> Object with all transaction information
 */
const signTransaction = async (data) => {
  const response = await executeCommand(IPC_MESSAGES.SIGN_TRANSACTION, data);
  return response;
};

/**
 * subscribeToDeviceConnceted - Function.
 * Always listen for get the information of the new connected device
 * @param {function} fn -> callback function
 */
const subscribeToDeviceConnceted = (fn) => {
  IPC.on(IPC_MESSAGES.CONNECT, (event, response) => fn(response));
};

/**
 * subscribeToDeviceDisonnceted - Function.
 * Always listen for get the information of the disconnected device
 * @param {function} fn -> callback function
 */
const subscribeToDeviceDisonnceted = (fn) => {
  IPC.on(IPC_MESSAGES.DISCONNECT, (event, response) => fn(response));
};

/**
 * subscribeToDevicesList - Function.
 * Allways listen for any new change on the devices list
 * @param {function} fn -> callback function
 */
const subscribeToDevicesList = (fn) => {
  IPC.on(IPC_MESSAGES.DEVICE_LIST_CHANGED, (event, response) => fn(response));
};

export {
  executeCommand,
  getPublicKey,
  signTransaction,
  subscribeToDeviceConnceted,
  subscribeToDeviceDisonnceted,
  subscribeToDevicesList,
};
