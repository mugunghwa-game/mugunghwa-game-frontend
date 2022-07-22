import PropTypes from "prop-types";
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
    props.property === "stop" || props.children === "멈춤" ? "30vh" : "55vh"};
  height: ${(props) => (props.property === "alram" ? "20vh" : "14vh")};
  background-color: ${(props) =>
    props.property === "alram" ? "#f47676" : "#fbe6ce"};
  color: ${(props) => (props.property === "disabled" ? "#808080" : "#199816")};
  font-size: ${(props) => (props.property === "alram" ? "6vh" : "4.2vh")};
  border-radius: 2vh;
  border-style: none;
  z-index: ${(props) => (props.property === "alram" ? "100" : null)};
  position: ${(props) =>
    props.property === "alram" && props.children !== "술래 등 때리기"
      ? "absolute"
      : null};
  place-self: ${(props) => (props.property === "alram" ? "center" : null)};
  margin-top: ${(props) =>
    props.property === "alram" && props.children !== "술래 등 때리기"
      ? "30vh"
      : null};
  margin-left: ${(props) =>
    props.property === "alram" && props.children !== "술래 등 때리기"
      ? "50vh"
      : props.children === "멈춤"
      ? "5vh"
      : null};

  :hover {
    background-color: #fbddcf;
    transform: translateY(-3px);
  }

  :active {
    transform: translateY(3px);
  }
`;

Button.propTypes = {
  children: PropTypes.string,
};

export default Button;
