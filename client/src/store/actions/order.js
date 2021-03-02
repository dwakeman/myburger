import * as actionTypes from './actionTypes';
import firebase from '../../firebase';

export const purchaseBurgerSuccess = (orderId, orderData) => {
  return {
    type: actionTypes.PURCHASE_BURGER_SUCCESS,
    orderId: orderId,
    orderData: orderData
  }
}

export const purchaseBurgerFail = (error) => {
  return {
    type: actionTypes.PURCHASE_BURGER_FAIL,
    error: error
  }
}

export const purchaseBurgerStart = () => {
  return {
    type: actionTypes.PURCHASE_BURGER_START
  };
};

export const purchaseBurger = (orderData, token) => {
  return dispatch => {
    dispatch(purchaseBurgerStart());
    firebase.post('/orders.json?auth=' + token,orderData) //baseURL is defined in index.js
    .then(response => {
      console.log('POST response from firebase to purchase burger', response);
      dispatch(purchaseBurgerSuccess(response.data.name, orderData))
    })
    .catch(error => {
      console.log('Error from POST to firebase to purchase burger...', error);
      dispatch(purchaseBurgerFail(error));
    });
  }
}

export const purchaseInit = () => {
  return {
    type: actionTypes.PURCHASE_INIT
  }
}

export const fetchOrdersSuccess = (orders) => {
  return {
    type: actionTypes.FETCH_ORDERS_SUCCESS,
    orders: orders
  }
}

export const fetchOrdersFail = (error) => {
  return {
    type: actionTypes.FETCH_ORDERS_FAIL,
    error: error
  }
}

export const fetchOrdersStart = () => {
  return {
    type: actionTypes.FETCH_ORDERS_START
  }
}

export const fetchOrders = (token, userId) => {

  console.log('[order.js] fetchOrders for user ' + userId, token);
  return dispatch => {
    dispatch(fetchOrdersStart());
    const queryParams = '?auth=' + token + '&orderBy="userId"&equalTo="' + userId + '"';
    firebase.get('/orders.json' + queryParams)
    .then(response => {
      console.log('[order.js] fetchOrders', response);
      let fetchedOrders = [];
      for (let key in response.data) {
        fetchedOrders.push({
          ...response.data[key],
          id: key
        });
      }
      dispatch(fetchOrdersSuccess(fetchedOrders));
    })
    .catch(error => {
      dispatch(fetchOrdersFail(error));
      console.log('[order.js] fetchOrders Axios error', error);
    })
  }



}