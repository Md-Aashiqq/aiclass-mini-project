import React, { useState } from "react";
import Header from "../../components/Header";
import "./style.css";
function MeetingPage() {
  const [count, showCount] = useState(false);

  return (
    <div className="meeting__container">
      <div className="meeting__header">
        <h1>Realification</h1>
      </div>
      <div className="side__nav">
        <span className="active">Home</span>
        <span>chat</span>
        <span>Meet</span>
        <span>Noti</span>
      </div>
      <div className="main__container">
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
        <div className="vidoe__section" id="vidoe__container">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div className="chart__section">chart</div>
      <div className="btn__section">btn</div>
    </div>
  );
}

export default MeetingPage;
