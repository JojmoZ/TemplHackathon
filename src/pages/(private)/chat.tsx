import { idlFactory , canisterId } from "@/declarations/user";
import { Actor, HttpAgent } from "@dfinity/agent";
import { useNavigate } from "react-router";
import { Message } from "@/declarations/message/message.did";
import { RoomUserService } from "@/services/room-users.service";
import { RoomService } from "@/services/room.service";
import { UserService } from "@/services/user.service";
import { webSocket } from "@/utils/config/web-socket"
import { roomDto, roomSchema } from "@/utils/model/dto/create-room.dto";
import { generateRandomIdentity } from "ic-websocket-js";
import { join } from "path";
import { useEffect, useState } from "react";
import { createTracing } from "trace_events";

let roomService = new RoomService();
let userService = new UserService();
let roomUserService = new RoomUserService();


interface LoginPageProps {
  setUsername: (username: any) => void;
}
  
 export const ChatPage: React.FC<LoginPageProps> = ({setUsername}) => {
    const navigate = useNavigate();
   
    webSocket.onopen = () => {
        console.log("Connected to WebSocket");
    };

    webSocket.onmessage = (event) => {
        console.log("Received message:", event.data);
    };

    webSocket.onclose = () => {
        console.log("WebSocket connection closed");
    };

    webSocket.onerror = (error) => {
        console.log("WebSocket error:", error);
    };

    const handleLogout = async () => {
        try {
          const agent = new HttpAgent({ host: 'http://127.0.0.1:4943' });
          await agent.fetchRootKey();
    
          const backend = Actor.createActor(idlFactory, { agent, canisterId });
    
          await backend.logout();
          setUsername(null); // Clear user in frontend state
          navigate('/login');
        } catch (err) {
          console.error('Logout Error:', err);
        }
      };

    const sendMessage = async () => {
        const principal = await userService.getCallerPrincipal(1);
        console.log(principal)
        try {
            const msg : Message = {
                message : "Ping",
                room_id : "af6dc03e-d335-423a-9aa5-190a1daa5d80",
                created_at : BigInt(new Date().getTime()),
                user_id : principal
            }
            webSocket.send(msg);
        } catch (e) {
            console.error(e)
        }
    };

    const joinRoom = async() => {
        const response = await roomService.joinRoom("af6dc03e-d335-423a-9aa5-190a1daa5d80");
        console.log(response)
    }

    const createRoom = async () => {
        const chatRoom : roomDto = roomSchema.parse({
            room_id : 'af6dc03e-d335-423a-9aa5-190a1daa5d80',
            room_name : "GUIGI"
        })
        const response = await roomUserService.userJoinRoom("af6dc03e-d335-423a-9aa5-190a1daa5d80");
        console.log(response)
        roomService.createRoom(chatRoom)
    }

    useEffect(() => {
        const response = roomService.getRooms().then(res => {
            console.log(res)

        })
        // console.log(response.data)
    },[])


    

    return (
      <div>
        <h1>Chat Page</h1>
        <div>
            <h1>Chat Page</h1>
            <button onClick={() => createRoom()}>Create Room</button>
            <button onClick={() => joinRoom()}>Join Room</button>
            <button onClick={sendMessage}>Send</button>
        </div>
        <button onClick={sendMessage}></button>

        <button onClick={handleLogout}>Logout</button>
      </div>


    );
}