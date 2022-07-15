import React from 'react'

function Recipient(props) {
  return (
    <div>
      <b style={{display:`${props.customerSelected['user-name']?"block":"none"}`}}>{props.customerSelected['user-name']}</b>
      <div style={{display:`${props.customerSelected.address1?"block":"none"}`}}>{props.customerSelected.address1}</div>
      <div style={{display:`${props.customerSelected.address2?"block":"none"}`}}>{props.customerSelected.address2}</div>
      <div style={{display:`${props.customerSelected.location?"block":"none"}`}}>{props.customerSelected.location}</div>
      <div style={{display:`${props.customerSelected['client-name']?"block":"none"}`}}>{props.customerSelected['client-name']}</div>
      <div style={{display:`${props.customerSelected['billing-type']?"block":"none"}`}}>Billing-type: {props.customerSelected['billing-type']}</div>
    </div>
  )
}

export default Recipient