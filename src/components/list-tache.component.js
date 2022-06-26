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
            currentIndex: -1
        };
    }
    componentDidMount() {
        this.retrieveTaches();
    }
    retrievePropsTaches(response){
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
    }
    onChangeSearchName(e) {
        const searchName = e.target.value;
        TacheDataService.findByName(searchName)
            .then(response => {
                this.retrievePropsTaches(response);
                this.setState({
                    currentTache: null,
                    currentIndex: -1
                });
            })
            .catch(e => {
                console.log(e);
            });
    }
    changeStatut(tache, e){
        console.log(!tache.statut);
        e.preventDefault();
        this.props.onModifyStatut(tache.id);
        this.setState({
            currentTache : tache
        })
        const data = {
            statut: tache.statut
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
                this.retrievePropsTaches(response);
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
        if(this.state.currentTache !== tache){
            this.setState({
                currentTache: tache,
                currentIndex: index
            });
        }else {
            this.setState({
                currentTache: null,
                currentIndex: -1
            });
        }
    }
    removeAllTaches(e) {
        e.preventDefault();
        if(window.confirm("Vous allez supprimer toutes les taches")){
            this.props.taches.forEach(tache=>{
                this.props.onDelete(tache.id);
            })
            TacheDataService.deleteAll()
                .then(response => {
                    console.log(response.data);
                    this.refreshList();
                })
                .catch(e => {
                    console.log(e);
                });
        }
    }
    removeTache(id, e) {
        e.preventDefault();
        if(window.confirm("Vous allez supprimer cette tache")){
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
    }
    searchName() {
        console.log(this.props.taches);
    }
    formatDate(date){
        const jour = date.split('T')[0].split('-').reverse().join('/');
        const heure = date.split('T')[1].split('', 8).join('');
        return jour + " à " + heure;
    }
    render() {
        const { searchName, currentTache, currentIndex } = this.state;
        return (
            <div className="box-container">
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
                                onClick={this.searchName}
                                className="btn-search"
                                type="button"
                            >
                                Search
                            </button>
                        </div>
                    </div>
                    <div className="box-taches">
                        <h2>liste des taches</h2>
                        {this.props.taches.length===0 ? (<h2>Aucune tache disponible</h2>) :(
                            <div className = "box-taches-fils">
                                <ul className="ul-tache">
                                    <h3>En cours</h3>
                                    {this.props.taches &&
                                        this.props.taches.filter(tache => tache.statut===false).map((tache, index) => (
                                            <li
                                                className={
                                                    "box-taches-item " +
                                                    (tache === currentTache? "active" : "")
                                                }
                                                onClick={() => this.setActiveTache(tache, index)}
                                                key={index}
                                            >
                                                {tache.name}
                                            </li>
                                        ))}
                                </ul>
                                <ul className="ul-tache">
                                    <h3>Terminées</h3>
                                    {this.props.taches &&
                                        this.props.taches.filter(tache => tache.statut===true).map((tache, index) => (
                                            <li
                                                className={
                                                    "box-taches-item " +
                                                    (tache === currentTache ? "active" : "")
                                                }
                                                onClick={() => this.setActiveTache(tache, index)}
                                                key={index}
                                            >
                                                {tache.name}
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        )}
                        <button
                            className="btn-remove-all"
                            onClick={(e)=>this.removeAllTaches(e)}
                        >
                            Remove All
                        </button>
                    </div>
                </div>
                <div className="container-current-tache">
                    {currentTache ? (
                        <div className="box-current-tache">
                            <h4>Tache {currentIndex+1}</h4>
                            <div className="label-current-tache">
                                <label>
                                    <strong>Nom:</strong>
                                </label>{" "}
                                {currentTache.name}
                            </div>
                            <div className="label-current-tache">
                                <label>
                                    <strong>Description:</strong>
                                </label>{" "}
                                {currentTache.description}
                            </div>
                            <div className="label-current-tache">
                                <label>
                                    <strong>Statut:</strong>
                                </label>{" "}
                                {currentTache.statut ? "Terminé" : "Non terminé"}
                            </div>
                            <div className="label-current-tache">
                                <label>
                                    <strong>Date d'ajout:</strong>
                                </label>{" "}
                                {this.formatDate(currentTache.createdAt)}
                            </div>
                            <div className="label-current-tache">
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
                        </div>
                    ) : (
                        <div className="current-vide">
                            <h3>Je vous prie de sélectionner une tâche...</h3>
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
