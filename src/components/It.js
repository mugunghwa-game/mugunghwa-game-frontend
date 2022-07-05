import * as posenet from "@tensorflow-models/posenet";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import Peer from "simple-peer";
import styled from "styled-components";

import useStore from "../store/store";
import { drawKeypoints, drawSkeleton } from "../utils/posenet";
import { socket } from "../utils/socket";
import Button from "./Button";
import DefaultPage from "./DefaultPage";

function It() {
  const navigate = useNavigate();
  const [peers, setPeers] = useState([]);
  const userVideo = useRef();
  const peersRef = useRef([]);
  const canvasRef = useRef(null);
  const canvasRef0 = useRef(null);
  const participantRef = useRef(null);
  const participantRef0 = useRef(null);
  const [itUser, setItUser] = useState(null);
  const { people, participant } = useStore();
  const [participantUser, setParticipantUser] = useState(null);
  const [itCount, setItCount] = useState(5);
  const [hasMotion, setHasMotion] = useState(false);
  const [Winner, setWinner] = useState(null);
  let userInfo;

  useEffect(() => {
    socket.emit("enter", true);
    socket.on("user", (data) => {
      userInfo = data;
      setItUser(data.room.it);
      setParticipantUser(data.participant);
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
      socket.off("user");
    };
  }, []);

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socket.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
      });
    });

    return peer;
  }

  const runPosenet = async () => {
    const net = await posenet.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.8,
    });

    if (participantRef.current !== null) {
      const temp = setInterval(() => {
        detect(net);
      }, 1000);
      setTimeout(() => clearInterval(temp) & console.log("done"), 40000);
    }
  };

  const detect = async (net) => {
    if (
      typeof participantRef.current !== "undefined" &&
      participantRef.current !== null &&
      participantRef.current.video.readyState === 4
    ) {
      const firstVideo = participantRef.current.video;
      const firstVideoWidth = participantRef.current.video.videoWidth;
      const firstVideoHeight = participantRef.current.video.videoHeight;
      participantRef.current.video.width = firstVideoWidth;
      participantRef.current.video.height = firstVideoHeight;

      const secondVideo = participantRef0.current.video;
      const secondVideoWidth = participantRef0.current.video.videoWidth;
      const secondVideoHeight = participantRef0.current.video.videoHeight;
      participantRef0.current.video.width = secondVideoWidth;
      participantRef0.current.video.height = secondVideoHeight;

      const firstVideoPose = await net.estimateSinglePose(firstVideo);
      const secondVideoPose = await net.estimateSinglePose(secondVideo);

      drawCanvas(
        firstVideoPose,
        firstVideo,
        firstVideoWidth,
        firstVideoHeight,
        canvasRef
      );
      drawCanvas(
        secondVideoPose,
        secondVideo,
        secondVideoWidth,
        secondVideoHeight,
        canvasRef0
      );
    }
  };

  const drawCanvas = (pose, video, videoWidth, videoHeight, canvas) => {
    const ctx = canvas.current.getContext("2d");

    canvas.current.width = videoWidth;
    canvas.current.height = videoHeight;

    drawKeypoints(pose.keypoints, 0.6, ctx);
    drawSkeleton(pose.keypoints, 0.7, ctx);
  };

  const handleStopButton = () => {
    if (itCount > 0) {
      setItCount((prev) => prev - 1);
      socket.emit("motion-start", true);
    }
  };

  useEffect(() => {
    socket.on("start", (data) => {
      if (data) {
        runPosenet();
        setItCount((prev) => prev - 1);
      }
    });

    if (hasMotion) {
      socket.emit("hasMotion", socket.id);
    }

    socket.on("remaining-opportunity", (data) => {
      setParticipantUser(data);
    });

    socket.on("game-end", (data) => {
      if (data) {
        setWinner("it");
        navigate("/ending");
      }
    });

    return () => {
      socket.off("start");
      socket.off("remaining-opportunity");
      socket.off("game-end");
    };
  }, []);

  if (itCount === 0) {
    const reaminingUser = participantUser.filter(
      (item) => item.opportunity > 0
    );
    if (itCount === 0 && reaminingUser.length > 0) {
      setWinner(reaminingUser);
      navigate("/ending");
    }
    if (itCount === 0 && reaminingUser.length === 0) {
      setWinner("it");
      navigate("/ending");
    }
  }

  return (
    <DefaultPage>
      <Description>
        {itUser && itUser[0] === socket.id ? (
          <>
            <div>
              <span className="color">무궁화 꽃이 피었습니다</span> 라고 외친 후
              <span className="color"> 멈춤</span> 버튼을 눌러주세요
            </div>
            <div>
              버튼 누른 후 <span className="color"> 3초</span> 동안 다른
              참가자들의 움직임이 감지됩니다
            </div>
          </>
        ) : (
          <>
            <div>
              술래가 무궁화 꽃이 피었습니다를 외치면
              <span className="color">3초</span>간 동작을 멈춰야합니다
            </div>
          </>
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
                      ref={index === 0 ? participantRef : participantRef0}
                      style={{
                        position: "absolute",
                        zindex: 9,
                        width: "400px",
                        height: "250px",
                        objectFit: "fill",
                      }}
                    />
                    <canvas
                      ref={index === 0 ? canvasRef : canvasRef0}
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
        {itUser && itUser[0] === socket.id ? (
          <div className="stop">
            <Button handleClick={handleStopButton} property="stop">
              멈춤
            </Button>
          </div>
        ) : null}
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

export default It;
