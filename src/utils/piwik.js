import ReactPiwik from 'react-piwik';
import piwikOptions from '../constants/piwik';
import localJSONStorage from './localJSONStorage';

let piwik = false;

const setPiwikParameters = () => {
  ReactPiwik.push([piwikOptions.REMEMBER_CONSENT_GIVEN]);
  ReactPiwik.push([piwikOptions.ENABLE_HEART_BEAT_TIMER, 30]);
  ReactPiwik.push([piwikOptions.TRACK_PAGE_VIEW]);
  ReactPiwik.push([piwikOptions.TRACK_ALL_CONTENT_IMPRESSIONS]);
};

const initPiwik = () => {
  piwik = new ReactPiwik({
    url: piwikOptions.URL,
    siteId: piwikOptions.SITE_ID,
    trackErrors: true,
  });

  setPiwikParameters();

  return piwik;
};

const checkIfPiwikIsEnabled = () => localJSONStorage.get('settings', false);

const disabledPiwikTracking = () => {
  ReactPiwik.push([piwikOptions.FORGET_CONSENT_GIVEN]);
};

const tracking = (history) => {
  const settings = checkIfPiwikIsEnabled();

  if (!piwik && settings.statistics) {
    initPiwik();
  }

  if (piwik && settings.statistics) {
    piwik.connectToHistory(history);
  } else if (piwik) {
    disabledPiwikTracking();
    piwik = false;
  }

  return piwik;
};

export default {
  tracking,
  disabledPiwikTracking,
};
