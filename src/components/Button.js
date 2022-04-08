import chroma from "chroma-js";
import styled, { css } from "styled-components";

const Button = styled.button`
  display: inline-flex;
  justify-content: center;
  justify-items: center;
  align-content: center;
  align-items: center;
  height: 2.5rem;
  border: none;
  outline: none;
  overflow: hidden;
  padding: 0 1rem;
  font-size: 1rem;
  margin: 0;
  transition: all 0.3s ease-in-out;
  border-radius: ${({ theme }) => theme.borderRadius};
  color: ${({ theme }) => theme.text};
  background-color: ${({ transparent, theme }) =>
    transparent ? "transparent" : theme.background
  };
  ${({ iconLeft }) =>
    iconLeft &&
    css`
      svg {
        margin-right: 0.5rem;
      }
    `};

  ${({ iconRight }) =>
    iconRight &&
    css`
      svg {
        margin-left: 0.5rem;
      }
    `};

  &:hover {
    cursor: pointer;
    opacity: 0.9;
    box-shadow: 0px 0px 2px 0px ${({ theme }) => chroma(theme.backgroundL2)};
    background-color: ${({ theme }) => chroma(theme.backgroundL2)};
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  justify-items: center;
  align-content: center;
  align-items: center;
  border: none;
  outline: none;
  overflow: hidden;
  padding: 0;
  margin: 0;
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ transparent, theme }) => {
    if (transparent) return "transparent";
    return theme.background;
  }};
  ${Button} & {
    border-radius: 0;
    background-color: ${({ transparent, theme }) => {
    if (transparent) return "transparent";
    return theme.background;
  }}
`;

export { ButtonGroup, Button };
