import { withTranslation } from 'react-i18next';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import moment from 'moment';
import { DEFAULT_LIMIT } from '../../../../constants/monitor';
import { formatAmountBasedOnLocale } from '../../../../utils/formattedNumber';
import AccountVisualWithAddress from '../../../shared/accountVisualWithAddress';
import DelegatesTable from '../../../shared/delegatesTable';
import MonitorHeader from '../header';
import Tooltip from '../../../toolbox/tooltip/tooltip';
import routes from '../../../../constants/routes';
import styles from './delegates.css';

const Delegates = ({
  delegates, t, filters, applyFilters,
}) => {
  const columns = [
    { id: 'rank' },
    {
      id: 'username',
      header: ('Name'),
      className: grid['col-xs-2'],
    },
    {
      id: 'address',
      header: t('Address'),
      /* eslint-disable-next-line react/display-name */
      getValue: ({ address }) => <AccountVisualWithAddress {...{ address, size: 36 }} />,
      className: [grid['col-xs-4'], grid['col-md-3']].join(' '),
    },
    {
      id: 'forgingTime',
      header: <React.Fragment>
        {t('Forging time')}
        <Tooltip className="showOnLeft">
          <p>{t('Time until a delegate can forge their next block.')}</p>
        </Tooltip>
      </React.Fragment>,
      /* eslint-disable-next-line react/display-name */
      getValue: ({ forgingTime }) => (forgingTime
        ? moment(forgingTime.diff(moment())).format(t('m [min] s [sec]'))
        : '-'),
      className: ['hidden-m', grid['col-md-2']].join(' '),
    },
    {
      id: 'status',
      header: <React.Fragment>
        {t('Status')}
        <Tooltip className="showOnLeft">
          <p>{t('Status turns green if a delegate has forged their last block, or red if they missed it.')}</p>
        </Tooltip>
      </React.Fragment>,
      /* eslint-disable-next-line react/display-name */
      getValue: ({ status }) => <div className={[styles.status, styles[status]].join(' ')} />,
      className: grid['col-xs-1'],
    },
    { id: 'productivity' },
    {
      id: 'approval',
      header: <React.Fragment>
        {t('Approval')}
        <Tooltip className="showOnLeft">
          <p>{t('Approval rate specifies the percentage of all votes received by a delegate.')}</p>
        </Tooltip>
      </React.Fragment>,
      getValue: ({ approval }) => `${formatAmountBasedOnLocale({ value: approval })} %`,
      className: grid['col-xs-2'],
    },
  ];

  const tabs = {
    tabs: [
      {
        value: 'active',
        name: ('Active delegates'),
        className: 'active',
      }, {
        value: 'standby',
        name: ('Standby delegates'),
        className: 'standby',
      },
    ],
    active: filters.tab,
    onClick: ({ value }) => applyFilters({ ...filters, tab: value }),
  };

  const canLoadMore = filters.tab === 'active'
    ? false
    : !!delegates.data.length && delegates.data.length % DEFAULT_LIMIT === 0;

  const getRowLink = delegate => `${routes.accounts.pathPrefix}${routes.accounts.path}/${delegate.address}`;

  return (
    <div>
      <MonitorHeader />
      <DelegatesTable {...{
        columns, delegates, tabs, filters, applyFilters, canLoadMore, getRowLink,
      }}
      />
    </div>
  );
};

export default withTranslation()(Delegates);
