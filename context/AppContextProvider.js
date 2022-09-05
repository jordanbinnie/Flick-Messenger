
import {createContext, useState} from 'react'
export const AppContext = createContext()

function AppContextProvider(props) {

  const [messageUpdate, setMessageUpdate] = useState(false)
  const [hasReRouted, setHasReRouted] = useState(false)
  const [theme, setTheme] = useState("light")
  

  function handleMessageUpdate() {
    setMessageUpdate(true)
  }

  return (
    <AppContext.Provider value={{ messageUpdate, setMessageUpdate, handleMessageUpdate, hasReRouted, setHasReRouted, theme, setTheme }}>
        {props.children}
    </AppContext.Provider>
  )
}

export default AppContextProvider