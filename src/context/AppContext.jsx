import {createContext, useState, useEffect} from "react";

export const AppContext = createContext();

export const AppContextProvider = ({children}) => {
    const [user, setUser] = useState(null);
    
    // Manage Light/Dark Theme State
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    const clearUser = () => {
        setUser(null);
    }

    const toggleTheme = () => {
        const nextTheme = theme === "light" ? "dark" : "light";
        setTheme(nextTheme);
        localStorage.setItem("theme", nextTheme);
    };

    // Apply the active theme class to document element on changes
    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

    const contextValue = {
        user,
        setUser,
        clearUser,
        theme,
        toggleTheme
    }

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    )
}