import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toggleActiveChat } from "@/pages/app/chat/store";
import useMobileMenu from "@/hooks/useMobileMenu";
import Submenu from "./Submenu";
import Icon from "@/components/ui/Icon";
import { useTranslation } from "react-i18next";

const Navmenu = ({ menus }) => {
  const { t } = useTranslation(); 
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [activeMultiMenu, setMultiMenu] = useState(null);
  const [mobileMenu, setMobileMenu] = useMobileMenu();
  const dispatch = useDispatch();
  const location = useLocation();
  const locationName = location.pathname.replace("/", "");

  const toggleSubmenu = (i) => setActiveSubmenu(activeSubmenu === i ? null : i);
  const toggleMultiMenu = (j) => setMultiMenu(activeMultiMenu === j ? null : j);

  const isLocationMatch = (targetLocation) =>
    locationName === targetLocation || locationName.startsWith(`${targetLocation}/`);

  useEffect(() => {
    let submenuIndex = null;
    let multiMenuIndex = null;

    menus.forEach((item, i) => {
      if (isLocationMatch(item.link)) submenuIndex = i;

      if (item.child) {
        item.child.forEach((childItem, j) => {
          if (isLocationMatch(childItem.childlink)) submenuIndex = i;

          if (childItem.multi_menu) {
            childItem.multi_menu.forEach((nestedItem) => {
              if (isLocationMatch(nestedItem.multiLink)) {
                submenuIndex = i;
                multiMenuIndex = j;
              }
            });
          }
        });
      }
    });

    setActiveSubmenu(submenuIndex);
    setMultiMenu(multiMenuIndex);
    dispatch(toggleActiveChat(false));
    if (mobileMenu) setMobileMenu(false);

    document.title = `Dashcode | ${locationName}`;
  }, [location]);

  return (
    <ul>
      {menus.map((item, i) => (
        <li
          key={i}
          className={`single-sidebar-menu ${item.child ? "item-has-children" : ""} ${
            activeSubmenu === i ? "open" : ""
          } ${locationName === item.link ? "menu-item-active" : ""}`}
        >
          {/* Menu item with no children */}
          {!item.child && !item.isHeadr && (
            <NavLink className="menu-link" to={item.link}>
              <span className="menu-icon grow-0">
                <Icon icon={item.icon} />
              </span>
              <div className="text-box grow">{t(`sidebar.${item.title}`)}</div>
              {item.badge && <span className="menu-badge">{item.badge}</span>}
            </NavLink>
          )}

          {/* Header label */}
          {item.isHeadr && !item.child && <div className="menulabel">{t(`sidebar.${item.title}`)}</div>}

          {/* Parent menu with children */}
          {item.child && (
            <div
              className={`menu-link ${activeSubmenu === i ? "parent_active not-collapsed" : "collapsed"}`}
              onClick={() => toggleSubmenu(i)}
            >
              <div className="flex-1 flex items-start">
                <span className="menu-icon">
                  <Icon icon={item.icon} />
                </span>
                <div className="text-box">{t(`sidebar.${item.title}`)}</div>
              </div>
              <div className="flex-0">
                <div className={`menu-arrow transform transition-all duration-300 ${activeSubmenu === i ? "rotate-90" : ""}`}>
                  <Icon icon="heroicons-outline:chevron-right" />
                </div>
              </div>
            </div>
          )}

          <Submenu
            activeSubmenu={activeSubmenu}
            item={item}
            i={i}
            toggleMultiMenu={toggleMultiMenu}
            activeMultiMenu={activeMultiMenu}
            t={t} 
          />
        </li>
      ))}
    </ul>
  );
};

export default Navmenu;