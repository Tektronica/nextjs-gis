// Custom nextjs app

// /pages/_app.js
import '../styles/globals.css'
import 'tailwindcss/tailwind.css'

// https://nextjs.org/docs/advanced-features/custom-app
// https://nextjs.org/docs/basic-features/layouts#per-page-layouts

export default function MyApp({ Component, pageProps }) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page)

  return getLayout(<Component {...pageProps} />)
}
