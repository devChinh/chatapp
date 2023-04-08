import axios from 'axios'
import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import ChatContainer from '../components/ChatContainer'
import Contacts from '../components/Contacts'
import Welcome from '../components/Welcome'
import '../styles/chat.css'
import { allUsersRoute, host } from '../utils/APIRoutes'
import { io } from "socket.io-client";


const Container = styled.div`
height : 100vh;
width : 100vw;
display : flex ;
flex-direction : column;
justify-content : center;
gap : 1rem;
align-items : center;
background-color : #131324;
`

function Chat() {

  const socket = useRef()
  const navigate = useNavigate()

  const [isLoader, setIsLoader] = useState(false)
  const [contacts, setContacts] = useState([])
  const [currentUser, setCurrentUser] = useState(undefined)
  const [currentChat, setCurrentChat] = useState(undefined)

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    const fetch = async () => {
      if (!localStorage.getItem("chat-app-user")) {
        navigate('/login')
      } else {
        setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")))
        setIsLoader(true)
      }
    }
    fetch()
  }, [navigate])

  useEffect(() => {
    const fetch = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data.data)
        } else {
          navigate('/setAvatar')
        }
      }
    }
    fetch()
  }, [currentUser , navigate])

  const handleChatChange = (chat) => {
    setCurrentChat(chat)
  }

  return (
    <Container>
      <div className="container">

        <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} />
        {
          isLoader && currentChat === undefined ? <Welcome currentUser={currentUser} /> : <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket} />
        }

      </div>
    </Container>
  )
}

export default Chat
