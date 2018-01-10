/* global navigator */
import React, { Component } from 'react';
import getCookie from './getCookie';

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
    componentDidMount() {
        let referer = getCookie('referer');
        console.log('Home redirect to: ', referer);
        if (referer) {
            this.props.history.push(referer);
        }
        document.cookie = 'referer=;';
    }
    getLocation = () => {
        console.log('initiate get location');
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(data => {
                console.log('lat', data.coords.latitude, 'long', data.coords.longitude);
                this.props.setQuery({
                    term: this.state.term,
                    latitude: data.coords.latitude,
                    longitude: data.coords.longitude,
                    radius: this.state.radius,
                    sort_by: 'distance'
                });
                this.props.history.push('/list');
            }, err => { 
                console.error(err);
                this.props.history.push('/');
            }, { enableHighAccuracy: true });
        } else {
            console.log('no geolocation');
            document.getElementById('get-location').disabled =  true;
        }
    }
    handleChange = (e) => {
        let value = null;
        if (e.target.value !== '') {
            value = e.target.value;
        }
        this.setState({
            location: value
        });
    }
    submitForm = (e) => {
        e.preventDefault();
        //console.log('submitForm', this.state);
        if (this.state.location) {
            this.props.setQuery(this.state);
            this.props.history.push('/list');
        } else {
            console.log('submitted empty form');
        }
    }
    render() {
        return (
            <div className='home'>
                <h1>Where are you?</h1>
                <div className='geolocation'>
                    <button className='btn btn-default' id='get-location' onClick={this.getLocation} >Use my current location</button>
                </div>
                <form>
                    <input 
                        type='text' 
                        size='50'
                        placeholder='City name, address, or neighborhood'
                        onChange={this.handleChange}
                    />
                    <input className='btn btn-primary' type='submit' value='Search' onClick={this.submitForm} />
                </form>
            </div>
        );
    }
}

export default Home;