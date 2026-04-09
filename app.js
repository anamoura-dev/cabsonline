document.addEventListener("DOMContentLoaded", function () {
    var navLinks = document.querySelectorAll(".nav-link[data-section]");
    var tabLinks = document.querySelectorAll(".tab-link[data-section]");
    var sections = document.querySelectorAll(".page-section");
    var sidebar = document.getElementById("sidebar");
    var html = document.documentElement;

    var themeBtn = document.getElementById("themeToggle");
    var themeLabel = document.getElementById("themeLabel");
    var themeIcon = document.getElementById("themeIcon");
    var themeBtnMobile = document.getElementById("themeToggleMobile");
    var themeIconMobile = document.getElementById("themeIconMobile");

    var sunIcon = '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
    var moonIcon = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';

    function setTheme(theme) {
        html.setAttribute("data-theme", theme);
        localStorage.setItem("cabsonline_theme", theme);

        var isSun = theme === "dark";
        var icon = isSun ? sunIcon : moonIcon;

        if (themeLabel) themeLabel.textContent = isSun ? "Light Mode" : "Dark Mode";
        if (themeIcon) themeIcon.innerHTML = icon;
        if (themeIconMobile) themeIconMobile.innerHTML = icon;
    }

    var savedTheme = localStorage.getItem("cabsonline_theme") || "dark";
    setTheme(savedTheme);

    function toggleTheme() {
        setTheme(html.getAttribute("data-theme") === "dark" ? "light" : "dark");
    }

    if (themeBtn) themeBtn.addEventListener("click", toggleTheme);
    if (themeBtnMobile) themeBtnMobile.addEventListener("click", toggleTheme);

    function switchSection(sectionId) {
        sections.forEach(function (s) { s.classList.remove("active"); });
        navLinks.forEach(function (l) { l.classList.remove("active"); });
        tabLinks.forEach(function (t) { t.classList.remove("active"); });

        var target = document.getElementById("section-" + sectionId);
        if (target) target.classList.add("active");

        var sidebarLink = document.querySelector('.nav-link[data-section="' + sectionId + '"]');
        if (sidebarLink) sidebarLink.classList.add("active");

        var tabLink = document.querySelector('.tab-link[data-section="' + sectionId + '"]');
        if (tabLink) tabLink.classList.add("active");

        localStorage.setItem("cabsonline_section", sectionId);

        window.scrollTo(0, 0);
    }

    var savedSection = localStorage.getItem("cabsonline_section");
    if (savedSection && document.getElementById("section-" + savedSection)) {
        switchSection(savedSection);
    }

    navLinks.forEach(function (link) {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            switchSection(this.getAttribute("data-section"));
        });
    });

    tabLinks.forEach(function (link) {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            switchSection(this.getAttribute("data-section"));
        });
    });
});
