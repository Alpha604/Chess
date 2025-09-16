const board = document.getElementById('board');
const size = 8;
for(let r=0;r<size;r++){
    for(let c=0;c<size;c++){
    const s = document.createElement('div');
    s.className = 'square ' + ((r+c)%2? 'dark':'light');
    s.dataset.r = r;
    s.dataset.c = c;
    board.appendChild(s);
    }
}

const pieceUnicode = {wk:'♔', wq:'♕', wr:'♖', wb:'♗', wn:'♘', wp:'♙', bk:'♚', bq:'♛', br:'♜', bb:'♝', bn:'♞', bp:'♟'};

const stage = document.createElement('div');
stage.style.position = 'absolute';
stage.style.inset = '0';
stage.style.pointerEvents = 'none';
document.querySelector('.board-wrapper').appendChild(stage);

function makePiece(id, symbol, cls){
    const el = document.createElement('div');
    el.className = 'piece ' + cls;
    el.dataset.id = id;
    el.innerText = symbol;
    stage.appendChild(el);
    return el;
}

const piecesPositions = {
    'wk':[7,4],'wq':[7,3],'wr1':[7,0],'wr2':[7,7],'wn1':[7,1],'wn2':[7,6],'wb1':[7,2],'wb2':[7,5],
    'wp1':[6,0],'wp2':[6,1],'wp3':[6,2],'wp4':[6,3],'wp5':[6,4],'wp6':[6,5],'wp7':[6,6],'wp8':[6,7],
    'bk':[0,4],'bq':[0,3],'br1':[0,0],'br2':[0,7],'bn1':[0,1],'bn2':[0,6],'bb1':[0,2],'bb2':[0,5],
    'bp1':[1,0],'bp2':[1,1],'bp3':[1,2],'bp4':[1,3],'bp5':[1,4],'bp6':[1,5],'bp7':[1,6],'bp8':[1,7]
};

const pieces = {};
for(const k in piecesPositions){
    const [r,c] = piecesPositions[k];
    const color = k.startsWith('w') ? 'white' : 'black';
    pieces[k] = {el: makePiece(k, pieceUnicode[k.replace(/[0-9]/g,'')], color), r, c, cls: color};
}

function placePieces(){
    const rect = board.getBoundingClientRect();
    const sq = rect.width / 8;
    for(const k in pieces){
    const p = pieces[k];
    const x = p.c * sq + (sq - (sq - 18))/2;
    const y = p.r * sq + (sq - (sq - 18))/2;
    p.el.style.width = (sq - 18)+'px';
    p.el.style.height = (sq - 18)+'px';
    p.el.style.left = x+'px';
    p.el.style.top = y+'px';
    p.el.style.fontSize = (sq*0.6)+'px';
    }
}

window.addEventListener('resize', placePieces);
setTimeout(placePieces, 40);

function sleep(ms){return new Promise(r=>setTimeout(r,ms));}

function animMove(key,toR,toC,dur=600){
    const p=pieces[key]; if(!p) return Promise.resolve();
    const el=p.el;
    const rect=board.getBoundingClientRect();
    const sq=rect.width/8;
    const fromX=parseFloat(el.style.left), fromY=parseFloat(el.style.top);
    const toX=toC*sq+(sq-(sq-18))/2, toY=toR*sq+(sq-(sq-18))/2;
    el.classList.add('glow');
    return new Promise(r=>{
    el.animate([{transform:'translate(0,0)'},{transform:`translate(${toX-fromX}px,${toY-fromY}px)`}],{duration:dur,easing:'ease-in-out'}).onfinish=()=>{
        el.style.left=toX+'px'; el.style.top=toY+'px'; el.classList.remove('glow'); p.r=toR; p.c=toC; r();
    };
    });
}

function animScale(key,scale=1.2,dur=220){
    const el=pieces[key].el;
    el.animate([{transform:'scale(1)'},{transform:`scale(${scale})`},{transform:'scale(1)'}],{duration:dur,easing:'ease-out'});
    return sleep(dur);
}

const flash=document.getElementById('flash');
function flashOn(){flash.classList.add('on'); setTimeout(()=>flash.classList.remove('on'),1200);}

const canvas=document.getElementById('confetti');
const ctx=canvas.getContext('2d');
let W=0,H=0; function fit(){const r=canvas.getBoundingClientRect(); canvas.width=r.width; canvas.height=r.height; W=canvas.width; H=canvas.height;} fit(); window.addEventListener('resize',fit);
let particles=[];
function explodeConfetti(){particles=[]; for(let i=0;i<60;i++) particles.push({x:W/2,y:H/3,vx:(Math.random()-0.5)*8,vy:-Math.random()*8-2,r:Math.random()*6+4,rot:Math.random()*360,vr:(Math.random()-0.5)*8,color:['#ffd166','#06d6a0','#118ab2','#ef476f','#ffd700'][Math.floor(Math.random()*5)]}); requestAnimationFrame(loop);}
function loop(){ctx.clearRect(0,0,W,H); particles.forEach(p=>{p.vy+=0.3;p.x+=p.vx;p.y+=p.vy;p.rot+=p.vr; ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot*Math.PI/180); ctx.fillStyle=p.color; ctx.fillRect(-p.r/2,-p.r/2,p.r,p.r*0.6); ctx.restore();}); particles=particles.filter(p=>p.y<H+50); if(particles.length>0) requestAnimationFrame(loop);}
function clearConfetti(){particles=[]; ctx.clearRect(0,0,W,H);}

async function sequence(){
    while(true){
    for(const k in pieces){pieces[k].r=piecesPositions[k][0]; pieces[k].c=piecesPositions[k][1];}
    placePieces(); clearConfetti();
    // Mat du Berger: e4 e5 Bc4 Nc6 Qh5 Nf6 Qxf7#
    await animMove('wp5',4,4,400); // Pion blanc roi e2->e4
    await animMove('bp5',3,4,400); // Pion noir roi e7->e5
    await animMove('wb2',4,2,400); // Fou blanc f1->c4
    await animMove('bp3',3,2,400); // Pion noir c7->c5
    await animMove('wq',4,5,400); // Reine blanche d1->f3
    await animMove('bn2',2,5,400); // Cavalier noir g8->f6
    await animMove('wq',3,7,400); // Reine blanche f3->h5
    await animMove('bn1',2,0,400); // Cavalier noir b8->a6
    await animMove('wq',1,5,400); // Reine blanche h5->f7 (Mat)
    flashOn(); explodeConfetti();
    await sleep(1500);
    }
}

sequence();