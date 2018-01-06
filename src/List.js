import React, { Component } from 'react';
import axios from 'axios';

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null
        } 
    }
    componentWillReceiveProps(nextProps) {
        console.log('will receive props', nextProps);
        this.setState({
            data: nextProps.data
        })
    }
    handleClick = (e) => {
        console.log('click', e.target.id);
        if (e.target.id === 'goHome') {
            this.props.history.push('/');
        }
    }
    render() {
        console.log('List render', this.state.data);
        if (this.state.data) {
            return (
                <div className='main'>
                    <h1>Bars in {this.props.location}</h1>
                    <div className='list-container'>
                        {this.state.data.map(item => {
                            return <Card key ={item.id} info={item} handleGoing={this.props.handleGoing}/>;
                        })}
                    </div>
                    <button id='goHome' className='list-btn' onClick={this.handleClick} >Search Again</button>
                </div>
            );
        } else {
            return (
                <div className='main'>
                    <p>Loading...</p>
                    <button id='goHome' className='list-btn' onClick={this.handleClick} >Search Again</button>
                </div>
            )
        }
    }
}

class Card extends Component {
    handleClick = (e) => {
        this.props.handleGoing(e.target.id);
    }
    render() {
        return (
            <div className='list-card'>
                <img className='card-image' src={this.props.info.image_url}/>
                <p>{this.props.info.name}</p>
                <p>Going tonight: {this.props.info.going.length}</p>
                <button id={this.props.info.id} onClick={this.handleClick} >I'll be there!</button>
            </div>    
        )
    }
}

export default List;