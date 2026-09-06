"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ArrowUpRight, Waypoints } from "lucide-react";
const links = [
  ["/", "Home"],
  ["/crypto", "Crypto"],
  ["/analytics", "Analytics"],
  ["/statistics", "Statistics"],
  ["/ml", "ML"],
  ["/projects", "Projects"],
  ["/about", "About"],
];
export function Navbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="nav-inner">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <Waypoints size={25} className="text-accent" />
          Qhapaq<span>Data</span>
          <span className="brand-period">.</span>
        </Link>
        <button
          className="menu-button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav
          id="main-nav"
          className={open ? "navigation is-open" : "navigation"}
          aria-label="Main navigation"
        >
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              aria-current={
                (href === "/" ? path === href : path.startsWith(href))
                  ? "page"
                  : undefined
              }
            >
              {label}
            </Link>
          ))}
          <Link className="nav-cv" href="/about#cv">
            View CV <ArrowUpRight size={14} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
