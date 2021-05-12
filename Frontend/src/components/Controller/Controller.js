import React, { useState } from "react";
import { createSocketConnectionInstance } from "../../Helper/socketConnection";

import CallIcon from "@material-ui/icons/CallEnd";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import ChatIcon from "@material-ui/icons/Chat";
import { VideocamOff } from "@material-ui/icons";

import "./style.css";

function Controller() {
  const [micStatus, setMicStatus] = useState(true);
  const [camStatus, setCamStatus] = useState(true);
  const [streaming, setStreaming] = useState(false);
  const [chatToggle, setChatToggle] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [displayStream, setDisplayStream] = useState(false);
  const [messages, setMessages] = useState([]);

  return (
    <div className="controller__container">
      <div>
        {micStatus ? (
          <MicIcon className="mic__icon icon" />
        ) : (
          <MicOffIcon className="micOff__icon icon" />
        )}
      </div>

      <CallIcon className="call__icon icon" />
      <div>
        {camStatus ? (
          <VideocamIcon className="video__icon icon" />
        ) : (
          <VideocamOffIcon className="vidoeOff__icon icon" />
        )}
      </div>
    </div>
  );
}

export default Controller;
