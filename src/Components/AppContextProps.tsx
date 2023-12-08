import React, { createContext, useContext, ReactNode, useState } from 'react'

interface AppContextProps {
  isYourParticipationOrAnnounce: boolean
  setIsYourParticipationOrAnnounce: (value: boolean) => void
}

const AppContext = createContext<AppContextProps | undefined>(undefined)

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isYourParticipationOrAnnounce, setIsYourParticipationOrAnnounce] = useState<boolean>(false)

  return (
    <AppContext.Provider value={{ isYourParticipationOrAnnounce, setIsYourParticipationOrAnnounce }}>
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
