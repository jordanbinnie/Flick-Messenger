import { useAuthState } from 'react-firebase-hooks/auth'
import { useState } from 'react'
import { auth, db } from '../../firebase'
import moment from 'moment'
import styles from './message.module.css'
import { useCollection } from 'react-firebase-hooks/firestore'
import { useRouter } from 'next/router'
import ImageMessage from '../image-message/ImageMessage'
import { FaHeart } from 'react-icons/fa'
import Image from 'next/image'

function Message({user, message, id}) {
    const [userLoggedIn] = useAuthState(auth)
    const router = useRouter()
    const TypeOfMessage = user === userLoggedIn.email ? "sender" : "reciever"
    const [likedMessage, setLikedMessage] = useState(false)

    const [messagesSnapshot] = useCollection(
        db
        .collection('chats')
        .doc(router.query.id)
        .collection('messages')
        .orderBy('timestamp','asc')
    )
    
    const currentMessage = messagesSnapshot?.docs.find(doc => doc.id === id).data()

    const messageCondition = (currentMessage) => currentMessage?.id === id

    const findIndex = messagesSnapshot?.docs.findIndex(messageCondition)

    const findPreviousIndex = () => {
        if (findIndex === 0) {
            return 0
        }
        else if (findIndex > 0) {
            return findIndex - 1
        }
    }

    const previousMessage = messagesSnapshot?.docs[findPreviousIndex()].data()
    
    const previousTimeStamp = previousMessage?.timestamp?.toDate().getTime()
    
    const currentTimeStamp = currentMessage?.timestamp?.toDate().getTime()

    function handleLikeMessage() {
        setLikedMessage(prev => !prev)
    }
    
    return (
    <>
        {( ((previousTimeStamp + 600000) < currentTimeStamp) || findIndex === 0 || currentMessage?.user !== previousMessage?.user) ? 
            <div className={`${styles.container} ${styles["first-message_container"]}`}>
                <div id={styles[TypeOfMessage]}>
                    <div className={styles.avatar}>
                        <Image 
                            src={message?.photoURL}
                            layout="fill"
                        />
                    </div>
                    <div className={styles.content}>
                        <div className={styles["content-top"]} id={styles[TypeOfMessage]}>
                            <h3 className={`heading heading--3 ${styles.username}`}>{TypeOfMessage === "sender" ? "You" : message?.username}</h3>
                            <div className={styles["timestamp-first"]}>{message.timestamp ? moment(message.timestamp).format('LT') : '...'}</div>
                        </div>
                        { message?.message && <div className={`${styles["message-element"]} ${styles[TypeOfMessage]}`} onClick={handleLikeMessage}>
                            {message?.message}
                            { likedMessage && <div className={styles["liked-message-container"]}>
                                <FaHeart className="liked-message" />
                            </div>}
                        </div>}
                        { message?.image && <ImageMessage noMargin="noMargin" typeOfMessage={TypeOfMessage} image={message?.image}/>}
                    </div>
                </div>
            </div>
        : message.message ?
        
            <div className={`${styles.container} ${styles["secondary-message_container"]}`}>
                <div className={`${styles["message-element"]} ${styles[TypeOfMessage]}`} onClick={handleLikeMessage}>
                    {message.message}
                    { likedMessage && <div className={styles["liked-message-container"]}>
                        <FaHeart className="liked-message" />
                    </div>}
                </div>
            </div>
            : message?.image && <ImageMessage typeOfMessage={TypeOfMessage} image={message?.image}/>
        
        }
    </>
    )
}

export default Message