import course1 from "../../../public/course1.jpg";
import course2 from "../../../public/course2.jpg";
import course3 from "../../../public/course3.jpg";

export const courses = [
  {
    slug: "frontend-foundations",
    title: "Frontend Foundations",
    description:
      "Master the essentials of HTML, CSS, and JavaScript to build strong, modern web interfaces from scratch.",
    longDescription:
      "This comprehensive course covers everything you need to become a proficient frontend developer. You'll start with the basics of the web, move through HTML and CSS, and then dive deep into JavaScript.  ",
    image: course1,
    price: "45",
    type: "dynamic",
    contents: [
      {
        description: "Learn the fundamentals of frontend development.",
        section: "Introduction to Frontend Development",
        lessons: [
          {
            title: "00 - Welcome & Course Overview",
            duration: "5 mins",
            size: "120 MB",
            type: "video",
          },
          {
            title: "01 - What is Frontend Development?",
            duration: "8 mins",
            size: "180 MB",
            type: "video",
          },
          {
            title: "02 - Setting Up Your Development Environment",
            duration: "10 mins",
            size: "200 MB",
            type: "video",
          },
        ],
      },
      {
        description: "Build a solid foundation in HTML.",
        section: "HTML Essentials",
        lessons: [
          {
            title: "03 - HTML Syntax & Structure",
            duration: "12 mins",
            size: "250 MB",
            type: "video",
          },
          {
            title: "04 - Semantic HTML & Accessibility",
            duration: "14 mins",
            size: "300 MB",
            type: "video",
          },
          {
            title: "05 - Forms and Inputs",
            duration: "13 mins",
            size: "270 MB",
            type: "video",
          },
        ],
      },
      {
        description: "Style your web pages with CSS.",
        section: "CSS Fundamentals",
        lessons: [
          {
            title: "06 - CSS Syntax & Selectors",
            duration: "11 mins",
            size: "230 MB",
            type: "video",
          },
          {
            title: "07 - Box Model & Positioning",
            duration: "15 mins",
            size: "320 MB",
            type: "video",
          },
          {
            title: "08 - Flexbox & Grid Layouts",
            duration: "18 mins",
            size: "400 MB",
            type: "video",
          },
          {
            title: "09 - Responsive Design & Media Queries",
            duration: "16 mins",
            size: "350 MB",
            type: "video",
          },
        ],
      },
      {
        description: "Get started with JavaScript programming.",
        section: "JavaScript Basics",
        lessons: [
          {
            title: "10 - JavaScript Syntax & Variables",
            duration: "13 mins",
            size: "280 MB",
            type: "video",
          },
          {
            title: "11 - Functions & Control Flow",
            duration: "15 mins",
            size: "310 MB",
            type: "video",
          },
          {
            title: "12 - DOM Manipulation",
            duration: "17 mins",
            size: "360 MB",
            type: "video",
          },
          {
            title: "13 - Events & User Interaction",
            duration: "14 mins",
            size: "290 MB",
            type: "video",
          },
        ],
      },
      {
        description: "Learn version control and collaborate on projects.",
        section: "Version Control & Collaboration",
        lessons: [
          {
            title: "14 - Introduction to Git & GitHub",
            duration: "10 mins",
            size: "200 MB",
            type: "video",
          },
          {
            title: "15 - Basic Git Commands",
            duration: "12 mins",
            size: "240 MB",
            type: "video",
          },
          {
            title: "16 - Collaborating on Projects",
            duration: "13 mins",
            size: "260 MB",
            type: "video",
          },
        ],
      },
      {
        description: "Apply your skills in real-world projects.",
        section: "Building Real Projects",
        lessons: [
          {
            title: "17 - Project 1: Personal Portfolio Website",
            duration: "20 mins",
            size: "500 MB",
            type: "video",
          },
          {
            title: "18 - Project 2: Responsive Blog Layout",
            duration: "22 mins",
            size: "540 MB",
            type: "video",
          },
          {
            title: "19 - Project 3: Interactive To-Do List",
            duration: "18 mins",
            size: "430 MB",
            type: "video",
          },
        ],
      },
      {
        description: "Optimize and prepare for advanced topics.",
        section: "Best Practices & Next Steps",
        lessons: [
          {
            title: "20 - Web Performance & Optimization",
            duration: "12 mins",
            size: "220 MB",
            type: "video",
          },
          {
            title: "21 - Accessibility & SEO Basics",
            duration: "14 mins",
            size: "260 MB",
            type: "video",
          },
          {
            title: "22 - Preparing for Advanced Frameworks",
            duration: "10 mins",
            size: "180 MB",
            type: "video",
          },
        ],
      },
    ],
  },
  {
    slug: "html-unlocked",
    title: "HTML Unlocked",
    description:
      "Unlock the full power of HTML. Learn semantic markup, accessibility, and best practices for building robust web pages.",
    longDescription:
      "Dive deep into HTML and discover how to create well-structured, accessible, and SEO-friendly web pages. This course covers everything from basic tags to advanced semantic elements, forms, tables, and multimedia integration. You'll also learn about accessibility standards and how to ensure your pages are usable by everyone.",
    image: course2,
    price: "20",
    type: "dynamic",
    contents: [
      {
        description: "Get started with HTML.",
        section: "Introduction",
        lessons: [
          {
            title: "00 - Welcome to HTML",
            duration: "5 mins",
            size: "210 MB",
            type: "video",
          },
        ],
      },
      {
        description: "Build a solid foundation in HTML.",
        section: "Core HTML",
        lessons: [
          {
            title: "01 - Headings, Paragraphs, and Text",
            duration: "12 mins",
            size: "350 MB",
            type: "video",
          },
          {
            title: "02 - Links and Images",
            duration: "10 mins",
            size: "280 MB",
            type: "video",
          },
          {
            title: "03 - Lists and Tables",
            duration: "14 mins",
            size: "410 MB",
            type: "video",
          },
        ],
      },
    ],
  },
  {
    slug: "css-mastery",
    title: "CSS Mastery",
    description:
      "Take your CSS skills to the next level. Explore layouts, animations, responsive design, and advanced styling techniques.",
    longDescription:
      "This course is designed for those who want to become CSS experts. You'll learn about advanced selectors, layout systems like Flexbox and Grid, responsive design, animations, transitions, and how to create visually stunning web pages. By the end, you'll be able to tackle any CSS challenge with confidence.",
    image: course3,
    price: "35",
    type: "static",
    contents: [
      {
        description: "Introduction to advanced CSS concepts.",
        section: "Introduction",
        lessons: [
          {
            title: "00 - CSS Setup",
            duration: "4 mins",
            size: "150 MB",
            type: "video",
          },
        ],
      },
      {
        description: "Master core styling techniques.",
        section: "Core Styling",
        lessons: [
          {
            title: "01 - Colors, Fonts, and Text",
            duration: "11 mins",
            size: "300 MB",
            type: "video",
          },
          {
            title: "02 - Box Model and Spacing",
            duration: "13 mins",
            size: "340 MB",
            type: "video",
          },
          {
            title: "03 - Flexbox Basics",
            duration: "15 mins",
            size: "390 MB",
            type: "video",
          },
        ],
      },
      {
        description: "Learn advanced layout techniques.",
        section: "Advanced Layouts",
        lessons: [
          {
            title: "04 - CSS Grid",
            duration: "17 mins",
            size: "420 MB",
            type: "video",
          },
          {
            title: "05 - Responsive Design",
            duration: "14 mins",
            size: "360 MB",
            type: "video",
          },
        ],
      },
    ],
  },
];
