import * as posenet from "@tensorflow-models/posenet";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Peer from "simple-peer";
import styled from "styled-components";

import { SOCKET } from "../constants/constants";
import useStore from "../store/store";
import { addPeer, createPeer } from "../utils/index";
import {
  divisionChildAndAdult,
  moveDetection,
  sholuderLengthinScreen,
  visibleButton,
} from "../utils/motionDetection";
import { drawCanvas, videoReference } from "../utils/posenet";
import { socket, socketApi } from "../utils/socket";
import Camera from "./Camera";
import DefaultPage from "./DefaultPage";
import DescriptionContent from "./DscriptionContent";
import EachParticipant from "./EachParticipant";
import It from "./It";

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
    preStartFirstParticipantPose,
    preStartSecondparticipantPose,
    participantList,
    updateFirstChildParticipant,
    updateSecondChildParticipant,
    updateFirstParticipantPreparation,
    updateSecondParticipantPreparation,
    addWinner,
    difficulty,
    firstParticipantPose,
    secondParticipantPose,
    isChildFirstParticipant,
    isChildSecondParticipant,
  } = useStore();
  const navigate = useNavigate();
  const peersRef = useRef([]);
  const [hasTouchDownButton, setHasTouchDownButton] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [isGameEnd, setIsGameEnd] = useState(false);
  const userVideo = useRef(null);
  const [itCount, setItCount] = useState(5);
  const [isAllGameEnd, setIsAllGameEnd] = useState(false);
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
      // console.log(pose);

      if (pose !== null && userCanvas.current !== null) {
        drawCanvas(pose, video, video.width, video.height, userCanvas);
        console.log("mode", mode);
        if (mode === "prepare") {
          //인덱스에 따라 다르게 저장.
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
    socketApi.enterGameRoom(true);

    socket.on(SOCKET.USER, (payload) => {
      userInfo = payload.socketInRoom;
      setAnotherUser(payload.socketInRoom);
      setItUser(payload.room.it);
      setParticipantUser(payload.participant);
    });

    return () => {
      socket.off(SOCKET.USER);
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
        //나말고 이미 들어와있던 사람들에게 내가 들어왔다고 알림
        userInfo.forEach((user) => {
          const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
          });
          peer.on("signal", (signal) => {
            socketApi.sendSignalAnotherUser(user, socket.id, signal);
          });

          peersRef.current.push({
            peerID: user,
            peer,
          });
          peers.push(peer);
        });

        setPeers(peers);
        socket.on("user joined", (payload) => {
          const peer = addPeer(payload.signal, payload.callerID);
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          });

          setPeers((users) => [...users, peer]);
        });

        socket.on(SOCKET.RECEIVING_RETURNED_SIGNAL, (payload) => {
          console.log("returning signal", payload);
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          item.peer.signal(payload.signal);
        });
      });

    return () => {
      userVideo.current = null;

      socket.off(SOCKET.USER);
      socket.off(SOCKET.RECEIVING_RETURNED_SIGNAL);
      socket.off("user joined");
    };
  }, []);
  console.log(peers);

  useEffect(() => {
    if (participantUser) {
      if (
        preStartFirstParticipantPose.length !== 0 &&
        participantUser[0].id === socket.id
      ) {
        const sholuderLength = sholuderLengthinScreen(
          preStartFirstParticipantPose[0]
        );
        const isItChild = divisionChildAndAdult(
          preStartFirstParticipantPose[0]
        );
        // console.log(isItChild, sholuderLength);
        if (
          0 < sholuderLength < 5 &&
          preStartFirstParticipantPose[0].score > 0.7
        ) {
          console.log("heelllll here is one");
          isItChild ? updateFirstChildParticipant() : null;
          socketApi.isReady(true);
        }
      }

      if (
        preStartSecondparticipantPose.length !== 0 &&
        participantUser[1].id === socket.id
      ) {
        const isItChild = divisionChildAndAdult(
          preStartSecondparticipantPose[0]
        );
        if (
          0 < sholuderLengthinScreen(preStartSecondparticipantPose[0]) <= 5 &&
          preStartSecondparticipantPose[0].score > 0.7
        ) {
          console.log("heelllll here is two");

          isItChild ? updateSecondChildParticipant() : null;
          socketApi.isReady(true);
        }
      }
    }

    socket.on(SOCKET.PREPARED_GAME, (payload) => {
      if (payload) {
        console.log("prepare");
        updateFirstParticipantPreparation();
        updateSecondParticipantPreparation();
        setMode("game");
      }
    });

    socket.on(SOCKET.PREPARED, (payload) => {
      if (payload) {
        console.log("prepare");
        updateFirstParticipantPreparation();
        updateSecondParticipantPreparation();
        setMode("game");
      }
    });

    return () => {
      socket.off(SOCKET.PREPARED_GAME);
      socket.off(SOCKET.PREPARED);
    };
  }, [preStartFirstParticipantPose, preStartSecondparticipantPose, mode]);

  useEffect(() => {
    if (
      firstParticipantPose.length === 3 &&
      participantUser[0].id === socket.id
    ) {
      const moved = moveDetection(
        firstParticipantPose[0],
        firstParticipantPose[2],
        difficulty,
        isChildFirstParticipant
      );

      const result = visibleButton(firstParticipantPose[0]);

      if (result) {
        setHasTouchDownButton(true);
      }

      if (moved) {
        socketApi.userMoved(participantUser[0].id);
      }
    }
    if (
      secondParticipantPose.length === 3 &&
      participantUser[1].id === socket.id
    ) {
      const moved = moveDetection(
        secondParticipantPose[0],
        secondParticipantPose[2],
        difficulty,
        isChildSecondParticipant
      );

      const result = visibleButton(secondParticipantPose[0]);

      if (result) {
        setHasTouchDownButton(true);
      }
      if (moved) {
        socketApi.userMoved(participantUser[1].id);
      }
    }
  }, [firstParticipantPose, secondParticipantPose]);

  useEffect(() => {
    socket.on(SOCKET.START, (payload) => {
      if (payload) {
        setHasStop(true);
        setItCount((prev) => prev - 1);
      }
    });

    if (clickCount === 5) {
      socketApi.countEnd(true);
    }

    socket.on(SOCKET.IT_END, (payload) => {
      if (payload) {
        setIsGameEnd(true);
      }
    });

    socket.on(SOCKET.PARTICIPANT_REMAINING_OPPORTUNITY, (payload) => {
      setParticipantUser(payload);
    });

    socket.on(SOCKET.PARTICIPANT_REMAINING_COUNT, (payload) => {
      setParticipantUser(payload);
    });

    socket.on(SOCKET.GAME_END, (payload) => {
      if (payload) {
        addWinner("술래");
        navigate("/ending");
      }
    });

    socket.on(SOCKET.ANOTHER_USER_END, (payload) => {
      if (payload) {
        addWinner("술래");
        navigate("/ending");
      }
    });

    return () => {
      socket.off(SOCKET.START);
      socket.off(SOCKET.PARTICIPANT_REMAINING_OPPORTUNITY);
      socket.off(SOCKET.PARTICIPANT_REMAINING_COUNT);
      socket.off(SOCKET.GAME_END);
      socket.off(SOCKET.IT_END);
      socket.off(SOCKET.ANOTHER_USER_END);
    };
  }, [clickCount, isGameEnd]);

  useEffect(() => {
    if ((itCount === 0 && clickCount === 5) || (isGameEnd && itCount === 0)) {
      const reaminingUser = participantUser.filter(
        (item) => item.opportunity > 0
      );

      if (reaminingUser.length === 0) {
        addWinner("술래");
      } else {
        addWinner("참가자");
      }
      navigate("/ending");
    }

    if (isItLoser) {
      socketApi.itLoser(true);
      setIsAllGameEnd(true);
      addWinner("참가자");
      navigate("/ending");
    }

    socket.on(SOCKET.IT_LOSER_GAME_END, (payload) => {
      if (payload) {
        addWinner("참가자");
        navigate("/ending");
      }
    });

    return () => {
      socket.off(SOCKET.IT_LOSER_GAME_END);
    };
  }, [clickCount, isItLoser, isGameEnd]);

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
        <Camera
          userVideo={userVideo}
          userCanvas={userCanvas}
          itUser={itUser}
          itCount={itCount}
          peers={peers}
          participantUser={participantUser}
        />
        <It
          user={itUser}
          itCount={itCount}
          handleCount={setItCount}
          isAllGameEnd={isAllGameEnd}
        />
        <EachParticipant
          peers={peers}
          participantUser={participantUser}
          touchDown={mode === "preapre" ? null : hasTouchDownButton}
          wildCard={mode === "preapre" ? null : setIsItLoser}
          handleLoser={mode === "preapre" ? null : setIsItLoser}
          countDownStart={countDownStart}
          handleCountDownStart={setCountDownStart}
        />
      </UserView>
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

  .one {
    position: absolute;
    z-index: 9;
    width: 400px;
    height: 300px;
    object-fit: fill;
    transform: rotateY(180deg);
  }

  .two {
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
    font-size: 100px;
    color: #f47676;
  }
`;

export default View;
