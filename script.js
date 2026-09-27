// ---------- Seed Data ----------
const opportunities = [
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

// ---------- State ----------
let profile = JSON.parse(localStorage.getItem('scout_profile')) || {name:'', education:'', skills:[], interests:[]};
let bookmarks = JSON.parse(localStorage.getItem('scout_bookmarks')) || [];

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
  setupTabs();
  populateCategoryFilter();
  populateCategoryCheckboxes();
  loadProfileForm();
  renderDiscover();
  renderDashboard();
  document.getElementById('searchInput').addEventListener('input', renderDiscover);
  document.getElementById('categoryFilter').addEventListener('change', renderDiscover);
  document.getElementById('sortFilter').addEventListener('change', () => renderDiscover());
  document.getElementById('profileForm').addEventListener('submit', saveProfile);
});

function setupTabs(){
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
      if (btn.dataset.tab === 'dashboard') renderDashboard();
    });
  });
}

function populateCategoryFilter(){
  const sel = document.getElementById('categoryFilter');
  CATEGORIES.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat; opt.textContent = cat;
    sel.appendChild(opt);
  });
}

function populateCategoryCheckboxes(){
  const container = document.getElementById('categoryCheckboxes');
  CATEGORIES.forEach(cat => {
    const wrap = document.createElement('label');
    wrap.className = 'checkbox-item';
    wrap.innerHTML = `<input type="checkbox" id="cat_${cat}" value="${cat}"> ${cat}`;
    container.appendChild(wrap);
  });
}

function loadProfileForm(){
  document.getElementById('pName').value = profile.name;
  document.getElementById('pEducation').value = profile.education;
  document.getElementById('pSkills').value = profile.skills.join(', ');
  profile.interests.forEach(cat => {
    const cb = document.getElementById('cat_' + cat);
    if (cb) cb.checked = true;
  });
  renderProfileSummary();
}

function saveProfile(e){
  e.preventDefault();
  profile.name = document.getElementById('pName').value.trim();
  profile.education = document.getElementById('pEducation').value.trim();
  profile.skills = document.getElementById('pSkills').value.split(',').map(s => s.trim()).filter(Boolean);
  profile.interests = Array.from(document.querySelectorAll('#categoryCheckboxes input:checked')).map(cb => cb.value);
  localStorage.setItem('scout_profile', JSON.stringify(profile));
  showToast('Profile saved!');
  renderProfileSummary();
  renderDiscover();
  renderDashboard();
}

// ---------- Profile Summary ----------
function renderProfileSummary(){
  const container = document.getElementById('profileSummary');
  if (!container) return;

  if (!profile.name && profile.skills.length === 0){
    container.innerHTML = '<p class="empty-hint">Fill out the form below to build your profile.</p>';
    return;
  }
  const initial = profile.name ? profile.name.charAt(0).toUpperCase() : '?';
  const skillTags = profile.skills.map(s => `<span class="tag">${s}</span>`).join('');
  const interestTags = profile.interests.map(c => `<span class="tag">${c}</span>`).join('');
  container.innerHTML = `
    <div class="avatar">${initial}</div>
    <div class="profile-info">
      <h2>${profile.name || 'Unnamed Student'}</h2>
      <p>${profile.education || 'Education not set'}</p>
      <div class="tag-row">${skillTags}${interestTags}</div>
    </div>
  `;
}

// ---------- Matching ----------
function matchScore(opp){
  let score = 0;
  const skillsLower = (profile.skills || []).map(s => s.toLowerCase());
  opp.tags.forEach(t => {
    if (skillsLower.includes(t.toLowerCase())) score += 2;
  });
  if (profile.interests.includes(opp.category)) score += 1;
  return score;
}

// ---------- Discover ----------
function renderDiscover(){
  const search = document.getElementById('searchInput').value.toLowerCase();
  const category = document.getElementById('categoryFilter').value;
  const sort = document.getElementById('sortFilter').value;

  let filtered = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(search) || opp.tags.some(t => t.toLowerCase().includes(search));
    const matchesCategory = category === 'all' || opp.category === category;
    return matchesSearch && matchesCategory;
  });

  if (sort === 'recommended') filtered.sort((a,b) => matchScore(b) - matchScore(a));
  else if (sort === 'deadline') filtered.sort((a,b) => new Date(a.deadline) - new Date(b.deadline));
  else if (sort === 'title') filtered.sort((a,b) => a.title.localeCompare(b.title));

  renderGrid(filtered, 'opportunityGrid');
}

function renderGrid(list, containerId){
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  if (list.length === 0){
    container.innerHTML = '<p class="empty-state">No opportunities match your filters yet.</p>';
    return;
  }
  list.forEach(opp => {
    const card = document.createElement('div');
    card.className = 'opp-card';
    const isBookmarked = bookmarks.includes(opp.id);
    const score = matchScore(opp);
    card.innerHTML = `
      ${score > 0 ? `<span class="match-badge">${score >= 3 ? '🔥 Great match' : '✨ Match'}</span>` : ''}
      <div class="opp-category">${opp.category}</div>
      <h3>${opp.title}</h3>
      <p class="opp-desc">${opp.description}</p>
      <div class="tag-row">${opp.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
      <div class="opp-footer">
        <span class="deadline">📅 ${opp.deadline}</span>
        <div class="opp-actions">
          <button class="bookmark-btn ${isBookmarked ? 'active' : ''}" data-id="${opp.id}">${isBookmarked ? '★' : '☆'}</button>
          <a href="${opp.link}" target="_blank" class="view-link">View →</a>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
  container.querySelectorAll('.bookmark-btn').forEach(btn => {
    btn.addEventListener('click', () => toggleBookmark(parseInt(btn.dataset.id)));
  });
}

function toggleBookmark(id){
  bookmarks = bookmarks.includes(id) ? bookmarks.filter(b => b !== id) : [...bookmarks, id];
  localStorage.setItem('scout_bookmarks', JSON.stringify(bookmarks));
  renderDiscover();
  renderDashboard();
}

// ---------- Dashboard ----------
function renderDashboard(){
  document.getElementById('statsRow').innerHTML = `
    <div class="stat-card"><span class="stat-num">${opportunities.length}</span><span class="stat-label">Total Opportunities</span></div>
    <div class="stat-card"><span class="stat-num">${bookmarks.length}</span><span class="stat-label">Bookmarked</span></div>
    <div class="stat-card"><span class="stat-num">${profile.skills.length}</span><span class="stat-label">Skills Added</span></div>
  `;
  const recommended = [...opportunities].sort((a,b) => matchScore(b) - matchScore(a)).filter(o => matchScore(o) > 0).slice(0,4);
  renderGrid(recommended.length ? recommended : opportunities.slice(0,4), 'recommendedList');
  renderGrid(opportunities.filter(o => bookmarks.includes(o.id)), 'bookmarkedList');
}

function showToast(msg){
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}