import React, { useState } from "react";
import styled from "styled-components";
import Picker from "emoji-picker-react";
import {  IoMdSend } from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs";
import "../styles/chatInput.css";

function ChatInput({handleSendMsg}) {

  const [showEmojiPicker , setShowEmojiPicker] = useState(false)

  const [msg , setMsg] = useState('')

  const handleEmojiPickerHideShow = (e) => {
    setShowEmojiPicker(!showEmojiPicker)
  }

  const handleEmojiClick = (e , emoji) => {
    let message = msg
    message += emoji.emoji
    setMsg(message)
  }

  const sendChat = (e) => {
    e.preventDefault()
    if(msg.length > 0){
      handleSendMsg(msg)
      setMsg('')
    }
  }

  return (
    <Container>
        <div className="button-container">
          <div className="emoji">
            <BsEmojiSmileFill onClick={handleEmojiPickerHideShow}/>
            {
              showEmojiPicker && <Picker onEmojiClick={handleEmojiClick}/>
            }
          </div>
        </div>
        <form className="input-container" onSubmit = {e => sendChat(e)}>
          <input type="text" placeholder="type your message here" value={msg} onChange={e => setMsg(e.target.value)} />
          <button className="submit">
            <IoMdSend />
          </button>
        </form>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 5% 95%;
  background-color: #080420;
  padding: 0 2rem;
  height : 10%;
`;

export default ChatInput;
