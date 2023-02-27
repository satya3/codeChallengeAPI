const expect = require("chai").expect;
const request = require("supertest");
const { Reservation } = require("../models/reservation.model");
const app = require("../app");
const mongoose = require('mongoose');
const config = require('../config');
const env = process.env.NODE_ENV || 'development';

let reservationId = '';

describe("api/reservations", () => {
  before(async () => {
    await Reservation.deleteMany({});
  });

  after(async () => {
    mongoose.disconnect();
  });

  it("should connect and disconnect to mongodb", async () => {
    // console.log(mongoose.connection.states);
    mongoose.disconnect();
    mongoose.connection.on('disconnected', () => {
      expect(mongoose.connection.readyState).to.equal(0);
    });
    mongoose.connection.on('connected', () => {
      expect(mongoose.connection.readyState).to.equal(1);
    });
    mongoose.connection.on('error', () => {
      expect(mongoose.connection.readyState).to.equal(99);
    });

    await mongoose.connect(config.db[env], config.dbParams);
  });

  describe("GET /", () => {
    it("should return all reservations", async () => {
      const reservations = [
        {
          guestMemberId: 123,
          hotelName: "testHotel",
          arrivalDate: new Date(),
          departureDate: new Date(new Date().getTime() + (5 * 24 * 60 * 60 * 1000)),
          status: "Active",
          baseStayAmount: 300,
          taxAmount
        },
        {
          guestMemberId: 223,
          hotelName: "testHotel",
          arrivalDate: new Date(),
          departureDate: new Date(new Date().getTime() + (5 * 24 * 60 * 60 * 1000)),
          status: "Active",
          baseStayAmount: 300,
          taxAmount
        }
      ];
      await Reservation.insertMany(reservations);
      const res = await request(app).get("/api/reservations");
      expect(res.status).to.equal(200);
      expect(res.body.length).to.equal(2);
    });
  });

  describe("GET/:id", () => {
    it("should return a reservation if valid id is passed", async () => {
      const reservation = new Reservation({        
          guestMemberId: 123,
          hotelName: "testHotel",
          arrivalDate: new Date(),
          departureDate: new Date(new Date().getTime()+(5*24*60*60*1000)),
          status: "Active",
          baseStayAmount: 300,
          taxAmount }
      );
      await reservation.save();
      const res = await request(app).get("/api/reservations/" + reservation._id);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("hotelName", reservation.hotelName);
    });

    it("should return 400 error when invalid object id is passed", async () => {
      const res = await request(app).get("/api/reservations/1");
      expect(res.status).to.equal(400);
    });

    it("should return 404 error when valid object id is passed but does not exist", async () => {
      const res = await request(app).get("/api/reservations/5f43ef20c1d4a133e4628181");
      expect(res.status).to.equal(404);
    });
  });

  describe("POST /", () => {
    it("should return reservation when the all request body is valid", async () => {
      const res = await request(app)
        .post("/api/reservations")
        .send({        
          guestMemberId: 123,
          hotelName: "testHotel",
          arrivalDate: new Date(),
          departureDate: new Date(new Date().getTime()+(5*24*60*60*1000)),
          status: "Active",
          baseStayAmount: 300,
          taxAmount });
      const data = res.body;
      expect(res.status).to.equal(200);
      expect(data).to.have.property("_id");
      expect(data).to.have.property("hotelName", "testHotel");
      expect(data).to.have.property("arrivalDate", new Date());
      expect(data).to.have.property("status", "Active");
      expect(data.hotelName).to.have.length.within(3, 50);
      expect(data.status).to.have.length.within(5, 255);

      const reservation = await Reservation.findOne({ hotelName: 'testHotel' });
      expect(reservation.status).to.equal('Active');
      expect(reservation.baseStayAmount).to.equal(300);
    });
  });

  describe("PUT /:id", () => {
    it("should update the existing reservation and return 200", async () => {
      const reservation = new Reservation({        
        guestMemberId: 123,
        hotelName: "testHotel",
        arrivalDate: new Date(),
        departureDate: new Date(new Date().getTime()+(5*24*60*60*1000)),
        status: "Active",
        baseStayAmount: 300,
        taxAmount });
      await reservation.save();

      const res = await request(app)
        .put("/api/reservations/" + reservation._id)
        .send({
          hotelName: "new hotel name",
          status: "cancelled",
          guestMemberId: 123,
          arrivalDate: new Date(),
          departureDate: new Date(new Date().getTime()+(5*24*60*60*1000)),
          baseStayAmount: 300,
          taxAmount
        });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("hotelName", "new hotel name");
      expect(res.body).to.have.property("status", "cancelled");
    });
  });

  describe("DELETE /:id", () => {
    it("should delete requested id and return response 200", async () => {
      const reservation = new Reservation({
        hotelName: "new hotel name",
        status: "cancelled",
        guestMemberId: 123,
        arrivalDate: new Date(),
        departureDate: new Date(new Date().getTime()+(5*24*60*60*1000)),
        baseStayAmount: 300,
        taxAmount
      });
      await reservation.save();
      reservationId = reservation._id;
      const res = await request(app).delete("/api/reservations/" + reservationId);
      expect(res.status).to.be.equal(200);
    });

    it("should return 404 when deleted reservation is requested", async () => {
      let res = await request(app).get("/api/reservations/" + reservationId);
      expect(res.status).to.be.equal(404);
    });
  });
});