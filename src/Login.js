import React, { Component } from 'react';

class Login extends Component {
    render() {
        return (
            <div className='login'>
                <div className='login-contents'>
                    <h3>Choose a login method:</h3>
                    <button className='btn btn-primary' onClick={this.props.loginFacebook} >Facebook</button>
                </div>
            </div>
        );
    }
}

export default Login;