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
const launcher=document.querySelector('.assistant-launcher');
const panel=document.querySelector('.assistant-panel');
const messages=document.querySelector('.assistant-messages');
const questionInput=document.querySelector('#assistant-question');
const questionForm=document.querySelector('.assistant-form');
const status=document.querySelector('[data-assistant-status]');
const aiButton=document.querySelector('[data-enable-ai]');
let knowledgePromise;
const knowledge=()=>knowledgePromise ||= import('./assistant-data.js?rev=20260915-2');
function closeAssistant(){panel.hidden=true;launcher.setAttribute('aria-expanded','false');launcher.focus({preventScroll:true});}
launcher.addEventListener('click',()=>{const open=panel.hidden;panel.hidden=!open;launcher.setAttribute('aria-expanded',String(open));if(open){closeMenu();knowledge();questionInput.focus({preventScroll:true});}});
document.querySelector('.assistant-close').addEventListener('click',closeAssistant);
document.addEventListener('keydown',event=>{if(event.key==='Escape'){if(!panel.hidden)closeAssistant();closeMenu();}});
function appendMessage(text,type='assistant',fact){
 const div=document.createElement('div');div.className='assistant-message'+(type==='user'?' user':'');const p=document.createElement('p');p.textContent=text;div.append(p);
 if(fact?.link){const link=document.createElement('a');link.href=fact.link;link.textContent=fact.label+' ↗';if(fact.link.startsWith('http')){link.target='_blank';link.rel='noopener noreferrer';}else{link.addEventListener('click',closeAssistant);}div.append(link);}
 messages.append(div);messages.scrollTop=messages.scrollHeight;return div;
}
let worker, aiReady=false, loadingTimer, busy=false, requestNumber=0;
const pending=new Map();
function aiUnavailable(){aiReady=false;clearTimeout(loadingTimer);worker?.terminate();worker=null;status.textContent='Quick answers from Jade’s portfolio';aiButton.textContent='Retry AI matching';aiButton.disabled=false;for(const {resolve,timer} of pending.values()){clearTimeout(timer);resolve(null);}pending.clear();}
aiButton.addEventListener('click',()=>{
 if(worker || aiReady)return;
 aiButton.disabled=true;aiButton.textContent='Loading AI…';status.textContent='Loading smarter matching — quick answers still work';
 appendMessage('AI matching downloads a small language model once, then finds relevant portfolio answers on your device. Your questions stay in this browser. Quick answers remain available while it loads.');
 try{
  worker=new Worker('./assistant-worker.js?rev=20260915-2',{type:'module'});
  loadingTimer=setTimeout(aiUnavailable,90000);
  worker.onmessage=({data})=>{
   if(data.type==='ready'){clearTimeout(loadingTimer);aiReady=true;status.textContent='AI matching · Portfolio facts only';aiButton.textContent='AI enabled';return;}
   if(data.type==='error'){aiUnavailable();return;}
   if(data.type==='answer' && pending.has(data.requestId)){const {resolve,timer}=pending.get(data.requestId);clearTimeout(timer);pending.delete(data.requestId);resolve(data.id);}
  };
  worker.onerror=aiUnavailable;worker.postMessage({type:'init'});
 }catch(error){aiUnavailable();}
});
function semanticMatch(q){return new Promise(resolve=>{const requestId=++requestNumber;const timer=setTimeout(()=>{pending.delete(requestId);resolve(null);},30000);pending.set(requestId,{resolve,timer});worker.postMessage({type:'question',question:q,requestId});});}
async function ask(question){
 const q=question.trim().slice(0,300);if(!q || busy)return;
 busy=true;questionForm.querySelector('button').disabled=true;appendMessage(q,'user');questionInput.value='';
 try{
  const {facts,quickMatch}=await knowledge();
  const greeting=/^(hi|hello|hey|thanks|thank you|salamat)[!.\s]*$/i.test(q);
  if(greeting){appendMessage(/thank|salamat/i.test(q)?'You’re welcome! If a project catches your eye, I can help you find it.':'Hi! Ask me about Jade’s projects, services, or how to get in touch.');return;}
  let fact=quickMatch(q);
  if(!fact && aiReady){const waiting=appendMessage('Finding the closest portfolio answer…');waiting.classList.add('typing');const id=await semanticMatch(q);waiting.remove();fact=facts.find(item=>item.id===id);}
  if(fact)appendMessage(fact.answer,'assistant',fact);
  else appendMessage('I don’t have a verified answer to that in Jade’s portfolio. Try a project name, services, or tools — or send Jade your question directly.','assistant',{link:'#contact',label:'Ask Jade directly'});
 }catch(error){appendMessage('I couldn’t load the portfolio answers. You can still reach Jade through the contact form.','assistant',{link:'#contact',label:'Contact Jade'});}
 finally{busy=false;questionForm.querySelector('button').disabled=false;messages.scrollTop=messages.scrollHeight;}
}
questionForm.addEventListener('submit',event=>{event.preventDefault();ask(questionInput.value);});
document.querySelectorAll('[data-question]').forEach(button=>button.addEventListener('click',()=>ask(button.dataset.question)));
