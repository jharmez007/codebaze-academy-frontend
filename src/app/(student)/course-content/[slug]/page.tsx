import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ScrollNavbar } from "../../../../components";
import { courses } from "../../../../data/courses";
import { SquarePlay, NotebookText } from "lucide-react";

// Metadata
export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const { slug } = params;
  const course = courses.find(c => c.slug === slug);

  if (!course) {
    return {
      title: "Course Not Found",
      description: "The course you are looking for does not exist.",
    };
  }

  return {
    title: course.title,
    description: course.description,
  };
}

export default async function CoursePage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const { slug } = params;
  const course = courses.find(c => c.slug === slug);

  if (!course) return notFound();

  return (
    <div className="w-full min-h-screen">
      <ScrollNavbar course={course} />
      {/* Course Banner */}
      <div className="w-full py-8 md:py-16 bg-gray-200">
        <div className="max-w-5xl mx-auto px-4 md:px-6 space-y-12 flex flex-col-reverse md:flex-row items-center gap-8 md:gap-12">
          {/* Left Section */}
          <div className="w-full md:w-2/3">
            <p className="text-[#00bf63] font-semibold mb-1">${course.price}</p>
            <h1 className="text-2xl md:text-3xl font-bold text-black mb-2">{course.title}</h1>
            <p className="text-gray-700 text-lg font-medium">
              Course • {course.total} Lessons
            </p>
            <p className="text-gray-600 font-extralight text-lg my-6">
              {course.longDescription}
            </p>
            <Link 
                href={`/checkout/${course.slug}`}
                className="inline-block px-6 py-3 bg-[#00bf63] text-white font-semibold rounded-full transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
              Buy Now
            </Link>
          </div>

          {/* Right Section (Course Image) */}
          <div className="w-full md:w-2/3">
            <Image
              src={course.image}
              alt={course.title}
              width={500}
              height={300}
              className="rounded-lg shadow-md cursor-pointer w-full object-cover"
              sizes="(max-width: 768px) 100vw, 500px"
            />
          </div>
        </div>
      </div>

      {/* Course Content */}
      {course.sections && (
        <div className="w-full py-12 md:py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <h2 className="text-2xl md:text-3xl text-black font-bold mb-6">Contents</h2>

            <div className="space-y-8">
              {course.sections.map((section, idx) => (
                <div key={idx} className="space-y-3">
                  {/* Section Title */}
                  <h3 className="text-xl md:text-2xl text-black font-semibold">{section.section}</h3>

                  {/* Optional Section Description */}
                  {section.description && (
                    <p className="text-gray-700 text-base md:text-lg my-5 font-extralight">{section.description}</p>
                  )}

                  {/* Lessons */}
                  <ul className="space-y-4 md:space-y-6 text-base md:text-lg">
                    {section.lessons?.map((lesson, lidx) => (
                      <li
                        key={lidx}
                        className="flex items-center text-gray-700"
                      >
                        {/* Icon */}
                        {lesson.type === "video" ? (
                          <span className="mr-2"><SquarePlay className="w-4 h-4 font-bold" /></span>
                        ) : (
                          <span className="mr-2"><NotebookText className="w-4 h-4 font-bold" /></span>
                        )}

                        {/* Lesson Title (truncate on small screens) */}
                        <span
                          className="font-medium max-w-[140px] sm:max-w-xs md:max-w-md truncate"
                          title={lesson.title}
                        >
                          {lesson.title}
                        </span>

                        {/* Duration & Size */}
                        {lesson.duration && (
                          <span className="ml-2 text-gray-500">
                            · {lesson.duration}
                          </span>
                        )}
                        {lesson.size && (
                          <span className="ml-2 text-gray-500">
                            · {lesson.size}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
