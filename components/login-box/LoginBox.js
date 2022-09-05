import styles from './login-box.module.css'
import { auth, provider } from '../../firebase'
import Image from 'next/image'
import Grain from '../../public/grain.jpg'
import Emblem from '../../public/flick-emblem.png'
import Message1 from '../../public/messages/message1.png'
import Message2 from '../../public/messages/message2.png'
import Message3 from '../../public/messages/message3.png'
import Message4 from '../../public/messages/message4.png'
import Message5 from '../../public/messages/message5.png'
import HandPhone from '../../public/flick-handandiphone.png'
import { FcGoogle } from 'react-icons/fc'
import { useEffect } from 'react'

function LoginBox() {
    const signIn = () => {
        auth.signInWithPopup(provider).catch(alert)
    }

    useEffect(() => {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }, [])
    
    return (
        <div className={styles.container}>
            <div className={styles["logo-badge"]}>
                <span id={styles["emblem-image"]}><Image src={Emblem} height={20} width={20}/></span>
                <h3 id={styles["emblem-heading"]} className="heading heading--2">lick</h3>
            </div>
            <div className={styles["login-container"]}>
                <div className={styles["content-container"]}>
                    <div className={styles["heading-content"]}>
                        <h1 id={styles["sign-in--heading"]} className="heading heading--extraLarge">Sign in</h1>
                        <p className="paragraph paragraph--1">Let&apos;s get started by signing in with google.</p>
                    </div>
                    <div className={styles["demo-container"]}>
                        <h3 className="heading paragraph--1" id={styles["demo-heading"]}>Demo log in</h3>
                        <p className="paragraph paragraph--1" id={styles["demo-credentials"]}>Email: FlickDemoUser@gmail.com <br/> Password: flickdemouser123</p>
                        <div className={styles["demo-test--button"]}>
                            For testing only
                        </div>
                    </div>
                </div>
                <button onClick={signIn} className={styles["sign-in--button"]}><FcGoogle /><p className="paragraph heading--3" id={styles["sign-in-button--text"]}>Sign in with Google</p></button>
            </div>
            <div className={styles["image-container"]}>
                <Image layout="fill" src={Grain} />
                <div className={styles["hand-image_container"]}>
                    <Image layout="fill" objectFit="contain" src={HandPhone}/>
                </div>
                <div className="beta-badge">beta</div>
                <div className={styles["sub-images_container"]}>
                    <Image id={styles["image1"]} src={Message4} width={379} height={70}/>
                    <Image id={styles["image2"]} src={Message3} width={379} height={70}/>
                    <Image id={styles["image3"]} src={Message1} width={378} height={70}/>
                    <Image id={styles["image4"]} src={Message2} width={378} height={70}/>
                    <Image id={styles["image5"]} src={Message5} width={378} height={70}/>
                </div>
            </div>
        </div>
    )
}

export default LoginBox