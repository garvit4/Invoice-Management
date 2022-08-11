import React from 'react'

function Header() {
  return (
      <div style={{width: "100%", height:"5rem", backgroundColor: "#161716", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <big style={{color: "#e4eae4",marginLeft:"10px",fontSize:"40px"}}>
        Codash<br/>
        Solution
        </big>
        <div style={{color: "#e4eae4",fontSize:"30px"}}>
        <b>Invoice Management System</b>
        </div>
        <div style={{color: "#e4eae4",marginRight:"6px",fontSize:"20px"}}>
        Logout
        </div>
      </div>
  )
}

export default Header