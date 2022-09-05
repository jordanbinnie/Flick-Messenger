import styles from './ImageMessage.module.css'
import { useState } from 'react'
import { FaHeart } from 'react-icons/fa'

function ImageMessage({image, typeOfMessage, noMargin}) {
  const [likedMessage, setLikedMessage] = useState(false)
  
  return (
    <div className={styles["image-container"]} onClick={() => setLikedMessage(prev => !prev)}>
      <div className={styles[noMargin]} id={styles[typeOfMessage]}>
        <img  className={styles.image}src={image} />
        { likedMessage && 
          <div className={styles["liked-message-container"]}>
              <FaHeart className="liked-message" />
          </div>
        }
      </div>
    </div>

  )
}

export default ImageMessage