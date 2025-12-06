import { courses } from "../../../../data/courses";
import  ProtectedRoute  from "@/components/ProtectedRoute";

// Metadata
export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const { slug } = params;
  const course = courses.find(c => c.slug === slug);

  if (!course) {
    return {
      title: "Courses",
      description: " Browse our available courses",
    };
  }

  return {
    title: course.title,
    description: course.description,
  };
}

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  return <><ProtectedRoute>{children}</ProtectedRoute></>;
}