import { Route, Routes } from "react-router-dom";

import Countdown from "./components/Countdown";
import Ending from "./components/Ending";
import Main from "./components/Main";
import NotFound from "./components/NotFound";
import View from "./components/View";
import WaitingRoom from "./components/WaitingRoom";
import useStore from "./store/store";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/waitingRoom" element={<WaitingRoom />} />
      <Route path="/countdown" element={<Countdown />} />
      <Route path="/game" element={<View />} />
      <Route path="/ending" element={<Ending />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
