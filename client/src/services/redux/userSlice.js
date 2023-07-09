import { createSlice } from '@reduxjs/toolkit'
import { passengerRequestApi, useGetPassengerRequestsQuery } from '../api/passengerRequestApi';
import axios from 'axios';

const initialState = {
    name: '',
    phone: '',
    userId: '',
    token: '',
    isDriver: null,
    profileImg: '',
    totalRating: 0,
    totalReviewsGiven: 0
  }

  export const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        setPhoneNumber: (state,action) => {
        state.phone = action.payload
      },

      setUserData: (state,action) =>{
        state.userId = action.payload.userId;
        state.token = action.payload.token;
      },

      setProfileData: (state,action) =>{
        state.isDriver = action.payload.isDriver;
        state.name = action.payload.name;
        state.userId = action.payload.userId;
        state.phone = action.payload.phone;
        state.profileImg = action.payload.profileImg;
        state.rating = action.payload.rating;
        state.totalRating = action.payload.totalRating;
        state.totalReviewsGiven = action.payload.totalReviewsGiven;
      }
    
    },
  });

  // export const requestsRefetch = () => async(id) => {
  //   console.log(id);
  //   const { data } = await axios.get(
  //     `http://localhost:5000/passenger/request/${id}`,
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Authorization": `Bearer ${localStorage.getItem("jwtoken_auth")}`,
  //       },
  //     }
  //   ); 
  //   console.log('Request data redux', data);
  // };

  export const {setPhoneNumber, setUserData,setProfileData} = userSlice.actions;
  export default userSlice.reducer;