import React, { useEffect, useState } from 'react'
import css from './WaitingTimer.module.scss'
import waiting from '../../../images/empty1.svg'
import loader from '../../../images/loader1.gif'
import * as md from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const WaitingTimer = () => {
    const navigate = useNavigate();
    const [remainingTime, setRemainingTime] = useState(122);

    useEffect(() => {
      const timer = setInterval(() => {
        if (remainingTime > 0) {
          setRemainingTime(prevTime => prevTime - 1);
        }

      }, 1000);
  
      return () => clearInterval(timer);
    }, []);
  
    const formatTime = time => {
        if(time > 0){
            const minutes = Math.floor(time / 60);
            const seconds = time % 60;
        
            const formattedMinutes = String(minutes).padStart(2, '0');
            const formattedSeconds = String(seconds).padStart(2, '0');
        
            return `${formattedMinutes}:${formattedSeconds}`;
        }else{
            return `00:00`;
        }
    
    };

  return (
    <div className={css.wrapper}>
        <div className={css.content}>
            <div className={css.top}>
            <md.MdArrowBackIosNew onClick={()=> navigate('/home')} />
            <h1>Waiting for Ride Request</h1>
            </div>

            <div className={`${css.time}  border`}>
                <span>Time Remaining</span>
                {/* <span>02:00:01</span> */}
                <span>{formatTime(remainingTime)}</span>
            </div>

            <div className={css.img}>
                <img src={waiting} alt="" />
                <div className={css.ldsring}><div></div><div></div><div></div><div></div></div>
            </div>

            <button disabled={remainingTime > 0} style={remainingTime > 0 ? {opacity:'.3',userSelect:'none'} : {opacity:'1',userSelect:'auto'}}>Start Ride</button>
        </div>
    </div>
  )
}

export default WaitingTimer