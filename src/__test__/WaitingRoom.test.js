import { render, screen } from "@testing-library/react";
import { expect } from "chai";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import SocketMock from "socket.io-mock";

import WaitingRoom from "../components/WaitingRoom";

describe("WaitingRoom component", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <WaitingRoom />
      </MemoryRouter>
    );
  });

  it("1. 게임 대기페이지에는 '나가기', '규칙알아보기'가 있으며, '술래, 참가자'가 있으며 '게임 참여하기'버튼이 존재한다.", () => {
    expect(screen.getByText("나가기"));
    expect(screen.getByText("규칙알아보기"));
    expect(screen.getByText("게임참여하기"));
    expect(screen.getByText("술래"));
    expect(screen.getByText("참가자"));
    expect(screen.getByRole("button"));
  });

  it("2. 역할을 아무도 선택하지 않았다면 게임시작 버튼은 비활성화 되어야한다.", () => {
    expect(screen.getByText(/게임시작/i)).to.have.property("disabled");
  });
});

describe("socket event.", () => {
  it("1. event명이 join-room이며, 'gameRoom'을 보낸다", (done) => {
    const socket = new SocketMock();

    socket.on("join-room", (info) => {
      expect(info).to.equal("gameRoom");
    });

    socket.socketClient.emit("join-room", "gameRoom");
    done();
  });

  it("2. 사용자가 역할을 선택하면 역할과 socket id를 전송한다.", (done) => {
    const socket = new SocketMock();

    socket.on("user-count", (info) => {
      expect(info).to.equal(JSON.stringify({ id: "111", role: "participant" }));
    });

    socket.socketClient.emit(
      "user-count",
      JSON.stringify({ id: "111", role: "participant" })
    );

    done();
  });

  it("3. 사용자가 '나가기'를 누르면 socket으로 id를 전송한다.", (done) => {
    const socket = new SocketMock();

    socket.on("leaveRoom", (id) => {
      expect(id).to.equal("22");
    });

    socket.socketClient.emit("leaveRoom", "22");

    done();
  });
});
