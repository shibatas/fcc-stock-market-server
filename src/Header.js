import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class Header extends Component {
    handleClick = (e) => {
        console.log(e.target.id);
        if (e.target.id === 'title') {
            console.log('redirect back home');
            this.props.history.push('/');
        }
    }
    render() {
        return (
            <div className='header'>
                <div className='nav-title'>
                    <h1 id='title' onClick={this.handleClick}>Which Bar Tonight?</h1>
                </div>
                <Nav user={this.props.user} history={this.props.history} logout={this.props.logout}/>
            </div>
        );
    }
}

class Nav extends Component {
    login = () => {
        this.props.history.push('/login');
    }
    logout = () => {
        this.props.logout();
    }
    backToSearch = () => {
        document.cookie = 'list=;';
        document.cookie = 'location=;';
        this.props.history.push('/');
    }
    render() {
        if (this.props.user) {
            return (
                <div>
                    <ul className='nav-links'>
                        <li className='link' onClick={this.backToSearch}>🔎</li>
                        <li className='link' onClick={this.logout}>Logout</li>
                    </ul>
                </div>
            );
        } else {
            return (
                <div>
                    <ul className='nav-links'>
                        <li className='link' onClick={this.backToSearch}>🔎</li>
                        <li className='link' onClick={this.login}>Login</li>
                    </ul>
                </div>  
            )
        }
    }
}

export default withRouter(Header);