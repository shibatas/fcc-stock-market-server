import React, { Component } from 'react';
import axios from 'axios';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            term: 'bars',
            location: null,
            radius: 1000,
            sort_by: 'distance'
        } 
    }
    getLocation = () => {
        if (navigator.geolocation) {
            this.props.history.push('/list');
            navigator.geolocation.getCurrentPosition(data => {
                console.log('lat', data.coords.latitude, 'long', data.coords.longitude);
                this.props.getData({
                    term: this.state.term,
                    latitude: data.coords.latitude,
                    longitude: data.coords.longitude,
                    radius: this.state.radius
                });
            });
        } else {
            document.getElementById('get-location').disabled =  true;
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
                    <button id='get-location' onClick={this.getLocation} >Use my current location</button>
                </div>
                <form>
                    <input 
                        type='text' 
                        size='50'
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