import React from 'react';
import { Navbar, NavbarBrand, NavbarNav, NavLinkItem, Container } from '../components/Bootstrap';
import Template from './Template';
import './page.css'
import Button from '../components/Bootstrap/Button';
declare var StripeCheckout;


class Tenant extends Template {
    constructor(props) {
        super(props)
        this.state = {

        };

        this.payRentWithCreditCard = this.payRentWithCreditCard.bind(this);
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
      }

    getNavItems() {
        return [
                { path: '/tenant', text: 'Home' },
                { path: '/tenant', text: 'Pay Rent'},
                { path: '/tenant', text: 'Request Maintenance' },
        ];
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
                        <Button>Request Maintenance</Button>

                    </div>
        );
    }
}

export default Tenant;