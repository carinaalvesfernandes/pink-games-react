import React from "react";
import Button from "react-bootstrap/Button";
import "./StatusBar.css";

// det går att skriva (props) istället för {status} men då skriver man props.status
function StatusBar({ status1, status2, onRestart, onShowLeaderboard }) {
  // status is a prop
  return (
    <div className="status-bar">
      <div className="status-container">
        <p className="status">{status1}</p>
        <p className="status">{status2}</p>
      </div>
      <Button variant="light" className="button" onClick={onRestart}>
        Restart
      </Button>
      <Button variant="light" className="button" onClick={onShowLeaderboard}>
        Leaderboard
      </Button>
    </div>
  );
}

export default StatusBar;
