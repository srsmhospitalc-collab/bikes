const gridEl=document.getElementById('grid');
const scoreEl=document.getElementById('score');
const bestEl=document.getElementById('best');
let board=[],score=0;

function init(){
board=Array(4).fill().map(()=>Array(4).fill(0));
score=0; addRandom(); addRandom(); update();
}
function addRandom(){
let e=[]; for(let r=0;r<4;r++) for(let c=0;c<4;c++) if(board[r][c]==0) e.push([r,c]);
if(e.length){ let [r,c]=e[Math.floor(Math.random()*e.length)]; board[r][c]=Math.random()<0.9?2:4; }
}
function update(){
gridEl.innerHTML='';
for(let r=0;r<4;r++) for(let c=0;c<4;c++){
let d=document.createElement('div');
d.className='tile '+(board[r][c]?'tile-'+board[r][c]:'');
d.textContent=board[r][c]||''; gridEl.appendChild(d);
}
scoreEl.textContent=score;
let best=localStorage.getItem('best2048neon')||0;
if(score>best){ best=score; localStorage.setItem('best2048neon',best); }
bestEl.textContent=best;
}
function slide(row){ let a=row.filter(v=>v); return a.concat(Array(4-a.length).fill(0)); }
function combine(row){ for(let i=0;i<3;i++){ if(row[i]&&row[i]==row[i+1]){ row[i]*=2; score+=row[i]; row[i+1]=0; } } return row; }
function moveLeft(){ let m=false; for(let r=0;r<4;r++){ let old=board[r].slice(); let nr=slide(combine(slide(combine(slide(board[r]))))); board[r]=slide(nr); if(old.toString()!=board[r].toString()) m=true; } return m; }
function rotate(){ let nb=Array(4).fill().map(()=>Array(4).fill(0)); for(let r=0;r<4;r++) for(let c=0;c<4;c++) nb[c][3-r]=board[r][c]; board=nb; }
function move(dir){
let moved=false;
if(dir=='left') moved=moveLeft();
else if(dir=='right'){ rotate(); rotate(); moved=moveLeft(); rotate(); rotate(); }
else if(dir=='up'){ rotate(); rotate(); rotate(); moved=moveLeft(); rotate(); }
else if(dir=='down'){ rotate(); moved=moveLeft(); rotate(); rotate(); rotate(); }
if(moved){ addRandom(); update(); if(isOver()) setTimeout(()=>alert('Game Over! Score: '+score),250); }
}
function isOver(){
for(let r=0;r<4;r++) for(let c=0;c<4;c++) if(board[r][c]==0) return false;
for(let r=0;r<4;r++) for(let c=0;c<4;c++){ if(r<3&&board[r][c]==board[r+1][c]) return false; if(c<3&&board[r][c]==board[r][c+1]) return false; }
return true;
}
document.addEventListener('keydown',e=>{
if(e.key=='ArrowLeft') move('left');
if(e.key=='ArrowRight') move('right');
if(e.key=='ArrowUp') move('up');
if(e.key=='ArrowDown') move('down');
});
document.getElementById('new-game').addEventListener('click',init);
let sx,sy;
gridEl.addEventListener('touchstart',e=>{ sx=e.touches[0].clientX; sy=e.touches[0].clientY; },{passive:true});
gridEl.addEventListener('touchend',e=>{
let dx=e.changedTouches[0].clientX-sx; let dy=e.changedTouches[0].clientY-sy;
if(Math.abs(dx)>Math.abs(dy)){ if(dx>30) move('right'); else if(dx<-30) move('left'); }
else{ if(dy>30) move('down'); else if(dy<-30) move('up'); }
},{passive:true});
init();
