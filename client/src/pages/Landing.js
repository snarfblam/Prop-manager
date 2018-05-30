import React from 'react';
import Template from './Template';
import { Link } from 'react-router-dom';
import './page.css'

const styles = {

    boxstyle: {
      width: "80%",
      height: "300px",
      borderRadius: "21px 21px 0 0"
    }
  };

class Landing extends Template {
    constructor(props) {
        super(props)
        this.state = {

        };
    }

    getNavItems() {
        return [
            { path: '/', text: 'Information' },
            // { path: '/', text: 'Request an Account' },
        ];
    }

    getContent() {
        return (
            <div>
                {/* <ul>
                    <li><Link to='/'>Landing page</Link></li>
                    <li><Link to='/admin/overview'>Admin Overview</Link></li>
                    <li><Link to='/admin/units'>Admin Unit Details</Link></li>
                    <li><Link to='/admin/maint'>Admin Maintenance</Link></li>
                    <li><Link to='/admin/payments'>Admin Payments</Link></li>
                    <li><Link to='/admin/users'>Admin Users</Link></li>
                    <li><Link to='/tenant'>Tenant</Link></li>
                    <li><Link to='/tenant/activate'>Tenant Activate</Link></li>
                </ul> */}
                
                <div className="position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center bg-light">
                    <div className="col-md-5 p-lg-5 mx-auto my-5">
                        <h1 className="display-3 font-weight-normal">Welcome to 132 Chapel St.</h1>
                        <p className="lead font-weight-normal">Convient office spaces located in Downtown Portsmouth, NH</p>
                        <img id="homeicon" src={require("./images/homeimage.png")}></img>
                        <img id="cloud" src={require("./images/cloud.png")}></img>
                        
                        {/* <a className="btn btn-outline-secondary" href="#">View Avaliable Office Space</a> */}
                    </div>
                    {/* <div className="product-device box-shadow d-none d-md-block"></div> */}
                    {/* <div className="product-device product-device-2 box-shadow d-none d-md-block"></div> */}
                </div>

                <div className="d-md-flex flex-md-equal w-100 my-md-3 pl-md-3">
                    <div className="bg-dark mr-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center text-white overflow-hidden">
                        <div className="my-3 py-3">
                            <h2 className="display-5">Lightning Fast Internet</h2>
                            <p className="lead">Included in your rent payment</p>
                        </div>
                        <div className="bg-light box-shadow mx-auto" style={styles.boxstyle}>
                            <img id="fastinternet" src={require("./images/fastinternet.png")}></img>
                        </div>
                    </div>
                    <div className="bg-light mr-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center overflow-hidden">
                        <div className="my-3 p-3">
                            <h2 className="display-5">Downtown Community</h2>
                            <p className="lead">Located in Downtown Portsmouth, NH</p>
                        </div>
                        <div className="overridebackground bg-dark box-shadow mx-auto" style={styles.boxstyle}>
                            <img id="bow_street" src={require("./images/bow_street.jpg")}></img>
                        </div>
                    </div>
                </div>

                <div className="d-md-flex flex-md-equal w-100 my-md-3 pl-md-3">
                    <div className="bg-light mr-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center overflow-hidden">
                        <div className="my-3 p-3">
                            <h2 className="display-5">Flat Monthly Rent</h2>
                            <p className="lead">No utilites or internet to pay for.</p>
                        </div>
                        <div className="overridebackground bg-dark box-shadow mx-auto" style={styles.boxstyle}>
                        <img id="frontDoor" src={require("./images/FrontDoor.png")}></img>
                        </div>
                    </div>
                    <div className="bg-dark mr-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center text-white overflow-hidden">
                        <div className="my-3 py-3">
                            <h2 className="display-5">Pay Rent Online</h2>
                            <p className="lead">Convient Options for payment online.</p>
                        </div>
                        <div className="bg-light box-shadow mx-auto" style={styles.boxstyle}>
                            <img id="stripe" src={require("./images/stripe.png")}></img>
                        </div>
                    </div>
                </div>

                <footer className="container py-5">
                    <div className="row">
                        <div className="col-12 col-md">
                            <div className="col-6 col-md">
                                <h5>Website created by:</h5>
                                <ul className="list-unstyled text-small">
                                    <li><a className="text-muted" href="https://github.com/snarfblam">Tom Hudson</a></li>
                                    <li><a className="text-muted" href="https://www.linkedin.com/in/anthony-knight023/">Anthony Knight</a></li>
                                    <li><a className="text-muted" href="https://github.com/barbad63">Don Barbarits</a></li>
                                    <li><a className="text-muted" href="https://www.linkedin.com/in/clark-mcdermith/">Clark McDermith</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </footer>

            </div>
        );
    }
}

export default Landing;