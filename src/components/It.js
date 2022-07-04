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
  const [itUser, setItUser] = useState(null);
  const { people, participant } = useStore();
  const [participantUser, setParticipantUser] = useState(null);
  const [itCount, setItCount] = useState(5);
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
        userVideo.current.srcObject = stream;

        const peers = [];

        userInfo.participant.forEach((user) => {
          const peer = createPeer(user, socket.id, userVideo.current.srcObject);
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
      });

    return () => {
      socket.off("user");
    };
  }, [socket]);

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
      inputResolution: { width: 400, height: 220 },
      scale: 0.5,
    });

    if (userVideo.current !== null) {
      const temp = setInterval(() => {
        detect(net);
      }, 1000);
      setTimeout(() => clearInterval(temp) & console.log("done"), 40000);
    }
  };

  const detect = async (net) => {
    if (
      typeof userVideo.current !== "undefined" &&
      userVideo.current !== null &&
      userVideo.current.video.readyState === 4
    ) {
      const video = userVideo.current.video;
      const videoWidth = userVideo.current.video.videoWidth;
      const videoHeight = userVideo.current.video.videoHeight;

      const pose = await net.estimateSinglePose(video);
      drawCanvas(pose, video, videoWidth, videoHeight, canvasRef);
    }
  };

  const drawCanvas = (pose, video, videoWidth, videoHeight, canvas) => {
    const ctx = canvas.current.getContext("2d");

    drawKeypoints(pose.keypoints, 0.5, ctx);
    drawSkeleton(pose.keypoints, 0.5, ctx);
  };

  const handleStopButton = () => {
    setItCount((prev) => prev - 1);
  };

  useEffect(() => {
    runPosenet();

    return () => {
      runPosenet();
    };
  }, []);

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
                  <span>나</span>
                ) : null}
                남은 기회의 수 {participantUser[index].opportunity}
                <>
                  <div className="participant">
                    <Webcam
                      key={index}
                      peer={peer}
                      style={{
                        position: "absolute",
                        zindex: 9,
                        width: "400px",
                        height: "250px",
                        objectFit: "fill",
                      }}
                    />
                    <canvas
                      ref={canvasRef}
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
        {itUser && itUser[0] === socket.id && (
          <>
            <div className="opportunity"> 나 남은기회의 수{itCount}</div>
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
