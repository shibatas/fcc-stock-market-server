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
    render() {
        console.log('List render', this.state.data);
        if (this.state.data) {
            return (
                <div className='main'>
                    <h1>Search Results</h1>
                    <div className='list-container'>
                        {this.state.data.map(item => {
                            return <Card key ={item.id} info={item} />;
                        })}
                    </div>
                </div>
            );
        } else {
            return (
                <div className='main'>
                    <p>Loading...</p>
                </div>
            )
        }
    }
}

class Card extends Component {
    render() {
        return (
            <div className='list-card'>
                <p>{this.props.info.name}</p>
            </div>    
        )
    }
}

export default List;