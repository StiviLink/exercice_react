import http from "../http-common";
class TacheDataService {
    getAll() {
        return http.get("/taches");
    }
    get(id) {
        return http.get(`/taches/${id}`);
    }
    create(data) {
        return http.post("/taches", data);
    }
    update(id, data) {
        return http.put(`/taches/${id}`, data);
    }
    delete(id) {
        return http.delete(`/taches/${id}`);
    }
    deleteAll() {
        return http.delete(`/taches`);
    }
    findByName(name) {
        return http.get(`/taches?name=${name}`);
    }
}
export default new TacheDataService();