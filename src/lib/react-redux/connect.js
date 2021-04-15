/* eslint-disable import/no-named-as-default */
import React from 'react';
import RouteContext from './context';
import { bindActionCreators } from '../redux';


const connect = (mapStateToProps, mapDispatchToProps) => {
  return (OldComponent) => {
    return class extends React.Component {
      static contextType = RouteContext;

      constructor(props, context) {
        super(props);
        this.state = context.getState();
      }

      componentDidMount() {
        this.unsubscribe = this.context.subscribe(() => {
          this.setState(this.context.getState());
        });
      }

      componentWillUnmount() {
        this.unsubscribe();
      }

      render() {
        return (
          <OldComponent
            {...mapStateToProps(this.state)}
            {...bindActionCreators(mapDispatchToProps, this.context.dispatch)}
          />
        );
      }
    };
  };
};

export default connect;
