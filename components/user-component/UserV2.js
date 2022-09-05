import React from 'react'
import styles from './user.module.css'
import Image from 'next/image'
import { Avatar } from '@material-ui/core'

function User({ user, currentUser, addToInput }) {

    return (
        <div className={styles.container} onClick={() => addToInput(user, currentUser)}>
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