import { Avatar } from '@material-ui/core'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useState, useEffect, useContext } from 'react'
import { auth, db } from '../../firebase'
import getRecipientEmail from '../../utils/getRecipientEmail'
import { useCollection } from 'react-firebase-hooks/firestore'
import { useRouter } from 'next/router'
import styles from './chat.module.css'
import {AppContext} from '../../context/AppContextProvider'
import Image from 'next/image'
import useCurrentWidth from '../../hooks/useCurrentWidth'

function Chat({ id, users }) {

    const {messageUpdate, setMessageUpdate} = useContext(AppContext)
    let width = useCurrentWidth()

    const [sidebar, setSidebar] = useState('')
    const [latestMessage, setLatestMessage] = useState({})
    const router = useRouter()
    const [user] = useAuthState(auth)
    const [recipientSnapshot] = useCollection(
        db.collection('users').where('email', '==', getRecipientEmail(users, user))
    )
    const [messageSnapshot] = useCollection(db.collection('chats').where('users', 'array-contains', users[0] && users[1]))

    useEffect(() => {
        const allMessages = messageSnapshot?.docs?.[0]?.ref.collection("messages") 
        if (allMessages) { allMessages.orderBy("timestamp", "desc").limit(1).get().then((querySnapshot) => {
            setLatestMessage(querySnapshot?.docs[0]?.data())
        })}

        setMessageUpdate(false)
    },[messageUpdate])

    useEffect(() => {
        setSidebar(() => {
            const element = document.querySelector('.sidebar_sidebar__WwW84')
            return element
        })
    }, [])
    
    const enterChat = () => {
        router.push(`/chat/${id}`)
        if (width < 768) {
            sidebar.style.left = "-380px"
        }
    }

    const recipient = recipientSnapshot?.docs?.[0]?.data()
    const recipientEmail = getRecipientEmail(users, user)
    const recipientName = recipient?.name

  return (

    <div className={styles.container} id={id} onClick={enterChat}>
        <div className={styles["left-content"]} id={styles["left-content"]}>
            {recipient ? <div className={styles.avatar}>
                <Image 
                    src={recipient?.photoURL}
                    layout="fill"
                />
            </div> : <Avatar className={styles.avatar} >{recipientEmail[0]}</Avatar> }
            <div className={styles.recipient_info}>
                <h3 className="heading heading--3">{ recipient ? recipientName : recipientEmail }</h3>
                <span className={styles["latest-message_container"]}>
                    <span id={styles["latest-message_username"]} className="p-grey paragraph paragraph--2">{latestMessage?.username ? latestMessage?.username + ":" : "..."} &nbsp; </span> 
                    <span id={styles["latest-message_message"]}className="paragraph paragraph--2">{latestMessage?.message}</span>
                </span>
            </div>
        </div>
    </div>

  )
}

export default Chat