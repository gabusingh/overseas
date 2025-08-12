"use client";
import Link from "next/link";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "../../components/ui/navigation-menu";

export default function Header() {
  return (
    <header className="w-full border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg">Overseas.ai</Link>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/jobs" className="px-3 py-2 rounded-md hover:bg-gray-100">Jobs</Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/training-institutes" className="px-3 py-2 rounded-md hover:bg-gray-100">Institutes</Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/recruiting-companies" className="px-3 py-2 rounded-md hover:bg-gray-100">Companies</Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/contact-us" className="px-3 py-2 rounded-md hover:bg-gray-100">Contact</Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}
