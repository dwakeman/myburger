import React, { Component } from 'react';
import Order from '../Orders/Order/Order';
import firebase from '../../firebase';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

class Orders extends Component {

  state = {
    orders: [],
    loading: true
  }

  componentDidMount() {
    firebase.get('/orders.json')
      .then(response => {
        console.log('[Orders.js] componentDidMount', response);
        let fetchedOrders = [];
        for (let key in response.data) {
          fetchedOrders.push({
            ...response.data[key],
            id: key
          });
        }

        this.setState({loading: false, orders: fetchedOrders});
      })
      .catch(error => {
        this.setState({loading: false, error: true});
        console.log('[Orders.js] componentDidMount Axios error', error);
      })
  }



  render() {


    return (
      <div>
        <h1 style={{textAlign: 'center'}}>Your Orders:</h1>
        {this.state.orders.map(order => (
          <Order key={order.id} order={order} />
        ))}
      </div>
    )
  }
}

export default withErrorHandler(Orders, firebase);