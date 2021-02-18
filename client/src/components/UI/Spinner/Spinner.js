import React from 'react';
import classes from './Spinner.module.css';

const spinner = (props) => {

  return (
    <div show={props.show} className={classes.Loader}>Loading...</div>
  )
}

export default spinner;