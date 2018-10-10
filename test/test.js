const chai = require("chai");
const chaiHttp = require("chai-http");
var User = require("../model/user");
var Website = require("../model/website");
var app = require("../app");

chai.use(chaiHttp);

const should = chai.should();

// beforeEach(() => {
//   User.destroy({ where: {}, force: true });
// });

describe("/user/signup", () => {
  it("Sign-up should return a token", done => {
    chai
      .request(app)
      .post("/users/signup")
      .send({ email: "abc@abc.com", password: "test_password1" })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("token");
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

const userInfo = {
  email: "abc@abc.com",
  password: "test_password1"
};

describe("/website/add", () => {
  const newSite = {
    name: "Google",
    url: "www.google.com"
  };

  it("Should give Unauthorized(401) status");

  it("Should successfully add a website", done => {
    chai
      .request(app)
      .post("/users/login")
      .send(userInfo)
      .end((err, res) => {
        chai
          .request(app)
          .post("/website/add")
          .set("authorization", "Bearer " + res.body.token)
          .send(newSite)
          .end((err, res) => {
            res.should.have.status(200);
          });
      });
    done();
  });
  it("Should give error, website already exist", done => {
    chai
      .request(app)
      .post("/users/login")
      .send(userInfo)
      .end((err, res) => {
        chai
          .request(app)
          .post("/website/add")
          .set("authorization", "Bearer " + res.body.token)
          .send({ name: "Name" })
          .end((err, res) => {
            res.should.have.status(400);
          });
      });
    done();
  });

  it("Should give error(400), bad request", done => {
    chai
      .request(app)
      .post("/users/login")
      .send(userInfo)
      .end((err, res) => {
        chai
          .request(app)
          .post("/website/add")
          .set("authorization", "Bearer " + res.body.token)
          .send({ name: "Name" })
          .end((err, res) => {
            res.should.have.status(400);
          });
      });
    done();
  });
});

describe("/website/list", () => {
  it("Should give Unauthorized(401) status");

  it("Fetch an empty list of website", done => {
    // Signup new user and fetch website list
    const newUser = { ...userInfo, email: "xyz@abc.com" };
    let token;
    chai
      .request(app)
      .post("/users/signup")
      .send(newUser)
      .end((err, res) => {
        chai
          .request(app)
          .get("/website/list")
          .set("authorization", "Bearer " + res.body.token)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.equal([]);
          });
      });

    done();
  });

  it("Get a list of website", done => {
    chai
      .request(app)
      .post("/users/signup")
      .send(userInfo)
      .end((err, res) => {
        chai
          .request(app)
          .get("/website/list")
          .set("authorization", "Bearer " + res.body.token)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.length.should.equal(1);
          });
      });

    done();
  });
});
