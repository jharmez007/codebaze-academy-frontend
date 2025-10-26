"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ListFilter, ArrowUpDown, Search } from "lucide-react";
import { products } from "@/data/products";


const filters = [
  { key: "active", label: "Active products" },
  { key: "expired", label: "Expired products" },
  { key: "courses", label: "Courses" },
  { key: "downloads", label: "Downloads" },
  { key: "webinars", label: "Webinars" },
  { key: "coaching", label: "Coaching sessions" },
];

const sortOptions = [
  { key: "name", label: "Name" },
  { key: "dates", label: "Purchased" },
];

// Circular Progress Component
function CircularProgress({
  value,
  total,
  size = 20,
  strokeWidth = 2,
}: {
  value: number;
  total: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / total) * circumference;

  return (
    <svg width={size} height={size} className="shrink-0">
      <circle
        stroke="#e5e7eb"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        stroke="#000000"
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
    </svg>
  );
}

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const show = searchParams.get("show") || "active";
  const sort = searchParams.get("sort") || "name";

  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setFilterOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredProducts = useMemo(() => {
    let list = products;

    if (show !== "all") {
      list = list.filter((p) => p.type === show);
    }

    if (sort === "name") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "dates") {
      list = [...list].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }

    return list;
  }, [show, sort]);

  const handleFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("show", value);
    router.push(`/products?${params.toString()}`);
    setFilterOpen(false);
  };

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`/products?${params.toString()}`);
    setSortOpen(false);
  };

  const handleClear = () => {
    router.push("/products");
  };

  return (
    <div className=" bg-white">
      <div className="p-6 bg-white max-w-5xl mx-auto">
        <h1 className="text-lg text-black font-semibold mb-4">Products</h1>

        <div className="border border-gray-300 rounded-md p-4">
          {/* Filters */}
          <div className="flex gap-2 mb-4 relative flex-wrap">
            {/* Search input with icon */}
            <div className="relative flex-1 min-w-[120px]">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Filter by name"
                className="border border-gray-300 rounded pl-8 text-black pr-3 py-2 w-full text-sm placeholder:text-gray-400"
              />
            </div>

            {/* Filter dropdown */}
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => {
                  setFilterOpen(!filterOpen);
                  setSortOpen(false);
                }}
                className="flex items-center gap-1 border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <ListFilter className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {filters.find((f) => f.key === show)?.label}
                </span>
              </button>

              {filterOpen && (
                <div className="absolute right-0 z-10 mt-1 w-56 rounded-md border p-2 border-gray-200 bg-white shadow-lg">
                  {filters.map((f) => (
                    <button
                      key={f.key}
                      onClick={() => handleFilterChange(f.key)}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-sm text-left rounded-md hover:bg-gray-100 ${
                        show === f.key ? "font-semibold text-black" : "text-gray-700"
                      }`}
                    >
                      <span className="w-4 h-4 flex items-center justify-center border border-gray-400 rounded-full">
                        {show === f.key && (
                          <span className="w-2 h-2 bg-black rounded-full" />
                        )}
                      </span>
                      {f.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort dropdown */}
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => {
                  setSortOpen(!sortOpen);
                  setFilterOpen(false);
                }}
                className="flex items-center gap-1 border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <ArrowUpDown className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {sortOptions.find((s) => s.key === sort)?.label}
                </span>
              </button>

              {sortOpen && (
                <div className="absolute right-0 z-10 mt-1 w-40 rounded-md border p-2 border-gray-200 bg-white shadow-lg">
                  {sortOptions.map((s) => (
                    <button
                      key={s.key}
                      onClick={() => handleSortChange(s.key)}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-sm text-left rounded-md hover:bg-gray-100 ${
                        sort === s.key ? "font-semibold text-black" : "text-gray-700"
                      }`}
                    >
                      <span className="w-4 h-4 flex items-center justify-center border border-gray-400 rounded-full">
                        {sort === s.key && (
                          <span className="w-2 h-2 bg-black rounded-full" />
                        )}
                      </span>
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product list */}
          {filteredProducts.length > 0 ? (
            <div className="flex flex-col gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 rounded-md p-3"
                >
                  {/* Image as link */}
                  <Link href={`/course/${product.slug}`}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={60}
                      height={60}
                      className="rounded cursor-pointer opacity-90 hover:opacity-100 object-cover"
                    />
                  </Link>

                  <div className="flex flex-col">
                    {/* Product name as link */}
                    <Link
                      href={`/course/${product.slug}`}
                      className="text-sm text-black font-semibold hover:underline"
                    >
                      {product.name}
                    </Link>
                    <div className="flex items-center gap-2 text-gray-500">
                      <CircularProgress
                        value={product.completed}
                        total={product.total}
                      />
                      {product.completed}/{product.total} completed
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Purchased: {new Date(product.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="font-semibold text-black">No results found.</p>
              <p className="text-sm text-gray-500 mb-4">
                Try changing or clearing your filters.
              </p>
              <button
                onClick={handleClear}
                className="border rounded px-4 py-2 text-sm text-gray-500 hover:bg-gray-100"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
