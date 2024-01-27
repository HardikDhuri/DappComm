const UserRegistery = artifacts.require("UserRegistery");
const UserRelationshipManager = artifacts.require("UserRelationshipManager");

module.exports = function (deployer) {
  deployer.deploy(UserRelationshipManager, UserRegistery.address);
};
