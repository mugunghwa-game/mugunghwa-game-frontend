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
  width: ${(props) =>
    props.property === "stop" || props.children === "멈춤" ? "150px" : "400px"};
  height: ${(props) => (props.property === "alram" ? "200px" : "70px")};
  background-color: ${(props) =>
    props.property === "alram" ? "#f47676" : "#fbe6ce"};
  color: ${(props) => (props.property === "disabled" ? "#808080" : "#199816")};
  font-size: ${(props) => (props.property === "alram" ? "50px" : "25px")};
  border-radius: 20px;
  border-style: none;
  z-index: ${(props) => (props.property === "alram" ? "100" : null)};
  position: ${(props) => (props.property === "alram" ? "absolute" : null)};
  place-self: ${(props) => (props.property === "alram" ? "center" : null)};

  :hover {
    background-color: #fbddcf;
    transform: translateY(-3px);
  }

  :active {
    transform: translateY(3px);
  }
`;

export default Button;
