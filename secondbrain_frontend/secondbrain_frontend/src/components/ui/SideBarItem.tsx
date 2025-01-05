// SideBarItem.tsx
import { ReactElement, MouseEventHandler } from "react";

interface SideBarItemProps {
  text: string;
  icon: ReactElement;
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export function SideBarItem({ text, icon, className, onClick }: SideBarItemProps) {
  return (
    <div
      className={`flex items-center pt-4 hover:bg-gray-200 rounded max-w-48 pl-4 transition-all duration-400 ${className}`}
      onClick={onClick}
    >
      <div className="pr-2">{icon}</div>
      <div>{text}</div>
    </div>
  );
}