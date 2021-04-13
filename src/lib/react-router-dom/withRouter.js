import React from 'react';
import Route from './Route';


const withRouter = (OldComponent) => (
  props => (
    <Route
      render={
        routeProps => <OldComponent {...routeProps} {...props} />
      }
    />
  )
);

export default withRouter;
