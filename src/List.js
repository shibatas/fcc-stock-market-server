import React, { Component } from 'react';
import axios from 'axios';
import getCookie from './getCookie';
import Card from './Card';

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: null
        } 
    }
    componentWillReceiveProps(nextProps) {
        console.log('List will receive props', nextProps);
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



export default List;