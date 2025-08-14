import Link from "next/link";
export default function Footer() {
  return (
    <footer className="w-full border-t mt-16">
      <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-gray-500 flex items-center justify-between">
        <p>© {new Date().getFullYear()} Overseas.ai. All rights reserved.</p>
        <nav className="flex gap-4">
          <Link className="hover:underline" href="/privacy-policy">Privacy</Link>
          <Link className="hover:underline" href="/terms">Terms</Link>
          <Link className="hover:underline" href="/refund-policy">Refund</Link>
        </nav>
      </div>
    </footer>
  );
}
