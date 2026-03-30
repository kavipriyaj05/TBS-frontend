// ═══ FILE: src/components/shared/Footer.jsx ═══
// Site footer — Kavi
import { HiOutlineTicket } from 'react-icons/hi';

const Footer = () => {
  return (
    <footer className="bg-gray-950 border-t border-gray-800/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-purple-600 rounded-lg flex items-center justify-center">
                <HiOutlineTicket className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent">
                TicketMaster Pro
              </span>
            </div>
            <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
              Your one-stop destination for booking movie tickets. Experience cinema like never before with seamless booking.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-300 font-semibold text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {['Home', 'Movies', 'Theatres', 'Contact'].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-gray-500 hover:text-rose-400 text-sm transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-gray-300 font-semibold text-sm uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              {['Help Center', 'Terms of Service', 'Privacy Policy', 'Refund Policy'].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-gray-500 hover:text-rose-400 text-sm transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800/50 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} TicketMaster Pro. All rights reserved.
          </p>
          <div className="flex gap-4">
            {['Twitter', 'Instagram', 'GitHub'].map((social) => (
              <a
                key={social}
                href="#"
                className="text-gray-600 hover:text-rose-400 text-xs transition-colors"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
