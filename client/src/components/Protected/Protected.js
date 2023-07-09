import React, { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const Protected = ({Component}) => {
    const navigate = useNavigate();
    const [show,setShow] = useState(null);
    useEffect(()=>{
        const authToken = localStorage.getItem('jwtoken_auth');
        if(!authToken){
            navigate('/');
        }else{
            setShow(true)
        }
    },[]);
  return (
        show && <Component />
  )
}

export default Protected