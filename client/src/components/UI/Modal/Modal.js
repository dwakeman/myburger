import React, {Component} from 'react'
import classes from './Modal.module.css';
import Aux from '../../../hoc/Aux/Aux';
import Backdrop from '../Backdrop/Backdrop';

class Modal extends Component {

  componentDidUpdate() {
    console.log('[Modal.js] componentDidUpdate');
  }
  /*
      Use of shouldComponentUpdate here in the Modal controls update of all
      children components as well.  In BurgerBuilder.js the OrderSummary is a
      child of the Modal; we only want to re-render the OrderSummary when the
      Modal is actually visible.  The code below checks for that.
  */
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.show !== this.props.show || nextProps.children !== this.props.children;
  }

  render() {

    return (
      <Aux>
        <Backdrop show={this.props.show} clicked={this.props.modalClosed}/>
        <div 
          className={classes.Modal}
          style={{
            transform: this.props.show ? 'translateY(0)' : 'translateY(-100vh)',
            opacity: this.props.show ? '1' : '0'
          }}
        >
          {this.props.children}
        </div>
      </Aux>
    )
  }
}





export default Modal;