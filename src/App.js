import { Route, Routes } from "react-router-dom";

import EndingPage from "./components/EndingPage";
import ItPage from "./components/ItPage";
import Main from "./components/Main";
import Participant from "./components/Participant";
import WaitingRoom from "./components/WaitingRoom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/waitingRoom" element={<WaitingRoom />} />
      <Route path="/it" element={<ItPage />} />
      <Route path="/participant" element={<Participant />} />
      <Route path="/ending" element={<EndingPage />} />
    </Routes>
  );
}

export default App;
