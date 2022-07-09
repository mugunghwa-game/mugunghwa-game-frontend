import * as posenet from "@tensorflow-models/posenet";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { SOCKET } from "../constants/constants";
import useStore from "../store/store";
import { createPeer } from "../utils/index";
import {
  divisionChildAndAdult,
  sholuderLengthinScreen,
} from "../utils/motionDetection";
import { drawCanvas, videoReference } from "../utils/posenet";
import { socket } from "../utils/socket";
import DefaultPage from "./DefaultPage";
import DescriptionContent from "./DscriptionContent";
import EachParticipant from "./EachParticipant";
import It from "./It";

function View({
  mode,
  setParticipantUser,
  participant,
  itCount,
  setItCount,
  hasStop,
  setHasStop,
  touchDown,
  handleLoser,
  handleClickCount,
}) {
  const [peers, setPeers] = useState([]);
  const [itUser, setItUser] = useState(null);
  const [hasTouchDownButton, setHasTouchDownButton] = useState(false);
  const [isItLoser, setIsItLoser] = useState(false);
  // const [itCount, setItCount] = useState(5);

  let userInfo;
  const {
    preStartFirstParticipantPose,
    preStartSecondparticipantPose,
    addPreStartFirstParticipantPose,
    addPreStartSecondparticipantPose,

    addFirstParticipantPose,
    addSecondParticipantPose,
    updateFirstChildParticipant,
    updateSecondChildParticipant,
    updateFirstParticipantPreparation,
    updateSecondParticipantPreparation,
  } = useStore();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const firstCanvas = useRef(null);
  const secondCanvas = useRef(null);
  const firstParticipantRef = useRef(null);
  const secondParticipantRef = useRef(null);
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
          handleClickCount((prev) => prev + 1),
          console.log("done");
      }, 3000);
    }

    if (mode === "prepare") {
      const temp = setInterval(() => {
        detect(net);
      }, 3000);
    }
  };

  useEffect(() => {
    if (mode === "prepare") {
      runPosenet();
    }
    if (mode === "game" && hasStop) {
      runPosenet();
      setHasStop(false);
    }
  }, [hasStop]);

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

      if (firstVideo !== null && secondVideo !== null) {
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

        if (mode === "prepare") {
          addPreStartFirstParticipantPose(firstVideoPose);
          addPreStartSecondparticipantPose(secondVideoPose);
        }

        if (mode === "game") {
          addFirstParticipantPose(firstVideoPose);
          addSecondParticipantPose(secondVideoPose);
        }
      }
    }
  };

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

  return (
    <DefaultPage>
      <Description>
        {participant && (
          <DescriptionContent user={itUser} participantUser={participant} />
        )}
      </Description>
      <Participant>
        <EachParticipant
          peers={peers}
          participantUser={participant}
          firstParticipantRef={firstParticipantRef}
          secondParticipantRef={secondParticipantRef}
          firstCanvas={firstCanvas}
          secondCanvas={secondCanvas}
          touchDown={mode === "preapre" ? null : touchDown}
          wildCard={mode === "preapre" ? null : setIsItLoser}
          handleLoser={mode === "preapre" ? null : handleLoser}
        />
      </Participant>
      <ItsCamera>
        <It
          user={itUser}
          itCount={mode === "preapre" ? null : itCount}
          handleCount={mode === "preapre" ? null : setItCount}
          userVideo={userVideo}
          // clickCount={clickCount}
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
export default View;
