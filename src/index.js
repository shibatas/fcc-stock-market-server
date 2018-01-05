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
      data: {}
    }
  }
  getData = (query) => {
    let location = 'location=' + query.location;
    let term = 'term=' + query.term;
    let request = '/api/restaurants?' + location + '&' + term;
    axios.get(request)
    .then(res => {
      console.log('api success', res.data);
      this.setState({
        data: res.data
      });
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
          <Route exact path='/' render={(routeProps) => (
            <Home {...routeProps} 
              data={this.state.data}
              getData={this.getData} 
            />
          )} />
          <Route path='/list' render={(routeProps) => (
            <List {...routeProps} 
              data={this.state.data}
              getData={this.getData} 
            />
          )} />
        </div>
      </Router>
    );
  }

}

ReactDOM.render(<App />, document.getElementById('root'));
