const node_env = process.env.NODE_ENV;

if (node_env === "dev") {
  module.exports = {
    secret: require("./secret_dev"),
    postgre_config: require("./postgre_config_dev")
  };
}

if (node_env == "test") {
  module.exports = {
    secret: require("./secret_test").secretKey,
    postgre_config: require("./postgre_config_test")
  };
}
if (node_env == "prod") {
  module.exports = {
    secret: require("./secret_prod").secretKey,
    postgre_config: require("./postgre_config_prod")
  };
}
