import React, { Component } from 'react';

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
    componentWillReceiveProps(nextProps) {
        if (nextProps.redirect === '/list') {
            console.log('received list. redirect to /list');
            this.props.history.push('/list');
        }
    }
    componentDidMount() {
        if (this.props.redirect === '/list') {
            console.log('list already exits. redirect to /list');
            this.props.history.push('/list');
        }
    }
    getLocation = () => {
        console.log('initiate get location');
        if (navigator.geolocation) {
            this.props.history.push('/list');
            navigator.geolocation.getCurrentPosition(data => {
                console.log('lat', data.coords.latitude, 'long', data.coords.longitude);
                this.props.setQuery({
                    term: this.state.term,
                    latitude: data.coords.latitude,
                    longitude: data.coords.longitude,
                    radius: this.state.radius,
                    sort_by: 'distance'
                });
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
        this.setState({
            location: e.target.value
        });
    }
    submitForm = (e) => {
        e.preventDefault();
        //console.log('submitForm', this.state);
        this.props.setQuery(this.state);
        this.props.history.push('/list');
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