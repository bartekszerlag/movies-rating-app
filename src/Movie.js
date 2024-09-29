import React, { Component } from "react";
import { Card, Spinner, OverlayTrigger, Tooltip } from 'react-bootstrap';
import MovieAlert from "./MovieAlert";

class Movie extends Component {

    constructor(props) {
        super(props);
        this.movieAlert = React.createRef()
        this.state = {
            movie: {
                title: 'title',
                rating: 'rating',
                votes: 'votes'
            },
            isLoading: false,
            searchPhrase: ''
        }
    }

    serverUri = 'http://localhost:8080';

    showAlert(variant, message) {
        this.movieAlert.current.setVariant(variant);
        this.movieAlert.current.setMessage(message);
        this.movieAlert.current.setVisible(true);
    }

    handleSearch = event => {
        this.setState({ searchPhrase: event.target.value })
    }

    handleFetch = () => {
        this.setState({ isLoading: true })
        this.fetchMovie(this.state.searchPhrase)
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
                this.setState({ isLoading: false });
            })
    }

    render() {
        const { movie, searchPhrase, isLoading } = this.state
        return (
            <div id='container'>
                <h1>&#x1F3AC; what is my rating ?</h1>
                <Card id='card'>
                    <Card.Body>
                        {isLoading ? (
                            <Spinner animation="border" variant="secondary"/>
                        ) : (<>
                                 <OverlayTrigger
                                     placement="top"
                                     overlay={<Tooltip id="tooltip-title">title</Tooltip>}
                                 >
                                     <Card.Title id='title'>{movie.title}</Card.Title>
                                 </OverlayTrigger>
                                 <OverlayTrigger
                                     placement="top"
                                     overlay={<Tooltip id="tooltip-rating">rating</Tooltip>}
                                 >
                                     <Card.Subtitle id='rating'>{movie.rating}</Card.Subtitle>
                                 </OverlayTrigger>
                                 <OverlayTrigger
                                     placement="top"
                                     overlay={<Tooltip id="tooltip-votes">votes</Tooltip>}
                                 >
                                     <Card.Subtitle id='votes'>{movie.votes}</Card.Subtitle>
                                 </OverlayTrigger>
                             </>
                        )}
                    </Card.Body>
                </Card>
                <input id='input' onChange={this.handleSearch} type='text' placeholder='movie/series title'
                       value={searchPhrase}/>
                <button id='search' onClick={this.handleFetch} disabled={!searchPhrase}>search</button>
                <MovieAlert id='alert' ref={this.movieAlert}/>
            </div>
        )
    }
}

export default Movie;