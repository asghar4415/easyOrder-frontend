"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "@/context/AuthContext"; // Import Auth
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
} from "../icons/index";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

// 1. Updated Navigation Items for Restaurant Context
const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/merchant",
  },
  {
    icon: <BoxCubeIcon />, // Or import a specific icon
    name: "Kitchen Display",
    path: "/merchant/kitchen",
  },
  {
    icon: <ListIcon />,
    name: "Menu Management",
    subItems: [
      { name: "Categories", path: "/merchant/menu/categories" },
      { name: "Food Items", path: "/merchant/menu/items" },
    ],
  },
  {
    icon: <TableIcon />,
    name: "Orders",
    path: "/merchant/orders",
  },
  {
    icon: <UserCircleIcon />,
    name: "Restaurant Profile",
    path: "/merchant/profile",
  },
];

const othersItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Analytics",
    path: "/merchant/analytics",
  },
  {
    icon: <PlugInIcon />,
    name: "Settings",
    path: "/merchant/settings",
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const { logout } = useAuth(); // Get logout function

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  // Handle Submenu Opening based on Path
  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  // Handle Submenu Height Animation
  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (navItems: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-2">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active bg-orange-50 text-orange-600 dark:bg-white/5 dark:text-orange-400"
                  : "menu-item-inactive text-gray-700 dark:text-gray-400 hover:text-orange-600 dark:hover:text-white"
              } cursor-pointer w-full flex items-center p-2 rounded-lg transition-colors duration-200 ${
                !isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"
              }`}
            >
              <span
                className={`${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "text-orange-600 dark:text-orange-400"
                    : "text-gray-500 group-hover:text-orange-600 dark:text-gray-400 dark:group-hover:text-white"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="ml-3 font-medium flex-1 text-left">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType && openSubmenu?.index === index
                      ? "rotate-180 text-orange-600"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group flex items-center p-2 rounded-lg transition-colors duration-200 ${
                  isActive(nav.path)
                    ? "bg-orange-50 text-orange-600 dark:bg-white/5 dark:text-orange-400"
                    : "text-gray-700 dark:text-gray-400 hover:bg-gray-100 hover:text-orange-600 dark:hover:bg-white/5 dark:hover:text-white"
                } ${
                  !isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"
                }`}
              >
                <span
                  className={`${
                    isActive(nav.path)
                      ? "text-orange-600 dark:text-orange-400"
                      : "text-gray-500 group-hover:text-orange-600 dark:text-gray-400 dark:group-hover:text-white"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="ml-3 font-medium">{nav.name}</span>
                )}
              </Link>
            )
          )}
          
          {/* Submenu Children */}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9 border-l border-gray-200 dark:border-gray-800 pl-3">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                        isActive(subItem.path)
                          ? "text-orange-600 font-medium bg-orange-50/50 dark:text-orange-400 dark:bg-white/5"
                          : "text-gray-500 hover:text-orange-600 dark:text-gray-400 dark:hover:text-white"
                      }`}
                    >
                      {subItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-40 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 2. Updated Logo Section */}
      <div
        className={`py-6 flex items-center ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start gap-3"
        }`}
      >
        <Link href="/merchant" className="flex items-center gap-2">
          {/* Icon - Always Visible */}
          <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
              <path d="M12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="currentColor"/>
            </svg>
          </div>
          
          {/* Text - Only Visible when Expanded/Hovered */}
          {(isExpanded || isHovered || isMobileOpen) && (
             <span className="text-xl font-bold text-gray-800 dark:text-white whitespace-nowrap">
              Easy<span className="text-orange-500">Order</span>
            </span>
          )}
        </Link>
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-6">
            <div>
              <h2
                className={`mb-4 text-xs uppercase font-semibold tracking-wider text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center flex"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Main Menu"
                ) : (
                  <HorizontaLDots className="w-5 h-5" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>

            <div>
              <h2
                className={`mb-4 text-xs uppercase font-semibold tracking-wider text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center flex"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <HorizontaLDots className="w-5 h-5" />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
        
        {/* 3. New Logout Button Area */}
        <div className="mt-auto border-t border-gray-100 dark:border-gray-800 pt-4 pb-4">
           <button
             onClick={logout}
             className={`menu-item group flex items-center p-2 rounded-lg transition-colors duration-200 text-gray-600 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/10 dark:hover:text-red-500 w-full ${
                !isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"
              }`}
           >
             <span className="text-gray-500 group-hover:text-red-600 dark:text-gray-400 dark:group-hover:text-red-500">
               <PlugInIcon className="w-5 h-5 rotate-180" /> {/* Reused icon for Logout look */}
             </span>
             {(isExpanded || isHovered || isMobileOpen) && (
                <span className="ml-3 font-medium">Log Out</span>
              )}
           </button>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;