import React from "react";
import { FaRegCopyright } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { IoCloudOutline } from "react-icons/io5";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
  <footer className="w-full border-t border-slate-200 bg-white text-slate-600 dark:border-slate-600 dark:bg-gradient-to-b dark:from-slate-700 dark:to-slate-800 dark:text-slate-200">
      {/* Top section */}
  <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900/5 ring-1 ring-slate-900/10 dark:bg-cyan-500/10 dark:ring-cyan-500/30">
              <IoCloudOutline className="h-7 w-7 text-cyan-500 dark:text-cyan-400" />
            </span>
            <div>
              <h3 className="text-xl font-semibold tracking-tight text-slate-800 dark:text-slate-50">SCS Cloud</h3>
              <p className="text-sm text-slate-500 dark:text-slate-300">Build. Deploy. Scale.</p>
            </div>
          </div>

          <p className="mt-4 max-w-md text-sm text-slate-600 dark:text-slate-300">
            Suryansh Cloud Services provides modern cloud hosting and on-demand
            transcoding with a developer-first experience.
          </p>

          <div className="mt-6 flex items-center gap-3">
            <a
              href="https://www.linkedin.com/in/suryansh-verma-54a88528a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-slate-900/10 hover:bg-slate-900/5 transition dark:bg-cyan-500/10 dark:ring-cyan-500/30 dark:hover:bg-cyan-500/20 dark:text-slate-100"
            >
              <FaLinkedin className="h-5 w-5" />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=100089669727713&mibextid=ZbWKwL"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-slate-900/10 hover:bg-slate-900/5 transition dark:bg-cyan-500/10 dark:ring-cyan-500/30 dark:hover:bg-cyan-500/20 dark:text-slate-100"
            >
              <FaFacebook className="h-5 w-5" />
            </a>
            <a
              href="https://www.instagram.com/suryanshverma_1?utm_source=qr&igsh=MWE2ZDczZHg1c3Fxbg=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-slate-900/10 hover:bg-slate-900/5 transition dark:bg-cyan-500/10 dark:ring-cyan-500/30 dark:hover:bg-cyan-500/20 dark:text-slate-100"
            >
              <FaInstagram className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-sm font-semibold tracking-wide text-slate-800 dark:text-slate-50">
            Contact
          </h4>
          <div className="mt-4 space-y-2 text-sm">
            <address className="not-italic text-slate-600 dark:text-slate-300">
              Lakhimpur Kheri, UP 262701, India
            </address>
            <p>
              Phone: {" "}
              <a
                href="tel:+919580104753"
                className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300"
              >
                +91 9580104753
              </a>
            </p>
            <p>
              Email: {" "}
              <a
                href="mailto:suryanshv.ug23.ee@nitp.ac.in"
                className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300"
              >
                suryanshv.ug23.ee@nitp.ac.in
              </a>
            </p>
          </div>
        </div>

        {/* Useful links */}
        <div>
          <h4 className="text-sm font-semibold tracking-wide text-slate-800 dark:text-slate-50">
            Useful links
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a
                href="https://drive.google.com/file/d/1hQkWJJX0cm36t9yyoBCOUDoPgEKnM64j/view?usp=drivesdk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-slate-900 hover:underline dark:text-slate-300 dark:hover:text-slate-100"
              >
                Resume
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/suryansh-verma-54a88528a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-slate-900 hover:underline dark:text-slate-300 dark:hover:text-slate-100"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/suryanshverma_1?utm_source=qr&igsh=MWE2ZDczZHg1c3Fxbg=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-slate-900 hover:underline dark:text-slate-300 dark:hover:text-slate-100"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-200 dark:border-slate-600">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <FaRegCopyright className="h-4 w-4" />
            <span>
              {year}, Suryansh Cloud Services (SCS)
            </span>
          </div>
          <nav className="flex items-center gap-4">
            <a href="#" className="hover:text-slate-900 dark:hover:text-slate-100">Privacy</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-slate-100">Terms</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-slate-100">Security</a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
