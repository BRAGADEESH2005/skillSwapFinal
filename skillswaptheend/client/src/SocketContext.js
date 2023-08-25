import React, { createContext, useEffect, useRef, useState } from "react";

import {io} from "socket.io-client";
import Peer from "simple-peer";

const SocketContext = createContext();

const socket = io("http://localhost:8800");

const ContextProvider =({children})=>{

    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [stream, setStream] = useState();
    const [name, setName] = useState('');
    const [call, setCall] = useState({});
    const [me, setMe] = useState('');
    const [isAudioMuted, setIsAudioMuted] = useState(true);
    const [isVideoMuted, setIsVideoMuted] = useState(true);


  
    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();
    console.log("Videoo reff outt",myVideo)
  
    useEffect( () => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((currentStream) => {
          setStream(currentStream);
          console.log("Current-stream",currentStream);
          console.log("Videoo reff",myVideo)
        if(myVideo.current !== undefined){
          myVideo.current.srcObject = currentStream;}
        });
  
       socket.on('me', (id) => setMe(id));
      console.log("Me Updateddd",me);
  
      socket.on('callUser', ({ from, name: callerName, signal }) => {
        setCall({ isReceivingCall: true, from, name: callerName, signal });
      });
    },[]);

    useEffect(() => {
        socket.on("video-disconnect", () => {
          // Reload the page when the hang-up event is received
          window.location.reload();
        });
      }, []);

      useEffect(() => {
        socket.on("callEnded", () => {
          // Reload the page when the call ended event is received
          window.location.reload();
        });
      }, []);
      const toggleAudio = () => {
        stream.getAudioTracks().forEach((track) => {
          track.enabled = !isAudioMuted;
        });
        setIsAudioMuted(!isAudioMuted);
      };
    
      const toggleVideo = () => {
        stream.getVideoTracks().forEach((track) => {
          track.enabled = !isVideoMuted;
        });
        setIsVideoMuted(!isVideoMuted);
      };



  
    const answerCall = () => {
      setCallAccepted(true);
  
      const peer = new Peer({ initiator: false, trickle: false, stream });
  
      peer.on('signal', (data) => {
        socket.emit('answerCall', { signal: data, to: call.from });
      });
  
      peer.on('stream', (currentStream) => {
        userVideo.current.srcObject = currentStream;
      });
  
      peer.signal(call.signal); //sets the incoming calls signalling dara to the peer so that it can initiate the signalling process
  
      connectionRef.current = peer;
    };
  
    const callUser = (id) => {
        console.log("Inside call Userrrr")
      const peer = new Peer({ initiator: true, trickle: false, stream });
  
      peer.on('signal', (data) => {
        socket.emit('callUser', { userToCall: id, signalData: data, from: me, name });
      });
  
      peer.on('stream', (currentStream) => {
        userVideo.current.srcObject = currentStream;
      });
  
      socket.on('callAccepted', (signal) => {
        setCallAccepted(true);
  
        peer.signal(signal);
      });
  
      connectionRef.current = peer;
    };
  
    const leaveCall = () => {
        setCallEnded(true);
        socket.emit("video-disconnect"); // Notify the other user
      window.location.reload();
        connectionRef.current.destroy();
      };

    return (
      <SocketContext.Provider value={{
        call, callAccepted, myVideo, userVideo, stream, name, setName,
        callEnded, me, callUser, leaveCall, answerCall,
        isAudioMuted, toggleAudio,
        isVideoMuted, toggleVideo
      }}>
        {children}
      </SocketContext.Provider>
      );
}

export { ContextProvider, SocketContext };
