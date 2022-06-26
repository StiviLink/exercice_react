import { ADD_TACHE, DELETE_TACHE, MODIFY_TACHE } from "./types";

export const addTache = ({id, name, description, statut, createdAt})=>({
    type : ADD_TACHE,
    tacheLoad : {
        id,
        name,
        description,
        statut,
        createdAt
    }
});

export const deleteTache = id => ({
    type : DELETE_TACHE,
    tacheLoad : {
        id
    }
});

export const modifyTache = (id)=>({
    type : MODIFY_TACHE,
    tacheLoad : {
        id
    }
});