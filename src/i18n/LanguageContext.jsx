import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import en from './en';
import te from './te';

const translations = { en, te };

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguageState] = useState(() => {
        try {
            return localStorage.getItem('agrilink-lang') || 'en';
        } catch {
            return 'en';
        }
    });

    const setLanguage = useCallback((lang) => {
        setLanguageState(lang);
        try {
            localStorage.setItem('agrilink-lang', lang);
        } catch { }
    }, []);

    const toggleLanguage = useCallback(() => {
        setLanguage(language === 'en' ? 'te' : 'en');
    }, [language, setLanguage]);

    const t = useCallback((key) => {
        const keys = key.split('.');
        let value = translations[language];
        for (const k of keys) {
            value = value?.[k];
        }
        if (value === undefined) {
            // Fallback to English
            let fallback = translations.en;
            for (const k of keys) {
                fallback = fallback?.[k];
            }
            return fallback || key;
        }
        return value;
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export default LanguageContext;
