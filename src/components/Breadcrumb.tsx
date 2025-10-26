"use client";
import Link from "next/link";
import { Maximize2, Minimize2 } from 'lucide-react';
import { useFullscreen } from "../context/FullscreenContext"; 

const Breadcrumb = ({ items }: { items: { label: string; href?: string }[] }) => {
  const { fullscreen, toggleFullscreen } = useFullscreen(); 

  return (
    <nav className="flex items-center justify-between text-sm text-gray-500">
      {/* Breadcrumb items */}
      <div>
        {items.map((item, i) => (
          <span key={i}>
            {item.href ? (
              <Link href={item.href} className="hover:text-black text-gray-700 transition ease-in">
                {item.label}
              </Link>
            ) : (
              <span className="text-black">{item.label}</span>
            )}
            {i < items.length - 1 && " / "}
          </span>
        ))}
      </div>

      {/* Fullscreen toggle button */}
      <button
        onClick={toggleFullscreen}
        className="hidden lg:flex p-3 text-xs border rounded-md text-gray-700 hover:bg-gray-100"
        title={fullscreen ? "Close Fullscreen" : "Open Fullscreen"}
      >
        {fullscreen ? <Minimize2 className="w-4 h-4"  /> : <Maximize2 className="w-4 h-4"  />}
      </button>
    </nav>
  );
};

export default Breadcrumb;
