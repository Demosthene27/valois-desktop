import search from './search';
import actionTypes from '../../constants/actions';

const mockData = ['1', '2'];

describe('Reducer: search', () => {
  it('should reduce delegates', () => {
    const state = {
      delegates: {
        '1L': {
          username: 'Alice',
        },
      },
    };

    const action = {
      type: actionTypes.searchDelegate,
      data: {
        address: '2L',
        delegate: {
          username: 'Bob',
        },
      },
    };

    const changedState = search(state, action);
    expect(changedState).toEqual({
      delegates: {
        '1L': {
          username: 'Alice',
        },
        '2L': {
          username: 'Bob',
        },
      },
    });
  });

  it('should reduce votes', () => {
    const state = {
      votes: {
        '0L': [
          {
            address: '1L',
          },
        ],
      },
    };

    const action = {
      type: actionTypes.searchVotes,
      data: {
        votes: [
          {
            address: '2L',
          },
        ],
        address: '0L',
      },
    };

    const changedState = search(state, action);
    expect(changedState).toEqual({
      votes: {
        '0L': [
          {
            address: '2L',
          },
        ],
      },
    });
  });

  it('should set transactions of an account to be the transactions loaded by the searchTransactions action', () => {
    const state = {
      transactions: {
        '0L': {
          transactions: [
            {
              id: '1',
            },
          ],
        },
      },
    };

    const action = {
      type: actionTypes.searchTransactions,
      data: {
        address: '0L',
        transactions: [
          {
            id: '2',
          },
        ],
        count: 2,
        filter: 0,
      },
    };

    const changedState = search(state, action);
    expect(changedState).toEqual({
      transactions: {
        '0L': {
          address: '0L',
          transactions: [
            {
              id: '2',
            },
          ],
          count: 2,
          filter: 0,
        },
      },
      lastSearch: '0L',
      searchResults: [
        {
          id: '2',
        },
      ],
    });
  });

  it('should return state if action.type is none of the above', () => {
    const state = {
      suggestions: {
        delegates: mockData,
        addresses: mockData,
        transactions: mockData,
      },
    };
    const action = {
      type: 'UNKNOWN',
    };
    const changedState = search(state, action);
    expect(changedState).toEqual(state);
  });
});
