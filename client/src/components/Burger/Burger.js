import React from 'react';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';
import classes from './Burger.module.css';


const burger = ( props ) => {

  console.log('[Burger.js] ingredients: ', props.ingredients);

  /*
      This code is a bit convoluted, so an explanation is necessary.
      Object.keys(props.ingredients) returns an array with a list of all of the keys in 
      the object.  In our case, the keys in the object are also the "type" of ingredient.

      We execute a map of that array to inspect each of the keys.  We will use the key value
      to reference the props.ingredients object.  That object has elements like "meat: 2".
      The value is the number of ingredients of that type that are on the burger.

      The Object.keys(props.ingredients).map function returns another array using the spread operator.
      [...Array(props.ingredients[igKey])] creates an array with as many elements as the value of the 
      key in the ingredients.  props.ingredients[igKey] gives you the value of the key, which in our case
      is the number of instances of that ingredient.
      
      So, for "cheese: 2" it will create an array with 2 elements.  This is 
      kind of goofy, but it does then allow you to do do another map function where we can return a
      <BurgerIngredient> object the right number of times.
  */
  
  // Note: I am not sure I would have represented the state this way, but since the instructor did I am using it.

  let transformedIngredients = Object.keys(props.ingredients)
    .map(
      (igKey => {
        console.log('Burger.js] igKey = ' + igKey,[...Array(props.ingredients[igKey])]);
        return [...Array(props.ingredients[igKey])].map((_, i) => {
          return <BurgerIngredient key={igKey + i} type={igKey} />
        })
      })
    )
    .reduce((arr, el) => {
      return arr.concat(el);
    },[]);

    console.log('[Burger.js] transformed ingredients:',transformedIngredients);

    if (transformedIngredients.length === 0 ) {
      transformedIngredients = <p>Please start adding ingredients!</p>
    } 

    return (
      <div className={classes.Burger}>
        <BurgerIngredient type='bread-top'/>
        {transformedIngredients}
        <BurgerIngredient type='bread-bottom'/>
      </div>
    );

    


}

export default burger;