import React, { createContext, useContext, ReactNode } from 'react';
import { Toaster } from 'sonner';
import { useMuiSnackbar, SnackbarSeverity } from '../hooks/useMuiSnackbar';

interface SnackbarContextType {
    showSnackbar: (message: string, severity?: SnackbarSeverity) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { showSnackbar } = useMuiSnackbar();

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            <Toaster
                position="bottom-right"
                toastOptions={{
                    style: {
                        background: '#18181b',
                        color: '#f4f4f5',
                        border: '1px solid #3f3f46',
                        fontFamily: 'var(--font-mono, monospace)',
                        fontSize: '13px',
                    },
                }}
            />
        </SnackbarContext.Provider>
    );
};

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error('useSnackbar must be used within a SnackbarProvider');
    }
    return context;
};
