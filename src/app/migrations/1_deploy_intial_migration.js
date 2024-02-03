const UserRegistery = artifacts.require("UserRegistery");
const MessagingSystem = artifacts.require("MessagingSystem");
const NotificationManager = artifacts.require("NotificationManager");

module.exports = function (deployer) {
  deployer.deploy(UserRegistery);
  deployer.deploy(MessagingSystem);
  deployer.deploy(NotificationManager);
};
