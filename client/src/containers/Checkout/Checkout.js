import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from '../Checkout/ContactData/ContactData';
import { connect } from 'react-redux';


class Checkout extends Component {

  // state = {
  //   ingredients: {},
  //   totalPrice: 0
  // }

  componentDidMount() {
    //this.props.onInitPurchase();  
    //console.log('[Checkout.js] componentDidMount', this.props, ingredients)
  }
  
  checkoutCancelledHandler = () => {
    console.log('[Checkout.js] checkoutCancelledHandler',this.props);
    this.props.history.goBack();
  }

  checkoutContinuedHandler = () => {
    console.log('[Checkout.js] checkoutContinuedHandler',this.props);
    this.props.history.replace({
      pathname: '/checkout/contact-data',
      //search: this.props.location.search
    });
  }

  render() {
    console.log('[Checkout.js] props: ', this.props);

    let summary = <Redirect to="/" />
    
    if (this.props.ings) {
      const purchasedRedirect = this.props.purchased ?  <Redirect to="/" /> : null;
      summary = (
        <div>
          {purchasedRedirect}
          <CheckoutSummary
            ingredients={this.props.ings} 
            checkoutCancelled={this.checkoutCancelledHandler}
            checkoutContinued={this.checkoutContinuedHandler}
          />
          <Route 
            path={this.props.match.path + "/contact-data"} 
            component={ContactData}  
          />               
        </div>

      )
    }

    return summary; 
 
  }
}

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    purchased: state.order.purchased
  }
}



export default connect(mapStateToProps)(Checkout);