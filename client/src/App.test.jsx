import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';



describe('App', () => {
  test('canary verifies test infrastructure', () => {
     expect(true).toEqual(true);
  });

  test('renders without crashing', () => {
//    const app = <BrowserRouter><App/></BrowserRouter>;

    const div = document.createElement('div');
    ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
