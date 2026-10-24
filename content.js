/*
  ============================================================
  THIS IS THE ONLY FILE YOU NEED TO EDIT TO UPDATE YOUR SITE.
  ============================================================

  1. Put your files in the matching folder:
       assets/images/   photos, renders, screenshots
       assets/papers/   PDFs of your papers
       assets/videos/   small MP4s (under ~50 MB each; bigger ones go on YouTube/Vimeo)
       assets/thumbs/   optional preview images for papers and videos

  2. Add an entry below for each file (copy an existing one and change it).
     Delete the example entries when you have real ones.

  Tips:
   - "file" paths are relative to this folder, e.g. "assets/images/robot.jpg".
   - Leave a field as "" (or delete the line) if you don't need it.
   - Keep the commas between entries.
*/

window.PORTFOLIO = {
  // ---------- About you ----------
  name: "Your Name",
  tagline: "Engineer, researcher and creator. A selection of my projects, papers and productions.",
  about:
    "Write two or three sentences about yourself here: what you studied, what you build, and what kind of work you are looking for.",
  photo: "", // e.g. "assets/images/me.jpg"
  // Logo colours at the bottom of the page:
  //   true  = each logo in its own brand colour (LinkedIn blue, YouTube red, ...)
  //   false = all logos in the same colour as the rest of the site
  brandColors: true,

  // Each link you fill in shows up as a logo at the bottom of the page.
  // Leave a line as "" and that logo is simply not shown. Use full links (https://...).
  links: {
    email: "you@example.com", // your Gmail or other address
    linkedin: "", // e.g. "https://www.linkedin.com/in/your-name"
    instagram: "", // e.g. "https://www.instagram.com/your-name"
    github: "",
    youtube: "",
    itch: "https://pepepizza.itch.io/",
    x: "",
    facebook: "",
    tiktok: "",
    website: "", // any other site of yours
    cv: "", // e.g. "assets/papers/cv.pdf" (shown as a button at the top, not as a logo)
  },

  // ---------- Semester projects ----------
  // One entry per project. Every field is optional except the title.
  // Delete the example entries when you have real ones.
  semesterProjects: [
    {
      title: "Example: semester project title",
      semester: "5th semester", // shown above the description
      year: "2025",
      role: "", // e.g. "Programmer, team of 5"
      description: "Two or three sentences: the problem, what you built, and what came out of it.",
      cover: "", // e.g. "assets/images/p5-cover.jpg"
      tags: ["VR", "Unity"],
      report: "", // e.g. "assets/papers/p5-report.pdf"
      video: "", // e.g. a YouTube link or "assets/videos/p5-demo.mp4"
      link: "", // e.g. a GitHub or project page URL

      // Slides: every slide is shown openly on the page, one below the other. Add as many as you like.
      // Each slide has a picture (or a video) on one side and a heading and text on the other.
      // Leave a blank line inside the text (write \n\n) to start a new paragraph.
      slides: [
        {
          title: "The problem",
          text: "What were you trying to solve, and for whom?\n\nA second paragraph can add background or the research question.",
          image: "", // e.g. "assets/images/p5-problem.jpg"
        },
        {
          title: "What I built",
          text: "Explain the prototype: how it works, the technology behind it, and your own part in it.",
          image: "", // or use  video: "assets/videos/p5-demo.mp4"  /  video: "https://www.youtube.com/watch?v=..."
        },
        {
          title: "Results",
          text: "What did testing show? What would you do next?",
          image: "",
        },
      ],
    },
    {
      title: "Example: another semester project",
      semester: "4th semester",
      year: "2024",
      description: "A second placeholder.",
      tags: ["BCI", "AI"],
    },
  ],

  // ---------- Other projects ----------
  // Same fields as semester projects (leave "semester" out).
  otherProjects: [
    {
      title: "Example: side project or prototype",
      year: "2025",
      role: "",
      description: "What it is and why you made it.",
      cover: "",
      tags: ["App", "Prototype"],
      link: "",
    },
  ],

  // ---------- itch.io ----------
  // The link alone is enough: title, cover and tags are fetched from itch.io automatically.
  // Every other field is optional and overrides itch.io. Add one entry per game:
  //   { itch: "https://rasmusschultz.itch.io/another-game" },
  itch: [
    {
      itch: "https://rasmusschultz.itch.io/house-hold",
      description:
        "Not every family is perfect. Play as Oliver, the big brother who tries to fix a home that is falling apart.",
      role: "", // e.g. "Programmer, team of 11"
      year: "",
      // title: "", cover: "assets/images/my-cover.jpg", tags: ["Unity", "Narrative"],
    },
  ],

  // ---------- Videos ----------
  // Use EITHER "youtube" / "vimeo" (just paste the normal video link) OR "file" for a local MP4.
  videos: [
    {
      title: "Example: Music Visualizer demo",
      year: "2025",
      description: "Real-time audio-reactive visuals. Replace this with your own video.",
      youtube: "", // e.g. "https://www.youtube.com/watch?v=XXXXXXXXXXX"
      vimeo: "", // e.g. "https://vimeo.com/123456789"
      file: "", // e.g. "assets/videos/demo.mp4"
      thumb: "", // optional, e.g. "assets/thumbs/demo.jpg"
      tags: ["Audio", "Real-time"],
    },
    {
      title: "Example: Short film / production",
      year: "2024",
      description: "A second placeholder video.",
      file: "",
      tags: ["Production"],
    },
  ],

  // ---------- Papers ----------
  papers: [
    {
      title: "Example paper title: a study of something interesting",
      authors: "Your Name, Co-Author",
      venue: "Conference or journal name",
      year: "2025",
      abstract:
        "Paste the abstract here. Visitors can read the full PDF in their browser or download it.",
      file: "", // e.g. "assets/papers/my-paper.pdf"
      link: "", // optional DOI or publisher URL
      tags: ["Research"],
    },
    {
      title: "Example: Bachelor or master thesis",
      authors: "Your Name",
      venue: "University name",
      year: "2023",
      abstract: "Short summary of the thesis.",
      file: "",
      tags: ["Thesis"],
    },
  ],

  // ---------- Images ----------
  // The Images section is hidden while this list is empty. To bring it back, add entries like:
  //   { title: "My render", caption: "What it shows.", file: "assets/images/render.jpg", tags: ["Render"] },
  images: [],
};
