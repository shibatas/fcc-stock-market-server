import React ,{Component} from 'react';
import ReactDOM from 'react-dom';
import { 
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import axios from 'axios';
import Header from './Header.js';
import Home from './Home.js';
import List from './List';
import "./style.css";

require('dotenv').load();

let apiUrl = window.location.origin + '/api';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      location: null,
    }
  }
  getData = (query) => {
    //first clear existing data
    this.setState({ data: [] });
    let term = 'term=' + query.term;
    let radius = 'radius=' + query.radius;
    let sort_by = 'sort_by=' + query.sort_by;
    let request = '/api/yelp?' + term + '&' + radius + '&' + sort_by;
    if (query.location) {
      let location = 'location=' + query.location;
      request += '&' + location + '&' + term;
    } else if (query.latitude) {
      let latitude = 'latitude=' + query.latitude;
      let longitude = 'longitude=' + query.longitude;
      request += '&' + latitude + '&' + longitude;
    } else {
      console.error('getData function error. Invalid query');
      return;
    }
    axios.get(request)
    .then(res => {
      console.log('yelp api success', res);
      this.handleResults(res.data);
    })
    .catch(err => {
      console.error('yelp api error', err);
    });
  }
  handleResults = (data) => {
    // send data to database
    data.forEach(item => {
      axios.post('api/bars', item)
      .then(res => {
        //console.log('api/bars success', res.data);
        this.setState({
          data: [...this.state.data, res.data]
        })
      })
      .catch(err => {
        console.error('api/bars error', err);
      })
    });
    this.setState({
      location: data[0].location.city
    })

  }
  addGoing = (id) => {
    let testUser = 'testUser';
    console.log('new user is going to:', id)
    let obj = {
      id: id,
      username: testUser
    }
    axios.post('/api/going', obj)
    .then(res => {
      console.log('/api/going success', res);
      // to do setState, use Object.assign to update only the clicked item
    })
    .catch(err => {
      console.error('api/going error', err);
    })
  }
  render() {
    return (
      <Router>
        <div>
          <Header />
          <Route exact path='/' render={(routeProps) => (
            <Home {...routeProps} 
              data={this.state.data}
              getData={this.getData} 
            />
          )} />
          <Route path='/list' render={(routeProps) => (
            <List {...routeProps} 
              data={this.state.data}
              location={this.state.location}
              handleGoing={this.addGoing}
            />
          )} />
        </div>
      </Router>
    );
  }

}

ReactDOM.render(<App />, document.getElementById('root'));
