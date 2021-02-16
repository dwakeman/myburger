import classes from './BuildControls.module.css';
import React from 'react';
import BuildControl from '../BuildControls/BuildControl/BuildControl';

const controls = [
  {label: 'Salad', type: 'salad'},
  {label: 'Meat', type: 'meat'},
  {label: 'Cheese', type: 'cheese'},
  {label: 'Bacon', type: 'bacon'}
]

const buildControls = (props) => (
  <div className={classes.BuildControls}>
    <strong>
      <p>Current Price: {props.price.toFixed(2)}</p>
    </strong>
    {controls.map(ctrl => (
      <BuildControl key={ctrl.label} 
        label={ctrl.label} 
        type={ctrl.type}
        added={() => props.ingredientAdded(ctrl.type)}
        removed={() => props.ingredientRemoved(ctrl.type)}
        disabled={props.disabled[ctrl.type]}
      />
    ))}
    <button 
      className={classes.OrderButton} 
      disabled={!props.purchasable}
      onClick={props.ordered}
    >ORDER NOW</button>

  </div>

)



export default buildControls;