import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import notfoundbackground from "../asset/notfoundbackground.png";
import notfoundflower from "../asset/notfoundflower.png";
import Button from "./Button";

function NotFound() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/");
  };

  return (
    <Background>
      <img src={notfoundbackground} alt={notfoundbackground} />
      <span className="notfound">페이지를 찾지 못했습니다</span>
      <span className="number">
        4<img className="flower" src={notfoundflower} alt={notfoundflower} />4
      </span>
      <ButtonWarp>
        <Button handleClick={handleNavigate}>처음으로 돌아가기</Button>
      </ButtonWarp>
    </Background>
  );
}

const Background = styled.div`
  position: absolute;
  display: flex;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fdf3ef;

  img {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .flower {
    position: relative;
    width: 100px;
    vertical-align: middle;
  }

  .notfound {
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    line-height: 20px;
    font-size: 60px;
  }

  .number {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    line-height: 20px;
    font-size: 60px;
  }
`;

const ButtonWarp = styled.div`
  position: absolute;
  top: 70%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export default NotFound;
