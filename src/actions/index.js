import { ADD_TACHE, DELETE_TACHE, MODIFY_TACHE } from "./types";

export const addTache = ({id, name, description, statut, createdDate})=>({
    type : ADD_TACHE,
    tacheLoad : {
        id,
        name,
        description,
        statut,
        createdDate
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