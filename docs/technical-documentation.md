# Technical Documentation

## Overview
This document covers the technical structure of my portfolio website,
the design decisions behind it, and how it was implemented. Assignment 4
is the final version. It keeps everything from Assignments 1–3 and adds
one creative feature, an **interactive terminal**, along with some final
polish:

1. A terminal section that supports 11 shell-style commands. They run on
   a small in-memory file system built from my portfolio content
   (section 8).
2. Shell features: the prompt shows the current folder, ↑/↓ moves
   through command history, and Tab autocompletes (section 8).
3. Fixes for problems I found during testing: dark-mode visibility, form
   resizing, and zoom on iPhone (section 13).
4. Testing on four browsers, plus 44 test cases for the terminal
   (section 15).

Sections 1–7 cover the foundation built in Assignments 1–3, updated
wherever Assignment 4 changed something. Section 8 covers the terminal.

---

## 1. Technology Stack
- **HTML5**: semantic page structure (`header`, `main`, `section`,
  `footer`), plus ARIA attributes for accessibility.
- **CSS3**: custom properties (variables) for theming, Flexbox, Grid,
  transitions, and `@keyframes` animations.
- **JavaScript (ES6+)**: no frameworks or libraries. All interactivity uses
  plain DOM APIs, `localStorage`, `fetch` with `async/await`,
  `Promise.allSettled`, and array methods (`map`, `sort`, `filter`,
  `reduce`, `slice`, `includes`).
- **GitHub REST API**: two public, read-only endpoints per project
  (`/repos/{repo}` and `/repos/{repo}/languages`), no API key needed.
- **Google Fonts**: Fraunces (headings) and Inter (body text).
- **GitHub Pages**: hosting for the live site.

No build tools, package managers, or external JS libraries are required.

---

## 2. File Structure

| File/Folder | Purpose |
|---|---|
| `index.html` | Main page: Navbar, then a `<main>` with the Hero, About, Achievements, Projects (with filter and sort controls), Terminal, and Contact sections, then the Footer (with the visit timer). A small inline script in `<head>` applies the saved theme before the page is drawn. |
| `css/styles.css` | All styling, organized by section. Theme colors are CSS variables at the top, with a dark palette under `:root[data-theme="dark"]`. |
| `js/script.js` | All interactivity, inside one `DOMContentLoaded` listener and split into commented sections (one per feature). |
| `assets/images/` | Reserved for future images (kept in Git with an empty `.gitkeep` file). |
| `docs/images/` | Lighthouse screenshots (Assignments 3 and 4) and a compressed mobile screenshot of the terminal, used in the README. |
| `docs/ai-usage-report.md` | Documents all AI tool usage, with the usage log and declaration. |
| `docs/technical-documentation.md` | This file. |
| `.gitignore` | Excludes OS files, editor settings, and AI evidence files from the repository. |
| `presentation/` | The presentation slides (`slides.pdf`) and the demo video (`demo-video.mp4`). |

---

## 3. Design System (CSS Variables)

All colors, radii, fonts, and shadows are defined once as CSS custom
properties in `:root`, so every component reads its colors from the same
place:

```css
:root {
  --bg: #fbf6f8;
  --surface: #ffffff;
  --ink: #2b2230;
  --muted: #71646f;
  --rose-deep: #ad4367;
  --error: #af435b;
  ...
}
```

The new Assignment 3 controls (filter buttons, sort menu) only use these
variables, so they adapt to dark mode automatically. For example, the
selected filter button uses `color: var(--surface)`: white text on dark
pink in light mode, and dark text on light pink in dark mode, so the
contrast stays good in both themes.

**Contrast fix (Assignment 3):** Lighthouse reported that some light-mode
text did not meet the WCAG AA contrast ratio of 4.5:1. I darkened three
variables, keeping the same hues:

| Variable | Before | After | Contrast on `--bg` / `--bg-alt` |
|---|---|---|---|
| `--muted` | `#8c7c89` (3.7 / 3.3) | `#71646f` | 5.2 / 4.7 |
| `--rose-deep` | `#c76e8c` (3.3 / 2.9) | `#ad4367` | 5.2 / 4.6 |
| `--error` | `#c15c73` (3.9) | `#af435b` | 5.2 / 4.6 |

Because every component uses the variables, changing three lines fixed
the whole site. The dark theme already passed, so it was not changed.

---
## 4. Responsive Design Approach
- **CSS Grid** is used for each project row (icon | text | link). It
  becomes two columns on tablet and a single column on mobile.
- **Flexbox** is used for the navbar, hero, About section, tag lists, and
  the contact form's error/counter row.
- Two breakpoints:
  - `@media (max-width: 768px)`, tablet: the nav links become a slide-in
    side menu opened by the hamburger button, and project rows switch to
    two columns.
  - `@media (max-width: 480px)`, mobile: project rows stack into one
    column, thumbnails get smaller, and achievements stack vertically.
    The project sort menu also moves under the filter buttons and
    stretches to the full width (Assignment 3).
- The new navbar layout uses `margin-left: auto` on `<nav>` so the links
  and the `.nav-actions` group (theme toggle + hamburger) sit on the right
  on every screen size.

---

## 5. Features Carried Over from Assignment 1

### 5.1 Smooth Scrolling
Internal links (`href="#section"`) are intercepted with a `click`
listener. JavaScript subtracts the sticky navbar's height from the target
position so section titles are never hidden behind the navbar.

**Changed in Assignment 3:** the navbar height (`offsetHeight`) was read
once on page load, which forced the browser to calculate the layout early
(Lighthouse "Forced reflow"). It is now read inside the click handler, so
there is no extra layout calculation on load, and the value is always
current (for example after rotating a phone). The deprecated
`window.pageYOffset` was also replaced with `window.scrollY`.

### 5.2 Mobile Navigation Toggle
The hamburger button toggles an `.open` class on `.nav-links`, which
slides the side menu in and out with a CSS `transform` transition.

### 5.3 Time-Based Greeting
`new Date().getHours()` picks a greeting ("Good morning", "Good
afternoon", etc.) for the hero badge.

---

## 6. Features from Assignment 2

### 6.1 Expandable Project Details
**Requirement covered:** Dynamic Content (show/hide on click), Animation.

**HTML:** each project has a toggle button and a details panel, linked by
`aria-controls` → `id`:

```html
<button class="details-toggle" type="button"
        aria-expanded="false" aria-controls="details-fs">
  <span class="toggle-label">Show more</span>
  <span class="toggle-icon" aria-hidden="true">+</span>
</button>
<div class="project-details" id="details-fs">
  <div class="details-inner">...</div>
</div>
```

**CSS: the smooth slide.** CSS cannot animate `height: auto`, so the panel
is a one-row grid whose row animates from `0fr` (closed) to `1fr` (open,
full content height):

```css
.project-details { display: grid; grid-template-rows: 0fr; visibility: hidden;
                   transition: grid-template-rows 0.25s ease-in-out, visibility 0.25s; }
.project-details.open { grid-template-rows: 1fr; visibility: visible; }
.details-inner { overflow: hidden; min-height: 0; }
```

- `.details-inner` is the single grid item; `min-height: 0` lets it
  shrink to zero and `overflow: hidden` clips the text while it slides.
- `visibility: hidden` stops keyboard and screen-reader users from
  reaching the hidden text. Because it is transitioned too, the text
  stays visible until the closing slide finishes.
- The `+` icon rotates 45° into an `×` using the attribute selector
  `.details-toggle[aria-expanded="true"] .toggle-icon`, so the visual
  state and the accessibility state always match.

**JavaScript:** one `click` listener per button (added with `forEach`):

1. Find the panel with `document.getElementById(toggle.getAttribute('aria-controls'))`.
2. Read the current state from `aria-expanded`.
3. Flip `aria-expanded`, toggle the `.open` class on the panel, and switch
   the label between "Show more" and "Show less".

The label is in its own `<span>`, so changing its text does not remove
the `+` icon.

---
### 6.2 Dark / Light Theme Toggle (localStorage)
**Requirement covered:** Data Handling (save user preferences in
`localStorage`).

**How the theme switches:** the dark palette redefines the same variable
names under a more specific selector:

```css
:root[data-theme="dark"] {
  --bg: #1d1820;
  --ink: #f3eaf0;
  ...
  color-scheme: dark;
}
```

When `<html>` has `data-theme="dark"`, this rule wins by specificity
(pseudo-class + attribute selector beats pseudo-class alone), every
`var(...)` resolves to the dark value, and the whole site changes at
once. `color-scheme: dark` also makes browser-drawn parts such as
scrollbars dark.

**JavaScript logic:**

| Function / step | What it does |
|---|---|
| `applyTheme(theme)` | Adds or removes `data-theme="dark"` on `<html>`, and updates the button icon (🌙 / ☀️) and its `aria-label`. |
| `readSetting('theme')` | `localStorage.getItem('theme')`, which returns `'dark'`, `'light'`, or `null` on a first visit. |
| `saveSetting('theme', theme)` | `localStorage.setItem('theme', theme)`. |
| On page load | Uses the saved theme first. If nothing is saved, follows the device setting with `window.matchMedia('(prefers-color-scheme: dark)')`. |
| On click | Flips the current theme, applies it, and saves it. |

In Assignment 3, the original `getSavedTheme()` / `saveTheme()` were
replaced by the shared `readSetting(key)` / `saveSetting(key, value)`
helpers (see section 7.2), which the project filter and sort also use.

Both storage functions are wrapped in `try/catch`: in some private
browsing modes, `localStorage` throws an error, and without the
`try/catch` the whole script would stop. In that case the theme still
works for the current visit; it just is not remembered.

**Preventing a light flash on load:** `script.js` runs at the end of the
page, so a dark-mode visitor could briefly see the light theme while the
page loads (most visible on slow connections). A small inline script in
`<head>` reads `localStorage` and sets `data-theme="dark"` **before** the
body is drawn. `script.js` still runs afterwards to update the icon and
label, because the button does not exist yet when the head script runs.

---
### 6.3 Live GitHub Repository Info (Public API)
**Requirements covered:** Data Handling (fetch from a public API), Error
Handling (loading indicator and friendly error message).

**HTML:** a placeholder under each project title stores the repository
name in a `data-repo` attribute and starts in a loading state:

```html
<p class="repo-meta is-loading" data-repo="shahad1233/File-System-Simulator">
  Loading GitHub info…
</p>
```

**Request flow (`loadRepoInfo`, an `async` function):**

```
fetch("https://api.github.com/repos/" + repo)
  ├─ response.ok is false (404, 403, 500…) → throw an Error
  └─ response.ok is true → response.json()
       → show "Created <date> · Updated <date>"
catch   → show a friendly red error message + a Try again button, and log details to the console
finally → remove the .is-loading class (stop the pulse)
```

- **`async/await`** lets the page stay responsive while waiting for the
  network. All three requests start at the same time (one per project).
- **`response.ok` check:** `fetch` only rejects on network failures, not
  on HTTP errors such as 404, so the code checks `response.ok` and throws
  its own error for those cases.
- **Dates:** `created_at` and `pushed_at` (the date of the last code
  push, which is more meaningful than `updated_at`, which also changes
  when a repo is starred). Dates are formatted with
  `toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })`,
  for example `June 12, 2026`.
- **Feedback states:**

| State | What the user sees | CSS |
|---|---|---|
| Loading | "Loading GitHub info…" | `.is-loading` → `pulse` animation (opacity 1 → 0.4 → 1, infinite) |
| Success | "Created June 12, 2026 · Updated June 12, 2026" | muted small text |
| Error | "We couldn't fetch GitHub data. Check your connection, then click Try again." plus a Try again button that reloads only that project | `.is-error` → `var(--error)` color |

- **Specificity note:** the selector is `.project-body .repo-meta`
  (two classes) so it overrides the existing `.project-body p` rule
  (one class + one element).
- Each project is handled independently, so one failed request does not
  affect the others.
- **Assignment 3 additions:** a successful request also saves
  `created_at` on the project card as `data-created` (used for sorting,
  section 7.1) and starts the language request (section 7.3). After a
  successful **Try again**, `loadRepoInfo(metaEl).then(updateProjects)`
  re-sorts the list so the newly loaded date is used.

---
### 6.4 Improved Contact Form Feedback
**Requirements covered:** Error Handling (form error messages),
Animation (animated success and error messages).

The Assignment 1 validation rules are unchanged (name ≥ 2 characters,
valid email pattern, message ≥ 10 characters). What changed is **when**
and **how** feedback is shown.

| Behavior | Implementation |
|---|---|
| One validator per field | `validateName()`, `validateEmail()`, `validateMessage()`, each reusing the original `validateField()` helper, so the same rules run on submit, on blur, and while typing. |
| Check on leaving a field | `blur` listener, only if the field is not empty, so tabbing through an empty form does not show errors. |
| Errors clear as soon as fixed | `input` listener that re-validates only while the field has the `.invalid` class. |
| Shake on submit | Invalid fields get a `.shake` class (`@keyframes shake`: ±8px horizontally over 0.7s). An `animationend` listener removes the class so the field can shake again on the next submit. |
| Focus the first error | `invalidFields[0].input.focus()` (uses `Array.filter` to collect the invalid fields). |
| Character counter | `input` listener updates "`n` / 10 characters minimum". It turns green (`.is-complete`) at 10. It uses `.trim().length`, the same as the validator. The minimum lives in one constant, `MIN_MESSAGE_LENGTH`. |
| Personalized success | "Thanks for reaching out, *FirstName*! I’ve received your message and will reply as soon as possible.". Inserted with `textContent` (never `innerHTML`) so user input cannot inject HTML. |
| Success entrance | `@keyframes fade-slide-in` (fade in + slide down 8px). An `animation` is used instead of a `transition` because the element changes from `display: none`, which transitions cannot animate. |
| Reliable auto-hide | The 5-second hide timer is stored in `successTimer` and cleared with `clearTimeout` on every submit, so an old timer cannot hide a newer message early. |
| Counter reset | `updateCounter()` is called after `form.reset()`, because `reset()` does not fire `input` events. |

---

## 7. New Features in Assignment 3

### 7.1 Project Filter + Sort (working together)
**Requirement covered:** Complex Logic (filter and sort at the same time).

**HTML:** each project has a category, and each filter button has a
matching value:

```html
<article class="project-row" data-category="software">...</article>

<button type="button" class="filter-btn active" data-filter="all" aria-pressed="true">All</button>
<button type="button" class="filter-btn" data-filter="software" aria-pressed="false">Software</button>

<select id="sort-select" class="sort-select">
  <option value="newest">Newest first</option>
  <option value="oldest">Oldest first</option>
  <option value="name">Name (A–Z)</option>
</select>

<p class="empty-state" id="empty-state" hidden>No projects in this category yet.</p>
```

**State:** two variables hold the current choices. They start with the
same defaults as the HTML (`all`, `newest`):

```js
let currentFilter = 'all';
let currentSort = 'newest';
```

Keeping both in variables is what lets the two controls work together:
when the sort changes, the current filter is still known, so hidden
projects stay hidden.

**Logic, split into three small functions:**

| Function | Responsibility |
|---|---|
| `matchesFilter(row)` | Returns `true` if `currentFilter === 'all'` **or** the project's `data-category` equals `currentFilter`. |
| `compareProjects(a, b)` | Comparison function for `Array.sort()` (negative → `a` first, positive → `b` first, `0` → keep order). |
| `updateProjects()` | Sorts a copy of the projects, shows/hides each one, renumbers the visible ones, moves them into the new order, and shows the empty-state message if nothing matches. |

**`compareProjects` rules, step by step:**
1. **Name (A–Z):** compare the `<h3>` titles with `localeCompare`, which
   sorts like a dictionary (unlike `<`, which puts every capital letter
   before every lowercase letter).
2. **Projects without a date go last:** if the GitHub request failed,
   the card has no `data-created`. These projects are always placed at
   the end, for both Newest and Oldest, because their position cannot be
   known:
   ```js
   if (!dateA && !dateB) return 0;
   if (!dateA) return 1;    // a goes after b
   if (!dateB) return -1;   // a goes before b
   ```
3. **By date:** subtracting two dates gives the difference in
   milliseconds, which already sorts oldest first. For "Newest first",
   the sign is flipped:
   ```js
   const difference = new Date(dateA) - new Date(dateB);
   return currentSort === 'oldest' ? difference : -difference;
   ```
   Example: A is from 2023 and B from 2024 with "Newest first":
   `difference` is negative, `-difference` is positive, so B (newer)
   comes first.

**`updateProjects()` details:**
- `[...projectRows].sort(compareProjects)` sorts a **copy**, so the
  original array is not changed.
- `row.hidden = !matchesFilter(row)` hides or shows each project.
- `projectsList.appendChild(row)` **moves** the existing card to the end
  of the list (an element cannot be in two places), so appending the
  cards in sorted order puts the page in that order.
- Visible projects are renumbered with
  `String(visibleCount).padStart(2, '0')` (01, 02, 03), so the numbers
  always follow what the visitor sees. The numbers written in the HTML
  remain as a fallback if JavaScript does not run.
- `emptyState.hidden = visibleCount > 0` shows the message only when no
  project matches.

**Filter buttons:** a click updates `currentFilter`, marks the button as
active with `setActiveFilter(button)` (the `.active` class for the style
and `aria-pressed` for screen readers), saves the choice, and calls
`updateProjects()`. The sort menu does the same on its `change` event.

**CSS notes:**
- `.project-row` uses `display: grid`, which overrides the browser's
  default style for the `hidden` attribute, so hidden projects would
  still appear. A stronger selector fixes it:
  ```css
  .project-row[hidden] { display: none; }
  ```
  (class + attribute is more specific than the class alone).
- `:focus-visible` shows an outline only for keyboard users, not on
  mouse clicks.

**Waiting for the GitHub dates:** sorting by date needs every date
first. `loadRepoInfo` is an `async` function, so it returns a Promise.
The requests start together, and the list is sorted again once all have
finished:

```js
const repoRequests = Array.from(repoMetaEls).map(loadRepoInfo);

Promise.allSettled(repoRequests).then(() => {
  updateProjects();
});
```

I chose `Promise.allSettled` instead of `Promise.all`: `Promise.all`
stops at the first rejected Promise, while `allSettled` always waits for
every request. `loadRepoInfo` already catches its own errors, so both
work today, but `allSettled` keeps the sorting working even if that
function changes later.

---

### 7.2 State Management (remembered choices)
**Requirement covered:** State Management.

**Shared storage helpers:** instead of separate theme functions,
Assignment 3 uses two general functions that take the key as a
parameter (avoiding repeated `try/catch` code):

```js
function readSetting(key) {
  try { return localStorage.getItem(key); }
  catch (error) { return null; }          // storage unavailable
}

function saveSetting(key, value) {
  try { localStorage.setItem(key, value); }
  catch (error) { /* still works for this visit */ }
}
```

| Key | Saved value | Saved when |
|---|---|---|
| `theme` | `'dark'` / `'light'` | The theme button is clicked |
| `projectFilter` | `'all'`, `'software'`, `'hardware'`, `'ml'` | A filter button is clicked |
| `projectSort` | `'newest'`, `'oldest'`, `'name'` | The sort menu changes |

**Restoring on load, with validation:** a saved value is only used if
it still matches an existing button or option. For example, if a
category is removed in the future, a visitor with that old value would
otherwise see an empty list:

```js
const savedFilterButton = document.querySelector(
  `.filter-btn[data-filter="${readSetting('projectFilter')}"]`
);
if (savedFilterButton) { ... }            // null → keep "All"

const sortOptions = Array.from(sortSelect.options).map(option => option.value);
if (sortOptions.includes(savedSort)) { ... }   // otherwise keep "Newest"
```

`updateProjects()` is then called immediately, so the saved filter is
visible before the GitHub data arrives.

I tested this by changing `projectFilter` to `xyz` in DevTools
(Application → Local Storage): the page correctly fell back to "All".

---

### 7.3 Language Breakdown (second GitHub API endpoint)
**Requirement covered:** API Integration.

The AI first suggested showing each repository's star count. I chose a
language breakdown instead, because stars are almost always 0 for
student projects, while the languages show what each project is built
with.

**Endpoint:** `GET https://api.github.com/repos/{repo}/languages`
returns the number of bytes of code per language:

```json
{ "Java": 45210, "Shell": 830 }
```

**`getLanguagePercentages(languageBytes)`** turns it into a sorted list:
1. `Object.values(...).reduce(...)` adds up the total bytes. If it is
   `0`, it returns an empty list.
2. `Object.entries(...)` gives `[name, bytes]` pairs, which `map`
   converts to `{ name, percent }`.
3. `sort((a, b) => b.percent - a.percent)` puts the largest first.
4. `slice(0, 3)` keeps the top 3, and the rest (`slice(3)`) are added
   together as **"Other"**, so the line stays short.

Example: `{ Python: 800, HTML: 100, CSS: 60, JavaScript: 30, Shell: 10 }`
→ `Python 80.0% · HTML 10.0% · CSS 6.0% · Other 4.0%`.

**`loadRepoLanguages(metaEl, repo)`** fetches the data, builds a new
`<p class="repo-languages">` with `document.createElement`, joins the
parts with `' · '` (using `toFixed(1)` for one decimal place), and
inserts it under the dates with `metaEl.after(...)`.

**Design decisions:**
- **Graceful degradation:** the languages are extra information, so if
  this request fails, the line is simply not shown and a
  `console.warn` (not `console.error`) is logged. The dates still work.
- **Started only after the dates succeed:** if the first request fails,
  GitHub is probably unreachable or rate-limited, so a second request
  would fail too.
- **No `await`:** `loadRepoLanguages` is called without `await`, so the
  dates appear immediately and the languages appear when ready.

---

### 7.4 Visit Timer
**Requirement covered:** Complex Logic (timer).

The footer shows "You've been here for 45s", then "2m 05s".

- The start time is saved once with `Date.now()`. Every second
  (`setInterval(updateVisitTimer, 1000)`), the elapsed time is
  calculated as `Date.now() - visitStart`. This is more accurate than
  adding 1 to a counter, because browsers slow down timers in
  background tabs, which would make a counter fall behind.
- `formatDuration(totalSeconds)`: minutes with `Math.floor(total / 60)`,
  remaining seconds with `total % 60`. Under one minute it shows only
  seconds; otherwise the seconds are padded with `padStart(2, '0')`.
- `updateVisitTimer()` is also called once immediately, so the text
  appears without waiting one second.
- `aria-live="off"` stops screen readers from reading the number every
  second, and `font-variant-numeric: tabular-nums` gives every digit the
  same width so the text does not shake.

---

## 8. New in Assignment 4: Interactive Terminal

The terminal is a web version of my Java File System Simulator. It lives
in its own section between Projects and Contact, and all of its code is
inside the same `DOMContentLoaded` listener in `script.js`, so it can
reuse `applyTheme()` and `saveSetting()` from the theme feature.

### 8.1 HTML Structure

```
section#terminal
└── div.terminal-window
    ├── div.terminal-bar        (three dots + title, aria-hidden)
    ├── div#terminal-output     (results, aria-live="polite")
    └── form#terminal-form
        ├── span#terminal-prompt  (aria-hidden)
        └── input#terminal-input  (aria-label="Terminal command")
```

The input is inside a `<form>`, so pressing **Enter** (or **Go** on a
phone keyboard) fires one `submit` event. The handler calls `e.preventDefault()`
so the page does not reload.
The input turns off `autocomplete`, `spellcheck`, and `autocapitalize`, so commands are not
underlined or capitalized on phones.

### 8.2 The File System (data)

The portfolio is stored as nested objects, the same idea as the tree in
my Java project: **a folder is an object** (name → content) and **a file
is a string** (its text). `typeof` tells them apart.

```js
const fileSystem = {
  'about.txt': '...',
  'skills.txt': '...',
  'achievements.txt': '...',
  'contact.txt': '...',
  projects: {
    'file-system-simulator.txt': '...',
    'smart-pedestrian-crossing.txt': '...',
    'mobile-price-classification.txt': '...'
  }
};
```

Each file is written as an array of lines joined with `'\n'`, and the
output uses `white-space: pre-wrap`, so line breaks and the spacing in
`tree` are kept.

### 8.3 Command Registry

All commands live in one `commands` object. Each command has a
`description` and a `run(args)` function:

```js
const commands = {
  help: { description: 'Show all available commands', run() { ... } },
  ls:   { description: 'List files and folders ...', run(args) { ... } },
  // ...
};
```

This avoids a long `if / else if` chain. `help` builds its list from the same object with `Object.entries`, 
so any new command shows up in `help` automatically.
 Descriptions are aligned in one column with `padEnd(10)`,
which works because the font is monospace.

### 8.4 From Input to Output

```
Enter pressed
   → submit event, preventDefault()
   → trim the input (empty → do nothing)
   → save it in commandHistory
   → print the prompt + command (green line)
   → runCommand(input)
        → split(/\s+/) into [name, ...args]
        → name.toLowerCase()
        → Object.hasOwn(commands, name)?
             yes → commands[name].run(args)
             no  → "command not found: ..." (error line)
```

Every line is added by one helper, `printLine(text, type)`. 
It creates a `<p>`, sets its `textContent`, adds a class (`command` or `error`) for the color, 
and then scrolls the output to the bottom
(`scrollTop = scrollHeight`). A welcome message is printed when the page
loads and again after `clear`, so the screen is never empty.

### 8.5 Paths and the Current Folder

The current folder is an array of folder names: `[]` is home (`~`) and
`['projects']` is `~/projects`, similar to the stack used for `pwd` in my
Java project. Three helpers are shared by all commands:

| Function | Job | Example |
|---|---|---|
| `resolvePath(text)` | Turns typed text into a full path array. `..` removes the last folder (`pop`), a name adds it (`push`), `~` or `/` at the start begins from home. It works on a copy (`[...currentPath]`), so a wrong path never changes the current folder. | in `~/projects`, `".."` → `[]` |
| `getNode(parts)` | Walks the file system along the path and returns the folder, the file, or `null` if it does not exist. | `['projects']` → the projects object |
| `formatPath(parts)` | Turns a path array into text for `pwd` and the prompt. | `['projects']` → `"~/projects"` |

`cd` updates `currentPath` and then calls `updatePrompt()`, so the prompt
always shows the current folder.

### 8.6 Recursion: `tree` and `grep`

Folders can contain folders, so both commands use a function that calls
itself for every sub-folder:

- `printTree(folder, indent)` prints each item with `├──`, or `└──` for
  the last one (`index === names.length - 1`), and adds `│   ` or spaces
  to the indent before going one level deeper.
- `grepFolder(folder, prefix, word)` splits each file into lines and
  prints every line that `includes` the word (both lowercased, so the
  search is not case-sensitive). It returns how many lines matched, so
  the command can say "no results" instead of printing nothing.

`grep` joins all arguments into one search phrase (`grep machine learning`) and removes quotes, 
so `grep "java"` also works, the same way it does in my Java project.

### 8.7 Connected to the Rest of the Site

- `theme dark | light` calls the same `applyTheme()` and
  `saveSetting()` as the theme button, so the whole page changes and the
  choice is remembered. Typing `theme` on its own toggles between the two, just like the button.
- `open <name>` looks up a `links` object and calls
  `window.open(url, '_blank', 'noopener')`. The link names are the project file names without `.txt`, but typing the name with `.txt` works too.

### 8.8 Command History (↑ / ↓)

Every command is pushed into `commandHistory`, and `historyIndex` points
just after the newest one. A `keydown` listener moves the index: ↑ shows
older commands, ↓ newer ones, and going past the newest empties the
input. `e.preventDefault()` keeps the cursor at the end of the text.
`history` prints the list numbered with `padStart`.

### 8.9 Tab Autocomplete

Tab completes the **last word**, using different options depending on
where it is:

| Position | Options |
|---|---|
| First word | Command names (`Object.keys(commands)`) |
| After `open` | Link names (`Object.keys(links)`) |
| Anything else | Files and folders in the folder before the last `/` (folders get a trailing `/`) |

If there is one match, the word is completed; if there are several, they are all printed. To avoid a
**keyboard trap**, Tab is only captured when the input has text; when it
is empty, Tab moves focus to the next element as usual. When it looks up the folder to complete from, the code checks `!folder` first, 
because in JavaScript `typeof null` is also `"object"`, so a missing folder would otherwise look like a real one.

### 8.10 Security and Robustness

- **XSS protection:** all output uses `textContent`, never `innerHTML`,
  so typing `<b>hi</b>` shows the text instead of running it as HTML.
- **Built-in names:** commands, paths, and links are checked with
  `Object.hasOwn`, so names inherited by every object (like `toString`)
  are treated as unknown instead of crashing.
- The terminal does not use the GitHub API, so it works even when the
  API limit is reached or the visitor is offline.

### 8.11 Styling Decisions

- The window is **always dark**, like a real terminal; the three dots use
  the site's rose, sand, and sage colors to keep the same identity. A 1px
  border keeps the window visible in dark mode.
- The font is a new `--font-mono` variable
  (`ui-monospace, Menlo, Consolas, monospace`). Real font names come
  first because `monospace` alone makes browsers shrink the text.
- The browser's input outline is removed, and `:focus-within` colors the
  input line instead, so keyboard users still see the focus.
- The output has `max-height` with `overflow-y: auto` (280px on phones),
  and the input stays at `1rem` (16px) so iPhone Safari does not zoom.

---

## 9. Accessibility
- All interactive controls are real `<button>` elements (keyboard
  accessible by default).
- `aria-expanded` + `aria-controls` on the project toggles.
- `aria-pressed` on the filter buttons, so screen readers know which
  filter is selected (Assignment 3).
- `:focus-visible` outlines on the filter buttons and sort menu for
  keyboard users (Assignment 3).
- `<label for="sort-select">` connects the "Sort by" text to the menu.
- `aria-label` on icon-only buttons (theme toggle, hamburger), updated by
  JavaScript when the theme changes.
- `aria-hidden="true"` on decorative icons and emojis.
- `aria-describedby` links the message field to its character counter.
- `role="status"` + `aria-live="polite"` on the success message, so
  screen readers announce it; `aria-live="off"` on the visit timer.
- Light-mode colors meet the WCAG AA contrast ratio (section 3), and the
  sections are inside a `<main>` landmark (Assignment 3). Together these
  raised the Lighthouse Accessibility score from 95 to 100.
- `@media (prefers-reduced-motion: reduce)` disables all transitions
  and animations.
  - **Terminal (Assignment 4):** `aria-live="polite"` on the output, so
  each new result is read out; `aria-label="Terminal command"` on the
  input; `aria-hidden="true"` on the decorative title bar and the prompt
  text, so screen readers do not read symbols like `~$` before every
  command.
- **No keyboard trap:** Tab only autocompletes when the terminal input
  has text, so keyboard users can always move on (section 8.9).
- `:focus-within` highlights the terminal input line in rose, replacing
  the removed input outline (section 8.11).

---

## 10. Error Handling Summary

| Situation | How the site responds |
|---|---|
| GitHub API unreachable, repo not found, or rate limit reached (403) | Friendly message in red with a Try again button; details logged with `console.error`. Other projects still load. After a successful retry, the list is re-sorted. |
| Language request fails, or GitHub detects no code | The language line is not shown; a `console.warn` is logged. |
| Some projects have no date | They are placed last when sorting by date. |
| No project matches the filter | "No projects in this category yet." is shown. |
| Saved filter/sort value is no longer valid | Ignored; the default (All / Newest) is used. |
| `localStorage` unavailable | Caught with `try/catch`; everything still works for the current visit. |
| Invalid or empty form field | Inline error message, red border, shake, and focus moved to the first invalid field. |
| Unknown terminal command (including built-in names like `toString`) | `command not found: <name>. Type "help" to see all commands.` in the error color. |
| Path does not exist (`ls`, `cd`, `cat`) | `<command>: <path>: No such file or directory` |
| `cd` into a file / `cat` a folder | `Not a directory` / `Is a directory`, like Linux. |
| Missing argument (`cat`, `grep`) | A short usage hint, e.g. `Try: cat about.txt`. |
| `grep` finds nothing | `grep: no results for "<word>"` |
| Unknown theme or link name | The message lists the valid choices. |
| Empty input | Nothing happens (no empty line is printed). |
| HTML typed into the terminal | Shown as plain text (`textContent`), never run. |

---

## 11. Performance

Tested with PageSpeed Insights (Lighthouse) on the live GitHub Pages site.

| | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| Mobile, before | 100 | 95 | 100 | 100 |
| Mobile, after | 100 | 100 | 100 | 100 |
| Desktop, after | 100 | 100 | 100 | 100 |

Performance was already 100, but Lighthouse listed improvement
opportunities, which I fixed:

| Lighthouse insight | Cause | Fix |
|---|---|---|
| Render-blocking requests (≈690 ms) | Google Fonts loaded 8 font weights, but only 5 are used | Load only Fraunces 500/600 and Inter 400/500/600 (3 fewer font files) |
| Network dependency tree | The font files come from a second server (`fonts.gstatic.com`) that was only contacted late | `<link rel="preconnect">` to `fonts.gstatic.com` (with `crossorigin`) and to `api.github.com` |
| Forced reflow | `offsetHeight` read on page load | Read the navbar height on click instead (section 5.1) |
| Efficient cache lifetimes | GitHub Pages sets a 10-minute cache | Not changeable on GitHub Pages (server setting) |

Other performance choices:
- No frameworks or libraries; only three small files plus fonts.
- The language breakdown reuses the same repositories and runs in the
  background, and all GitHub requests are sent in parallel (`map` starts
  them together), so the total wait is about one request, not six in a row.
- The filter and sort move existing elements instead of rebuilding the
  HTML, and the duplicate sort listener left over from development was
  removed so `updateProjects()` runs once per change.
- Animations use `transform` and `opacity`; transitions list their
  properties instead of `all`.

The Performance score varies slightly between runs (98–100), depending on
network conditions at the time of the test.


### Assignment 4 results

Re-tested on the live site after adding the terminal. Adding the new
section did not lower any score:

| | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| Mobile | 100 | 100 | 100 | 100 |
| Desktop | 100 | 100 | 100 | 100 |

Performance choices for Assignment 4:
- The terminal adds no libraries, no extra files, and no network
  requests: its content is stored in `script.js`, and it reuses the
  existing theme functions.
- Output lines are added one by one with `append`, instead of rebuilding
  the whole output with `innerHTML`.
- The mobile screenshot in the README was resized from 1290px to 600px
  wide and compressed with Squoosh (MozJPEG), from about 270 KB to 51 KB.

---

## 12. Browser Compatibility

The live site was tested on the three main browser engines, in light and
dark themes, with the terminal test cases from section 15:

| Browser | Engine | Device | Result |
|---|---|---|---|
| Google Chrome | Chromium | Windows laptop | ✅ All features work |
| Microsoft Edge | Chromium | Windows laptop | ✅ All features work |
| Mozilla Firefox | Gecko | Windows laptop | ✅ All features work |
| Safari | WebKit | iPhone | ✅ All features work |

I also used DevTools device emulation (iPhone SE) while building the
mobile styles, and tested with keyboard-only navigation. All features use
standard, widely supported APIs (CSS variables, Grid, Flexbox,
`:focus-within`, `fetch`, `async/await`, `Promise.allSettled`,
`localStorage`, `Object.hasOwn`).

---

## 13. Debugging Notes

**Language percentages did not appear.** The code had no errors, so I
checked the Network tab: the `/languages` requests returned status
`200`, but the response was `{}`. The code handled this correctly
(`languages.length === 0` → show nothing). The real cause was that my
three project repositories contained only `.zip` files and a README, and
GitHub cannot detect languages inside a zip. I uploaded the actual
source files and deleted the zips, and the percentages appeared (Java,
Jupyter Notebook, Verilog). This also explains why, in Assignment 2, the
API returned `null` as the main language for all three repositories.

**GitHub error 403 while testing.** After many refreshes (with
"Disable cache" on), GitHub returned `403` because the 60-requests-per-hour
limit was reached. The site showed the friendly error and Try again
button as designed. I waited and used PageSpeed Insights, which runs
from Google's servers, in the meantime.

**A misplaced bracket stopped all JavaScript.** When adding the project
renumbering, I placed a line outside its `if` block, leaving an extra
`}`. The editor highlighted the error in red, and I fixed it before
testing.

**Duplicate event listener.** A review found that the old sort listener
from step 4 was still in the file next to the new one, so
`updateProjects()` ran twice per change. I removed the old one.


### Assignment 4

**Issues found while testing the terminal (and fixed):**

| Issue | Fix |
|---|---|
| In dark mode, the terminal window blended into the page background. | Added a 1px border (`#3a3140`) around the window. |
| The contact message box could be dragged wider than the form. | `resize: vertical` and `max-width: 100%` on the textarea. |
| iPhone Safari zoomed in when a form field was focused, because its font was under 16px. | Set the form fields' font size to `1rem`. |

**My changes did not appear on the live site.** After a push, the live
site still showed the old CSS because the browser used its cached copy.
A hard refresh (`Ctrl + Shift + R`) loaded the new file. While editing, I
test on Live Server, which reloads on every save; the live site is only
for final testing.

**The border seemed missing.** I used DevTools (Inspect, then the
Computed tab and the box model) and saw the border was `0`. I had been
looking at the live site, which did not have the change yet. On Live
Server the box model showed `1`, and the border was there.

**Screenshot file name.** `git add` could not find
`terminal-mobile.webp`. `ls` showed the real name was
`terminal-mobile.webp.jpg`, because Windows hides file extensions, and
the `file` command showed it was a JPEG. I renamed it with `mv` to
`terminal-mobile.jpg`.

**A pasted command lost its first letter.** Pasting three Git commands at
once turned `git add` into `it add` (`command not found`), so nothing was
committed. I now run Git commands one at a time and check each result.

---

## 14. Known Limitations / Future Improvements
- **GitHub API rate limit:** unauthenticated requests are limited to 60
  per hour per IP address, and each page load uses 6 (2 per project).
  If the limit is reached, the friendly error message is shown.
- **Cache lifetime** is controlled by GitHub Pages and cannot be changed.
- **No backend:** the contact form validates and confirms, but does not
  send the message anywhere (matches the assignment scope).
- **Future improvement, caching GitHub responses:** saving the API
  responses in `localStorage` for about an hour would make repeat visits
  faster and avoid the rate limit.
- **Future improvement:** store a real project date in the HTML (for
  example `data-date`) so sorting reflects when each project was done.
- **Terminal content is static:** the files are written in `script.js`,
  so updating my portfolio means editing them in two places (the page and
  the terminal). A future improvement is to generate the files from the
  page content.
- **Read-only file system:** unlike my Java project, the terminal has no
  `mkdir`, `touch`, or `rm`. A future version could allow them for the
  current visit only.
- **Tab with text keeps focus in the terminal:** to leave, keyboard users
  clear the input first (or use Shift+Tab). This is mentioned in the
  README user guide.
- **Future improvement:** a `grep` built on the KMP algorithm from my Java
  project, and colored output for folders in `ls`.


---

## 15. Testing

All 44 test cases were run on the live GitHub Pages site (Edge), and the
main ones again on Chrome, Firefox, and Safari on iPhone. All passed.

| # | Input / action | Expected result |
|---|---|---|
| TC-01 | Open the page | Welcome message and a hint to type `help` |
| TC-02 | Press Enter with an empty input | Nothing happens |
| TC-03 | `help` | `Available commands:` and 11 commands, descriptions aligned |
| TC-04 | `HELP` | Same as TC-03 (not case-sensitive) |
| TC-05 | `hello` | `command not found: hello. Type "help" to see all commands.` |
| TC-06 | `toString` | Same error, no crash |
| TC-07 | `<b>hi</b>` | Same error, the tags shown as plain text |
| TC-08 | `pwd` | `~` |
| TC-09 | `ls` | The 4 files and `projects/` |
| TC-10 | `ls about.txt` | `about.txt` |
| TC-11 | `ls hello` | `ls: hello: No such file or directory` |
| TC-12 | `cd projects` | Prompt becomes `shahad@portfolio:~/projects$` |
| TC-13 | `pwd` | `~/projects` |
| TC-14 | `cat ~/about.txt` | The about file, from inside `projects` |
| TC-15 | `cd ..` | Prompt back to `~` |
| TC-16 | `cd ../..` | Stays at `~`, no error |
| TC-17 | `cd about.txt` | `cd: about.txt: Not a directory` |
| TC-18 | `cd projects`, then `cd` | Back to `~` |
| TC-19 | `cat projects` | `cat: projects: Is a directory` |
| TC-20 | `cat` | `cat: missing file name. Try: cat about.txt` |
| TC-21 | `cat projects/file-system-simulator.txt` | 3 lines about the project |
| TC-22 | `tree` | The full tree, with `projects/` and its 3 files indented |
| TC-23 | `grep java` | 3 lines (2 in `skills.txt`, because of "JavaScript", and 1 project) |
| TC-24 | `grep "SVM"` | 1 line from the mobile price project |
| TC-25 | `grep machine learning` | 1 line from `skills.txt` |
| TC-26 | `grep pizza` | `grep: no results for "pizza"` |
| TC-27 | `grep` | `grep: missing word. Try: grep java` |
| TC-28 | `theme dark` | Whole site dark, button shows ☀️, `Theme changed to dark.` |
| TC-29 | Refresh the page | Still dark |
| TC-30 | `theme` | Switches to light |
| TC-31 | `theme blue` | Error listing `dark` and `light` |
| TC-32 | `open github` | GitHub profile in a new tab |
| TC-33 | `open` | Error listing the 4 link names |
| TC-34 | `open file-system-simulator.txt` | Opens the repository (`.txt` accepted) |
| TC-35 | `clear` | Screen cleared, welcome message shown again |
| TC-36 | `history` | All typed commands, numbered from 1 |
| TC-37 | ↑ twice, then ↓ twice | Older commands appear, then the input is empty |
| TC-38 | `he` + Tab | Completes to `help` |
| TC-39 | `c` + Tab | Prints `clear   cd   cat` |
| TC-40 | `cat projects/sm` + Tab | Completes to `cat projects/smart-pedestrian-crossing.txt` |
| TC-41 | `open mo` + Tab | Completes to `open mobile-price-classification` |
| TC-42 | Empty input + Tab | Focus moves to the contact form's Name field |
| TC-43 | Click the title bar | The cursor goes to the input |
| TC-44 | Open the Console | No errors |