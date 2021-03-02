import * as actionTypes from '../actions/actionTypes';
import firebase from '../../firebase';

export const addIngredient = (name) => {

  return {
    type: actionTypes.ADD_INGREDIENT,
    ingredientName: name
  }
}

export const removeIngredient = (name) => {

  return {
    type: actionTypes.REMOVE_INGREDIENT,
    ingredientName: name
  }
}

// This is an internal function to dispatch action to set ingredients in redux
export const setIngredients = (ingredients) => {
  return {
    type: actionTypes.SET_INGREDIENTS,
    ingredients: ingredients
  }
}

export const fetchIngredientsFailed = (error) => {
  return {
    type: actionTypes.FETCH_INGREDIENTS_FAILED,
    error: error
  }
}

/*
    This returns a function that I think will get intercepted by Thunk.  It passes the function
    the dispatch function as an argument that we call when done with the async stuff.  We use it
    to dispatch a new action to synchronously update redux via the reducer.
*/
 export const initIngredients = () => {
  return dispatch => {
    //https://react-my-burger-a1b25-default-rtdb.firebaseio.com/ingredients.json
    firebase.get('/ingredients.json')
      .then(response => {
        console.log('[burgerBuilder.js] initIngredients', response);
        //this.setState({ingredients: response.data});
        dispatch(setIngredients(response.data))
      })
      .catch(error => {
        //this.setState({error: true});
        //dispatch an action to update the error in redux
        dispatch(fetchIngredientsFailed(error));
        console.log('[burgerBuilder.js] initIngredients Axios error', error);
      })
  };
}

