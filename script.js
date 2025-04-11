const API_URL = "https://api.github.com/users/";

const form = document.getElementById("form");
const search = document.getElementById("search");
const main = document.getElementById("main");
const loader = document.getElementById("loader");
const restartBtn = document.getElementById("restart");
const toggleBtn = document.getElementById("toggle-theme");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = search.value.trim();
  if (user) {
    fetchUser(user);
    search.value = "";
  }
});

restartBtn.addEventListener("click", () => {
  main.innerHTML = "";
  search.value = "";
});

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
});

async function fetchUser(username) {
  showLoader(true);
  try {
    const res = await fetch(API_URL + username);
    if (!res.ok) throw new Error("User not found");

    const userData = await res.json();
    createUserCard(userData);

    const repos = await fetch(API_URL + username + "/repos?sort=created");
    const repoData = await repos.json();
    addRepos(repoData);
  } catch (err) {
    showError(err.message);
  } finally {
    showLoader(false);
  }
}

function createUserCard(user) {
  main.innerHTML = `
    <div class="card">
      <div>
        <img src="${user.avatar_url}" alt="${user.name}" class="avatar" />
      </div>
      <div class="user-info">
        <h2>${user.name || "No Name Found"}</h2>
        <p>${user.bio || "No bio available"}</p>
        <ul>
          <li><strong>${user.followers}</strong> Followers</li>
          <li><strong>${user.following}</strong> Following</li>
          <li><strong>${user.public_repos}</strong> Repos</li>
        </ul>
        <div id="repos"></div>
      </div>
    </div>
  `;
}

function addRepos(repos) {
  const repoContainer = document.getElementById("repos");
  repos.slice(0, 5).forEach(repo => {
    const a = document.createElement("a");
    a.classList.add("repo");
    a.href = repo.html_url;
    a.target = "_blank";
    a.innerText = repo.name;
    repoContainer.appendChild(a);
  });
}

function showError(message) {
  main.innerHTML = `<div class="card"><h2>${message}</h2></div>`;
}

function showLoader(show) {
  loader.classList.toggle("hidden", !show);
}