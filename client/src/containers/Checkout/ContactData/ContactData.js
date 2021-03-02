import React, { Component } from 'react';
import classes from './ContactData.module.css';
import Button from '../../../components/UI/Button/Button';
import firebase from '../../../firebase';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
//import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actionCreators from '../../../store/actions/index';

class ContactData extends Component {

  //console.log('[ContactData.js] props: ', props)

  state = {
    orderForm: {
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Name',
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      street: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Street',
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      zipCode: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'ZIP Code',
        },
        value: '',
        validation: {
          required: true,
          minLength: 5,
          maxLength: 5,
          isNumeric: true
        },
        valid: false,
        touched: false
      },
      country: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Country',
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Email',
        },
        value: '',
        validation: {
          required: true,
          isEmail: true
        },
        valid: false,
        touched: false
      },
      deliveryMethod: {
        elementType: 'select',
        elementConfig: {
          options: [
            {value: '', displayValue: ''},
            {value: 'fastest', displayValue: 'Fastest'},
            {value: 'cheapest', displayValue: 'Cheapest'}
          ],
          placeholder: 'Delivery Method'
        },
        value: 'cheapest',
        validation: {},
        valid: true
      }
    },
    formIsValid: false,
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
    //this.setState({loading: true});

    const formData ={};
    for (let formElementIdentifier in this.state.orderForm) {
      formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
    }

    let newOrder = {
      id: Math.round(Math.random() * 10000),
      ingredients: this.props.ings,
      totalPrice: Number.parseFloat(this.props.price).toFixed(2),
      orderData: formData,
      userId: this.props.userId

    };
    
    this.props.onOrderBurger(newOrder, this.props.token);
  }

  checkValidity(value, rules) {
    let isValid = true;
    if (!rules) {
        return true;
    }
    
    if (rules.required) {
        isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength) {
        isValid = value.length >= rules.minLength && isValid
    }

    if (rules.maxLength) {
        isValid = value.length <= rules.maxLength && isValid
    }

    if (rules.isEmail) {
        const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        isValid = pattern.test(value) && isValid
    }

    if (rules.isNumeric) {
        const pattern = /^\d+$/;
        isValid = pattern.test(value) && isValid
    }

    return isValid;
  }

  // inputIdentifier is the key that needs to be updated in the object in the state
  inputChangedHandler (event, inputIdentifier)  {
    //console.log(event.target.value, inputIdentifier);


    // Need to get a new copy of the orderForm object
    const updatedOrderForm = {
      ...this.state.orderForm
    }

    // Since orderForm has nested objects we also need to get a copy of the one we want to update
    const updatedFormElement = {
      ...updatedOrderForm[inputIdentifier]
    };

    // Update the cloned object with the data from the form and update the state
    updatedFormElement.value = event.target.value;
    updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
    updatedFormElement.touched = true;
    updatedOrderForm[inputIdentifier] = updatedFormElement;
    //console.log('[ContactData.js] inputChangedHandler',updatedFormElement);

    let formIsValid = true;
    for (let inputIdentifier in updatedOrderForm) {
      formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
    }

    this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid});
  }

  render() {

    let formElementsArray = [];

    for (let key in this.state.orderForm) {
      formElementsArray.push({
        id: key,
        config: this.state.orderForm[key]
      });
    }
    //console.log('[ContactData.js] formElementsArray', formElementsArray);

    let form = (
      <form onSubmit={this.orderHandler}>
        {formElementsArray.map(formElement => (
          <Input 
            key={formElement.id}
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            label={formElement.config.elementConfig.placeholder}
            invalid = {!formElement.config.valid}
            shouldValidate={formElement.config.validation}
            touched={formElement.config.touched}
            changed={(event) => this.inputChangedHandler(event,formElement.id)}
          />
        ))}
        <Button clicked={this.orderHandler} btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
      </form>
    )

    // needs to be updated
    if (this.props.loading) {
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

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onOrderBurger: (orderData, token) => dispatch(actionCreators.purchaseBurger(orderData, token))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, firebase));