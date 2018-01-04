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
    this.state = {
      yelp: {
        query: {
          term: '',
          location: '',
          categories: 'restaurants'
        }
      }
    }
  }
  componentWillMount() {
    axios.get('/api/restaurants')
    .then(res => {
      console.log('api success', res);
    })
    .catch(err => {
      console.error('api error', err);
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
