const state = {
  authority: 74,
  moral: 82,
  selectedContext: "hierarchy",
};

const profiles = {
  q1: {
    code: "Q1 · Integrated",
    title: "Có Uy leadership",
    description:
      "Combines legitimate authority with moral character to foster both compliance and commitment.",
    note: "Authority creates order. Prestige turns compliance into commitment.",
  },
  q2: {
    code: "Q2 · High prestige",
    title: "The nice leader",
    description:
      "Staff may trust the leader, but a lack of clear direction can create role ambiguity.",
    note: "Care is essential, but schools still need clear responsibilities and discipline.",
  },
  q3: {
    code: "Q3 · Low influence",
    title: "Low influence",
    description:
      "When both authority and prestige are low, staff may lose trust, responsibility, and order.",
    note: "A title alone is not enough when a leader cannot provide direction and build trust.",
  },
  q4: {
    code: "Q4 · High authority",
    title: "Authoritarian leadership",
    description:
      "Authority may produce surface-level compliance, but low prestige reduces staff commitment to results.",
    note: "Compliance driven by fear is not the same as sustained effort or an intention to succeed.",
  },
};

const contexts = [
  {
    id: "hierarchy",
    title: "Hierarchy",
    description: "Roles, age, and status make top-down direction a familiar pattern.",
    force: "Strengthens Lý",
    insight:
      "Hierarchical values make legitimate authority appear to be a natural part of the social order.",
  },
  {
    id: "collective",
    title: "Collectivism",
    description: "Loyalty, harmony, and collective interests influence how people behave.",
    force: "Strengthens Tình",
    insight:
      "Collectivism encourages leaders to preserve harmony, care for relationships, and avoid causing loss of face.",
  },
  {
    id: "face",
    title: "Saving face",
    description: "Direct criticism can damage relationships and solidarity within the group.",
    force: "Strengthens Tình",
    insight:
      "Saving face does not mean ignoring a problem. It shapes how a leader chooses the language and setting for a conversation.",
  },
  {
    id: "institution",
    title: "Institutional structures",
    description: "Administrative and political lines of authority legitimize the directive role.",
    force: "Strengthens Lý",
    insight:
      "Administrative and political structures clarify the principal's responsibilities while reinforcing expectations of compliance.",
  },
];

const practices = [
  {
    type: "logic",
    title: "Lý",
    subtitle: "Legitimate authority",
    description: "Establish order through responsibility, rules, and consistency.",
    feedback: "Select a Lý behavior to explore the role of legitimate authority.",
    tags: [
      ["Clear rules", "Clarify boundaries and expectations so staff know what must be done."],
      ["Consistent discipline", "Discipline is effective when applied consistently rather than arbitrarily."],
      ["Assigned responsibility", "Clear responsibilities reduce role ambiguity and improve coordination."],
      ["Work inspections", "Inspections reinforce work habits, but overuse may encourage superficial compliance."],
      ["Decisiveness", "Decisiveness provides direction when the group needs a clear decision."],
    ],
  },
  {
    type: "care",
    title: "Tình",
    subtitle: "Moral prestige",
    description: "Build trust through role modelling, care, and interpersonal competence.",
    feedback: "Select a Tình behavior to explore how moral prestige is built.",
    tags: [
      ["Role modelling", "Consistency between words and actions helps a leader build trust."],
      ["Genuine care", "Concern for individual circumstances deepens a person's bond with the school."],
      ["Saving face", "A considered conversation can address a problem without harming a person's dignity."],
      ["Listening", "Listening supports two-way relationships even when decision-making responsibility remains clear."],
      ["Tolerance", "Consideration and tolerance complement rigor in the workplace."],
    ],
  },
];

const scenarios = [
  {
    title: "Issue a disciplinary notice and immediately introduce close monitoring.",
    resultTitle: "Lý used alone",
    description:
      "This response may improve compliance quickly. However, without dialogue and consistent role modelling, the teacher may change only to avoid punishment.",
    impacts: { Discipline: "+82", Trust: "+28", Commitment: "+42" },
  },
  {
    title: "Speak privately, ask about the circumstances, and offer only a gentle reminder.",
    resultTitle: "Tình prioritized",
    description:
      "A private conversation helps save face and build trust. But if expectations remain unclear, the late arrivals may continue and create a sense of unfairness within the group.",
    impacts: { Discipline: "+46", Trust: "+84", Commitment: "+68" },
  },
  {
    title: "Speak privately, listen to the reasons, and agree on punctuality based on the shared rules.",
    resultTitle: "Lý and Tình combined",
    description:
      "This response combines clear responsibility with care and saving face. The leader still needs to model the expected behavior and follow up consistently to sustain trust.",
    impacts: { Discipline: "+86", Trust: "+88", Commitment: "+84" },
  },
];

const authorityRange = document.querySelector("#authority-range");
const moralRange = document.querySelector("#moral-range");
const authorityOutput = document.querySelector("#authority-output");
const moralOutput = document.querySelector("#moral-output");
const matrix = document.querySelector("#leadership-matrix");
const matrixPoint = document.querySelector("#matrix-point");
const quadrantCode = document.querySelector("#quadrant-code");
const profileTitle = document.querySelector("#profile-title");
const profileDescription = document.querySelector("#profile-description");
const profileNote = document.querySelector("#profile-note");
const outcomeList = document.querySelector("#outcome-list");

function clamp(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getQuadrant() {
  if (state.authority >= 50 && state.moral >= 50) return "q1";
  if (state.authority < 50 && state.moral >= 50) return "q2";
  if (state.authority < 50 && state.moral < 50) return "q3";
  return "q4";
}

function calculateOutcomes() {
  const authority = state.authority;
  const moral = state.moral;
  return [
    ["Compliance", clamp(authority * 0.83 + moral * 0.12)],
    ["Discipline", clamp(authority * 0.9 + moral * 0.04)],
    ["Trust", clamp(moral * 0.88 + authority * 0.07)],
    ["Respect", clamp(moral * 0.68 + authority * 0.25)],
    ["Commitment", clamp(moral * 0.7 + Math.min(authority, moral) * 0.22)],
    ["Emulation", clamp(moral * 0.84 + authority * 0.05)],
  ];
}

function renderProfile() {
  const quadrant = getQuadrant();
  const profile = profiles[quadrant];

  authorityRange.value = state.authority;
  moralRange.value = state.moral;
  authorityOutput.textContent = state.authority;
  moralOutput.textContent = state.moral;
  matrixPoint.style.left = `${state.moral}%`;
  matrixPoint.style.top = `${100 - state.authority}%`;
  matrixPoint.setAttribute(
    "aria-label",
    `Current leadership profile: authority ${state.authority}, moral prestige ${state.moral}`,
  );

  document.querySelectorAll(".quadrant").forEach((item) => item.classList.remove("active"));
  document.querySelector(`.${quadrant}`).classList.add("active");
  quadrantCode.textContent = profile.code;
  profileTitle.textContent = profile.title;
  profileDescription.textContent = profile.description;
  profileNote.textContent = profile.note;
  outcomeList.innerHTML = calculateOutcomes()
    .map(
      ([label, value]) => `
        <div class="outcome">
          <div class="outcome-header"><span>${label}</span><span>${value}%</span></div>
          <div class="bar"><span style="width: ${value}%"></span></div>
        </div>
      `,
    )
    .join("");
}

function updateFromPointer(event) {
  const bounds = matrix.getBoundingClientRect();
  state.moral = clamp(((event.clientX - bounds.left) / bounds.width) * 100);
  state.authority = clamp((1 - (event.clientY - bounds.top) / bounds.height) * 100);
  renderProfile();
}

authorityRange.addEventListener("input", (event) => {
  state.authority = Number(event.target.value);
  renderProfile();
});

moralRange.addEventListener("input", (event) => {
  state.moral = Number(event.target.value);
  renderProfile();
});

matrix.addEventListener("pointerdown", (event) => {
  matrix.setPointerCapture(event.pointerId);
  updateFromPointer(event);
});

matrix.addEventListener("pointermove", (event) => {
  if (matrix.hasPointerCapture(event.pointerId)) updateFromPointer(event);
});

document.querySelector("#reset-profile").addEventListener("click", () => {
  state.authority = 74;
  state.moral = 82;
  renderProfile();
});

function renderContexts() {
  const contextList = document.querySelector("#context-list");
  contextList.innerHTML = contexts
    .map(
      (context, index) => `
        <button class="context-item ${context.id === state.selectedContext ? "active" : ""}"
          type="button" data-context="${context.id}" aria-pressed="${context.id === state.selectedContext}">
          <span class="context-index">0${index + 1}</span>
          <span>
            <h3>${context.title}</h3>
            <p>${context.description}</p>
          </span>
          <span class="context-force">${context.force}</span>
        </button>
      `,
    )
    .join("");

  contextList.querySelectorAll(".context-item").forEach((item) => {
    item.addEventListener("click", () => {
      state.selectedContext = item.dataset.context;
      const selected = contexts.find((context) => context.id === state.selectedContext);
      document.querySelector("#context-insight").textContent = selected.insight;
      renderContexts();
    });
  });
}

function renderPractices() {
  const grid = document.querySelector("#practice-grid");
  grid.innerHTML = practices
    .map(
      (practice) => `
        <article class="practice-column ${practice.type}">
          <div class="practice-heading">
            <h3>${practice.title}</h3>
            <span>${practice.subtitle}</span>
          </div>
          <p>${practice.description}</p>
          <div class="practice-tags">
            ${practice.tags
              .map(
                ([label, feedback]) =>
                  `<button class="practice-tag" type="button" data-feedback="${feedback}">${label}</button>`,
              )
              .join("")}
          </div>
          <p class="practice-feedback">${practice.feedback}</p>
        </article>
      `,
    )
    .join("");

  grid.querySelectorAll(".practice-column").forEach((column) => {
    column.querySelectorAll(".practice-tag").forEach((tag) => {
      tag.addEventListener("click", () => {
        column.querySelectorAll(".practice-tag").forEach((item) => item.classList.remove("active"));
        tag.classList.add("active");
        column.querySelector(".practice-feedback").textContent = tag.dataset.feedback;
      });
    });
  });
}

function renderScenarios() {
  const options = document.querySelector("#scenario-options");
  options.innerHTML = scenarios
    .map(
      (scenario, index) =>
        `<button class="scenario-option" type="button" data-scenario="${index}"><strong>0${index + 1}.</strong> ${scenario.title}</button>`,
    )
    .join("");

  options.querySelectorAll(".scenario-option").forEach((option) => {
    option.addEventListener("click", () => {
      options.querySelectorAll(".scenario-option").forEach((item) => item.classList.remove("active"));
      option.classList.add("active");
      const scenario = scenarios[Number(option.dataset.scenario)];
      document.querySelector("#scenario-result").innerHTML = `
        <span class="scenario-result-label">Choice analysis</span>
        <h3>${scenario.resultTitle}</h3>
        <p>${scenario.description}</p>
        <div class="scenario-impact">
          ${Object.entries(scenario.impacts)
            .map(
              ([label, value]) =>
                `<div class="impact-chip"><span>${label}</span><strong>${value}</strong></div>`,
            )
            .join("")}
        </div>
      `;
    });
  });
}

renderProfile();
renderContexts();
renderPractices();
renderScenarios();
