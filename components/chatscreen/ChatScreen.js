import { Avatar } from '@material-ui/core'
import { useRouter } from 'next/router'
import { useState, useRef, useContext, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db, storage } from '../../firebase'
import { useCollection } from 'react-firebase-hooks/firestore'
import Message from '../message/Message'
import firebase from 'firebase'
import getRecipientEmail from '../../utils/getRecipientEmail'
import TimeAgo from 'timeago-react'
import styles from './chat-screen.module.css'
import {AppContext} from '../../context/AppContextProvider'
import { RiSendPlaneFill } from "react-icons/ri";
import { BsFillImageFill } from 'react-icons/bs'
import { HiMenu } from 'react-icons/hi'
import useCurrentWidth from '../../hooks/useCurrentWidth'
import Image from 'next/image'
import { MdOutlineClear } from "react-icons/md";

function ChatScreen({ chat, messages }) {

    const {handleMessageUpdate, setHasReRouted} = useContext(AppContext)
    const [sidebar, setSidebar] = useState('')
    let width = useCurrentWidth()
 
    useEffect(() => {
        setHasReRouted(true)
        setSidebar(() => {
            const element = document.querySelector('.sidebar_sidebar__WwW84')
            return element
        }, [])
    }, [])

    const [user] = useAuthState(auth)
    const [input, setInput] = useState("")
    const [inputFile, setInputFile] = useState("")
    const [inputURL, setInputURL] = useState("")
    const endOfMessagesRef = useRef(null)
    const router = useRouter()
    const [messagesSnapshot] = useCollection(
        db
        .collection('chats')
        .doc(router.query.id)
        .collection('messages')
        .orderBy('timestamp','asc')
    )

    const [recipientSnapshot] = useCollection(
        db.collection('users').where('email', '==', getRecipientEmail(chat.users, user))
    )
    
    const recipient = recipientSnapshot?.docs?.[0]?.data()
    const recipientEmail = getRecipientEmail(chat.users, user)

   function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    const showMessages = () => {
        
        delay(100).then(() => {if(endOfMessagesRef) {scrollToBottom()}})

        if (messagesSnapshot) {
            return messagesSnapshot.docs.map((message) => (
                <Message
                key={message.id}
                id={message.id}
                user={message.data().user}
                message={{
                    ...message.data(),
                    timestamp: message.data().timestamp?.toDate().getTime(),
                }}
                />
            ))
        } else {
            return JSON.parse(messages).map(message => (
                <Message key={message.id} id={message.id} user={message.user} message={message} />
            ))
        }
    }

    const checkInputFile = () => {      
        if (!/\s/.test(inputFile)) {
            setInputFile(prevInputFile => {
                return prevInputFile.replaceAll(" ", "-")
            })
        } else { return }
    }

    const inputPromise = Promise.resolve(checkInputFile)

    const scrollToBottom = () => {
        if (endOfMessagesRef) {
            endOfMessagesRef.current.scrollIntoView({
                behavior: "smooth",
                black: "start",
            })
        }
    }

    const sendMessage = (e) => {

        e.preventDefault()

        if(!input && !inputFile) {return}

        handleMessageUpdate()

        inputPromise.then(() => {

            if (inputFile) {
                const uploadTask = storage.ref(`images/${inputFile.name}`).put(inputFile);
                uploadTask.on(
                    "state_changed",
                    snapshot => {
                        const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        )
                    },
                    error => {
                        console.log(error);
                    },
                    () => {
                        storage
                            .ref("images")
                            .child(inputFile.name)
                            .getDownloadURL()
                            .then(url => {
                                // setInputURL(url)
                                db.collection('chats').doc(router.query.id).collection('messages').add({
                                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                                    message: "",
                                    image: url,
                                    user: user.email,
                                    username: user.displayName,
                                    photoURL: user.photoURL,
                                })
                            })
                    }
                );
            }
    
            if (!inputFile) {
                db.collection('chats').doc(router.query.id).collection('messages').add({
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    message: input,
                    image: "",
                    user: user.email,
                    username: user.displayName,
                    photoURL: user.photoURL,
                })
            }
    
            // Update the last seen...
    
            db.collection('users').doc(user.uid).set(
                {
                    lastSeen: firebase.firestore.FieldValue.serverTimestamp()
                }, 
                { merge: true }
            )

            setInput("")
            setInputFile("")
            setInputURL("")
            scrollToBottom()
        })

    }

    function handleSidebar() {
        if(sidebar.offsetLeft < 0) {
            sidebar.style.left = '0px'
        } else if (sidebar.offsetLeft === 0) {
            sidebar.style.left = "-320px"
        }
    }


    return (
 
        <div className={styles.container}>
            <div className={styles.header}>
                { width < 768 && <div>
                    <HiMenu className={styles["menu-icon"]} onClick={handleSidebar} />
                </div>}
                {recipient ? <div className={styles.avatar}  onClick={() => auth.signOut()}>
                    <Image 
                        src={recipient?.photoURL}
                        layout="fill"
                    />
                </div> : <Avatar>{recipientEmail[0]}</Avatar>}
                <div className={styles.header_info}>
                    <h3>{recipientEmail}</h3>
                    {recipientSnapshot ? (
                        <p>Last active: {' '}
                        {recipient?.lastSeen?.toDate() ? (
                            <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                        ) : "Unavailable"}
                        </p>
                    ) : (
                        <p>Loading Last active...</p>
                    )}
                </div>
                <div className={styles.header_icons}>
                    <div className={styles["beta-badge"]}>
                        beta
                    </div>
                </div>
            </div>
            <div className={styles["message-container"]}>
                { width < 480 && <div className="spacer-block--top"></div>}
                {showMessages()}
                <div id={styles.endOfMessage} ref={endOfMessagesRef} />
                <form className={styles["input-form"]} onSubmit={sendMessage}>
                    <div className={styles["input-content--left"]}>
                        <div className={styles.formIcon}>
                            <Image 
                                src={user?.photoURL}
                                layout="fill"
                            />
                        </div>
                        <input disabled={inputFile}className={`${styles.input} paragraph paragraph--1`} placeholder="Type Something ..." value={input} onChange={e => setInput(e.target.value)}/>   
                        {inputFile && 
                            <div className={styles.inputFileBadge}>
                                <p className={styles["input-file_badge-label"]}>{inputFile.name}</p>
                            
                                <MdOutlineClear onClick={() => setInputFile('')} />
                                
                            </div>
                        }
                    </div>
                    <div className={styles["input-content--right"]}>
                        <input  type="file" hidden id="image-file" onChange={e => setInputFile(e.target.files[0])}/> 
                        <label htmlFor="image-file"><BsFillImageFill className={styles["form-icon"]} id={styles["image-icon"]}/></label>   
                        <button id="send-button" hidden value={inputFile} type="submit" onClick={sendMessage} >Send Message</button> 
                        <label htmlFor="send-button"><RiSendPlaneFill className={styles["form-icon"]} id={styles["send-icon"]} /></label>
                    </div>
                </form>
            </div>
        </div>

    )
}

export default ChatScreen