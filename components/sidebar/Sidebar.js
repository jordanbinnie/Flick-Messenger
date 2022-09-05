import { useState, useEffect, useContext } from 'react'
import { IconButton } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import * as EmailValidator from 'email-validator'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollection } from 'react-firebase-hooks/firestore'
import { auth, db } from '../../firebase';
import Chat from '../chat-component/Chat'
import styles from './sidebar.module.css'
import { MdOutlineCreate, MdOutlineClear } from "react-icons/md";
import ThemeMode from '../theme-mode/ThemeMode'
import useCurrentWidth from '../../hooks/useCurrentWidth';
import Image from 'next/image'
import { AppContext } from '../../context/AppContextProvider'
import User from '../user-component/User'
import UserV2 from '../user-component/UserV2'
import { MdExpandMore } from 'react-icons/md'
import { MdExpandLess } from 'react-icons/md'

function Sidebar({messages}) {
    const [sidebar, setSidebar] = useState('')
    const [allUsersElement, setAllUsersElement] = useState('')
    const [logOutButton, setLogOutButton] = useState('')
    const [headerElement, setHeaderElement] = useState('')
    const [createChatInputFrame, setCreateChatInputFrame] = useState('')

    let width = useCurrentWidth()
    const { theme } = useContext(AppContext)

    const [user] = useAuthState(auth)
    const userChatRef = db.collection('chats').where('users', 'array-contains', user.email)
    const [chatsSnapshot] = useCollection(userChatRef)
    const [searchInput, setSearchInput] = useState('')
    const allUsers = db.collection('users')
    const [usersSnapshot] = useCollection(allUsers)
    const [expandUsers, setExpandUsers] = useState(true)
    const [logOutAnimation, setLogOutAnimation] = useState(false)
    const [createChatElement, setCreateChatElement] = useState('')
    const [createChatInput, setCreateChatInput] = useState('')
    const [inputElement1, setInputElement1] = useState('')
    const [inputElement2, setInputElement2] = useState('')
    const [userOnTouchDevice, setUserOnTouchDevice] = useState(false)

    useEffect(() => {
        setSidebar(() => {
            const element = document.querySelector('.sidebar_sidebar__WwW84')
            return element
        })
        setAllUsersElement(() => {
            const element = document.querySelector('.sidebar_all-users_container__lgZje')
            return element
        })
        setLogOutButton(() => {
            const element = document.querySelector('.sidebar_logout-button_container__INlQZ')
            return element
        })
        setHeaderElement(() => {
            const element = document.querySelector('.sidebar_headerContainer__89EJV')   
            return element
        })
        setCreateChatElement(() => {
            const element = document.querySelector('.sidebar_create-chat_container__kZwG9')
            return element
        })
        setCreateChatInputFrame(() => {
            const element = document.querySelector('.sidebar_create-chat_input-frame__bQL2v')
            return element
        })
        setInputElement1(() => {
            const element = document.querySelector('.sidebar_search-input__Cjx2Q')
            return element
        }, [])
        setInputElement2(() => {
            const element = document.querySelector('#sidebar_create-chat_search-input___Suda')
            return element
        }, [])
        setUserOnTouchDevice(isTouchDevice())
    }, [])

    const screenSize = width > 768 ? "desktop" : "mobile"
    
    useEffect(() => {
        if (sidebar) {
            if (width > 768) {
                sidebar.style.left = "0px"
            } else if (width < 768) {
                sidebar.style.left = "-380px"
            }
        }
    }, [screenSize])

    useEffect(() => {
        if (createChatElement) {
            let elementProps = createChatElement?.getBoundingClientRect()
            let elementWidth = elementProps.width
            createChatElement.style.boxShadow = theme === "light" ? "rgb(233, 233, 233) 0px 6px 24px 0px" : "rgb(24, 24, 24) 0px 6px 24px 0px"

        }

    }, [theme])

    const isTouchDevice = () => {  
        if(window.matchMedia("(pointer: coarse)").matches === false) {
          return false
        } else {
          return true
        }
    }

    useEffect(() => {
        if(userOnTouchDevice) {
            inputElement1.style.fontSize = "16px"
            inputElement2.style.fontSize = "16px"
            document.querySelector('.sidebar_create-chat_button__BTO_d').style.fontSize = "16px"
            document.querySelector('.sidebar_logout-button__mxGyO').style.fontSize = "16px"
        }
       }, [userOnTouchDevice])

    const createChatExpand = () => {
        const usersAmount = usersSnapshot?.docs.length
        const amount = userOnTouchDevice ? 160 : 145
        const divHeight = amount + (usersAmount * 70) + 30
        
        let elementProps = createChatElement?.getBoundingClientRect()
        let elementWidth = elementProps.width
        if (elementWidth === 37) {
            createChatElement.style.width = "100%"
            createChatElement.style.height = divHeight + "px"
            createChatElement.style.zIndex = "1"
            createChatElement.style.borderTopLeftRadius = "17.5px"
            createChatElement.style.borderTopRightRadius = "20px"
            createChatElement.style.borderBottomLeftRadius = "30px"
            createChatElement.style.borderBottomRightRadius = "30px"
            createChatElement.style.boxShadow = theme === "light" ? "rgb(233, 233, 233) 0px 6px 24px 0px" : "rgb(24, 24, 24) 0px 6px 24px 0px"
        } else if (elementWidth > 37) {
            createChatElement.style.width = "37px"
            createChatElement.style.height = "37px"
            createChatElement.style.zIndex = "0"
            createChatElement.style.borderRadius = "100px"
            createChatElement.style.boxShadow = "none"
        }
    }

    const createChat = () => {
        if (!createChatInput) {return null}

        if (EmailValidator.validate(createChatInput) && !chatAlreadyExists(createChatInput) && createChatInput !== user.email) {
            
            db.collection('chats').add({
                users: [user.email, createChatInput]
            })
            createChatInputFrame.style.zIndex = "-1"
            createChatInputFrame.style.visibility = "hidden"
            createChatExpand()
        }
    }

    const chatAlreadyExists = (recipientEmail) => 
        !!chatsSnapshot?.docs.find(
            (chat) => 
                chat.data().users.find(user => user === recipientEmail)?.length > 0 
        )

    function handleSidebar() {
        if (sidebar.offsetLeft === 0) {
            sidebar.style.left = "-380px"
            createChatElement.style.width = "37px"
            createChatElement.style.height = "37px"
            createChatElement.style.zIndex = "0"
            createChatElement.style.borderRadius = "100px"
            createChatElement.style.boxShadow = "none"
        } else if (sidebar.offsetLeft === -320) {
            sidebar.style.left = "0px"
        }
    }

    function handleSearch() {
        return chatsSnapshot?.docs.filter((chat) =>  
            chat.data().users[0].toLowerCase().includes(searchInput.toLowerCase()) ||
            chat.data().users[1].toLowerCase().includes(searchInput.toLowerCase())
        )
    }

    useEffect(() => {
        if (headerElement) {
            const elementProps = headerElement.getBoundingClientRect()
            const elementWidth = elementProps.width
            logOutButton.style.width = elementWidth + "px"
            delay(250).then(() => {
                logOutButton.style.transition = "all 500ms ease-in-out 0s"
            })
        }
    }, [headerElement])

    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
      }

    function expandAllUsers() {
        if (allUsersElement && expandUsers) {
            setExpandUsers(false)
            allUsersElement.style.opacity = "0"
            allUsersElement.style.maxHeight = "0px"
            delay(500).then(() => {
                allUsersElement.style.display = 'none'
            })
        }
        if (allUsersElement && !expandUsers) {
            setExpandUsers(true)
            allUsersElement.style.display = 'flex'
            delay(250).then(() => {
                allUsersElement.style.opacity = "1"
                allUsersElement.style.maxHeight = "400px"
            })
        }
    }

    function toggleLogoutButton() {
        sidebar.style.left = "0px!important"
        if (logOutButton && !logOutAnimation) {
            setLogOutAnimation(true)
            logOutButton.style.top = "75px"
            delay(100).then(() => {
                logOutButton.style.borderTopRightRadius = "0px"
                logOutButton.style.borderTopLeftRadius = "0px"
            })
        }
        if (logOutButton && logOutAnimation) {
            setLogOutAnimation(false)
            logOutButton.style.top = "15px"
            delay(100).then(() => {
                logOutButton.style.borderTopRightRadius = "20px"
                logOutButton.style.borderTopLeftRadius = "20px"
            })
        }
    }

    function addToInput(userSelected, currentUser ) {
        setCreateChatInput(userSelected.email)
        const validUser = usersSnapshot?.docs.find(doc => (
            doc.data().email === userSelected.email
        ))

        if (validUser) {
            createChatInputFrame.style.zIndex = "1"
            createChatInputFrame.style.visibility = "visible"
        } else if (!validUser) {
            createChatInputFrame.style.zIndex = "-1"
            createChatInputFrame.style.visibility = "hidden"
        }
    }

    function handleCreateChatInputChange(e) {
        let value = e.target.value
        setCreateChatInput(value)
        const validUser = usersSnapshot?.docs.find(doc => (
            doc.data().email === value
        ))

        if (validUser) {
            createChatInputFrame.style.zIndex = "1"
            createChatInputFrame.style.visibility = "visible"
        } else if (!validUser) {
            createChatInputFrame.style.zIndex = "-1"
            createChatInputFrame.style.visibility = "hidden"
        }
    }

    function removeCreateChatInput() {
        createChatInputFrame.style.zIndex = "-1"
        createChatInputFrame.style.visibility = "hidden"
        setCreateChatInput('')
    }

    function handleCreateChatSearch() {
        return usersSnapshot?.docs?.filter((doc) =>  
            doc.data().email.includes(createChatInput.toLowerCase())
        )
    }

    return ( 
        <div className={styles.sidebar}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.headerContainer} onClick={toggleLogoutButton}>
                        <div className={styles.avatar}>
                            <Image 
                                src={user?.photoURL}
                                layout="fill"
                            />
                        </div>
                        <div className={styles["header-profile"]}>
                            <h2 className="heading heading--2">{user?.displayName}</h2>
                            <p className="paragraph paragraph--2 p-grey">{user?.email}</p>
                        </div>
                        <div className={styles["logout-button_container"]}>
                            <button onClick={() => auth.signOut() } className={styles["logout-button"]}>Logout</button>
                        </div>
                    </div>                    
                    { width < 768 && <IconButton onClick={handleSidebar}>
                        <MdOutlineClear id={styles["clear-icon"]} />
                    </IconButton>}
                    { width > 768 && <div className={styles.clearButtonTransparent}>
                        <MdOutlineClear fill="transparent"/>
                    </div>}
                </div>
                <div className={styles["sidebar-content_container"]}>
                    <div className={styles["message-heading"]}>
                        <span className={styles["message-heading_container"]}><h1 className="heading heading--1">{`Message`}</h1></span>
                        <MdOutlineCreate id={styles["create-chat-icon"]} onClick={createChatExpand} />
                        <div className={styles["create-chat_container"]}>
                            <div id={styles["create-chat_search"]}>
                                <div id={styles["create-chat_search-container"]}>
                                    <div id={styles["create-chat_search-input-container"]}>
                                        <input id={styles["create-chat_search-input"]} placeholder="Search by email" onChange={handleCreateChatInputChange} value={createChatInput} />  
                                    </div>
                                </div> 
                                <div className={styles["create-chat_input-frame"]}>
                                    <p className={styles["create-chat_input-frame-text"]}>
                                        {createChatInput}
                                    </p>
                                    <p className={styles["create-chat_input-frame-icon"]} onClick={removeCreateChatInput}>-</p>
                                </div> 
                            </div>
                            <div className={styles["create-chat_button-container"]}>
                                <button className={styles["create-chat_button"]} onClick={createChat}>create chat</button>
                            </div>
                            <h3 className="heading heading--3" id={styles["create-chat_heading"]}>Suggested</h3>
                            {handleCreateChatSearch()?.map(doc => {
                                return (  
                                    <UserV2 key={doc?.data().email} user={doc?.data()} currentUser={user} chatsSnapshot={chatsSnapshot} addToInput={addToInput} />          
                                )
                            })}
                        </div>
                    </div>
                    <div className={styles.search}>
                        <div className={styles["search-container"]}>
                            <SearchIcon/>
                            <input className={styles["search-input"]} placeholder="Search by email" onChange={(e) => setSearchInput(e.target.value)}/>  
                        </div>  
                    </div>

                    {/* list of chats */ }
                    {handleSearch()?.map(chat => (
                        <Chat key={chat?.id} id={chat?.id} users={chat?.data().users} messages={messages} />
                    ))}
                    
                    <ThemeMode user={user} />
                    <div className={styles["all-users_main-container"]}>
                        <div className={styles["all-users_badge"]}>Start a conversation</div>
                        <div className={styles["all-users_header-container"]}>
                            <h2 className="heading heading--2" id={styles["all-users-heading"]}>Users on Flick</h2>
                            {expandUsers ? <MdExpandLess id={styles["users-expand-icon"]} onClick={expandAllUsers} />  
                            : <MdExpandMore id={styles["users-expand-icon"]} onClick={expandAllUsers} />}
                        </div>
                        <div className={styles["all-users_container"]}>
                            <div className={styles["all-users_wrapper"]}>
                                {usersSnapshot?.docs.map(doc => {
                                    return (  
                                        <User key={doc?.data().email} user={doc?.data()} currentUser={user} chatsSnapshot={chatsSnapshot} />          
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
 
export default Sidebar