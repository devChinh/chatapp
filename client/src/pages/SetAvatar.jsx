import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import loader from "../assets/loader.gif"
import '../styles/register.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import { setAvatarRoute } from "../utils/APIRoutes";
import { Buffer } from 'buffer';
import '../styles/setAvatar.css'


const Container = styled.div`
display : flex;
justify-content : center;
align-items : center;
flex-direction : column ;
gap :3rem;
height : 100vh;
width : 100vw;
background-color : #131324;
`

function SetAvatar() {

  const navigate = useNavigate()

  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);


  const api = "https://api.multiavatar.com/45678945";

  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  }

  useEffect(() => {
    if (!localStorage.getItem("chat-app-user")) {
      navigate('/login')
    }
  }, [navigate])

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("please select an avatar", toastOptions);
    } else {
      const user = await JSON.parse(localStorage.getItem("chat-app-user"))
      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar]
      })

      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem("chat-app-user", JSON.stringify(user))
        navigate('/chat')
      } else {
        toast.error("Error setting avatar .Plase try again", toastOptions)
      }
    }
  }

  useEffect(() => {
    const fetch = async () => {
      const data = []
      for (let i = 0; i < 4; i++) {
        try {
          const image = await axios.get(
            `${api}/${Math.round(Math.random() * 1000)}`
          );
          const buffer = Buffer(image.data)
          data.push(buffer.toString("base64"));
        } catch (error) {
          console.log('============= error', error)
        }
      }
      setAvatars(data);
      setIsLoading(false);
    }
    fetch()
  }, [])

  return (
    <>
      {
        isLoading ? <Container>
          <img src={loader} alt="" className="loader" />
        </Container> :
          <Container>

            <div className="title-container">
              <h1>
                Pick an avatar as your profile
              </h1>
            </div>

            <div className="avatars">
              {avatars.map((avatar, index) => {
                return (
                  <div key={index} className={`avatar ${selectedAvatar === index ? 'selected' : ""}`}>
                    <img
                      src={`data:image/svg+xml;base64,${avatar}`}
                      alt="avatar"
                      key={avatar}
                      onClick={() => setSelectedAvatar(index)}
                    />
                  </div>
                )
              })}
            </div>

            <button className="submit-btn" onClick={() => setProfilePicture()}>Set as Profile Picture</button>
          </Container>
      }
      <ToastContainer />
    </>
  )
}

export default SetAvatar