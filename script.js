const DATA = {
  programs: [
    {
      id: "sde-a",
      faculty: "sde",
      title_en: "BEng Sustainable Energy",
      title_fr: "Licence Ingénierie énergétique durable",
      level: "Undergraduate",
      duration: "3 years",
    },
    {
      id: "sde-b",
      faculty: "sde",
      title_en: "MSc Environmental Engineering",
      title_fr: "Master Ingénierie environnementale",
      level: "Postgraduate",
      duration: "2 years",
    },
    {
      id: "bm-a",
      faculty: "bm",
      title_en: "BSc Business Administration",
      title_fr: "Licence Administration des affaires",
      level: "Undergraduate",
      duration: "3 years",
    },
    {
      id: "bm-b",
      faculty: "bm",
      title_en: "MBA",
      title_fr: "MBA",
      level: "Postgraduate",
      duration: "18 months",
    },
    {
      id: "ict-a",
      faculty: "ict",
      title_en: "BSc (Hons) Applied Computer Science",
      title_fr: "Licence (Hons) Informatique appliquée",
      level: "Undergraduate",
      duration: "3 years",
    },
    {
      id: "ict-b",
      faculty: "ict",
      title_en: "MSc Data Science",
      title_fr: "Master Science des données",
      level: "Postgraduate",
      duration: "2 years",
    },
  ],
  courses: [
    {
      programId: "ict-a",
      title_en: "Applied Computer Science",
      title_fr: "Informatique appliquée",
      overview_en:
        "Equips graduates with practical IT skills and industry exposure.",
      overview_fr:
        "Dote les diplômés de compétences TI pratiques et d’une exposition industrielle.",
    },
    {
      programId: "sde-a",
      title_en: "Sustainable Energy",
      title_fr: "Énergie durable",
      overview_en: "Focus on renewable systems and energy efficiency.",
      overview_fr:
        "Accent sur les systèmes renouvelables et l’efficacité énergétique.",
    },
    {
      programId: "bm-a",
      title_en: "Business Administration",
      title_fr: "Administration des affaires",
      overview_en: "Foundations of management, finance, and marketing.",
      overview_fr: "Fondements de la gestion, de la finance et du marketing.",
    },
  ],
  events: [
    {
      title_en: "Open Day - Rose Hill",
      title_fr: "Journée portes ouvertes - Rose Hill",
      date: "2026-02-12",
      desc_en: "Meet faculty, tour campus, and attend info sessions.",
      desc_fr:
        "Rencontrez les enseignants, visitez le campus et assistez aux séances d’informations.",
    },
    {
      title_en: "Open Day - Beau Plan",
      title_fr: "Journée portes ouvertes - Beau Plan",
      date: "2026-02-16",
      desc_en: "Meet faculty, tour campus, and attend info sessions.",
      desc_fr:
        "Rencontrez les enseignants, visitez le campus et assistez aux séances d’informations.",
    },
    {
      title_en: "Tech Career Fair",
      title_fr: "Salon des carrières tech",
      date: "2026-03-05",
      desc_en: "Connect with industry partners and alumni.",
      desc_fr: "Rencontrez des partenaires industriels et des anciens.",
    },
    {
      title_en: "Badminton Tournament - Beau Plan Campus",
      title_fr: "Tounoi de Badminton - Campus de Beau Plan",
      date: "2026-04-05",
      desc_en: "Join all the students from the different campus.",
      desc_fr: "Rejoignez tous les étudiants des différents campus.",
    },
    {
      title_en: "Welcome Party",
      title_fr: "fête de bienvenue",
      date: "2026-05-02",
      desc_en: "Connect with all the students and alumni.",
      desc_fr: "Connectez-vous avec tous les étudiants et anciens élèves.",
    },
  ],
};

// --- Language toggle ---
function setLanguage(lang) {
  const supported = ["en", "fr"];
  if (!supported.includes(lang)) return;
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-en]").forEach((el) => {
    const text = el.getAttribute(`data-${lang}`);
    if (text !== null) el.textContent = text;
  });
  document.querySelectorAll("option").forEach((opt) => {
    const text = opt.getAttribute(`data-${lang}`);
    if (text) opt.textContent = text;
  });
  localStorage.setItem("udm_lang", lang);
  document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
    const active = btn.dataset.langBtn === lang;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-pressed", active ? "true" : "false");
  });
}
(function initLang() {
  const saved = localStorage.getItem("udm_lang") || "en";
  setLanguage(saved);
  document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
    btn.addEventListener("click", () => setLanguage(btn.dataset.langBtn));
  });
})();

// --- Router (hash-based) ---
const routes = {
  "/": "page-home",
  "/programs": "page-programs",
  "/courses": "page-courses",
  "/apply": "page-apply",
  "/events": "page-events",
};
function renderRoute() {
  const hash = location.hash.replace("#", "") || "/";
  const [path, query] = hash.split("?");
  const pageId = routes[path] || routes["/"];
  document
    .querySelectorAll("section.page")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");

  // Nav highlight
  document.querySelectorAll("nav.primary a[data-route]").forEach((a) => {
    const active = a.dataset.route === path;
    a.classList.toggle("active", active);
    a.setAttribute("aria-current", active ? "page" : "false");
  });

  // Focus main for accessibility
  document.getElementById("app").focus();

  // Page-specific renders
  if (pageId === "page-programs") {
    renderPrograms(query);
  } else if (pageId === "page-courses") {
    renderCourses();
  } else if (pageId === "page-events") {
    renderEvents();
  } else if (pageId === "page-apply") {
    // ensure program options reflect selected faculty
    updateProgramOptions(document.getElementById("faculty").value);
  }
}
window.addEventListener("hashchange", renderRoute);
window.addEventListener("DOMContentLoaded", renderRoute);

// --- Programs filtering and render ---
function renderPrograms(query) {
  const list = document.getElementById("program-list");
  const filterParam = (query || "").toLowerCase();
  const facultyFilter =
    ["sde", "bm", "ict"].find((f) => filterParam.includes(f)) || "all";

  const items = DATA.programs.filter((p) =>
    facultyFilter === "all" ? true : p.faculty === facultyFilter
  );

  list.innerHTML = items
    .map((p) => {
      const title =
        document.documentElement.lang === "fr" ? p.title_fr : p.title_en;
      return `
          <article class="card" aria-labelledby="program-${p.id}">
            <h3 id="program-${p.id}">${title}</h3>
            <p class="muted"><span class="badge">${p.level}</span> • ${
        p.duration
      }</p>
            <div style="display:flex; gap:8px; margin-top:8px;">
              <a class="btn" href="#/apply" data-en="Apply" data-fr="Postuler">${
                document.documentElement.lang === "fr" ? "Postuler" : "Apply"
              }</a>
              <a class="btn secondary" href="#/courses" data-en="View courses" data-fr="Voir les cours">${
                document.documentElement.lang === "fr"
                  ? "Voir les cours"
                  : "View courses"
              }</a>
            </div>
          </article>
        `;
    })
    .join("");

  // Filter buttons
  document.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.onclick = () => {
      const f = btn.dataset.filter;
      const q = f === "all" ? "" : `?${f}`;
      location.hash = "#/programs" + q;
    };
  });
}

// --- Courses render ---
function renderCourses() {
  const list = document.getElementById("course-list");
  list.innerHTML = DATA.courses
    .map((c) => {
      const title =
        document.documentElement.lang === "fr" ? c.title_fr : c.title_en;
      const overview =
        document.documentElement.lang === "fr" ? c.overview_fr : c.overview_en;
      const program = DATA.programs.find((p) => p.id === c.programId);
      const facultyLabel = { sde: "SDE", bm: "BM", ict: "ICT" }[
        program.faculty
      ];
      return `
          <article class="card" aria-labelledby="course-${c.programId}">
            <h3 id="course-${c.programId}">${title}</h3>
            <p class="muted">${overview}</p>
            <p><span class="badge">${facultyLabel}</span> • ${
        program.level
      } • ${program.duration}</p>
            <a class="btn" href="#/apply">${
              document.documentElement.lang === "fr" ? "Postuler" : "Apply"
            }</a>
          </article>
        `;
    })
    .join("");
}

// --- Events render ---
function renderEvents() {
  const list = document.getElementById("events-list");
  list.innerHTML = DATA.events
    .map((ev) => {
      const title =
        document.documentElement.lang === "fr" ? ev.title_fr : ev.title_en;
      const desc =
        document.documentElement.lang === "fr" ? ev.desc_fr : ev.desc_en;
      const dateObj = new Date(ev.date + "T00:00:00");
      const dateStr = dateObj.toLocaleDateString(
        document.documentElement.lang === "fr" ? "fr-MU" : "en-MU",
        { year: "numeric", month: "long", day: "numeric" }
      );
      return `
          <article class="card" aria-labelledby="event-${ev.date}">
            <h3 id="event-${ev.date}">${title}</h3>
            <p class="muted">${dateStr}</p>
            <p>${desc}</p>
          </article>
        `;
    })
    .join("");
}

// --- Apply form logic ---
function updateProgramOptions(faculty) {
  const programSelect = document.getElementById("program");
  const lang = document.documentElement.lang;
  const options = DATA.programs
    .filter((p) => (faculty ? p.faculty === faculty : true))
    .map((p) => ({
      value: p.id,
      label: lang === "fr" ? p.title_fr : p.title_en,
    }));

  programSelect.innerHTML =
    `<option value="">${
      lang === "fr" ? "Sélectionner le programme" : "Select program"
    }</option>` +
    options
      .map((o) => `<option value="${o.value}">${o.label}</option>`)
      .join("");
}
document.getElementById("faculty").addEventListener("change", (e) => {
  updateProgramOptions(e.target.value);
});

document.getElementById("apply-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const status = document.getElementById("apply-status");
  status.className = "status";
  status.textContent = "";

  const form = e.target;
  const data = {
    firstName: form.firstName.value.trim(),
    lastName: form.lastName.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    faculty: form.faculty.value,
    program: form.program.value,
    statement: form.statement.value.trim(),
    intake: form.intake.value,
  };

  // Basic validation
  const errors = [];
  if (!data.firstName) errors.push("First name is required.");
  if (!data.lastName) errors.push("Last name is required.");
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.push("Valid email is required.");
  if (!data.faculty) errors.push("Faculty is required.");
  if (!data.program) errors.push("Program is required.");
  if (!data.statement || data.statement.length < 50)
    errors.push("Personal statement must be at least 50 characters.");
  if (!data.intake) errors.push("Preferred intake is required.");

  if (errors.length) {
    status.classList.add("error");
    status.textContent = errors.join(" ");
    return;
  }

  // Build FormData for files
  const fd = new FormData();
  Object.entries(data).forEach(([k, v]) => fd.append(k, v));
  const files = form.docs.files || [];
  for (const f of files) fd.append("docs", f);

  try {
    // Replace with your backend endpoint:
    // const res = await fetch('/api/apply', { method: 'POST', body: fd });
    // if (!res.ok) throw new Error('Network error');

    // Demo: store in localStorage
    const applications = JSON.parse(localStorage.getItem("udm_apps") || "[]");
    applications.push({ ...data, submittedAt: new Date().toISOString() });
    localStorage.setItem("udm_apps", JSON.stringify(applications));

    status.classList.add("success");
    status.textContent =
      document.documentElement.lang === "fr"
        ? "Merci ! Votre candidature a été envoyée."
        : "Thank you! Your application has been submitted.";
    form.reset();
    updateProgramOptions(document.getElementById("faculty").value);
  } catch (err) {
    status.classList.add("error");
    status.textContent =
      document.documentElement.lang === "fr"
        ? "Une erreur est survenue. Réessayez."
        : "Something went wrong. Please try again.";
  }
});

// --- Newsletter form ---
document.getElementById("newsletter").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("newsletter-email").value.trim();
  const status = document.getElementById("newsletter-status");
  status.className = "status";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    status.classList.add("error");
    status.textContent =
      document.documentElement.lang === "fr"
        ? "Email invalide."
        : "Invalid email.";
    return;
  }
  try {
    // Replace with your backend endpoint:
    // await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });

    const subs = JSON.parse(localStorage.getItem("udm_newsletter") || "[]");
    subs.push({ email, subscribedAt: new Date().toISOString() });
    localStorage.setItem("udm_newsletter", JSON.stringify(subs));

    status.classList.add("success");
    status.textContent =
      document.documentElement.lang === "fr"
        ? "Merci ! Vous êtes abonné."
        : "Thank you! You are subscribed.";
    e.target.reset();
  } catch {
    status.classList.add("error");
    status.textContent =
      document.documentElement.lang === "fr"
        ? "Une erreur est survenue. Réessayez."
        : "Something went wrong. Please try again.";
  }
});

// --- Keep text in sync when language changes dynamically ---
const observer = new MutationObserver(() => {
  // When language changes, re-render lists that use computed strings
  const hash = location.hash.replace("#", "") || "/";
  if (hash.startsWith("/programs")) renderPrograms(hash.split("?")[1]);
  if (hash === "/courses") renderCourses();
});
observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["lang"],
});
