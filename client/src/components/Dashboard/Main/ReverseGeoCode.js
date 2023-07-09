import Geocode from "react-geocode";
import origin from '../../../images/pin.png'
import { useContext } from "react";
import MainContext from "../../Context/MainContext";
import pin from '../../../images/pin.png'

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API);
Geocode.setLanguage("en");
Geocode.setLocationType("ROOFTOP");

export const ReverseGeoCode = async(map,mapCenter)=> {
    // eslint-disable-next-line no-undef
    const geocoder = new google.maps.Geocoder();
    // eslint-disable-next-line no-undef
    const infowindow = new google.maps.InfoWindow();
    const latlng = {
      lat: parseFloat(mapCenter.lat),
      lng: parseFloat(mapCenter.lng),
    };

    try {
      const result = await geocoder.geocode({ location: latlng })
      // map.setZoom(12);
      console.log(result.results[0].formatted_address);
      return result.results[0].formatted_address;
    } catch (error) {
      console.log(error);
    }
   
}