import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AddFriend from "./Components/AddFriend";
import Home from "./Components/Home";
import Notifications from "./Components/Notifications";
import SignIn from "./Components/SignIn";
import Chat from "./Components/Chat";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="/addfriend" element={<AddFriend />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/chat" element={<Chat selectedFriend={null} />} />
        </Route>
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </Router>
  );
}

export default App;
