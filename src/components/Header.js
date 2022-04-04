import React from "react";
import { Navbar, Button } from "react-bootstrap";

const Header = ({ logoutHandler, toggleTheme }) => {
  return (
    <Navbar className="justify-content-between">
      <Navbar.Brand>Namuhla</Navbar.Brand>
      <Navbar.Collapse className="justify-content-end">
        <Button
          variant="primary"
          className="btn-margin logoutBtn"
          onClick={logoutHandler}
        >
          Log Out
        </Button>
      </Navbar.Collapse>

      <Button variant="secondary" type="button" onClick={toggleTheme}>
        ☀
      </Button>
    </Navbar>
  );
};

export default Header;
