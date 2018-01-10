import React, { Component } from 'react';
import axios from 'axios';
import getCookie from './getCookie';

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: null
        } 
    }
    componentWillReceiveProps(nextProps) {
        console.log('will receive props', nextProps);
        if (nextProps.redirect === '/') {
            this.props.history.push('/');
        }
        this.setState({
            list: nextProps.list,
            location: nextProps.location
        })
    }
    componentDidMount() {
        if (this.props.search) {
            console.log('list update by search results');
            this.props.getData();
        } else {
            console.log('no query. list update by cookie');
            this.props.setByCookie();
        }
    }
    handleClick = (e) => {
        //console.log('click', e.target.id);
        switch (e.target.id) {
            case 'goHome':
                document.cookie = 'list=;';
                document.cookie = 'location=;';
                this.props.history.push('/');
                break;
            case 'getCookie':
                let cookie = getCookie('list');
                console.log('cookie: ', cookie);
                if (cookie) {
                    console.log('set list by cookie');
                    this.setState({
                        list: cookie
                    })
                }
                break;
            default:
        }
        
        if (e.target.id === 'goHome') {
            this.props.history.push('/');
        } else if (e.target.id === 'getCookie') {
        }
    }
    render() {
        console.log('List render', this.state.list);
        if (this.state.list) {
            return (
                <div className='list'>
                    <h1>Bars in {this.props.location}</h1>
                    <div className='list-container'>
                        {this.state.list.map(item => {
                            return (
                            <Card 
                                key={item} 
                                id={item} 
                                user={this.props.user} 
                                history={this.props.history} />
                            );
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
            data: null,
            iAmGoing: false,
            btnText: "I'll be there!"
        }
    }
    componentDidMount() {
        this.updateCard();
    }
    updateCard = () => {
        const today = new Date();
        const todayString = today.toISOString().slice(0,10);
        //console.log('update card', this.props.id);
        axios.get('api/bars/'+this.props.id)
        .then(res => {
            //console.log(res);
            let data = Object.assign({}, res.data);
            let going = data.going.filter(item => {
                const timestampDate = item.timestamp.slice(0,10);
                //console.log(timestampDate, todayString);
                return timestampDate === todayString;
            })
            let iAmGoing = false;
            let btnText = "I'll be there!"
            going.forEach(item => {
                if (this.props.user && item.id === this.props.user.id) {
                    iAmGoing = true;
                    btnText = "I am going"
                }
            })
            data.going = going;
            this.setState({
                data: data,
                iAmGoing: iAmGoing,
                btnText: btnText
            })
        });
    }
    addGoing = (id) => {
        //console.log('new user is going to:', id)
        this.setState({
            iAmGoing: true
        });
        let obj = {
          barId: id,
          userId: this.props.user.id
        }
        axios.post('/api/going', obj)
        .then(res => {
          console.log('/api/going success', res);
          this.updateCard();
        })
        .catch(err => {
          console.error('api/going error', err);
        })
    }
    deleteGoing = (id) => {
        this.setState({
            iAmGoing: false
        });
        let obj = {
            barId: id,
            userId: this.props.user.id
        }
        axios.delete('/api/going', { data: obj })
        .then(res => {
            console.log('/api/going delete success', res);
            this.updateCard();
        })
            .catch(err => {
            console.error('api/going delete error', err);
        })
    }
    handleClick = (e) => {
        console.log('List.js click', this.props.user);
        if (!this.props.user) {
            this.props.history.push('/login');
        } else {
            if (this.state.iAmGoing) {
                this.deleteGoing(e.target.id);
            } else {
               this.addGoing(e.target.id);
            }
        }
    }
    render() {
        if (this.state.data) {
            return (
                <div className='list-card'>
                    <img className='card-image' src={this.state.data.image_url} alt={this.state.data.name}/>
                    <div className='card-name'><p>{this.state.data.name}</p></div>
                    <p>Going tonight: {this.state.data.going.length}</p>
                    <button className='btn btn-default' 
                        id={this.state.data.id} 
                        onClick={this.handleClick} 
                    >{this.state.btnText}</button>
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