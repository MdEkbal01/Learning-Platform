const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '..', 'docs', 'PAGE_VIEWS');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Common SVG Helper Functions
function escapeXml(unsafe) {
  return String(unsafe).replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

function svgNavbar(activeTab = 'Dashboard', userRole = 'STUDENT', userName = 'John Doe') {
  return `
    <!-- Top Navigation Bar -->
    <rect x="0" y="0" width="1200" height="64" fill="#0F172A" />
    <line x1="0" y1="64" x2="1200" y2="64" stroke="#1E293B" stroke-width="1" />
    
    <!-- Logo -->
    <rect x="32" y="16" width="32" height="32" rx="8" fill="#4F46E5" />
    <text x="48" y="38" font-family="Inter, sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF" text-anchor="middle">A</text>
    <text x="74" y="38" font-family="Inter, sans-serif" font-size="18" font-weight="bold" fill="#FFFFFF">Aura<tspan fill="#6366F1">LMS</tspan></text>
    
    <!-- Navigation Links -->
    <g font-family="Inter, sans-serif" font-size="13" font-weight="500">
      <text x="210" y="37" fill="${activeTab === 'Explore' ? '#FFFFFF' : '#94A3B8'}">Explore</text>
      <text x="280" y="37" fill="${activeTab === 'My Courses' ? '#FFFFFF' : '#94A3B8'}">My Courses</text>
      <text x="375" y="37" fill="${activeTab === 'Live' ? '#FFFFFF' : '#94A3B8'}">Live Classes</text>
      <text x="475" y="37" fill="${activeTab === 'Doubts' ? '#FFFFFF' : '#94A3B8'}">Doubts</text>
      <text x="550" y="37" fill="${activeTab === 'Help' ? '#FFFFFF' : '#94A3B8'}">Help</text>
    </g>

    <!-- Search Bar Mock -->
    <rect x="630" y="14" width="260" height="36" rx="8" fill="#1E293B" stroke="#334155" />
    <circle cx="650" cy="32" r="6" stroke="#64748B" stroke-width="1.5" fill="none" />
    <line x1="655" y1="36" x2="661" y2="42" stroke="#64748B" stroke-width="1.5" />
    <text x="670" y="37" font-family="Inter, sans-serif" font-size="12" fill="#64748B">Search courses, topics...</text>

    <!-- Right Controls: Theme Toggle & Role Badge & Profile -->
    <circle cx="930" cy="32" r="16" fill="#1E293B" stroke="#334155" />
    <path d="M925 32 A 5 5 0 0 0 935 32 A 5 5 0 1 1 925 32" fill="#F59E0B" />

    <!-- Role Pill -->
    <rect x="965" y="18" width="85" height="26" rx="13" fill="#1E1B4B" stroke="#4F46E5" />
    <text x="1007" y="35" font-family="Inter, sans-serif" font-size="10" font-weight="bold" fill="#818CF8" text-anchor="middle">${escapeXml(userRole)}</text>

    <!-- User Profile Dropdown Pill -->
    <circle cx="1080" cy="32" r="16" fill="#3B82F6" />
    <text x="1080" y="37" font-family="Inter, sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${userName.charAt(0)}</text>
    <text x="1105" y="37" font-family="Inter, sans-serif" font-size="13" font-weight="500" fill="#E2E8F0">${escapeXml(userName)}</text>
  `;
}

function svgCard(x, y, w, h, bg = '#1E293B', border = '#334155', rx = 12) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${bg}" stroke="${border}" stroke-width="1" />`;
}

function svgWrapper(content, title = 'AuraLMS View', height = 800) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="${height}" viewBox="0 0 1200 ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;display=swap');
      text { font-family: 'Inter', -apple-system, sans-serif; }
    </style>
    <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4F46E5" />
      <stop offset="100%" stop-color="#7C3AED" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3B82F6" />
      <stop offset="100%" stop-color="#8B5CF6" />
    </linearGradient>
    <radialGradient id="pointerGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#4F46E5" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#4F46E5" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Canvas Background -->
  <rect x="0" y="0" width="1200" height="${height}" fill="#0A0F1D" />
  
  <!-- Subtle Ambient Glow (CodeByGaurav signature) -->
  <circle cx="850" cy="200" r="300" fill="url(#pointerGlow)" />

  ${content}

  <!-- Viewport Badge -->
  <rect x="1050" y="${height - 35}" width="120" height="24" rx="6" fill="#1E293B" stroke="#334155" />
  <text x="1110" y="${height - 19}" font-size="10" font-weight="600" fill="#94A3B8" text-anchor="middle">${escapeXml(title)}</text>
</svg>`;
}

// -------------------------------------------------------------
// PAGE GENERATORS (All 27 views)
// -------------------------------------------------------------

const pages = [
  // 1. Home
  {
    filename: '01_Home.svg',
    title: 'Public Home Page',
    render: () => {
      let body = svgNavbar('Explore', 'GUEST', 'Guest Visitor');
      // Hero Banner
      body += `
        <g transform="translate(48, 100)">
          <rect x="0" y="0" width="1104" height="280" rx="16" fill="#111827" stroke="#1F2937" />
          <!-- CodeByGaurav Ambient Spotlight -->
          <circle cx="200" cy="140" r="160" fill="url(#pointerGlow)" />

          <!-- Live Class Ticker Badge -->
          <rect x="40" y="32" width="180" height="28" rx="14" fill="#1F2937" stroke="#374151" />
          <circle cx="56" cy="46" r="4" fill="#EF4444" />
          <text x="68" y="50" font-size="11" font-weight="600" fill="#F3F4F6">LIVE SESSIONS DAILY</text>

          <text x="40" y="115" font-size="34" font-weight="800" fill="#FFFFFF">Master Software Engineering</text>
          <text x="40" y="155" font-size="34" font-weight="800" fill="url(#accentGrad)">With Live Mentorship &amp; AI Tools</text>
          <text x="40" y="195" font-size="14" fill="#9CA3AF">Industry-vetted curricula, doubt clearing in &lt;15 mins, and tamper-proof certificates.</text>

          <!-- CTAs -->
          <rect x="40" y="220" width="160" height="42" rx="10" fill="url(#primaryGrad)" />
          <text x="120" y="246" font-size="14" font-weight="600" fill="#FFFFFF" text-anchor="middle">Explore Courses</text>

          <rect x="220" y="220" width="160" height="42" rx="10" fill="#1F2937" stroke="#374151" />
          <text x="300" y="246" font-size="14" font-weight="600" fill="#E5E7EB" text-anchor="middle">Verify Certificate</text>

          <!-- Hero Illustration / Mock Graphic -->
          <rect x="740" y="30" width="320" height="220" rx="12" fill="#1E293B" stroke="#334155" />
          <rect x="760" y="50" width="280" height="24" rx="4" fill="#0F172A" />
          <circle cx="775" cy="62" r="5" fill="#EF4444" />
          <circle cx="790" cy="62" r="5" fill="#F59E0B" />
          <circle cx="805" cy="62" r="5" fill="#10B981" />
          <text x="760" y="110" font-size="13" font-family="monospace" fill="#38BDF8">&gt; const learner = await Aura.enroll();</text>
          <text x="760" y="135" font-size="13" font-family="monospace" fill="#A855F7">&gt; await learner.solveDoubts();</text>
          <text x="760" y="160" font-size="13" font-family="monospace" fill="#22C55E">&gt; Certificate Issued: [VERIFIED]</text>
        </g>

        <!-- Stats Bar -->
        <g transform="translate(48, 410)">
          ${svgCard(0, 0, 255, 80)}
          <text x="30" y="35" font-size="22" font-weight="800" fill="#FFFFFF">12,500+</text>
          <text x="30" y="58" font-size="12" fill="#94A3B8">Active Global Learners</text>

          ${svgCard(283, 0, 255, 80)}
          <text x="313" y="35" font-size="22" font-weight="800" fill="#6366F1">99.4%</text>
          <text x="313" y="58" font-size="12" fill="#94A3B8">Quiz Pass Rate</text>

          ${svgCard(566, 0, 255, 80)}
          <text x="596" y="35" font-size="22" font-weight="800" fill="#10B981">&lt; 15 Mins</text>
          <text x="596" y="58" font-size="12" fill="#94A3B8">Average Doubt SLA</text>

          ${svgCard(849, 0, 255, 80)}
          <text x="879" y="35" font-size="22" font-weight="800" fill="#F59E0B">4.9 / 5.0</text>
          <text x="879" y="58" font-size="12" fill="#94A3B8">Student Satisfaction</text>
        </g>

        <!-- Featured Courses Section -->
        <g transform="translate(48, 520)">
          <text x="0" y="24" font-size="20" font-weight="700" fill="#FFFFFF">Featured Career Paths</text>
          
          <!-- Card 1 -->
          ${svgCard(0, 45, 345, 200)}
          <rect x="0" y="45" width="345" height="100" rx="12" fill="#312E81" />
          <text x="20" y="85" font-size="16" font-weight="700" fill="#FFFFFF">Full-Stack Web Engineering</text>
          <text x="20" y="110" font-size="12" fill="#C7D2FE">React 19, TypeScript, Express, PostgreSQL</text>
          <text x="20" y="180" font-size="18" font-weight="800" fill="#FFFFFF">$79.99</text>
          <rect x="230" y="160" width="95" height="32" rx="8" fill="#4F46E5" />
          <text x="277" y="181" font-size="12" font-weight="600" fill="#FFFFFF" text-anchor="middle">View Course</text>

          <!-- Card 2 -->
          ${svgCard(380, 45, 345, 200)}
          <rect x="380" y="45" width="345" height="100" rx="12" fill="#064E3B" />
          <text x="400" y="85" font-size="16" font-weight="700" fill="#FFFFFF">Data Structures &amp; Algorithms</text>
          <text x="400" y="110" font-size="12" fill="#A7F3D0">Master Coding Interviews at Top Tech</text>
          <text x="400" y="180" font-size="18" font-weight="800" fill="#FFFFFF">$49.99</text>
          <rect x="610" y="160" width="95" height="32" rx="8" fill="#4F46E5" />
          <text x="657" y="181" font-size="12" font-weight="600" fill="#FFFFFF" text-anchor="middle">View Course</text>

          <!-- Card 3 -->
          ${svgCard(760, 45, 345, 200)}
          <rect x="760" y="45" width="345" height="100" rx="12" fill="#4C1D95" />
          <text x="780" y="85" font-size="16" font-weight="700" fill="#FFFFFF">AI &amp; System Architecture</text>
          <text x="780" y="110" font-size="12" fill="#DDD6FE">Microservices, Redis, Event-Driven Patterns</text>
          <text x="780" y="180" font-size="18" font-weight="800" fill="#FFFFFF">$99.99</text>
          <rect x="990" y="160" width="95" height="32" rx="8" fill="#4F46E5" />
          <text x="1037" y="181" font-size="12" font-weight="600" fill="#FFFFFF" text-anchor="middle">View Course</text>
        </g>
      `;
      return svgWrapper(body, '01_Home.svg');
    }
  },

  // 2. Catalogue
  {
    filename: '02_Catalogue.svg',
    title: 'Course Catalogue & Filter Page',
    render: () => {
      let body = svgNavbar('Explore', 'STUDENT', 'John Doe');
      body += `
        <g transform="translate(48, 90)">
          <text x="0" y="24" font-size="24" font-weight="700" fill="#FFFFFF">Explore Catalog</text>
          <text x="0" y="48" font-size="13" fill="#94A3B8">Browse through industry accredited learning tracks with active live mentorship</text>

          <!-- Filter / Tab Pills -->
          <g transform="translate(0, 70)">
            <rect x="0" y="0" width="60" height="34" rx="8" fill="#4F46E5" />
            <text x="30" y="21" font-size="12" font-weight="600" fill="#FFFFFF" text-anchor="middle">All (4)</text>

            <rect x="70" y="0" width="150" height="34" rx="8" fill="#1E293B" stroke="#334155" />
            <text x="145" y="21" font-size="12" font-weight="500" fill="#94A3B8" text-anchor="middle">Computer Science (2)</text>

            <rect x="230" y="0" width="130" height="34" rx="8" fill="#1E293B" stroke="#334155" />
            <text x="295" y="21" font-size="12" font-weight="500" fill="#94A3B8" text-anchor="middle">Web Dev (1)</text>

            <rect x="370" y="0" width="140" height="34" rx="8" fill="#1E293B" stroke="#334155" />
            <text x="440" y="21" font-size="12" font-weight="500" fill="#94A3B8" text-anchor="middle">Cloud &amp; DevOps (1)</text>
          </g>

          <!-- Search & Sort Bar -->
          <g transform="translate(750, 70)">
            <rect x="0" y="0" width="220" height="34" rx="8" fill="#1E293B" stroke="#334155" />
            <text x="20" y="22" font-size="12" fill="#64748B">Filter by keyword...</text>

            <rect x="235" y="0" width="120" height="34" rx="8" fill="#1E293B" stroke="#334155" />
            <text x="250" y="22" font-size="12" fill="#CBD5E1">Sort: Popular</text>
          </g>

          <!-- Course Grid (6 Cards Mockup) -->
          <g transform="translate(0, 130)">
            ${svgCard(0, 0, 350, 240)}
            <rect x="0" y="0" width="350" height="110" rx="12" fill="#1E1B4B" />
            <text x="20" y="45" font-size="16" font-weight="700" fill="#FFFFFF">Intro to Computer Science</text>
            <text x="20" y="70" font-size="11" fill="#818CF8">CS101 • 4 Modules • 12 Lessons</text>
            <text x="20" y="92" font-size="11" fill="#A5B4FC">Prof. Alan Turing</text>
            <text x="20" y="150" font-size="12" fill="#94A3B8">Fundamental algorithms, Big-O analysis, memory structures, and debugging.</text>
            <text x="20" y="215" font-size="18" font-weight="800" fill="#FFFFFF">$49.99</text>
            <rect x="235" y="195" width="95" height="32" rx="8" fill="#4F46E5" />
            <text x="282" y="215" font-size="12" font-weight="600" fill="#FFFFFF" text-anchor="middle">Enroll Now</text>

            ${svgCard(375, 0, 350, 240)}
            <rect x="375" y="0" width="350" height="110" rx="12" fill="#064E3B" />
            <text x="395" y="45" font-size="16" font-weight="700" fill="#FFFFFF">Full-Stack Web Dev</text>
            <text x="395" y="70" font-size="11" fill="#34D399">WEB201 • 6 Modules • 24 Lessons</text>
            <text x="395" y="92" font-size="11" fill="#6EE7B7">Sarah Connor</text>
            <text x="395" y="150" font-size="12" fill="#94A3B8">Modern React 19, RESTful APIs, Prisma ORM, state management, and deployment.</text>
            <text x="395" y="215" font-size="18" font-weight="800" fill="#FFFFFF">$79.99</text>
            <rect x="610" y="195" width="95" height="32" rx="8" fill="#4F46E5" />
            <text x="657" y="215" font-size="12" font-weight="600" fill="#FFFFFF" text-anchor="middle">Enroll Now</text>

            ${svgCard(750, 0, 350, 240)}
            <rect x="750" y="0" width="350" height="110" rx="12" fill="#4C1D95" />
            <text x="770" y="45" font-size="16" font-weight="700" fill="#FFFFFF">Cloud Native &amp; Docker</text>
            <text x="770" y="70" font-size="11" fill="#C084FC">OPS301 • 5 Modules • 18 Lessons</text>
            <text x="770" y="92" font-size="11" fill="#E9D5FF">DevOps Guild</text>
            <text x="770" y="150" font-size="12" fill="#94A3B8">Containerization, Kubernetes pods, CI/CD pipelines, and cloud orchestration.</text>
            <text x="770" y="215" font-size="18" font-weight="800" fill="#FFFFFF">$89.99</text>
            <rect x="985" y="195" width="95" height="32" rx="8" fill="#4F46E5" />
            <text x="1032" y="215" font-size="12" font-weight="600" fill="#FFFFFF" text-anchor="middle">Enroll Now</text>
          </g>

          <!-- Second Row -->
          <g transform="translate(0, 395)">
            ${svgCard(0, 0, 350, 240)}
            <rect x="0" y="0" width="350" height="110" rx="12" fill="#701A75" />
            <text x="20" y="45" font-size="16" font-weight="700" fill="#FFFFFF">Python for Data Science</text>
            <text x="20" y="70" font-size="11" fill="#F472B6">DS105 • 3 Modules • 10 Lessons</text>
            <text x="20" y="92" font-size="11" fill="#FBCFE8">Data Academy</text>
            <text x="20" y="150" font-size="12" fill="#94A3B8">Pandas, NumPy, Matplotlib, regression models, and end-to-end data pipelines.</text>
            <text x="20" y="215" font-size="18" font-weight="800" fill="#FFFFFF">$59.99</text>
            <rect x="235" y="195" width="95" height="32" rx="8" fill="#4F46E5" />
            <text x="282" y="215" font-size="12" font-weight="600" fill="#FFFFFF" text-anchor="middle">Enroll Now</text>
          </g>
        </g>
      `;
      return svgWrapper(body, '02_Catalogue.svg', 850);
    }
  },

  // 3. CourseDetail
  {
    filename: '03_CourseDetail.svg',
    title: 'Course Detail & Syllabus Page',
    render: () => {
      let body = svgNavbar('Explore', 'STUDENT', 'John Doe');
      body += `
        <g transform="translate(48, 90)">
          <!-- Breadcrumb -->
          <text x="0" y="15" font-size="12" fill="#64748B">Catalog &gt; Computer Science &gt; CS101</text>
          
          <!-- Left Column: Syllabus & Details -->
          <g transform="translate(0, 40)">
            <text x="0" y="30" font-size="28" font-weight="800" fill="#FFFFFF">Introduction to Computer Science</text>
            <text x="0" y="60" font-size="14" fill="#94A3B8">Understand the core foundations of memory, algorithms, data structures, and computer architecture.</text>

            <g transform="translate(0, 85)">
              <rect x="0" y="0" width="85" height="24" rx="6" fill="#1E1B4B" />
              <text x="42" y="16" font-size="11" font-weight="600" fill="#818CF8" text-anchor="middle">Beginner</text>

              <rect x="95" y="0" width="110" height="24" rx="6" fill="#064E3B" />
              <text x="150" y="16" font-size="11" font-weight="600" fill="#34D399" text-anchor="middle">Bilingual EN/HI</text>

              <rect x="215" y="0" width="120" height="24" rx="6" fill="#1E293B" stroke="#334155" />
              <text x="275" y="16" font-size="11" fill="#E2E8F0" text-anchor="middle">Cert Included</text>
            </g>

            <!-- Syllabus Accordion -->
            <text x="0" y="150" font-size="18" font-weight="700" fill="#FFFFFF">Course Modules &amp; Curriculum</text>

            <g transform="translate(0, 170)">
              ${svgCard(0, 0, 700, 60, '#1E293B')}
              <text x="20" y="35" font-size="14" font-weight="600" fill="#FFFFFF">Module 1: Introduction to Algorithms &amp; Complexity</text>
              <text x="600" y="35" font-size="12" fill="#818CF8">3 Lessons • 45m</text>

              ${svgCard(0, 70, 700, 60, '#1E293B')}
              <text x="20" y="105" font-size="14" font-weight="600" fill="#FFFFFF">Module 2: Arrays, Pointers &amp; Memory Allocation</text>
              <text x="600" y="105" font-size="12" fill="#818CF8">4 Lessons • 60m</text>

              ${svgCard(0, 140, 700, 60, '#1E293B')}
              <text x="20" y="175" font-size="14" font-weight="600" fill="#FFFFFF">Module 3: Linear &amp; Non-Linear Data Structures</text>
              <text x="600" y="175" font-size="12" fill="#818CF8">3 Lessons • 50m</text>

              ${svgCard(0, 210, 700, 60, '#1E293B')}
              <text x="20" y="245" font-size="14" font-weight="600" fill="#FFFFFF">Module 4: Final Assessment &amp; Capstone Project</text>
              <text x="600" y="245" font-size="12" fill="#818CF8">Quiz + Cert</text>
            </g>
          </g>

          <!-- Right Column: Enrollment Card -->
          <g transform="translate(740, 40)">
            ${svgCard(0, 0, 360, 420, '#1E293B')}
            <!-- Video Thumbnail Mock -->
            <rect x="20" y="20" width="320" height="170" rx="8" fill="#0F172A" />
            <circle cx="180" cy="105" r="28" fill="#4F46E5" />
            <polygon points="174,95 192,105 174,115" fill="#FFFFFF" />
            <text x="180" y="155" font-size="11" font-weight="600" fill="#E2E8F0" text-anchor="middle">Preview Free Lesson</text>

            <g transform="translate(20, 215)">
              <text x="0" y="25" font-size="28" font-weight="800" fill="#FFFFFF">$49.99</text>
              <text x="90" y="23" font-size="14" fill="#64748B" text-decoration="line-through">$129.99</text>
              <text x="160" y="23" font-size="12" font-weight="600" fill="#22C55E">62% OFF</text>

              <rect x="0" y="45" width="320" height="44" rx="10" fill="url(#primaryGrad)" />
              <text x="160" y="72" font-size="14" font-weight="700" fill="#FFFFFF" text-anchor="middle">Enroll in Course</text>

              <text x="160" y="115" font-size="11" fill="#94A3B8" text-anchor="middle">30-Day Money-Back Guarantee • Full Lifetime Access</text>

              <line x1="0" y1="135" x2="320" y2="135" stroke="#334155" stroke-width="1" />

              <text x="10" y="160" font-size="12" fill="#CBD5E1">✓ 12 on-demand video lessons</text>
              <text x="10" y="180" font-size="12" fill="#CBD5E1">✓ 4 graded quizzes with instant feedback</text>
              <text x="10" y="200" font-size="12" fill="#CBD5E1">✓ Direct mentor doubt clearing</text>
            </g>
          </g>
        </g>
      `;
      return svgWrapper(body, '03_CourseDetail.svg');
    }
  },

  // 4. Checkout
  {
    filename: '04_Checkout.svg',
    title: 'Anti-Tamper Checkout & Activation Page',
    render: () => {
      let body = svgNavbar('Explore', 'STUDENT', 'John Doe');
      body += `
        <g transform="translate(200, 90)">
          <text x="0" y="24" font-size="24" font-weight="700" fill="#FFFFFF">Secure Anti-Tamper Checkout</text>
          <text x="0" y="48" font-size="13" fill="#94A3B8">Transaction ID and currency signature enforced by server</text>

          <g transform="translate(0, 70)">
            <!-- Left: Order Summary -->
            ${svgCard(0, 0, 480, 400)}
            <text x="24" y="35" font-size="16" font-weight="700" fill="#FFFFFF">Order Summary</text>
            
            <g transform="translate(24, 60)">
              <rect x="0" y="0" width="432" height="70" rx="8" fill="#0F172A" />
              <text x="20" y="30" font-size="14" font-weight="600" fill="#FFFFFF">Intro to Computer Science (CS101)</text>
              <text x="20" y="50" font-size="12" fill="#818CF8">Includes Quizzes + Certificate + Mentor Support</text>
              <text x="360" y="40" font-size="16" font-weight="700" fill="#FFFFFF">$49.99</text>

              <g transform="translate(0, 95)">
                <text x="0" y="20" font-size="13" fill="#94A3B8">Subtotal</text>
                <text x="432" y="20" font-size="13" fill="#FFFFFF" text-anchor="end">$49.99</text>

                <text x="0" y="45" font-size="13" fill="#94A3B8">Platform Fee &amp; Taxes</text>
                <text x="432" y="45" font-size="13" fill="#FFFFFF" text-anchor="end">$0.00</text>

                <line x1="0" y1="65" x2="432" y2="65" stroke="#334155" stroke-width="1" />

                <text x="0" y="95" font-size="16" font-weight="700" fill="#FFFFFF">Total Amount</text>
                <text x="432" y="95" font-size="20" font-weight="800" fill="#22C55E" text-anchor="end">$49.99 USD</text>
              </g>

              <!-- Anti Tamper Notice -->
              <rect x="0" y="225" width="432" height="40" rx="6" fill="#1E1B4B" stroke="#4F46E5" />
              <text x="216" y="250" font-size="11" font-weight="500" fill="#C7D2FE" text-anchor="middle">🛡️ SHA-256 HMAC Signature Active • Client manipulation prevented</text>
            </g>

            <!-- Right: Payment Method Selector -->
            ${svgCard(510, 0, 290, 400)}
            <text x="534" y="35" font-size="16" font-weight="700" fill="#FFFFFF">Payment Method</text>
            
            <g transform="translate(534, 60)">
              <rect x="0" y="0" width="242" height="50" rx="8" fill="#0F172A" stroke="#4F46E5" stroke-width="2" />
              <circle cx="25" cy="25" r="7" stroke="#4F46E5" stroke-width="5" fill="#FFFFFF" />
              <text x="45" y="29" font-size="13" font-weight="600" fill="#FFFFFF">Razorpay / UPI / Cards</text>

              <rect x="0" y="65" width="242" height="50" rx="8" fill="#0F172A" stroke="#334155" stroke-width="1" />
              <circle cx="25" cy="90" r="7" stroke="#64748B" stroke-width="2" fill="none" />
              <text x="45" y="94" font-size="13" font-weight="500" fill="#94A3B8">Stripe Global (USD)</text>

              <rect x="0" y="130" width="242" height="50" rx="8" fill="#0F172A" stroke="#334155" stroke-width="1" />
              <circle cx="25" cy="155" r="7" stroke="#64748B" stroke-width="2" fill="none" />
              <text x="45" y="159" font-size="13" font-weight="500" fill="#94A3B8">Direct Bank Transfer</text>

              <!-- Complete Payment CTA -->
              <rect x="0" y="240" width="242" height="46" rx="10" fill="url(#primaryGrad)" />
              <text x="121" y="268" font-size="14" font-weight="700" fill="#FFFFFF" text-anchor="middle">Pay $49.99 USD</text>

              <text x="121" y="315" font-size="10" fill="#64748B" text-anchor="middle">Encrypted 256-bit TLS connection</text>
            </g>
          </g>
        </g>
      `;
      return svgWrapper(body, '04_Checkout.svg');
    }
  },

  // 5. VerifyCertificate
  {
    filename: '05_VerifyCertificate.svg',
    title: 'Public Certificate Verification Page',
    render: () => {
      let body = svgNavbar('Explore', 'GUEST', 'Guest');
      body += `
        <g transform="translate(250, 100)">
          <!-- Centered Verification Card -->
          ${svgCard(0, 0, 700, 560)}
          <circle cx="350" cy="180" r="140" fill="url(#pointerGlow)" />

          <text x="350" y="45" font-size="24" font-weight="800" fill="#FFFFFF" text-anchor="middle">AuraLMS Credential Verification</text>
          <text x="350" y="70" font-size="13" fill="#94A3B8" text-anchor="middle">Instant cryptographic validation of issued course completion certificates</text>

          <!-- Input Bar -->
          <g transform="translate(100, 95)">
            <rect x="0" y="0" width="500" height="46" rx="10" fill="#0F172A" stroke="#4F46E5" />
            <text x="20" y="28" font-size="14" font-family="monospace" fill="#FFFFFF">CERT-2026-CS101-JOHN</text>
            <rect x="380" y="5" width="115" height="36" rx="8" fill="#4F46E5" />
            <text x="437" y="28" font-size="12" font-weight="600" fill="#FFFFFF" text-anchor="middle">Verify Now</text>
          </g>

          <!-- Verified Result Card with CodeByGaurav VerificationSpinner Ring -->
          <g transform="translate(50, 175)">
            <rect x="0" y="0" width="600" height="330" rx="12" fill="#0F172A" stroke="#22C55E" stroke-width="1.5" />
            
            <!-- CodeByGaurav Animated Circular Spinner Ring (at 100%) -->
            <circle cx="300" cy="75" r="38" stroke="#1E293B" stroke-width="6" fill="none" />
            <circle cx="300" cy="75" r="38" stroke="#22C55E" stroke-width="6" stroke-dasharray="238" stroke-dashoffset="0" fill="none" />
            <!-- Green Checkmark -->
            <path d="M290 75 L297 82 L312 67" stroke="#22C55E" stroke-width="3" stroke-linecap="round" fill="none" />

            <rect x="230" y="125" width="140" height="24" rx="12" fill="#064E3B" />
            <text x="300" y="141" font-size="11" font-weight="700" fill="#34D399" text-anchor="middle">AUTHENTIC &amp; VALID</text>

            <text x="300" y="175" font-size="18" font-weight="800" fill="#FFFFFF" text-anchor="middle">John Doe</text>
            <text x="300" y="198" font-size="13" fill="#94A3B8" text-anchor="middle">has successfully completed all requirements for</text>
            <text x="300" y="222" font-size="16" font-weight="700" fill="#818CF8" text-anchor="middle">Introduction to Computer Science (CS101)</text>

            <g transform="translate(100, 245)">
              <text x="0" y="20" font-size="12" fill="#64748B">Issue Date: <tspan fill="#CBD5E1">October 20, 2026</tspan></text>
              <text x="250" y="20" font-size="12" fill="#64748B">Grade: <tspan fill="#22C55E">100% (High Honors)</tspan></text>
              <text x="0" y="45" font-size="12" fill="#64748B">Issuer: <tspan fill="#CBD5E1">Aura Global Learning Institute</tspan></text>
              <text x="250" y="45" font-size="12" fill="#64748B">Credential ID: <tspan fill="#818CF8" font-family="monospace">CERT-2026-CS101-JOHN</tspan></text>
            </g>
          </g>
        </g>
      `;
      return svgWrapper(body, '05_VerifyCertificate.svg');
    }
  },

  // 6. Login
  {
    filename: '06_Login_SecureVault.svg',
    title: 'Login & Multi-Role Vault Page',
    render: () => {
      let body = svgNavbar('Explore', 'GUEST', 'Guest');
      body += `
        <g transform="translate(350, 110)">
          ${svgCard(0, 0, 500, 540)}
          <!-- CodeByGaurav ambient light -->
          <circle cx="250" cy="180" r="160" fill="url(#pointerGlow)" />

          <text x="250" y="45" font-size="24" font-weight="800" fill="#FFFFFF" text-anchor="middle">Welcome Back</text>
          <text x="250" y="70" font-size="13" fill="#94A3B8" text-anchor="middle">Sign in to your learning dashboard</text>

          <!-- Input: Email -->
          <g transform="translate(40, 100)">
            <text x="0" y="15" font-size="12" font-weight="600" fill="#CBD5E1">Email Address</text>
            <rect x="0" y="25" width="420" height="42" rx="8" fill="#0F172A" stroke="#334155" />
            <text x="15" y="51" font-size="13" fill="#FFFFFF">student@lms.local</text>
          </g>

          <!-- Input: Password -->
          <g transform="translate(40, 190)">
            <text x="0" y="15" font-size="12" font-weight="600" fill="#CBD5E1">Password</text>
            <text x="420" y="15" font-size="12" fill="#818CF8" text-anchor="end">Forgot Password?</text>
            <rect x="0" y="25" width="420" height="42" rx="8" fill="#0F172A" stroke="#334155" />
            <text x="15" y="52" font-size="16" fill="#FFFFFF">•••••••••••••</text>
          </g>

          <!-- Submit Button -->
          <rect x="40" y="290" width="420" height="44" rx="10" fill="url(#primaryGrad)" />
          <text x="250" y="317" font-size="14" font-weight="700" fill="#FFFFFF" text-anchor="middle">Sign In</text>

          <!-- Divider -->
          <line x1="40" y1="360" x2="460" y2="360" stroke="#334155" stroke-width="1" />
          <text x="250" y="365" font-size="11" fill="#64748B" text-anchor="middle" background="#1E293B">  QUICK ROLE SWITCHER  </text>

          <!-- Quick Switcher Role Buttons -->
          <g transform="translate(40, 390)">
            <rect x="0" y="0" width="130" height="34" rx="6" fill="#0F172A" stroke="#334155" />
            <text x="65" y="22" font-size="11" fill="#93C5FD" text-anchor="middle">👤 Student</text>

            <rect x="145" y="0" width="130" height="34" rx="6" fill="#0F172A" stroke="#334155" />
            <text x="210" y="22" font-size="11" fill="#6EE7B7" text-anchor="middle">🎓 Mentor</text>

            <rect x="290" y="0" width="130" height="34" rx="6" fill="#0F172A" stroke="#334155" />
            <text x="355" y="22" font-size="11" fill="#F472B6" text-anchor="middle">🛡️ Admin</text>
          </g>

          <g transform="translate(40, 435)">
            <rect x="0" y="0" width="130" height="34" rx="6" fill="#0F172A" stroke="#334155" />
            <text x="65" y="22" font-size="11" fill="#C084FC" text-anchor="middle">📝 Content</text>

            <rect x="145" y="0" width="130" height="34" rx="6" fill="#0F172A" stroke="#334155" />
            <text x="210" y="22" font-size="11" fill="#FCD34D" text-anchor="middle">💰 Finance</text>

            <rect x="290" y="0" width="130" height="34" rx="6" fill="#0F172A" stroke="#334155" />
            <text x="355" y="22" font-size="11" fill="#67E8F9" text-anchor="middle">⚖️ Moderator</text>
          </g>

          <text x="250" y="505" font-size="12" fill="#94A3B8" text-anchor="middle">Don&apos;t have an account? <tspan fill="#818CF8">Register now</tspan></text>
        </g>
      `;
      return svgWrapper(body, '06_Login_SecureVault.svg');
    }
  },

  // 7. Register
  {
    filename: '07_Register_VerificationRing.svg',
    title: 'Registration & Segmented OTP Verification',
    render: () => {
      let body = svgNavbar('Explore', 'GUEST', 'Guest');
      body += `
        <g transform="translate(320, 90)">
          ${svgCard(0, 0, 560, 600)}
          <circle cx="280" cy="220" r="170" fill="url(#pointerGlow)" />

          <text x="280" y="45" font-size="24" font-weight="800" fill="#FFFFFF" text-anchor="middle">Create Your Account</text>
          <text x="280" y="70" font-size="13" fill="#94A3B8" text-anchor="middle">Step 2: Verify Your Mobile Number</text>

          <!-- CodeByGaurav VerificationSpinner Active Step -->
          <g transform="translate(240, 95)">
            <circle cx="40" cy="40" r="32" stroke="#334155" stroke-width="5" fill="none" />
            <circle cx="40" cy="40" r="32" stroke="#6366F1" stroke-width="5" stroke-dasharray="200" stroke-dashoffset="60" fill="none" />
            <text x="40" y="46" font-size="14" font-weight="700" fill="#818CF8" text-anchor="middle">70%</text>
          </g>

          <text x="280" y="200" font-size="14" fill="#CBD5E1" text-anchor="middle">Enter the 6-digit verification code sent to</text>
          <text x="280" y="225" font-size="14" font-weight="700" fill="#FFFFFF" text-anchor="middle">+1 (555) 019-2834</text>

          <!-- CodeByGaurav Segmented OTP Input Boxes (6-digit PIN) -->
          <g transform="translate(80, 255)">
            <!-- Box 1 -->
            <rect x="0" y="0" width="55" height="60" rx="10" fill="#0F172A" stroke="#4F46E5" stroke-width="2" />
            <text x="27" y="40" font-size="24" font-weight="bold" fill="#FFFFFF" text-anchor="middle">4</text>

            <!-- Box 2 -->
            <rect x="68" y="0" width="55" height="60" rx="10" fill="#0F172A" stroke="#4F46E5" stroke-width="2" />
            <text x="95" y="40" font-size="24" font-weight="bold" fill="#FFFFFF" text-anchor="middle">8</text>

            <!-- Box 3 -->
            <rect x="136" y="0" width="55" height="60" rx="10" fill="#0F172A" stroke="#4F46E5" stroke-width="2" />
            <text x="163" y="40" font-size="24" font-weight="bold" fill="#FFFFFF" text-anchor="middle">2</text>

            <!-- Box 4 -->
            <rect x="204" y="0" width="55" height="60" rx="10" fill="#0F172A" stroke="#4F46E5" stroke-width="2" />
            <text x="231" y="40" font-size="24" font-weight="bold" fill="#FFFFFF" text-anchor="middle">9</text>

            <!-- Box 5 -->
            <rect x="272" y="0" width="55" height="60" rx="10" fill="#0F172A" stroke="#4F46E5" stroke-width="2" />
            <text x="299" y="40" font-size="24" font-weight="bold" fill="#FFFFFF" text-anchor="middle">1</text>

            <!-- Box 6 (Active Focus) -->
            <rect x="340" y="0" width="55" height="60" rx="10" fill="#1E1B4B" stroke="#818CF8" stroke-width="2" />
            <line x1="367" y1="18" x2="367" y2="42" stroke="#FFFFFF" stroke-width="2" />
          </g>

          <!-- Resend Timer -->
          <text x="280" y="360" font-size="12" fill="#94A3B8" text-anchor="middle">Didn&apos;t receive code? <tspan fill="#818CF8">Resend in 0:42</tspan></text>

          <!-- Confirm Button -->
          <rect x="80" y="395" width="400" height="46" rx="10" fill="url(#primaryGrad)" />
          <text x="280" y="423" font-size="14" font-weight="700" fill="#FFFFFF" text-anchor="middle">Verify &amp; Activate Account</text>

          <line x1="80" y1="475" x2="480" y2="475" stroke="#334155" stroke-width="1" />

          <text x="280" y="515" font-size="12" fill="#64748B" text-anchor="middle">By registering you agree to AuraLMS Terms &amp; Privacy Policy</text>
          <text x="280" y="540" font-size="12" fill="#94A3B8" text-anchor="middle">Already verified? <tspan fill="#818CF8">Sign in here</tspan></text>
        </g>
      `;
      return svgWrapper(body, '07_Register_VerificationRing.svg');
    }
  },

  // 8. ForgotPassword
  {
    filename: '08_ForgotPassword.svg',
    title: 'Password Recovery Flow',
    render: () => {
      let body = svgNavbar('Explore', 'GUEST', 'Guest');
      body += `
        <g transform="translate(350, 120)">
          ${svgCard(0, 0, 500, 460)}
          <circle cx="250" cy="160" r="140" fill="url(#pointerGlow)" />

          <circle cx="250" cy="65" r="28" fill="#1E1B4B" stroke="#4F46E5" />
          <text x="250" y="73" font-size="20" text-anchor="middle">🔑</text>

          <text x="250" y="125" font-size="22" font-weight="800" fill="#FFFFFF" text-anchor="middle">Forgot Password?</text>
          <text x="250" y="150" font-size="13" fill="#94A3B8" text-anchor="middle">Enter your email or registered phone to receive reset OTP</text>

          <g transform="translate(40, 180)">
            <text x="0" y="15" font-size="12" font-weight="600" fill="#CBD5E1">Email or Mobile Number</text>
            <rect x="0" y="25" width="420" height="42" rx="8" fill="#0F172A" stroke="#334155" />
            <text x="15" y="51" font-size="13" fill="#FFFFFF">student@lms.local</text>
          </g>

          <rect x="40" y="275" width="420" height="44" rx="10" fill="url(#primaryGrad)" />
          <text x="250" y="302" font-size="14" font-weight="700" fill="#FFFFFF" text-anchor="middle">Send Recovery Code</text>

          <text x="250" y="360" font-size="12" fill="#94A3B8" text-anchor="middle">Remember password? <tspan fill="#818CF8">Back to login</tspan></text>
        </g>
      `;
      return svgWrapper(body, '08_ForgotPassword.svg');
    }
  },

  // 9. StudentDashboard
  {
    filename: '09_StudentDashboard.svg',
    title: 'Student Learning Dashboard',
    render: () => {
      let body = svgNavbar('My Courses', 'STUDENT', 'John Doe');
      body += `
        <g transform="translate(48, 90)">
          <!-- Page Header -->
          <text x="0" y="24" font-size="24" font-weight="800" fill="#FFFFFF">Welcome back, John! 🚀</text>
          <text x="0" y="48" font-size="13" fill="#94A3B8">You have completed 2 lessons this week. Keep up the streak!</text>

          <!-- Top Metrics Bar -->
          <g transform="translate(0, 70)">
            ${svgCard(0, 0, 255, 90)}
            <text x="24" y="32" font-size="12" font-weight="600" fill="#94A3B8">Enrolled Courses</text>
            <text x="24" y="65" font-size="26" font-weight="800" fill="#FFFFFF">2</text>
            <circle cx="210" cy="45" r="20" fill="#1E1B4B" />
            <text x="210" y="51" font-size="14" text-anchor="middle">📚</text>

            ${svgCard(283, 0, 255, 90)}
            <text x="307" y="32" font-size="12" font-weight="600" fill="#94A3B8">Completed Quizzes</text>
            <text x="307" y="65" font-size="26" font-weight="800" fill="#10B981">4 / 4</text>
            <circle cx="493" cy="45" r="20" fill="#064E3B" />
            <text x="493" y="51" font-size="14" text-anchor="middle">🎯</text>

            ${svgCard(566, 0, 255, 90)}
            <text x="590" y="32" font-size="12" font-weight="600" fill="#94A3B8">Resolved Doubts</text>
            <text x="590" y="65" font-size="26" font-weight="800" fill="#6366F1">3</text>
            <circle cx="776" cy="45" r="20" fill="#1E1B4B" />
            <text x="776" y="51" font-size="14" text-anchor="middle">💬</text>

            ${svgCard(849, 0, 255, 90)}
            <text x="873" y="32" font-size="12" font-weight="600" fill="#94A3B8">Certificates Earned</text>
            <text x="873" y="65" font-size="26" font-weight="800" fill="#F59E0B">1</text>
            <circle cx="1059" cy="45" r="20" fill="#451A03" />
            <text x="1059" y="51" font-size="14" text-anchor="middle">🏆</text>
          </g>

          <!-- In-Progress Courses Section -->
          <text x="0" y="195" font-size="18" font-weight="700" fill="#FFFFFF">In Progress Courses</text>

          <g transform="translate(0, 215)">
            <!-- Enrolled Course 1 -->
            ${svgCard(0, 0, 540, 160)}
            <rect x="20" y="20" width="120" height="80" rx="8" fill="#1E1B4B" />
            <text x="80" y="65" font-size="12" font-weight="700" fill="#818CF8" text-anchor="middle">CS101</text>

            <text x="160" y="40" font-size="16" font-weight="700" fill="#FFFFFF">Intro to Computer Science</text>
            <text x="160" y="62" font-size="12" fill="#94A3B8">Lesson 4: Memory &amp; Pointers • Alan Turing</text>

            <!-- Progress Bar -->
            <rect x="160" y="80" width="350" height="8" rx="4" fill="#0F172A" />
            <rect x="160" y="80" width="280" height="8" rx="4" fill="#22C55E" />
            <text x="160" y="105" font-size="11" fill="#86EFAC">80% Complete • 10/12 Lessons</text>

            <rect x="390" y="115" width="125" height="32" rx="8" fill="#4F46E5" />
            <text x="452" y="135" font-size="12" font-weight="600" fill="#FFFFFF" text-anchor="middle">Resume Lesson</text>

            <!-- Enrolled Course 2 -->
            ${svgCard(564, 0, 540, 160)}
            <rect x="584" y="20" width="120" height="80" rx="8" fill="#064E3B" />
            <text x="644" y="65" font-size="12" font-weight="700" fill="#34D399" text-anchor="middle">WEB201</text>

            <text x="724" y="40" font-size="16" font-weight="700" fill="#FFFFFF">Full-Stack Web Engineering</text>
            <text x="724" y="62" font-size="12" fill="#94A3B8">Lesson 2: Express REST APIs • Sarah Connor</text>

            <!-- Progress Bar -->
            <rect x="724" y="80" width="350" height="8" rx="4" fill="#0F172A" />
            <rect x="724" y="80" width="140" height="8" rx="4" fill="#3B82F6" />
            <text x="724" y="105" font-size="11" fill="#93C5FD">40% Complete • 5/12 Lessons</text>

            <rect x="954" y="115" width="125" height="32" rx="8" fill="#4F46E5" />
            <text x="1016" y="135" font-size="12" font-weight="600" fill="#FFFFFF" text-anchor="middle">Resume Lesson</text>
          </g>

          <!-- Upcoming Live Sessions & Recent Activity -->
          <g transform="translate(0, 405)">
            <!-- Left: Upcoming Live Session -->
            ${svgCard(0, 0, 700, 160)}
            <text x="24" y="32" font-size="16" font-weight="700" fill="#FFFFFF">Upcoming Live Mentorship</text>
            
            <g transform="translate(24, 50)">
              <rect x="0" y="0" width="652" height="80" rx="8" fill="#0F172A" />
              <!-- Live Indicator Pulse -->
              <circle cx="30" cy="40" r="6" fill="#EF4444" />
              <text x="45" y="36" font-size="14" font-weight="600" fill="#FFFFFF">Algorithms Deep Dive &amp; Live Q&amp;A Session</text>
              <text x="45" y="58" font-size="12" fill="#94A3B8">Mentor: Prof. Alan Turing • Today at 6:00 PM (IST)</text>
              <rect x="520" y="24" width="115" height="34" rx="8" fill="#EF4444" />
              <text x="577" y="45" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle">Join Live</text>
            </g>

            <!-- Right: Certificate Card -->
            ${svgCard(730, 0, 374, 160)}
            <text x="754" y="32" font-size="16" font-weight="700" fill="#FFFFFF">Latest Credential</text>
            <g transform="translate(754, 50)">
              <rect x="0" y="0" width="326" height="80" rx="8" fill="#1E1B4B" stroke="#4F46E5" />
              <text x="20" y="32" font-size="13" font-weight="700" fill="#FFFFFF">CS101 Completion Certificate</text>
              <text x="20" y="52" font-size="11" font-family="monospace" fill="#818CF8">CERT-2026-CS101-JOHN</text>
              <text x="270" y="45" font-size="11" font-weight="600" fill="#22C55E">Verified</text>
            </g>
          </g>
        </g>
      `;
      return svgWrapper(body, '09_StudentDashboard.svg');
    }
  },

  // 10. ClassroomPlayer
  {
    filename: '10_ClassroomPlayer.svg',
    title: 'Classroom Player & Quiz View',
    render: () => {
      let body = svgNavbar('My Courses', 'STUDENT', 'John Doe');
      body += `
        <g transform="translate(48, 80)">
          <!-- Breadcrumb & Top Bar -->
          <text x="0" y="16" font-size="12" fill="#64748B">Intro to Computer Science &gt; Module 1 &gt; Lesson 3: Asymptotic Analysis</text>

          <!-- Main Player Window (16:9) -->
          <g transform="translate(0, 35)">
            <rect x="0" y="0" width="760" height="460" rx="12" fill="#000000" stroke="#1E293B" />
            
            <!-- Video Mock Canvas -->
            <rect x="40" y="40" width="680" height="340" rx="8" fill="#0B132B" />
            <circle cx="380" cy="210" r="32" fill="#4F46E5" />
            <polygon points="375,200 395,210 375,220" fill="#FFFFFF" />

            <!-- Code Overlay on Video -->
            <text x="70" y="80" font-family="monospace" font-size="13" fill="#38BDF8">function binarySearch(arr, target) {</text>
            <text x="90" y="105" font-family="monospace" font-size="13" fill="#94A3B8">  let low = 0, high = arr.length - 1;</text>
            <text x="90" y="130" font-family="monospace" font-size="13" fill="#38BDF8">  // O(log n) time complexity</text>
            <text x="70" y="155" font-family="monospace" font-size="13" fill="#38BDF8">}</text>

            <!-- Video Controls Bar -->
            <rect x="0" y="415" width="760" height="45" rx="0" fill="#0F172A" />
            <line x1="0" y1="415" x2="760" y2="415" stroke="#334155" stroke-width="1" />
            <!-- Play Button -->
            <polygon points="25,432 35,438 25,444" fill="#FFFFFF" />
            <!-- Progress scrubber -->
            <rect x="50" y="435" width="560" height="6" rx="3" fill="#334155" />
            <rect x="50" y="435" width="280" height="6" rx="3" fill="#4F46E5" />
            <text x="630" y="441" font-size="11" fill="#94A3B8">14:22 / 28:50</text>
            <!-- Fullscreen icon -->
            <rect x="725" y="432" width="12" height="12" stroke="#FFFFFF" stroke-width="1.5" fill="none" />
          </g>

          <!-- Right Column: Lesson Syllabus & Quiz Drawer -->
          <g transform="translate(780, 35)">
            ${svgCard(0, 0, 324, 460)}
            <text x="20" y="32" font-size="15" font-weight="700" fill="#FFFFFF">Course Modules</text>
            <text x="250" y="32" font-size="11" fill="#818CF8">80% Done</text>

            <g transform="translate(20, 50)">
              <rect x="0" y="0" width="284" height="46" rx="6" fill="#1E1B4B" stroke="#4F46E5" />
              <circle cx="20" cy="23" r="7" fill="#22C55E" />
              <text x="35" y="27" font-size="12" font-weight="600" fill="#FFFFFF">1. Complexity Analysis</text>

              <rect x="0" y="55" width="284" height="46" rx="6" fill="#0F172A" />
              <circle cx="20" cy="78" r="7" fill="#22C55E" />
              <text x="35" y="82" font-size="12" fill="#E2E8F0">2. Big-O &amp; Big-Theta</text>

              <rect x="0" y="110" width="284" height="46" rx="6" fill="#0F172A" stroke="#3B82F6" stroke-width="1" />
              <circle cx="20" cy="133" r="7" fill="#3B82F6" />
              <text x="35" y="137" font-size="12" font-weight="600" fill="#60A5FA">3. Sorting Algorithms (Current)</text>

              <rect x="0" y="165" width="284" height="46" rx="6" fill="#0F172A" />
              <circle cx="20" cy="188" r="7" stroke="#64748B" stroke-width="1.5" fill="none" />
              <text x="35" y="192" font-size="12" fill="#94A3B8">4. Module 1 Graded Quiz</text>

              <!-- Graded Quiz Snapshot Modal inside panel -->
              <g transform="translate(0, 230)">
                <rect x="0" y="0" width="284" height="150" rx="8" fill="#0B132B" stroke="#374151" />
                <text x="15" y="25" font-size="12" font-weight="700" fill="#FBBF24">⚡ Quick Check Quiz</text>
                <text x="15" y="48" font-size="11" fill="#E5E7EB">What is average time complexity of QuickSort?</text>
                
                <rect x="15" y="60" width="254" height="26" rx="4" fill="#1E293B" stroke="#4F46E5" />
                <text x="25" y="77" font-size="10" fill="#C7D2FE">● O(n log n) [Selected]</text>

                <rect x="15" y="92" width="254" height="26" rx="4" fill="#0F172A" />
                <text x="25" y="109" font-size="10" fill="#94A3B8">○ O(n²)</text>

                <rect x="15" y="124" width="254" height="20" rx="4" fill="#22C55E" />
                <text x="142" y="138" font-size="10" font-weight="700" fill="#FFFFFF" text-anchor="middle">Submit Answer</text>
              </g>
            </g>
          </g>

          <!-- Bottom Action Tabs: Notes, Doubts, Resources -->
          <g transform="translate(0, 515)">
            ${svgCard(0, 0, 760, 160)}
            <text x="24" y="32" font-size="14" font-weight="700" fill="#FFFFFF">Discussion &amp; Doubt Assistance</text>
            <text x="640" y="32" font-size="12" font-weight="600" fill="#818CF8">+ Ask New Doubt</text>

            <rect x="24" y="50" width="712" height="85" rx="8" fill="#0F172A" />
            <circle cx="50" cy="80" r="14" fill="#3B82F6" />
            <text x="50" y="85" font-size="11" font-weight="bold" fill="#FFFFFF" text-anchor="middle">J</text>
            <text x="75" y="75" font-size="12" font-weight="600" fill="#FFFFFF">John Doe: <tspan font-weight="400" fill="#CBD5E1">Does space complexity increase with recursive call stacks?</tspan></text>
            <text x="75" y="98" font-size="11" fill="#34D399">✓ Answered by Prof. Alan Turing: Yes, each recursive frame adds O(d) memory overhead.</text>
          </g>
        </g>
      `;
      return svgWrapper(body, '10_ClassroomPlayer.svg', 780);
    }
  },

  // 11. StudentDoubts
  {
    filename: '11_StudentDoubts.svg',
    title: 'Student Doubt Resolution Tickets',
    render: () => {
      let body = svgNavbar('Doubts', 'STUDENT', 'John Doe');
      body += `
        <g transform="translate(48, 90)">
          <text x="0" y="24" font-size="24" font-weight="800" fill="#FFFFFF">My Doubts &amp; Mentorship Inquiries</text>
          <text x="0" y="48" font-size="13" fill="#94A3B8">Direct 1-on-1 assistance with course faculty and mentors</text>

          <rect x="940" y="15" width="164" height="38" rx="8" fill="#4F46E5" />
          <text x="1022" y="39" font-size="13" font-weight="600" fill="#FFFFFF" text-anchor="middle">+ Ask a New Doubt</text>

          <!-- Doubt Tickets Table / Cards -->
          <g transform="translate(0, 80)">
            <!-- Ticket 1: Resolved -->
            ${svgCard(0, 0, 1104, 110)}
            <rect x="20" y="20" width="80" height="24" rx="12" fill="#064E3B" />
            <text x="60" y="36" font-size="11" font-weight="700" fill="#34D399" text-anchor="middle">RESOLVED</text>
            <text x="115" y="37" font-size="15" font-weight="700" fill="#FFFFFF">Recursive Tree Traversal Space Complexity</text>
            <text x="115" y="60" font-size="12" fill="#94A3B8">CS101 • Module 2: Binary Search Trees • Asked 2 days ago</text>
            <text x="115" y="85" font-size="12" fill="#CBD5E1">Latest Response by Prof. Alan: "Here is the visual diagram illustrating how stack frames deallocate..."</text>
            <rect x="980" y="40" width="100" height="32" rx="6" fill="#1E293B" stroke="#334155" />
            <text x="1030" y="61" font-size="12" fill="#818CF8" text-anchor="middle">View Thread</text>

            <!-- Ticket 2: Under Review -->
            ${svgCard(0, 130, 1104, 110)}
            <rect x="20" y="150" width="100" height="24" rx="12" fill="#451A03" />
            <text x="70" y="166" font-size="11" font-weight="700" fill="#FBBF24" text-anchor="middle">IN REVIEW</text>
            <text x="135" y="167" font-size="15" font-weight="700" fill="#FFFFFF">CORS Error when calling Express API from React Vite</text>
            <text x="135" y="190" font-size="12" fill="#94A3B8">WEB201 • Module 3: Express Backend • Asked 45 mins ago</text>
            <text x="135" y="215" font-size="12" fill="#CBD5E1">Assigned to: Sarah Connor (Mentor)</text>
            <rect x="980" y="170" width="100" height="32" rx="6" fill="#1E293B" stroke="#334155" />
            <text x="1030" y="191" font-size="12" fill="#818CF8" text-anchor="middle">View Thread</text>
          </g>
        </g>
      `;
      return svgWrapper(body, '11_StudentDoubts.svg');
    }
  },

  // 12. StudentOrders
  {
    filename: '12_StudentOrders.svg',
    title: 'Student Orders & Tax Invoices',
    render: () => {
      let body = svgNavbar('My Courses', 'STUDENT', 'John Doe');
      body += `
        <g transform="translate(48, 90)">
          <text x="0" y="24" font-size="24" font-weight="800" fill="#FFFFFF">Order History &amp; Official Invoices</text>
          <text x="0" y="48" font-size="13" fill="#94A3B8">Download GST/Tax compliant receipts and view payment statuses</text>

          <!-- Orders Table Mock -->
          <g transform="translate(0, 80)">
            ${svgCard(0, 0, 1104, 340)}

            <!-- Table Header -->
            <rect x="0" y="0" width="1104" height="45" rx="12" fill="#0F172A" />
            <text x="24" y="28" font-size="12" font-weight="600" fill="#94A3B8">ORDER ID</text>
            <text x="220" y="28" font-size="12" font-weight="600" fill="#94A3B8">COURSE ENROLLED</text>
            <text x="500" y="28" font-size="12" font-weight="600" fill="#94A3B8">DATE</text>
            <text x="650" y="28" font-size="12" font-weight="600" fill="#94A3B8">AMOUNT</text>
            <text x="780" y="28" font-size="12" font-weight="600" fill="#94A3B8">PAYMENT STATUS</text>
            <text x="960" y="28" font-size="12" font-weight="600" fill="#94A3B8">INVOICE</text>

            <!-- Row 1 -->
            <line x1="0" y1="45" x2="1104" y2="45" stroke="#334155" stroke-width="1" />
            <text x="24" y="85" font-family="monospace" font-size="12" fill="#818CF8">order_cs101_seed</text>
            <text x="220" y="85" font-size="13" font-weight="600" fill="#FFFFFF">Intro to Computer Science</text>
            <text x="500" y="85" font-size="13" fill="#94A3B8">Oct 18, 2026</text>
            <text x="650" y="85" font-size="14" font-weight="700" fill="#FFFFFF">$49.99</text>
            <rect x="780" y="70" width="95" height="24" rx="12" fill="#064E3B" />
            <text x="827" y="86" font-size="11" font-weight="700" fill="#34D399" text-anchor="middle">COMPLETED</text>
            <rect x="960" y="68" width="110" height="28" rx="6" fill="#1E1B4B" stroke="#4F46E5" />
            <text x="1015" y="86" font-size="11" font-weight="600" fill="#C7D2FE" text-anchor="middle">Download PDF</text>

            <!-- Row 2 -->
            <line x1="0" y1="120" x2="1104" y2="120" stroke="#334155" stroke-width="1" />
            <text x="24" y="160" font-family="monospace" font-size="12" fill="#818CF8">order_web201_seed</text>
            <text x="220" y="160" font-size="13" font-weight="600" fill="#FFFFFF">Full-Stack Web Dev</text>
            <text x="500" y="160" font-size="13" fill="#94A3B8">Oct 19, 2026</text>
            <text x="650" y="160" font-size="14" font-weight="700" fill="#FFFFFF">$79.99</text>
            <rect x="780" y="145" width="95" height="24" rx="12" fill="#064E3B" />
            <text x="827" y="161" font-size="11" font-weight="700" fill="#34D399" text-anchor="middle">COMPLETED</text>
            <rect x="960" y="143" width="110" height="28" rx="6" fill="#1E1B4B" stroke="#4F46E5" />
            <text x="1015" y="161" font-size="11" font-weight="600" fill="#C7D2FE" text-anchor="middle">Download PDF</text>
          </g>
        </g>
      `;
      return svgWrapper(body, '12_StudentOrders.svg');
    }
  },

  // 13. StudentLiveClasses
  {
    filename: '13_StudentLiveClasses.svg',
    title: 'Student Live Sessions Schedule',
    render: () => {
      let body = svgNavbar('Live', 'STUDENT', 'John Doe');
      body += `
        <g transform="translate(48, 90)">
          <text x="0" y="24" font-size="24" font-weight="800" fill="#FFFFFF">Live Mentorship Calendar</text>
          <text x="0" y="48" font-size="13" fill="#94A3B8">Join real-time problem-solving workshops and AMA sessions</text>

          <g transform="translate(0, 80)">
            <!-- Card 1: Happening Today -->
            ${svgCard(0, 0, 540, 200)}
            <rect x="24" y="24" width="70" height="24" rx="12" fill="#7F1D1D" />
            <circle cx="36" cy="36" r="4" fill="#EF4444" />
            <text x="58" y="40" font-size="11" font-weight="700" fill="#FCA5A5" text-anchor="middle">LIVE SOON</text>

            <text x="24" y="75" font-size="18" font-weight="700" fill="#FFFFFF">Sorting Algorithm Visualizer &amp; Time Proofs</text>
            <text x="24" y="100" font-size="13" fill="#94A3B8">Prof. Alan Turing • CS101 Track</text>

            <rect x="24" y="130" width="160" height="42" rx="10" fill="#EF4444" />
            <text x="104" y="156" font-size="13" font-weight="700" fill="#FFFFFF" text-anchor="middle">Join Zoom Room</text>

            <text x="210" y="155" font-size="12" fill="#CBD5E1">Starts in: <tspan font-weight="bold" fill="#FBBF24">25m 12s</tspan></text>

            <!-- Card 2: Upcoming Tomorrow -->
            ${svgCard(564, 0, 540, 200)}
            <rect x="588" y="24" width="90" height="24" rx="12" fill="#1E1B4B" />
            <text x="633" y="40" font-size="11" font-weight="700" fill="#818CF8" text-anchor="middle">TOMORROW</text>

            <text x="588" y="75" font-size="18" font-weight="700" fill="#FFFFFF">Building Reactive State with Tailwind v4</text>
            <text x="588" y="100" font-size="13" fill="#94A3B8">Sarah Connor • WEB201 Track</text>

            <rect x="588" y="130" width="160" height="42" rx="10" fill="#1E293B" stroke="#334155" />
            <text x="668" y="156" font-size="13" font-weight="600" fill="#E2E8F0" text-anchor="middle">Set Calendar Alert</text>

            <text x="770" y="155" font-size="12" fill="#94A3B8">Tomorrow at 7:00 PM</text>
          </g>
        </g>
      `;
      return svgWrapper(body, '13_StudentLiveClasses.svg');
    }
  },

  // 14. StudentProfile
  {
    filename: '14_StudentProfile.svg',
    title: 'Student Profile & Credentials',
    render: () => {
      let body = svgNavbar('My Courses', 'STUDENT', 'John Doe');
      body += `
        <g transform="translate(48, 90)">
          <text x="0" y="24" font-size="24" font-weight="800" fill="#FFFFFF">Student Profile &amp; Achievements</text>
          
          <g transform="translate(0, 60)">
            <!-- Left Card: Bio -->
            ${svgCard(0, 0, 400, 480)}
            <circle cx="200" cy="80" r="44" fill="#3B82F6" />
            <text x="200" y="93" font-size="32" font-weight="bold" fill="#FFFFFF" text-anchor="middle">J</text>

            <text x="200" y="155" font-size="20" font-weight="700" fill="#FFFFFF" text-anchor="middle">John Doe</text>
            <text x="200" y="178" font-size="13" fill="#94A3B8" text-anchor="middle">student@lms.local • +1 (555) 019-2834</text>

            <rect x="150" y="195" width="100" height="24" rx="12" fill="#1E1B4B" stroke="#4F46E5" />
            <text x="200" y="211" font-size="11" font-weight="700" fill="#818CF8" text-anchor="middle">VERIFIED STUDENT</text>

            <g transform="translate(30, 250)">
              <text x="0" y="20" font-size="13" fill="#64748B">Account Status: <tspan fill="#22C55E">Active</tspan></text>
              <text x="0" y="50" font-size="13" fill="#64748B">Member Since: <tspan fill="#CBD5E1">October 2026</tspan></text>
              <text x="0" y="80" font-size="13" fill="#64748B">Preferred Language: <tspan fill="#818CF8">English (US)</tspan></text>
              <text x="0" y="110" font-size="13" fill="#64748B">Total Learning Time: <tspan fill="#CBD5E1">34 Hours</tspan></text>
            </g>

            <rect x="30" y="400" width="340" height="42" rx="8" fill="#1E293B" stroke="#334155" />
            <text x="200" y="426" font-size="13" font-weight="600" fill="#E2E8F0" text-anchor="middle">Edit Account Info</text>

            <!-- Right: Certificates & Badges -->
            ${svgCard(430, 0, 674, 480)}
            <text x="454" y="35" font-size="16" font-weight="700" fill="#FFFFFF">Issued Credentials &amp; Badges</text>

            <g transform="translate(454, 60)">
              <rect x="0" y="0" width="626" height="120" rx="10" fill="#0F172A" stroke="#4F46E5" />
              <text x="20" y="35" font-size="15" font-weight="700" fill="#FFFFFF">Introduction to Computer Science (CS101)</text>
              <text x="20" y="58" font-size="12" fill="#94A3B8">Issued on Oct 20, 2026 • Grade: 100%</text>
              <text x="20" y="85" font-family="monospace" font-size="11" fill="#818CF8">CERT-2026-CS101-JOHN</text>

              <rect x="490" y="40" width="115" height="34" rx="6" fill="#4F46E5" />
              <text x="547" y="61" font-size="11" font-weight="600" fill="#FFFFFF" text-anchor="middle">View / Share</text>
            </g>
          </g>
        </g>
      `;
      return svgWrapper(body, '14_StudentProfile.svg');
    }
  },

  // 15. MentorDashboard
  {
    filename: '15_MentorDashboard.svg',
    title: 'Mentor Faculty Dashboard',
    render: () => {
      let body = svgNavbar('Doubts', 'MENTOR', 'Prof. Alan Turing');
      body += `
        <g transform="translate(48, 90)">
          <text x="0" y="24" font-size="24" font-weight="800" fill="#FFFFFF">Faculty &amp; Mentor Console</text>
          <text x="0" y="48" font-size="13" fill="#94A3B8">Manage student doubt queries, review submissions, and schedule live workshops</text>

          <!-- Metrics Bar -->
          <g transform="translate(0, 70)">
            ${svgCard(0, 0, 255, 90)}
            <text x="24" y="32" font-size="12" font-weight="600" fill="#94A3B8">Pending Doubts</text>
            <text x="24" y="65" font-size="26" font-weight="800" fill="#F59E0B">4</text>
            <circle cx="210" cy="45" r="20" fill="#451A03" />
            <text x="210" y="51" font-size="14" text-anchor="middle">⏳</text>

            ${svgCard(283, 0, 255, 90)}
            <text x="307" y="32" font-size="12" font-weight="600" fill="#94A3B8">Resolved This Week</text>
            <text x="307" y="65" font-size="26" font-weight="800" fill="#10B981">28</text>
            <circle cx="493" cy="45" r="20" fill="#064E3B" />
            <text x="493" y="51" font-size="14" text-anchor="middle">✅</text>

            ${svgCard(566, 0, 255, 90)}
            <text x="590" y="32" font-size="12" font-weight="600" fill="#94A3B8">Active Students</text>
            <text x="590" y="65" font-size="26" font-weight="800" fill="#3B82F6">142</text>
            <circle cx="776" cy="45" r="20" fill="#1E1B4B" />
            <text x="776" y="51" font-size="14" text-anchor="middle">👥</text>

            ${svgCard(849, 0, 255, 90)}
            <text x="873" y="32" font-size="12" font-weight="600" fill="#94A3B8">Avg Satisfaction</text>
            <text x="873" y="65" font-size="26" font-weight="800" fill="#FBBF24">4.95</text>
            <circle cx="1059" cy="45" r="20" fill="#451A03" />
            <text x="1059" y="51" font-size="14" text-anchor="middle">⭐</text>
          </g>

          <!-- Active Doubt Queue -->
          <text x="0" y="195" font-size="18" font-weight="700" fill="#FFFFFF">Priority Doubt Tickets Awaiting Answer</text>

          <g transform="translate(0, 215)">
            ${svgCard(0, 0, 1104, 80)}
            <circle cx="40" cy="40" r="16" fill="#3B82F6" />
            <text x="40" y="45" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">J</text>
            <text x="70" y="35" font-size="14" font-weight="700" fill="#FFFFFF">John Doe: <tspan font-weight="400">Can we reduce time complexity of 3Sum below O(n²)?</tspan></text>
            <text x="70" y="58" font-size="11" fill="#94A3B8">CS101 • 12 mins ago • SLA Target: &lt;15 mins</text>
            <rect x="960" y="24" width="120" height="32" rx="6" fill="#4F46E5" />
            <text x="1020" y="44" font-size="12" font-weight="600" fill="#FFFFFF" text-anchor="middle">Reply Now</text>

            ${svgCard(0, 95, 1104, 80)}
            <circle cx="40" cy="135" r="16" fill="#10B981" />
            <text x="40" y="140" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">A</text>
            <text x="70" y="130" font-size="14" font-weight="700" fill="#FFFFFF">Alice Smith: <tspan font-weight="400">Prisma Client disconnecting on serverless function timeout</tspan></text>
            <text x="70" y="153" font-size="11" fill="#94A3B8">WEB201 • 38 mins ago</text>
            <rect x="960" y="119" width="120" height="32" rx="6" fill="#4F46E5" />
            <text x="1020" y="139" font-size="12" font-weight="600" fill="#FFFFFF" text-anchor="middle">Reply Now</text>
          </g>
        </g>
      `;
      return svgWrapper(body, '15_MentorDashboard.svg');
    }
  },

  // 16. MentorDoubts
  {
    filename: '16_MentorDoubts.svg',
    title: 'Mentor Doubt Resolution & Code Responder',
    render: () => {
      let body = svgNavbar('Doubts', 'MENTOR', 'Prof. Alan Turing');
      body += `
        <g transform="translate(48, 80)">
          <!-- Breadcrumb -->
          <text x="0" y="15" font-size="12" fill="#64748B">Doubt Console &gt; Ticket #DT-1092</text>

          <g transform="translate(0, 30)">
            <!-- Left: Conversation Thread -->
            ${svgCard(0, 0, 680, 560)}
            <text x="24" y="32" font-size="16" font-weight="700" fill="#FFFFFF">Ticket: Recursive Tree Traversal Space Complexity</text>
            
            <!-- Student Question -->
            <g transform="translate(24, 60)">
              <rect x="0" y="0" width="632" height="110" rx="8" fill="#0F172A" />
              <text x="20" y="28" font-size="13" font-weight="700" fill="#60A5FA">John Doe (Student)</text>
              <text x="20" y="55" font-size="13" fill="#E2E8F0">In Lesson 3 on BSTs, why is space complexity O(h) where h is height, rather than O(n)?</text>
              <text x="20" y="85" font-family="monospace" font-size="11" fill="#818CF8">Attachment: bst_traversal.ts (1.2 KB)</text>
            </g>

            <!-- Mentor Reply Area -->
            <g transform="translate(24, 190)">
              <text x="0" y="20" font-size="13" font-weight="700" fill="#34D399">Your Faculty Response</text>
              <rect x="0" y="30" width="632" height="200" rx="8" fill="#0F172A" stroke="#334155" />
              <text x="20" y="60" font-family="monospace" font-size="12" fill="#38BDF8">// Space complexity depends on maximum call stack depth</text>
              <text x="20" y="85" font-size="13" fill="#FFFFFF">Great question John! In a binary tree, you only visit down one branch</text>
              <text x="20" y="105" font-size="13" fill="#FFFFFF">at any given moment. Thus, call frames correspond to tree height.</text>
              <text x="20" y="145" font-family="monospace" font-size="12" fill="#A855F7">O(h) in balanced BST = O(log n); in worst-case degenerate = O(n).</text>

              <rect x="0" y="250" width="160" height="38" rx="8" fill="#22C55E" />
              <text x="80" y="274" font-size="13" font-weight="700" fill="#FFFFFF" text-anchor="middle">Resolve Ticket</text>
            </g>

            <!-- Right: Student Context Drawer -->
            ${svgCard(710, 0, 394, 560)}
            <text x="734" y="32" font-size="16" font-weight="700" fill="#FFFFFF">Student Context</text>
            <circle cx="780" cy="80" r="28" fill="#3B82F6" />
            <text x="780" y="88" font-size="20" font-weight="bold" fill="#FFFFFF" text-anchor="middle">J</text>

            <text x="825" y="75" font-size="16" font-weight="700" fill="#FFFFFF">John Doe</text>
            <text x="825" y="95" font-size="12" fill="#94A3B8">student@lms.local</text>

            <g transform="translate(734, 140)">
              <text x="0" y="20" font-size="12" fill="#64748B">Course: <tspan fill="#FFFFFF">CS101 (Comp Science)</tspan></text>
              <text x="0" y="45" font-size="12" fill="#64748B">Progress: <tspan fill="#22C55E">80% Complete</tspan></text>
              <text x="0" y="70" font-size="12" fill="#64748B">Last Quiz Score: <tspan fill="#22C55E">100% (High Honors)</tspan></text>
            </g>
          </g>
        </g>
      `;
      return svgWrapper(body, '16_MentorDoubts.svg');
    }
  },

  // 17. ContentCourseList
  {
    filename: '17_ContentCourseList.svg',
    title: 'Content Manager Course Portfolio',
    render: () => {
      let body = svgNavbar('Explore', 'CONTENT_MANAGER', 'Sarah Connor');
      body += `
        <g transform="translate(48, 90)">
          <text x="0" y="24" font-size="24" font-weight="800" fill="#FFFFFF">Course Portfolio &amp; Publishing</text>
          <text x="0" y="48" font-size="13" fill="#94A3B8">Author, edit, structure modules, and publish course curricula</text>

          <rect x="940" y="15" width="164" height="38" rx="8" fill="#4F46E5" />
          <text x="1022" y="39" font-size="13" font-weight="600" fill="#FFFFFF" text-anchor="middle">+ Create New Course</text>

          <!-- Course Table -->
          <g transform="translate(0, 80)">
            ${svgCard(0, 0, 1104, 340)}
            <rect x="0" y="0" width="1104" height="45" rx="12" fill="#0F172A" />
            <text x="24" y="28" font-size="12" font-weight="600" fill="#94A3B8">COURSE TITLE</text>
            <text x="320" y="28" font-size="12" font-weight="600" fill="#94A3B8">CATEGORY</text>
            <text x="480" y="28" font-size="12" font-weight="600" fill="#94A3B8">MODULES / LESSONS</text>
            <text x="680" y="28" font-size="12" font-weight="600" fill="#94A3B8">PRICE</text>
            <text x="780" y="28" font-size="12" font-weight="600" fill="#94A3B8">STATUS</text>
            <text x="960" y="28" font-size="12" font-weight="600" fill="#94A3B8">ACTIONS</text>

            <!-- Row 1 -->
            <line x1="0" y1="45" x2="1104" y2="45" stroke="#334155" stroke-width="1" />
            <text x="24" y="85" font-size="13" font-weight="700" fill="#FFFFFF">Intro to Computer Science (CS101)</text>
            <text x="320" y="85" font-size="13" fill="#94A3B8">Computer Science</text>
            <text x="480" y="85" font-size="13" fill="#CBD5E1">4 Modules • 12 Lessons</text>
            <text x="680" y="85" font-size="14" font-weight="700" fill="#FFFFFF">$49.99</text>
            <rect x="780" y="70" width="85" height="24" rx="12" fill="#064E3B" />
            <text x="822" y="86" font-size="11" font-weight="700" fill="#34D399" text-anchor="middle">PUBLISHED</text>
            <rect x="960" y="68" width="90" height="28" rx="6" fill="#1E1B4B" stroke="#4F46E5" />
            <text x="1005" y="86" font-size="11" font-weight="600" fill="#C7D2FE" text-anchor="middle">Edit Course</text>

            <!-- Row 2 -->
            <line x1="0" y1="120" x2="1104" y2="120" stroke="#334155" stroke-width="1" />
            <text x="24" y="160" font-size="13" font-weight="700" fill="#FFFFFF">Full-Stack Web Dev (WEB201)</text>
            <text x="320" y="160" font-size="13" fill="#94A3B8">Web Engineering</text>
            <text x="480" y="160" font-size="13" fill="#CBD5E1">6 Modules • 24 Lessons</text>
            <text x="680" y="160" font-size="14" font-weight="700" fill="#FFFFFF">$79.99</text>
            <rect x="780" y="145" width="85" height="24" rx="12" fill="#064E3B" />
            <text x="822" y="161" font-size="11" font-weight="700" fill="#34D399" text-anchor="middle">PUBLISHED</text>
            <rect x="960" y="143" width="90" height="28" rx="6" fill="#1E1B4B" stroke="#4F46E5" />
            <text x="1005" y="161" font-size="11" font-weight="600" fill="#C7D2FE" text-anchor="middle">Edit Course</text>
          </g>
        </g>
      `;
      return svgWrapper(body, '17_ContentCourseList.svg');
    }
  },

  // 18. ContentCourseEditor
  {
    filename: '18_ContentCourseEditor.svg',
    title: 'Course Curriculum & Quiz Builder',
    render: () => {
      let body = svgNavbar('Explore', 'CONTENT_MANAGER', 'Sarah Connor');
      body += `
        <g transform="translate(48, 80)">
          <!-- Top Bar -->
          <text x="0" y="16" font-size="12" fill="#64748B">Course Manager &gt; Edit Course: CS101</text>
          <text x="0" y="45" font-size="24" font-weight="800" fill="#FFFFFF">Course Curriculum Editor</text>

          <g transform="translate(850, 20)">
            <rect x="0" y="0" width="110" height="36" rx="8" fill="#1E293B" stroke="#334155" />
            <text x="55" y="23" font-size="12" fill="#CBD5E1" text-anchor="middle">Preview Mode</text>

            <rect x="125" y="0" width="125" height="36" rx="8" fill="#22C55E" />
            <text x="187" y="23" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle">Save Changes</text>
          </g>

          <g transform="translate(0, 65)">
            <!-- Left: Module Tree -->
            ${svgCard(0, 0, 400, 520)}
            <text x="20" y="32" font-size="15" font-weight="700" fill="#FFFFFF">Modules &amp; Lessons</text>
            <text x="320" y="32" font-size="12" font-weight="600" fill="#818CF8">+ Add</text>

            <g transform="translate(20, 50)">
              <rect x="0" y="0" width="360" height="50" rx="8" fill="#1E1B4B" stroke="#4F46E5" />
              <text x="15" y="30" font-size="13" font-weight="700" fill="#FFFFFF">Module 1: Complexity &amp; Trees</text>

              <!-- Lesson sub-items -->
              <rect x="15" y="60" width="345" height="40" rx="6" fill="#0F172A" />
              <text x="30" y="85" font-size="12" fill="#93C5FD">⠿ 1.1 Big-O Foundations</text>

              <rect x="15" y="110" width="345" height="40" rx="6" fill="#0F172A" />
              <text x="30" y="135" font-size="12" fill="#93C5FD">⠿ 1.2 Binary Search Trees</text>

              <rect x="15" y="160" width="345" height="40" rx="6" fill="#0F172A" stroke="#3B82F6" stroke-width="1.5" />
              <text x="30" y="185" font-size="12" font-weight="600" fill="#60A5FA">⠿ 1.3 Quiz: Tree Algorithms</text>
            </g>

            <!-- Right: Lesson / Quiz Inspector -->
            ${svgCard(430, 0, 674, 520)}
            <text x="454" y="32" font-size="15" font-weight="700" fill="#FFFFFF">Quiz Question Builder: Tree Algorithms</text>

            <g transform="translate(454, 55)">
              <text x="0" y="15" font-size="12" font-weight="600" fill="#CBD5E1">Question Prompt (English)</text>
              <rect x="0" y="25" width="626" height="40" rx="6" fill="#0F172A" stroke="#334155" />
              <text x="15" y="50" font-size="13" fill="#FFFFFF">What is the average time complexity to lookup a key in a balanced BST?</text>

              <!-- Hindi Prompt -->
              <text x="0" y="90" font-size="12" font-weight="600" fill="#CBD5E1">Question Prompt (हिन्दी Bilingual)</text>
              <rect x="0" y="100" width="626" height="40" rx="6" fill="#0F172A" stroke="#334155" />
              <text x="15" y="125" font-size="13" fill="#FFFFFF">संतुलित BST में किसी कुंजी को खोजने की औसत समय जटिलता क्या है?</text>

              <!-- Options -->
              <text x="0" y="165" font-size="12" font-weight="600" fill="#CBD5E1">Answer Options &amp; Correct Choice</text>
              <rect x="0" y="175" width="626" height="34" rx="6" fill="#064E3B" stroke="#22C55E" />
              <text x="20" y="197" font-size="12" font-weight="600" fill="#34D399">✓ O(log n) [CORRECT]</text>

              <rect x="0" y="218" width="626" height="34" rx="6" fill="#0F172A" stroke="#334155" />
              <text x="20" y="240" font-size="12" fill="#94A3B8">○ O(n)</text>

              <rect x="0" y="260" width="626" height="34" rx="6" fill="#0F172A" stroke="#334155" />
              <text x="20" y="282" font-size="12" fill="#94A3B8">○ O(1)</text>

              <!-- Passing Marks -->
              <text x="0" y="325" font-size="12" fill="#CBD5E1">Passing Percentage: <tspan font-weight="bold" fill="#FBBF24">80%</tspan> Required for Certificate</text>
            </g>
          </g>
        </g>
      `;
      return svgWrapper(body, '18_ContentCourseEditor.svg');
    }
  },

  // 19. FinanceDashboard
  {
    filename: '19_FinanceDashboard.svg',
    title: 'Finance & Transaction Ledger',
    render: () => {
      let body = svgNavbar('Explore', 'FINANCE_SUPPORT', 'Rachel Zane');
      body += `
        <g transform="translate(48, 90)">
          <text x="0" y="24" font-size="24" font-weight="800" fill="#FFFFFF">Financial Ledger &amp; Refunds</text>
          <text x="0" y="48" font-size="13" fill="#94A3B8">Monitor transactions, process refunds, and reconcile gateway settlement records</text>

          <!-- Top Financial Stats -->
          <g transform="translate(0, 70)">
            ${svgCard(0, 0, 255, 90)}
            <text x="24" y="32" font-size="12" font-weight="600" fill="#94A3B8">Total Gross Volume</text>
            <text x="24" y="65" font-size="26" font-weight="800" fill="#FFFFFF">$48,290.00</text>

            ${svgCard(283, 0, 255, 90)}
            <text x="307" y="32" font-size="12" font-weight="600" fill="#94A3B8">Successful Orders</text>
            <text x="307" y="65" font-size="26" font-weight="800" fill="#10B981">612</text>

            ${svgCard(566, 0, 255, 90)}
            <text x="590" y="32" font-size="12" font-weight="600" fill="#94A3B8">Pending Refunds</text>
            <text x="590" y="65" font-size="26" font-weight="800" fill="#F59E0B">1</text>

            ${svgCard(849, 0, 255, 90)}
            <text x="873" y="32" font-size="12" font-weight="600" fill="#94A3B8">Refund Rate</text>
            <text x="873" y="65" font-size="26" font-weight="800" fill="#3B82F6">0.4%</text>
          </g>

          <!-- Transaction Table -->
          <g transform="translate(0, 190)">
            ${svgCard(0, 0, 1104, 340)}
            <rect x="0" y="0" width="1104" height="45" rx="12" fill="#0F172A" />
            <text x="24" y="28" font-size="12" font-weight="600" fill="#94A3B8">TRANSACTION ID</text>
            <text x="240" y="28" font-size="12" font-weight="600" fill="#94A3B8">USER</text>
            <text x="440" y="28" font-size="12" font-weight="600" fill="#94A3B8">GATEWAY</text>
            <text x="600" y="28" font-size="12" font-weight="600" fill="#94A3B8">AMOUNT</text>
            <text x="740" y="28" font-size="12" font-weight="600" fill="#94A3B8">STATUS</text>
            <text x="940" y="28" font-size="12" font-weight="600" fill="#94A3B8">ACTIONS</text>

            <!-- Row 1 -->
            <line x1="0" y1="45" x2="1104" y2="45" stroke="#334155" stroke-width="1" />
            <text x="24" y="85" font-family="monospace" font-size="12" fill="#818CF8">txn_rzp_9921_success</text>
            <text x="240" y="85" font-size="13" fill="#FFFFFF">john_student</text>
            <text x="440" y="85" font-size="13" fill="#CBD5E1">Razorpay UPI</text>
            <text x="600" y="85" font-size="14" font-weight="700" fill="#FFFFFF">$49.99</text>
            <rect x="740" y="70" width="95" height="24" rx="12" fill="#064E3B" />
            <text x="787" y="86" font-size="11" font-weight="700" fill="#34D399" text-anchor="middle">CAPTURED</text>
            <rect x="940" y="68" width="120" height="28" rx="6" fill="#1E293B" stroke="#334155" />
            <text x="1000" y="86" font-size="11" fill="#E2E8F0" text-anchor="middle">Issue Refund</text>

            <!-- Row 2 -->
            <line x1="0" y1="120" x2="1104" y2="120" stroke="#334155" stroke-width="1" />
            <text x="24" y="160" font-family="monospace" font-size="12" fill="#818CF8">txn_stp_5411_refund</text>
            <text x="240" y="160" font-size="13" fill="#FFFFFF">alex_dev</text>
            <text x="440" y="160" font-size="13" fill="#CBD5E1">Stripe Card</text>
            <text x="600" y="160" font-size="14" font-weight="700" fill="#FFFFFF">$79.99</text>
            <rect x="740" y="145" width="95" height="24" rx="12" fill="#1E293B" />
            <text x="787" y="161" font-size="11" font-weight="700" fill="#94A3B8" text-anchor="middle">REFUNDED</text>
            <text x="1000" y="161" font-size="11" fill="#64748B" text-anchor="middle">Reconciled</text>
          </g>
        </g>
      `;
      return svgWrapper(body, '19_FinanceDashboard.svg');
    }
  },

  // 20. ModeratorQueue
  {
    filename: '20_ModeratorQueue.svg',
    title: 'Content Moderation & Flagged Queue',
    render: () => {
      let body = svgNavbar('Explore', 'MODERATOR', 'Mark Vance');
      body += `
        <g transform="translate(48, 90)">
          <text x="0" y="24" font-size="24" font-weight="800" fill="#FFFFFF">Content &amp; Forum Moderation Queue</text>
          <text x="0" y="48" font-size="13" fill="#94A3B8">Review reported forum posts, flagged doubt tickets, and enforce community standards</text>

          <!-- Queue List -->
          <g transform="translate(0, 80)">
            ${svgCard(0, 0, 1104, 110)}
            <rect x="20" y="20" width="85" height="24" rx="12" fill="#7F1D1D" />
            <text x="62" y="36" font-size="11" font-weight="700" fill="#FCA5A5" text-anchor="middle">SPAM REPORT</text>
            <text x="120" y="37" font-size="15" font-weight="700" fill="#FFFFFF">Promotional Telegram link posted in CS101 General Forum</text>
            <text x="120" y="60" font-size="12" fill="#94A3B8">Reported by 3 students • Target: Post #921 by user &apos;crypto_bot_1&apos;</text>
            <text x="120" y="85" font-size="12" fill="#EF4444">Offense: Commercial solicitation / malicious link</text>
            <rect x="850" y="38" width="110" height="34" rx="6" fill="#1E293B" stroke="#334155" />
            <text x="905" y="60" font-size="12" fill="#CBD5E1" text-anchor="middle">Dismiss</text>
            <rect x="975" y="38" width="110" height="34" rx="6" fill="#EF4444" />
            <text x="1030" y="60" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle">Delete &amp; Ban</text>
          </g>
        </g>
      `;
      return svgWrapper(body, '20_ModeratorQueue.svg');
    }
  },

  // 21. AdminDashboard
  {
    filename: '21_AdminDashboard.svg',
    title: 'Super Admin Overview & Telemetry',
    render: () => {
      let body = svgNavbar('Explore', 'SUPER_ADMIN', 'Super Admin');
      body += `
        <g transform="translate(48, 90)">
          <text x="0" y="24" font-size="24" font-weight="800" fill="#FFFFFF">Super Admin Telemetry Center</text>
          <text x="0" y="48" font-size="13" fill="#94A3B8">Platform health, active sessions, RBAC controls, and global system switches</text>

          <!-- Top Health Metric Cards -->
          <g transform="translate(0, 70)">
            ${svgCard(0, 0, 255, 90)}
            <text x="24" y="32" font-size="12" font-weight="600" fill="#94A3B8">System Health</text>
            <text x="24" y="65" font-size="24" font-weight="800" fill="#22C55E">100% OPERATIONAL</text>

            ${svgCard(283, 0, 255, 90)}
            <text x="307" y="32" font-size="12" font-weight="600" fill="#94A3B8">Registered Users</text>
            <text x="307" y="65" font-size="26" font-weight="800" fill="#FFFFFF">12,504</text>

            ${svgCard(566, 0, 255, 90)}
            <text x="590" y="32" font-size="12" font-weight="600" fill="#94A3B8">Total Revenue</text>
            <text x="590" y="65" font-size="26" font-weight="800" fill="#818CF8">$342,910</text>

            ${svgCard(849, 0, 255, 90)}
            <text x="873" y="32" font-size="12" font-weight="600" fill="#94A3B8">Active Maintenance</text>
            <text x="873" y="65" font-size="24" font-weight="800" fill="#94A3B8">INACTIVE</text>
          </g>

          <!-- Quick Navigation Cards to Admin Tools -->
          <text x="0" y="195" font-size="18" font-weight="700" fill="#FFFFFF">Platform Administration Modules</text>

          <g transform="translate(0, 215)">
            ${svgCard(0, 0, 255, 140)}
            <text x="24" y="40" font-size="16" font-weight="700" fill="#FFFFFF">User Management</text>
            <text x="24" y="65" font-size="12" fill="#94A3B8">Modify user roles, activate or suspend accounts, reset MFA.</text>
            <text x="24" y="110" font-size="12" font-weight="600" fill="#818CF8">Manage Users →</text>

            ${svgCard(283, 0, 255, 140)}
            <text x="307" y="40" font-size="16" font-weight="700" fill="#FFFFFF">Security Audit Logs</text>
            <text x="307" y="65" font-size="12" fill="#94A3B8">Inspect tamper-evident audit trails with client IPs and actions.</text>
            <text x="307" y="110" font-size="12" font-weight="600" fill="#818CF8">View Audit Trail →</text>

            ${svgCard(566, 0, 255, 140)}
            <text x="590" y="40" font-size="16" font-weight="700" fill="#FFFFFF">Maintenance Mode</text>
            <text x="590" y="65" font-size="12" fill="#94A3B8">Broadcast alerts, schedule outages, configure bypass tokens.</text>
            <text x="590" y="110" font-size="12" font-weight="600" fill="#818CF8">Configure Outage →</text>

            ${svgCard(849, 0, 255, 140)}
            <text x="873" y="40" font-size="16" font-weight="700" fill="#FFFFFF">Webhook Simulator</text>
            <text x="873" y="65" font-size="12" fill="#94A3B8">Test payment capture events, replay payloads, inspect headers.</text>
            <text x="873" y="110" font-size="12" font-weight="600" fill="#818CF8">Fire Simulator →</text>
          </g>
        </g>
      `;
      return svgWrapper(body, '21_AdminDashboard.svg');
    }
  },

  // 22. AdminUserManagement
  {
    filename: '22_AdminUserManagement.svg',
    title: 'Admin User & RBAC Management',
    render: () => {
      let body = svgNavbar('Explore', 'SUPER_ADMIN', 'Super Admin');
      body += `
        <g transform="translate(48, 90)">
          <text x="0" y="24" font-size="24" font-weight="800" fill="#FFFFFF">User Management &amp; Role Assignments</text>
          <text x="0" y="48" font-size="13" fill="#94A3B8">Control 6 distinct roles: STUDENT, MENTOR, CONTENT_MANAGER, FINANCE_SUPPORT, MODERATOR, SUPER_ADMIN</text>

          <g transform="translate(0, 80)">
            ${svgCard(0, 0, 1104, 340)}
            <rect x="0" y="0" width="1104" height="45" rx="12" fill="#0F172A" />
            <text x="24" y="28" font-size="12" font-weight="600" fill="#94A3B8">USER NAME / EMAIL</text>
            <text x="320" y="28" font-size="12" font-weight="600" fill="#94A3B8">PHONE</text>
            <text x="480" y="28" font-size="12" font-weight="600" fill="#94A3B8">ASSIGNED ROLE</text>
            <text x="680" y="28" font-size="12" font-weight="600" fill="#94A3B8">STATUS</text>
            <text x="840" y="28" font-size="12" font-weight="600" fill="#94A3B8">ACTIONS</text>

            <!-- Row 1 -->
            <line x1="0" y1="45" x2="1104" y2="45" stroke="#334155" stroke-width="1" />
            <text x="24" y="85" font-size="13" font-weight="700" fill="#FFFFFF">John Doe <tspan font-weight="400" fill="#94A3B8">(student@lms.local)</tspan></text>
            <text x="320" y="85" font-size="13" fill="#CBD5E1">+10000000002</text>
            <rect x="480" y="70" width="90" height="24" rx="12" fill="#1E1B4B" />
            <text x="525" y="86" font-size="11" font-weight="700" fill="#818CF8" text-anchor="middle">STUDENT</text>
            <text x="680" y="85" font-size="13" font-weight="600" fill="#22C55E">ACTIVE</text>
            <rect x="840" y="68" width="100" height="28" rx="6" fill="#1E293B" stroke="#334155" />
            <text x="890" y="86" font-size="11" fill="#E2E8F0" text-anchor="middle">Change Role</text>

            <!-- Row 2 -->
            <line x1="0" y1="120" x2="1104" y2="120" stroke="#334155" stroke-width="1" />
            <text x="24" y="160" font-size="13" font-weight="700" fill="#FFFFFF">Prof. Alan Turing <tspan font-weight="400" fill="#94A3B8">(mentor@lms.local)</tspan></text>
            <text x="320" y="160" font-size="13" fill="#CBD5E1">+10000000003</text>
            <rect x="480" y="145" width="90" height="24" rx="12" fill="#064E3B" />
            <text x="525" y="161" font-size="11" font-weight="700" fill="#34D399" text-anchor="middle">MENTOR</text>
            <text x="680" y="160" font-size="13" font-weight="600" fill="#22C55E">ACTIVE</text>
            <rect x="840" y="143" width="100" height="28" rx="6" fill="#1E293B" stroke="#334155" />
            <text x="890" y="161" font-size="11" fill="#E2E8F0" text-anchor="middle">Change Role</text>
          </g>
        </g>
      `;
      return svgWrapper(body, '22_AdminUserManagement.svg');
    }
  },

  // 23. AdminAuditLogs
  {
    filename: '23_AdminAuditLogs.svg',
    title: 'Security Audit & Compliance Logs',
    render: () => {
      let body = svgNavbar('Explore', 'SUPER_ADMIN', 'Super Admin');
      body += `
        <g transform="translate(48, 90)">
          <text x="0" y="24" font-size="24" font-weight="800" fill="#FFFFFF">Security Audit Trail</text>
          <text x="0" y="48" font-size="13" fill="#94A3B8">Append-only log of critical system operations, auth challenges, and data modifications</text>

          <g transform="translate(0, 80)">
            ${svgCard(0, 0, 1104, 340)}
            <rect x="0" y="0" width="1104" height="45" rx="12" fill="#0F172A" />
            <text x="24" y="28" font-size="12" font-weight="600" fill="#94A3B8">TIMESTAMP</text>
            <text x="180" y="28" font-size="12" font-weight="600" fill="#94A3B8">ACTOR</text>
            <text x="340" y="28" font-size="12" font-weight="600" fill="#94A3B8">ACTION</text>
            <text x="560" y="28" font-size="12" font-weight="600" fill="#94A3B8">RESOURCE / TARGET</text>
            <text x="850" y="28" font-size="12" font-weight="600" fill="#94A3B8">IP ADDRESS</text>

            <!-- Row 1 -->
            <line x1="0" y1="45" x2="1104" y2="45" stroke="#334155" stroke-width="1" />
            <text x="24" y="85" font-family="monospace" font-size="12" fill="#94A3B8">2026-10-20 18:32:01</text>
            <text x="180" y="85" font-size="13" font-weight="600" fill="#FFFFFF">john_student</text>
            <text x="340" y="85" font-size="13" fill="#38BDF8">STUDENT_PROGRESS_UPDATE</text>
            <text x="560" y="85" font-size="13" fill="#CBD5E1">Lesson: Asymptotic Analysis</text>
            <text x="850" y="85" font-family="monospace" font-size="12" fill="#64748B">192.168.1.104</text>

            <!-- Row 2 -->
            <line x1="0" y1="120" x2="1104" y2="120" stroke="#334155" stroke-width="1" />
            <text x="24" y="160" font-family="monospace" font-size="12" fill="#94A3B8">2026-10-20 18:25:40</text>
            <text x="180" y="160" font-size="13" font-weight="600" fill="#FFFFFF">admin</text>
            <text x="340" y="160" font-size="13" fill="#FBBF24">MAINTENANCE_TOGGLE</text>
            <text x="560" y="160" font-size="13" fill="#CBD5E1">Global System: Active=false</text>
            <text x="850" y="160" font-family="monospace" font-size="12" fill="#64748B">127.0.0.1</text>
          </g>
        </g>
      `;
      return svgWrapper(body, '23_AdminAuditLogs.svg');
    }
  },

  // 24. AdminMaintenance
  {
    filename: '24_AdminMaintenance.svg',
    title: 'Maintenance Mode & Kill-Switch Console',
    render: () => {
      let body = svgNavbar('Explore', 'SUPER_ADMIN', 'Super Admin');
      body += `
        <g transform="translate(48, 90)">
          <text x="0" y="24" font-size="24" font-weight="800" fill="#FFFFFF">Maintenance Mode &amp; Global Broadcast</text>
          <text x="0" y="48" font-size="13" fill="#94A3B8">Safely halt user writes during database upgrades while allowing staff/admin access</text>

          <g transform="translate(0, 80)">
            ${svgCard(0, 0, 700, 420)}
            <text x="30" y="40" font-size="18" font-weight="700" fill="#FFFFFF">Maintenance Controls</text>

            <!-- Toggle Switch Mock -->
            <g transform="translate(30, 70)">
              <rect x="0" y="0" width="60" height="32" rx="16" fill="#334155" />
              <circle cx="16" cy="16" r="12" fill="#FFFFFF" />
              <text x="80" y="21" font-size="14" font-weight="600" fill="#FFFFFF">Maintenance Mode is Currently: <tspan fill="#22C55E">DISABLED (ONLINE)</tspan></text>
            </g>

            <g transform="translate(30, 130)">
              <text x="0" y="20" font-size="12" font-weight="600" fill="#CBD5E1">Broadcast Banner Notice (English)</text>
              <rect x="0" y="30" width="640" height="42" rx="8" fill="#0F172A" stroke="#334155" />
              <text x="15" y="56" font-size="13" fill="#FFFFFF">Scheduled maintenance tonight from 2:00 AM to 3:00 AM UTC.</text>

              <text x="0" y="105" font-size="12" font-weight="600" fill="#CBD5E1">Broadcast Banner Notice (हिन्दी Hindi)</text>
              <rect x="0" y="115" width="640" height="42" rx="8" fill="#0F172A" stroke="#334155" />
              <text x="15" y="141" font-size="13" fill="#FFFFFF">आज रात 2:00 बजे से 3:00 बजे तक निर्धारित रखरखाव।</text>

              <text x="0" y="195" font-size="12" font-weight="600" fill="#CBD5E1">Emergency Bypass Secret Key</text>
              <rect x="0" y="205" width="640" height="42" rx="8" fill="#0F172A" stroke="#334155" />
              <text x="15" y="231" font-family="monospace" font-size="13" fill="#FBBF24">lms-emergency-override-token</text>
            </g>
          </g>
        </g>
      `;
      return svgWrapper(body, '24_AdminMaintenance.svg');
    }
  },

  // 25. AdminWebhookSimulator
  {
    filename: '25_AdminWebhookSimulator.svg',
    title: 'Payment Gateway Webhook Simulator',
    render: () => {
      let body = svgNavbar('Explore', 'SUPER_ADMIN', 'Super Admin');
      body += `
        <g transform="translate(48, 80)">
          <text x="0" y="24" font-size="24" font-weight="800" fill="#FFFFFF">Payment Webhook Simulator &amp; Inspector</text>
          <text x="0" y="48" font-size="13" fill="#94A3B8">Simulate real-time Razorpay and Stripe payment lifecycle webhooks with HMAC validation</text>

          <g transform="translate(0, 70)">
            <!-- Left: Config & Dispatch -->
            ${svgCard(0, 0, 520, 520)}
            <text x="24" y="35" font-size="16" font-weight="700" fill="#FFFFFF">Webhook Dispatcher</text>

            <g transform="translate(24, 60)">
              <text x="0" y="15" font-size="12" font-weight="600" fill="#CBD5E1">Event Type</text>
              <rect x="0" y="25" width="472" height="40" rx="8" fill="#0F172A" stroke="#4F46E5" />
              <text x="15" y="50" font-size="13" font-family="monospace" fill="#FFFFFF">payment.captured</text>

              <text x="0" y="95" font-size="12" font-weight="600" fill="#CBD5E1">Target Order ID</text>
              <rect x="0" y="105" width="472" height="40" rx="8" fill="#0F172A" stroke="#334155" />
              <text x="15" y="130" font-size="13" font-family="monospace" fill="#FFFFFF">order_cs101_seed</text>

              <text x="0" y="175" font-size="12" font-weight="600" fill="#CBD5E1">Simulated Payload (JSON)</text>
              <rect x="0" y="185" width="472" height="150" rx="8" fill="#0B132B" stroke="#334155" />
              <text x="15" y="210" font-family="monospace" font-size="11" fill="#38BDF8">{"event": "payment.captured",</text>
              <text x="15" y="230" font-family="monospace" font-size="11" fill="#38BDF8"> "payload": { "payment": { "entity": {</text>
              <text x="15" y="250" font-family="monospace" font-size="11" fill="#38BDF8">   "id": "pay_test_99812",</text>
              <text x="15" y="270" font-family="monospace" font-size="11" fill="#38BDF8">   "amount": 4999, "currency": "USD" } } } }</text>

              <rect x="0" y="360" width="472" height="44" rx="10" fill="url(#primaryGrad)" />
              <text x="236" y="387" font-size="14" font-weight="700" fill="#FFFFFF" text-anchor="middle">⚡ Simulate Webhook Event</text>
            </g>

            <!-- Right: Response Console -->
            ${svgCard(550, 0, 554, 520)}
            <text x="574" y="35" font-size="16" font-weight="700" fill="#FFFFFF">Server Response Console</text>
            <rect x="574" y="60" width="506" height="420" rx="8" fill="#000000" stroke="#1E293B" />
            <text x="590" y="90" font-family="monospace" font-size="12" fill="#22C55E">HTTP/1.1 200 OK</text>
            <text x="590" y="115" font-family="monospace" font-size="11" fill="#94A3B8">X-HMAC-Validation: SUCCESS</text>
            <text x="590" y="140" font-family="monospace" font-size="11" fill="#FFFFFF">{</text>
            <text x="605" y="160" font-family="monospace" font-size="11" fill="#A5B4FC">  "status": "success",</text>
            <text x="605" y="180" font-family="monospace" font-size="11" fill="#A5B4FC">  "message": "Order activated &amp; student enrolled",</text>
            <text x="605" y="200" font-family="monospace" font-size="11" fill="#A5B4FC">  "orderId": "order_cs101_seed",</text>
            <text x="605" y="220" font-family="monospace" font-size="11" fill="#A5B4FC">  "activatedAt": "2026-10-20T18:35:10Z"</text>
            <text x="590" y="240" font-family="monospace" font-size="11" fill="#FFFFFF">}</text>
          </g>
        </g>
      `;
      return svgWrapper(body, '25_AdminWebhookSimulator.svg');
    }
  },

  // 26. Settings
  {
    filename: '26_Settings.svg',
    title: 'Preferences & Language Settings',
    render: () => {
      let body = svgNavbar('Help', 'STUDENT', 'John Doe');
      body += `
        <g transform="translate(48, 90)">
          <text x="0" y="24" font-size="24" font-weight="800" fill="#FFFFFF">User Preferences &amp; Settings</text>
          <text x="0" y="48" font-size="13" fill="#94A3B8">Customize language, dark mode, and notifications</text>

          <g transform="translate(0, 80)">
            ${svgCard(0, 0, 700, 460)}
            <text x="30" y="40" font-size="18" font-weight="700" fill="#FFFFFF">Appearance &amp; Accessibility</text>

            <!-- Theme Selector -->
            <g transform="translate(30, 70)">
              <text x="0" y="15" font-size="13" font-weight="600" fill="#CBD5E1">Color Theme</text>
              <rect x="0" y="25" width="200" height="50" rx="8" fill="#1E1B4B" stroke="#4F46E5" stroke-width="2" />
              <text x="100" y="55" font-size="13" font-weight="600" fill="#FFFFFF" text-anchor="middle">🌙 Dark Theme (Active)</text>

              <rect x="220" y="25" width="200" height="50" rx="8" fill="#0F172A" stroke="#334155" />
              <text x="320" y="55" font-size="13" fill="#94A3B8" text-anchor="middle">☀️ Light Theme</text>
            </g>

            <!-- Language Toggle -->
            <g transform="translate(30, 180)">
              <text x="0" y="15" font-size="13" font-weight="600" fill="#CBD5E1">Interface Language</text>
              <rect x="0" y="25" width="200" height="50" rx="8" fill="#1E1B4B" stroke="#4F46E5" stroke-width="2" />
              <text x="100" y="55" font-size="13" font-weight="600" fill="#FFFFFF" text-anchor="middle">English (US)</text>

              <rect x="220" y="25" width="200" height="50" rx="8" fill="#0F172A" stroke="#334155" />
              <text x="320" y="55" font-size="13" fill="#94A3B8" text-anchor="middle">हिन्दी (Hindi)</text>
            </g>

            <!-- Notifications -->
            <g transform="translate(30, 290)">
              <text x="0" y="15" font-size="13" font-weight="600" fill="#CBD5E1">Notification Preferences</text>
              <text x="0" y="45" font-size="12" fill="#E2E8F0">☑ Email notifications for doubt answers</text>
              <text x="0" y="75" font-size="12" fill="#E2E8F0">☑ SMS reminders for upcoming live classes</text>
              <text x="0" y="105" font-size="12" fill="#E2E8F0">☑ Certificate issuance alerts</text>
            </g>
          </g>
        </g>
      `;
      return svgWrapper(body, '26_Settings.svg');
    }
  },

  // 27. HelpCenter
  {
    filename: '27_HelpCenter.svg',
    title: 'Help Center & Bilingual FAQs',
    render: () => {
      let body = svgNavbar('Help', 'STUDENT', 'John Doe');
      body += `
        <g transform="translate(48, 90)">
          <text x="0" y="24" font-size="24" font-weight="800" fill="#FFFFFF">AuraLMS Help Center &amp; Support</text>
          <text x="0" y="48" font-size="13" fill="#94A3B8">Frequently asked questions, live assistance, and support ticket creation</text>

          <g transform="translate(0, 80)">
            <!-- Left: FAQ Accordion -->
            ${svgCard(0, 0, 680, 480)}
            <text x="30" y="40" font-size="18" font-weight="700" fill="#FFFFFF">Frequently Asked Questions (Bilingual)</text>

            <g transform="translate(30, 65)">
              <rect x="0" y="0" width="620" height="70" rx="8" fill="#0F172A" stroke="#4F46E5" />
              <text x="20" y="30" font-size="13" font-weight="700" fill="#FFFFFF">How do I verify and download my course certificate?</text>
              <text x="20" y="52" font-size="11" fill="#94A3B8">Visit /verify or your student profile. Pass all module quizzes with &gt;=80%.</text>

              <rect x="0" y="85" width="620" height="70" rx="8" fill="#0F172A" stroke="#334155" />
              <text x="20" y="115" font-size="13" font-weight="700" fill="#FFFFFF">पाठ्यक्रम प्रमाणपत्र कैसे डाउनलोड करें? (Hindi FAQ)</text>
              <text x="20" y="137" font-size="11" fill="#94A3B8">80% या उससे अधिक अंक प्राप्त करने के बाद प्रमाणपत्र स्वतः जारी हो जाता है।</text>

              <rect x="0" y="170" width="620" height="70" rx="8" fill="#0F172A" stroke="#334155" />
              <text x="20" y="200" font-size="13" font-weight="700" fill="#FFFFFF">What is the doubt clearing SLA?</text>
              <text x="20" y="222" font-size="11" fill="#94A3B8">Mentors reply within an average of 15 minutes during active business hours.</text>
            </g>

            <!-- Right: Open Support Ticket Form -->
            ${svgCard(710, 0, 394, 480)}
            <text x="734" y="40" font-size="18" font-weight="700" fill="#FFFFFF">Contact Support Desk</text>

            <g transform="translate(734, 65)">
              <text x="0" y="15" font-size="12" font-weight="600" fill="#CBD5E1">Issue Category</text>
              <rect x="0" y="25" width="346" height="38" rx="8" fill="#0F172A" stroke="#334155" />
              <text x="15" y="49" font-size="12" fill="#FFFFFF">Billing &amp; Payment</text>

              <text x="0" y="90" font-size="12" font-weight="600" fill="#CBD5E1">Subject</text>
              <rect x="0" y="100" width="346" height="38" rx="8" fill="#0F172A" stroke="#334155" />
              <text x="15" y="124" font-size="12" fill="#FFFFFF">Question about GST receipt</text>

              <text x="0" y="165" font-size="12" font-weight="600" fill="#CBD5E1">Message Description</text>
              <rect x="0" y="175" width="346" height="90" rx="8" fill="#0F172A" stroke="#334155" />
              <text x="15" y="200" font-size="12" fill="#94A3B8">Please email the tax breakdown...</text>

              <rect x="0" y="290" width="346" height="42" rx="10" fill="url(#primaryGrad)" />
              <text x="173" y="316" font-size="13" font-weight="700" fill="#FFFFFF" text-anchor="middle">Submit Support Ticket</text>
            </g>
          </g>
        </g>
      `;
      return svgWrapper(body, '27_HelpCenter.svg');
    }
  }
];

// Execute generation
console.log(`Generating ${pages.length} high-fidelity SVG page view mockups...`);

pages.forEach((p, idx) => {
  const filePath = path.join(outputDir, p.filename);
  const svgContent = p.render();
  fs.writeFileSync(filePath, svgContent, 'utf-8');
  console.log(`[${idx + 1}/${pages.length}] Generated: ${p.filename}`);
});

console.log('All page view SVGs generated successfully in docs/PAGE_VIEWS/!');
