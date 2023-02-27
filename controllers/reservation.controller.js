const mongoose = require("mongoose");
const { Reservation } = require("../models/reservation.model");

module.exports.getAllReservations = async (req, res) => {
  let reservations = await Reservation.find({});
  return res.send(reservations);
};

module.exports.getReservation = async (req, res) => {
  let reservationId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(reservationId))
    return res.status(400).send("Invalid object id");
  let reservation = await Reservation.findById(reservationId);
  if (!reservation) return res.status(404).send("Reservation not found");
  return res.send(reservation);
};

module.exports.createReservation = async (req, res) => {
  let reservation = new Reservation({
    guestMemberId: req.body.guestMemberId,
    hotelName: req.body.hotelName,
    arrivalDate: req.body.arrivalDate,
    departureDate: req.body.departureDate,
    status: req.body.status,
    baseStayAmount: req.body.baseStayAmount,
    taxAmount: req.body.taxAmount        
  });
  await reservation.save();
  return res.send(reservation);
};

module.exports.updateReservation = async (req, res) => {
  let reservationId = req.params.id;
  Reservation.findOneAndUpdate(reservationId, req.body, { new: true })
    .then(reservation => {
      return res.send(reservation);
    })
    .catch(err => {
      return res.status(500).send(err);
    });
};

module.exports.deleteReservation = async (req, res) => {
  let reservationId = req.params.id;
  await Reservation.findByIdAndRemove(reservationId);
  return res.send("Reservation deleted");
};