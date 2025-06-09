"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ClipboardList,
  Users,
  BarChart3,
  Settings,
} from "lucide-react";

const navigation = [
  {
    name: "รายการงาน",
    href: "/work-orders",
    icon: ClipboardList,
  },
  {
    name: "ลูกค้า",
    href: "/customers",
    icon: Users,
  },
  {
    name: "รายงาน",
    href: "/reports",
    icon: BarChart3,
  },
  {
    name: "ตั้งค่า",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-lg font-semibold">ระบบจัดการงานซ่อม</h1>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  isActive
                    ? "text-gray-900"
                    : "text-gray-400 group-hover:text-gray-500"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
} 