
import React from 'react';
import { NavLink } from 'react-router-dom';

interface NavItemProps {
  to: string;
  icon: string;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex flex-1 flex-col items-center justify-end gap-1 transition-colors ${
        isActive ? 'text-primary' : 'text-slate-500 dark:text-slate-400'
      }`
    }
  >
    {({ isActive }) => (
      <>
        <span className={`material-symbols-outlined ${isActive ? 'fill' : ''}`}>{icon}</span>
        <p className="text-xs font-medium leading-normal tracking-[0.015em]">{label}</p>
      </>
    )}
  </NavLink>
);

const BottomNav: React.FC = () => {
  return (
    <footer className="flex gap-2 border-t border-slate-200 dark:border-slate-800 bg-background-light dark:bg-background-dark px-4 pb-3 pt-2 flex-shrink-0 z-10">
      <NavItem to="/" icon="dashboard" label="Dashboard" />
      <NavItem to="/map" icon="map" label="Map" />
      <NavItem to="/reports" icon="edit_document" label="Reports" />
      <NavItem to="/settings" icon="settings" label="Settings" />
    </footer>
  );
};

export default BottomNav;
