const UserRegistery = artifacts.require("UserRegistery");
const MessagingSystem = artifacts.require("MessagingSystem");
const UserRelationshipManager = artifacts.require("UserRelationshipManager");

module.exports = function (deployer) {
  deployer.deploy(UserRegistery);
  deployer.deploy(MessagingSystem);
};
