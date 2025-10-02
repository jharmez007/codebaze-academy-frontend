import Image from "next/image";
import course3 from "../../../../../public/course3.jpg";

export const metadata = {
  title: "CSS Mastery",
  description: "Take your CSS skills to the next level with this advanced course.",
};


export default function CssMasteryPage() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      {/* Hero */}
      <Image
        src={course3}
        alt="CSS Mastery"
        width={800}
        height={500}
        className="rounded-lg shadow-lg"
      />

      {/* Title + Price */}
      <div className="mt-6">
        <h1 className="text-3xl md:text-4xl font-bold">CSS Mastery</h1>
        <p className="text-[#00bf63] font-semibold text-xl mt-2">₦18,000</p>
      </div>

      {/* Custom Description */}
      <p className="text-gray-700 mt-4">
        Take your CSS skills to the next level. This course is different from
        others—it’s designed with extra depth, live coding demos, and unique
        projects not available in our standard dynamic courses.
      </p>

      {/* Special Course Content */}
      <div className="mt-8 bg-gray-100 p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4">What You’ll Learn</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>Master Flexbox & Grid Layouts</li>
          <li>Advanced Animations & Transitions</li>
          <li>Responsive Design Patterns</li>
          <li>Building Modern Landing Pages</li>
        </ul>
      </div>

      {/* Custom CTA */}
      <div className="mt-10">
        <button className="px-8 py-4 bg-[#00bf63] text-white font-bold rounded-full hover:shadow-lg transition-all transform hover:-translate-y-1">
          Enroll in CSS Mastery
        </button>
      </div>
    </div>
  );
}
