import { courses } from "../../../../data/courses";
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

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}