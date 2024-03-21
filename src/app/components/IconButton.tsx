import React, { ReactNode } from "react";

type IconButtonProps = {
  onClick: () => void;
  children: ReactNode;
};

export default function IconButton({ onClick, children }: IconButtonProps) {
  return (
    <button
      className="bg-slate-900 p-1 hover:bg-slate-600 transition-colors duration-150"
      onClick={() => onClick()}
    >
      {children}
    </button>
  );
}
