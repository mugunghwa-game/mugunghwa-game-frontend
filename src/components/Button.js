import React from "react";
import styled from "styled-components";

function Button({ children, handleClick, property }) {
  return (
    <ButtonBody
      disabled={property === "disabled" ? true : false}
      onClick={handleClick}
      property={property}
    >
      {children}
    </ButtonBody>
  );
}

const ButtonBody = styled.button`
  width: ${(props) => (props.property === "stop" ? "150px" : "300px")};
  height: 70px;
  background-color: #fbe6ce;
  color: ${(props) => (props.property === "disabled" ? "#808080" : "#199816")};
  font-size: 25px;
  border-radius: 20px;
  border-style: none;

  :hover {
    background-color: #fbddcf;
    transform: translateY(-3px);
  }

  :active {
    transform: translateY(3px);
  }
`;

export default Button;
