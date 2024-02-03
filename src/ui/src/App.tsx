import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AddFriend from "./Components/AddFriend";
import Home from "./Components/Home";
import Notifications from "./Components/Notifications";
import SignIn from "./Components/SignIn";
import Chat from "./Components/Chat";
import { useEffect, useState } from "react";
import Web3 from "web3";
import { getUserProfile } from "./api";

function App() {
  // state to store and show the connected account
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [connetedAccount, setConnectedAccount] = useState("");

  // function to connect Metamask
  async function connectMetamask() {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);

      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        setConnectedAccount(accounts[0]);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      alert("Please download MetaMask");
    }
  }

  // useEffect to connect Metamask when the component mounts
  useEffect(() => {
    connectMetamask();
    const fetchUserProfile = async () => {
      try {
        const data = await getUserProfile(connetedAccount);
        setCurrentUser(data.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [connetedAccount]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home user={currentUser} />}>
          <Route
            path="/addfriend"
            element={<AddFriend address={connetedAccount} />}
          />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/chat" element={<Chat selectedFriend={null} />} />
        </Route>
        <Route
          path="/signin"
          element={
            <SignIn
              user={currentUser}
              address={connetedAccount}
              setUser={setCurrentUser}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
