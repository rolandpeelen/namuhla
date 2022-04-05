import styled from "styled-components";

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
  color: ${({ invert, theme }) => (invert ? theme.inverseText : theme.text)};
  background-color: ${({ transparent, invert, theme }) => {
    if (transparent) return "transparent";
    return invert ? theme.inverseBackground : theme.background;
  }};

  &:hover {
    cursor: pointer;
    opacity: 0.9;
    background-color: ${({ transparent, invert, theme }) => {
      if (transparent) return "transparent";
      return invert ? theme.inverseBackground : theme.background;
    }}
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
  background-color: ${({ transparent, invert, theme }) => {
    if (transparent) return "transparent";
    return invert ? theme.inverseBackground : theme.background;
  }};
  ${Button} & {
    border-radius: 0;
    background-color: ${({ transparent, invert, theme }) => {
      if (transparent) return "transparent";
      return invert ? theme.inverseBackground : theme.background;
    }}
`;

export { ButtonGroup, Button };
