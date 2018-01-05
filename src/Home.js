import React, { Component } from 'react';
import axios from 'axios';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            term: 'bars',
            location: ''
        } 
    }
    handleChange = (e) => {
        this.setState({
            location: e.target.value
        });
    }
    submitForm = (e) => {
        e.preventDefault();
        this.props.getData(this.state);
        this.props.history.push('/list');
    }
    render() {
        return (
            <div className='main'>
                <h1>Where are you?</h1>
                <div>
                    <button className='get-location' disabled>Use my current location</button>
                </div>
                <form>
                    <input 
                        type='text' 
                        ref='location' 
                        placeholder='City name, address, or neighborhood'
                        onChange={this.handleChange}
                    />
                    <input type='submit' value='Search' onClick={this.submitForm} />
                </form>
            </div>
        );
    }
}

export default Home;