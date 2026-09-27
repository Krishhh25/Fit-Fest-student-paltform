// ======================================================
// SCOUT
// ======================================================


// ======================================================
// OPPORTUNITIES
// ======================================================

const opportunities = [

  {
    id: 1,
    title: "Google Summer of Code 2026",
    category: "Internship",
    tags: ["Python", "Open Source", "Git"],
    deadline: "2026-04-15",
    description:
      "Contribute to real open source projects with experienced mentors.",
    link:
      "https://summerofcode.withgoogle.com/"
  },

  {
    id: 2,
    title: "Smart India Hackathon 2026",
    category: "Hackathon",
    tags: ["Problem Solving", "Full Stack", "Innovation"],
    deadline: "2026-08-01",
    description:
      "National level hackathon solving real world problems.",
    link:
      "https://sih.gov.in/"
  },

  {
    id: 3,
    title: "Microsoft Learn Student Ambassadors",
    category: "Certification",
    tags: ["Cloud", "Community", "Azure"],
    deadline: "Rolling",
    description:
      "Build technical skills and community leadership experience.",
    link:
      "https://mlsa.microsoft.com/"
  },

  {
    id: 4,
    title: "AWS Educate",
    category: "Course",
    tags: ["Cloud", "AWS", "Networking"],
    deadline: "Rolling",
    description:
      "Free cloud computing courses for students.",
    link:
      "https://aws.amazon.com/education/awseducate/"
  },

  {
    id: 5,
    title: "HackerRank CodeSprint",
    category: "Competition",
    tags: ["DSA", "Java", "Python"],
    deadline: "2026-11-10",
    description:
      "Coding competition focused on data structures and algorithms.",
    link:
      "https://www.hackerrank.com/"
  },

  {
    id: 6,
    title: "Flipkart GRiD",
    category: "Internship",
    tags: ["React", "Node.js", "Problem Solving"],
    deadline: "2026-10-05",
    description:
      "Campus technology competition and career opportunity.",
    link:
      "https://unstop.com/"
  },

  {
    id: 7,
    title: "Meta Front-End Developer Certificate",
    category: "Certification",
    tags: ["React", "JavaScript", "CSS"],
    deadline: "Rolling",
    description:
      "Professional front end development certification.",
    link:
      "https://www.coursera.org/professional-certificates/meta-front-end-developer"
  },

  {
    id: 8,
    title: "Devfolio Hackathons",
    category: "Hackathon",
    tags: ["Web3", "Full Stack", "UI/UX"],
    deadline: "Rolling",
    description:
      "Discover student and Web3 hackathons.",
    link:
      "https://devfolio.co/"
  },

  {
    id: 9,
    title: "INSPIRE Scholarship",
    category: "Scholarship",
    tags: ["Science", "Research"],
    deadline: "2026-09-30",
    description:
      "Government scholarship supporting students.",
    link:
      "https://online-inspire.gov.in/"
  },

  {
    id: 10,
    title: "National Merit Scholarship",
    category: "Scholarship",
    tags: ["Academics"],
    deadline: "2026-12-01",
    description:
      "Merit based scholarship opportunity.",
    link:
      "https://scholarships.gov.in/"
  },

  {
    id: 11,
    title: "freeCodeCamp Responsive Web Design",
    category: "Course",
    tags: ["HTML", "CSS", "JavaScript"],
    deadline: "Rolling",
    description:
      "Free web development certification.",
    link:
      "https://www.freecodecamp.org/"
  },

  {
    id: 12,
    title: "GDG DevFest Pune",
    category: "Workshop",
    tags: ["Android", "Cloud", "ML"],
    deadline: "2026-11-20",
    description:
      "Developer conference with workshops and technical sessions.",
    link:
      "https://gdg.community.dev/"
  },

  {
    id: 13,
    title: "Postman API Fundamentals",
    category: "Certification",
    tags: ["API", "Backend"],
    deadline: "Rolling",
    description:
      "Learn API development and testing fundamentals.",
    link:
      "https://academy.postman.com/"
  },

  {
    id: 14,
    title: "CodeChef Starters",
    category: "Competition",
    tags: ["DSA", "C++", "Python"],
    deadline: "Weekly",
    description:
      "Weekly coding competition.",
    link:
      "https://www.codechef.com/"
  },

  {
    id: 15,
    title: "TCS CodeVita",
    category: "Competition",
    tags: ["Java", "Problem Solving"],
    deadline: "2026-10-20",
    description:
      "Global coding contest by TCS.",
    link:
      "https://www.tcscodevita.com/"
  },

  {
    id: 16,
    title: "Internshala Web Dev Internship",
    category: "Internship",
    tags: ["JavaScript", "React", "Node.js"],
    deadline: "2026-10-15",
    description:
      "Remote web development internships.",
    link:
      "https://internshala.com/"
  },

  {
    id: 17,
    title: "Google Cloud Study Jam",
    category: "Workshop",
    tags: ["Cloud", "GCP"],
    deadline: "2026-10-25",
    description:
      "Hands on Google Cloud learning sessions.",
    link:
      "https://cloudonair.withgoogle.com/"
  }

];


const CATEGORIES = [

  "Internship",
  "Hackathon",
  "Scholarship",
  "Certification",
  "Competition",
  "Workshop",
  "Course"

];


// ======================================================
// STATE
// ======================================================

let currentUser = null;

let profile = {

  name: "",

  education: "",

  location: "India",

  about: "",

  skills: [],

  interests: []

};

let bookmarks = [];


// ======================================================
// INITIALIZATION
// ======================================================

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    setupTabs();

    populateCategoryFilter();

    populateCategoryCheckboxes();

    setupAuthentication();

    setupProfileEvents();

    setupSearch();

    await initializeAuth();

  }
);


// ======================================================
// AUTH INITIALIZATION
// ======================================================

async function initializeAuth() {

  const {
    data,
    error
  } =
    await scoutSupabase.auth.getSession();


  if (error) {

    console.error(
      "Session error:",
      error
    );

    return;

  }


  if (data.session) {

    currentUser =
      data.session.user;

    await loadUserData();

  }


  scoutSupabase.auth.onAuthStateChange(
    async (event, session) => {

      if (
        event === "SIGNED_IN" &&
        session
      ) {

        currentUser =
          session.user;

        await loadUserData();

        updateAuthUI();

        renderDiscover();

        renderDashboard();

        renderProfilePage();

      }


      if (
        event === "SIGNED_OUT"
      ) {

        currentUser = null;

        profile = {

          name: "",

          education: "",

          location: "India",

          about: "",

          skills: [],

          interests: []

        };

        bookmarks = [];

        updateAuthUI();

        renderDiscover();

        renderDashboard();

        renderProfilePage();

      }


      if (
        event === "PASSWORD_RECOVERY"
      ) {

        document.getElementById(
          "resetModal"
        ).hidden = false;

        document.body.classList.add(
          "modal-open"
        );

      }

    }
  );


  updateAuthUI();

  renderDiscover();

  renderDashboard();

  renderProfilePage();

}


// ======================================================
// LOAD USER DATA
// ======================================================

async function loadUserData() {

  if (!currentUser) {
    return;
  }


  // PROFILE

  const {
    data: profileData,
    error: profileError
  } =
    await scoutSupabase
      .from("profiles")
      .select("*")
      .eq(
        "id",
        currentUser.id
      )
      .maybeSingle();


  if (profileError) {

    console.error(
      "Profile load error:",
      profileError
    );

    showToast(
      "Could not load profile."
    );

    return;

  }


  if (!profileData) {

    profile = {

      name:
        currentUser.user_metadata?.full_name || "",

      education: "",

      location: "India",

      about: "",

      skills: [],

      interests: []

    };


    const {
      error
    } =
      await scoutSupabase
        .from("profiles")
        .insert({

          id:
            currentUser.id,

          name:
            profile.name,

          education: "",

          location: "India",

          about: "",

          skills: [],

          interests: []

        });


    if (error) {

      console.error(
        "Profile creation error:",
        error
      );

    }

  }

  else {

    profile = {

      name:
        profileData.name || "",

      education:
        profileData.education || "",

      location:
        profileData.location || "India",

      about:
        profileData.about || "",

      skills:
        Array.isArray(
          profileData.skills
        )
          ? profileData.skills
          : [],

      interests:
        Array.isArray(
          profileData.interests
        )
          ? profileData.interests
          : []

    };

  }


  // BOOKMARKS

  const {
    data: bookmarkData,
    error: bookmarkError
  } =
    await scoutSupabase
      .from("bookmarks")
      .select("opportunity_id")
      .eq(
        "user_id",
        currentUser.id
      );


  if (bookmarkError) {

    console.error(
      "Bookmark load error:",
      bookmarkError
    );

    bookmarks = [];

  }

  else {

    bookmarks =
      bookmarkData.map(
        item =>
          Number(
            item.opportunity_id
          )
      );

  }


  loadProfileForm();

}


// ======================================================
// AUTH UI
// ======================================================

function updateAuthUI() {

  const loginButton =
    document.getElementById(
      "loginBtn"
    );


  const userButton =
    document.getElementById(
      "userMenuBtn"
    );


  if (currentUser) {

    loginButton.hidden = true;

    userButton.hidden = false;


    const displayName =
      profile.name ||
      currentUser.email
        ?.split("@")[0] ||
      "Student";


    document.getElementById(
      "navUserName"
    ).textContent =
      displayName.length > 18
        ? displayName.substring(
            0,
            18
          ) + "..."
        : displayName;


    document.getElementById(
      "navAvatar"
    ).textContent =
      getInitial();

  }

  else {

    loginButton.hidden = false;

    userButton.hidden = true;

  }

}


// ======================================================
// AUTHENTICATION
// ======================================================

function setupAuthentication() {

  document.getElementById(
    "loginBtn"
  ).addEventListener(
    "click",
    openLoginModal
  );


  document.getElementById(
    "closeLoginModal"
  ).addEventListener(
    "click",
    closeLoginModal
  );


  document.getElementById(
    "modalOverlay"
  ).addEventListener(
    "click",
    closeLoginModal
  );


  document.querySelectorAll(
    ".auth-tab"
  ).forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          const mode =
            button.dataset.authMode;

          if (
            mode === "login"
          ) {

            showLoginForm();

          }

          else {

            showSignupForm();

          }

        }
      );

    }
  );


  document.getElementById(
    "loginForm"
  ).addEventListener(
    "submit",
    login
  );


  document.getElementById(
    "signupForm"
  ).addEventListener(
    "submit",
    signup
  );


  document.getElementById(
    "forgotPasswordBtn"
  ).addEventListener(
    "click",
    forgotPassword
  );


  document.getElementById(
    "userMenuBtn"
  ).addEventListener(
    "click",
    event => {

      event.stopPropagation();

      const dropdown =
        document.getElementById(
          "userDropdown"
        );


      dropdown.hidden =
        !dropdown.hidden;

    }
  );


  document.getElementById(
    "dropdownProfile"
  ).addEventListener(
    "click",
    () => {

      document.getElementById(
        "userDropdown"
      ).hidden = true;

      showTab(
        "profile"
      );

    }
  );


  document.getElementById(
    "dropdownLogout"
  ).addEventListener(
    "click",
    logout
  );


  document.addEventListener(
    "click",
    event => {

      const area =
        document.querySelector(
          ".account-area"
        );


      if (
        !area.contains(
          event.target
        )
      ) {

        document.getElementById(
          "userDropdown"
        ).hidden = true;

      }

    }
  );


  // PASSWORD RESET

  document.getElementById(
    "resetForm"
  ).addEventListener(
    "submit",
    updatePassword
  );


  document.getElementById(
    "closeResetModal"
  ).addEventListener(
    "click",
    closeResetModal
  );


  document.getElementById(
    "resetOverlay"
  ).addEventListener(
    "click",
    closeResetModal
  );


  // MATCH INSIGHTS

  document.getElementById(
    "closeMatchInsights"
  ).addEventListener(
    "click",
    closeMatchInsights
  );


  document.getElementById(
    "matchInsightsOverlay"
  ).addEventListener(
    "click",
    closeMatchInsights
  );

}


// ======================================================
// LOGIN
// ======================================================

async function login(event) {

  event.preventDefault();

  clearAuthMessage();


  const email =
    document.getElementById(
      "loginEmail"
    ).value.trim();


  const password =
    document.getElementById(
      "loginPassword"
    ).value;


  if (
    !email ||
    !password
  ) {

    setAuthMessage(
      "Enter your email and password.",
      true
    );

    return;

  }


  const button =
    document.getElementById(
      "loginSubmitBtn"
    );


  button.disabled = true;

  button.textContent =
    "Logging in...";


  const {
    data,
    error
  } =
    await scoutSupabase.auth
      .signInWithPassword({

        email,

        password

      });


  button.disabled = false;

  button.textContent =
    "Login";


  if (error) {

    console.error(
      error
    );


    setAuthMessage(
      error.message,
      true
    );

    return;

  }


  currentUser =
    data.user;


  await loadUserData();


  updateAuthUI();

  closeLoginModal();

  renderProfilePage();

  renderDashboard();

  renderDiscover();

  showTab(
    "profile"
  );


  showToast(
    "Welcome back."
  );

}


// ======================================================
// SIGNUP
// ======================================================

async function signup(event) {

  event.preventDefault();

  clearAuthMessage();


  const name =
    document.getElementById(
      "signupName"
    ).value.trim();


  const email =
    document.getElementById(
      "signupEmail"
    ).value.trim();


  const password =
    document.getElementById(
      "signupPassword"
    ).value;


  const confirmPassword =
    document.getElementById(
      "signupConfirmPassword"
    ).value;


  if (!name) {

    setAuthMessage(
      "Enter your full name.",
      true
    );

    return;

  }


  if (
    password.length < 6
  ) {

    setAuthMessage(
      "Password must be at least 6 characters.",
      true
    );

    return;

  }


  if (
    password !==
    confirmPassword
  ) {

    setAuthMessage(
      "Passwords do not match.",
      true
    );

    return;

  }


  const button =
    document.getElementById(
      "signupSubmitBtn"
    );


  button.disabled = true;

  button.textContent =
    "Creating account...";


  const {
    data,
    error
  } =
    await scoutSupabase.auth
      .signUp({

        email,

        password,

        options: {

          data: {

            full_name:
              name

          }

        }

      });


  button.disabled = false;

  button.textContent =
    "Create Account";


  if (error) {

    console.error(
      error
    );


    setAuthMessage(
      error.message,
      true
    );

    return;

  }


  if (
    data.session
  ) {

    currentUser =
      data.user;


    const {
      error:
        profileError
    } =
      await scoutSupabase
        .from("profiles")
        .upsert({

          id:
            currentUser.id,

          name,

          education: "",

          location: "India",

          about: "",

          skills: [],

          interests: []

        });


    if (
      profileError
    ) {

      console.error(
        profileError
      );

    }


    await loadUserData();


    closeLoginModal();

    updateAuthUI();

    renderProfilePage();

    renderDashboard();

    renderDiscover();

    showTab(
      "profile"
    );


    showToast(
      "Account created."
    );

  }

  else {

    setAuthMessage(
      "Account created. Check your email to confirm your account."
    );

  }

}


// ======================================================
// FORGOT PASSWORD
// ======================================================

async function forgotPassword() {

  clearAuthMessage();


  const email =
    document.getElementById(
      "loginEmail"
    ).value.trim();


  if (!email) {

    setAuthMessage(
      "Enter your email first.",
      true
    );

    return;

  }


  const {
    error
  } =
    await scoutSupabase.auth
      .resetPasswordForEmail(
        email,
        {
          redirectTo:
            window.location.origin
        }
      );


  if (error) {

    setAuthMessage(
      error.message,
      true
    );

    return;

  }


  setAuthMessage(
    "Password reset email sent."
  );

}


// ======================================================
// PASSWORD UPDATE
// ======================================================

async function updatePassword(
  event
) {

  event.preventDefault();


  const password =
    document.getElementById(
      "newPassword"
    ).value;


  const confirmPassword =
    document.getElementById(
      "confirmNewPassword"
    ).value;


  if (
    password !==
    confirmPassword
  ) {

    showToast(
      "Passwords do not match."
    );

    return;

  }


  const {
    error
  } =
    await scoutSupabase.auth
      .updateUser({

        password

      });


  if (error) {

    showToast(
      error.message
    );

    return;

  }


  closeResetModal();

  showToast(
    "Password updated."
  );

}


// ======================================================
// LOGOUT
// ======================================================

async function logout() {

  const {
    error
  } =
    await scoutSupabase.auth
      .signOut();


  if (error) {

    showToast(
      error.message
    );

    return;

  }


  currentUser = null;

  bookmarks = [];


  profile = {

    name: "",

    education: "",

    location: "India",

    about: "",

    skills: [],

    interests: []

  };


  updateAuthUI();

  showTab(
    "discover"
  );

  renderDiscover();

  renderDashboard();

  renderProfilePage();

  showToast(
    "Logged out."
  );

}


// ======================================================
// AUTH MODAL
// ======================================================

function openLoginModal() {

  document.getElementById(
    "loginModal"
  ).hidden = false;


  document.body.classList.add(
    "modal-open"
  );


  showLoginForm();

}


function closeLoginModal() {

  document.getElementById(
    "loginModal"
  ).hidden = true;


  document.body.classList.remove(
    "modal-open"
  );


  clearAuthMessage();

}


function showLoginForm() {

  document.getElementById(
    "loginForm"
  ).hidden = false;


  document.getElementById(
    "signupForm"
  ).hidden = true;


  document.querySelectorAll(
    ".auth-tab"
  ).forEach(
    button => {

      button.classList.toggle(
        "active",
        button.dataset.authMode ===
        "login"
      );

    }
  );


  document.getElementById(
    "authTitle"
  ).textContent =
    "Welcome back";


  document.getElementById(
    "authSubtitle"
  ).textContent =
    "Login to access your Scout account.";


  document.getElementById(
    "forgotPasswordBtn"
  ).hidden = false;


  clearAuthMessage();

}


function showSignupForm() {

  document.getElementById(
    "loginForm"
  ).hidden = true;


  document.getElementById(
    "signupForm"
  ).hidden = false;


  document.querySelectorAll(
    ".auth-tab"
  ).forEach(
    button => {

      button.classList.toggle(
        "active",
        button.dataset.authMode ===
        "signup"
      );

    }
  );


  document.getElementById(
    "authTitle"
  ).textContent =
    "Create your account";


  document.getElementById(
    "authSubtitle"
  ).textContent =
    "Join Scout and personalize your opportunities.";


  document.getElementById(
    "forgotPasswordBtn"
  ).hidden = true;


  clearAuthMessage();

}


function setAuthMessage(
  message,
  isError = false
) {

  const element =
    document.getElementById(
      "authMessage"
    );


  element.textContent =
    message;


  element.className =
    isError
      ? "auth-message error"
      : "auth-message success";

}


function clearAuthMessage() {

  const element =
    document.getElementById(
      "authMessage"
    );


  element.textContent =
    "";


  element.className =
    "auth-message";

}


function closeResetModal() {

  document.getElementById(
    "resetModal"
  ).hidden = true;


  document.body.classList.remove(
    "modal-open"
  );

}


// ======================================================
// NAVIGATION
// ======================================================

function setupTabs() {

  document.querySelectorAll(
    ".tab-btn"
  ).forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          const tab =
            button.dataset.tab;


          if (
            !currentUser &&
            (
              tab === "dashboard" ||
              tab === "profile"
            )
          ) {

            openLoginModal();

            return;

          }


          showTab(
            tab
          );

        }
      );

    }
  );

}


function showTab(
  tabId
) {

  document.querySelectorAll(
    ".tab-btn"
  ).forEach(
    button => {

      button.classList.remove(
        "active"
      );

    }
  );


  document.querySelectorAll(
    ".tab-content"
  ).forEach(
    section => {

      section.classList.remove(
        "active"
      );

    }
  );


  const button =
    document.querySelector(
      `.tab-btn[data-tab="${tabId}"]`
    );


  if (button) {

    button.classList.add(
      "active"
    );

  }


  const section =
    document.getElementById(
      tabId
    );


  if (section) {

    section.classList.add(
      "active"
    );

  }


  if (
    tabId ===
    "dashboard"
  ) {

    renderDashboard();

  }


  if (
    tabId ===
    "profile"
  ) {

    renderProfilePage();

  }


  if (
    tabId ===
    "profileEdit"
  ) {

    loadProfileForm();

  }

}


// ======================================================
// PROFILE
// ======================================================

function setupProfileEvents() {

  document.getElementById(
    "profileForm"
  ).addEventListener(
    "submit",
    saveProfile
  );


  document.getElementById(
    "cancelProfileEdit"
  ).addEventListener(
    "click",
    () =>
      showTab(
        "profile"
      )
  );


  document.getElementById(
    "editProfileBtn"
  ).addEventListener(
    "click",
    openProfileEdit
  );


  document.getElementById(
    "editAboutBtn"
  ).addEventListener(
    "click",
    openProfileEdit
  );


  document.getElementById(
    "editSkillsBtn"
  ).addEventListener(
    "click",
    openProfileEdit
  );


  document.getElementById(
    "editInterestsBtn"
  ).addEventListener(
    "click",
    openProfileEdit
  );

}


function openProfileEdit() {

  if (!currentUser) {

    openLoginModal();

    return;

  }


  showTab(
    "profileEdit"
  );

}


// ======================================================
// PROFILE FORM
// ======================================================

function loadProfileForm() {

  document.getElementById(
    "pName"
  ).value =
    profile.name || "";


  document.getElementById(
    "pEducation"
  ).value =
    profile.education || "";


  document.getElementById(
    "pLocation"
  ).value =
    profile.location || "India";


  document.getElementById(
    "pAbout"
  ).value =
    profile.about || "";


  document.getElementById(
    "pSkills"
  ).value =
    profile.skills.join(
      ", "
    );


  CATEGORIES.forEach(
    category => {

      const checkbox =
        document.getElementById(
          "cat_" + category
        );


      if (checkbox) {

        checkbox.checked =
          profile.interests.includes(
            category
          );

      }

    }
  );

}


async function saveProfile(
  event
) {

  event.preventDefault();


  if (!currentUser) {

    openLoginModal();

    return;

  }


  const newProfile = {

    name:
      document.getElementById(
        "pName"
      ).value.trim(),

    education:
      document.getElementById(
        "pEducation"
      ).value.trim(),

    location:
      document.getElementById(
        "pLocation"
      ).value.trim() ||
      "India",

    about:
      document.getElementById(
        "pAbout"
      ).value.trim(),

    skills:
      document.getElementById(
        "pSkills"
      ).value
        .split(",")
        .map(
          value =>
            value.trim()
        )
        .filter(
          Boolean
        ),

    interests:
      Array.from(
        document.querySelectorAll(
          "#categoryCheckboxes input:checked"
        )
      ).map(
        checkbox =>
          checkbox.value
      )

  };


  const {
    error
  } =
    await scoutSupabase
      .from("profiles")
      .upsert({

        id:
          currentUser.id,

        ...newProfile,

        updated_at:
          new Date().toISOString()

      });


  if (error) {

    console.error(
      error
    );

    showToast(
      error.message
    );

    return;

  }


  profile =
    newProfile;


  updateAuthUI();

  renderProfilePage();

  renderDiscover();

  renderDashboard();

  showTab(
    "profile"
  );


  showToast(
    "Profile saved."
  );

}


// ======================================================
// PROFILE PAGE
// ======================================================

function getInitial() {

  return profile.name
    ? profile.name
        .charAt(0)
        .toUpperCase()
    : "?";

}


function renderProfilePage() {

  document.getElementById(
    "profileAvatarLarge"
  ).textContent =
    getInitial();


  document.getElementById(
    "profileName"
  ).textContent =
    profile.name ||
    "Your Profile";


  document.getElementById(
    "profileEducation"
  ).textContent =
    profile.education ||
    "Add your education";


  document.getElementById(
    "profileEmail"
  ).textContent =
    currentUser?.email ||
    "";


  document.getElementById(
    "profileLocation"
  ).textContent =
    profile.location ||
    "India";


  document.getElementById(
    "profileAbout"
  ).textContent =
    profile.about ||
    "Complete your profile to show your information.";


  document.getElementById(
    "profileBookmarks"
  ).textContent =
    bookmarks.length;


  document.getElementById(
    "profileSkillsCount"
  ).textContent =
    profile.skills.length;


  document.getElementById(
    "profileInterestsCount"
  ).textContent =
    profile.interests.length;


  const matches =
    opportunities.filter(
      opportunity =>
        matchScore(
          opportunity
        ) > 0
    ).length;


  document.getElementById(
    "profileMatchesCount"
  ).textContent =
    matches;


  renderProfileTags(
    "profileSkills",
    profile.skills,
    "No skills added."
  );


  renderProfileTags(
    "profileInterests",
    profile.interests,
    "No interests selected."
  );


  renderCompletion();

}


function renderProfileTags(
  containerId,
  values,
  emptyMessage
) {

  const container =
    document.getElementById(
      containerId
    );


  container.innerHTML =
    "";


  if (!values.length) {

    const element =
      document.createElement(
        "span"
      );


    element.className =
      "tag";


    element.textContent =
      emptyMessage;


    container.appendChild(
      element
    );


    return;

  }


  values.forEach(
    value => {

      const element =
        document.createElement(
          "span"
        );


      element.className =
        "profile-tag";


      element.textContent =
        value;


      container.appendChild(
        element
      );

    }
  );

}


// ======================================================
// PROFILE COMPLETION
// ======================================================

function renderCompletion() {

  const items = [

    {
      label: "Name",
      done:
        Boolean(
          profile.name
        )
    },

    {
      label: "Education",
      done:
        Boolean(
          profile.education
        )
    },

    {
      label: "About",
      done:
        Boolean(
          profile.about
        )
    },

    {
      label: "Skills",
      done:
        profile.skills.length > 0
    },

    {
      label: "Interests",
      done:
        profile.interests.length > 0
    },

    {
      label: "Location",
      done:
        Boolean(
          profile.location
        )
    }

  ];


  const complete =
    items.filter(
      item =>
        item.done
    ).length;


  const percentage =
    Math.round(
      (
        complete /
        items.length
      ) * 100
    );


  document.getElementById(
    "completionPercent"
  ).textContent =
    percentage + "%";


  document.getElementById(
    "completionBar"
  ).style.width =
    percentage + "%";


  document.getElementById(
    "completionItems"
  ).innerHTML =
    items.map(
      item => `

        <div class="
          completion-item
          ${item.done ? "done" : ""}
        ">

          <span>
            ${item.label}
          </span>

          <span
            class="completion-check"
          >
            ${item.done ? "✓" : "—"}
          </span>

        </div>

      `
    ).join("");

}


// ======================================================
// MATCHING
// ======================================================

function matchScore(
  opportunity
) {

  let score = 0;


  const studentSkills =
    profile.skills.map(
      skill =>
        skill.toLowerCase()
    );


  opportunity.tags.forEach(
    tag => {

      if (
        studentSkills.includes(
          tag.toLowerCase()
        )
      ) {

        score += 2;

      }

    }
  );


  if (
    profile.interests.includes(
      opportunity.category
    )
  ) {

    score += 1;

  }


  return score;

}


// ======================================================
// MATCH PERCENTAGE
// ======================================================

function matchPercentage(
  opportunity
) {

  const score =
    matchScore(
      opportunity
    );


  const maximum =
    opportunity.tags.length * 2 + 1;


  if (
    maximum === 0
  ) {

    return 0;

  }


  return Math.min(
    100,
    Math.round(
      (
        score /
        maximum
      ) * 100
    )
  );

}


// ======================================================
// SEARCH
// ======================================================

function setupSearch() {

  document.getElementById(
    "searchInput"
  ).addEventListener(
    "input",
    renderDiscover
  );


  document.getElementById(
    "categoryFilter"
  ).addEventListener(
    "change",
    renderDiscover
  );


  document.getElementById(
    "sortFilter"
  ).addEventListener(
    "change",
    renderDiscover
  );

}


function renderDiscover() {

  const search =
    document.getElementById(
      "searchInput"
    ).value
      .trim()
      .toLowerCase();


  const category =
    document.getElementById(
      "categoryFilter"
    ).value;


  const sort =
    document.getElementById(
      "sortFilter"
    ).value;


  let filtered =
    opportunities.filter(
      opportunity => {

        const titleMatch =
          opportunity.title
            .toLowerCase()
            .includes(
              search
            );


        const tagMatch =
          opportunity.tags.some(
            tag =>
              tag
                .toLowerCase()
                .includes(
                  search
                )
          );


        const categoryMatch =
          category === "all" ||
          opportunity.category ===
            category;


        return (
          (
            titleMatch ||
            tagMatch
          ) &&
          categoryMatch
        );

      }
    );


  if (
    sort ===
    "recommended"
  ) {

    filtered.sort(
      (a, b) =>
        matchScore(b) -
        matchScore(a)
    );

  }


  else if (
    sort ===
    "deadline"
  ) {

    filtered.sort(
      (a, b) => {

        const aDate =
          (
            a.deadline ===
              "Rolling" ||
            a.deadline ===
              "Weekly"
          )
            ? Infinity
            : new Date(
                a.deadline
              ).getTime();


        const bDate =
          (
            b.deadline ===
              "Rolling" ||
            b.deadline ===
              "Weekly"
          )
            ? Infinity
            : new Date(
                b.deadline
              ).getTime();


        return (
          aDate -
          bDate
        );

      }
    );

  }


  else if (
    sort ===
    "title"
  ) {

    filtered.sort(
      (a, b) =>
        a.title.localeCompare(
          b.title
        )
    );

  }


  renderGrid(
    filtered,
    "opportunityGrid"
  );

}


// ======================================================
// OPPORTUNITY GRID
// ======================================================

function renderGrid(
  list,
  containerId
) {

  const container =
    document.getElementById(
      containerId
    );


  container.innerHTML =
    "";


  if (!list.length) {

    container.innerHTML = `

      <p class="empty-state">
        No opportunities found.
      </p>

    `;

    return;

  }


  list.forEach(
    opportunity => {

      const card =
        document.createElement(
          "div"
        );


      card.className =
        "opp-card";


      const bookmarked =
        bookmarks.includes(
          opportunity.id
        );


      const score =
        matchScore(
          opportunity
        );


      card.innerHTML = `

        ${
          score > 0
            ? `

              <span
                class="match-badge"
              >

                ${
                  score >= 3
                    ? "Great match"
                    : "Match"
                }

              </span>

            `
            : ""
        }


        <div class="opp-category">

          ${opportunity.category}

        </div>


        <h3>

          ${opportunity.title}

        </h3>


        <p class="opp-desc">

          ${opportunity.description}

        </p>


        <div class="tag-row">

          ${
            opportunity.tags
              .map(
                tag =>
                  `<span class="tag">
                    ${tag}
                  </span>`
              )
              .join("")
          }

        </div>


        <div class="opp-footer">

          <span class="deadline">

            ${opportunity.deadline}

          </span>


          <div class="opp-actions">

            <button
              class="
                bookmark-btn
                ${bookmarked ? "active" : ""}
              "
              data-id="${opportunity.id}"
              title="Bookmark"
            >

              ${
                bookmarked
                  ? "★"
                  : "☆"
              }

            </button>


            <a
              href="${opportunity.link}"
              target="_blank"
              rel="noopener noreferrer"
              class="view-link"
            >

              View

            </a>

          </div>

        </div>


        ${
          currentUser
            ? `

              <button
                class="match-insights-btn"
                data-insight-id="${opportunity.id}"
              >

                Why this matches me

              </button>

            `
            : ""
        }

      `;


      container.appendChild(
        card
      );

    }
  );


  container
    .querySelectorAll(
      ".bookmark-btn"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            toggleBookmark(
              Number(
                button.dataset.id
              )
            );

          }
        );

      }
    );


  container
    .querySelectorAll(
      ".match-insights-btn"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            const opportunity =
              opportunities.find(
                item =>
                  item.id ===
                  Number(
                    button.dataset.insightId
                  )
              );


            if (
              opportunity
            ) {

              openMatchInsights(
                opportunity
              );

            }

          }
        );

      }
    );

}


// ======================================================
// BOOKMARKS
// ======================================================

async function toggleBookmark(
  opportunityId
) {

  if (!currentUser) {

    openLoginModal();

    return;

  }


  const alreadyBookmarked =
    bookmarks.includes(
      opportunityId
    );


  if (
    alreadyBookmarked
  ) {

    const {
      error
    } =
      await scoutSupabase
        .from("bookmarks")
        .delete()
        .eq(
          "user_id",
          currentUser.id
        )
        .eq(
          "opportunity_id",
          opportunityId
        );


    if (error) {

      showToast(
        error.message
      );

      return;

    }


    bookmarks =
      bookmarks.filter(
        id =>
          id !==
          opportunityId
      );

  }

  else {

    const {
      error
    } =
      await scoutSupabase
        .from("bookmarks")
        .insert({

          user_id:
            currentUser.id,

          opportunity_id:
            opportunityId

        });


    if (error) {

      showToast(
        error.message
      );

      return;

    }


    bookmarks.push(
      opportunityId
    );

  }


  renderDiscover();

  renderDashboard();

  renderProfilePage();

}


// ======================================================
// DASHBOARD
// ======================================================

function renderDashboard() {

  document.getElementById(
    "statsRow"
  ).innerHTML = `

    <div class="stat-card">

      <span class="stat-num">
        ${opportunities.length}
      </span>

      <span class="stat-label">
        Total Opportunities
      </span>

    </div>


    <div class="stat-card">

      <span class="stat-num">
        ${bookmarks.length}
      </span>

      <span class="stat-label">
        Bookmarked
      </span>

    </div>


    <div class="stat-card">

      <span class="stat-num">
        ${profile.skills.length}
      </span>

      <span class="stat-label">
        Skills Added
      </span>

    </div>

  `;


  const recommended =
    [...opportunities]
      .sort(
        (a, b) =>
          matchScore(b) -
          matchScore(a)
      )
      .filter(
        opportunity =>
          matchScore(
            opportunity
          ) > 0
      )
      .slice(
        0,
        4
      );


  renderGrid(
    recommended.length
      ? recommended
      : opportunities.slice(
          0,
          4
        ),
    "recommendedList"
  );


  renderGrid(
    opportunities.filter(
      opportunity =>
        bookmarks.includes(
          opportunity.id
        )
    ),
    "bookmarkedList"
  );

}


// ======================================================
// MATCH INSIGHTS
// ======================================================

function getMatchInsights(
  opportunity
) {

  const studentSkills =
    profile.skills.map(
      skill =>
        skill.toLowerCase()
    );


  const matchedSkills =
    opportunity.tags.filter(
      tag =>
        studentSkills.includes(
          tag.toLowerCase()
        )
    );


  const missingSkills =
    opportunity.tags.filter(
      tag =>
        !studentSkills.includes(
          tag.toLowerCase()
        )
    );


  const categoryMatch =
    profile.interests.includes(
      opportunity.category
    );


  return {

    matchedSkills,

    missingSkills,

    categoryMatch

  };

}


function openMatchInsights(
  opportunity
) {

  const insights =
    getMatchInsights(
      opportunity
    );


  const percentage =
    matchPercentage(
      opportunity
    );


  document.getElementById(
    "insightTitle"
  ).textContent =
    opportunity.title;


  document.getElementById(
    "insightMatch"
  ).textContent =
    percentage +
    "% Match";


  const matchedContainer =
    document.getElementById(
      "matchedReasons"
    );


  matchedContainer.innerHTML =
    "";


  insights.matchedSkills.forEach(
    skill => {

      const item =
        document.createElement(
          "div"
        );


      item.className =
        "insight-item match";


      item.textContent =
        `${skill} matches your skills`;


      matchedContainer.appendChild(
        item
      );

    }
  );


  if (
    insights.categoryMatch
  ) {

    const item =
      document.createElement(
        "div"
      );


    item.className =
      "insight-item match";


    item.textContent =
      `${opportunity.category} matches your interests`;


    matchedContainer.appendChild(
      item
    );

  }


  if (
    !matchedContainer.children.length
  ) {

    matchedContainer.innerHTML = `

      <div class="insight-item">

        No direct matches yet.

      </div>

    `;

  }


  const missingContainer =
    document.getElementById(
      "missingSkills"
    );


  missingContainer.innerHTML =
    "";


  if (
    insights.missingSkills.length ===
    0
  ) {

    missingContainer.innerHTML = `

      <div class="no-gap">

        You match all listed skills.

      </div>

    `;

  }

  else {

    insights.missingSkills.forEach(
      skill => {

        const item =
          document.createElement(
            "div"
          );


        item.className =
          "insight-item missing";


        item.textContent =
          skill;


        missingContainer.appendChild(
          item
        );

      }
    );

  }


  const nextStep =
    document.getElementById(
      "nextStep"
    );


  if (
    insights.missingSkills.length ===
    0
  ) {

    nextStep.textContent =
      "You already match the listed skills. Review the opportunity requirements and apply if it fits your goals.";

  }

  else {

    nextStep.textContent =
      `Consider improving ${insights.missingSkills.join(", ")} before applying.`;

  }


  document.getElementById(
    "matchInsightsModal"
  ).hidden = false;


  document.body.classList.add(
    "modal-open"
  );

}


function closeMatchInsights() {

  document.getElementById(
    "matchInsightsModal"
  ).hidden = true;


  document.body.classList.remove(
    "modal-open"
  );

}


// ======================================================
// TOAST
// ======================================================

function showToast(
  message
) {

  const toast =
    document.getElementById(
      "toast"
    );


  toast.textContent =
    message;


  toast.classList.add(
    "show"
  );


  setTimeout(
    () => {

      toast.classList.remove(
        "show"
      );

    },
    2500
  );

}