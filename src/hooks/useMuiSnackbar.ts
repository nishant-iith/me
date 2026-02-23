import { toast } from 'sonner';

export type SnackbarSeverity = 'success' | 'info' | 'warning' | 'error';

export const useMuiSnackbar = () => {
    const showSnackbar = (message: string, severity: SnackbarSeverity = 'info') => {
        switch (severity) {
            case 'success': toast.success(message); break;
            case 'error': toast.error(message); break;
            case 'warning': toast.warning(message); break;
            default: toast(message);
        }
    };

    return { showSnackbar };
};

export default useMuiSnackbar;
