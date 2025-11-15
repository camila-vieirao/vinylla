import { Link } from "react-router-dom";
import { FaInstagram, FaSpotify, FaTwitter } from "react-icons/fa";
import logo from "../../assets/logo 1.png";

const quickLinks = [
  { label: "Feed", to: "/feed" },
  { label: "Explore", to: "/explore" },
  { label: "Marketplace", to: "/marketplace" },
  { label: "Shop", to: "/marketplace" },
];

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-[#05060b]/95 text-white backdrop-blur sm:pl-32">
      <div className="mx-auto flex flex-col gap-8 px-6 py-10 lg:max-w-6xl lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Vinylla" className="h-14 w-14 rounded-2xl" />
          <div>
            <p className="text-xl font-semibold">Vinylla.</p>
            <p className="text-sm text-white/60">
              Records, reviews, and crate-side stories.
            </p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-4 text-sm text-white/70">
          {quickLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="rounded-full border border-white/10 px-4 py-2 uppercase tracking-[0.2em] transition hover:border-white/30 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 text-lg text-white/60">
          {[FaInstagram, FaSpotify, FaTwitter].map((Icon, index) => (
            <a
              key={Icon.displayName || index}
              href="#"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 transition hover:border-white/40 hover:text-white"
              aria-label="Social link"
            >
              <Icon />
            </a>
          ))}
        </div>
      </div>
      <div className="border-t border-white/5 px-6 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Vinylla. Built for crate diggers everywhere.
      </div>
    </footer>
  );
};

export default Footer;

