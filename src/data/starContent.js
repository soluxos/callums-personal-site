// Keep each Action list in step with the owned / shared split in that page's CaseStudyRole.
/** @type {Record<string, {situation: string, task: string, action: string, result: string}>} */
const STAR_CONTENT = {
  "acquia-source": {
    situation:
      "Acquia's products (hosting, site building, digital asset management, governance and AI) were built or bought separately and each had its own interface. Acquia Source brings them into one platform. I've been the design lead since January 2026, working with designers, engineers and product leads across the company.",
    task: "Design one navigation that holds every product, and give the whole team a single, realistic version of the platform to design, review and demo from, which several people could add to without it drifting apart.",
    action:
      "- Designed the information architecture and navigation shell in Figma for desktop, tablet and mobile, with interaction notes for engineering\n- Started a coded prototype in July 2026 and wrote most of its 900-plus commits, by prompting Replit's agent and later Claude Code\n- Grew it to 104 routes on one set of sample data, so every flow lines up with every other\n- Started rebuilding the pages on GEL, Acquia's design system, in a mirrored copy engineering can take code from (35 pages so far), with a coverage log of gaps for the GEL team\n- Wrote the rules where the tools read them: repo instructions for AI sessions, a design rules file, four custom lint rules, and 24 patterns built from the R&D design team's guidance\n- Built designer tools into the prototype that outline design system and custom components, force page states and export a handoff pack\n- Worked on unified user management with two colleagues\n- Set it up so colleagues who own other areas, such as security and asset management, can build in it, and reviewed and merged their pull requests",
    result:
      "One navigation model now covers every product area on every screen size. The prototype is what the product team demos, and engineering has GEL versions of 35 pages plus a list of what GEL is missing.",
  },

  "acquia-ai": {
    situation:
      "Acquia wanted AI that could act across its products: publishing pages, fixing sites, managing assets. I was lead designer on two versions of Acquia AI. The first (Aug to Dec 2025) was a standalone app built around AI teammates, which I joined with a developer-built prototype and no design system. The second (from July 2026) lives inside Acquia Source.",
    task: "Make an AI that can take real actions across a company's sites trustworthy: clear about what it can do, who's accountable, and how a person stays in charge. On the first version, ship an MVP in four months.",
    action:
      "- First version: built the design system and redesigned the developer prototype end to end\n- First version: ran user testing, pushed on requirements where the UI exposed gaps, and did design QA until the MVP shipped\n- Inside Source: designed projects as shared workspaces, with every chat visible to project members and context in four layers\n- Designed agents with their own permissions that decline and explain instead of escalating, and mapped the agent role onto Cloud Platform's 79 real permissions\n- Designed a gate on destructive actions that only the product interface can approve, so text in a chat can't\n- Designed an Activity page so org admins can review every AI action and transcript, with disclosure to users\n- Built the AI area of the Source prototype myself, and merged colleagues' additions such as inline approvals and credit usage",
    result:
      "The first version's MVP shipped in December 2025, four months after I joined. The version inside Source runs in the Source prototype that the product team demos, and its agent access rules were agreed with product and engineering leads in September 2026.",
  },

  "drupal-canvas": {
    situation:
      "Drupal is one of the web's most powerful CMS platforms, with a long reputation for being hard to use. Acquia set out to build Drupal Canvas, a new way to build and edit pages. I joined as a front-end engineer after core technical decisions had been made, but before a design system existed, and moved into the design lead role.",
    task: "Lead the design of Canvas: build the design system, redesign the UI, design the product shell and new features, and stay close enough to engineering that what shipped matched the intent. Jan 2025 to Dec 2025.",
    action:
      "- Audited the existing design work and built an atomic design system on Radix, the component library engineering had chosen\n- Removed every option we wouldn't use, so designers couldn't make an incorrect UI\n- Redesigned the whole UI, added new components where there were gaps, and wrote usage rules for components, icons, colour and type\n- Designed the product shell: compact panels and a top bar that expand with the task\n- Designed new features from scratch, and broke every feature into detailed user flows for engineers\n- Worked through interaction details with engineers and reviewed the UI they built\n- Mentored the junior designers on the team",
    result:
      "Drupal Canvas 1.0 came out in December 2025. It was on over 4,500 sites three and a half months later, and 13,604 in drupal.org's count for the week of 20 September 2026.",
  },

  "site-studio-cohesion": {
    situation:
      "I joined Site Studio, then called Cohesion, as a Senior Frontend Designer in September 2018. It was a 12-person startup with a low-code Drupal site builder that still took real front-end knowledge to use well, and our only customer was a partner agency.",
    task: "First, make people good at the product and help find customers: become a product expert, create training, run demos and support sales (Sep 2018 to May 2020). Then, as a Senior Software Engineer after the acquisition, rebuild the app in React as one of its two front-end engineers (May 2020 to Jan 2025).",
    action:
      "- Designed and built a full website in Site Studio before teaching anyone else\n- Produced a self-serve tutorial video series from zero to a shipped site\n- Demoed the product at prospects' offices with our Head of Marketing, and ran webinars for hundreds of prospective users\n- Built complete websites for prospects in a single day, recorded and sent to them afterwards\n- When a large pharmaceutical company was close to buying, spent the weekend with our Product Design Director building a branded prototype in Site Studio\n- Presented it on the Monday morning, and later helped the client migrate their sites\n- After the acquisition, rebuilt the whole app in React with one other front-end engineer: more than 100,000 lines of AngularJS migrated, the architecture redesigned and the visual page builder built from scratch\n- Built the app's React component library in Styled Components, and a Cypress end-to-end suite covering the whole application",
    result:
      "We landed a £1m ARR deal with one of the world's largest pharmaceutical companies, who migrated over 1,000 websites to Site Studio. Soon after, Acquia acquired us. The rebuilt app went on to support more than 1,000 customers and $45m in attached revenue.",
  },

  "union-roasted": {
    situation:
      "In 2018 I was a designer and developer at WeMakeWebsites. Union Roasted, one of the UK's best-known specialty coffee roasters, wanted a new Shopify site that didn't look like a generic Shopify template. I was the only designer and developer on the project, working with a Project Manager.",
    task: "Design and build a Shopify store that felt like Union Roasted, telling the story of their sourcing, roasting and team, in about a month.",
    action:
      "- Attended the kick-off and visited the roastery with the Project Manager to understand the brand, the people and the process\n- Worked out what the site needed to say: the farmer partnerships, the roasting process and the team\n- Designed every page, from wireframes to high-fidelity\n- Built the whole site on Shopify",
    result:
      "The client expected a standard Shopify build and got a site that looked and felt like them. Years later the site still uses my design, and I was named Employee of the Month at WeMakeWebsites for it.",
  },
};

export default STAR_CONTENT;
