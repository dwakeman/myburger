import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from '../Checkout/ContactData/ContactData';

class Checkout extends Component {

  state = {
    ingredients: {},
    totalPrice: 0
  }

  componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);
    const ingredients = {};
    let price = 0;
    for (let param of query.entries()) {
      if (param[0] === 'price') {
        price = param[1];
      } else {
        ingredients[param[0]] = +param[1];
      }
      
    }
    this.setState({ingredients: ingredients, totalPrice: price });
    console.log('[Checkout.js] componentDidMount', this.props, ingredients)
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

    return (
      <div>
        <CheckoutSummary
          ingredients={this.state.ingredients} 
          checkoutCancelled={this.checkoutCancelledHandler}
          checkoutContinued={this.checkoutContinuedHandler}
        />
        <Route 
          path={this.props.match.path + "/contact-data"} 
          render={() => (<ContactData ingredients={this.state.ingredients} price={this.state.totalPrice} />)}  
          
        />
      </div>
    )
  }
}

export default Checkout;