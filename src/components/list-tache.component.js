import React, { Component } from "react";
import TacheDataService from "../services/tache.service";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { deleteTache, addTache, modifyTache } from "../actions";

class TachesList extends Component {
    constructor(props) {
        super(props);
        this.onChangeSearchName = this.onChangeSearchName.bind(this);
        this.retrieveTaches = this.retrieveTaches.bind(this);
        this.refreshList = this.refreshList.bind(this);
        this.setActiveTache = this.setActiveTache.bind(this);
        this.removeAllTaches = this.removeAllTaches.bind(this);
        this.removeTache = this.removeTache.bind(this);
        this.searchName = this.searchName.bind(this);
        this.state = {
            currentTache: null,
            currentIndex: -1,
            searchName: ""
        };
    }
    componentDidMount() {
        this.retrieveTaches();
    }
    onChangeSearchName(e) {
        const searchName = e.target.value;
        this.setState({
            searchName: searchName
        });
    }
    changeStatut(tache, e){
        e.preventDefault();
        this.props.onModifyStatut(tache.id);
        this.setState({
            currentTache : tache
        })
        const data = {
            statut: !tache.statut
        };
        TacheDataService.update(tache.id, data)
            .then(response => {
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }
    retrieveTaches() {
        TacheDataService.getAll()
            .then(response => {
                this.props.taches.forEach(tache=>{
                    this.props.taches.onDelete(tache.id);
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
    refreshList() {
        this.retrieveTaches();
        this.setState({
            currentTache: null,
            currentIndex: -1
        });
    }
    setActiveTache(tache, index) {
        this.setState({
            currentTache: tache,
            currentIndex: index
        });
    }
    removeAllTaches() {
        TacheDataService.deleteAll()
            .then(response => {
                console.log(response.data);
                this.refreshList();
            })
            .catch(e => {
                console.log(e);
            });
    }
    removeTache(id, e) {
        e.preventDefault();
        this.props.onDelete(id);
        this.setState({
            currentTache: null,
            currentIndex: -1
        });
        TacheDataService.delete(id)
            .then(response => {
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }
    searchName() {
        TacheDataService.findByName(this.state.searchName)
            .then(response => {
                this.setState({
                    taches: response.data
                });
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }
    render() {
        const { searchName, currentTache, currentIndex } = this.state;
        return (
            <div className="container">
                <div className="box-search">
                        <input
                            type="text"
                            className="barre-search"
                            placeholder="Search by name"
                            value={searchName}
                            onChange={this.onChangeSearchName}
                        />
                    <div className="input-group-append">
                        <button
                            className="btn-search"
                            type="button"
                            onClick={this.searchName}
                        >
                            Search
                        </button>
                    </div>
                </div>
                <div className="box-taches">
                    <h2>liste des taches</h2>
                    <ul className="ul-tache">
                        {this.props.taches &&
                            this.props.taches.map((tache, index) => (
                                <li
                                    className={
                                        "box-taches-item " +
                                        (index === currentIndex ? "active" : "")
                                    }
                                    onClick={() => this.setActiveTache(tache, index)}
                                    key={index}
                                >
                                        {tache.name}
                                </li>
                            ))}
                    </ul>
                    <button
                        className="btn-remove-all"
                        onClick={this.removeAllTaches}
                    >
                        Remove All
                    </button>
                </div>
                <div className="box-current-tache">
                    {currentTache ? (
                        <div>
                            <h4>Tache {currentIndex+1}</h4>
                            <div>
                                <label>
                                    <strong>Nom:</strong>
                                </label>{" "}
                                {currentTache.name}
                            </div>
                            <div>
                                <label>
                                    <strong>Description:</strong>
                                </label>{" "}
                                {currentTache.description}
                            </div>
                            <div>
                                <label>
                                    <strong>Statut:</strong>
                                </label>{" "}
                                {currentTache.statut ? "Terminé" : "Non terminé"}
                            </div>
                            <div>
                                <label>
                                    <strong>Date d'ajout:</strong>
                                </label>{" "}
                                {currentTache.createdAt}
                            </div>
                            <Link
                                to={"/taches/" + currentTache.id}
                                className="current-tache-edit"
                            >
                                <strong>Modifier</strong>
                            </Link>
                            <a
                                href = "#"
                                onClick={(e) => this.removeTache(currentTache.id, e)}
                                className="current-tache-edit"
                            >
                                <strong>Remove</strong>
                            </a>
                            <a
                                href = "#"
                                onClick={(e) => this.changeStatut(currentTache, e)}
                                className="current-tache-edit"
                            >
                                <strong>{currentTache.statut ? "Reprendre" : "Terminer"}</strong>
                            </a>
                        </div>
                    ) : (
                        <div>
                            <p>Je vous prie de sélectionner une tâche...</p>
                        </div>
                    )}
                </div>
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
        },
        onDelete: id => {
            dispatch(deleteTache(id));
        },
        onModifyStatut: id => {
            dispatch(modifyTache(id))
        }
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TachesList);