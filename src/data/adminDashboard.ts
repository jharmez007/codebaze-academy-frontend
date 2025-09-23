// src/data/adminDashboard.ts

export const statsData = [
  { label: "Students", value: 1245, icon: "Users" },
  { label: "Courses", value: 32, icon: "BookOpen" },
  { label: "Revenue", value: 3200000, icon: "DollarSign" },
  { label: "Promotions", value: 5, icon: "Tag" },
];

export const revenueData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Revenue",
      data: [120000, 190000, 300000, 500000, 200000, 330000],
    },
  ],
};

export const enrollmentsData = {
  labels: ["React", "Next.js", "Tailwind", "Node.js", "MongoDB"],
  datasets: [
    {
      label: "Enrollments",
      data: [120, 95, 80, 70, 60],
    },
  ],
};

export const recentActivity = [
  { id: 1, text: "John Doe enrolled in React Basics", date: "2h ago" },
  { id: 2, text: "New course published: Advanced Next.js", date: "1d ago" },
  { id: 3, text: "Jane Smith signed up", date: "3d ago" },
];
