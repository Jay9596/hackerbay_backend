const chai = require("chai");
const chaiHttp = require("chai-http");
var User = require("../model/user");
var app = require("../app");

chai.use(chaiHttp);

const should = chai.should();

beforeEach(() => {
  User.destroy({ where: {}, force: true });
});

describe("/user/signup", () => {
  it("Sign-up should return a token", done => {
    chai
      .request(app)
      .post("/users/signup")
      .send({ email: "abc@abc.com", password: "test_password1" })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("token");
        console.log(res.body);
      });
    done();
  });

  it("Should return error when user already exist", done => {
    let user_data = { email: "abc@abc.com", password: "test_password" };
    chai
      .request(app)
      .post("/users/signup")
      .send(user_data)
      .end((err, res) => {
        chai
          .request(app)
          .post("/users/signup")
          .send(user_data)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.have.property("error");
            res.body.console.error.should.equal("User already exists");
          });
      });
    done();
  });
});

describe("/users/login", () => {
  let user_data = { email: "abc@abc.com", password: "test_password" };
  it("Successful login", done => {
    chai
      .request(app)
      .post("/users/signup") // Create new user
      .send(user_data)
      .end((err, res) => {
        chai
          .request(app)
          .post("/users/login") // Login with user
          .send(user_data)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property("token");
          });
      });
    done();
  });

  it("Should give error User does not exist", done => {
    chai
      .request(app)
      .post("/users/login")
      .send(user_data)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property("error");
        res.body.error.should.equal("User does not exist");
      });
    done();
  });

  it("Should give error Invalid Password", done => {
    chai
      .request(app)
      .post("/users/signup") // Create new user
      .send(user_data)
      .end((err, res) => {
        chai
          .request(app)
          .post("/users/login") // Login with user
          .send({ email: "abc@abc.com", password: "password" })
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.have.property("error");
          });
      });
    done();
  });
});
