import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import firebase from '../../firebase';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';



class BurgerBuilder extends Component {

  state = {
//    ingredients: null, //<-- now coming from Redux
//    totalPrice: 4,
//    purchasable: false,
    purchasing: false
  }

  componentDidMount() {

    //still need to dispatch an action here to init the ingredients
    this.props.onInitIngredients();
  }


  updatePurchasedState (ingredients) {

    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);

      return sum > 0

  }

  purchaseHandler = () => {
    console.log('[BurgerBuilder.js] purchasehandler')
    if (this.props.isAuthenticated) {
      this.setState({purchasing: true});
    } else {
      this.props.onSetAuthRedirectPath('/checkout');
      this.props.history.push('/auth');
    }
    
  }

  purchaseCancelHandler = () => {
    this.setState({purchasing: false});
  }


  purchaseContinueHandler = () => {
    console.log('[BurgerBuilder.js] purchaseContinueHandler');


    // let params = '?lettuce=' + this.state.ingredients.lettuce;
    // params += '&meat=' + this.state.ingredients.meat;
    // params += '&cheese=' + this.state.ingredients.cheese;
    // params += '&bacon=' + this.state.ingredients.bacon;

    const queryParams = [];
    for (let i in this.props.ingredients) {
      queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.props.ingredients[i]));
    }

    this.props.onInitPurchase();
    queryParams.push('price=' +  this.props.price);
    const queryString=queryParams.join('&');
    this.props.history.push({pathname: '/checkout', search: queryString});
    //this.setState({loading: true});

  }

  render() {

    const disabledInfo = {
      ...this.props.ings
    };

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0
    }

    let orderSummary = null;
    let burger = this.props.error ? <p>Error loading ingredients</p> : <Spinner />;

    if (this.props.ings) {
      burger = (
        <Aux>
          <Burger ingredients={this.props.ings}/>
          <BuildControls 
            ingredientAdded={this.props.onIngredientAdded}
            ingredientRemoved={this.props.onIngredientRemoved}
            disabled={disabledInfo}
            price={this.props.price}
            isAuthenticated={this.props.isAuthenticated}
            purchasable={this.updatePurchasedState(this.props.ings)}
            ordered={this.purchaseHandler}
          />
        </Aux>
  
      ); 
      
      orderSummary = (
        <OrderSummary 
          ingredients={this.props.ings}
          price={this.props.price}
          purchaseCancelled={this.purchaseCancelHandler} 
          purchaseContinued={this.purchaseContinueHandler}
        />
      );     
    }

    // if (this.state.loading) {
    //   orderSummary = <Spinner />;
      
    // }

    return (
      <Aux>
      
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}

      </Aux>

    );
  }
}

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuthenticated: state.auth.token !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
    onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
    onInitIngredients: () => dispatch(actions.initIngredients()),
    onInitPurchase: () => dispatch(actions.purchaseInit()),
    onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, firebase));