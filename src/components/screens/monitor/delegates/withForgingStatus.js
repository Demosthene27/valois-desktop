import { connect } from 'react-redux';
import React from 'react';
import { olderBlocksRetrieved } from '../../../../actions/blocks';
import liskService from '../../../../utils/api/lsk/liskService';
import voting from '../../../../constants/voting';

const withForgingStatus = () => (ChildComponent) => {
  class DelegatesContainer extends React.Component {
    componentDidMount() {
      const { network: networkConfig, latestBlocks } = this.props;
      const limit = 100;
      if (latestBlocks.length < limit) {
        liskService.getLastBlocks({ networkConfig }, { limit }).then((blocks) => {
          this.props.olderBlocksRetrieved({ blocks });
        });
      }
    }

    getForgingStatus(delegate) {
      const { latestBlocks } = this.props;
      const height = latestBlocks[0] && latestBlocks[0].height;
      const roundStartHeight = height - (height % voting.numberOfActiveDelegates);
      const block = latestBlocks.find(b => b.generatorPublicKey === delegate.publicKey);
      if (block) {
        // console.log(delegate.username, block.height - roundStartHeight);
        if (block.height > roundStartHeight) {
          return 'forgedThisRound';
        }
        return 'forgedLastRound';
      }
      return '';
    }

    getDelegatesData() {
      const { data } = this.props.delegates;
      return data.map(delegate => ({
        ...delegate,
        status: this.getForgingStatus(delegate),
      }));
    }

    render() {
      return (
        <ChildComponent {...{
          ...this.props,
          delegates: {
            ...this.props.delegates,
            data: this.getDelegatesData(),
          },
        }}
        />
      );
    }
  }
  const mapStateToProps = ({ blocks: { latestBlocks }, network }) => ({
    latestBlocks,
    network,
  });

  const mapDispatchToProps = {
    olderBlocksRetrieved,
  };

  return connect(mapStateToProps, mapDispatchToProps)(DelegatesContainer);
};

export default withForgingStatus;
