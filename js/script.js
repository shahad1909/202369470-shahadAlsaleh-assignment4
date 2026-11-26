/*
   script.js
   Handles: dark/light theme toggle and saved settings (localStorage), mobile nav toggle,
   smooth scrolling, time-based greeting, contact form (validation, live feedback, animations),
   expandable project details, project filter + sort (saved between visits),
   GitHub repo info and language breakdown (API), visit timer, and footer year.
*/

document.addEventListener('DOMContentLoaded', () => {
  /* Saved settings (localStorage), shared by the theme and the project controls */
  function readSetting(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;   // storage unavailable: behave as if nothing was saved
    }
  }

  function saveSetting(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      // Storage unavailable (e.g. private browsing): the setting still works for this visit
    }
  }

  /* Dark/Light Theme Toggle (saved in localStorage) */
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle.querySelector('.theme-icon');

  function applyTheme(theme) {
    const isDark = theme === 'dark';

    if (isDark) {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }

    themeIcon.textContent = isDark ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }

  // On page load: saved choice first, otherwise follow the device setting
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(readSetting('theme') || (prefersDark ? 'dark' : 'light'));

  // On click: switch theme and remember the choice
  themeToggle.addEventListener('click', () => {
    const newTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    saveSetting('theme', newTheme);
  });

  /*Mobile Navigation Toggle*/
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });

  /* Smooth Scrolling Between Sections */
  const navAnchors = document.querySelectorAll('a[href^="#"]');
  const navbar = document.querySelector('.navbar');

  navAnchors.forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      // Measure the navbar on click (not on page load): this avoids forcing an early
      // layout calculation, and stays correct if the navbar size changes (e.g. rotating a phone)
      const navbarHeight = navbar.offsetHeight;
      const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight + 1;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });

  /*Greeting Message by Time of Day*/
  const greetingEl = document.getElementById('greeting');
  const hour = new Date().getHours();
  let greetingText = 'Hello, welcome!';

  if (hour >= 5 && hour < 12) {
    greetingText = 'Good morning, welcome!';
  } else if (hour >= 12 && hour < 17) {
    greetingText = 'Good afternoon, welcome!';
  } else if (hour >= 17 && hour < 21) {
    greetingText = 'Good evening, welcome!';
  } else {
    greetingText = 'Working late? Welcome!';
  }

  greetingEl.textContent = greetingText;

  /* Contact Form: validation, live feedback, and animations */
  const form = document.getElementById('contact-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const successMsg = document.getElementById('form-success');
  const messageCounter = document.getElementById('message-counter');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const MIN_MESSAGE_LENGTH = 10;
  let successTimer;

  function validateField(input, errorEl, condition, message) {
    if (!condition) {
      input.classList.add('invalid');
      errorEl.textContent = message;
      return false;
    } else {
      input.classList.remove('invalid');
      errorEl.textContent = '';
      return true;
    }
  }

  function validateName() {
    return validateField(
      nameInput, nameError,
      nameInput.value.trim().length >= 2,
      'Name must contain at least 2 characters.'
    );
  }

  function validateEmail() {
    return validateField(
      emailInput, emailError,
      emailPattern.test(emailInput.value.trim()),
      'Please provide a valid email.'
    );
  }

  function validateMessage() {
    return validateField(
      messageInput, messageError,
      messageInput.value.trim().length >= MIN_MESSAGE_LENGTH,
      `Your message must be at least ${MIN_MESSAGE_LENGTH} characters long.`
    );
  }

  // Shake an invalid field once (the class is removed when the animation ends)
  function shakeField(input) {
    input.classList.add('shake');
  }

  [nameInput, emailInput, messageInput].forEach(input => {
    input.addEventListener('animationend', () => {
      input.classList.remove('shake');
    });
  });

  // Live character counter for the message field
  function updateCounter() {
    const length = messageInput.value.trim().length;
    messageCounter.textContent = `${length} / ${MIN_MESSAGE_LENGTH} characters minimum`;
    messageCounter.classList.toggle('is-complete', length >= MIN_MESSAGE_LENGTH);
  }

  messageInput.addEventListener('input', updateCounter);

  // Validate when the user leaves a field, and re-check live once a field has an error
  function addLiveValidation(input, validate) {
    input.addEventListener('blur', () => {
      if (input.value.trim() !== '') {
        validate();
      }
    });

    input.addEventListener('input', () => {
      if (input.classList.contains('invalid')) {
        validate();
      }
    });
  }

  addLiveValidation(nameInput, validateName);
  addLiveValidation(emailInput, validateEmail);
  addLiveValidation(messageInput, validateMessage);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    successMsg.classList.remove('show');
    clearTimeout(successTimer);

    const fields = [
      { input: nameInput, isValid: validateName() },
      { input: emailInput, isValid: validateEmail() },
      { input: messageInput, isValid: validateMessage() }
    ];

    const invalidFields = fields.filter(field => !field.isValid);

    if (invalidFields.length > 0) {
      invalidFields.forEach(field => shakeField(field.input));
      invalidFields[0].input.focus();
      return;
    }

    const firstName = nameInput.value.trim().split(' ')[0];
    successMsg.textContent = `Thanks for reaching out, ${firstName}! I’ve received your message and will reply as soon as possible.`;
    successMsg.classList.add('show');

    form.reset();
    updateCounter();

    successTimer = setTimeout(() => {
      successMsg.classList.remove('show');
    }, 5000);
  });

  /* Expandable Project Details */
  const detailToggles = document.querySelectorAll('.details-toggle');

  detailToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const panel = document.getElementById(toggle.getAttribute('aria-controls'));
      const label = toggle.querySelector('.toggle-label');
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';

      toggle.setAttribute('aria-expanded', String(!isOpen));
      panel.classList.toggle('open', !isOpen);
      label.textContent = isOpen ? 'Show more' : 'Show less';
    });
  });

  /* Project Filter + Sort (both work together) */
  const projectsList = document.querySelector('.projects-list');
  const projectRows = Array.from(projectsList.querySelectorAll('.project-row'));
  const filterButtons = document.querySelectorAll('.filter-btn');
  const sortSelect = document.getElementById('sort-select');
  const emptyState = document.getElementById('empty-state');

  // Current state of the controls (must match the defaults in index.html)
  let currentFilter = 'all';
  let currentSort = 'newest';

  // Returns true if a project should be visible with the current filter
  function matchesFilter(row) {
    return currentFilter === 'all' || row.dataset.category === currentFilter;
  }

  // Compares two projects for .sort():
  // negative → a comes first, positive → b comes first, 0 → keep order
  function compareProjects(a, b) {

    // Sort by name (A–Z)
    if (currentSort === 'name') {
      const nameA = a.querySelector('h3').textContent;
      const nameB = b.querySelector('h3').textContent;
      return nameA.localeCompare(nameB);
    }

    // Sort by GitHub creation date
    const dateA = a.dataset.created;
    const dateB = b.dataset.created;

    // Projects without a date (GitHub request failed) always go last
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;

    // Subtracting dates gives the difference in milliseconds (older first)
    const difference = new Date(dateA) - new Date(dateB);
    return currentSort === 'oldest' ? difference : -difference;
  }

  // Applies the current filter and sort, then updates the page
  function updateProjects() {
    const sortedRows = [...projectRows].sort(compareProjects);
    let visibleCount = 0;

    sortedRows.forEach(row => {
      const isVisible = matchesFilter(row);
      row.hidden = !isVisible;

      if (isVisible) {
        visibleCount++;
        // Number the visible projects in their current order (01, 02, 03...)
        row.querySelector('.project-index').textContent = String(visibleCount).padStart(2, '0');
      }

      // appendChild moves the existing card, so the page follows the sorted order
      projectsList.appendChild(row);
    });

    // Show the message only when no project matches
    emptyState.hidden = visibleCount > 0;
  }

  // Marks one filter button as active (style + screen readers)
  function setActiveFilter(activeButton) {
    filterButtons.forEach(btn => {
      const isActive = btn === activeButton;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });
  }

  // Filter buttons: update the state, save it, and refresh the list
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      currentFilter = button.dataset.filter;
      setActiveFilter(button);
      saveSetting('projectFilter', currentFilter);
      updateProjects();
    });
  });

  // Sort dropdown: update the state, save it, and refresh the list
  sortSelect.addEventListener('change', () => {
    currentSort = sortSelect.value;
    saveSetting('projectSort', currentSort);
    updateProjects();
  });

  // Restore the visitor's last choices, but only if they are still valid options
  const savedFilterButton = document.querySelector(
    `.filter-btn[data-filter="${readSetting('projectFilter')}"]`
  );

  if (savedFilterButton) {
    currentFilter = savedFilterButton.dataset.filter;
    setActiveFilter(savedFilterButton);
  }

  const savedSort = readSetting('projectSort');
  const sortOptions = Array.from(sortSelect.options).map(option => option.value);

  if (sortOptions.includes(savedSort)) {
    currentSort = savedSort;
    sortSelect.value = savedSort;   // show the saved option in the dropdown
  }

  // Show the restored filter right away (GitHub dates will re-sort the list when they arrive)
  updateProjects();

  /* GitHub Repo Info (fetched from the public GitHub API) */
  const repoMetaEls = document.querySelectorAll('.repo-meta[data-repo]');

  function formatDate(isoString) {
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Turns GitHub's { language: bytes } object into percentages, largest first.
  // Keeps the top 3 languages and groups the rest into "Other".
  function getLanguagePercentages(languageBytes) {
    const totalBytes = Object.values(languageBytes).reduce((sum, bytes) => sum + bytes, 0);

    // Empty repo (or no detectable code): nothing to show
    if (totalBytes === 0) {
      return [];
    }

    const languages = Object.entries(languageBytes)
      .map(([name, bytes]) => ({ name, percent: (bytes / totalBytes) * 100 }))
      .sort((a, b) => b.percent - a.percent);   // largest first

    const topLanguages = languages.slice(0, 3);
    const otherPercent = languages
      .slice(3)
      .reduce((sum, language) => sum + language.percent, 0);

    if (otherPercent > 0) {
      topLanguages.push({ name: 'Other', percent: otherPercent });
    }

    return topLanguages;
  }

  // Loads one repo's language breakdown and shows it under the repo info.
  // This is extra information, so if it fails the line is simply not shown.
  async function loadRepoLanguages(metaEl, repo) {
    try {
      const response = await fetch(`https://api.github.com/repos/${repo}/languages`);

      if (!response.ok) {
        throw new Error(`GitHub responded with status ${response.status}`);
      }

      const languages = getLanguagePercentages(await response.json());

      if (languages.length === 0) {
        return;   // nothing to show
      }

      const languagesEl = document.createElement('p');
      languagesEl.className = 'repo-languages';
      languagesEl.textContent = languages
        .map(language => `${language.name} ${language.percent.toFixed(1)}%`)
        .join(' · ');

      metaEl.after(languagesEl);   // place it right below the dates line
    } catch (error) {
      console.warn(`Language breakdown unavailable for ${repo}:`, error);
    }
  }

  async function loadRepoInfo(metaEl) {
    const repo = metaEl.dataset.repo;

    try {
      const response = await fetch(`https://api.github.com/repos/${repo}`);

      if (!response.ok) {
        throw new Error(`GitHub responded with status ${response.status}`);
      }

      const data = await response.json();

      // Save the creation date on the project card so it can be sorted by date later
      const projectRow = metaEl.closest('.project-row');
      projectRow.dataset.created = data.created_at;
      metaEl.textContent = `Created ${formatDate(data.created_at)} · Updated ${formatDate(data.pushed_at)}`;

      // Load the language breakdown in the background (no await, so the dates show right away)
      loadRepoLanguages(metaEl, repo);

    } catch (error) {
      metaEl.textContent = "We couldn't fetch GitHub data. Check your connection, then click Try again.";
      metaEl.classList.add('is-error');
      console.error(`Failed to load GitHub info for ${repo}:`, error);

      // Retry button: reloads only this project's GitHub info
      const retryBtn = document.createElement('button');
      retryBtn.type = 'button';
      retryBtn.className = 'retry-btn';
      retryBtn.textContent = 'Try again';

      retryBtn.addEventListener('click', () => {
        metaEl.classList.remove('is-error');
        metaEl.classList.add('is-loading');
        metaEl.textContent = 'Loading GitHub info…';
        loadRepoInfo(metaEl).then(updateProjects);
      });

      metaEl.append(' ', retryBtn);
    } finally {
      metaEl.classList.remove('is-loading');
    }
  }

  // Load all repos at the same time and keep each request's Promise
  const repoRequests = Array.from(repoMetaEls).map(loadRepoInfo);

  // Wait until every request has finished (success or error) before sorting
  Promise.allSettled(repoRequests).then(() => {
    updateProjects();
  });

  /* Visit Timer: shows how long the visitor has been on the page */
  const visitTimerEl = document.getElementById('visit-timer');
  const visitStart = Date.now();

  // Turns a number of seconds into "45s" or "2m 05s"
  function formatDuration(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (minutes === 0) {
      return `${seconds}s`;
    }

    return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
  }

  // Uses the start time (not a counter), so the value stays correct
  // even if the browser slows timers down in a background tab
  function updateVisitTimer() {
    const elapsedSeconds = Math.floor((Date.now() - visitStart) / 1000);
    visitTimerEl.textContent = `You've been here for ${formatDuration(elapsedSeconds)}`;
  }

  updateVisitTimer();
  setInterval(updateVisitTimer, 1000);

  /* Footer Year */
  document.getElementById('year').textContent = new Date().getFullYear();

});
