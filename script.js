// Colors per section to transition background
const sectionColors = [
  "linear-gradient(120deg,#FF9A9E,#FAD0C4)",
  "linear-gradient(120deg,#a1c4fd,#c2e9fb)",
  "linear-gradient(120deg,#fddb92,#d1fdff)",
  "linear-gradient(120deg,#cfd9df,#e2ebf0)",
  "linear-gradient(120deg,#fbc2eb,#a6c1ee)",
  "linear-gradient(120deg,#e0c3fc,#8ec5fc)",
  "linear-gradient(120deg,#a8ff78,#78ffd6)"
];

const sections = Array.from(document.querySelectorAll('.section'));
const main = document.getElementById('main');

function setBgForIndex(i){
  const g = sectionColors[i] || sectionColors[0];
  document.body.style.background = g;
}

function onScrollBg(){
  const vy = window.innerHeight / 2;
  let bestIdx = 0;
  let bestDist = Infinity;
  sections.forEach((sec, idx) => {
    const rect = sec.getBoundingClientRect();
    const secCenter = rect.top + rect.height/2;
    const dist = Math.abs(secCenter - vy);
    if(dist < bestDist){ bestDist = dist; bestIdx = idx; }
  });
  setBgForIndex(bestIdx);
  sections.forEach((s, i) => s.querySelector('.card').classList.toggle('show', i === bestIdx));
  sections.forEach((s, i) => s.querySelector('.char-img').classList.toggle('show', i === bestIdx));
}

function onScrollParallax(){
  sections.forEach((sec, idx) => {
    const img = sec.querySelector('.char-img');
    if(!img) return;
    const rect = sec.getBoundingClientRect();
    const progress = (rect.top + rect.height/2 - window.innerHeight/2) / window.innerHeight;
    const direction = idx % 2 === 0 ? 1 : -1;
    const shift = Math.max(-1.6, Math.min(1.6, -progress)) * 80 * direction;
    const vShift = window.innerWidth < 760 ? -40 : 0;
    img.style.transform = `translate(${shift}px, calc(-50% + ${vShift}px))`;
  });
}

let ticking = false;
function onScroll(){
  if(!ticking){
    window.requestAnimationFrame(() => {
      onScrollBg();
      onScrollParallax();
      ticking = false;
    });
    ticking = true;
  }
}

window.addEventListener('scroll', onScroll, {passive:true});
window.addEventListener('resize', onScroll);
onScroll(); // initial

// Search
const searchBox = document.getElementById('searchBox');
const clearBtn = document.getElementById('clearBtn');

function applyFilter(q){
  const query = (q||'').trim().toLowerCase();
  sections.forEach(sec => {
    const name = (sec.dataset.name || '').toLowerCase();
    const anime = (sec.dataset.anime || '').toLowerCase();
    const matches = !query || name.includes(query) || anime.includes(query);
    sec.style.display = matches ? 'flex' : 'none';
  });
}

searchBox.addEventListener('input', e => applyFilter(e.target.value));
clearBtn.addEventListener('click', () => { searchBox.value=''; applyFilter(''); });

searchBox.addEventListener('keydown', (e) => {
  if(e.key === 'Enter'){
    const visible = sections.find(s => s.style.display !== 'none');
    if(visible) visible.scrollIntoView({behavior:'smooth', block:'center'});
  }
});
