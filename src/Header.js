import React, { Component } from 'react';
import axios from 'axios';

class Header extends Component {
    render() {
        return (
            <div className='header'>
                <div className='nav-title'>
                    <h1>Which Bar Tonight?</h1>
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

export default Header;