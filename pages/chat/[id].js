import Head from 'next/head'
import { useAuthState } from 'react-firebase-hooks/auth'
import ChatScreen from '../../components/chatscreen/ChatScreen'
import Sidebar from '../../components/sidebar/Sidebar'
import { auth, db } from '../../firebase'
import getRecipientEmail from '../../utils/getRecipientEmail'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

function Chat({ chat, messages}) {
    const [user] = useAuthState(auth)
    let id = chat.id
    const router = useRouter()

    useEffect(() => { 
        if (!chat.users.includes(user.email)) {
            router.push('/')
        }
    }, [user])
    
  return (
    <div className="chat-page_container">
        <Head>
            <title>Chat with {getRecipientEmail(chat.users, user)}</title>
        </Head>
        <Sidebar messages={messages}/>
        <div className="chat-page_chat-container">
            {chat && <ChatScreen chat={chat} messages={messages} />}
            {!chat && <div>Loading...</div>}
        </div>
    </div>
  )
}

export default Chat

export async function getServerSideProps(context) {
    const ref = db.collection('chats').doc(context.query.id)

    // PREP the messages on the server 
    const messagesRes = await ref
        .collection('messages')
        .orderBy('timestamp', 'asc')
        .get()

        const messages = messagesRes.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })).map(messages => ({
            ...messages,
            timestamp: messages.timestamp.toDate().getTime()
        }))

        // PREP the chats
        const chatRes = await ref.get()
        const chat = {
            id: chatRes.id,
            ...chatRes.data()
        }

        return {
            props: {
                messages: JSON.stringify(messages),
                chat: chat
            }
        }
}
