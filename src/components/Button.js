import chroma from "chroma-js";
import styled, { css } from "styled-components";

const Button = styled.button`
  display: inline-flex;
  font-weight: 500;
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
  color: ${({ primary, theme }) =>
    primary ? chroma(theme.accent).darken(2.0).hex() : theme.text};
  background-color: ${({ primary, transparent, theme }) =>
    primary ? theme.accent : transparent ? "transparent" : theme.background};
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
    box-shadow: 0px 0px 2px 0px ${({ theme, primary }) =>
      primary ? chroma(theme.accent).brighten(0.5).hex() : theme.backgroundL2};
    background-color: ${({ theme, primary }) =>
      primary ? chroma(theme.accent).brighten(0.5).hex() : theme.backgroundL2};
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
