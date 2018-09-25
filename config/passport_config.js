const User = require("../model/user").UserModel;
const LocalStrategy = require("passport-local").Strategy;
var bcrypt = require("bcryptjs");

module.exports = passport => {
  passport.use(
    "signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password"
      },
      (req, email, password, done) => {
        var passHash = passport => {
          bcrypt.hashSync(password, 10);
        };
        UserModel.findOne({
          where: {
            email
          }
        })
          .then(user => {
            if (!user) {
              UserModel.create({ email, password: passHash }).then(
                (newUser, err) => {
                  if (!newUser) {
                    return done(null, false);
                  }
                  if (newUSer) {
                    return done(newUser, null);
                  }
                }
              );
            } else {
              const ret = { error: "User already exists" };
              return done(null, info);
            }
          })
          .catch(err => {});
      }
    )
  ),
    passport.use(
      "login",
      new LocalStrategy(
        {
          usernameField: "email",
          passwordField: "password"
        },
        (req, email, password, done) => {
          User.findOne({
            where: {
              email
            }
          })
            .then(user => {
              if (!user) {
                if (!user) {
                  return done(null, { error: "User already exists" });
                }
              }
              if (bcrypt.compareSync(password, user.password)) {
                return done(null, { error: "Invalid password" });
              }

              return done(user, null);
            })
            .catch(err => {
              console.log("Error" + err);
              return false, null, { message: "Signin error" };
            });
        }
      )
    );
};
