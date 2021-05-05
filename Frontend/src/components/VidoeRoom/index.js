import React , {useState,useRef,useEffect} from 'react'
import {createSocketConnectionInstance} from "../../Helper/socketConnection";


function VideoRoom () {

     let socketInstance = useRef(null);
    const [micStatus, setMicStatus] = useState(true);
    const [camStatus, setCamStatus] = useState(true);
    const [streaming, setStreaming] = useState(false);
    const [chatToggle, setChatToggle] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const [displayStream, setDisplayStream] = useState(false);
    const [messages, setMessages] = useState([]);
 
    useEffect(() => {
        startConnection();
    }, []);
    const startConnection = () => {
        const params = {quality: 12}
        socketInstance.current = createSocketConnectionInstance({
            params
        });

        console.log(socketInstance.current)
    }

    // const handleDisconnect = () => {
    //     socketInstance.current?.destoryConnection();
    //     props.history.push('/');
    // }



    return (
        <div>

            as  

        </div>
   
   
   )
}

export default VideoRoom

