/* eslint-disable */

import mocha from 'mocha';
import app from '../server';
import chai from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import TestModel from '../models/tankerTemplate.model';

const expect = chai.expect,
      endpointURL = `/api/tankerTemplate`,
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


function ensureIndexes(done) {
    if (mongoose.connection.name !== 'mern-test') {
        return done();
    }
    
    mongoose.connection.collections[COLLECTION_NAME].ensureIndex(
        {company:1, dept:1, unit:1, product:1}, 
        {unique:1},
        function () { 
            return done();
        }
    );
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

        beforeEach('add two template entries', function (done) {
            var template1 = new TestModel({
                    dept: "Estados",
                    unit: "Unidos",
                    product: 'Prashant',
                    pn: 'Hello Mern',
                    company: "All cats meow 'mern!'"
                }),
                template2 = new TestModel({
                    dept: "Estados",
                    unit: "Unidos",
                    product: 'Mayank',
                    pn: 'Hi Mern',
                    company: "All dogs bark 'mern!'"
                });

            TestModel.create([template1, template2], function (err, saved) {
                if (err) console.log("ERR: ", err);
                done();
            });
        });

        afterEach(function (done) {
            dropCollection(done);
        });

        it('Should correctly give number of Templates', function (done) {

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
        
        var template1 = {
                dept: "Estados",
                unit: "Unidos",
                product: 'Prashant',
                pn: 'Hello Mern',
                company: "All cats meow 'mern!'"
            },
            template2 = {
                dept: "Puerto",
                unit: "Rico",
                product: 'Mayank',
                pn: 'Hi Mern',
                company: "All dogs bark 'mern!'"
            };

        
        beforeEach('connect', function (done) {
            ensureIndexes(
                function () {
                    TestModel.create(template1, function (err, saved) {
                        if (err) console.log("ERR: ", err);
                        done();
                    });
                }
            );
        });

        
        afterEach(function (done) {
            dropCollection(done);
        });

        
        it('Should return the correct template', function (done) {

            request(app)
            .post(endpointURL)
            .send(template2)
            .set('Accept', 'application/json')
            .end(function (err, res) {
                TestModel.findOne({ pn: template2.pn }).exec(function (err, doc) {
                    expect(doc.product).to.equal(template2.product);
                    done();
                });
            });
        });


        it('Should give a 403 error if Template has missing fields', function (done) {

            request(app)
            .post(endpointURL)
            .send({})
            .set('Accept', 'application/json')
            .end(function (err, res) {
                expect(res.status).to.equal(403);
                done();
            });
        });


        it('Should give a 409 if template already exists', function (done) {

            request(app)
            .post(endpointURL)
            .send(template1)
            .set('Accept', 'application/json')
            .end(function (err, res) {
                expect(res.status).to.equal(409);
                done();
            });
        });
    });

    describe('Method: `DELETE`', function () {
        
        var templateId;

        beforeEach('connect and add one Template entry', function(done){
            var template = new TestModel({
                product: 'Foo', pn: 'bar', unit: 'bar', dept: 'f34gb2bh24b24b2', company: 'Hello Mern says Foo' 
            });

            template.save(function (err, saved) {
                templateId = saved._id;
                done();
            });
        });

        afterEach(function (done) {
            dropCollection(done);
        });

        it('Should connect and delete a template', function (done) {

            // Check if template is saved in DB
            TestModel.findById(templateId).exec(function (err, template) {
                expect(template.product).to.equal('Foo')
            });

            request(app)
            .delete(endpointURL)
            .send({ _id: templateId})
            .set('Accept', 'application/json')
            .end(function (err, res) {
                expect(res.status).to.equal(204);
                // Check if template is removed from DB
                TestModel.findById(templateId).exec(function (err, template) {
                expect(template).to.equal(null);
                done();
                });
            });
        })
    });
});