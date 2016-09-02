'use strict';

const Router = require('express').Router;
const Bear = require('./models/bear.js');

module.exports = Router() // eslint-disable-line new-cap
  .get('/bears', listBears)
  .post('/bears', addBear)
  .get('/bears/:bearId', showBear)
  .put('/bears/:bearId', updateBear)
  .delete('/bears/:bearId', deleteBear);

function listBears(_, res) {
  Bear.find().exec()
    .then(bears => res.json(bears))
    .catch(err => res.send(err));
}

function showBear(req, res) {
  Bear.findById(req.params.bearId).exec()
    .then(bear => res.json(bear))
    .catch(err => res.send(err));
}

function deleteBear(req, res) {
  Bear.remove({ _id: req.params.bearId }).exec()
    .then(() => res.json())
    .catch(err => res.send(err));
}

function updateBear(req, res) {
  let bearId = req.params.bearId;
  Bear.findByIdAndUpdate(bearId, req.body).exec()
    .then(() => Bear.findById(bearId))
    .then(bear => res.json(bear))
    .catch(err => res.send(err));
}

function addBear(req, res) {
  Bear.create(req.body)
    .then(bear => res.json(bear))
    .catch(err => res.send(err));
}
