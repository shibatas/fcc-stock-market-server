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
                <div>
                    <ul className='nav-links'>
                        <li>...</li>
                        <li>...</li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default withRouter(Header);