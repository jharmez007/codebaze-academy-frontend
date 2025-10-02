export const students = [
  {
    id: "stu1",
    name: "John Doe",
    email: "john@example.com",
    courses: [
      { title: "Intro to Web Development", progress: 75 },
      { title: "React Basics", progress: 40 },
    ],
    signupDate: "2025-01-12",
    status: "active",
    activity: [
      { id: 1, type: "lesson", text: "Completed Lesson 3: HTML Basics", date: "2025-09-10" },
      { id: 2, type: "quiz", text: "Passed Quiz 1: HTML", date: "2025-09-08" },
      { id: 3, type: "lesson", text: "Viewed Lesson 2: Intro to HTML", date: "2025-09-07" },
    ],
  },
  {
    id: "stu2",
    name: "Jane Smith",
    email: "jane@example.com",
    courses: [{ title: "UI/UX Fundamentals", progress: 50 }],
    signupDate: "2025-02-05",
    status: "suspended",
    activity: [
      { id: 1, type: "lesson", text: "Completed Lesson 5: Color Theory", date: "2025-09-01" },
      { id: 2, type: "quiz", text: "Failed Quiz 2: Typography", date: "2025-08-28" },
    ],
  },
];
