import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(() => {
    return {
        build: {
            outDir: 'build',
        },
        server: {
            proxy: {
                '/api':'http://localhost:5001',
            }
        },
        plugins: [react()],
    };
});
