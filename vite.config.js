// Development preview only; GitHub Pages serves the static files directly.
import {readFileSync} from 'node:fs';
export default {
 server:{host:'0.0.0.0',allowedHosts:['terminal.local']},
 plugins:[{name:'responsive-review',configureServer(server){
  server.middlewares.use((req,res,next)=>{
   if(req.url.startsWith('/__scaled.html')){res.setHeader('Content-Type','text/html');res.end(readFileSync(new URL('./index.html',import.meta.url),'utf8').replace('</head>','<style>html{font-size:200%!important}</style></head>'));return;}
   if(!req.url.startsWith('/__qa'))return next();
   res.setHeader('Content-Type','text/html');
   res.end(`<!doctype html><html><head><title>Responsive review</title><style>body{margin:0;background:#222;color:white;font:14px Arial}nav{padding:12px;display:flex;gap:10px}button{padding:9px;cursor:pointer}iframe{display:block;border:0;margin:0;width:390px;height:820px}</style></head><body><nav><button data-width="320">320</button><button data-width="360">360</button><button data-width="390">390</button><button data-width="768">768</button><button data-width="1024">1024</button><button data-width="1440">1440</button><button id="large">200% text</button><button id="check">Check layout</button><span id="info">390 px</span><pre id="report"></pre></nav><iframe title="Portfolio preview" src="${req.url.includes("scaled")?"/__scaled.html":"/"}"></iframe><script>const frame=document.querySelector('iframe');document.querySelectorAll('[data-width]').forEach(b=>b.onclick=()=>{frame.style.width=b.dataset.width+'px';document.querySelector('#info').textContent=b.dataset.width+' px'});document.querySelector('#check').onclick=()=>{const d=frame.contentDocument;document.querySelector('#report').textContent=JSON.stringify({width:d.documentElement.clientWidth,scroll:d.documentElement.scrollWidth,overflow:[...d.querySelectorAll('h1,h2,h3,p,a,strong,small')].filter(e=>e.getBoundingClientRect().right>d.documentElement.clientWidth+2 && e.getBoundingClientRect().width>0).map(e=>({tag:e.tagName,cls:e.className,text:e.textContent.slice(0,55),right:e.getBoundingClientRect().right}))})};document.querySelector('#large').onclick=()=>frame.src=frame.src.includes('__scaled')?'/':'/__scaled.html';</script></body></html>`);
  });
 }}]
};
