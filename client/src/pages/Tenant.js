import React from 'react';
import axios from 'axios';
import { Navbar, NavbarBrand, NavbarNav, NavLinkItem, Container } from '../components/Bootstrap';
import Template from './Template';
import './page.css'
import Button from '../components/Bootstrap/Button';
declare var StripeCheckout;

class Tenant extends Template {
    constructor(props) {
        super(props)
        this.state = {
            message: '',
            ownedMaintRequest: ''
        };

        this.payRentWithCreditCard = this.payRentWithCreditCard.bind(this);
        this.submitMaintenanceRequest =this.submitMaintenanceRequest.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount = () => {
        axios.get('/api/getOwnMaintRequest', function(maintRequest) {
            this.setState({ownedMaintRequest: maintRequest});
        })
    }  
    
    payRentWithCreditCard = (ev) => {
        var checkoutHandler = StripeCheckout.configure({
            key: "pk_test_edJT25Bz1YVCJKIMvmBGCS5Y",
            locale: "auto"
        });
        
        checkoutHandler.open({
            name: "132 Chapel St. LLC",
            description: "Rent Payment",
            token: this.handleTokenCard
        });
    }

    handleTokenCard = (token) => {
        token.paymentIDs = [1, 2, 3];
        fetch("/api/submitPayment", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(token)
        })
        .then(output => {
          if (output.status === "succeeded") {
              console.log("successful payment");
          }
        })
        .catch(function (error) {
            console.log(error);
        });
      }

    getNavItems() {
        return [
                { path: '/tenant', text: 'Home' },
                { path: '/tenant', text: 'Pay Rent'},
                { path: '/tenant', text: 'Request Maintenance' },
        ];
    }


    handleChange(event) {
        this.setState({message: event.target.value});
    }
    
    submitMaintenanceRequest(event) {
        // alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
        
        axios.post('/api/postMaintRequest', {
            message: this.state.message
        }).then(function(resMaint) { 
            console.log("Post Maintenance Request works!");
        });
    }


    getContent() {
        return (
                    <div>
                        <h3>Rent</h3>
                        <p>
                            Your have rent due:
                        </p>
                        <p>
                            <span className='rent-amount'>$850</span> on <span className='rent-date'>April 1, 2019</span>
                        </p>
                        <Button
                        onClick={this.payRentWithCreditCard}
                        >
                        Pay Rent
                        </Button>
                        <h3>Maintenance Requests</h3>
                        <p>[request table here]</p>
                        <>
                        <form>
                            <label>
                                What is Wrong ?
                                <input type="text" value={this.state.message} onChange={this.handleChange} />
                            </label>                            
                           <Button onClick={this.submitMaintenanceRequest}>Request Maintenance</Button>
                        </form>
                    </div>
        );
    }
}

export default Tenant;