import { Route, Routes } from "react-router-dom";

import Ending from "./components/Ending";
import GameRoom from "./components/GameRoom";
import Main from "./components/Main";
import NotFound from "./components/NotFound";
import { RoomList } from "./components/RoomList";
import WaitingRoom from "./components/WaitingRoom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/roomlist" element={<RoomList />} />
      <Route path="/waitingRoom/:roomId" element={<WaitingRoom />} />
      <Route path="/game/:roomId" element={<GameRoom />} />
      <Route path="/ending" element={<Ending />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
