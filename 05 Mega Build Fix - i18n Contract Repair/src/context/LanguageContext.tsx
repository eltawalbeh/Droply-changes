import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Direction, Language } from '../types'
import { translations, type AppTranslation } from '../config/i18n'

interface LanguageContextType {
  language: Language
  direction: Direction
  setLanguage: (language: Language) => void
  t: AppTranslation
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')
  const direction: Direction = language === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = direction
  }, [language, direction])

  const value = useMemo<LanguageContextType>(
    () => ({
      language,
      direction,
      setLanguage,
      t: translations[language],
    }),
    [language, direction],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }

  return context
}
