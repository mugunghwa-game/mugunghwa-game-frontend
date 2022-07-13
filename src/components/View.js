import * as posenet from "@tensorflow-models/posenet";
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import Peer from "simple-peer";
import styled from "styled-components";

import { SOCKET } from "../constants/constants";
import useStore from "../store/store";
import { drawCanvas, videoReference } from "../utils/posenet";
import { socket, socketApi } from "../utils/socket";
import DefaultPage from "./DefaultPage";
import DistanceAdjustment from "./DistanceAdjustment";
import DescriptionContent from "./DscriptionContent";
import Event from "./Event";
import Game from "./Game";
import It from "./It";

const Video = (props) => {
  const anotherUserRef = useRef(null);
  console.log(props, "props");
  useEffect(() => {
    props.peer.on("stream", (stream) => {
      console.log("stream", stream);
      anotherUserRef.current.srcObject = stream;
    });
  }, []);

  return (
    <>
      <Webcam
        className="anotherUser"
        playsInline
        autoPlay
        ref={anotherUserRef}
      />
    </>
  );
};

function View() {
  const [peers, setPeers] = useState([]);
  const [itUser, setItUser] = useState(null);
  const [isItLoser, setIsItLoser] = useState(false);
  const [hasStop, setHasStop] = useState(false);
  const [countDownStart, setCountDownStart] = useState(false);
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
  const peersRef = useRef([]);
  const [hasTouchDownButton, setHasTouchDownButton] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const userVideo = useRef(null);
  const [itCount, setItCount] = useState(5);
  const [participantUser, setParticipantUser] = useState(null);
  const [mode, setMode] = useState("prepare");
  const [anotherUser, setAnotherUser] = useState([]);
  const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2,
  };

  const runPosenet = async () => {
    const net = await posenet.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.8,
    });

    if (mode === "game") {
      const temp = setInterval(() => {
        detect(net);
      }, 1000);

      setTimeout(() => {
        clearInterval(temp),
          setClickCount((prev) => prev + 1),
          console.log("done");
      }, 3000);
    }

    if (mode === "prepare") {
      const temp = setInterval(() => {
        detect(net);
      }, 3000);

      setTimeout(() => clearInterval(temp) && console.log("done"), 20000);
    }
  };

  useEffect(() => {
    if (mode === "prepare") {
      runPosenet();
    }
    if (mode === "game" && hasStop) {
      runPosenet();
      setCountDownStart(true);
      setHasStop(false);
    }
  }, [hasStop]);

  const detect = async (net) => {
    if (
      typeof userVideo.current !== "undefined" &&
      userVideo.current !== null &&
      userVideo.current.video.readyState === 4 &&
      userCanvas
    ) {
      const video = videoReference(userVideo);
      const pose = await net.estimateSinglePose(video);

      if (pose !== null && userCanvas.current !== null) {
        drawCanvas(pose, video, video.width, video.height, userCanvas);

        if (mode === "prepare") {
          if (participantList[0] === socket.id) {
            addPreStartFirstParticipantPose(pose);
          } else {
            addPreStartSecondparticipantPose(pose);
          }
        }
        if (mode === "game") {
          if (participantList[0] === socket.id) {
            addFirstParticipantPose(pose);
          } else {
            addSecondParticipantPose(pose);
          }
        }
      }
    }
  };

  useEffect(() => {
    // socket.on(SOCKET.USER, (payload) => {
    // userInfo = payload.socketInRoom;
    // setAnotherUser(payload.socketInRoom);
    // setItUser(payload.room.it);
    // setParticipantUser(payload.participant);
    // });

    return () => {
      // socket.off(SOCKET.USER);
    };
  }, []);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: videoConstraints,
        audio: true,
      })
      .then((stream) => {
        const peers = [];
        userVideo.current.srcObject = stream;

        socketApi.enterGameRoom(true);

        socket.on(SOCKET.USER, (payload) => {
          console.log("원래 여기 있떤 사람들", payload);
          payload.socketInRoom.forEach((user) => {
            const peer = createPeer(user, socket.id, stream);

            peersRef.current.push({
              peerID: user,
              peer,
            });
            peers.push(peer);
          });
          setPeers(peers);
        });

        console.log("나 있기전에 있던 사람들", peers);

        socket.on("user joined", (payload) => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          });

          setPeers((users) => [...users, peer]);
        });

        socket.on("receiving-returned-signal", (payload) => {
          console.log("signal돌려받음", payload);
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          item.peer.signal(payload.signal);
        });
      });

    return () => {
      userVideo.current = null;

      socket.off("user joined");
      socket.off(SOCKET.USER);
      socket.off(SOCKET.RECEIVING_RETURNED_SIGNAL);
    };
  }, []);

  function createPeer(userToSignal, callerID, stream) {
    console.log(userToSignal, callerID, stream);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      console.log("this is signal", signal);
      socket.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
      });
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      console.log(signal, "누가 들어왓대", callerID, "<-얘가 왔대");
      socket.emit("returning signal", { signal, callerID });
    });
    console.log("this is incomingSignal", incomingSignal);
    peer.signal(incomingSignal);

    return peer;
  }

  return (
    <DefaultPage>
      <Description>
        {itUser && participantUser && (
          <DescriptionContent
            itUser={itUser}
            participantUser={participantUser}
          />
        )}
      </Description>
      <UserView>
        <Webcam className="user" ref={userVideo} autoPlay playsInline />
        {peers && peers.map((peer, index) => <Video key={index} peer={peer} />)}
        <It user={itUser} itCount={itCount} handleCount={setItCount} />
        <Event
          peers={peers}
          participantUser={participantUser}
          touchDown={mode === "preapre" ? null : hasTouchDownButton}
          wildCard={mode === "preapre" ? null : setIsItLoser}
          handleLoser={mode === "preapre" ? null : setIsItLoser}
          countDownStart={countDownStart}
          handleCountDownStart={setCountDownStart}
        />
        {!fistParticipantPreparation &&
          participantUser &&
          !secondParticipantPreparation && (
            <DistanceAdjustment
              participantUser={participantUser}
              handleMode={setMode}
              itUser={itUser}
            />
          )}
      </UserView>
      {fistParticipantPreparation && secondParticipantPreparation && (
        <Game
          participantUser={participantUser}
          handleTouchDown={setHasTouchDownButton}
          handleItCount={setItCount}
          handleParticipantUser={setParticipantUser}
          handleStop={setHasStop}
          clickCount={clickCount}
          isItLoser={isItLoser}
          itCount={itCount}
        />
      )}
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
