import * as posenet from "@tensorflow-models/posenet";
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import Peer from "simple-peer";
import styled from "styled-components";

import { SOCKET } from "../constants/constants";
import useCamera from "../hooks/useCamera";
import useStore from "../store/store";
import { drawCanvas, videoReference } from "../utils/posenet";
import { socket, socketApi } from "../utils/socket";
import DefaultPage from "./DefaultPage";
import DistanceAdjustment from "./DistanceAdjustment";
import DescriptionContent from "./DscriptionContent";
import Event from "./Event";
import Game from "./Game";
import It from "./It";
import Video from "./Video";

function View() {
  const [itUser, setItUser] = useState(null);
  const [isItLoser, setIsItLoser] = useState(false);
  const [hasStop, setHasStop] = useState(false);
  const [countDownStart, setCountDownStart] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const userCanvas = useRef(null);
  let userInfo;
  const {
    addPreStartFirstParticipantPose,
    addPreStartSecondparticipantPose,
    addFirstParticipantPose,
    addSecondParticipantPose,
    fistParticipantPreparation,
    secondParticipantPreparation,
    participantList,
  } = useStore();
  const [hasTouchDownButton, setHasTouchDownButton] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [itCount, setItCount] = useState(5);
  const [participantUser, setParticipantUser] = useState(null);
  const [mode, setMode] = useState("prepare");
  const [anotherUser, setAnotherUser] = useState([]);
  const { peers, userVideo, stream, firstVideo } = useCamera();
  console.log("im view");

  return (
    <DefaultPage>
      <Webcam className="it" ref={userVideo} autoPlay playsInline />
      {peers.map((peer, index) => {
        console.log(peer);
        return <Video key={index} peer={peer} stream={stream} />;
      })}
    </DefaultPage>
  );
}
const Description = styled.div`
  margin-top: 10px;
  text-align: center;
  font-size: 20px;

  .color {
    color: #199816;
  }
`;

const UserView = styled.div`
  display: grid;
  grid-template-columns: 400px 400px;
  grid-template-rows: 280px 280px;
  margin-top: 15px;
  justify-content: space-evenly;
  row-gap: 30px;
  font-size: 30px;

  .opportunity {
    position: absolute;
  }

  .user {
    position: absolute;
    z-index: 9;
    width: 400px;
    height: 300px;
    object-fit: fill;
    transform: rotateY(180deg);
  }

  .anotherUser {
    height: 220px;
    width: 380px;
    object-fit: fill;
    background-color: aliceblue;
    justify-items: stretch;
  }

  .it {
    text-align: center;
  }

  .me {
    color: #f47676;
    font-size: 30px;
  }
  .stop {
    margin-top: 60px;
  }

  .countDown {
    z-index: 300;
    position: absolute;
    place-self: center;
    font-size: 200px;
    color: red;
  }
`;

export default View;
