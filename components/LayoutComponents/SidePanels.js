import React from 'react'
import Link from "next/link";
import {useRouter} from 'next/router'
import styles from './SidePanel.module.css';

function Sidepanel() {
    const router = useRouter();
    const TabList = [
        {id:0,name:"Sale",link:"sale"},
        {id:1,name:"Purchase",link:"purchase"},
        {id:2,name:"Customer",link:"customer"},
        {id:3,name:"Employee",link:"employee"},
    ];
    const username = "username"
    const style = {
      padding: "6px",
    }
   
  return (
      <>
        <div style={{height: "100%", width: "160px", position: "absolute", display: "flex", flexDirection: "column",alignItems:"center", borderRight:"2px solid blue"}}>
        Hi, {username}
          {TabList.map(item=>
            <span style={style} className={router.pathname===item.link?styles.tabSelected:styles.tabs } key={item.id}>
            <Link href={'/'+ item.link}>
              {item.name}
            </Link>
          </span>
          )}
        </div>
      </>
  )
}

export default Sidepanel