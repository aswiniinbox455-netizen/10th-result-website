const RESULTS = {
  "1001": { name: "Aswini",       dob: "2009-03-13", school: "Govt Hr Sec School", marks: { Tamil: 95, English: 88, Maths: 99, Science: 92, "Social Science": 90 } },
  "1002": { name: "Archana",      dob: "2009-08-24", school: "Govt Hr Sec School", marks: { Tamil: 92, English: 89, Maths: 94, Science: 90, "Social Science": 91 } },
  "1003": { name: "Dharshini",    dob: "2009-03-19", school: "Govt Hr Sec School", marks: { Tamil: 90, English: 93, Maths: 88, Science: 95, "Social Science": 92 } },
  "1004": { name: "Gayathri",     dob: "2008-12-31", school: "Govt Hr Sec School", marks: { Tamil: 94, English: 90, Maths: 96, Science: 89, "Social Science": 93 } },
  "1005": { name: "Dhanalakshmi", dob: "2008-05-23", school: "Govt Hr Sec School", marks: { Tamil: 92, English: 95, Maths: 87, Science: 90, "Social Science": 93 } },
  "1006": { name: "Devi",         dob: "2009-05-28", school: "Govt Hr Sec School", marks: { Tamil: 91, English: 88, Maths: 93, Science: 92, "Social Science": 90 } }
};

const PASS_MARK = 35;

function showPage(id) {
  document.querySelectorAll(".card").forEach(c => c.classList.remove("show"));
  document.getElementById(id).classList.add("show");
}

function getUsers() { return JSON.parse(localStorage.getItem("users")) || {}; }

function register() {
  const name = document.getElementById("regName").value.trim();
  const reg = document.getElementById("regNo").value.trim();
  const dob = document.getElementById("regDob").value;
  const pass = document.getElementById("regPass").value;
  const pass2 = document.getElementById("regPass2").value;
  const msg = document.getElementById("regMsg");
  msg.className = "msg";
  if (!name || !reg || !dob || !pass) { msg.textContent = "Please fill all fields."; return; }
  if (!RESULTS[reg] || RESULTS[reg].dob !== dob) { msg.textContent = "Register Number or DOB is wrong."; return; }
  if (pass.length < 4) { msg.textContent = "Password must be at least 4 characters."; return; }
  if (pass !== pass2) { msg.textContent = "Passwords do not match."; return; }
  const users = getUsers();
  if (users[reg]) { msg.textContent = "Already registered. Please login."; return; }
  users[reg] = { name: name, pass: pass };
  localStorage.setItem("users", JSON.stringify(users));
  msg.className = "msg ok";
  msg.textContent = "Registered successfully! Please login.";
  setTimeout(() => showPage("loginPage"), 1500);
}

function login() {
  const reg = document.getElementById("loginReg").value.trim();
  const pass = document.getElementById("loginPass").value;
  const msg = document.getElementById("loginMsg");
  const users = getUsers();
  if (!reg || !pass) { msg.textContent = "Please enter Register Number and Password."; return; }
  if (!users[reg]) { msg.textContent = "Not registered. Please register first."; return; }
  if (users[reg].pass !== pass) { msg.textContent = "Wrong password."; return; }
  msg.textContent = "";
  localStorage.setItem("loggedIn", reg);
  showResult(reg);
}

function showResult(reg) {
  const user = getUsers()[reg];
  const r = RESULTS[reg];
  document.getElementById("welcome").textContent = "Welcome, " + user.name + " 👋";
  document.getElementById("info").innerHTML =
    "<b>Name:</b> " + user.name + "<br><b>Register No:</b> " + reg +
    "<br><b>Date of Birth:</b> " + r.dob.split("-").reverse().join("-") +
    "<br><b>School:</b> " + r.school;
  let rows = "", total = 0, passed = true;
  for (const sub in r.marks) {
    const m = r.marks[sub];
    total += m;
    if (m < PASS_MARK) passed = false;
    rows += "<tr><td>" + sub + "</td><td>100</td><td class='" + (m < PASS_MARK ? "low" : "") + "'>" + m + "</td></tr>";
  }
  const count = Object.keys(r.marks).length;
  rows += "<tr class='total'><td>Total</td><td>" + count * 100 + "</td><td>" + total + "</td></tr>";
  rows += "<tr class='total'><td>Percentage</td><td colspan='2'>" + (total / count).toFixed(2) + "%</td></tr>";
  document.getElementById("marks").innerHTML = rows;
  const st = document.getElementById("status");
  st.textContent = passed ? "RESULT: PASS 🎉" : "RESULT: FAIL";
  st.className = "status " + (passed ? "pass" : "fail");
  showPage("resultPage");
}

function logout() {
  localStorage.removeItem("loggedIn");
  document.getElementById("loginPass").value = "";
  showPage("loginPage");
}

const saved = localStorage.getItem("loggedIn");
if (saved && getUsers()[saved]) showResult(saved);