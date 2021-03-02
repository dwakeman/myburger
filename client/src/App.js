import React, { Component } from 'react';
import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Checkout from './containers/Checkout/Checkout';
import Orders from './containers/Orders/Orders';
import { Route, Switch, Redirect } from 'react-router-dom';
import Auth from './containers/Auth/Auth';
import Logout from './containers/Auth/Logout/Logout';
import { connect } from 'react-redux';
import * as actions from './store/actions/index';

class App extends Component {

  componentDidMount() {
    this.props.onTryAutoSignup();
    console.log('[App.js] componentDidMount', window.location);
    /*
        Note: the code below does work to retrieve data from an environment variable.  However, this is NOT
        a good idea for secret data like API Keys, as they aren't really retrieved at runtime from the environment.
        They are compiled into the static code at BUILD time, and will be visible in the code in the browser tools!

        So what's the best way for a React app to retrieve data that is stored in a kubernetes secret?  My next 
        attempt will be to add a new API call to the node.js app that serves up the react app to read the data from
        an environment variable that IS read from the kubernetes secret.  It can get the data from the variable and
        return it via the API call to the React app.  The React app will call the API here and store it...where?  The
        Redux state?  I think it is only needed for initial authentication, so perhaps it can be in the local state of
        the Auth.js container.
    */
    const firebaseApiKey = process.env.REACT_APP_FIREBASE_APIKEY;
    console.log('[App.js] componentDidMount REACT_APP_FIREBASE_APIKEY=' + firebaseApiKey);
    console.log('[App.js] componentDidMount and NODE_ENV=' + process.env.NODE_ENV);
  
  }
  render() {

    let routes = (
      <Switch>
        <Route path="/auth"  component={Auth} />
        <Route path="/" exact component={BurgerBuilder} />
        <Redirect to="/" />        
      </Switch>
    )

    if (this.props.isAuthenticated) {
      routes = (
        <Switch>
        <Route path="/orders"  component={Orders} />
        <Route path="/checkout"  component={Checkout} />
        <Route path="/logout"  component={Logout} />
        <Route path="/" exact component={BurgerBuilder} />
        <Redirect to="/" /> 
      </Switch>
      )
    }
    return (
      <div>
        <Layout>
          {routes}
        </Layout>

      </div>

    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !==  null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(App);
