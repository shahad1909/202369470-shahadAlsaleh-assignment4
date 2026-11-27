# AI Usage Report — Assignment 3

**Student:** Shahad Sultan Alsaleh
**Student ID:** 202369470

---

## 1. Tools Used & Use Cases

### Claude (Anthropic), model: Claude Opus 5.5
I used Claude as a step-by-step tutor for the whole assignment, in one
conversation (C01). I shared the course repository (with the Assignment 3
requirements) and my Assignment 2 repository, and asked Claude to first
explain the assignment in Arabic, then guide me through it one small part
at a time.

- **Understanding the requirements:** Claude explained each section of
  the assignment in Arabic and compared it with what my Assignment 2
  site already had, so I knew exactly what was missing.
- **Planning:** we split the work into 10 steps (repository setup → HTML
  → CSS → JavaScript → performance → documentation) and mapped each step
  to a requirement (API, Complex Logic, State Management, Performance).
- **Fill-in-the-blank code:** for every step, Claude first explained the
  concept, then gave me the code with numbered blanks (`___1___`) and
  hints. I filled in every blank myself, sent my answers back, and
  Claude checked them before I committed. Claude also told me exactly
  which file and line to put each piece of code in.
- **Code review and debugging:** I pasted my full `script.js` and
  screenshots of my editor, DevTools Network tab, and Console, and
  Claude helped me find problems (see section 4).
- **Performance testing:** Claude guided me in publishing the site on
  GitHub Pages and testing it with PageSpeed Insights, then explained
  each Lighthouse warning and how to fix it.
- **Git help:** copying my Assignment 2 repository into the new
  repository with its history, and a commit message for each step.
- **Documentation drafts:** Claude drafted the README, the technical
  documentation, and this report. I reviewed, corrected, and added to
  them.

---

## 2. Benefits & Challenges

### Benefits

- Claude explained the code in Arabic before each step, which made it easier for me to understand the requirements and new concepts.
- Filling in the blanks myself helped me think about the code instead of just copying and pasting it.
- Knowing exactly which file and line to use made adding each feature easier.
- Getting feedback after each step helped me find mistakes before committing my changes.
- I learned how to use DevTools, especially the Network, Console, and Application tabs, and Lighthouse for checking performance.


### Challenges

- Small spelling mistakes in function names, such as writing `updateproject()` instead of `updateProjects()`, caused errors.
- The language percentages did not appear at first, even though my code was correct. I had to use the Network tab to find the problem.
- I reached the GitHub API limit (403) while testing, which made it harder to test the feature.

---

## 3. Learning Outcomes


During this assignment, I learned and practised the following concepts and tools:


- **JavaScript arrays:** `map`, `sort` with a compare function
  (negative / positive / zero), `filter`, `reduce`, `slice`, `includes`,
  `join`, `push`, `Array.from`, and the spread operator `[...]`.
- **Objects:** `Object.values`, `Object.entries`, and destructuring
  (`([name, bytes]) => ...`).
- **Async code:** that `async` functions return Promises, starting
  requests in parallel with `map`, and the difference between
  `Promise.all` and `Promise.allSettled`.
- **DOM:** `dataset` and `data-` attributes, `closest`,
  `createElement`, `after`, `appendChild` moving an existing element,
  and the `hidden` attribute.
- **State management:** keeping the current state in variables, saving
  it in `localStorage`, and validating saved values before using them.
- **CSS:** specificity (`.project-row[hidden]` beating `.project-row`),
  `:focus-visible`, `flex-wrap`, and why `var(--surface)` is better
  than `white` for dark mode.
- **Scope:** a variable declared inside `{ }` does not exist outside it.
- **Performance:** render-blocking resources, `preconnect`, forced
  reflow, and loading only the font weights that are used.
- **Accessibility:** WCAG contrast ratios, the `<main>` landmark, and
  `aria-pressed`.
- **Tools:** GitHub Pages, PageSpeed Insights / Lighthouse, and the
  DevTools Network, Console, and Application tabs.
- **Debugging:** checking the Network tab to tell if a problem is in my
  code or in the data.

---

## 4. Responsible Use & Modifications

I filled in every blank in the code myself, and only committed after
testing each step in the browser. I also made my own decisions and
changes:

- **Rejected an AI suggestion:** Claude suggested showing each
  repository's GitHub star count. I rejected it because stars are almost
  always 0 for student projects, and proposed showing the percentage of
  each programming language instead. Claude then helped me build my idea.
- **Chose a different method:** Claude's hint pointed to
  `Promise.all`; I answered `Promise.allSettled`, which waits for every
  request even if one fails. We kept my choice because it is safer.
- **Found a missing section in the AI's draft:** the first README draft
  left out the Accessibility section. I noticed it and asked for it to
  be added back, updated with the Assignment 3 changes.
- **Investigated a bug with DevTools:** when the language percentages
  did not appear, I checked the Network tab and the Response, and found
  that GitHub returned `{}`. The real cause was that my project
  repositories contained only `.zip` files. I uploaded the real source
  files to all three repositories, so the percentages now work and my
  projects are easier to view on GitHub.
- **My own improvement:** I improved the Try again behavior by using `loadRepoInfo(metaEl).then(updateProjects)`. This makes the project list update after the repository information finishes loading.
- **Tested on a real device:** I opened the live site on my iPhone in
  Safari and checked the main features.
- **Reviewed all documentation:** I read the README, technical
  documentation, and this report, checked them against what I actually
  did, and wrote the parts marked for me in my own words.
  - **Caught an inaccurate AI statement:** Claude said that "Newest" and
  "Oldest" would give a similar order because all repositories were
  created on the same day. I tested it and saw that the orders were
  different, because `created_at` includes the exact time. I corrected
  the technical documentation.

---

### Presentation (slides, script, and video)

Claude drafted the slides and the video script. I reviewed them,
asked for changes, and edited them myself:

- **Script:** I removed the list of Assignment 1–3 features from the
  overview, and a sentence I didn't need in the "What's new" part. The
  first draft of the live demo jumped between sections, so I asked for
  it to follow the site from top to bottom, one section at a time. I
  asked Claude to check whether there was time to name the two bugs I
  found, and added them briefly. I asked how to pronounce the terminal
  commands, and had each command's meaning added the first time it
  appears, so viewers who don't know the terminal can follow. I asked
  for the whole script in English in one block, because mixed Arabic
  and English text was hard to read, and for an organized copy outside
  the slides to practise with during the live demo.
- **Slides:** I replaced the home page screenshot with my own
  screenshot of the live site, because the first one did not show my
  real font. Slides 4, 7, and 10 used a dark theme, and I asked for them
  to match the light theme of the other slides. I decided not to add
  more pictures to the Outcomes slide, to keep it clear. I asked for my
  two bug screenshots (the message box and the terminal in dark mode)
  to be added to the AI Integration slide. I also edited the slides
  myself: [your edits, e.g. the course code on the cover].
- **Checked the rules first:** I checked that the requirements allow
  AI for the presentation as long as it is declared.
- **Video:** I recorded the video and the voice myself. No AI was used
  for the voice-over or video editing. I practised with the script to
  keep the video under 7 minutes ([final length]).

## 5. AI Usage Log

| ID | Tool (model) | Date | Purpose | Files affected | What you changed and how you verified it |
|----|--------------|------|---------|----------------|------------------------------------------|
| C01 | Claude (Claude Opus 5.5) | 2026-11-21 | Full step-by-step session: explaining the requirements in Arabic, planning, fill-in-the-blank code for every step, reviews, debugging, performance testing, Git help, and documentation drafts. | `index.html`, `css/styles.css`, `js/script.js`, `README.md`, `docs/technical-documentation.md`, `docs/ai-usage-report.md`, `docs/images/` | Filled in all blanks myself; rejected the stars idea and proposed the language breakdown; chose `Promise.allSettled`; fixed placement mistakes. Tested every step in the browser and DevTools before committing. |
| A01 | Claude (Claude Opus 5.5) | 2026-11-21 | Step 1: HTML for filter buttons, sort menu, empty-state message, and `data-category`. | `index.html` | Filled in the blanks (categories, `all`, `aria-pressed`, `for`, `oldest`, `hidden`); first answered `ai` for the ML category and changed it to `ml` to match the filter button. Checked the controls in the browser. |
| A02 | Claude (Claude Opus 5.5) | 2026-11-21 | Step 2: CSS for the controls, empty state, hidden projects, and mobile layout. | `css/styles.css` | Filled in the blanks. Tested light and dark mode, keyboard focus (Tab), and mobile width. |
| A03 | Claude (Claude Opus 5.5) | 2026-11-21 | Step 3: saving GitHub dates as `data-created` and waiting for all requests. | `js/script.js` | Filled in the blanks; chose `Promise.allSettled` instead of `Promise.all`. Checked `data-created` in the Elements tab. |
| A04 | Claude (Claude Opus 5.5) | 2026-11-21 | Step 4: filter and sort logic (`matchesFilter`, `compareProjects`, `updateProjects`). | `js/script.js` | Filled in the blanks; fixed `updateproject()` → `updateProjects()`. Tested every filter and sort combination, and the empty state by temporarily changing a category. |
| A05 | Claude (Claude Opus 5.5) | 2026-11-21 | Step 5: shared `readSetting`/`saveSetting` helpers and restoring the saved filter and sort. | `js/script.js` | Filled in the blanks; removed an extra line outside the click handler and leftover comments. Tested with refresh and with an invalid saved value in Local Storage. |
| A06 | Claude (Claude Opus 5.5) | 2026-11-21 | Step 6: visit timer. | `index.html`, `css/styles.css`, `js/script.js` | Filled in the blanks. Tested the timer past one minute and in a background tab. |
| A07 | Claude (Claude Opus 5.5) | 2026-11-21 | Step 7: first a star-count suggestion (rejected), then the language breakdown code. | `js/script.js`, `css/styles.css` | Replaced the stars with my language idea; filled in the blanks. Debugged the empty `{}` response with the Network tab and fixed my project repositories. |
| A08 | Claude (Claude Opus 5.5) | 2026-11-21 | Step 8: project renumbering, font and preconnect changes, contrast colors, `<main>`, and the forced reflow fix. | `index.html`, `css/styles.css`, `js/script.js` | Filled in the blanks; found and fixed a misplaced bracket. Verified with PageSpeed Insights (Accessibility 95 → 100; 100 in all categories on mobile and desktop). |
| A09 | Claude (Claude Opus 5.5) | 2026-11-21 | Draft of `README.md` (two versions). | `README.md` | Noticed the missing Accessibility section; wrote my own sentence in the AI summary; corrected a statement for accuracy. |
| A10 | Claude (Claude Opus 5.5) | 2026-11-21 | Draft of `docs/technical-documentation.md`. | `docs/technical-documentation.md` | Wrote the compatibility testing section myself and checked the technical details against my code. |
| A11 | Claude (Claude Opus 5.5) | 2026-11-21 | Draft of this report. | `docs/ai-usage-report.md` | Wrote the benefits and challenges in my own words, reviewed the learning outcomes list, and checked every statement. |
| C[__] | Claude (Claude Opus 5.5) | 2026-11-27 | Presentation session: slide plan, video script, slides draft, adding the bug screenshots, and help with the final commits. | `presentation/slides.pdf`, `docs/ai-usage-report.md` | Edited the script and slides as described in section 4; recorded the video and voice myself. |
| A[__] | Claude (Claude Opus 5.5) | 2026-11-27 | Draft of the video script. | — (used for recording) | Removed the A1–A3 feature list, reordered the demo section by section, added the two bugs and the command meanings. Timed it under 7 minutes. |
| A[__] | Claude (Claude Opus 5.5) | 2026-11-27 | Draft of the slides, then adding the two bug screenshots to slide 6. | `presentation/slides.pdf` | Replaced the home page screenshot, made the theme consistent, kept the Outcomes slide simple, and made my own edits. Checked every slide before exporting. |

The full, unedited conversation (C01) is included in the AI Evidence ZIP
submitted on Blackboard. The original AI outputs before my edits (A01–A11), including the code templates with blanks and the documentation drafts, are in the `artifacts/` folder of the ZIP.

---

## 6. Declaration

> I declare that this report and the attached evidence document all of my AI use in this assignment, with complete and unedited conversations, and that I understand and can explain all the code I submitted. I understand that undeclared AI use or a false declaration will be treated as plagiarism according to KFUPM regulations.

**Name:** Shahad Sultan Alsaleh
**Student ID:** 202369470
**Date:**  2026-11-21