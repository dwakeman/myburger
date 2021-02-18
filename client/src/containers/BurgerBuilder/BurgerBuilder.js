import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import firebase from '../../firebase';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
  lettuce: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
};

class BurgerBuilder extends Component {

  state = {
    ingredients: null,
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    loading: false,
    error: false
  }

  componentDidMount() {

    //https://react-my-burger-a1b25-default-rtdb.firebaseio.com/ingredients.json
    firebase.get('/ingredients.json')
      .then(response => {
        console.log('[BurgerBuilder.js] componentDidMount', response);
        this.setState({ingredients: response.data});
      })
      .catch(error => {
        this.setState({error: true});
        console.log('[BurgerBuilder.js] componentDidMount Axios error', error);
      })

  }


  updatePurchasedState (ingredients) {

    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);

      this.setState({purchasable: sum > 0})

  }

  purchaseHandler = () => {
    console.log('[BurgerBuilder.js] purchasehandler')
    this.setState({purchasing: true});
  }

  addIngredientHandler = (type) => {
    // need to change the state for the ingredient.  Could be less or more.
    console.log('[BurgerBuilder.js] addIngredientHandler', type );
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updatedIngredients = {
      ...this.state.ingredients
    }

    updatedIngredients[type] = updatedCount;
    const oldPrice = this.state.totalPrice;
    const updatedPrice = oldPrice + INGREDIENT_PRICES[type];


    this.setState({
      ingredients: updatedIngredients,
      totalPrice: updatedPrice
    })
    this.updatePurchasedState(updatedIngredients);
  }

  removeIngredientHandler = (type) => {
    // need to change the state for the ingredient.  Could be less or more.
    console.log('[BurgerBuilder.js] addIngredientHandler', type );
    const oldCount = this.state.ingredients[type];
  
    if (oldCount > 0) {
      const updatedCount = oldCount - 1;

      // gets a new copy of the state, not a copy, since objects are by reference
      const updatedIngredients = {
        ...this.state.ingredients
      }
  
      updatedIngredients[type] = updatedCount;
      const oldPrice = this.state.totalPrice;
      const updatedPrice = oldPrice - INGREDIENT_PRICES[type];
  
  
      this.setState({
        ingredients: updatedIngredients,
        totalPrice: updatedPrice
      })
      this.updatePurchasedState(updatedIngredients);

    }
    

  }

  purchaseCancelHandler = () => {
    this.setState({purchasing: false});
  }


  purchaseContinueHandler = () => {
    console.log('[BurgerBuilder.js] purchaseContinueHandler');

    this.setState({loading: true});

    let newOrder = {
      id: Math.round(Math.random() * 10000),
      ingredients: this.state.ingredients,
      totalPrice: this.state.totalPrice,
      customer: {
        name: 'Dave Wakeman',
        address: {
          street: 'Mockingbird Lane',
          zipCode: 50323,
          state: 'IA'
        },
        email: 'dwakeman@us.ibm.com'
      },
      deliveryMethod: 'fastest'
    };

    firebase.post('/orders.json',newOrder) //baseURL is defined in index.js
    .then(response => {
      console.log('POST response from firebase', response);
      this.setState({loading: false, purchasing: false});
      //alert('Your order has been placed!');
    })
    .catch(error => {
      console.log('Error from POST to firebase...', error);
      this.setState({loading: false, purchasing: false});
//      this.setState({errorMsg: 'Error adding post: ' + error});
//          alert('The POST didn\`t work!!');
    });

  }

  render() {

    const disabledInfo = {
      ...this.state.ingredients
    };

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0
    }

    let orderSummary = null;



    let burger = this.state.error ? <p>Error loading ingredients</p> : <Spinner />;
    if (this.state.ingredients) {
      burger = (
        <Aux>
          <Burger ingredients={this.state.ingredients}/>
          <BuildControls 
            ingredientAdded={this.addIngredientHandler}
            ingredientRemoved={this.removeIngredientHandler}
            disabled={disabledInfo}
            price={this.state.totalPrice}
            purchasable={this.state.purchasable}
            ordered={this.purchaseHandler}
          />
        </Aux>
  
      ); 
      
      orderSummary = (
        <OrderSummary 
          ingredients={this.state.ingredients}
          price={this.state.totalPrice}
          purchaseCancelled={this.purchaseCancelHandler} 
          purchaseContinued={this.purchaseContinueHandler}
        />
      );     
    }

    if (this.state.loading) {
      orderSummary = <Spinner />;
      
    }


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

export default withErrorHandler(BurgerBuilder, firebase);