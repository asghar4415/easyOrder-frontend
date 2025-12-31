"use client";
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "../../context/SidebarContext";
import { useAuth } from "@/context/AuthContext";
import { useSuperAdminRestaurants } from "@/context/AdminRestaurantContext";
import {
  BoxCubeIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PieChartIcon,
  PlugInIcon,
  UserCircleIcon,
} from "../../icons/index";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const AppSidebar: React.FC = () => {
  const { restaurants } = useSuperAdminRestaurants();
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const { logout } = useAuth();

  const { mainItems, systemItems } = useMemo(() => {
    const main: NavItem[] = [
      {
        icon: <GridIcon />,
        name: "Dashboard",
        path: "/admin/dashboard",
      },
      {
        icon: <BoxCubeIcon />,
        name: "Restaurants",
        subItems: [
          { name: "List View", path: "/admin/restaurants" },
          { name: "Add New", path: "/admin/restaurants/create" },
        ],
      },
      {
        icon: <UserCircleIcon />,
        name: "User Management",
        subItems: [
          { name: "Staff & Owners", path: "/admin/users" },
          { name: "Roles & Permissions", path: "/admin/users/roles" },
        ],
      },
      {
        icon: <ListIcon />,
        name: "Global Menus",
        path: "/admin/menus",
      },
    ];

    const system: NavItem[] = [
      {
        icon: <PieChartIcon />,
        name: "Platform Analytics",
        path: "/admin/analytics",
      },
      {
        icon: <PlugInIcon />,
        name: "System Settings",
        path: "/admin/settings",
      },
    ];

    return { mainItems: main, systemItems: system };
  }, [restaurants]);

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    let submenuMatched = false;
    mainItems.forEach((nav, index) => {
      if (nav.subItems?.some(sub => pathname.startsWith(sub.path))) {
        setOpenSubmenu({ type: "main", index });
        submenuMatched = true;
      }
    });
    systemItems.forEach((nav, index) => {
      if (nav.subItems?.some(sub => pathname.startsWith(sub.path))) {
        setOpenSubmenu({ type: "others", index });
        submenuMatched = true;
      }
    });
    if (!submenuMatched && !isHovered && !isExpanded) {
      setOpenSubmenu(null);
    }
  }, [pathname, mainItems, systemItems, isHovered, isExpanded]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prev) => {
      if (prev?.type === menuType && prev?.index === index) return null;
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (navItems: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-2">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <>
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                className={`menu-item group w-full flex items-center p-2 rounded-lg transition-colors duration-200 ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "bg-orange-50 text-orange-600 dark:bg-white/5 dark:text-orange-400"
                    : "text-gray-700 dark:text-gray-400 hover:text-orange-600 dark:hover:text-white"
                } ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`}
              >
                <span className={openSubmenu?.type === menuType && openSubmenu?.index === index ? "text-orange-600" : "text-gray-400 group-hover:text-orange-600"}>
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <>
                    <span className="ml-3 font-medium flex-1 text-left">{nav.name}</span>
                    <ChevronDownIcon className={`w-5 h-5 transition-transform ${openSubmenu?.type === menuType && openSubmenu?.index === index ? "rotate-180" : ""}`} />
                  </>
                )}
              </button>
              
              {(isExpanded || isHovered || isMobileOpen) && (
                <div
                  ref={(el) => { subMenuRefs.current[`${menuType}-${index}`] = el; }}
                  className="overflow-hidden transition-all duration-300"
                  style={{ height: openSubmenu?.type === menuType && openSubmenu?.index === index ? `${subMenuHeight[`${menuType}-${index}`]}px` : "0px" }}
                >
                  <ul className="mt-2 space-y-1 ml-9 border-l border-gray-200 dark:border-gray-800 pl-3">
                    {nav.subItems.map((subItem) => (
                      <li key={subItem.path}>
                        <Link
                          href={subItem.path}
                          className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                            isActive(subItem.path)
                              ? "text-orange-600 font-bold bg-orange-50 dark:bg-white/5"
                              : "text-gray-500 hover:text-orange-600 dark:text-gray-400"
                          }`}
                        >
                          {subItem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group flex items-center p-2 rounded-lg transition-colors ${
                  isActive(nav.path)
                    ? "bg-orange-50 text-orange-600 dark:bg-white/5 dark:text-orange-400"
                    : "text-gray-700 dark:text-gray-400 hover:bg-gray-100 hover:text-orange-600"
                } ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`}
              >
                <span className={isActive(nav.path) ? "text-orange-600" : "text-gray-400 group-hover:text-orange-600"}>
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && <span className="ml-3 font-medium">{nav.name}</span>}
              </Link>
            )
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 lg:mt-0 top-0 left-0 bg-white dark:bg-gray-900 h-screen transition-all duration-300 z-40 border-r border-gray-200 dark:border-gray-800 px-5 flex flex-col
        ${isExpanded || isMobileOpen || isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. Header Area (Always Top) */}
      <div className={`py-6 flex items-center ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start gap-3"}`}>
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg">
             <GridIcon />
          </div>
          {(isExpanded || isHovered || isMobileOpen) && (
            <span className="text-xl font-bold">Easy<span className="text-orange-500">Admin</span></span>
          )}
        </Link>
      </div>

      {/* 2. Scrollable Middle Area (flex-1) */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
        <nav className="space-y-8">
          <div>
            <h2 className={`mb-4 text-xs uppercase font-bold text-gray-400 tracking-widest ${!isExpanded && !isHovered ? "text-center" : ""}`}>
              {isExpanded || isHovered || isMobileOpen ? "Administration" : <HorizontaLDots />}
            </h2>
            {renderMenuItems(mainItems, "main")}
          </div>

          <div>
            <h2 className={`mb-4 text-xs uppercase font-bold text-gray-400 tracking-widest ${!isExpanded && !isHovered ? "text-center" : ""}`}>
              {isExpanded || isHovered || isMobileOpen ? "System" : <HorizontaLDots />}
            </h2>
            {renderMenuItems(systemItems, "others")}
          </div>
        </nav>
      </div>

      {/* 3. Footer Area (Always Pinned Bottom) */}
      <div className="mt-auto border-t border-gray-100 dark:border-gray-800 py-4 bg-white dark:bg-gray-900">
        <button 
          onClick={logout} 
          className={`flex items-center p-2 text-gray-500 hover:text-red-500 w-full transition-colors ${!isExpanded && !isHovered ? "justify-center" : "justify-start"}`}
        >
          <PlugInIcon className="rotate-180" />
          {(isExpanded || isHovered || isMobileOpen) && <span className="ml-3 font-bold">Log Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;