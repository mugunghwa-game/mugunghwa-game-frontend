import React from "react";
import styled from "styled-components";

import ModalPortal from "../Portal";

function Modal({ children, property }) {
  return (
    <ModalPortal>
      <ModalContainer>
        <ModalBody property={property}>{children}</ModalBody>
      </ModalContainer>
    </ModalPortal>
  );
}

const ModalContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(2px);
  text-align: center;
  z-index: 1000;
`;

const ModalBody = styled.div`
  width: 900px;
  height: ${(props) => (props.property === "difficulty" ? "400px" : "600px")};
  border-radius: 7px;
  background-color: white;

  div {
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin: 10px 20px;
  }
`;

export default Modal;
