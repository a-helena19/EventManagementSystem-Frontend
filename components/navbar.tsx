"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavbarProps = {
  search?: string;
  onSearchChange?: (value: string) => void;
};

export default function Navbar({ search, onSearchChange }: NavbarProps) {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `nav-link ${pathname.startsWith(path) ? "fw-semibold text-primary" : "text-dark"}`;

  return (
    <nav className="navbar bg-white border-bottom px-4 navbar-compact" style={{ position: "sticky", top: 0, zIndex: 1000 }}>
      <div className="container-fluid d-flex align-items-center">

        {/* LEFT: Logo + Navigation */}
        <div className="d-flex align-items-center gap-4">
          <Link href="/events" className="navbar-brand d-flex align-items-center">
            <img
              src="/images/EVERout_Logo_dunkel_v3.png"
              alt="EVERout"
              height={70}
              className="navbar-logo"
            />
          </Link>

          <Link href="/events" className={linkClass("/events")}>
            EVENTS
          </Link>
        </div>

        {/* CENTER: Search */}
        {onSearchChange && (
          <div className="mx-auto" style={{ width: "420px" }}>
            <input
              className="form-control rounded-pill"
              placeholder="Search events by name or location"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        )}
      </div>
    </nav>
  );
}
