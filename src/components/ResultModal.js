import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { saveScore } from "../utils";

function ResultModal({
  show,
  handleClose,
  header,
  body,
  fetchLeaderboard,
  saveScore,
}) {
  const [name, setName] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);

  useEffect(() => {
    if (show) {
      //fetchLeaderboard().then((l) => setLeaderboard(l));
      fetchLeaderboard().then(setLeaderboard);
    }
  }, [show]);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{header}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{body}</p>
        {!leaderboard && <p>loading leaderboard..</p>}
        {leaderboard && leaderboard.map((entry, i) => <p key={i}>{entry}</p>)}
        <Form.Control
          type="text"
          placeholder="Enter name"
          onChange={(event) => setName(event.target.value)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            if (name) {
              saveScore(name);
            }
            handleClose();
          }}
        >
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ResultModal;
