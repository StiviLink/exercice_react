import React, { Component } from "react";
import TacheDataService from "../services/tache.service";

export default class AddTache extends Component {
    constructor(props) {
        super(props);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.saveTache = this.saveTache.bind(this);
        this.newTache = this.newTache.bind(this);
        this.state = {
            id: null,
            name: "",
            description: "",
            statut: false,
            submitted: false
        };
    }
    onChangeName(e) {
        this.setState({
            name: e.target.value
        });
    }
    onChangeDescription(e) {
        this.setState({
            description: e.target.value
        });
    }
    saveTache() {
        const data = {
            name: this.state.name,
            description: this.state.description
        };
        TacheDataService.create(data)
            .then(response => {
                this.setState({
                    id: response.data.id,
                    name: response.data.name,
                    description: response.data.description,
                    statut: response.data.statut,
                    submitted: true
                });
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }
    newTache() {
        this.setState({
            id: null,
            name: "",
            description: "",
            statut: false,
            submitted: false
        });
    }
    render() {
        return (
            <div className="submit-form">
                {this.state.submitted ? (
                    <div>
                        <h4>You submitted successfully!</h4>
                        <button className="btn-add" onClick={this.newTache}>
                            Add
                        </button>
                    </div>
                ) : (
                    <div>
                        <div className="form-group">
                            <label htmlFor="name">Nom</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                required
                                value={this.state.name}
                                onChange={this.onChangeName}
                                name="name"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <input
                                type="text"
                                className="form-control"
                                id="description"
                                required
                                value={this.state.description}
                                onChange={this.onChangeDescription}
                                name="description"
                            />
                        </div>
                        <button onClick={this.saveTache} className="btn-add">
                            Submit
                        </button>
                    </div>
                )}
            </div>
        );
    }
}