import React, {Component} from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Aux/Aux';

const withErrorHandler = (WrappedComponent, axios) => {
  return class extends Component {

    state = {
      error: null
    }

    constructor(props) {
      super(props);
      this.reqInterceptor = axios.interceptors.request.use(req => {
        this.setState({error: null});
        return req;
      });

      this.resInterceptor = axios.interceptors.response.use(res => res, error => {
        this.setState({error: error});
      });
    }


    componentWillUnmount() {
//      console.log('[withErrorHandler.js] componentWillUnmount',this.reqInterceptor, this.resInterceptor);
      axios.interceptors.request.eject(this.reqInterceptor);
      axios.interceptors.response.eject(this.resInterceptor);

    }

    errorConfirmedHandler = () => {
      this.setState({error: null});
    }

    errorClosedHandler = () => {
      this.setState({purchasing: false, error: null});
    }

    render() {
      return (
        <Aux>
        <Modal 
          show={this.state.error} 
          modalClosed={this.errorConfirmedHandler}
        >
          <p>{this.state.error ? this.state.error.message : null}</p>
        </Modal>
        <WrappedComponent {...this.props} />
      </Aux>
      );
    }

  } 
}

export default withErrorHandler