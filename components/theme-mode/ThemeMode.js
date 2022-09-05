import { useState, useEffect, useContext } from 'react'
import styles from './ThemeMode.module.css'
import { BsFillMoonFill } from "react-icons/bs"
import { BsFillSunFill } from "react-icons/bs"
import { AppContext } from '../../context/AppContextProvider'

function ThemeMode() {

    const togglerSwitch = document.querySelector(".ThemeMode_toggler-switch__2yTaM");
    const { theme, setTheme } = useContext(AppContext)
    const [root, setRoot] = useState('')

    useEffect(() => {
        setRoot(() => {
            const element = document.querySelector(':root')
            return element
        })
    }, [])

    function handleClick() {
        setTheme(prevTheme => prevTheme === "light" ? "dark" : "light")
        
        if (theme === "light") {
            togglerSwitch.style.transform = "translate3d(32px, 0, 0px)"

            root?.style.setProperty('--main-bg-color', '#2E2E2E')
            root?.style.setProperty('--secondary-bg-color', '#444444')
            root?.style.setProperty('--third-bg-color', '#444444')
            root?.style.setProperty('--main-color', '#ffffff')
            root?.style.setProperty('--secondary-color', '#808080')
            root?.style.setProperty('--third-color', '#ffffff')
            root?.style.setProperty('--color-blue', '#457CAF')
            root?.style.setProperty('--border-color', '#434343')
            root?.style.setProperty('--box-shadow-color', '0 0 0')
            root?.style.setProperty('--color-black', '#2E2E2E')
        }

        if (theme === "dark") {
            togglerSwitch.style.transform = "translate3d(0px, 0, 0px)"

            root?.style.setProperty('--main-bg-color', '#ffffff')
            root?.style.setProperty('--secondary-bg-color', '#f6f6f6')
            root?.style.setProperty('--third-bg-color', '#31343c')
            root?.style.setProperty('--main-color', '#31343c')
            root?.style.setProperty('--secondary-color', '#808080')
            root?.style.setProperty('--third-color', '#ffffff')
            root?.style.setProperty('--color-blue', '#2E9BFF')
            root?.style.setProperty('--border-color', '#fafafa')
            root?.style.setProperty('--box-shadow-color', '0 0 0')
            root?.style.setProperty('--color-black', '#444444')
        }
        

    }

    return (
        <div className={styles["theme-mode"]}>
            <div className={styles["theme-mode_container"]}>
                <div className={styles["night-mode-toggler"]}>
                    <div className={styles["toggler-switch"]} onClick={handleClick}>
                        {theme === "light" ? <BsFillMoonFill className={styles["switch-icon"]}/> : <BsFillSunFill className={styles["switch-icon"]}/>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ThemeMode