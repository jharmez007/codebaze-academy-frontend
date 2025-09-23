import course1 from "../../public/course1.jpg";
import course2 from "../../public/course2.jpg";
import course3 from "../../public/course3.jpg";

export const courses = [
  {
    slug: "frontend-foundations",
    title: "Frontend Foundations",
    description:
      "Master the essentials of HTML, CSS, and JavaScript to build strong, modern web interfaces from scratch.",
    longDescription:
      "This comprehensive course covers everything you need to become a proficient frontend developer. You'll start with the basics of the web, move through HTML and CSS, and then dive deep into JavaScript.",
    image: course1,
    total: 23,
    completed: 2,
    price: "45",
    type: "dynamic",
    sections: [
      {
        slug: "introduction-to-frontend-development",
        description: "Learn the fundamentals of frontend development.",
        section: "Introduction to Frontend Development",
        lessons: [
          {
            slug: "welcome-course-overview",
            title: "00 - Welcome & Course Overview",
            duration: "5 mins",
            size: "120 MB",
            type: "video",
            video: { type: "upload", url: "https://cdn.example.com/videos/welcome.mp4" },
            notes: { type: "pdf", url: "https://cdn.example.com/notes/welcome.pdf" },
            quizzes: [
              {
                id: "quiz1",
                question: "What will this course help you learn?",
                type: "multiple_choice",
                options: [
                  { id: "opt1", text: "Frontend basics" },
                  { id: "opt2", text: "Backend development" },
                  { id: "opt3", text: "DevOps pipelines" }
                ],
                answer: "opt1",
                explanation: "This course focuses on frontend development skills."
              }
            ]
          },
          {
            slug: "what-is-frontend-development",
            title: "01 - What is Frontend Development?",
            duration: "8 mins",
            size: "180 MB",
            type: "video",
            video: { type: "upload", url: "https://cdn.example.com/videos/frontend-intro.mp4" },
            notes: null,
            quizzes: [
              {
                id: "quiz2",
                question: "Frontend deals with…?",
                type: "true_false",
                answer: "true",
                explanation: "Frontend development is about the user-facing part of web apps."
              }
            ]
          },
          {
            slug: "setting-up-development-environment",
            title: "02 - Setting Up Your Development Environment",
            duration: "10 mins",
            size: "200 MB",
            type: "video",
            video: { type: "upload", url: "https://cdn.example.com/videos/dev-setup.mp4" },
            notes: null,
            quizzes: []
          }
        ]
      },
      {
        slug: "html-essentials",
        description: "Build a solid foundation in HTML.",
        section: "HTML Essentials",
        lessons: [
          {
            slug: "html-syntax-structure",
            title: "03 - HTML Syntax & Structure",
            duration: "12 mins",
            size: "250 MB",
            type: "video",
            video: { type: "upload", url: "https://cdn.example.com/videos/html-syntax.mp4" },
            notes: { type: "pdf", url: "https://cdn.example.com/notes/html-syntax.pdf" },
            quizzes: []
          },
          {
            slug: "semantic-html-accessibility",
            title: "04 - Semantic HTML & Accessibility",
            duration: "14 mins",
            size: "300 MB",
            type: "video",
            video: { type: "upload", url: "https://cdn.example.com/videos/semantic-html.mp4" },
            notes: null,
            quizzes: []
          },
          {
            slug: "forms-and-inputs",
            title: "05 - Forms and Inputs",
            duration: "13 mins",
            size: "270 MB",
            type: "video",
            video: { type: "upload", url: "https://cdn.example.com/videos/forms.mp4" },
            notes: null,
            quizzes: []
          }
        ]
      },
      {
        slug: "css-fundamentals",
        description: "Style your web pages with CSS.",
        section: "CSS Fundamentals",
        lessons: [
          {
            slug: "css-syntax-selectors",
            title: "06 - CSS Syntax & Selectors",
            duration: "11 mins",
            size: "230 MB",
            type: "video",
            video: { type: "upload", url: "https://cdn.example.com/videos/css-syntax.mp4" },
            notes: null,
            quizzes: []
          },
          {
            slug: "box-model-positioning",
            title: "07 - Box Model & Positioning",
            duration: "15 mins",
            size: "320 MB",
            type: "video",
            video: { type: "upload", url: "https://cdn.example.com/videos/box-model.mp4" },
            notes: null,
            quizzes: []
          },
          {
            slug: "flexbox-grid-layouts",
            title: "08 - Flexbox & Grid Layouts",
            duration: "18 mins",
            size: "400 MB",
            type: "video",
            video: { type: "upload", url: "https://cdn.example.com/videos/flexbox-grid.mp4" },
            notes: null,
            quizzes: []
          },
          {
            slug: "responsive-design-media-queries",
            title: "09 - Responsive Design & Media Queries",
            duration: "16 mins",
            size: "350 MB",
            type: "video",
            video: { type: "upload", url: "https://cdn.example.com/videos/responsive.mp4" },
            notes: null,
            quizzes: []
          }
        ]
      },
      {
        slug: "javascript-basics",
        description: "Get started with JavaScript programming.",
        section: "JavaScript Basics",
        lessons: [
          {
            slug: "javascript-syntax-variables",
            title: "10 - JavaScript Syntax & Variables",
            duration: "13 mins",
            size: "280 MB",
            type: "video",
            video: { type: "upload", url: "https://cdn.example.com/videos/js-syntax.mp4" },
            notes: null,
            quizzes: []
          },
          {
            slug: "functions-control-flow",
            title: "11 - Functions & Control Flow",
            duration: "15 mins",
            size: "310 MB",
            type: "video",
            video: { type: "upload", url: "https://cdn.example.com/videos/functions.mp4" },
            notes: null,
            quizzes: []
          },
          {
            slug: "dom-manipulation",
            title: "12 - DOM Manipulation",
            duration: "17 mins",
            size: "360 MB",
            type: "video",
            video: { type: "upload", url: "https://cdn.example.com/videos/dom.mp4" },
            notes: null,
            quizzes: []
          },
          {
            slug: "events-user-interaction",
            title: "13 - Events & User Interaction",
            duration: "14 mins",
            size: "290 MB",
            type: "video",
            video: { type: "upload", url: "https://cdn.example.com/videos/events.mp4" },
            notes: null,
            quizzes: []
          }
        ]
      },
      {
        slug: "version-control-collaboration",
        description: "Learn version control and collaborate on projects.",
        section: "Version Control & Collaboration",
        lessons: [
          {
            slug: "introduction-to-git-github",
            title: "14 - Introduction to Git & GitHub",
            duration: "10 mins",
            size: "200 MB",
            type: "video",
            video: { type: "upload", url: "https://cdn.example.com/videos/git-intro.mp4" },
            notes: null,
            quizzes: []
          },
          {
            slug: "basic-git-commands",
            title: "15 - Basic Git Commands",
            duration: "12 mins",
            size: "240 MB",
            type: "video",
            video: { type: "upload", url: "https://cdn.example.com/videos/git-commands.mp4" },
            notes: null,
            quizzes: []
          },
          {
            slug: "collaborating-on-projects",
            title: "16 - Collaborating on Projects",
            duration: "13 mins",
            size: "260 MB",
            type: "video",
            video: { type: "upload", url: "https://cdn.example.com/videos/git-collab.mp4" },
            notes: null,
            quizzes: []
          }
        ]
      },
      {
        slug: "building-real-projects",
        description: "Apply your skills in real-world projects.",
        section: "Building Real Projects",
        lessons: [
          {
            slug: "project-portfolio-website",
            title: "17 - Project 1: Personal Portfolio Website",
            duration: "20 mins",
            size: "500 MB",
            type: "video",
            video: { type: "upload", url: "https://cdn.example.com/videos/portfolio.mp4" },
            notes: null,
            quizzes: []
          },
          {
            slug: "project-blog-layout",
            title: "18 - Project 2: Responsive Blog Layout",
            duration: "22 mins",
            size: "540 MB",
            type: "video",
            video: { type: "upload", url: "https://cdn.example.com/videos/blog.mp4" },
            notes: null,
            quizzes: []
          },
          {
            slug: "project-todo-list",
            title: "19 - Project 3: Interactive To-Do List",
            duration: "18 mins",
            size: "430 MB",
            type: "video",
            video: { type: "upload", url: "https://cdn.example.com/videos/todo.mp4" },
            notes: null,
            quizzes: []
          }
        ]
      },
      {
        slug: "best-practices-next-steps",
        description: "Optimize and prepare for advanced topics.",
        section: "Best Practices & Next Steps",
        lessons: [
          {
            slug: "web-performance-optimization",
            title: "20 - Web Performance & Optimization",
            duration: "12 mins",
            size: "220 MB",
            type: "video",
            video: { type: "upload", url: "https://cdn.example.com/videos/performance.mp4" },
            notes: null,
            quizzes: []
          },
          {
            slug: "accessibility-seo-basics",
            title: "21 - Accessibility & SEO Basics",
            duration: "14 mins",
            size: "260 MB",
            type: "video",
            video: { type: "upload", url: "https://cdn.example.com/videos/seo.mp4" },
            notes: null,
            quizzes: []
          },
          {
            slug: "preparing-advanced-frameworks",
            title: "22 - Preparing for Advanced Frameworks",
            duration: "10 mins",
            size: "180 MB",
            type: "video",
            video: { type: "upload", url: "https://cdn.example.com/videos/frameworks.mp4" },
            notes: null,
            quizzes: []
          }
        ]
      }
    ]
  },
  {
    slug: "html-unlocked",
    title: "HTML Unlocked",
    description:
      "Unlock the full power of HTML. Learn semantic markup, accessibility, and best practices for building robust web pages.",
    longDescription:
      "Dive deep into HTML and discover how to create well-structured, accessible, and SEO-friendly web pages. This course covers everything from basic tags to advanced semantic elements, forms, tables, and multimedia integration.",
    image: course2,
    total: 12,
    completed: 5,
    price: "20",
    type: "dynamic",
    sections: [
      {
        slug: "introduction",
        description: "Get started with HTML.",
        section: "Introduction",
        lessons: [
          {
            slug: "welcome-to-html",
            title: "00 - Welcome to HTML",
            duration: "5 mins",
            size: "210 MB",
            type: "video",
            video: { type: "upload", url: "https://cdn.example.com/videos/html-welcome.mp4" },
            notes: null,
            quizzes: []
          }
        ]
      },
      {
        slug: "core-html",
        description: "Build a solid foundation in HTML.",
        section: "Core HTML",
        lessons: [
          {
            slug: "headings-paragraphs-text",
            title: "01 - Headings, Paragraphs, and Text",
            duration: "12 mins",
            size: "350 MB",
            type: "video",
            video: { type: "upload", url: "https://cdn.example.com/videos/headings.mp4" },
            notes: null,
            quizzes: []
          },
          {
            slug: "links-and-images",
            title: "02 - Links and Images",
            duration: "10 mins",
            size: "280 MB",
            type: "video",
            video: { type: "upload", url: "https://cdn.example.com/videos/links-images.mp4" },
            notes: null,
            quizzes: []
          },
          {
            slug: "lists-and-tables",
            title: "03 - Lists and Tables",
            duration: "14 mins",
            size: "410 MB",
            type: "video",
            video: { type: "upload", url: "https://cdn.example.com/videos/lists-tables.mp4" },
            notes: null,
            quizzes: []
          }
        ]
      }
    ]
  },
  {
    slug: "css-mastery",
    title: "CSS Mastery",
    description:
      "Take your CSS skills to the next level. Explore layouts, animations, responsive design, and advanced styling techniques.",
    longDescription:
      "This course is designed for those who want to become CSS experts. You'll learn about advanced selectors, layout systems like Flexbox and Grid, responsive design, animations, transitions, and how to create visually stunning web pages.",
    image: course3,
    total: 15,
    completed: 2,
    price: "35",
    type: "static",
    sections: [
      {
        slug: "introduction",
        description: "Introduction to advanced CSS concepts.",
        section: "Introduction",
        lessons: [
          {
            slug: "css-setup",
            title: "00 - CSS Setup",
            duration: "4 mins",
            size: "150 MB",
            type: "video",
            video: { type: "upload", url: "https://cdn.example.com/videos/css-setup.mp4" },
            notes: null,
            quizzes: []
          }
        ]
      },
      {
        slug: "core-styling",
        description: "Master core styling techniques.",
        section: "Core Styling",
        lessons: [
          {
            slug: "colors-fonts-text",
            title: "01 - Colors, Fonts, and Text",
            duration: "11 mins",
            size: "300 MB",
            type: "video",
            video: { type: "upload", url: "https://cdn.example.com/videos/colors-fonts.mp4" },
            notes: null,
            quizzes: []
          },
          {
            slug: "box-model-spacing",
            title: "02 - Box Model and Spacing",
            duration: "13 mins",
            size: "340 MB",
            type: "video",
            video: { type: "upload", url: "https://cdn.example.com/videos/box-model.mp4" },
            notes: null,
            quizzes: []
          },
          {
            slug: "flexbox-basics",
            title: "03 - Flexbox Basics",
            duration: "15 mins",
            size: "390 MB",
            type: "video",
            video: { type: "upload", url: "https://cdn.example.com/videos/flexbox.mp4" },
            notes: null,
            quizzes: []
          }
        ]
      },
      {
        slug: "advanced-layouts",
        description: "Learn advanced layout techniques.",
        section: "Advanced Layouts",
        lessons: [
          {
            slug: "css-grid",
            title: "04 - CSS Grid",
            duration: "17 mins",
            size: "420 MB",
            type: "video",
            video: { type: "upload", url: "https://cdn.example.com/videos/css-grid.mp4" },
            notes: null,
            quizzes: []
          },
          {
            slug: "responsive-design",
            title: "05 - Responsive Design",
            duration: "14 mins",
            size: "360 MB",
            type: "video",
            video: { type: "upload", url: "https://cdn.example.com/videos/css-responsive.mp4" },
            notes: null,
            quizzes: []
          }
        ]
      }
    ]
  }
];
