const themeStorageKey = 'cddCldThemeMode';
const themeModes = ['system', 'dark', 'light'];

function prefersDarkMode() {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches;
}

function resolveThemeMode(mode) {
    return themeModes.includes(mode) ? mode : 'system';
}

function applyThemeMode(mode) {
    const resolvedMode = resolveThemeMode(mode);
    const isDarkMode = resolvedMode === 'dark' || (resolvedMode === 'system' && prefersDarkMode());
    const toggle = document.querySelector('.theme-toggle-btn');
    const icon = toggle?.querySelector('i');
    const indicator = toggle?.querySelector('.theme-mode-indicator');

    document.documentElement.classList.toggle('light-mode', !isDarkMode);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isDarkMode ? '#121521' : '#ecebeb');

    if (icon) icon.className = `fa-solid ${{ system: 'fa-gear', dark: 'fa-moon', light: 'fa-sun' }[resolvedMode]}`;
    if (indicator) indicator.textContent = { system: 'S', dark: 'D', light: 'L' }[resolvedMode];

    if (toggle) {
        toggle.setAttribute('aria-label', `Theme: ${resolvedMode}`);
        toggle.title = `Theme: ${resolvedMode} - click to cycle`;
    }

    return resolvedMode;
}

let currentThemeMode = applyThemeMode(localStorage.getItem(themeStorageKey) || 'system');

document.querySelector('.theme-toggle-btn')?.addEventListener('click', () => {
    const nextMode = themeModes[(themeModes.indexOf(currentThemeMode) + 1) % themeModes.length];
    localStorage.setItem(themeStorageKey, nextMode);
    currentThemeMode = applyThemeMode(nextMode);
});

window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (!localStorage.getItem(themeStorageKey)) currentThemeMode = applyThemeMode('system');
});