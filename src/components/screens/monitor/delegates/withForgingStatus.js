import { connect } from 'react-redux';
import React from 'react';
import moment from 'moment';
import { convertUnixSecondsToLiskEpochSeconds } from '../../../../utils/datetime';
import { olderBlocksRetrieved } from '../../../../actions/blocks';
import liskService from '../../../../utils/api/lsk/liskService';
import voting from '../../../../constants/voting';

const limit = 100;

const withForgingStatus = delegatesKey => (ChildComponent) => {
  class DelegatesContainer extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        nextForgers: {},
        lastBlocks: {},
      };
    }

    async componentDidMount() {
      const { network: networkConfig, latestBlocks } = this.props;
      let blocks = latestBlocks;
      // TODO figure out how to mock latestBlocks in connect
      // istanbul ignore else
      if (blocks.length < limit) {
        blocks = await liskService.getLastBlocks({ networkConfig }, { limit });
        blocks = blocks.map(block => ({
          ...block,
          timestamp: convertUnixSecondsToLiskEpochSeconds(block.timestamp),
        }));
        this.props.olderBlocksRetrieved({ blocks });
      }

      this.loadNextForgers(blocks);
    }

    async loadNextForgers(blocks) {
      const { network: networkConfig } = this.props;
      const nextForgers = await liskService.getNextForgers({ networkConfig }, { limit });
      const height = blocks[0] && blocks[0].height;
      this.setState({
        nextForgers: nextForgers.reduce((accumulator, delegate, i) => ({
          ...accumulator,
          [delegate.publicKey]: {
            forgingTime: moment().add(i * 10, 'seconds'),
            nextHeight: height + i + 1,
          },
        }), {}),
      });
    }

    // TODO figure out how to mock latestBlocks in connect
    // istanbul ignore next
    componentDidUpdate(prevProps) {
      const { latestBlocks } = this.props;
      const newBlock = latestBlocks[0] || {};
      if (prevProps.latestBlocks[0] && prevProps.latestBlocks[0].height < newBlock.height) {
        this.setState({
          nextForgers: {
            ...this.state.nextForgers,
            [newBlock.generatorPublicKey]: {
              forgingTime: moment().add(voting.numberOfActiveDelegates * 10, 'seconds'),
              nextHeight: newBlock.leight + voting.numberOfActiveDelegates,
            },
          },
        });
        if (newBlock.height % 101 === 1) { // to update next forgers in a new round
          this.loadNextForgers(latestBlocks);
        }
      }
    }

    // TODO figure out how to mock latestBlocks in connect
    // istanbul ignore next
    getForgingStatus(delegate) { // eslint-disable-line
      const { latestBlocks } = this.props;
      const height = latestBlocks[0] && latestBlocks[0].height;
      const roundStartHeight = height - (height % voting.numberOfActiveDelegates);
      const lastBlock = this.getLastBlock(delegate);
      if (latestBlocks.length >= limit && !lastBlock) {
        setTimeout(() => {
          this.requestLastBlock(delegate);
        }, delegate.rank * 100);
      }
      if (delegate.rank <= voting.numberOfActiveDelegates && lastBlock && lastBlock.height) {
        if (lastBlock.height > roundStartHeight - voting.numberOfActiveDelegates) {
          if (lastBlock.height > roundStartHeight) {
            return 'forgedThisRound';
          }
          return 'forgedLastRound';
        }
        if (lastBlock.height > roundStartHeight - 2 * voting.numberOfActiveDelegates) {
          return 'missedLastRound';
        }
        return 'notForging';
      }
      return '';
    }

    getLastBlock(delegate) {
      const { latestBlocks } = this.props;
      return latestBlocks.find(b => b.generatorPublicKey === delegate.publicKey)
        || this.state.lastBlocks[delegate.publicKey];
    }

    getDelegatesData() {
      const { data } = this.props[delegatesKey];
      return data.map(delegate => ({
        ...delegate,
        status: this.getForgingStatus(delegate),
        ...this.state.nextForgers[delegate.publicKey],
        lastBlock: this.getLastBlock(delegate),
      }));
    }

    // TODO figure out how to mock latestBlocks in connect
    // istanbul ignore next
    async requestLastBlock(delegate) {
      if (delegate.rank <= voting.numberOfActiveDelegates) {
        const { network: networkConfig } = this.props;
        this.setState({
          lastBlocks: {
            ...this.state.lastBlocks,
            [delegate.publicKey]: { },
          },
        });
        const blocks = await liskService.getLastBlocks(
          { networkConfig }, { address: delegate.publicKey, limit: 1 },
        );
        this.setState({
          lastBlocks: {
            ...this.state.lastBlocks,
            [delegate.publicKey]: {
              ...blocks[0],
              timestamp: convertUnixSecondsToLiskEpochSeconds(blocks[0].timestamp),
            },
          },
        });
      }
    }

    render() {
      const {
        latestBlocks, network, olderBlocksRetrieved: _, ...rest
      } = this.props;
      return (
        <ChildComponent {...{
          ...rest,
          [delegatesKey]: {
            ...this.props[delegatesKey],
            data: this.getDelegatesData(),
          },
        }}
        />
      );
    }
  }
  const mapStateToProps = ({ network }) => ({
    network,
  });

  const mapDispatchToProps = {
    olderBlocksRetrieved,
  };

  return connect(mapStateToProps, mapDispatchToProps)(DelegatesContainer);
};

export default withForgingStatus;
