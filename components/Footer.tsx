import Link from "next/link";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-10 flex flex-col md:flex-row md:justify-between gap-8">
        {/* Info & Logo */}
        <div className="flex-1 min-w-[200px]">
          <h2 className="text-2xl font-bold mb-2">SmartHomeMall</h2>
          <p className="text-gray-400 mb-4 max-w-xs">
            Soluții inteligente pentru locuințe și afaceri moderne. Automatizare, securitate și confort la un click distanță.
          </p>
          <div className="flex space-x-4 mt-2">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebook className="w-6 h-6 hover:text-blue-400 transition" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram className="w-6 h-6 hover:text-pink-400 transition" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedin className="w-6 h-6 hover:text-blue-300 transition" />
            </a>
          </div>
        </div>
        {/* Linkuri utile */}
        <div className="flex-1 min-w-[180px]">
          <h3 className="font-semibold mb-3">Linkuri utile</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/termeni-conditii" className="hover:underline">Termeni și Condiții</Link>
            </li>
            <li>
              <Link href="/politica-confidentialitate" className="hover:underline">Politica de Confidențialitate</Link>
            </li>
          </ul>
        </div>
        {/* Contact */}
        <div className="flex-1 min-w-[220px]">
          <h3 className="font-semibold mb-3">Contact</h3>
          <ul className="space-y-2 text-gray-400">
            <li>Email: <a href="mailto:office@smarthomemall.ro" className="hover:underline text-gray-200">office@smarthomemall.ro</a></li>
            <li>Telefon: <a href="tel:+40712345678" className="hover:underline text-gray-200">+40 712 345 678</a></li>
            <li>Adresă: Str. Exemplu 123, București</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 text-center py-4 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} SmartHomeMall. Toate drepturile rezervate.
      </div>
    </footer>
  );
} 