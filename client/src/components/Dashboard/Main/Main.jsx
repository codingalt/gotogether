import React, { useContext, useEffect, useMemo, useState } from "react";
import { GoogleMap, Marker, DirectionsRenderer, InfoWindow } from "@react-google-maps/api";
import css from './Main.module.scss';
import * as md from 'react-icons/md'
import * as io from 'react-icons/io5'
import * as im from 'react-icons/im'
import * as hi from 'react-icons/hi'
import * as bi from 'react-icons/bi'
import MainContext from "../../Context/MainContext";
import { ReverseGeoCode } from "./ReverseGeoCode";
import pin from '../../../images/pin.png'
import icon from '../../../images/location.png'
import { useSelector } from "react-redux";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

var center = {
  lat: 30.181459,
  lng: 	71.492157,
};

const divStyle = {
  background: `white`,
  padding: 5,
  width: 'auto'
}

navigator.geolocation.getCurrentPosition(position => 
  {
    //  setMapCenter({lat:position.coords.latitude, lng:position.coords.longitude})      
    //  center.lat = position.coords.latitude;
    //  center.lng = position.coords.longitude;
  }
  )

  console.log(center);

const Main = () => {
  const {isLoaded,campaign,setCampaign,renderDirection,confirmLocation, setConfirmLocation, pinIcon, setPinIcon,origin,setStartingLocation,setFinalLocation,setSidebar} = useContext(MainContext);
  const { isDriver,name} = useSelector((state) => state.user);
  const [mapCenter, setMapCenter] = useState();
  // console.log(mapCenter);
  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [mapref, setMapRef] = useState(null);
  const [infoWindow, setInfoWindow] = useState(null);
  const [currentLocation,setCurrentLocation] = useState();

  useEffect(()=>navigator.geolocation.getCurrentPosition(position => 
    {
      // setMapCenter({lat:position.coords.latitude, lng:position.coords.longitude})      
      setCurrentLocation({lat:position.coords.latitude, lng:position.coords.longitude})      
    }
  ),[]);

    const handleCenterChanged = () => {
      setInfoWindow(null)
      if (mapref) {
        const newCenter = mapref.getCenter();
        setMapCenter({lat: newCenter.lat(),lng: newCenter.lng()})
      }
    };

    const handleDragEnd = async()=>{
      if(confirmLocation){
        var res = await ReverseGeoCode(mapref,mapCenter);
        setInfoWindow(res)
        setPinIcon(true);
      }
    }  

    const handleConfirmLocation = ()=>{
      if(origin){
        setStartingLocation(infoWindow)
      }else{
        setFinalLocation(infoWindow)
      }
    }

  return isLoaded ? (
    <div className={css.wrapper}>
      <div className={css.container}>    
        <GoogleMap
      mapContainerStyle={containerStyle}
      center={currentLocation}
      zoom={confirmLocation ? 16 : 12}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        zoomControl: false
      }}
      onLoad={map=> setMapRef(map)}
      onCenterChanged={handleCenterChanged}
      onDragEnd={handleDragEnd}
    >
      {
      !pinIcon && <Marker position={mapCenter} />
      }
      {
        pinIcon &&
        <>
        <Marker position={mapCenter} icon={pin}  />
        </> 
      }
      {
        infoWindow &&
        <InfoWindow position={mapCenter}>
        <div style={divStyle}>
          <p>{infoWindow}</p>
        </div>
      </InfoWindow>
      }
      {
        renderDirection && <DirectionsRenderer directions={renderDirection} />
      }
    </GoogleMap>
           
    </div>

    {/* Drawer Button  */}
    <div className={`${css.drawer} shadow`} onClick={()=> setSidebar(true)}>
      <hi.HiOutlineMenuAlt3 />
    </div>

    {/* Confirm Location Button  */}
    {
      confirmLocation &&
      <div className={css.confirmLocation} onClick={()=>{}}>
      <button onClick={()=> {setCampaign(true);setConfirmLocation(false);handleConfirmLocation();}}>Confirm Location</button>
    </div>
    }
    
    {/* <div className={`${css.userLocation} shadow`}>
      <div className={css.icon} onClick={()=> mapref.panTo(mapCenter)}><bi.BiCurrentLocation /></div>
      <div className={css.location}>Northern bypass, Multan</div>
    </div> */}

    {
       !confirmLocation &&
      <div className={`${css.infoContainer} shadow`}>
      <div className={css.maximizeLine}></div>
      <div className={css.header}>
        <span>Where are you going {" "}<span>{name.split(' ')[0]}?</span></span>
      </div>
      {
        isDriver ? (
          <div className={css.recentLocations}>
        <div className={`${css.card} shadow`} onClick={()=> setCampaign(!campaign)}>
          <div className={css.icon} style={{background:'#00ACF7'}}>
            <md.MdLocationOn style={{fontSize:'1.9rem'}} />
          </div>
          <div className={css.title}>
            <span>New Trip</span>
            <span>Tab for location</span>
          </div>
        </div>
        <div className={`${css.card} shadow`} onClick={()=> setCampaign(!campaign)}>
          <div className={css.icon} style={{background:'#F55463'}}>
            <io.IoBagRemoveSharp style={{fontSize:'1.6rem'}} />
          </div>
          <div className={css.title}>
            <span>Work</span>
            <span>38 minutes</span>
          </div>
        </div>
        <div className={`${css.card} shadow`} onClick={()=> setCampaign(!campaign)}>
          <div className={css.icon} style={{background:'#FFAC1F'}}>
            <im.ImAirplane />
          </div>
          <div className={css.title}>
            <span>Airport</span>
            <span>20 minutes</span>
          </div>
        </div>
      </div>
        ) : (
          <div className={css.inputBox} onClick={()=> setCampaign(!campaign)}>Search Location</div>
        )
      }   

    </div>
     } 


    </div>
    
  ) : (
    <></>
  );
};

export default Main;
