import * as posenet from "@tensorflow-models/posenet";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import styled from "styled-components";

import { SOCKET } from "../constants/constants";
import useStore from "../store/store";
import { createPeer } from "../utils";
import { drawCanvas, videoReference } from "../utils/posenet";
import { socket } from "../utils/socket";
import Button from "./Button";
import DefaultPage from "./DefaultPage";
import DescriptionContent from "./DscriptionContent";

function Game() {
  const navigate = useNavigate();
  const [peers, setPeers] = useState([]);
  const [participantUser, setParticipantUser] = useState(null);
  const [itCount, setItCount] = useState(5);
  const [itUser, setItUser] = useState(null);
  const [hasMotion, setHasMotion] = useState(false);
  const userVideo = useRef();
  const peersRef = useRef([]);
  const firstCanvas = useRef(null);
  const secondCanvas = useRef(null);
  const firstParticipantRef = useRef(null);
  const secondParticipantRef = useRef(null);
  const { addWinner, difficulty } = useStore();
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

          socket.on("receiving returned signal", (payload) => {
            const item = peersRef.current.find((p) => p.peerID === payload.id);
            item.peer.signal(payload.signal);
          });
        }
      });

    return () => {
      socket.off(SOCKET.USER);
    };
  }, []);

  const runPosenet = async () => {
    const net = await posenet.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.8,
    });

    if (firstParticipantRef.current !== null) {
      const temp = setInterval(() => {
        detect(net);
      }, 1000);
      setTimeout(() => clearInterval(temp) & console.log("done"), 10000);
    }
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
    }
  };

  const handleStopButton = () => {
    if (itCount > 0) {
      setItCount((prev) => prev - 1);
      socket.emit(SOCKET.MOTION_START, true);
    }
  };

  useEffect(() => {
    socket.on(SOCKET.START, (payload) => {
      if (payload) {
        runPosenet();
        setItCount((prev) => prev - 1);
        setTimeout(() => setHasMotion(true), 20000);
      }
    });

    if (hasMotion) {
      socket.emit(SOCKET.MOVED, socket.id);
      setHasMotion(false);
    }

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
  }, [hasMotion]);

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
        {peers.map((peer, index) => (
          <span key={index}>
            {participantUser[index].id && (
              <span>
                {participantUser[index].id === socket.id ? (
                  <span>나 </span>
                ) : null}
                {index}남은 기회의 수 {participantUser[index].opportunity}
                <>
                  <div className="participant">
                    <Webcam
                      key={index}
                      peer={peer}
                      ref={
                        index === 0 ? firstParticipantRef : secondParticipantRef
                      }
                      style={{
                        position: "absolute",
                        zindex: 9,
                        width: "400px",
                        height: "250px",
                        objectFit: "fill",
                      }}
                    />
                    <canvas
                      ref={index === 0 ? firstCanvas : secondCanvas}
                      style={{
                        position: "absolute",
                        zindex: 9,
                        width: "400px",
                        height: "250px",
                        objectFit: "fill",
                      }}
                    />
                  </div>
                </>
              </span>
            )}
          </span>
        ))}
      </Participant>
      <ItsCamera>
        {itUser && (
          <>
            <div className="opportunity">
              {itUser[0] === socket.id && <span>나 </span>}남은기회의 수
              {itCount}
            </div>
            <div className="it">
              <Webcam
                muted
                ref={userVideo}
                autoPlay
                style={{
                  width: "200px",
                  height: "160px",
                  objectFit: "fill",
                }}
              />
            </div>
          </>
        )}
        {itUser && itUser[0] === socket.id && (
          <div className="stop">
            <Button handleClick={handleStopButton} property="stop">
              멈춤
            </Button>
          </div>
        )}
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
  grid-template-columns: 400px 400px;
  grid-template-rows: 280px;
  margin-top: 10px;
  justify-content: space-around;

  .participant {
    background-color: white;
  }
`;

const ItsCamera = styled.div`
  margin-top: 25px;
  display: grid;
  grid-template-columns: 200px 200px 200px;
  grid-template-rows: 160px;
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
`;
const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2,
};

export default Game;
