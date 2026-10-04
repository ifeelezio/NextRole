import { ResumeData, ResumeLayout } from "./types";

export const defaultResumeData: ResumeData = {
  title: "Software Engineer Resume",
  updatedAt: new Date().toISOString(),
  personalInfo: {
    fullName: "John Doe",
    jobTitle: "Software Engineer",
    email: "john@example.com",
    phone: "+91 98765 43210",
    location: "Bangalore, India",
    website: "johndoe.dev",
    linkedin: "linkedin.com/in/johndoe",
    github: "github.com/johndoe",
  },
  summary:
    "Software engineer with experience building scalable web applications and distributed systems. Passionate about performant user interfaces, cloud architecture, clean maintainable code, and high-velocity developer tooling.",
  experience: [
    {
      id: "exp-1",
      role: "Software Engineer",
      company: "TechCorp Global",
      location: "Bangalore, India",
      startDate: "2023",
      endDate: "Present",
      current: true,
      description:
        "• Built and maintained production web applications serving 120k+ daily active users with 99.9% uptime.\n• Improved core application performance and reduced p95 API response times by 38% through caching and query optimization.\n• Collaborated closely with cross-functional product, design, and QA teams in fast-paced two-week sprints.",
    },
    {
      id: "exp-2",
      role: "Associate Software Engineer",
      company: "DevStudio Technologies",
      location: "Hyderabad, India",
      startDate: "2021",
      endDate: "2023",
      current: false,
      description:
        "• Developed responsive user interfaces using React, TypeScript, and modern CSS component libraries.\n• Designed RESTful backend microservices in Node.js with PostgreSQL and Redis caching layers.\n• Implemented automated unit and end-to-end testing suites, increasing test coverage from 62% to 89%.",
    },
  ],
  education: [
    {
      id: "edu-1",
      degree: "B.Tech in Computer Science & Engineering",
      school: "National Institute of Technology",
      location: "India",
      startDate: "2017",
      endDate: "2021",
      gpa: "8.8 / 10.0",
    },
  ],
  skills:
    "JavaScript, TypeScript, React, Next.js, Node.js, Python, SQL, PostgreSQL, Redis, Docker, Git, REST APIs, Tailwind CSS, AWS",
  projects: [
    {
      id: "proj-1",
      name: "CloudSync — Distributed File Store",
      description:
        "High-throughput object storage engine featuring background deduplication and multi-region replication benchmarks.",
      link: "github.com/johndoe/cloudsync",
      technologies: "Go, Raft, gRPC, Docker",
      date: "2023",
    },
    {
      id: "proj-2",
      name: "DevPulse — Real-Time API Monitor",
      description:
        "Lightweight latency monitoring daemon with automated webhook notifications and interactive CLI dashboards.",
      link: "github.com/johndoe/devpulse",
      technologies: "TypeScript, React, WebSocket, SQLite",
      date: "2022",
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      date: "2023",
    },
  ],
  languages: [
    {
      id: "lang-1",
      language: "English",
      proficiency: "Fluent",
    },
  ],
  awards: [],
  customSections: [],
  settings: {
    template: "modern",
    fontFamily: "inter",
    fontSize: "medium",
    lineHeight: "normal",
    accentColor: "#18181b",
    margins: "normal",
    sectionSpacing: "normal",
  },
};

export const TEMPLATE_PREVIEWS: Record<ResumeLayout, ResumeData> = {
  minimal: {
    ...defaultResumeData,
    title: "Minimal Template Preview",
    personalInfo: {
      fullName: "Maya Thompson",
      jobTitle: "Senior Product Strategist",
      email: "maya.thompson@editorial.co",
      phone: "+1 (555) 345-6789",
      location: "New York, NY",
      website: "mayathompson.com",
      linkedin: "linkedin.com/in/mayathompson",
      github: "",
    },
    summary:
      "Strategic product leader with 7+ years directing zero-to-one product initiatives and enterprise transformation programs. Proven track record aligning technical architectures with long-term commercial goals.",
    experience: [
      {
        id: "exp-min-1",
        role: "Lead Product Strategist",
        company: "Aether Systems",
        location: "New York, NY",
        startDate: "2022",
        endDate: "Present",
        current: true,
        description:
          "• Spearheaded product discovery and MVP release for enterprise analytics platform generating $1.8M ARR in year one.\n• Conducted qualitative user research with 40+ enterprise buyers to define roadmap and core value propositions.",
      },
      {
        id: "exp-min-2",
        role: "Product Manager",
        company: "Vanguard Digital",
        location: "Boston, MA",
        startDate: "2019",
        endDate: "2022",
        current: false,
        description:
          "• Managed cross-functional squads across UX, frontend, and data engineering to launch mobile self-service portal.\n• Increased 30-day user retention by 24% through onboarding funnel redesign and automated customer feedback loops.",
      },
    ],
    education: [
      {
        id: "edu-min-1",
        degree: "B.A. in Economics & Media Studies",
        school: "Columbia University",
        location: "New York, NY",
        startDate: "2015",
        endDate: "2019",
        gpa: "3.85 / 4.00",
      },
    ],
    skills:
      "Product Strategy, User Research, Agile Scrum, Roadmapping, Data Analytics, Wireframing, SQL, Figma, Market Analysis",
    projects: [
      {
        id: "proj-min-1",
        name: "DesignSystem.guide — Open Standard",
        description:
          "Curated design system benchmarks and component architecture guides adopted by 2,000+ digital teams.",
        link: "mayathompson.com/guide",
        technologies: "Information Architecture, Editorial",
        date: "2023",
      },
    ],
    settings: {
      template: "minimal",
      fontFamily: "inter",
      fontSize: "medium",
      lineHeight: "normal",
      accentColor: "#18181b",
      margins: "normal",
      sectionSpacing: "normal",
    },
  },
  modern: {
    ...defaultResumeData,
    title: "Modern Template Preview",
    personalInfo: {
      fullName: "John Doe",
      jobTitle: "Software Engineer",
      email: "john@example.com",
      phone: "+91 98765 43210",
      location: "Bangalore, India",
      website: "johndoe.dev",
      linkedin: "linkedin.com/in/johndoe",
      github: "github.com/johndoe",
    },
    settings: {
      template: "modern",
      fontFamily: "inter",
      fontSize: "medium",
      lineHeight: "normal",
      accentColor: "#18181b",
      margins: "normal",
      sectionSpacing: "normal",
    },
  },
  professional: {
    ...defaultResumeData,
    title: "Professional Template Preview",
    personalInfo: {
      fullName: "David Harrison",
      jobTitle: "Management Consultant & Financial Analyst",
      email: "d.harrison@advisory.org",
      phone: "+1 (555) 765-4321",
      location: "Chicago, IL",
      website: "davidharrison.org",
      linkedin: "linkedin.com/in/davidharrison",
      github: "",
    },
    summary:
      "Results-oriented consultant specialized in commercial due diligence, M&A integration, and operational turnarounds for Global 500 industrials. Led financial model auditing for over $2.4B in corporate transactions.",
    experience: [
      {
        id: "exp-pro-1",
        role: "Senior Consultant",
        company: "Bainbridge Strategy Partners",
        location: "Chicago, IL",
        startDate: "2022",
        endDate: "Present",
        current: true,
        description:
          "• Directed financial synergy assessments for 3 cross-border industrial acquisitions totaling $1.2B in enterprise value.\n• Structured comprehensive margin expansion playbooks reducing client operational expenditure by 14% across 8 manufacturing sites.",
      },
      {
        id: "exp-pro-2",
        role: "Financial Analyst",
        company: "Sterling Capital Advisory",
        location: "New York, NY",
        startDate: "2019",
        endDate: "2022",
        current: false,
        description:
          "• Constructed dynamic 3-statement financial models, discounted cash flow (DCF), and LBO valuation analyses for institutional investors.\n• Authored quarterly industry overview briefs distributed to 150+ private equity partners and C-suite stakeholders.",
      },
    ],
    education: [
      {
        id: "edu-pro-1",
        degree: "B.S. in Finance & Accounting",
        school: "University of Pennsylvania (Wharton)",
        location: "Philadelphia, PA",
        startDate: "2015",
        endDate: "2019",
        gpa: "3.92 / 4.00 (Summa Cum Laude)",
      },
    ],
    skills:
      "Financial Modeling, DCF & LBO Valuation, Due Diligence, M&A Integration, Capital Budgeting, Excel, PowerBI, Corporate Restructuring",
    projects: [
      {
        id: "proj-pro-1",
        name: "Renewable Energy Valuation Framework",
        description:
          "Published quantitative valuation framework for grid-scale battery storage and solar infrastructure investments.",
        link: "davidharrison.org/energy",
        technologies: "Quantitative Modeling, Risk Assessment",
        date: "2023",
      },
    ],
    settings: {
      template: "professional",
      fontFamily: "serif",
      fontSize: "medium",
      lineHeight: "compact",
      accentColor: "#0f172a",
      margins: "compact",
      sectionSpacing: "normal",
    },
  },
  developer: {
    ...defaultResumeData,
    title: "Developer Template Preview",
    personalInfo: {
      fullName: "Marcus Vance",
      jobTitle: "Senior Systems & Cloud Infrastructure Engineer",
      email: "marcus@vance.dev",
      phone: "+1 (555) 890-1234",
      location: "San Francisco, CA",
      website: "vance.dev",
      linkedin: "linkedin.com/in/marcusvance",
      github: "github.com/marcusvance",
    },
    summary:
      "Systems engineer specialized in distributed consensus protocols, high-performance network programming, and Kubernetes infrastructure automation. Passionate about Linux internals, Go, and eBPF tooling.",
    experience: [
      {
        id: "exp-dev-1",
        role: "Staff Infrastructure Engineer",
        company: "ScaleGrid Cloud",
        location: "San Francisco, CA",
        startDate: "2022",
        endDate: "Present",
        current: true,
        description:
          "• Architected multi-region Kubernetes ingress mesh handling 450,000 requests/sec with sub-millisecond routing overhead.\n• Implemented automated node autoscaling policies reducing monthly compute cloud spend by $140,000.",
      },
      {
        id: "exp-dev-2",
        role: "Systems Software Engineer",
        company: "CoreOS Labs",
        location: "Austin, TX",
        startDate: "2019",
        endDate: "2022",
        current: false,
        description:
          "• Contributed patches to upstream containerd and CRI-O runtimes optimizing container startup latency by 28%.\n• Designed distributed trace collection agents in Go and Rust utilizing eBPF kernel probes with minimal CPU consumption.",
      },
    ],
    education: [
      {
        id: "edu-dev-1",
        degree: "B.S. in Computer Engineering",
        school: "Georgia Institute of Technology",
        location: "Atlanta, GA",
        startDate: "2015",
        endDate: "2019",
      },
    ],
    skills:
      "Go, Rust, C++, Kubernetes, Docker, Linux Internals, eBPF, Terraform, AWS, Prometheus, gRPC, Protobuf, PostgreSQL",
    projects: [
      {
        id: "proj-dev-1",
        name: "raft-kv — Lightweight In-Memory KV Store",
        description:
          "LSM-tree key-value database implementing Raft consensus for fault-tolerant state replication with zero external dependencies.",
        link: "github.com/marcusvance/raft-kv",
        technologies: "Go, Raft, gRPC",
        date: "2023",
      },
      {
        id: "proj-dev-2",
        name: "net-probe — eBPF Packet Inspector",
        description:
          "Low-overhead packet capture tool analyzing TCP connection handshake latencies across container networks.",
        link: "github.com/marcusvance/net-probe",
        technologies: "Rust, eBPF, Linux",
        date: "2022",
      },
    ],
    settings: {
      template: "developer",
      fontFamily: "mono",
      fontSize: "small",
      lineHeight: "normal",
      accentColor: "#18181b",
      margins: "compact",
      sectionSpacing: "compact",
    },
  },
  creative: {
    ...defaultResumeData,
    title: "Creative Template Preview",
    personalInfo: {
      fullName: "Elena Rostova",
      jobTitle: "Staff Brand & Product Designer",
      email: "elena@rostova.design",
      phone: "+1 (555) 432-1098",
      location: "Brooklyn, NY",
      website: "rostova.design",
      linkedin: "linkedin.com/in/elenarostova",
      github: "github.com/elenarostova",
    },
    summary:
      "Multi-disciplinary design director blending tactile brand identity with ergonomic digital interfaces. Created award-winning design systems utilized across 24 international retail and consumer technology brands.",
    experience: [
      {
        id: "exp-cre-1",
        role: "Staff Product Designer",
        company: "Monolith Labs",
        location: "New York, NY",
        startDate: "2022",
        endDate: "Present",
        current: true,
        description:
          "• Led end-to-end design for flagship collaborative whiteboarding canvas, growing monthly active users from 40k to 500k.\n• Established multi-brand design tokens architecture connecting Figma variables directly to production React components.",
      },
      {
        id: "exp-cre-2",
        role: "Senior UI/UX Designer",
        company: "Studio Form & Field",
        location: "Brooklyn, NY",
        startDate: "2019",
        endDate: "2022",
        current: false,
        description:
          "• Designed mobile banking application for fintech scaleup, winning Red Dot Award for digital interface excellence.\n• Conducted accessibility audits to achieve full WCAG 2.1 AAA compliance across all customer-facing touchpoints.",
      },
    ],
    education: [
      {
        id: "edu-cre-1",
        degree: "B.F.A. in Graphic & Interaction Design",
        school: "Rhode Island School of Design (RISD)",
        location: "Providence, RI",
        startDate: "2015",
        endDate: "2019",
      },
    ],
    skills:
      "Design Systems, Figma, Prototyping, User Research, Typography, Brand Identity, Motion Design, Accessibility (WCAG), HTML/CSS",
    projects: [
      {
        id: "proj-cre-1",
        name: "Spatial Typeface — Variable Font System",
        description:
          "Open-source geometric variable sans serif font designed for maximum legibility in high-density digital interfaces.",
        link: "rostova.design/spatial",
        technologies: "Type Design, Glyphs, OpenType",
        date: "2023",
      },
    ],
    settings: {
      template: "creative",
      fontFamily: "inter",
      fontSize: "medium",
      lineHeight: "normal",
      accentColor: "#18181b",
      margins: "normal",
      sectionSpacing: "normal",
    },
  },
  executive: {
    ...defaultResumeData,
    title: "Executive Template Preview",
    personalInfo: {
      fullName: "Robert C. Sterling",
      jobTitle: "Chief Operating Officer",
      email: "r.sterling@sterlingholdings.com",
      phone: "+1 (555) 321-7654",
      location: "Boston, MA",
      website: "robertsterling.com",
      linkedin: "linkedin.com/in/robertsterling",
      github: "",
    },
    summary:
      "Executive leader with 16+ years steering hyper-growth technology and hardware manufacturing enterprises. Scaled ARR from $15M to $120M while expanding global operations across North America, Europe, and Asia-Pacific.",
    experience: [
      {
        id: "exp-exec-1",
        role: "Chief Operating Officer",
        company: "Apex Global Dynamics",
        location: "Boston, MA",
        startDate: "2021",
        endDate: "Present",
        current: true,
        description:
          "• Oversee global corporate operations across 6 business divisions comprising 450+ full-time staff and $160M annual budget.\n• Orchestrated supply chain restructuring that shortened product delivery lead times by 32% and increased gross margins by 600 bps.",
      },
      {
        id: "exp-exec-2",
        role: "VP of Business Operations",
        company: "Vanguard Tech Industries",
        location: "New York, NY",
        startDate: "2016",
        endDate: "2021",
        current: false,
        description:
          "• Led post-merger integration of two SaaS acquisitions valued at $85M, consolidating sales pipelines and engineering orgs.\n• Instituted company-wide OKR framework and executive governance reviews that increased employee retention to 94%.",
      },
    ],
    education: [
      {
        id: "edu-exec-1",
        degree: "Master of Business Administration (MBA)",
        school: "Harvard Business School",
        location: "Boston, MA",
        startDate: "2014",
        endDate: "2016",
      },
      {
        id: "edu-exec-2",
        degree: "B.S. in Industrial Engineering",
        school: "Northwestern University",
        location: "Evanston, IL",
        startDate: "2006",
        endDate: "2010",
      },
    ],
    skills:
      "Executive Leadership, P&L Management, Global Operations, Supply Chain, M&A Integration, Board Governance, Strategic Planning, Talent Retention, Capital Allocation",
    projects: [
      {
        id: "proj-exec-1",
        name: "Global Operations Turnaround Playbook",
        description:
          "Authored comprehensive operational scaling frameworks published in MIT Sloan Management Review.",
        link: "robertsterling.com/publications",
        technologies: "Organizational Design, Strategy",
        date: "2023",
      },
    ],
    settings: {
      template: "executive",
      fontFamily: "serif",
      fontSize: "medium",
      lineHeight: "normal",
      accentColor: "#18181b",
      margins: "normal",
      sectionSpacing: "normal",
    },
  },
};
