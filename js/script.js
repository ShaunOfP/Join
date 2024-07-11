/**
 * Injects HTML content into elements with 'w3-include-html' attribute from specified URLs.
 * If fetching fails, displays "Page not found" in the element.
 */
async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html");
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }

  getCurrentSiteForNavbar();
}

/**
 * Sets the active state for the navbar elements based on the current page URL.
 */
function getCurrentSiteForNavbar() {
  let currentURL = window.location.href;
  let currentSite = currentURL.split('/').pop().split('.')[0];

  if (window.innerWidth > 1157) {
    let navElements = document.querySelectorAll('.navStyle');
    navElements.forEach(item => item.classList.remove('activeNavItem'));

    switch (currentSite) {
      case ('summary'):
          var element = document.querySelector('#summaryID');
          element.classList.add('activeNavItem');
        break;
      case ('addtask'):
        var element = document.querySelector('#addtaskID');
        element.classList.add('activeNavItem');
        break;
      case ('board'):
        var element = document.querySelector('#boardID');
        element.classList.add('activeNavItem');
        break;
      case ('contacts'):
        var element = document.querySelector('#contactsID');
        element.classList.add('activeNavItem');
        break;
    }
  } else {
    let navElements = document.querySelectorAll('.navStyleResponsiv');
    navElements.forEach(item => item.classList.remove('activeNavItem-responsive'));

    switch (currentSite) {
      case ('summary'):
        var element = document.querySelector('#responsiveSummaryID');
        element.classList.add('activeNavItem-responsive');
        break;
      case ('addtask'):
        var element = document.querySelector('#responsiveAddtaskID');
        element.classList.add('activeNavItem-responsive');
        break;
      case ('board'):
        var element = document.querySelector('#responsiveBoardID');
        element.classList.add('activeNavItem-responsive');
        break;
      case ('contacts'):
        var element = document.querySelector('#responsiveContactsID');
        element.classList.add('activeNavItem-responsive');
        break;
    }
  }
}


/**
 * Toggles the visibility of the logout menu based on user interactions.
 * Listens for clicks on the entire document. If a click occurs on the user icon
 * or within the logout menu, the menu's visibility is toggled. Clicks outside
 * these areas hide the menu if it is currently visible.
 */
document.addEventListener('DOMContentLoaded', function () {
  document.body.addEventListener('click', function (e) {
    const userLogout = document.getElementById('userLogout');
    const userIcon = document.getElementById('userIcon');

    if (e.target === userIcon || userIcon.contains(e.target) || userLogout.contains(e.target)) {
      userLogout.classList.toggle('d-none');
    } else {
      if (!userLogout.classList.contains('d-none')) {
        userLogout.classList.add('d-none');
      }
    }
  });
});


/**
 * Stores the URL of the current page in local storage, excluding specific pages.
 * Pages like 'help.html', 'privacy-policy.html', and 'legal-notice.html' are not stored.
 * Useful for redirecting users back to their last non-excluded page.
 */
function storeCurrentPage() {
  if (window.location.href.indexOf('help.html') === -1 &&
    window.location.href.indexOf('privacy-policy.html') === -1 &&
    window.location.href.indexOf('legalnotice.html') === -1) {
    localStorage.setItem('currentPage', window.location.href);
  }
}


/**
 * Redirects to the last visited page or the home page.
 * Retrieves the 'currentPage' URL from local storage, set by `storeCurrentPage`.
 * If found, redirects to this URL; otherwise, defaults to 'index.html'.
 */

function backToOrigin() {
  let savedUrl = localStorage.getItem('currentPage');

  if (savedUrl) {
    window.location.href = savedUrl;
  } else {
    window.location.href = 'index.html';
  }
}


/**
 * Displays the username stored in local storage on the webpage.
 * If a username is found, it updates the text content of the element with the id 'greeting-user'
 * to show the username. If not found, it defaults to 'Guest'.
 */

function showUsername() {
  const usernameLocalStorage = localStorage.getItem('username');
  let username = JSON.parse(usernameLocalStorage);
  const greetingUserElement = document.getElementById('greeting-user');

  if (username) {
    greetingUserElement.textContent = `${username}`;
  } else {
    greetingUserElement.textContent = 'Guest';
  }
}


/**
 * Clears all data stored in the browser's local storage.
 * Use with caution as this will remove all locally stored information.
 */

function clearLocalStorage() {
  localStorage.clear();
}

