import { Box, Typography } from '@mui/material';
import { Suspense } from 'react';

interface SuspenseLoaderProps {
    children: React.ReactNode;
}

export function SuspenseLoader({ children }: SuspenseLoaderProps) {
    return (
        <Suspense fallback={<Loader />}>
            {children}
        </Suspense>
    );
}

function Loader() {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px',
            gap: 2,
            opacity: 0,
            animation: 'fadeIn 0.5s ease-in forwards',
            '@keyframes fadeIn': {
                from: { opacity: 0 },
                to: { opacity: 1 }
            }
        }}>
            <Box sx={{
                width: 40,
                height: 40,
                border: '2px solid rgba(82, 82, 91, 0.2)',
                borderTop: '2px solid rgba(82, 82, 91, 0.8)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                '@keyframes spin': {
                    from: { transform: 'rotate(0deg)' },
                    to: { transform: 'rotate(360deg)' }
                }
            }} />
            <Typography sx={{ fontMono: 'true', fontSize: '0.75rem', color: 'zinc.500' }}>
                Loading Data...
            </Typography>
        </Box>
    );
}

export default SuspenseLoader;
