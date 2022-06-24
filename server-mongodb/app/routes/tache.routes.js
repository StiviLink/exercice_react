module.exports = app => {
    const taches = require("../controllers/tache.controller.js");
    const router = require("express").Router();
    // Create a new Tache
    router.post("/", taches.create);
    // Retrieve all Taches
    router.get("/", taches.findAll);
    // Retrieve all realised Taches
    router.get("/published", taches.findAllRealised);
    // Retrieve a single tache with id
    router.get("/:id", taches.findOne);
    // Update a tache with id
    router.put("/:id", taches.update);
    // Delete a tache with id
    router.delete("/:id", taches.delete);
    // Create a new tache
    router.delete("/", taches.deleteAll);
    app.use('/api/taches', router);
};