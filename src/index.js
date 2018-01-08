import React ,{Component} from 'react';
import ReactDOM from 'react-dom';
import { 
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Home from './Home';
import List from './List';
import Login from './Login';
import Footer from './Footer';
import "./style.css";

//require('dotenv').load();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      list: [],
      location: null,
      user: null
    }
  }
  componentDidMount() {
    this.getUser();
  }
  loginFacebook = () => {
    console.log('login facebook');
    window.location = '/auth/facebook';
    /*axios.get('/auth/facebook')
    .then(res => {
      console.log('facebook login success');
      this.getUser();
    })*/
  }
  logout = () => {
    axios.get('/auth/logout')
    .then(res => {
      console.log('logged out');
      this.getUser();
    })
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
      console.error('yelp api error', err);
    });
  }
  handleResults = (data) => {
    let list = [];
    // send data to database
    data.forEach(item => {
      list.push(item.id);
      axios.post('api/bars', item)
      .then(res => {
        console.log('api/bars success', res.data);
      })
      .catch(err => {
        console.error('api/bars error', err);
      })
    });
    this.setState({
      list: list,
      location: data[0].location.city
    })
  }
  getUser = () => {
    axios.get('/auth/user')
    .then(res => {
      if (res.data) {
        this.setState({
          user: {
            username: res.data.username,
            displayName: res.data.displayName,
            id: res.data.id
          }
        })
      } else {
        console.log('not logged in');
        this.setState({
          user: null
        })
      }
    })
  }
  render() {
    console.log('index render', this.state.user);
    return (
      <Router>
        <div>
          <Header user={this.state.user} logout={this.logout}/>
          <button onClick={this.getUser}>Get User</button>
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
              user={this.state.user}
            />
          )} />
          <Route path='/login' render={(routeProps) => (
            <Login {...routeProps}
              loginFacebook={this.loginFacebook}
            />
          )} />
          <Footer />
        </div>
      </Router>
    );
  }

}

ReactDOM.render(<App />, document.getElementById('root'));
