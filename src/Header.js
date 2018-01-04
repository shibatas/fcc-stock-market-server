import React, { Component } from 'react';
import axios from 'axios';

class Header extends Component {
    render() {
        return (
            <div className='header'>
                <div className='nav-title'>
                    <h1>Title</h1>
                </div>
                <div>
                    <ul className='nav-links'>
                        <li>Nav 1</li>
                        <li>Nav 2</li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default Header;