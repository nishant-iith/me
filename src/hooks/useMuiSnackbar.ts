import { useState, useCallback } from 'react';

export type SnackbarSeverity = 'success' | 'info' | 'warning' | 'error';

interface SnackbarState {
    open: boolean;
    message: string;
    severity: SnackbarSeverity;
}

export const useMuiSnackbar = () => {
    const [state, setState] = useState<SnackbarState>({
        open: false,
        message: '',
        severity: 'info',
    });

    const showSnackbar = useCallback((message: string, severity: SnackbarSeverity = 'info') => {
        setState({ open: true, message, severity });
    }, []);

    const hideSnackbar = useCallback(() => {
        setState((prev) => ({ ...prev, open: false }));
    }, []);

    return {
        ...state,
        showSnackbar,
        hideSnackbar,
    };
};

export default useMuiSnackbar;
