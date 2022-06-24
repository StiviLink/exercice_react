const db = require("../models");
const Tache = db.taches;
// Create and Save a new Tache
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    // Create a Tache
    const tache = new Tache({
        name: req.body.name,
        description: req.body.description,
        statut: req.body.statut ? req.body.statut : false
    });
    // Save Tache in the database
    tache
        .save(tache)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Tache."
            });
        });
};
// Retrieve all Taches from the database.
exports.findAll = (req, res) => {
    const name = req.query.name;
    const condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};
    Tache.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving taches."
            });
        });
};
// Find a single Tache with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Tache.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found Tache with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Tache with id=" + id });
            throw err;
        });
};
// Update a Tache by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }
    const id = req.params.id;
    Tache.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Tache with id=${id}. Maybe Tache was not found!`
                });
            } else res.send({ message: "Tache was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Tache with id=" + id
            });
            throw err;
        });
};
// Delete a Tache with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Tache.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Tache with id=${id}. Maybe Tache was not found!`
                });
            } else {
                res.send({
                    message: "Tache was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Tache with id=" + id
            });
            throw err;
        });
};
// Delete all Taches from the database.
exports.deleteAll = (req, res) => {
    Tache.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} Taches were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all taches."
            });
        });
};
// Find all realised Taches
exports.findAllRealised = (req, res) => {
    Tache.find({ statut: true })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving taches."
            });
        });
};