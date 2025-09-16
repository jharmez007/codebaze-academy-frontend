import Image from "next/image";
import Link from "next/link";
import { courses } from "../src/app/data/courses";

const HomeSectionContent = () => {
  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-5xl mx-auto px-6 space-y-12">
        {courses.map((course, idx) => (
          <div
            key={idx}
            className="flex flex-col md:flex-row items-center gap-6"
          >
            {/* Course Image */}
            <div className="w-full md:w-2/3">
              <Link href={`/course/${course.slug}`}>
                <Image
                  src={course.image}
                  alt={course.title}
                  width={500}
                  height={300}
                  className="rounded-lg shadow-md cursor-pointer"
                />
              </Link>
            </div>

            {/* Course Info */}
            <div className="w-full md:w-2/3 text-center md:text-left">
              <div className="mb-1 text-[#00bf63] font-semibold text-lg">
                ${course.price}
              </div>
              <Link href={`/course/${course.slug}`}>
                <h3
                  className="text-xl md:text-4xl font-bold text-black transition-all duration-200 cursor-pointer hover:underline"
                  style={{
                    textDecorationColor: "#00bf63",
                    textUnderlineOffset: "6px",
                  }}
                >
                  {course.title}
                </h3>
              </Link>
              <p className="my-4 md:my-8 max-w-sm text-gray-600">
                {course.description}
              </p>
              <Link
                href={`/course/${course.slug}`}
                className="inline-block px-6 py-3 bg-[#00bf63] text-white font-semibold rounded-full transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
              >
                View Course
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HomeSectionContent;
