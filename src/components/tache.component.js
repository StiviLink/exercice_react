import React, { Component } from "react";
import TacheDataService from "../services/tache.service";
// eslint-disable-next-line no-unused-vars
let deleted = false;
let del = false;
export default class Tache extends Component {
    constructor(props) {
        super(props);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.getTache = this.getTache.bind(this);
        this.updateStatut = this.updateStatut.bind(this);
        this.updateTache = this.updateTache.bind(this);
        this.deleteTache = this.deleteTache.bind(this);
        this.state = {
            currentTache: {
                id: null,
                name: "",
                description: "",
                statut: false
            },
            message: ""
        };
    }
    componentDidMount() {
        const url = window.location.href;
        const idDelete = url.split('http://localhost:4001/delete/')[1];
        const id = idDelete ? idDelete : url.split('http://localhost:4001/taches/')[1];
        this.getTache(id);
        if(idDelete===id)
            // eslint-disable-next-line react/no-direct-mutation-state
            del = true;
        /*if(idDelete){
            deleted=true;
            this.getTache(idDelete);
            this.deleteTache();
        }else {
            const id = url.split('http://localhost:4001/taches/');
        }*/
    }
    onChangeName(e) {
        const name = e.target.value;
        this.setState(function(prevState) {
            return {
                currentTache: {
                    ...prevState.currentTache,
                    name: name
                }
            };
        });
    }
    onChangeDescription(e) {
        const description = e.target.value;

        this.setState(prevState => ({
            currentTache: {
                ...prevState.currentTache,
                description: description
            }
        }));
    }
    getTache(id) {
        TacheDataService.get(id)
            .then(response => {
                this.setState({
                    currentTache: response.data
                });
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }
    updateStatut(status) {
        const data = {
            statut: status
        };
        TacheDataService.update(this.state.currentTache.id, data)
            .then(response => {
                this.setState(prevState => ({
                    currentTache: {
                        ...prevState.currentTache,
                        statut: status
                    }
                }));
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }
    updateTache() {
        TacheDataService.update(
            this.state.currentTache.id,
            this.state.currentTache
        )
            .then(response => {
                console.log(response.data);
                this.setState({
                    message: "The tache was updated successfully!"
                });
            })
            .catch(e => {
                console.log(e);
            });
    }
    deleteTache() {
        deleted = true;
        TacheDataService.delete(this.state.currentTache.id)
            .then(response => {
                console.log(response.data);
                this.setState(prevState => ({
                    currentTache: {
                        ...prevState.currentTache,
                        id: null,
                        name: "",
                        description: "",
                        statut: false
                    },
                    message: "Tache supprimée"
                }));
                this.props.history.push('/taches');
            })
            .catch(e => {
                console.log(e);
            });
    }
    render() {
        const { currentTache } = this.state;
        return (
            <div>
                {del ? (
                    <div className="submit-form">
                        {this.deleteTache}
                        <h4>Vous êtes sûre de vouloir supprimer cette tâche??!</h4>
                        <button className="btn-add" onClick={this.deleteTache}>
                            Remove
                        </button>
                    </div>
                ) :deleted ? (
                    <div className="submit-form">
                        <h4>You delete successfully!</h4>
                        <button className="btn-add" onClick={window.location.assign("../")}>
                            Back
                        </button>
                    </div>
                ) : currentTache && !del ? (
                    <div className="submit-form">
                        <form>
                            <div className="form-group">
                                <label htmlFor="name">Nom</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    value={currentTache.name}
                                    onChange={this.onChangeName}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="description"
                                    value={currentTache.description}
                                    onChange={this.onChangeDescription}
                                />
                            </div>
                        </form>
                        {currentTache.statut ? (
                            <button
                                className="btn-modify"
                                onClick={() => this.updateStatut(false)}
                            >
                                Reprendre
                            </button>
                        ) : (
                            <button
                                className="btn-modify"
                                onClick={() => this.updateStatut(true)}
                            >
                                Terminer
                            </button>
                        )}
                        <button
                            className="btn-modify"
                            onClick={this.deleteTache}
                        >
                            Supprimer
                        </button>
                        <button
                            type="submit"
                            className="btn-modify"
                            onClick={this.updateTache}
                        >
                            Update
                        </button>
                        <p>{this.state.message}</p>
                    </div>
                ) : (
                    <div>
                        <br />
                        <p>Je vous prie de sélectionner une tâche...</p>
                    </div>
                )}
            </div>
        );
    }
}