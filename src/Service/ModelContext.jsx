import { createContext, useState } from "react"

export const ModalContext = createContext();

const ContextProvider = (props) => {
    const [showSidebar, setShowSidebar] = useState(false);

  return (
    <ModalContext.Provider value={{ showSidebar, setShowSidebar }}>
      {props.children}
    </ModalContext.Provider>
  )
}   

export default ContextProvider;