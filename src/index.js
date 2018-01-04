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
import "./style.css";

require('dotenv').load();

let apiUrl = window.location.origin + '/api';

class App extends Component {
  constructor(props) {
    super(props);
    const apiUrl = window.location.origin + '/api';
    const yelpApi = 'https://api.yelp.com/v3/businesses/search';
    const yelpHeader = {
      Authorization: 'Bearer rUtKAXMpc3ZQy1_OCU7d1_Ea__lMyZHEr0LjoGGCy02r-4J365VGqtxIyuwDDQfVh9E-3SfXSFXZBaV6W1SXr4PZWpy-78PwIcZ5IZXmedAf-iK4xbOq7DrMDwpOWnYx'
    };
    this.state = {
      yelp: {
        api: yelpApi,
        header: yelpHeader,
        query: {
          term: '',
          location: '',
          categories: 'restaurants'
        }
      }
    }
  }
  componentWillMount() {
    axios.get(this.state.yelp.api, this.state.yelp.header)
    .then(res => {
      console.log(res);
    });
  }
  render() {
    return (
      <Router>
        <div>
          <Header />
          <Route exact path='/' component={Home} />
        </div>
      </Router>
    );
  }

}

ReactDOM.render(<App />, document.getElementById('root'));
