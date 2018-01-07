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
import Footer from './Footer';
import "./style.css";

require('dotenv').load();

let apiUrl = window.location.origin + '/api';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      list: [],
      location: null,
    }
  }
  getData = (query) => {
    let term = 'term=' + query.term;
    let radius = 'radius=' + query.radius;
    let sort_by = 'sort_by=' + query.sort_by;
    let request = '/api/yelp?' + term + '&' + radius + '&' + sort_by;
    if (query.location) {
      let location = 'location=' + query.location;
      request += '&' + location;
    } else if (query.latitude) {
      let latitude = 'latitude=' + query.latitude;
      let longitude = 'longitude=' + query.longitude;
      request += '&' + latitude + '&' + longitude;
    } else {
      //console.error('getData function error. Invalid query');
      return;
    }
    //console.log('getData', request);
    axios.get(request)
    .then(res => {
      //console.log('yelp api success', res);
      this.setState({
        data: res.data
      })
      this.handleResults(res.data);
    })
    .catch(err => {
      //console.error('yelp api error', err);
    });
  }
  handleResults = (data) => {
    let list = [];
    // send data to database
    data.forEach(item => {
      list.push(item.id);
      axios.post('api/bars', item)
      .then(res => {
        //console.log('api/bars success', res.data);
      })
      .catch(err => {
        //console.error('api/bars error', err);
      })
    });
    this.setState({
      list: list,
      location: data[0].location.city
    })
  }
  render() {
    //console.log('index render', this.state);
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
              list={this.state.list}
              location={this.state.location}
            />
          )} />
          <Footer />
        </div>
      </Router>
    );
  }

}

ReactDOM.render(<App />, document.getElementById('root'));
