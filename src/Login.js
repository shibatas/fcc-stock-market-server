import React, { Component } from 'react';

class Login extends Component {
    render() {
        return (
            <div className='login'>
                <p>Please login below:</p>
                <a className='btn btn-primary' onClick={this.props.loginFacebook} >Facebook</a>
            </div>
        );
    }
}

export default Login;