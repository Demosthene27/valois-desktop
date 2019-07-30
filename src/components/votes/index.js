import { translate } from 'react-i18next';
import { getVotes, getDelegates } from '../../utils/api/delegates';
import withData from '../../utils/withData';
import VotesTab from './votesTab';

const apis = {
  votes: {
    apiUtil: getVotes,
    defaultData: [],
    transformResponse: response => response.data.votes,
  },
  delegates: {
    apiUtil: getDelegates,
    defaultData: {},
    transformResponse: (response, oldData) => ({
      ...oldData,
      ...response.data.reduce((acc, item) => ({ ...acc, [item.username]: item }), {}),
    }),
  },
};

export default withData(apis)(translate()(VotesTab));
