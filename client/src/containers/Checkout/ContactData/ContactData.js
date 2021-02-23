import React, { Component } from 'react';
import classes from './ContactData.module.css';
import Button from '../../../components/UI/Button/Button';
import firebase from '../../../firebase';
import Spinner from '../../../components/UI/Spinner/Spinner';
import { withRouter } from 'react-router-dom';

class ContactData extends Component {

  //console.log('[ContactData.js] props: ', props)

  state = {
    name: '',
    email: '',
    address: {
      street: '',
      postalCode: ''
    },
    loading: false
  }

  componentDidMount() {

    console.log('[ContactData.js] componentDidMount', this.props)
  }

  orderHandler = (event) => {
    /*
        The event.preventDefault() method is important because in this case the button is part of 
        a form.  The default behavior of a button in a form is to reload the page and we don't want
        to do that here.  The preventDefault method prevents that from happening.
    */
    event.preventDefault();
    console.log('[ContactData.js] orderHandler', this.props);
    this.setState({loading: true});
    let newOrder = {
      id: Math.round(Math.random() * 10000),
      ingredients: this.props.ingredients,
      totalPrice: this.props.price,
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
      this.setState({loading: false});
      alert('Your order has been placed!');
      this.props.history.push('/');
    })
    .catch(error => {
      console.log('Error from POST to firebase...', error);
      this.setState({loading: false});
  //      this.setState({errorMsg: 'Error adding post: ' + error});
  //          alert('The POST didn\`t work!!');
    });
  }

  render() {

    let form = (
      <form>
        <input className={classes.Input} type="text" name="name" placeholder="Your Name" />
        <input className={classes.Input} type="email" name="email" placeholder="Your Email" />
        <input className={classes.Input} type="text" name="street" placeholder="Street" />
        <input className={classes.Input} type="text" name="postalCode" placeholder="Postal Code" />
        <Button clicked={this.orderHandler} btnType="Success">ORDER</Button>
      </form>
    )


    if (this.state.loading) {
      form=(<Spinner>Loading...</Spinner>)
    }

    return (
      <div className={classes.ContactData}>
        <h4>Enter your Contact Data</h4>
        {form}
      </div>
    )
  }

}

export default withRouter(ContactData);