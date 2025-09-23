"use client";
import Link from "next/link";
import { useFullscreen } from "../context/FullscreenContext"; 

const Breadcrumb = ({ items }: { items: { label: string; href?: string }[] }) => {
  const { fullscreen, toggleFullscreen } = useFullscreen(); 

  return (
    <nav className="flex items-center justify-between text-sm text-gray-500 mb-4">
      {/* Breadcrumb items */}
      <div>
        {items.map((item, i) => (
          <span key={i}>
            {item.href ? (
              <Link href={item.href} className="hover:underline text-gray-700">
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
        className="ml-4 px-2 py-1 text-xs border rounded text-gray-700 hover:bg-gray-100"
      >
        {fullscreen ? "Exit Fullscreen" : "Fullscreen"}
      </button>
    </nav>
  );
};

export default Breadcrumb;
