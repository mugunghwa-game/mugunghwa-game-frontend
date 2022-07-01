import React from "react";
import { MdClose } from "react-icons/md";
import styled from "styled-components";

import flowericon from "../asset/flowericon.jpeg";
import Button from "./Button";

function ModalContent({ modalText, modalTitle, handleModal }) {
  const handleClick = () => {
    handleModal(false);
  };

  return (
    <Content>
      <h3>
        <MdClose onClick={handleClick} />
      </h3>
      <h2>
        <img className="icon" src={flowericon} />
        {modalTitle}
      </h2>
      <hr />
      <h2 className="difficulty"> {modalText}</h2>
      {modalTitle === "난이도 선택" && (
        <>
          <div className="none"></div>
          <span className="buttonWarp">
            <span className="easy">
              <Button>쉬움</Button>
            </span>

            <span className="difficult">
              <Button>어려움</Button>
            </span>
          </span>
        </>
      )}
    </Content>
  );
}

const Content = styled.div`
  .icon {
    width: 30px;
    height: 70px;
    vertical-align: middle;
  }

  .none {
    height: 40px;
  }

  .difficulty {
    margin-top: 30px;
  }

  .easy {
    margin-right: 80px;
  }

  h3 {
    text-align: end;
    cursor: pointer;
  }

  hr {
    margin-top: 20px;
  }

  .buttonWarp {
    margin-right: 80px;
  }
`;

export default ModalContent;
