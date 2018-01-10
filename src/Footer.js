import React, { Component } from 'react';

class Footer extends Component {
    render() {
        return (
            <div className='footer'>
                <div className='footer-container'>
                    <div className='footer-item'>This app uses <a href='https://www.yelp.com/fusion' target='_blank' rel='noopener noreferrer'>Yelp Fusion API</a></div>
                    <div className='footer-item'>Shohei Shibata 2017 ©</div>
                    <div>
                        <a href='https://shoheishibata.com/portfolio/' target='_blank' rel='noopener noreferrer' ><i className='fa fa-home fa-2x'/></a>
                        <a href='https://github.com/shibatas' target='_blank' rel='noopener noreferrer' ><i className='fa fa-github fa-2x'/></a>
                    </div>
                </div>
            </div>
        );
    }
}

export default Footer;