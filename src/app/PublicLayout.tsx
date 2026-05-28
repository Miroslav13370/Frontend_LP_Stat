import { ReactNode } from "react";

import { BrandHeader } from "./BrandHeader";

type PublicLayoutProps = {
  children: ReactNode;
  className?: string;
};

export function PublicLayout({ children, className = "" }: PublicLayoutProps) {
  return (
    <div
      className={`min-h-screen bg-[#08090b] text-white selection:bg-[#25f4ee] selection:text-black ${className}`}
    >
      <BrandHeader />
      {children}
    </div>
  );
}
