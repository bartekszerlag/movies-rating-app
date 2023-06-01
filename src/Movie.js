import React, { Component } from "react";
import Card from 'react-bootstrap/Card';
import MovieAlert from "./MovieAlert";

class Movie extends Component {

    constructor(props) {
        super(props);
        this.movieAlert = React.createRef()
        this.state = {
            movie: {
                title: 'Title',
                rating: 'Rating',
                votes: ''
            },
            searchPhrase: ''
        }
    }

    serverUri = 'https://movies-rating-service.herokuapp.com';

    handleSearch = event => {
        this.setState({ searchPhrase: event.target.value })
    }

    handleFetch = () => {
        this.fetchMovie(this.state.searchPhrase)
    }

    showAlert(variant, message) {
        this.movieAlert.current.setVariant(variant);
        this.movieAlert.current.setMessage(message);
        this.movieAlert.current.setVisible(true);
    }

    fetchMovie = searchPhrase => {
        fetch(`${this.serverUri}/rating/${searchPhrase}`)
            .then(res => res.json())
            .then(json => {
                this.setState({ searchPhrase: '' })
                if (json.status === undefined) {
                    this.setState({
                        movie: {
                            title: json.title.toUpperCase(),
                            rating: json.rating,
                            votes: json.votes
                        }
                    })
                } else if (json.status === 404) {
                    this.showAlert("danger", `Movie "${searchPhrase}" not found`);
                } else {
                    this.showAlert("danger", "Something went wrong");
                }
            })
    }

    render() {
        const { movie, searchPhrase } = this.state
        return (
            <div id='container'>
                <h1>&#x1F3AC; What is my rating ?</h1>
                <Card id='card'>
                    <Card.Body>
                        <Card.Title id='cardTitle'>{movie.title}</Card.Title>
                        <Card.Subtitle id='cardSubtitle'>{`${movie.rating} (votes ${movie.votes})`}</Card.Subtitle>
                    </Card.Body>
                </Card>
                <input id='input' onChange={this.handleSearch} type='text' placeholder='movie/series title' value={searchPhrase}/>
                <button id='search' onClick={this.handleFetch} disabled={!searchPhrase}>Search</button>
                <MovieAlert id='alert' ref={this.movieAlert}/>
            </div>
        )
    }
}

export default Movie;