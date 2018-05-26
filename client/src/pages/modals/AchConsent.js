import React from 'react';
import Button from '../../components/Bootstrap/Button';
import { Input } from '../../components/Bootstrap';

/*
    amount: number - rent amount
    company: string - company name displayed in consent text
    onAgree: function()
*/

class AchConsent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            agree: false,
        };
    }

    render() {
        return (
            <div className='text-left'>
                <p><strong>Your rent will be paid from the bank account on file.</strong></p>
                <hr />
                <p>
                    I authorize
                    <span style={{textTransform: 'uppercase'}}>
                        {' '} {this.props.company || 'the property owner'} {' '}
                    </span>
                    to electronically
                    debit my account and, if necessary, electronically credit my account
                    to correct erroneous debits.
            </p>
                <p>
                    Total (USD): {!!this.props.amount.toFixed ? ('$' + this.props.amount.toFixed(2)) : "Not Specified"}
                </p>
                <Input label='I have read and agree to the terms' type='checkbox' name='agree' checked={this.state.agree} onChange={this.checkChanged} className='mx-auto' />
                <Button disabled={!this.state.agree} onClick={e => {if(this.props.onAgree) this.props.onAgree()}}>Submit Payment</Button>
            </div>
        );
    }

    checkChanged = (e) => this.setState({ [e.target.name]: e.target.checked });
}
// export default props => (
//     <div>
//         <h3>Authorize Payment</h3>
//         <p>Your rent will be paid from the bank account on file.</p>
//         <hr />
//         <p>
//             I authorize {props.company || 'the property owner'} to electronically 
//             debit my account and, if necessary, electronically credit my account 
//             to correct erroneous debits.
//         </p>
//         <p>
//             Total (USD): {props.amount.toFixed ? ('$' + props.amount.toFixed(2)) : "Not Specified"}
//         </p>
//         <Input label='I have read and agree to the terms' type='checkbox' name='agree' checked={this.state.agree} onChange={this.inputChanged} className='col-12 col-xl-6 mx-auto' />
//         <Button>Submit Payment</Button>
//     </div>
// );

export default AchConsent;