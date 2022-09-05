import Head from 'next/head'
import Sidebar from '../components/sidebar/Sidebar'
import {db} from '../firebase'
import {useCollection} from 'react-firebase-hooks/firestore'
import { useRouter } from 'next/router'
import { HiMenu } from 'react-icons/hi'
import Image from 'next/image'
import Emblem from '../public/flick-emblem.png'
import MessageGif from '../public/message-gif.gif'
import { useState, useEffect } from 'react'

export default function Home({routeEmail}) {

  const router = useRouter()
  const userChatRef = db.collection('chats').where('users', 'array-contains', routeEmail)
  const [chatsSnapshot] = useCollection(userChatRef)
  const [sidebar, setSidebar] = useState('')

  if (userChatRef && chatsSnapshot) {
    let id = chatsSnapshot?.docs[0]?.id
    if (id) {
      router.push(`/chat/${id}`)
    }
  }

  useEffect(() => {
    setSidebar(() => {
      const element = document.querySelector('.sidebar_sidebar__WwW84')
      return element
    })
  }, [])

  function handleSidebar() {
    if(sidebar.offsetLeft < 0) {
        sidebar.style.left = '0px'
    } else if (sidebar.offsetLeft === 0) {
        sidebar.style.left = "-320px"
    }
}

  return (
    <div className="App" >
      <Head>
        <title>Flick</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/flick-emblem.png" />
      </Head>

      <Sidebar/>
      <div className="home-page">
        <div className="header">
            <HiMenu className="menu-icon" onClick={handleSidebar} />
            <div className="header--center">
              <div className="flick-logo_container">
                <span id="emblem-image"><Image src={Emblem} height={20} width={20}/></span>
                <h3 id="emblem-heading" className="heading heading--2">lick</h3>
              </div>
            </div>
            <div className="header_icons">
              <div className="beta-badge">
                beta
              </div>
            </div>
        </div>
        <div className="home-page-content">
          <h1 className="heading heading--1 landing-page-heading">Hey, I&apos;m Flick!</h1>
          <Image src={MessageGif}/>
          <div className="home-page_brief-container">
            <p className="paragraph paragraph--1">Navigate to the sidebar to start or continue a conversation!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
