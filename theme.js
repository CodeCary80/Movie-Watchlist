const themeToggle = document.getElementById('theme-toggle')

// load saved theme on page load
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark')
    themeToggle.textContent = '☀️'
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark')
    const isDark = document.body.classList.contains('dark')
    themeToggle.textContent = isDark ? '☀️' : '🌙 '
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
})