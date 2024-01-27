const FriendRequestManager = artifacts.require("FriendRequestManager");
const UserRelationshipManager = artifacts.require("UserRelationshipManager");

module.exports = function (deployer) {
  deployer.deploy(FriendRequestManager, UserRelationshipManager.address);
};
