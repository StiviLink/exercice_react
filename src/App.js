import React, { Component } from "react";
import {Routes, Route, Link, Navigate} from "react-router-dom";
import "./App.css";
import AddTache from "./components/add-tache.component";
import Tache from "./components/tache.component";
import TachesList from "./components/list-tache.component";
class App extends Component {
  render() {
    return (
        <div>
            <nav className="menu">
                <a href="/taches" className="menu-titre">
                    Gestion des taches
                </a>
                <div className="sous-menu">
                    <li>
                        <Link to={"/taches"} className="menu-item">
                            Taches
                        </Link>
                    </li>
                    <li>
                        <Link to={"/add"} className="menu-item">
                            Ajouter tâche
                        </Link>
                    </li>
                </div>
            </nav>
            <Routes>
                <Route path="*" element={<Navigate to="/taches" />} />
                <Route exact path= "/taches" element={<TachesList/>} />
                <Route exact path="/add" element={<AddTache/>} />
                <Route exact path="/taches/:id" element={<Tache/>} />
            </Routes>
        </div>
    );
  }
}
export default App;