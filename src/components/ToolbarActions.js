import React from "react";
import { Button } from "./Button.js";
import Toggle from "./Toggle";
import styled, { ThemeContext } from "styled-components";
import { themes } from "../utils/theme.js";
import { getToday } from "../utils/lib.js";

import {
  RiSunLine,
  RiMoonLine,
  RiCalendarEventLine,
  RiShareBoxLine,
} from "react-icons/ri";

const Container = styled.div`
  height: 2rem;
  display: flex;
  align-content: center;
  align-self: center;
  align-items: center;
  justify-content: space-between;
`;
const Split = styled.div`
  width: 30%;
  display: flex;
  justify-content: center;
`;

const ToolbarActions = ({ setDate, setTheme, openExport }) => {
  const theme = React.useContext(ThemeContext);

  const handleSetTheme = (e) =>
    setTheme(e.target.checked ? themes.LIGHT : themes.DARK);

  return (
    <Container>
      <Split>
        <Button
          iconLeft
          transparent
          type="button"
          onClick={() => setDate(getToday())}
        >
          <RiCalendarEventLine />
          Today
        </Button>
      </Split>
      <Split>
        <Button iconLeft transparent type="button" onClick={openExport}>
          <RiShareBoxLine />
          Share
        </Button>
      </Split>
      <Split end>
        <Toggle
          defaultChecked={theme.name === themes.LIGHT}
          icons={{
            checked: <RiSunLine size={14} />,
            unchecked: <RiMoonLine size={14} />,
          }}
          onChange={handleSetTheme}
        />
      </Split>
    </Container>
  );
};

export default ToolbarActions;
