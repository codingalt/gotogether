import React, { useEffect, useState } from 'react'
import Home from '../components/Home/Home'
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const [show,setShow] = useState(null);
  useEffect(()=>{
      const authToken = localStorage.getItem('jwtoken_auth');
      if(authToken){
          navigate('/home');
      }else{
        setShow(true);
      }
  },[]);
  return (
    show && <Home />
  )
}

export default HomePage