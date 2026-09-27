// ---------- Seed Data ----------
let opportunities = [
  {id:1, title:"Google Summer of Code 2026", category:"Internship", tags:["Python","Open Source","Git"], deadline:"2026-04-15", description:"Contribute to real open-source projects with a stipend, mentored by experienced devs.", link:"https://summerofcode.withgoogle.com/"},
  {id:2, title:"Smart India Hackathon 2026", category:"Hackathon", tags:["Problem Solving","Full Stack","Innovation"], deadline:"2026-08-01", description:"National-level hackathon solving real problem statements from ministries and industry.", link:"https://sih.gov.in/"},
  {id:3, title:"Microsoft Learn Student Ambassadors", category:"Certification", tags:["Cloud","Community","Azure"], deadline:"Rolling", description:"Build technical skills and community leadership experience with Microsoft's student program.", link:"https://mlsa.microsoft.com/"},
  {id:4, title:"AWS Educate", category:"Course", tags:["Cloud","AWS","Networking"], deadline:"Rolling", description:"Free cloud computing courses and credits for students getting started with AWS.", link:"https://aws.amazon.com/education/awseducate/"},
  {id:5, title:"HackerRank CodeSprint", category:"Competition", tags:["DSA","Java","Python"], deadline:"2026-11-10", description:"Timed coding competition testing data structures and algorithm skills.", link:"https://www.hackerrank.com/"},
  {id:6, title:"Flipkart GRiD", category:"Internship", tags:["React","Node.js","Problem Solving"], deadline:"2026-10-05", description:"Flipkart's flagship campus program for engineering roles and PPOs.", link:"https://unstop.com/"},
  {id:7, title:"Meta Front-End Developer Certificate", category:"Certification", tags:["React","JavaScript","CSS"], deadline:"Rolling", description:"Professional certificate covering modern front-end development with React.", link:"https://www.coursera.org/professional-certificates/meta-front-end-developer"},
  {id:8, title:"Devfolio Hackathons", category:"Hackathon", tags:["Web3","Full Stack","UI/UX"], deadline:"Rolling", description:"Rolling calendar of student and Web3 hackathons across India.", link:"https://devfolio.co/"},
  {id:9, title:"INSPIRE Scholarship (DST)", category:"Scholarship", tags:["Science","Research"], deadline:"2026-09-30", description:"Government of India scholarship supporting students pursuing science education.", link:"https://online-inspire.gov.in/"},
  {id:10, title:"National Merit Scholarship", category:"Scholarship", tags:["Academics"], deadline:"2026-12-01", description:"Merit-based scholarship for outstanding academic performance.", link:"https://scholarships.gov.in/"},
  {id:11, title:"freeCodeCamp Responsive Web Design", category:"Course", tags:["HTML","CSS","JavaScript"], deadline:"Rolling", description:"Free, self-paced certification covering web design fundamentals.", link:"https://www.freecodecamp.org/"},
  {id:12, title:"GDG DevFest Pune", category:"Workshop", tags:["Android","Cloud","ML"], deadline:"2026-11-20", description:"Community-run tech conference with hands-on sessions from Google Developer Groups.", link:"https://gdg.community.dev/"},
  {id:13, title:"Postman API Fundamentals", category:"Certification", tags:["API","Backend"], deadline:"Rolling", description:"Free certification on designing, testing, and documenting APIs.", link:"https://academy.postman.com/"},
  {id:14, title:"CodeChef Starters", category:"Competition", tags:["DSA","C++","Python"], deadline:"Weekly", description:"Weekly rated coding contest, great for consistent DSA practice.", link:"https://www.codechef.com/"},
  {id:15, title:"TCS CodeVita", category:"Competition", tags:["Java","Problem Solving"], deadline:"2026-10-20", description:"Global coding contest by TCS with direct hiring opportunities for top performers.", link:"https://www.tcscodevita.com/"},
  {id:16, title:"Internshala Web Dev Internship", category:"Internship", tags:["JavaScript","React","Node.js"], deadline:"2026-10-15", description:"Remote web development internships from startups, filtered by skill.", link:"https://internshala.com/"},
  {id:17, title:"Google Cloud Study Jam", category:"Workshop", tags:["Cloud","GCP"], deadline:"2026-10-25", description:"Guided hands-on labs to learn Google Cloud Platform basics for free.", link:"https://cloudonair.withgoogle.com/"}
];

const CATEGORIES = ["Internship","Hackathon","Scholarship","Certification","Competition","Workshop","Course"];

// ---------- Supabase ----------
const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

// ---------- State ----------
let profile = {
  name: "",
  education: "",
  location: "India",
  about: "",
  skills: [],
  interests: []
};
let bookmarks = [];
let currentUser = null;
let authMode = "login";

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", async () => {
  setupTabs();
  populateCategoryFilter();
  populateCategoryCheckboxes();
  setupAuthUI();
  setupProfileUI();

  await loadOpportunities();
  renderDiscover();
  renderDashboard();
  renderProfilePage();

  document.getElementById("searchInput").addEventListener("input", renderDiscover);
  document.getElementById("categoryFilter").addEventListener("change", renderDiscover);
  document.getElementById("sortFilter").addEventListener("change", renderDiscover);

  const { data: { session }, error } = await supabaseClient.auth.getSession();
  if (error) console.error("Session error:", error);
  await syncSession(session);

  supabaseClient.auth.onAuthStateChange((event, session) => {
    setTimeout(() => {
      syncSession(session, event).catch(err => console.error("Auth state error:", err));
    }, 0);
  });
});

async function syncSession(session, event = "INITIAL_SESSION") {
  currentUser = session?.user || null;

  if (!currentUser) {
    profile = { name: "", education: "", location: "India", about: "", skills: [], interests: [] };
    bookmarks = [];
    updateAuthUI();
    renderProfilePage();
    renderDashboard();
    renderDiscover();
    return;
  }

  await loadUserData();
  updateAuthUI();
  renderProfilePage();
  renderDashboard();
  renderDiscover();

  if (event === "SIGNED_IN") {
    showToast("Welcome to Scout!");
  }

  if (event === "PASSWORD_RECOVERY") {
    openResetModal();
  }
}

async function loadUserData() {
  const localProfile = JSON.parse(localStorage.getItem("scout_profile") || "null");
  const localBookmarks = JSON.parse(localStorage.getItem("scout_bookmarks") || "[]");

  const { data: profileData, error: profileError } = await supabaseClient
    .from("profiles")
    .select("full_name, education, location, about, skills, interests")
    .eq("id", currentUser.id)
    .maybeSingle();

  if (profileError) {
    console.error("Profile load error:", profileError);
    showToast("Could not load your profile.");
  }

  if (profileData) {
    profile = {
      name: profileData.full_name || "",
      education: profileData.education || "",
      location: profileData.location || "India",
      about: profileData.about || "",
      skills: Array.isArray(profileData.skills) ? profileData.skills : [],
      interests: Array.isArray(profileData.interests) ? profileData.interests : []
    };
  } else {
    profile = {
      name: localProfile?.name || currentUser.user_metadata?.full_name || "",
      education: localProfile?.education || "",
      location: localProfile?.location || "India",
      about: localProfile?.about || "",
      skills: Array.isArray(localProfile?.skills) ? localProfile.skills : [],
      interests: Array.isArray(localProfile?.interests) ? localProfile.interests : []
    };

    const { error } = await supabaseClient.from("profiles").insert({
      id: currentUser.id,
      full_name: profile.name,
      education: profile.education,
      location: profile.location,
      about: profile.about,
      skills: profile.skills,
      interests: profile.interests
    });

    if (error) console.error("Profile create error:", error);
  }

  const { data: bookmarkRows, error: bookmarkError } = await supabaseClient
    .from("bookmarks")
    .select("opportunity_id")
    .eq("user_id", currentUser.id);

  if (bookmarkError) {
    console.error("Bookmark load error:", bookmarkError);
    showToast("Could not load bookmarks.");
    bookmarks = [];
  } else {
    bookmarks = bookmarkRows.map(row => row.opportunity_id);
  }

  // Preserve bookmarks/profile from the old local-only version on first account login.
  if (!profileData && localBookmarks.length && !bookmarks.length) {
    for (const opportunityId of localBookmarks) {
      const { error } = await supabaseClient.from("bookmarks").upsert(
        { user_id: currentUser.id, opportunity_id: Number(opportunityId) },
        { onConflict: "user_id,opportunity_id" }
      );
      if (error) console.error("Bookmark migration error:", error);
    }
    bookmarks = [...new Set(localBookmarks.map(Number))];
  }

  localStorage.removeItem("scout_profile");
  localStorage.removeItem("scout_bookmarks");
}

function setupTabs() {
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      if ((tab === "profile" || tab === "dashboard") && !currentUser) {
        openLoginModal();
        return;
      }
      showTab(tab);
    });
  });
}

function showTab(tabId) {
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

  const matchingBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
  if (matchingBtn) matchingBtn.classList.add("active");

  const section = document.getElementById(tabId);
  if (section) section.classList.add("active");

  if (tabId === "dashboard") renderDashboard();
  if (tabId === "profile") renderProfilePage();
  if (tabId === "profileEdit") loadProfileForm();
}

function populateCategoryFilter() {
  const sel = document.getElementById("categoryFilter");
  CATEGORIES.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    sel.appendChild(opt);
  });
}

function populateCategoryCheckboxes() {
  const container = document.getElementById("categoryCheckboxes");
  CATEGORIES.forEach(cat => {
    const wrap = document.createElement("label");
    wrap.className = "checkbox-item";
    wrap.innerHTML = `<input type="checkbox" id="cat_${cat}" value="${cat}"> ${cat}`;
    container.appendChild(wrap);
  });
}

function setupProfileUI() {
  document.getElementById("profileForm").addEventListener("submit", saveProfile);
  document.getElementById("cancelProfileEdit").addEventListener("click", () => showTab("profile"));

  ["editProfileBtn", "editAboutBtn", "editSkillsBtn", "editInterestsBtn"].forEach(id => {
    document.getElementById(id).addEventListener("click", () => {
      if (!currentUser) {
        openLoginModal();
        return;
      }
      showTab("profileEdit");
    });
  });
}

function loadProfileForm() {
  document.getElementById("pName").value = profile.name || "";
  document.getElementById("pEducation").value = profile.education || "";
  document.getElementById("pLocation").value = profile.location || "India";
  document.getElementById("pAbout").value = profile.about || "";
  document.getElementById("pSkills").value = (profile.skills || []).join(", ");

  CATEGORIES.forEach(cat => {
    const cb = document.getElementById("cat_" + cat);
    if (cb) cb.checked = profile.interests.includes(cat);
  });
}

async function saveProfile(e) {
  e.preventDefault();
  if (!currentUser) {
    openLoginModal();
    return;
  }

  profile.name = document.getElementById("pName").value.trim();
  profile.education = document.getElementById("pEducation").value.trim();
  profile.location = document.getElementById("pLocation").value.trim() || "India";
  profile.about = document.getElementById("pAbout").value.trim();
  profile.skills = document.getElementById("pSkills").value
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);
  profile.interests = Array.from(
    document.querySelectorAll("#categoryCheckboxes input:checked")
  ).map(cb => cb.value);

  const { error } = await supabaseClient.from("profiles").upsert({
    id: currentUser.id,
    full_name: profile.name,
    education: profile.education,
    location: profile.location,
    about: profile.about,
    skills: profile.skills,
    interests: profile.interests,
    updated_at: new Date().toISOString()
  });

  if (error) {
    console.error("Profile save error:", error);
    showToast("Could not save profile.");
    return;
  }

  showToast("Profile saved!");
  updateAuthUI();
  renderProfilePage();
  renderDiscover();
  renderDashboard();
  showTab("profile");
}

async function loadOpportunities() {
  const { data, error } = await supabaseClient
    .from("opportunities")
    .select("id, title, category, tags, deadline, description, link")
    .order("id");

  if (error) {
    console.warn("Could not load opportunities from Supabase. Using local seed data.", error);
    return;
  }

  if (Array.isArray(data) && data.length) {
    opportunities = data.map(item => ({
      ...item,
      tags: Array.isArray(item.tags) ? item.tags : []
    }));
  }
}

// ---------- Auth ----------
function setupAuthUI() {
  document.getElementById("loginBtn").addEventListener("click", openLoginModal);
  document.getElementById("userMenuBtn").addEventListener("click", () => {
    const dropdown = document.getElementById("userDropdown");
    dropdown.hidden = !dropdown.hidden;
  });

  document.getElementById("dropdownProfile").addEventListener("click", () => {
    document.getElementById("userDropdown").hidden = true;
    showTab("profile");
  });

  document.getElementById("dropdownLogout").addEventListener("click", logout);

  document.getElementById("closeLoginModal").addEventListener("click", closeLoginModal);
  document.getElementById("modalOverlay").addEventListener("click", closeLoginModal);

  document.querySelectorAll(".auth-tab").forEach(tab => {
    tab.addEventListener("click", () => setAuthMode(tab.dataset.authMode));
  });

  document.getElementById("loginForm").addEventListener("submit", handleAuthSubmit);
  document.getElementById("forgotPasswordBtn").addEventListener("click", handleForgotPassword);

  document.getElementById("closeResetModal").addEventListener("click", closeResetModal);
  document.getElementById("resetOverlay").addEventListener("click", closeResetModal);
  document.getElementById("resetForm").addEventListener("submit", updatePassword);

  document.addEventListener("click", event => {
    const accountArea = document.querySelector(".account-area");
    if (!accountArea.contains(event.target)) {
      document.getElementById("userDropdown").hidden = true;
    }
  });
}

function setAuthMode(mode) {
  authMode = mode;
  const signup = mode === "signup";

  document.querySelectorAll(".auth-tab").forEach(tab => {
    tab.classList.toggle("active", tab.dataset.authMode === mode);
  });

  document.getElementById("authTitle").textContent = signup ? "Create your Scout account" : "Welcome to Scout";
  document.getElementById("authSubtitle").textContent = signup
    ? "Create an account to save your profile and opportunities across devices."
    : "Log in to access your personalized student profile.";
  document.getElementById("fullNameField").hidden = !signup;
  document.getElementById("confirmPasswordField").hidden = !signup;
  document.getElementById("loginConfirmPassword").required = signup;
  document.getElementById("authSubmitBtn").textContent = signup ? "Create account" : "Login";
  document.getElementById("forgotPasswordBtn").hidden = signup;
  document.getElementById("authNote").textContent = signup
    ? "Your account and profile are securely handled by Supabase."
    : "Use your Scout email and password to sign in.";
}

function openLoginModal() {
  const modal = document.getElementById("loginModal");
  modal.hidden = false;
  document.body.classList.add("modal-open");
  setAuthMode(authMode);
  setTimeout(() => document.getElementById("loginEmail").focus(), 0);
}

function closeLoginModal() {
  document.getElementById("loginModal").hidden = true;
  document.body.classList.remove("modal-open");
}

async function handleAuthSubmit(e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email || !email.includes("@")) {
    showToast("Enter a valid email.");
    return;
  }

  if (password.length < 6) {
    showToast("Password must be at least 6 characters.");
    return;
  }

  const button = document.getElementById("authSubmitBtn");
  button.disabled = true;

  try {
    if (authMode === "signup") {
      const fullName = document.getElementById("loginFullName").value.trim();
      const confirmation = document.getElementById("loginConfirmPassword").value;

      if (password !== confirmation) {
        showToast("Passwords do not match.");
        return;
      }

      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      });

      if (error) {
        showToast(error.message);
        return;
      }

      if (data.session) {
        closeLoginModal();
      } else {
        showToast("Account created. Check your email to confirm it.");
        setAuthMode("login");
      }
    } else {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        showToast(error.message);
        return;
      }

      closeLoginModal();
    }
  } finally {
    button.disabled = false;
  }
}

async function handleForgotPassword() {
  const email = document.getElementById("loginEmail").value.trim();
  if (!email || !email.includes("@")) {
    showToast("Enter your email first.");
    return;
  }

  const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin
  });

  if (error) {
    showToast(error.message);
    return;
  }

  showToast("Password reset email sent.");
}

async function updatePassword(e) {
  e.preventDefault();
  const password = document.getElementById("newPassword").value;
  const confirm = document.getElementById("confirmNewPassword").value;

  if (password.length < 6) {
    showToast("Password must be at least 6 characters.");
    return;
  }

  if (password !== confirm) {
    showToast("Passwords do not match.");
    return;
  }

  const { error } = await supabaseClient.auth.updateUser({ password });
  if (error) {
    showToast(error.message);
    return;
  }

  closeResetModal();
  showToast("Password updated successfully.");
}

function openResetModal() {
  document.getElementById("resetModal").hidden = false;
  document.body.classList.add("modal-open");
}

function closeResetModal() {
  document.getElementById("resetModal").hidden = true;
  document.body.classList.remove("modal-open");
}

async function logout() {
  const { error } = await supabaseClient.auth.signOut();
  if (error) {
    showToast(error.message);
    return;
  }

  document.getElementById("userDropdown").hidden = true;
  showToast("Logged out.");
  showTab("discover");
}

function updateAuthUI() {
  const loginBtn = document.getElementById("loginBtn");
  const userMenuBtn = document.getElementById("userMenuBtn");

  if (currentUser) {
    loginBtn.hidden = true;
    userMenuBtn.hidden = false;
    const displayName = profile.name || "Student";
    document.getElementById("navUserName").textContent =
      displayName.length > 18 ? displayName.slice(0, 18) + "…" : displayName;
    document.getElementById("navAvatar").textContent = getInitial();
  } else {
    loginBtn.hidden = false;
    userMenuBtn.hidden = true;
  }
}

// ---------- Profile ----------
function getInitial() {
  return profile.name ? profile.name.charAt(0).toUpperCase() : "?";
}

function renderProfilePage() {
  document.getElementById("profileAvatarLarge").textContent = getInitial();
  document.getElementById("profileName").textContent = profile.name || "Your Profile";
  document.getElementById("profileEducation").textContent =
    profile.education || "Add your education details";
  document.getElementById("profileEmail").textContent = currentUser?.email || "";
  document.getElementById("profileLocation").textContent = profile.location || "India";
  document.getElementById("profileAbout").textContent =
    profile.about || "Complete your profile to show your education, skills, and interests.";

  document.getElementById("profileBookmarks").textContent = bookmarks.length;
  document.getElementById("profileSkillsCount").textContent = profile.skills.length;
  document.getElementById("profileInterestsCount").textContent = profile.interests.length;

  const matches = opportunities.filter(opp => matchScore(opp) > 0).length;
  document.getElementById("profileMatchesCount").textContent = matches;

  renderProfileTags("profileSkills", profile.skills, "Add skills from Edit Profile.");
  renderProfileTags("profileInterests", profile.interests, "Select categories from Edit Profile.");
  renderCompletion();
}

function renderProfileTags(containerId, values, emptyText) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  if (!values.length) {
    container.innerHTML = `<span class="tag">${emptyText}</span>`;
    return;
  }

  values.forEach(value => {
    const item = document.createElement("span");
    item.className = "profile-tag";
    item.textContent = value;
    container.appendChild(item);
  });
}

function renderCompletion() {
  const checks = [
    { label: "Name added", done: Boolean(profile.name) },
    { label: "Education added", done: Boolean(profile.education) },
    { label: "About added", done: Boolean(profile.about) },
    { label: "Skills added", done: profile.skills.length > 0 },
    { label: "Interests selected", done: profile.interests.length > 0 },
    { label: "Location added", done: Boolean(profile.location) }
  ];

  const completed = checks.filter(item => item.done).length;
  const percent = Math.round((completed / checks.length) * 100);

  document.getElementById("completionPercent").textContent = `${percent}%`;
  document.getElementById("completionBar").style.width = `${percent}%`;

  document.getElementById("completionItems").innerHTML = checks.map(item => `
    <div class="completion-item ${item.done ? "done" : ""}">
      <span>${item.label}</span>
      <span class="completion-check">${item.done ? "✓" : "—"}</span>
    </div>
  `).join("");
}

// ---------- Matching ----------
function matchScore(opp) {
  let score = 0;
  const skillsLower = (profile.skills || []).map(s => s.toLowerCase());
  opp.tags.forEach(t => {
    if (skillsLower.includes(t.toLowerCase())) score += 2;
  });
  if (profile.interests.includes(opp.category)) score += 1;
  return score;
}

// ---------- Discover ----------
function renderDiscover() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const category = document.getElementById("categoryFilter").value;
  const sort = document.getElementById("sortFilter").value;

  let filtered = opportunities.filter(opp => {
    const matchesSearch =
      opp.title.toLowerCase().includes(search) ||
      opp.tags.some(t => t.toLowerCase().includes(search));
    const matchesCategory = category === "all" || opp.category === category;
    return matchesSearch && matchesCategory;
  });

  if (sort === "recommended") {
    filtered.sort((a, b) => matchScore(b) - matchScore(a));
  } else if (sort === "deadline") {
    filtered.sort((a, b) => {
      const aTime = a.deadline === "Rolling" || a.deadline === "Weekly"
        ? Number.POSITIVE_INFINITY : new Date(a.deadline).getTime();
      const bTime = b.deadline === "Rolling" || b.deadline === "Weekly"
        ? Number.POSITIVE_INFINITY : new Date(b.deadline).getTime();
      return aTime - bTime;
    });
  } else if (sort === "title") {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  }

  renderGrid(filtered, "opportunityGrid");
}

function renderGrid(list, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = '<p class="empty-state">No opportunities match your filters yet.</p>';
    return;
  }

  list.forEach(opp => {
    const card = document.createElement("div");
    card.className = "opp-card";
    const isBookmarked = bookmarks.includes(opp.id);
    const score = matchScore(opp);

    card.innerHTML = `
      ${score > 0 ? `<span class="match-badge">${score >= 3 ? "🔥 Great match" : "✨ Match"}</span>` : ""}
      <div class="opp-category">${opp.category}</div>
      <h3>${opp.title}</h3>
      <p class="opp-desc">${opp.description}</p>
      <div class="tag-row">${opp.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>
      <div class="opp-footer">
        <span class="deadline">📅 ${opp.deadline}</span>
        <div class="opp-actions">
          <button class="bookmark-btn ${isBookmarked ? "active" : ""}" data-id="${opp.id}">
            ${isBookmarked ? "★" : "☆"}
          </button>
          <a href="${opp.link}" target="_blank" rel="noopener noreferrer" class="view-link">View →</a>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  container.querySelectorAll(".bookmark-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (!currentUser) {
        openLoginModal();
        return;
      }
      toggleBookmark(parseInt(btn.dataset.id, 10));
    });
  });
}

async function toggleBookmark(id) {
  if (!currentUser) {
    openLoginModal();
    return;
  }

  const isBookmarked = bookmarks.includes(id);
  let error = null;

  if (isBookmarked) {
    ({ error } = await supabaseClient
      .from("bookmarks")
      .delete()
      .eq("user_id", currentUser.id)
      .eq("opportunity_id", id));

    if (!error) bookmarks = bookmarks.filter(b => b !== id);
  } else {
    ({ error } = await supabaseClient
      .from("bookmarks")
      .insert({ user_id: currentUser.id, opportunity_id: id }));

    if (!error) bookmarks = [...bookmarks, id];
  }

  if (error) {
    console.error("Bookmark error:", error);
    showToast("Could not update bookmark.");
    return;
  }

  renderDiscover();
  renderDashboard();
  renderProfilePage();
}

// ---------- Dashboard ----------
function renderDashboard() {
  const statsRow = document.getElementById("statsRow");
  statsRow.innerHTML = `
    <div class="stat-card"><span class="stat-num">${opportunities.length}</span><span class="stat-label">Total Opportunities</span></div>
    <div class="stat-card"><span class="stat-num">${bookmarks.length}</span><span class="stat-label">Bookmarked</span></div>
    <div class="stat-card"><span class="stat-num">${profile.skills.length}</span><span class="stat-label">Skills Added</span></div>
  `;

  const recommended = [...opportunities]
    .sort((a, b) => matchScore(b) - matchScore(a))
    .filter(o => matchScore(o) > 0)
    .slice(0, 4);

  renderGrid(
    recommended.length ? recommended : opportunities.slice(0, 4),
    "recommendedList"
  );

  renderGrid(
    opportunities.filter(o => bookmarks.includes(o.id)),
    "bookmarkedList"
  );
}

// ---------- Toast ----------
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}
