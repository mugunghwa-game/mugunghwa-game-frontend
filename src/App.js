import { Route, Routes } from "react-router-dom";

import Countdown from "./components/Countdown";
import Ending from "./components/Ending";
import It from "./components/It";
import Main from "./components/Main";
import NotFound from "./components/NotFound";
import WaitingRoom from "./components/WaitingRoom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/waitingRoom" element={<WaitingRoom />} />
      <Route path="/countdown" element={<Countdown />} />
      <Route path="/game" element={<It />} />
      <Route path="/ending" element={<Ending />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
