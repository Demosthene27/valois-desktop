import React from 'react';
import { mount } from 'enzyme';
import TransactionVotes from './transactionVotes';

describe('Transaction Votes', () => {
  let wrapper;
  const props = {
    votes: {
      added: [{ username: 'delegate1', rank: '1', account: { address: '123L' } }],
      deleted: [{ username: 'delegate2', rank: '2', account: { address: '12345L' } }],
    },
    t: v => v,
  };

  it.skip('Should render with added and deleted Votes', () => {
    wrapper = mount(<TransactionVotes {...props} />);
    expect(wrapper).toContainMatchingElements(2, '.votesContainer');
    expect(wrapper.find('.rank').first().text()).toEqual(`#${props.votes.added[0].rank}`);
    expect(wrapper.find('.username').first().text()).toEqual(props.votes.added[0].username);
  });

  it.skip('Should only render added votes and sort by rank', () => {
    const addedProps = {
      ...props,
      votes: {
        added: [
          { username: 'delegate2', rank: '2', account: { address: '12345L' } },
          { username: 'delegate1', rank: '1', account: { address: '123L' } },
        ],
      },
    };
    wrapper = mount(<TransactionVotes {...addedProps} />);
    expect(wrapper).toContainMatchingElements(1, '.votesContainer.added');
    expect(wrapper.find('.rank').at(1).text()).toBe(`#${addedProps.votes.added[0].rank}`);
  });

  it('Should only render removed votes', () => {
    const deleteProps = {
      ...props,
      votes: {
        deleted: [
          { username: 'delegate2', rank: '2', account: { address: '12345L' } },
          { username: 'delegate1', rank: '1', account: { address: '123L' } },
        ],
      },
    };
    wrapper = mount(<TransactionVotes {...deleteProps} />);
    expect(wrapper).toContainMatchingElements(1, '.votesContainer.deleted');
  });
});
