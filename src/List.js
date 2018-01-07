import React, { Component } from 'react';
import axios from 'axios';

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: null
        } 
    }
    componentWillReceiveProps(nextProps) {
        //console.log('will receive props', nextProps);
        this.setState({
            list: nextProps.list
        })
    }
    handleClick = (e) => {
        //console.log('click', e.target.id);
        if (e.target.id === 'goHome') {
            this.props.history.push('/');
        }
    }
    render() {
        //console.log('List render', this.state.list);
        if (this.state.list) {
            return (
                <div className='list'>
                    <h1>Bars in {this.props.location}</h1>
                    <div className='list-container'>
                        {this.state.list.map(item => {
                            return <Card key={item} id={item} />;
                        })}
                    </div>
                    <div className='link-btn'>
                        <button id='goHome' className='btn btn-primary' onClick={this.handleClick} >Search Again</button>
                    </div>
                </div>
            );
        } else {
            return (
                <div className='list-loading'>
                    <p>Loading...</p>
                    <div className='link-btn'>
                        <button id='goHome' className='btn btn-default' onClick={this.handleClick} >Go Back</button>
                    </div>
                </div>
            )
        }
    }
}

class Card extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null
        }
    }
    componentDidMount() {
        this.updateCard();
    }
    updateCard = () => {
        //console.log('update card', this.props.id);
        axios.get('api/bars/'+this.props.id)
        .then(res => {
            //console.log(res);
            this.setState({
                data: res.data
            })
        });
    }
    addGoing = (id) => {
        let testUser = 'testUser';
        //console.log('new user is going to:', id)
        let obj = {
          id: id,
          username: testUser
        }
        axios.post('/api/going', obj)
        .then(res => {
          //console.log('/api/going success', res);
          this.updateCard();
        })
        .catch(err => {
          //console.error('api/going error', err);
        })
      }
    handleClick = (e) => {
        this.addGoing(e.target.id);
    }
    render() {
        if (this.state.data) {
            return (
                <div className='list-card'>
                    <img className='card-image' src={this.state.data.image_url}/>
                    <div className='card-name'><p>{this.state.data.name}</p></div>
                    <p>Going tonight: {this.state.data.going.length}</p>
                    <button className='btn btn-default' id={this.state.data.id} onClick={this.handleClick} >I'll be there!</button>
                </div>    
            );
        } else {
            return (
                <div className='list-card'>
                    <p>loading...</p>
                </div>    
            );
        }
    }
}

export default List;