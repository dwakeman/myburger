import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import burgerBuilderReducer from './store/reducers/burgerBuilder';
import orderReducer from './store/reducers/order';
import authReducer from './store/reducers/auth';


describe('App', () => {
  test('canary verifies test infrastructure', () => {
     expect(true).toEqual(true);
  });

  test('renders without crashing', () => {
//    const app = <BrowserRouter><App /></BrowserRouter>;

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const rootReducer = combineReducers({
      burgerBuilder: burgerBuilderReducer,
      order: orderReducer,
      auth: authReducer
    })

    const store = createStore(rootReducer, composeEnhancers(applyMiddleware(logger, thunk)));

    const div = document.createElement('div');
    ReactDOM.render(<Provider store={store}><BrowserRouter><App /></BrowserRouter></Provider>, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
