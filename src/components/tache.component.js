import React, { Component } from "react";
import TacheDataService from "../services/tache.service";
import { connect } from "react-redux";
import { addTache } from "../actions";
// eslint-disable-next-line no-unused-vars
let deleted = false;
class Tache extends Component {
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
    getAllTaches(){
        TacheDataService.getAll()
            .then(response => {
                this.props.taches.forEach(tache=>{
                    this.props.onDelete(tache.id);
                })
                response.data.forEach(tache =>{
                    let result = !!this.props.taches.filter(taches => taches.id === tache.id);
                    if(result){
                        console.log(tache.id);
                        this.props.onAddTache({
                            id : tache.id,
                            name : tache.name,
                            description : tache.description,
                            statut : tache.statut,
                            createdAt : tache.createdAt
                        });
                    }
                });
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }
    componentDidMount() {
        const url = window.location.href;
        const id = url.split('http://localhost:4001/taches/')[1];
        this.getAllTaches();
        if(this.props.taches.filter(taches => taches.id === id).length===1){
            this.getTache(id);
        }else{
            window.location.assign('../');
        }
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
                    message: "Tache supprim??e"
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
                {deleted ? (
                    <div className="submit-form">
                        <h4>Tache deleted successfully!</h4>
                        <button className="btn-add" onClick={()=>window.location.assign("../")}>
                            Back
                        </button>
                    </div>
                ) : currentTache ? (
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
                        <p>Je vous prie de s??lectionner une t??che...</p>
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        taches: state
    };
};
const mapDispatchToProps = dispatch => {
    return {
        onAddTache: tache => {
            dispatch(addTache(tache));
        }
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Tache);