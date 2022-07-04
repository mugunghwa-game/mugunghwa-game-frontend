import { useState } from "react";
import { Route, Routes } from "react-router-dom";

import Countdown from "./components/Countdown";
import Ending from "./components/Ending";
import It from "./components/It";
import Main from "./components/Main";
import NotFound from "./components/NotFound";
import Participant from "./components/Participant";
import WaitingRoom from "./components/WaitingRoom";
import { socket } from "./utils/socket";

function App() {
  const [role, setRole] = useState("");

  socket.on("userInfo", (data) => {
    if (data.it.includes(socket.id)) {
      setRole("it");
    }
    if (data.participant.includes(socket.id)) {
      setRole("participant");
    }
  });

  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/waitingRoom" element={<WaitingRoom />} />
      <Route path="/countdown" element={<Countdown />} />
      <Route path="/game" element={role === "it" ? <It /> : <Participant />} />
      <Route path="/ending" element={<Ending />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
