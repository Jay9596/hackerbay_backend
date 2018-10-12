const chai = require("chai");
const chaiHttp = require("chai-http");
var User = require("../model/user");
var Website = require("../model/website");
var app = require("../app");

chai.use(chaiHttp);

const should = chai.should();

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
            res.body.error.should.equal("User already exists");
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
            res.body.should.have.property("id");
            res.body.should.have.property("name");
            res.body.should.have.property("url");
            res.body.should.have.property("userId");
            res.body.name.should.equal(newSite.name);
            res.body.url.should.equal(newSite.url);
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

  it("Should give error(400), already exist", done => {
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
            res.body.should.have.property("error");
            res.body.error.should.equal("No Name or URL provided");
          });
      });
    done();
  });

  it("Should give error(400), missing params", done => {
    chai
      .request(app)
      .post("/users/login")
      .send(userInfo)
      .end((err, res) => {
        chai
          .request(app)
          .post("/website/add")
          .set("authorization", "Bearer " + res.body.token)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.have.property("error");
            res.body.error.should.equal("No Name or URL provided");
          });
      });
    done();
  });

  it("Should give error(400), invalid URL", done => {
    let site = {
      name: "Default",
      url: "not.a.url"
    };
    chai
      .request(app)
      .post("/users/login")
      .send(userInfo)
      .end((err, res) => {
        chai
          .request(app)
          .post("/website/add")
          .set("authorization", "Bearer " + res.body.token)
          .send(site)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.have.property("error");
            res.body.error.should.equal("Invalid URL");
          });
      });
    done();
  });

  it("Should give Unauthorized(401) status", done => {
    chai
      .request(app)
      .post("/website/add")
      .send(newSite)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have.property("error");
        res.body.error.should.equal("Unauthorized");
      });
    done();
  });
});

describe("/website/list", () => {
  it("Fetch an empty list of website", done => {
    // Signup new user and fetch website list
    const newUser = { ...userInfo, email: "xyz@abc.com" };
    User.destroy({ where: { email: "xyz@abc.com" } });
    chai
      .request(app)
      .post("/users/signup")
      .send(newUser)
      .end((err, res) => {
        console.log("Body1: ", res.body);

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

  it("Should give Unauthorized(401) status", done => {
    chai
      .request(app)
      .get("/website/list")
      .end((err, res) => {
        res.body.should.have.property("error");
        res.body.error.should.equal("Unauthorized");
      });
    done();
  });
});

const clearDbs = () => {
  User.destroy({ where: {}, force: true });
  Website.destroy({ where: {}, force: true });
};
