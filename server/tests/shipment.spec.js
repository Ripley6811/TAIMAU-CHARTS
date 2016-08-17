/* eslint-disable */

import mocha from 'mocha';
import app from '../server';
import chai from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import TestModel from '../models/tankerShipment.model';

const expect = chai.expect,
      endpointURL = `/api/shipment`,
      COLLECTION_NAME = TestModel.collection.name;


function connectDB(done) {
    if (mongoose.connection.name !== 'mern-test') {
        return done();
    }

    mongoose.connect((process.env.MONGO_URL || 'mongodb://localhost:27017/mern-test'), function (err) {
        if (err) return done(err);
        done();
    });
}


function dropCollection(done) {
    if (mongoose.connection.name !== 'mern-test') {
        return done();
    }

    mongoose.connection.db.dropCollection(COLLECTION_NAME, function (err) {
        return done();
    });
}


function dropDB(done) {
    if (mongoose.connection.name !== 'mern-test') {
        return done();
    }

    mongoose.connection.db.dropDatabase(function (err) {
        mongoose.connection.close(done);
    });
}




describe(`Testing "${endpointURL}" endpoint`, function () {
    
    this.timeout(12000);
    
    before('connect to test database', function (done) {
        connectDB(function () {
            done();
        });
    })
    
    after('drop database', function (done) {
        dropDB(done);
    });
    
    describe('Method: `GET`', function () {

        beforeEach('add two shipment entries', function (done) {
            var shipment1 = new TestModel({
                    date: new Date(2016, 7, 30),
                    amount: 100,
                    refPage: 5,
                    dept: "Puerto",
                    unit: "Rico",
                    product: 'Prashant',
                    pn: 'Hello Mern',
                    company: "All cats meow 'mern!'"
                }),
                shipment2 = new TestModel({
                    date: new Date(2016, 8, 1),
                    amount: 200,
                    refPage: 10,
                    dept: "Estados",
                    unit: "Unidos",
                    product: 'Mayank',
                    pn: 'Hi Mern',
                    company: "All dogs bark 'mern!'"
                });

            TestModel.create([shipment1, shipment2], function (err, saved) {
                if (err) console.log("ERR: ", err);
                done();
            });
        });

        afterEach(function (done) {
            dropCollection(done);
        });

        it('Should correctly give number of Shipments', function (done) {

            request(app)
            .get(endpointURL)
            .set('Accept', 'application/json')
            .end(function (err, res) {
                TestModel.find().exec(function (err, docs) {
                    expect(docs.length).to.be.above(0);
                    expect(docs.length).to.equal(res.body.length);
                    done();
                });
            });
        });
    });
    

    describe('Method: `POST`', function () {
        
        var shipment1 = {
                date: new Date(2016, 7, 30),
                amount: 100,
                refPage: 5,
                dept: "Puerto",
                unit: "Rico",
                product: 'Prashant',
                pn: 'Hello Mern',
                company: "All cats meow 'mern!'"
            },
            shipment2 = {
                date: new Date(2016, 8, 1),
                amount: 200,
                refPage: 10,
                dept: "Estados",
                unit: "Unidos",
                product: 'Mayank',
                pn: 'Hi Mern',
                company: "All dogs bark 'mern!'"
            };

        
        beforeEach('connect', function (done) {
            done();
        });

        
        afterEach(function (done) {
            dropCollection(done);
        });

        
        it('Should return the correct shipment', function (done) {

            request(app)
            .post(endpointURL)
            .send({shipments: [shipment1, shipment2]})
            .set('Accept', 'application/json')
            .end(function (err, res) {
                TestModel.findOne({ pn: shipment1.pn }).exec(function (err, doc) {
                    expect(doc.product).to.equal(shipment1.product);
                    done();
                });
            });
        });


        it('Should give a 403 error if shipment has missing fields', function (done) {

            request(app)
            .post(endpointURL)
            .send({shipments: [{}, shipment2]})
            .set('Accept', 'application/json')
            .end(function (err, res) {
                expect(res.status).to.equal(403);
                done();
            });
        });
    });
    

    describe('Method: `DELETE`', function () {
        
        var shipmentId;

        beforeEach('connect and add one Shipment entry', function(done){
            var shipment = new TestModel({
                date: new Date(2016, 8, 1),
                amount: 200,
                refPage: 10,
                product: 'Foo', 
                pn: 'bar', 
                unit: 'bar', 
                dept: 'f34gb2bh24b24b2', 
                company: 'Hello Mern says Foo' 
            });

            shipment.save(function (err, saved) {
                shipmentId = saved._id;
                done();
            });
        });

        afterEach(function (done) {
            dropCollection(done);
        });

        it('Should connect and delete a shipment', function (done) {

            // Check if shipment is saved in DB
            TestModel.findById(shipmentId).exec(function (err, shipment) {
                expect(shipment.product).to.equal('Foo')
            });

            request(app)
            .delete(endpointURL)
            .send({ _id: shipmentId})
            .set('Accept', 'application/json')
            .end(function (err, res) {
                expect(res.status).to.equal(204);
                // Check if shipment is removed from DB
                TestModel.findById(shipmentId).exec(function (err, shipment) {
                expect(shipment).to.equal(null);
                done();
                });
            });
        })
    });
});