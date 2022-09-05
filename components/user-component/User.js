import React from 'react'
import styles from './user.module.css'
import Image from 'next/image'
import { db } from '../../firebase';
import useCurrentWidth from '../../hooks/useCurrentWidth'
import { Avatar } from '@material-ui/core'

function User({ user, currentUser, chatsSnapshot }) {
    let width = useCurrentWidth()

    const chatAlreadyExists = (recipientEmail) => 
        !!chatsSnapshot?.docs.find(
            (chat) => 
                chat.data().users.find(user => user === recipientEmail)?.length > 0 
        )

    function createChat() {
        if (!chatAlreadyExists(user.email) && user.email !== currentUser.email) {
       
            db.collection('chats').add({
                users: [currentUser.email, user.email]
            })
        }
    }

    return (
        <div className={styles.container} onClick={createChat}>
            <div className={styles["left-content"]} id={styles["left-content"]}>
                {user ? <div className={styles.avatar}>
                    <Image 
                        src={user?.photoURL}
                        layout="fill"
                    />
                </div> : <Avatar className={styles.avatar} >{user.email}</Avatar> }
                <div className={styles.user_info}>
                    <h3 className="heading heading--3">{user.name}</h3>
                    <span className={styles["email_container"]}>
                        <span>{user.email}</span>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default User