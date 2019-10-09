/* istanbul ignore file */
import { Redirect, withRouter } from 'react-router';
import React from 'react';
import routes from '../../../constants/routes';

const Monitor = () => (
  <Redirect to={routes.monitorTransactions.path} />
);

export default withRouter(Monitor);
