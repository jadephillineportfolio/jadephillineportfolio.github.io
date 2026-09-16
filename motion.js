(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const root = document.documentElement;
  const intro = document.querySelector('[data-brand-intro]');
  let scrollFrame = 0;

  // Let the signature draw and settle before the homepage fades in.
  // The homepage fades in for 1.8 seconds after the 2.7-second logo hold.
  // Clear the overlay after the CSS fade finishes at 4.5 seconds.
  if (intro && !reduce.matches && performance.getEntriesByType('navigation')[0]?.type !== 'back_forward') {
    intro.hidden = false;
    setTimeout(() => { intro.hidden = true; }, 4600);
  }
  window.addEventListener('pageshow', event => { if (event.persisted && intro) intro.hidden = true; });

  function paintAtmosphere() {
    scrollFrame = 0;
    const range = Math.max(1, root.scrollHeight - innerHeight);
    const progress = Math.min(1, Math.max(0, scrollY / range));
    root.style.setProperty('--drift-x', `${(progress - .5) * 22}vw`);
    root.style.setProperty('--drift-y', `${(progress - .5) * 34}vh`);
    root.style.setProperty('--gradient-position', `${progress * 100}%`);
  }
  function queueAtmosphere() {
    if (!reduce.matches && !scrollFrame) scrollFrame = requestAnimationFrame(paintAtmosphere);
  }
  window.addEventListener('scroll', queueAtmosphere, {passive:true});
  window.addEventListener('resize', queueAtmosphere, {passive:true});
  queueAtmosphere();

  const caseSection = document.querySelector('#featured-project');
  const caseLayers = [...document.querySelectorAll('.case-atmosphere')];
  let caseLayer = 0, caseSource = null, caseReset;
  function illuminateCase(aura) {
    if (!caseSection?.contains(aura) || !caseLayers.length) return;
    clearTimeout(caseReset);
    if (caseSource === aura) return;
    caseSource = aura;
    const tint = aura.style.getPropertyValue('--image-tint');
    if (!tint) return;
    caseLayer = (caseLayer + 1) % caseLayers.length;
    // Keep the photograph's hue, with cooler shadows and restrained saturation.
    const cinematicTint = tint.split(',').map((n, i) => Math.round(Number(n) * .8 + [28,32,46][i] * .2)).join(',');
    caseLayers[caseLayer].style.setProperty('--case-tint', cinematicTint);
    caseLayers.forEach((layer, index) => layer.classList.toggle('is-lit', index === caseLayer));
  }
  function releaseCase(aura) {
    if (caseSource !== aura) return;
    clearTimeout(caseReset);
    caseReset = setTimeout(() => {
      caseLayers.forEach(layer => layer.classList.remove('is-lit'));
      caseSource = null;
    }, 180);
  }
  const auras = [...document.querySelectorAll('.media-aura')];
  for (const aura of auras) {
    const img = aura.querySelector('img');
    if (!img) continue;
    // The backlight is the image itself, blurred: its actual colors stay in sync.
    aura.style.setProperty('--image-glow', `url("${img.getAttribute('src')}")`);
    const sampleTint = () => {
      try {
        const canvas = document.createElement('canvas'); canvas.width = canvas.height = 20;
        const ctx = canvas.getContext('2d', {willReadFrequently:true});
        ctx.drawImage(img, 0, 0, 20, 20);
        const pixels = ctx.getImageData(0, 0, 20, 20).data;
        let red = 0, green = 0, blue = 0, total = 0;
        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i], g = pixels[i+1], b = pixels[i+2];
          const high = Math.max(r,g,b), low = Math.min(r,g,b);
          if (high < 30 || pixels[i+3] < 128) continue;
          const weight = ((high-low)/255 + .06) * high/255;
          red += r*weight; green += g*weight; blue += b*weight; total += weight;
        }
        if (!total) return;
        const rgb = [red/total, green/total, blue/total];
        const lift = Math.min(2.5, 215/Math.max(...rgb));
        aura.style.setProperty('--image-tint', rgb.map(n=>Math.round(n*lift)).join(','));
        if (caseSource === aura) { caseSource = null; illuminateCase(aura); }
      } catch { /* The blurred image remains available if color sampling fails. */ }
    };
    if (img.complete && img.naturalWidth) sampleTint(); else img.addEventListener('load', sampleTint, {once:true});
    const control = aura.closest('a,button') || aura.querySelector('button') || aura;
    let pointerFrame = 0, px = 0, py = 0;
    const activate = () => { aura.classList.add('is-active'); illuminateCase(aura); };
    const reset = () => {
      aura.classList.remove('is-active');
      cancelAnimationFrame(pointerFrame); pointerFrame = 0;
      aura.style.setProperty('--glow-x', '0px');
      aura.style.setProperty('--glow-y', '0px');
      releaseCase(aura);
    };
    control.addEventListener('pointerenter', () => { if (finePointer.matches) activate(); });
    control.addEventListener('pointerleave', () => { if (finePointer.matches) reset(); });
    control.addEventListener('focusin', activate);
    control.addEventListener('focusout', reset);
    control.addEventListener('pointermove', event => {
      if (!finePointer.matches || reduce.matches) return;
      const rect = aura.getBoundingClientRect();
      px = (Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)) - .5) * 18;
      py = (Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)) - .5) * 14;
      if (!pointerFrame) pointerFrame = requestAnimationFrame(() => {
        aura.style.setProperty('--glow-x', `${px.toFixed(1)}px`);
        aura.style.setProperty('--glow-y', `${py.toFixed(1)}px`);
        pointerFrame = 0;
      });
    }, {passive:true});
  }

  // Touch screens get the same color ambience as artwork enters the viewport.
  const touchObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    for (const entry of entries) {
      entry.target.classList.toggle('is-in-view', !finePointer.matches && entry.isIntersecting);
      if (!finePointer.matches && entry.isIntersecting) illuminateCase(entry.target);
      else if (!finePointer.matches) releaseCase(entry.target);
    }
  }, {threshold:.55}) : null;
  if (touchObserver) auras.forEach(aura => touchObserver.observe(aura));
  reduce.addEventListener('change', () => {
    if (reduce.matches) {
      if (intro) intro.hidden = true;
      cancelAnimationFrame(scrollFrame); scrollFrame = 0;
      root.style.removeProperty('--drift-x'); root.style.removeProperty('--drift-y');
      root.style.removeProperty('--gradient-position');
    } else queueAtmosphere();
  });
})();
