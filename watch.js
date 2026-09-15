(() => {
  const projects = {
    kapa: ['KAPA (Cape)', 'https://youtu.be/5bNgEZDk0xw'],
    wedding: ['The Wedding Dance', 'https://youtu.be/Q3P806IMlOY'],
    homework: ['Homework', 'https://drive.google.com/file/d/151UVyO9MoPUKjbGxlaCCM3DnOLfBg2eM/view'],
    panalangin: ['Panalangin (Prayer)', 'https://drive.google.com/file/d/1TuyYkVFZ32XM0R7TM3DcX8swUQcyaZXt/view'],
    tears: ['my tears ricochet', 'https://drive.google.com/file/d/1ipSnHZuuHs8S5C57tDqwmA6i19JcICkn/view'],
    reel: ['Program Promotional Reel', 'https://drive.google.com/file/d/1irbwg-0gjQ1mPLWk_1W-_a0T2Y9CK34Y/view'],
    jordan: ['Michael Jordan DNA', 'https://drive.google.com/file/d/1A3keVkcZqftjoVK0YRqDIcuIhL56foQe/view'],
    education: ['Teacher Education Program', 'https://drive.google.com/file/d/18crirjf6OlJUzYQC1PzKf6l93Xwsa0yN/view'],
    coffee: ['Coffee Painting', 'https://drive.google.com/file/d/1Fgo61jUV5azfS1xIWayfXO3kOMUcSCyk/view']
  };
  const film = new URLSearchParams(location.search).get('film');
  const project = Object.hasOwn(projects, film) ? projects[film] : null;
  const title = document.querySelector('[data-watch-title]');
  const note = document.querySelector('[data-watch-note]');
  const direct = document.querySelector('[data-watch-direct]');
  if (!project) {
    title.textContent = 'Find your next story.';
    note.textContent = 'Choose a film from the portfolio.';
    document.body.classList.add('watch-idle');
    return;
  }
  title.textContent = project[0];
  document.title = `${project[0]} | Jade Philline`;
  note.textContent = 'Opening your selected film…';
  direct.href = project[1]; direct.hidden = false;
  // Only destinations in this fixed portfolio list are allowed; no arbitrary redirect URLs.
  const timer = setTimeout(() => location.replace(project[1]), matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1100);
  direct.addEventListener('click', () => clearTimeout(timer));
  document.querySelector('[data-watch-back]').addEventListener('click', () => clearTimeout(timer));
  addEventListener('pagehide', () => clearTimeout(timer));
})();
