import React from 'react'
// import { useState, CSSProperties } from "react";
// import ClipLoader from "react-spinners/ClipLoader";
const spinner = () => {
  return (
<div className="d-flex justify-content-center spinner">
  <div className="spinner-border" role="status">
    <span className="visually-hidden">Loading...</span>
  </div>
</div>
  )
}

export default spinner