/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
                fraunces: ['Fraunces', 'serif'],
            },
            colors: {
                wine: {
                    50: '#fdf2f2',
                    100: '#fbe4e4',
                    200: '#f7cdcd',
                    300: '#f1abab',
                    400: '#e77d7d',
                    500: '#d95454',
                    600: '#c53a3a',
                    700: '#a52d2d',
                    800: '#892929',
                    900: '#732626',
                    950: '#3f1010',
                },
            },
        },
    },
    plugins: [],
}
