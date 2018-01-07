import React, { Component } from 'react';

class Footer extends Component {
    render() {
        return (
            <div className='footer'>
                <div className='footer-container'>
                    <div className='footer-name'>Shohei Shibata 2017 ©</div>
                    <div>
                        <a href='https://shoheishibata.com/portfolio/' target='_blank' ><i className='fa fa-home fa-2x'/></a>
                        <a href='https://github.com/shibatas' target='_blank' ><i className='fa fa-github fa-2x'/></a>
                    </div>
                </div>
            </div>
        );
    }
}

export default Footer;