export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 py-8 text-center text-gray-400 dark:text-gray-500 text-sm transition-colors">
      <p>© {new Date().getFullYear()} Kushal Ghimire. Built with React &amp; FastAPI.</p>
    </footer>
  )
}
