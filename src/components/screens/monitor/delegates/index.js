/* istanbul ignore file */
import React from 'react';
import { compose } from 'redux';
import { connect, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import Delegates from './delegates';
import liskService from '../../../../utils/api/lsk/liskService';
import withData from '../../../../utils/withData';
import withFilters from '../../../../utils/withFilters';
import withForgingStatus from './withForgingStatus';
import withLocalSort from '../../../../utils/withLocalSort';
import withResizeValues from '../../../../utils/withResizeValues';
import NotAvailable from '../notAvailable';

const defaultUrlSearchParams = { tab: 'active' };
const delegatesKey = 'delegates';

const mapStateToProps = ({ blocks: { latestBlocks } }) => ({
  latestBlocks,
});

const ComposedDelegates = compose(
  withRouter,
  withData(
    {
      [delegatesKey]: {
        apiUtil: liskService.getDelegates,
        defaultData: [],
        defaultUrlSearchParams,
        autoload: true,
        transformResponse: (response, oldData, urlSearchParams) => (
          urlSearchParams.offset
            ? [...oldData, ...response.filter(
              delegate => !oldData.find(({ username }) => username === delegate.username),
            )]
            : response
        ),
      },
      chartsActiveAndStandby: {
        apiUtil: liskService.getActiveAndStandByDelegates,
        defaultData: [],
        autoload: true,
        transformResponse: response => ([response.total - 101, 101]),
      },
    },
  ),
  withResizeValues,
  withFilters(delegatesKey, defaultUrlSearchParams),
  connect(mapStateToProps),
  withForgingStatus(delegatesKey),
  withLocalSort(delegatesKey, 'rank:asc'),
  withTranslation(),
)(Delegates);

const DelegatesMonitor = () => {
  const network = useSelector(state => state.network);

  return (
    liskService.getLiskServiceUrl(network) === null
      ? <NotAvailable />
      : <ComposedDelegates />
  );
};

export default DelegatesMonitor;
