import React from 'react'
import Header from './Header'
import Sidepanel from './SidePanels'

function Layout(props) {
  return (
    <div>
        <Header/>
        <Sidepanel/>
        {props.children}
    </div>
  )
}

export default Layout