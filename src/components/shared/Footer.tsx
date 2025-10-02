import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral text-neutral-content mt-auto">
      <div className="max-w-7xl mx-auto p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <aside>
            <div className="flex items-center gap-2 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <span className="font-bold text-xl">ContentShare</span>
            </div>
            <p className="text-sm max-w-md">
              Secure, scalable video sharing platform built for modern teams.
              Share, organize, and collaborate with confidence.
            </p>
          </aside>

          {/* Links - Side by Side */}
          <div className="grid grid-cols-3 gap-8">
            {/* Product Links */}
            <nav className="flex flex-col gap-2">
              <h6 className="footer-title">Product</h6>
              <Link to="/" className="link link-hover">Videos</Link>
              <Link to="/upload" className="link link-hover">Upload</Link>
              <a href="#" className="link link-hover">Features</a>
              <a href="#" className="link link-hover">Pricing</a>
            </nav>

            {/* Company Links */}
            <nav className="flex flex-col gap-2">
              <h6 className="footer-title">Company</h6>
              <a href="#" className="link link-hover">About us</a>
              <a href="#" className="link link-hover">Blog</a>
              <a href="#" className="link link-hover">Careers</a>
              <a href="#" className="link link-hover">Press</a>
            </nav>

            {/* Legal Links */}
            <nav className="flex flex-col gap-2">
              <h6 className="footer-title">Legal</h6>
              <a href="#" className="link link-hover">Terms of service</a>
              <a href="#" className="link link-hover">Privacy policy</a>
              <a href="#" className="link link-hover">Cookie policy</a>
              <a href="#" className="link link-hover">GDPR</a>
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-content/10">
        <div className="footer footer-center max-w-7xl mx-auto p-6">
          <aside className="items-center grid-flow-col">
            <p className="text-sm">
              © {currentYear} ContentShare. All rights reserved.
            </p>
          </aside>
          <nav className="grid-flow-col gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-sm btn-circle hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-sm btn-circle hover:text-primary transition-colors"
              aria-label="Twitter"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-sm btn-circle hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a
              href="mailto:support@contentshare.example.com"
              className="btn btn-ghost btn-sm btn-circle hover:text-primary transition-colors"
              aria-label="Email"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
