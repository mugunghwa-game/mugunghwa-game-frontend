import * as posenet from "@tensorflow-models/posenet";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { SOCKET } from "../constants/constants";
import useStore from "../store/store";
import { createPeer } from "../utils/index";
import { moveDetection, visibleButton } from "../utils/motionDetection";
import { drawCanvas, videoReference } from "../utils/posenet";
import { socket } from "../utils/socket";
import DefaultPage from "./DefaultPage";
import DescriptionContent from "./DscriptionContent";
import EachParticipant from "./EachParticipant";
import It from "./It";

function Game() {
  const navigate = useNavigate();
  const [hasTouchDownButton, setHasTouchDownButton] = useState(false);
  const [peers, setPeers] = useState([]);
  const [participantUser, setParticipantUser] = useState(null);
  const [itCount, setItCount] = useState(5);
  const [itUser, setItUser] = useState(null);
  const userVideo = useRef();
  const peersRef = useRef([]);
  const firstCanvas = useRef(null);
  const secondCanvas = useRef(null);
  const firstParticipantRef = useRef(null);
  const secondParticipantRef = useRef(null);
  const {
    addWinner,
    difficulty,
    firstParticipantPose,
    secondParticipantPose,
    addFirstParticipantPose,
    addSecondParticipantPose,
  } = useStore();
  let userInfo;

  useEffect(() => {
    socket.emit(SOCKET.ENTER, true);
    socket.on(SOCKET.USER, (payload) => {
      userInfo = payload;
      setItUser(payload.room.it);
      setParticipantUser(payload.participant);
    });

    navigator.mediaDevices
      .getUserMedia({ video: videoConstraints, audio: true })
      .then((stream) => {
        if (userVideo.current !== null) {
          const peers = [];

          userInfo.participant.forEach((user) => {
            const peer = createPeer(user, socket.id, stream);
            peersRef.current.push({
              peerID: user,
              peer,
            });
            peers.push(peer);
          });

          setPeers(peers);

          socket.on(SOCKET.RECEIVING_RETURNED_SIGNAL, (payload) => {
            const item = peersRef.current.find((p) => p.peerID === payload.id);
            item.peer.signal(payload.signal);
          });
        }
      });

    return () => {
      socket.off(SOCKET.USER);
      socket.off(SOCKET.RECEIVING_RETURNED_SIGNAL);
    };
  }, []);

  const runPosenet = async () => {
    const net = await posenet.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.8,
    });

    const temp = setInterval(() => {
      detect(net);
    }, 1000);
    setTimeout(() => clearInterval(temp) & console.log("done"), 5000);
  };

  const detect = async (net) => {
    if (
      typeof firstParticipantRef.current !== "undefined" &&
      firstParticipantRef.current !== null &&
      firstParticipantRef.current.video.readyState === 4
    ) {
      const firstVideo = videoReference(firstParticipantRef);
      const secondVideo = videoReference(secondParticipantRef);

      const firstVideoPose = await net.estimateSinglePose(firstVideo);
      const secondVideoPose = await net.estimateSinglePose(secondVideo);

      drawCanvas(
        firstVideoPose,
        firstVideo,
        firstVideo.width,
        firstVideo.height,
        firstCanvas
      );
      drawCanvas(
        secondVideoPose,
        secondVideo,
        secondVideo.width,
        secondVideo.height,
        secondCanvas
      );

      addFirstParticipantPose(firstVideoPose);
      addSecondParticipantPose(secondVideoPose);
    }
  };

  useEffect(() => {
    if (
      firstParticipantPose.length === 3 &&
      participantUser[0].id === socket.id
    ) {
      const moved = moveDetection(
        firstParticipantPose[0],
        firstParticipantPose[2]
      );

      const result = visibleButton(firstParticipantPose[0]);

      if (result) {
        setHasTouchDownButton(true);
      }

      if (moved) {
        socket.emit(SOCKET.MOVED, participantUser[0].id);
      }
    }

    if (
      secondParticipantPose.length === 3 &&
      participantUser[1].id === socket.id
    ) {
      const moved = moveDetection(
        secondParticipantPose[0],
        secondParticipantPose[2]
      );

      const result = visibleButton(firstParticipantPose[0]);
      if (result) {
        setHasTouchDownButton(true);
      }
      if (moved) {
        socket.emit(SOCKET.MOVED, participantUser[1].id);
      }
    }
  }, [firstParticipantPose]);

  useEffect(() => {
    socket.on(SOCKET.START, (payload) => {
      if (payload) {
        runPosenet();
        setItCount((prev) => prev - 1);
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
      socket.off(SOCKET.ANOTHER_USER_END);
    };
  }, []);

  useEffect(() => {
    if (itCount === 0) {
      const reaminingUser = participantUser.filter(
        (item) => item.opportunity > 0
      );

      if (reaminingUser.length === 0) {
        addWinner("술래");
        navigate("/ending");
      } else {
        addWinner("참가자");
        navigate("/ending");
      }
    }
  }, [itCount]);

  return (
    <DefaultPage>
      <Description>
        {itUser && itUser[0] === socket.id ? (
          <DescriptionContent user={itUser} />
        ) : (
          <DescriptionContent />
        )}
      </Description>
      <Participant>
        <EachParticipant
          peers={peers}
          participantUser={participantUser}
          firstParticipantRef={firstParticipantRef}
          secondParticipantRef={secondParticipantRef}
          firstCanvas={firstCanvas}
          secondCanvas={secondCanvas}
          touchDown={hasTouchDownButton}
        />
      </Participant>
      <ItsCamera>
        <It
          user={itUser}
          itCount={itCount}
          handleCount={setItCount}
          userVideo={userVideo}
        />
      </ItsCamera>
    </DefaultPage>
  );
}

const Description = styled.div`
  margin-top: 20px;
  text-align: center;
  font-size: 20px;

  .color {
    color: #199816;
  }
`;

const Participant = styled.div`
  display: grid;
  grid-template-columns: 420px 420px;
  grid-template-rows: 280px;
  margin-top: 15px;
  justify-content: space-around;

  .participant {
    background-color: white;
  }
  .one {
    position: absolute;
    z-index: 9;
    width: 400px;
    height: 250px;
    object-fit: fill;
    transform: rotateY(180deg);
  }
`;

const ItsCamera = styled.div`
  margin-top: 35px;
  display: grid;
  grid-template-columns: 200px 200px 200px;
  grid-template-rows: 140px;
  justify-content: center;
  column-gap: 120px;

  .opportunity {
    align-self: center;
    text-align: -webkit-center;
  }

  .it {
    background-color: white;
  }

  .stop {
    align-self: center;
  }

  .itCam {
    width: 200px;
    height: 140px;
    object-fit: fill;
    transform: rotateY(180deg);
  }
`;

const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2,
};

export default Game;
