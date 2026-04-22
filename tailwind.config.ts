import type { Config } from 'tailwindcss';

/** `tailwindcss-animate` is loaded via `@plugin` in `src/styles/global.css` (Tailwind v4 + jiti). */
export default {
	darkMode: 'class',
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx,vue}'],
	prefix: '',
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			fontFamily: {
				display: ['Instrument Sans Variable', 'sans-serif'],
				body: ['Instrument Sans Variable', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				subtle: 'hsl(var(--subtle))',
				'slate-700': 'hsl(var(--slate-700))',
				'slate-400': 'hsl(var(--slate-400))',
				'slate-300': 'hsl(var(--slate-300))',
				'slate-200': 'hsl(var(--slate-200))',
				'slate-100': 'hsl(var(--slate-100))',
				'slate-50': 'hsl(var(--slate-50))',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				'line-shadow': {
					'0%': { backgroundPosition: '0 0' },
					'100%': { backgroundPosition: '100% -100%' },
				},
				'hero-audience-pop': {
					'0%': { opacity: '0', transform: 'translate3d(0, 0.45em, 0) scale(0.94)' },
					'65%': { opacity: '1', transform: 'translate3d(0, -0.1em, 0) scale(1.03)' },
					'100%': { opacity: '1', transform: 'translate3d(0, 0, 0) scale(1)' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'line-shadow': 'line-shadow 15s linear infinite',
				'hero-audience-pop': 'hero-audience-pop 0.4s cubic-bezier(0.22, 1, 0.36, 1) both',
			},
		},
	},
} satisfies Config;
