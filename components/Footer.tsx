import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full bg-black border-t border-t-white/10 py-8">
      <div className="flex max-w-5xl mx-auto space-x-6 p-6 text-gray-500">
        <Link href="/terms" className="hover:text-gray-700">
          Terms of Service
        </Link>
        <Link href="/privacy" className="hover:text-gray-700">
          Privacy Policy
        </Link>
      </div>
    </footer>
  )
}

export default Footer
