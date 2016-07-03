/* eslint-disable */

import mocha from 'mocha';
import app from '../server';
import chai from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import Template from '../models/shipmentTemplate';

const expect = chai.expect;

function connectDB(done) {
  if (mongoose.connection.name !== 'mern-test') {
    return done();
  }

  mongoose.connect((process.env.MONGO_URL || 'mongodb://localhost:27017/mern-test'), function (err) {
    if (err) return done(err);
    done();
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

describe('GET /api/shipmentTemplate', function () {

  beforeEach('connect and add two template entries', function (done) {

    connectDB(function () {
      var template1 = new Template({name: 'Prashant', pn: 'Hello Mern', company: "All cats meow 'mern!'"});
      var template2 = new Template({name: 'Mayank', pn: 'Hi Mern', company: "All dogs bark 'mern!'"});

      Template.create([template1, template2], function (err, saved) {
        done();
      });
    });
  });

  afterEach(function (done) {
    dropDB(done);
  });

  it('Should correctly give number of Templates', function (done) {

    request(app)
      .get('/api/shipmentTemplate')
      .set('Accept', 'application/json')
      .end(function (err, res) {
        Template.find().exec(function (err, templates) {
          expect(templates.length).to.equal(res.body.templates.length);
          done();
        });
      });
  });
});

//describe('GET /api/shipmentTemplate', function () {
//
//  beforeEach('connect and add one Template entry', function(done){
//
//    connectDB(function () {
//      var template = new Template({ name: 'Foo', pn: 'bar', unit: 'bar', dept: 'f34gb2bh24b24b2', company: 'Hello Mern says Foo' });
//
//      template.save(function (err, saved) {
//        done();
//      });
//    });
//  });
//
//  afterEach(function (done) {
//    dropDB(done);
//  });
//
//  it('Should send correct data when queried against a title', function (done) {
//
//    request(app)
//      .get('/api/getTemplate?slug=bar-f34gb2bh24b24b2')
//      .set('Accept', 'application/json')
//      .end(function (err, res) {
//        Template.findOne({ dept: 'f34gb2bh24b24b2' }).exec(function (err, template) {
//          expect(template.name).to.equal('Foo');
//          done();
//        });
//      });
//  });
//
//});

describe('POST /api/shipmentTemplate', function () {

  beforeEach('connect and add a template', function (done) {

    connectDB(function () {
      done();
    });
  });

  afterEach(function (done) {
    dropDB(done);
  });

  it('Should send correctly add a template', function (done) {

    request(app)
      .post('/api/shipmentTemplate')
      .send({ template: { product: 'Foo', pn: 'bar', company: 'Hello Mern says Foo', dept: 'AA', unit: 'BB' } })
      .set('Accept', 'application/json')
      .end(function (err, res) {
        Template.findOne({ pn: 'bar' }).exec(function (err, template) {
          expect(template.product).to.equal('Foo');
          done();
        });
      });
  });

});

describe('DELETE /api/shipmentTemplate', function () {
  var templateId;

  beforeEach('connect and add one Template entry', function(done){

    connectDB(function () {
      var template = new Template({ product: 'Foo', pn: 'bar', unit: 'bar', dept: 'f34gb2bh24b24b2', company: 'Hello Mern says Foo' });

      template.save(function (err, saved) {
        templateId = saved._id;
        done();
      });
    });
  });

  afterEach(function (done) {
    dropDB(done);
  });

  it('Should connect and delete a template', function (done) {

    // Check if template is saved in DB
    Template.findById(templateId).exec(function (err, template) {
      expect(template.product).to.equal('Foo')
    });

    request(app)
      .delete('/api/shipmentTemplate')
      .send({ templateId: templateId})
      .set('Accept', 'application/json')
      .end(function () {

        // Check if template is removed from DB
        Template.findById(templateId).exec(function (err, template) {
          expect(template).to.equal(null);
          done();
        });
      });
  })
});
