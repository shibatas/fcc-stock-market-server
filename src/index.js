import React ,{Component} from 'react';
import ReactDOM from 'react-dom';
import { 
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import axios from 'axios';
import getCookie from './getCookie';
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
      search: false,
      redirect: false,
      query: null,
      list: [],
      location: null,
      user: null
    }
  }
  componentDidMount() {
    this.getUser();
    this.updateByCookie();
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
  setQuery = (query) => {
    this.setState({
      search: true,
      query: query
    })
  }
  getData = () => {
    let query = this.state.query;
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
      console.error('getData function error. Invalid query');
      this.props.history.push('/');
      return;
    }
    //console.log('getData', request);
    axios.get(request)
    .then(res => {
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
        //console.log('api/bars success', res.data);
      })
      .catch(err => {
        console.error('api/bars error', err);
      })
    });
    document.cookie = 'list=' + list.toString();
    document.cookie = 'location=' + data[0].location.city;

    this.setState({
      search: false,
      query: null,
      list: list,
      redirect: '/list',
      location: data[0].location.city
    })
  }    
  updateByCookie = () => {
    let list = getCookie('list').split(',');
    if (list && list.length > 1) {
      console.log('set list by cookie', list);
      let location = getCookie('location');
      if (location && location.length > 0) {
        console.log('set location by cookie', location);
        this.setState({
            location: location,
            list: list,
            redirect: '/list'
        })
      }
    } else {
      console.log('no cookie info', this.state.list);
      this.setState({
        redirect: '/'
      })
    }
  } 
  getUser = () => {
    console.log('get user');
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
    console.log('index render', this.state.list);
    return (
      <Router>
        <div>
          <Header user={this.state.user} logout={this.logout}/>
          <Route exact path='/' render={(routeProps) => (
            <Home {...routeProps} 
              setQuery={this.setQuery} 
              redirect={this.state.redirect}
            />
          )} />
          <Route path='/list' render={(routeProps) => (
            <List {...routeProps} 
              list={this.state.list}
              location={this.state.location}
              redirect={this.state.redirect}
              user={this.state.user}
              search={this.state.search}
              getData={this.getData} 
              setByCookie={this.updateByCookie}
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
