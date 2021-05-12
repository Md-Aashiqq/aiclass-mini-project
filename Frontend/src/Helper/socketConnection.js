import io from "socket.io-client";
import Peer from "peerjs";

const initializePeerConnection = () => {
  // return new Peer('', {
  //     host: "localhost:9000", // need to provide peerjs server endpoint
  //                           // (something like localhost:9000)
  //     secure: true,

  // });

  return new Peer();
};
const websocket = "http://localhost:3000";

let socketInstance = null;
let peers = {};
const initializeSocketConnection = () => {
  console.log("socket");
  // return io(websocket)
  return io("http://localhost:3000");
};

class Connection {
  videoContainer = {};
  message = [];
  settings;
  streaming = false;
  myPeer;
  socket;
  isSocketConnected = false;
  isPeersConnected = false;
  myID = "";
  wholeroomID = "";

  constructor(settings) {
    this.settings = settings;
    this.myPeer = initializePeerConnection();
    this.socket = initializeSocketConnection();
    this.initializeSocketEvents();
    this.initializePeersEvents();
  }

  initializeSocketEvents = () => {
    this.socket.on("connect", () => {
      console.log("socket connected");
    });
    this.socket.on("user-disconnected", (userID) => {
      console.log("user disconnected-- closing peers", userID);
      peers[userID] && peers[userID].close();
      this.removeVideo(userID);
    });
    this.socket.on("disconnect", () => {
      console.log("socket disconnected --");
    });
    this.socket.on("error", (err) => {
      console.log("socket error --", err);
    });
  };

  initializePeersEvents = () => {
    console.log(this.myPeer);
    this.myPeer.on("open", (id) => {
      this.myID = id;
      const roomID = window.location.pathname.split("/")[2];
      // const roomID ='sdsafwerefrdf23'
      const userData = {
        userID: id,
        roomID,
      };
      this.wholeRoomID = roomID;
      console.log("peers established and joined room", userData);
      this.socket.emit("join-room", userData);
      this.setNavigatorToStream();
    });
    this.myPeer.on("error", (err) => {
      console.log("peer connection error", err);
      this.myPeer.reconnect();
    });
  };

  setNavigatorToStream = () => {
    this.getVideoAudioStream().then((stream) => {
      if (stream) {
        this.streaming = true;
        this.createVideo({ id: this.myID, stream });
        this.setPeersListeners(stream);
        this.newUserConnection(stream);
      }
    });
  };

  getVideoAudioStream = (video = true, audio = true) => {
    let quality = this.settings.params?.quality;
    if (quality) quality = parseInt(quality);
    const myNavigator =
      navigator.mediaDevices.getUserMedia ||
      navigator.mediaDevices.webkitGetUserMedia ||
      navigator.mediaDevices.mozGetUserMedia ||
      navigator.mediaDevices.msGetUserMedia;
    return myNavigator({
      video: video
        ? {
            frameRate: quality ? quality : 12,
            noiseSuppression: true,
            width: { min: 640, ideal: 1280, max: 1920 },
            height: { min: 480, ideal: 720, max: 1080 },
          }
        : false,
      audio: audio,
    });
  };
  createVideo = (createObj) => {
    if (!this.videoContainer[createObj.id]) {
      this.videoContainer[createObj.id] = {
        ...createObj,
      };
      const roomContainer = document.getElementById("vidoe__container");
      const videoContainer = document.createElement("div");
      const video = document.createElement("video");
      video.srcObject = this.videoContainer[createObj.id].stream;
      video.id = createObj.id;
      video.autoplay = true;
      if (this.myID === createObj.id) video.muted = true;
      videoContainer.appendChild(video);
      roomContainer.append(videoContainer);
    } else {
      document.getElementById(createObj.id).srcObject = createObj.stream;
    }
  };
  setPeersListeners = (stream) => {
    this.myPeer.on("call", (call) => {
      call.answer(stream);
      call.on("stream", (userVideoStream) => {
        console.log("user stream data", userVideoStream);
        this.createVideo({ id: call.metadata.id, stream: userVideoStream });
      });
      call.on("close", () => {
        console.log("closing peers listeners", call.metadata.id);
        this.removeVideo(call.metadata.id);
      });
      call.on("error", () => {
        console.log("peer error ------");
        this.removeVideo(call.metadata.id);
      });
      peers[call.metadata.id] = call;
    });
  };
  newUserConnection = (stream) => {
    this.socket.on("new-user-connect", (userData) => {
      console.log("New User Connected", userData);
      this.connectToNewUser(userData, stream);
    });
  };

  connectToNewUser(userData, stream) {
    const { userID } = userData;
    const call = this.myPeer.call(userID, stream, {
      metadata: { id: this.myID },
    });
    call.on("stream", (userVideoStream) => {
      this.createVideo({ id: userID, stream: userVideoStream, userData });
    });
    call.on("close", () => {
      console.log("closing new user", userID);
      this.removeVideo(userID);
    });
    call.on("error", () => {
      console.log("peer error ------");
      this.removeVideo(userID);
    });
    peers[userID] = call;
  }
  removeVideo = (id) => {
    delete this.videoContainer[id];
    const video = document.getElementById(id);
    if (video) video.remove();
  };

  toggleVideoTrack = (status) => {
    const myVideo = this.getMyVideo();
    // @ts-ignore
    if (myVideo && !status.video)
      myVideo.srcObject?.getVideoTracks().forEach((track) => {
        if (track.kind === "video") {
          // track.enabled = status.video;
          // this.socket.emit('user-video-off', {id: this.myID, status: true});
          // changeMediaView(this.myID, true);
          !status.video && track.stop();
        }
      });
    else if (myVideo) {
      // this.socket.emit('user-video-off', {id: this.myID, status: false});
      // changeMediaView(this.myID, false);
      this.reInitializeStream(status.video, status.audio);
    }
  };

  getMyVideo = (id = this.myID) => {
    return document.getElementById(id);
  };

  reInitializeStream = (video, audio, type = "userMedia") => {
    // @ts-ignore
    const media =
      type === "userMedia"
        ? this.getVideoAudioStream(video, audio)
        : navigator.mediaDevices.getDisplayMedia();
    return new Promise((resolve) => {
      media.then((stream) => {
        // @ts-ignore
        const myVideo = this.getMyVideo();
        if (type === "displayMedia") {
          this.toggleVideoTrack({ audio, video });
          this.listenToEndStream(stream, { video, audio });
          this.socket.emit("display-media", true);
        }
        checkAndAddClass(myVideo, type);
        this.createVideo({ id: this.myID, stream });
        replaceStream(stream);
        resolve(true);
      });
    });
  };

  listenToEndStream = (stream, status) => {
    const videoTrack = stream.getVideoTracks();
    if (videoTrack[0]) {
      videoTrack[0].onended = () => {
        this.socket.emit("display-media", false);
        this.reInitializeStream(status.video, status.audio, "userMedia");
        this.settings.updateInstance("displayStream", false);
        this.toggleVideoTrack(status);
      };
    }
  };

  destoryConnection = () => {
    const myMediaTracks = this.videoContainer[this.myID]?.stream.getTracks();
    myMediaTracks?.forEach((track) => {
      track.stop();
    });
    socketInstance?.socket.disconnect();
    this.myPeer.destroy();
  };
}

const checkAndAddClass = (video, type = "userMedia") => {
  if (video?.classList?.length === 0 && type === "displayMedia")
    video.classList.add("display-media");
  else video.classList.remove("display-media");
};
const replaceStream = (mediaStream) => {
  Object.values(peers).map((peer) => {
    peer.peerConnection?.getSenders().map((sender) => {
      if (sender.track.kind == "audio") {
        if (mediaStream.getAudioTracks().length > 0) {
          sender.replaceTrack(mediaStream.getAudioTracks()[0]);
        }
      }
      if (sender.track.kind == "video") {
        if (mediaStream.getVideoTracks().length > 0) {
          sender.replaceTrack(mediaStream.getVideoTracks()[0]);
        }
      }
    });
  });
};
export function createSocketConnectionInstance(settings = {}) {
  return (socketInstance = new Connection(settings));
}
