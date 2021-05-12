import React, { useState, useEffect, useRef } from "react";
import Header from "../../components/Header";
// import Controller from "../../components/Controller/Controller";
// import VidoeRoom from "../../components/VidoeRoom";
import Chart from "../../components/Chart/Chart";

import { createSocketConnectionInstance } from "../../Helper/socketConnection";
import { CopyToClipboard } from "react-copy-to-clipboard";

import CallIcon from "@material-ui/icons/CallEnd";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import ChatIcon from "@material-ui/icons/Chat";

import "./style.css";
function MeetingPage() {
  const [count, showCount] = useState(false);

  let socketInstance = useRef(null);
  const [micStatus, setMicStatus] = useState(true);
  const [camStatus, setCamStatus] = useState(true);
  const [streaming, setStreaming] = useState(false);
  const [chatToggle, setChatToggle] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [displayStream, setDisplayStream] = useState(false);
  const [messages, setMessages] = useState([]);

  const [wholeRoomID, setwholeRoomID] = useState("");

  useEffect(() => {
    return () => {
      socketInstance.current?.destoryConnection();
    };
  }, []);

  useEffect(() => {
    if (userDetails) startConnection();
  }, [userDetails]);

  const startConnection = () => {
    let params = { quality: 12 };
    socketInstance.current = createSocketConnectionInstance({
      updateInstance: updateFromInstance,
      params,
      userDetails,
    });
  };

  const updateFromInstance = (key, value) => {
    if (key === "streaming") setStreaming(value);
    if (key === "message") setMessages([...value]);
    if (key === "displayStream") setDisplayStream(value);
  };

  const handleMyCam = () => {
    if (!displayStream) {
      const { toggleVideoTrack } = socketInstance.current;
      toggleVideoTrack({ video: !camStatus, audio: micStatus });
      setCamStatus(!camStatus);
    }
  };
  const copyLink = (link) => {
    setwholeRoomID(link);
  };

  return (
    <div className="meeting__container">
      <div className="meeting__header">
        <h1>Realification</h1>
      </div>
      <div className="side__nav">
        <span className="active">
          <VideocamIcon />
        </span>
        <span>
          <CallIcon />
        </span>
        <span>
          <VideocamIcon />
        </span>
      </div>
      <div className="main__container">
        <div className="mini__nav">
          <div className="option__section">
            <div className="select__icon">
              <div className="people">p</div>
              <div className="person__count">
                <div>4</div>{" "}
                <svg
                  className="arrow__icon"
                  viewBox="0 0 17 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.5 3.95837V15.0417"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M13.4582 9.5L8.49984 15.0417L3.5415 9.5"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          <CopyToClipboard
            text={wholeRoomID}
            // onCopy={() => this.setState({ copied: true })}
          >
            <div
              className="invite__link"
              onClick={() => {
                copyLink(socketInstance.current.wholeRoomID);
              }}
            >
              Invite
            </div>
          </CopyToClipboard>
        </div>

        <div className="vidoe__section" id="vidoe__container"></div>
      </div>
      <div className="chart__section">
        <Chart />
      </div>
      <div className="btn__section">
        <div className="controller__container">
          <div>
            {micStatus ? (
              <MicIcon className="mic__icon icon" />
            ) : (
              <MicOffIcon className="micOff__icon icon" />
            )}
          </div>

          <CallIcon className="call__icon icon" />
          <div onClick={handleMyCam}>
            {camStatus ? (
              <VideocamIcon className="video__icon icon" />
            ) : (
              <VideocamOffIcon className="vidoeOff__icon icon" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MeetingPage;
