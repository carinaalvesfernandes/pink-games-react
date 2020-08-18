import React from "react";
import Navbar from "react-bootstrap/Navbar"; // utan dessa skulle koden inte fungera eftersom i vår kod använder vi <Navbar> & <Nav>
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";

/*toggle står för hamburgar ikonen när skärmen är mindre
Brand är ikonen
collapse står för att den är reponsive när skämren blir mindre
Link är själv knapparna/länkarna i nav baren

Filnamnet ska alltid vara samma som funktionen*/

function Navigation() {
  return (
    <Navbar collapseOnSelect expand="sm" bg="light" variant="light">
      <Link to="/" className="navbar-brand">
        Games
      </Link>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Link to="/memory" className="nav-link">
            Memory
          </Link>
          <Link to="/snake" className="nav-link">
            Snake
          </Link>
          <Link to="/minesweeper" className="nav-link">
            Minesweeper
          </Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Navigation;
