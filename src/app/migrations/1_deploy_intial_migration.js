const UserRegistery = artifacts.require("UserRegistery");
const FriendRequestManager = artifacts.require("FriendRequestManager");
const MessagingSystem = artifacts.require("MessagingSystem");
const UserRelationshipManager = artifacts.require("UserRelationshipManager");

module.exports = function (deployer) {
  deployer.deploy(UserRegistery);
  deployer.deploy(FriendRequestManager, UserRelationshipManager);
  deployer.deploy(MessagingSystem);
  deployer.deploy(UserRelationshipManager, UserRegistery);
};
