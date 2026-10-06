const toggle=document.querySelector('.menu-toggle'),menu=document.querySelector('#menu'),motion=matchMedia('(prefers-reduced-motion: reduce)');
function setMenu(open){menu.hidden=!open;toggle.setAttribute('aria-expanded',String(open));document.querySelector('.menu-symbol').textContent=open?'×':'+';document.body.classList.toggle('locked',open);for(const node of document.querySelectorAll('main,footer,.brand,.desktop-nav'))node.inert=open;if(open)menu.querySelector('a').focus();else toggle.focus()}
toggle.addEventListener('click',()=>setMenu(menu.hidden));menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));document.addEventListener('keydown',e=>{if(menu.hidden)return;if(e.key==='Escape')setMenu(false);if(e.key==='Tab'){const nodes=[toggle,...menu.querySelectorAll('a')],first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
const current=location.pathname.replace(/\/$/,'')||'/';document.querySelectorAll('.menu a,.desktop-nav a,.footer-nav a').forEach(a=>{if((a.pathname.replace(/\/$/,'')||'/')===current)a.setAttribute('aria-current','page')});
if('IntersectionObserver'in window&&!motion.matches){document.documentElement.classList.add('js');const observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}},{threshold:.05});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));motion.addEventListener('change',()=>{if(motion.matches)document.documentElement.classList.remove('js')})}

const slider=document.querySelector('#view-comparison'),comparison=document.querySelector('.comparison-image');
if(slider&&comparison){
 const updateComparison=()=>{const value=Number(slider.value);comparison.style.setProperty('--split',value+'%');slider.setAttribute('aria-valuetext','During construction '+value+' percent, Finished '+(100-value)+' percent')};
 slider.addEventListener('input',updateComparison);updateComparison();
 slider.addEventListener('keydown',e=>{const value=Number(slider.value),step=e.shiftKey?10:1;let next;if(e.key==='ArrowLeft'||e.key==='ArrowDown')next=value-step;else if(e.key==='ArrowRight'||e.key==='ArrowUp')next=value+step;else if(e.key==='Home')next=0;else if(e.key==='End')next=100;else if(e.key==='PageDown')next=value-10;else if(e.key==='PageUp')next=value+10;else return;e.preventDefault();slider.value=String(Math.max(0,Math.min(100,next)));updateComparison()});
 let pointer=null;
 const setFromPointer=e=>{const rect=comparison.getBoundingClientRect();if(!rect.width)return;slider.value=String(Math.max(0,Math.min(100,Math.round((e.clientX-rect.left)/rect.width*100))));updateComparison()};
 comparison.addEventListener('pointerdown',e=>{if(!e.isPrimary||e.pointerType==='mouse'&&e.button!==0)return;e.preventDefault();pointer=e.pointerId;slider.focus({preventScroll:true});comparison.setPointerCapture(pointer);setFromPointer(e)});
 comparison.addEventListener('pointermove',e=>{if(e.pointerId===pointer)setFromPointer(e)});
 const stop=e=>{if(e.pointerId===pointer)pointer=null};comparison.addEventListener('pointerup',stop);comparison.addEventListener('pointercancel',stop);comparison.addEventListener('lostpointercapture',stop);
}
