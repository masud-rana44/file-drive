"use client";

import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { FileIcon, StarIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  {
    label: "All Files",
    href: "/dashboard/files",
    icon: <FileIcon />,
  },
  {
    label: "Favorites",
    href: "/dashboard/favorites",
    icon: <StarIcon />,
  },
  {
    label: "Trash",
    href: "/dashboard/trash",
    icon: <TrashIcon />,
  },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-4 border-r bg-gray-50 py-10 px-4">
      {navLinks.map((link) => (
        <Link key={link.href} href={link.href} className="px-16 ">
          <Button
            variant="link"
            className={clsx("flex gap-2 text-md cursor-pointer", {
              "text-blue-500 bg-gray-100": pathname.includes(link.href),
            })}
          >
            {link.icon} {link.label}
          </Button>
        </Link>
      ))}
    </div>
  );
}
