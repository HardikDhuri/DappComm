const UserRegistery = artifacts.require("UserRegistery");
const FriendRequestManager = artifacts.require("FriendRequestManager");
const MessagingSystem = artifacts.require("MessagingSystem");

module.exports = function(deployer) {
  deployer.deploy(UserRegistery);
  deployer.deploy(FriendRequestManager);
  deployer.deploy(MessagingSystem);
};
