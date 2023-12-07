// AppContextProps.tsx
import React, { createContext, useContext, ReactNode, useState } from 'react'

interface AppContextProps {
  isPhoneNumberDisplay: boolean
  setIsPhoneNumberDisplay: (value: boolean) => void
}

const AppContext = createContext<AppContextProps | undefined>(undefined)

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isPhoneNumberDisplay, setIsPhoneNumberDisplay] = useState<boolean>(false)

  return (
    <AppContext.Provider value={{ isPhoneNumberDisplay, setIsPhoneNumberDisplay }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}
