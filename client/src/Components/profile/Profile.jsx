import "./profile.css"
import Feed from "../feed/Feed";
import Rightbar from "../rightbar/Rightbar";
import Sidebar from "../sidebar/Sidebar";
import Topbar from "../topbar/Topbar";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user,setUser] = useState({});
  const username = useParams().username;


  useEffect(()=>{
    const fetchUser = async () => {
        const res = await axios.get(`/users?username=${username}`);
        setUser(res.data);
    };
    fetchUser();
  }, [username]);

  return (
    <>
    <Topbar/>
    <div className="profile">
    <Sidebar/>
    <div className="profileRight">
        <div className="profileRightTop">
            <div className="profileCover">
            <img className="profileCoverImg" 
            src={user.coverPicture || PF+"D.webp"} alt=""/>
            <img className="profileUserImg" 
            src={user.profilePicture || PF+"noAvatar.jpg"} alt=""/>
            </div>
            <div className="profileInfo">
                <h4 className="profileInfoName">{user.username}</h4>
                <span className="profileInfoDesc">{user.desc}</span>
            </div>
        </div>
        <div className="profileRightBottom">
        <Feed username={username}/>
        <Rightbar user={user}/>
        </div>
    </div>
    </div>
    
    </>
  )
}
