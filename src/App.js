import { Route, Routes } from "react-router-dom";

import Countdown from "./components/Countdown";
import DistanceAdjustment from "./components/DistanceAdjustment";
import Ending from "./components/Ending";
import Game from "./components/Game";
import Main from "./components/Main";
import NotFound from "./components/NotFound";
import View from "./components/View";
import WaitingRoom from "./components/WaitingRoom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/waitingRoom" element={<WaitingRoom />} />
      <Route path="/prepare" element={<DistanceAdjustment />} />
      {/* <Route path="/prepare" element={<View />} /> */}

      <Route path="/countdown" element={<Countdown />} />
      <Route path="/game" element={<Game />} />
      <Route path="/ending" element={<Ending />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
