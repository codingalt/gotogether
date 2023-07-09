import React from 'react'
import { TailSpin } from 'react-loader-spinner'

const Loader = ({width,color}) => {
  return (
    <TailSpin
  height={width}
  width={width}
  color= {color}
  ariaLabel="tail-spin-loading"
  radius="1"
  wrapperStyle={{}}
  wrapperClass=""
  visible={true}
/>
  )
}

export default Loader