# AI Usage Report — Assignment 4

**Student:** Shahad Sultan Alsaleh
**Student ID:** 202369470

---

## 1. Tools Used & Use Cases

### Claude (Anthropic), model: Claude Opus 5.5
I used Claude in two conversations:

- **C01 (main session):** building, testing, and documenting the
  terminal. I shared the course repository and my Assignments 1–3
  repositories, and Claude explained the Assignment 4 requirements in
  Arabic and compared them with what my site already had.
- **C02 (presentation session):** planning the slides, drafting the
  slides and the video script (described in the Presentation section
  below).

How I used Claude in C01:

- **Understanding the requirements:** Claude explained each requirement
  and the rubric in Arabic, and pointed out that half of the grade is on
  documentation and presentation, so we planned time for them.
- **Planning:** we split the work into 11 steps over three days
  (repository → terminal HTML/CSS → JavaScript → mobile → testing →
  documentation → presentation → AI report).
- **Turning my idea into a design:** I suggested a terminal similar to my
  own project. Claude read my File System Simulator repository and
  proposed a portfolio "file system" with the same commands (`ls`, `cd`,
  `pwd`, `cat`, `tree`, `grep`).
- **Fill-in-the-blank code:** for every small step, Claude explained the
  concept first, then gave me the code with numbered blanks (`___1___`)
  and hints. I filled in every blank, sent my answers, and Claude checked
  them before I saved and committed.
- **Code review:** Claude reviewed my `script.js` from Assignment 3 and
  found indentation and spacing problems, which I fixed line by line.
- **Testing:** Claude wrote 44 test cases with the expected results, and
  guided me through Lighthouse, browser testing, and compressing a
  screenshot with Squoosh.
- **Debugging help:** I shared screenshots of DevTools and my Git Bash
  output, and Claude explained what was wrong (see section 4).
- **Git help:** copying my Assignment 3 repository with its history, and
  a commit message for each step, marked with `Assisted-by`.
- **Documentation drafts:** Claude drafted the README, the technical
  documentation, and this report, section by section. I reviewed,
  corrected, and added to them.

---

## 2. Benefits & Challenges

### Benefits

- Whenever a step felt too big, I asked Claude to break it into smaller
  steps and explain them the way a teacher would. Taking one small piece
  at a time helped me understand each idea without getting lost.
- Claude linked new ideas to things I already knew. For example, the
  terminal paths work like the stack I used for `pwd` in my Java
  project, and `tree` uses recursion the same way my Java tree does.
- Filling in the blanks myself made me think about every line. The short
  "why" explanations, such as why `textContent` is safer than
  `innerHTML`, taught me more than the code itself.
- The 44 test cases with expected results kept my testing organized and
  let me check every command quickly.
- I learned to check things on my own, using DevTools (the box model in
  the Computed tab) and the terminal (`git status`, `ls`, `file`).

### Challenges

- By mistake, I cloned the new repository inside my Assignment 3 folder
  and had to move it out.
- My changes did not show up on the live site because of the browser
  cache. At first, I also could not tell whether I was looking at Live
  Server or the live site.
- When I pasted several Git commands at once, the first letter got cut
  off, so nothing was committed.
- Windows hid the real file extension of my screenshot, so `git add`
  could not find the file.
- At first, the blanks came too quickly and some steps introduced too
  many new ideas at once. I felt distracted until we switched to smaller
  steps.

---

## 3. Learning Outcomes

During this assignment, I learned and practised the following concepts and tools:

- **Data structures in JavaScript:** representing a file system as
  nested objects (a folder is an object, a file is a string) and telling
  them apart with `typeof`, the same idea as my Java tree.
- **Recursion:** a function that calls itself for every sub-folder
  (`printTree`, `grepFolder`), and returning a count from a recursive
  function.
- **Objects:** a "command registry" object instead of a long
  `if / else if` chain, `Object.keys`, `Object.entries`, and why
  `Object.hasOwn` is safer than `commands[name]` (inherited names like
  `toString`).
- **Arrays and strings:** destructuring with rest
  (`const [name, ...args]`), `split(/\s+/)`, `join`, `push` / `pop`,
  copying with `[...array]`, `startsWith`, `includes`, `padStart`,
  `padEnd`, `trim`, and `toLowerCase`.
- **Events:** `submit` with `preventDefault()`, `keydown` with `e.key`,
  and `click`; using a `<form>` so Enter works on phones too.
- **Security:** XSS, and why `textContent` is safe and `innerHTML` is not
  for text typed by users.
- **Accessibility:** `aria-live`, `aria-label`, `aria-hidden`,
  `:focus-within`, and avoiding a keyboard trap.
- **CSS:** `white-space: pre-wrap`, `overflow-y: auto`, `:nth-child`,
  `resize: vertical`, the box model in DevTools, and why the `monospace`
  font alone shrinks text.
- **Mobile:** iPhone Safari zooms into inputs under 16px, and
  `autocapitalize="off"` stops the first letter from becoming capital.
- **Testing and tools:** writing test cases, testing on three browser
  engines, Lighthouse, Squoosh image compression, browser cache and hard
  refresh, Live Server vs the live site, and Git (`mv`, `file`,
  `git status`, committing one command at a time).

---

## 4. Responsible Use & Modifications

I filled in every blank in the code myself, tested each step in the
browser, and only committed after it worked. I also made my own decisions
and changes:

- **My idea:** the terminal was my idea, and I chose to connect it to my
  own Java File System Simulator, so it shows my real work.
- **My design choice:** I chose a fixed section on the page instead of a
  button that opens a pop-up.
- **Changed how I used the AI:** when the steps were too big and there
  were too many questions, I asked Claude to split the work into smaller
  steps and explain like a teacher. I wanted to understand, not only to
  finish.
- **Found a bug myself:** while testing, I noticed that the message box
  in the contact form could be dragged outside the form. Claude explained
  the `resize` property, and I fixed it.
- **My own value:** for the terminal height on phones, I chose `280px`
  instead of the suggested `300px`.
- **Checked before adding:** before adding the Testing section to the
  technical documentation, I asked whether it was required, and added it
  after understanding why it matters (the README links to it).
- **Learned from my mistakes:** when I answered `parts` for the
  `updatePrompt` blank, Claude explained that it is not defined in that
  function, and I understood scope and used `currentPath`.
- **Verified with tools, not only trust:** I checked the border with the
  DevTools box model, checked the screenshot type with `file`, and
  confirmed every commit with `git status` and `git push` output.
- **Tested on real devices:** I ran all 44 test cases on the live site,
  and tested on Chrome, Edge, Firefox, and Safari on my iPhone. I took
  and compressed the screenshots myself.
- **Reviewed all documentation:** I read the README, the technical
  documentation, and this report, checked them against what I actually
  did, and wrote my personal motivation in my own words.
- **Kept the documentation accurate:** Claude's first README draft said
  that I found the dark-mode visibility problem, but Claude had noticed
  it in my phone screenshot. We corrected the README so it only lists the
  bug I found myself.

### Presentation (slides, script, and video)

Claude drafted the slides and the video script in a separate
conversation (C02). I reviewed them, asked for changes, and edited them
myself:

- **Script:** I removed the list of Assignment 1–3 features from the
  overview, and a sentence I didn't need in the "What's new" part. The
  first draft of the live demo jumped between sections, so I asked for
  it to follow the site from top to bottom, one section at a time. I
  asked Claude to check whether there was time to name the two bugs that
  were fixed, and added them briefly. I asked how to pronounce the
  terminal commands; Claude suggested giving each command's meaning the
  first time it appears, so viewers who don't know the terminal can
  follow, and I agreed. I asked for the whole script in English in one
  block, because mixed Arabic and English text was hard to read, and for
  an organized copy outside the slides to practise with during the live
  demo.
- **Slides:** I sent Claude my own screenshot of the live site to
  replace the home page screenshot, because the first one did not show
  my real font. Slides 4, 7, and 10 used a dark theme, and I asked for
  them to match the light theme of the other slides. I decided not to
  add more pictures to the Outcomes slide, to keep it clear. I asked for
  my screenshots of the two fixed bugs (the message box
  and the terminal in dark mode) to be added to
  the AI Integration slide; Claude took them from our earlier
  conversation and added them to my edited copy of the slides. I also
  edited the slides myself in PowerPoint: I changed the course name on
  the cover to my section (F12), and adjusted the sizes and spacing
  where there were clear gaps between the text, so the slides look
  consistent.
- **Checked the rules first:** I checked that the requirements allow
  AI for the presentation as long as it is declared.
- **Video:** I recorded the video and the voice myself. No AI was used
  for the voice-over or video editing. I practised with the script to
  keep the video under 7 minutes.

---

## 5. AI Usage Log

| ID | Tool (model) | Date | Purpose | Files affected | What you changed and how you verified it |
|----|--------------|------|---------|----------------|------------------------------------------|
| C01 | Claude (Claude Opus 5.5) | 2026-11-26 to 2026-11-27 | Main session: explaining the requirements and rubric in Arabic, planning, fill-in-the-blank code for every step of the terminal, reviews, testing, debugging, Git help, and documentation drafts. | `index.html`, `css/styles.css`, `js/script.js`, `README.md`, `docs/technical-documentation.md`, `docs/ai-usage-report.md`, `docs/images/` | Filled in all blanks myself; asked for smaller steps; found the message box bug; tested every step in the browser before committing. |
| A01 | Claude (Claude Opus 5.5) | 2026-11-26 | Review of my Assignment 3 `script.js` (indentation and extra blank lines). | `js/script.js` | Fixed each place myself, one at a time, and checked the file still worked. |
| A02 | Claude (Claude Opus 5.5) | 2026-11-26 | Terminal HTML: nav link, section, window, output area, and input form. | `index.html` | Filled in the blanks (`#terminal`, `true`, `polite`, `off`/`false`). Checked the structure in the browser and Elements tab. |
| A03 | Claude (Claude Opus 5.5) | 2026-11-26 | Terminal CSS: section background, window, title bar, output, input line, and `--font-mono`. | `css/styles.css` | Filled in the blanks (`--bg-alt`, `hidden`, `flex`, `50%`, `pre-wrap`, `focus-within`, `1rem`). Checked light and dark mode. |
| A04 | Claude (Claude Opus 5.5) | 2026-11-26 | Terminal JavaScript basics: `submit`, `printLine`, `help`, `clear`, `runCommand`, and the welcome message. | `js/script.js` | Filled in the blanks. Tested `help`, `HELP`, `hello`, `toString`, and `<b>hi</b>` (shown as text). |
| A05 | Claude (Claude Opus 5.5) | 2026-11-26 | File system data, path helpers (`resolvePath`, `getNode`, `formatPath`), `ls`, `cd`, and the prompt. | `js/script.js` | Filled in the blanks; corrected my `parts` answer to `currentPath` after understanding scope. Tested `cd projects`, `cd ..`, `cd about.txt`, and `cd` alone. |
| A06 | Claude (Claude Opus 5.5) | 2026-11-26 | `pwd`, `cat`, and the recursive `tree` and `grep`. | `js/script.js` | Filled in the blanks. Tested each command with correct and wrong input. |
| A07 | Claude (Claude Opus 5.5) | 2026-11-26 | `theme`, `open`, `history`, and ↑/↓ navigation. | `js/script.js` | Filled in the blanks. Tested the theme after a refresh, the links, and the arrow keys. |
| A08 | Claude (Claude Opus 5.5) | 2026-11-26 | Tab autocomplete, captured only when the input has text. | `js/script.js` | Filled in the blanks. Tested completion and that Tab on an empty input moves to the contact form. |
| A09 | Claude (Claude Opus 5.5) | 2026-11-26 | Click-to-focus and mobile styles for the terminal. | `js/script.js`, `css/styles.css` | Filled in the blanks; chose `280px` instead of `300px`. Tested with DevTools (iPhone SE) and on my iPhone. |
| A10 | Claude (Claude Opus 5.5) | 2026-11-26 | Fixes: `resize: vertical` for the message box (bug I found), `1rem` form font (iPhone zoom), and a border for dark mode. | `css/styles.css` | Applied and tested each fix; confirmed the border with the DevTools box model on Live Server. |
| A11 | Claude (Claude Opus 5.5) | 2026-11-26 | 44 terminal test cases with expected results. | `docs/technical-documentation.md` | Ran all 44 on the live site; ran the main ones on Chrome, Firefox, and Safari (iPhone). |
| A12 | Claude (Claude Opus 5.5) | 2026-11-26 to 2026-11-27 | Draft of `README.md`, section by section. | `README.md` | Wrote my personal motivation myself, edited the description, and corrected the "bugs I found" line for accuracy. |
| A13 | Claude (Claude Opus 5.5) | 2026-11-27 | Draft of the technical documentation updates (sections 8–15). | `docs/technical-documentation.md` | Checked the details against my code and added the Testing section after asking whether it was required. |
| A14 | Claude (Claude Opus 5.5) | 2026-11-27 | Draft of this report, section by section. | `docs/ai-usage-report.md` | Edited the benefits and challenges in my own words and checked every statement against what happened. |
| C02 | Claude (Claude Opus 5.5) | 2026-11-27 | Presentation session: slide plan, video script, slides draft, adding the bug screenshots, and help with the final commits. | `presentation/slides.pdf`, `docs/ai-usage-report.md` | Edited the script and slides as described in the Presentation section; recorded the video and voice myself. |
| A15 | Claude (Claude Opus 5.5) | 2026-11-27 | Draft of the video script. | — (used for recording) | Removed the A1–A3 feature list, reordered the demo section by section, added the two bugs and the command meanings. Timed it under 7 minutes. |
| A16 | Claude (Claude Opus 5.5) | 2026-11-27 | Draft of the slides, then adding the two bug screenshots to slide 6. | `presentation/slides.pdf` | Replaced the home page screenshot, made the theme consistent, kept the Outcomes slide simple, and made my own edits. Checked every slide before exporting. |

The full, unedited conversations (C01 and C02) are included in the AI
Evidence ZIP submitted on Blackboard. The original AI outputs before my
edits (A01–A16), including the code templates with blanks, the test
cases, the documentation drafts, the slides draft, and the video script,
are in the `artifacts/` folder of the ZIP.

---

## 6. Declaration

> I declare that this report and the attached evidence document all of my AI use in this assignment, with complete and unedited conversations, and that I understand and can explain all the code I submitted. I understand that undeclared AI use or a false declaration will be treated as plagiarism according to KFUPM regulations.

**Name:** Shahad Sultan Alsaleh
**Student ID:** 202369470
**Date:** 2026-11-27