document.documentElement.classList.add('has-js');
const header=document.querySelector('[data-header]');
const menu=document.querySelector('.menu-toggle');
const nav=document.querySelector('.site-nav');
const lightbox=document.querySelector('[data-lightbox]');
const lightboxImage=document.querySelector('[data-lightbox-image]');
const caption=document.querySelector('[data-lightbox-caption]');
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
document.querySelector('[data-year]').textContent=new Date().getFullYear();
const updateHeader=()=>header.classList.toggle('is-scrolled',window.scrollY>24);
updateHeader();window.addEventListener('scroll',updateHeader,{passive:true});
function closeMenu(){menu.setAttribute('aria-expanded','false');nav.classList.remove('is-open');menu.querySelector('.sr-only').textContent='Open menu';}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);menu.querySelector('.sr-only').textContent=open?'Close menu':'Open menu';});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
window.addEventListener('resize',()=>{if(window.innerWidth>620)closeMenu();});
document.addEventListener('click',e=>{if(!header.contains(e.target))closeMenu();});
if('IntersectionObserver' in window && !reducedMotion.matches){
 const observer=new IntersectionObserver((entries,obs)=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('will-reveal');entry.target.classList.add('is-visible');obs.unobserve(entry.target);}}),{threshold:.06});
 document.querySelectorAll('[data-reveal]').forEach(el=>{if(el.getBoundingClientRect().top>window.innerHeight)el.classList.add('will-reveal');observer.observe(el);});
}
let lastArtwork;
document.querySelectorAll('[data-lightbox-src]').forEach(button=>button.addEventListener('click',()=>{
 lastArtwork=button;lightboxImage.src=button.dataset.lightboxSrc;lightboxImage.alt=button.querySelector('img').alt;caption.textContent=button.dataset.lightboxTitle;
 lightbox.style.setProperty('--lightbox-image',`url("${button.dataset.lightboxSrc}")`);
 lightbox.showModal();document.body.classList.add('overlay-open');
}));
function closeLightbox(){lightbox.close();}
document.querySelector('.lightbox-close').addEventListener('click',closeLightbox);
lightbox.addEventListener('click',event=>{if(event.target===lightbox)closeLightbox();});
lightbox.addEventListener('close',()=>{lightboxImage.removeAttribute('src');document.body.classList.remove('overlay-open');lastArtwork?.focus({preventScroll:true});});
// Preserve the inquiry in a Gmail draft if the visitor chooses that route.
const contact=document.querySelector('.contact-form');
const emailDraft=document.querySelector('[data-email-draft]');
function updateDraft(){const data=new FormData(contact);const body=`Name: ${data.get('name') || ''}\nReply email: ${data.get('email') || ''}\n\n${data.get('message') || ''}`;emailDraft.href='https://mail.google.com/mail/?'+new URLSearchParams({view:'cm',fs:'1',to:'jadephillineofficial@gmail.com',su:'Portfolio project inquiry',body});}
contact.addEventListener('input',updateDraft);
contact.addEventListener('submit',event=>{const fields=['client-name','client-message'].map(id=>document.getElementById(id));for(const field of fields){field.value=field.value.trim();}if(!contact.checkValidity()){event.preventDefault();contact.reportValidity();return;}updateDraft();});
// The form uses FormSubmit's native confirmation flow. No simulated “sent” state.
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
