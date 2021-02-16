import React from 'react';
import NavigationItem from '../NavigationItems/NavigationItem/NavigationItem';
import classes from './NavigationItems.module.css'

const navigationItems = () => (
  <ul className={classes.NavigationItems}>
    <NavigationItem linkUrl="/" active>Burger Builder</NavigationItem>
    <NavigationItem linkUrl="/">Checkout</NavigationItem>
  </ul>
);

export default navigationItems;