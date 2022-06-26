import { ADD_TACHE, DELETE_TACHE, MODIFY_TACHE } from "../actions/types";

export default function tachesReducer(state= [], action) {
    switch (action.type){
        case ADD_TACHE:
            return [...state, action.tacheLoad];
        case DELETE_TACHE:
            return state.filter(tache => tache.id !== action.tacheLoad.id);
        case MODIFY_TACHE:
            state.map(tache => tache.id === action.tacheLoad.id ? tache.statut = !tache.statut : tache.statut);
            return state;
        default:
            return state;
    }
}