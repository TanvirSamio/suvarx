/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.{js,jsx,ts,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#fafafa',
                    100: '#f4f4f5',
                    200: '#e4e4e7',
                    300: '#d4d4d8',
                    400: '#a1a1aa',
                    500: '#71717a',
                    600: '#52525b',
                    700: '#3f3f46',
                    800: '#27272a',
                    900: '#18181b',
                    950: '#09090b',
                },
                ciao: {
                    dark: '#0a0a0c',
                    crimson: '#6B0B2A',
                    magenta: '#9B1146',
                    plum: '#4A0826',
                    cobalt: '#002B7F',
                    neonPink: '#FF1F7D',
                    glowBlue: '#3B82F6',
                    glowPurple: '#A855F7',
                }
            },
            fontFamily: {
                sans: ['"Inter"', 'system-ui', 'sans-serif'],
                display: ['"Anton"', '"Space Grotesk"', '"Poppins"', 'sans-serif'],
                heading: ['"Space Grotesk"', 'sans-serif'],
                body: ['"Inter"', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'monospace'],
            },
            boxShadow: {
                'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04)',
                'card': '0 4px 25px -2px rgba(0, 0, 0, 0.06)',
                'glow-white': '0 0 30px rgba(255, 255, 255, 0.4)',
                'glow-crimson': '0 0 40px rgba(255, 31, 125, 0.35)',
                'glow-blue': '0 0 40px rgba(59, 130, 246, 0.35)',
                'pedestal': '0 20px 60px rgba(0, 0, 0, 0.8), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
            }
        },
    },
    plugins: [],
}
