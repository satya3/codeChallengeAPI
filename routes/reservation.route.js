const express = require("express");
const router = express.Router();
const controller = require("../controllers/reservation.controller");

router
  .route("/")
  .get(controller.getAllReservations)
  .post(controller.createReservation);
router
  .route("/:id")
  .get(controller.getReservation)
  .put(controller.updateReservation)
  .delete(controller.deleteReservation);

module.exports = router;