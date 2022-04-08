import Toggle from "react-toggle";
import "./react-toggle.css"
import styled from "styled-components";
import chroma from "chroma-js";

const StyledToggle = styled(Toggle)`
  & .react-toggle-track,
  &.react-toggle--checked .react-toggle-track {
    background-color: ${({ theme }) => theme.backgroundL2} !important;
  }

  & .react-toggle-track-x,
  & .react-toggle-track-check {
    display: flex;
    height: 100%;
    margin: 0;
    padding: 0;
    align-items: center;
    color: ${({ theme }) => theme.text};
  }
  &.react-toggle--focus .react-toggle-thumb {
    box-shadow: 0px 0px 5px 3px ${({ theme }) => chroma(theme.accent).alpha(0.5)};
  }

  & .react-toggle-thumb {
    background-color: ${({ theme }) => theme.accent} !important;
    border: 2px solid ${({ theme }) => chroma(theme.accent).alpha(0.5)} !important;
  }

  &:hover {
    .react-toggle-track,
    &.react-toggle--checked .react-toggle-track {
      background-color: ${({ theme }) => theme.backgroundL3} !important;
    }
  }
`;

export default StyledToggle;
