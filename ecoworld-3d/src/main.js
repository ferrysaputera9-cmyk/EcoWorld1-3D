import * as THREE from 'three';
import './style.css';
import { T, INFO, UP, TIER } from './data.js';

const $=s=>document.querySelector(s),ov=$('#ov');
const def=()=>({tot:0,co:0,up:{spd:0,cap:0,reach:0,bonus:0},hold:[]});let G=def();
try{G=Object.assign(def(),JSON.parse(localStorage.getItem('ew3')||'{}'))}catch(e){}
G.up=Object.assign({spd:0,cap:0,reach:0,bonus:0},G.up);
const save=()=>{try{localStorage.setItem('ew3',JSON.stringify(G))}catch(e){}};
const MAXT=90,lv=()=>Math.min(10,1+Math.floor(G.tot/10)),clean=()=>Math.min(1,G.tot/MAXT);
const spd=()=>4+G.up.spd*.8,cap=()=>6+G.up.cap*3,reach=()=>1.3+G.up.reach*.4;
function toast(t){const d=document.createElement('div');d.textContent=t;$('#toast').appendChild(d);setTimeout(()=>d.remove(),3500)}
let AX;function snd(f,d=.08){try{AX=AX||new(window.AudioContext||window.webkitAudioContext)();const o=AX.createOscillator(),g=AX.createGain();o.type='triangle';o.frequency.value=f;g.gain.value=.05;o.connect(g);g.connect(AX.destination);o.start();o.stop(AX.currentTime+d)}catch(e){}}
function hud(){$('#lv').textContent=lv();$('#co').textContent=G.co;$('#xb').style.width=((G.tot%10)*10)+'%';$('#hold').textContent=G.hold.length;$('#cap').textContent=cap();$('#cl').textContent=Math.round(clean()*100)}
let mode='menu';const card=h=>{ov.innerHTML='<div class=card>'+h+'</div>';ov.classList.remove('off')};
function play(){ov.classList.add('off');mode='play';$('#hud').style.display='block';$('#btns').style.display='block';$('#joy').style.display=$('#pickBtn').style.display='block';hud()}
function menu(){mode='menu';$('#hud').style.display=$('#btns').style.display=$('#joy').style.display=$('#pickBtn').style.display='none';$('#info').style.display='none';hl.visible=false;const has=G.tot>0;
card(`<h1>EcoWorld 3D</h1><small>Bersih Pantai</small><p>Kamu relawan kebersihan pantai. Pungut sampah, pilah di pos daur ulang, tukar dengan koin untuk perlengkapan, dan naik level sampai pantai kembali bersih.</p><button class=pri id=c>${has?'Lanjutkan':'Mulai'}</button><button id=n>Game baru</button><button id=h>Cara bermain</button>`);
$('#c').onclick=()=>{respawn();play()};let k=0;$('#n').onclick=e=>{if(has&&!k){k=1;e.target.textContent='Tekan lagi untuk menghapus progres';return}G=def();save();respawn();play()};
$('#h').onclick=()=>{card(`<h2>Cara bermain</h2><p>Gerak: analog di kiri bawah (atau WASD). Klik kanan + geser (atau dua jari di HP) untuk memutar kamera, scroll untuk zoom. Dekati sampah sampai muncul lingkaran kuning, lalu tekan tombol Pungut (atau E/Spasi). Akan muncul info bahaya sampah itu dan manfaatnya jika diolah. Jika karung penuh, bawa ke pos daur ulang (tiga tong di sisi kanan) untuk dipilah dan dijual.</p><button id=b class=pri>Kembali</button>`);$('#b').onclick=menu}}
$('#menuBtn').onclick=()=>{if(mode!=='play')return;mode='modal';card(`<h2>Jeda</h2><p>Level ${lv()} · ${G.tot} sampah terkumpul</p><button class=pri id=r>Lanjut</button><button id=m>Menu utama</button>`);$('#r').onclick=play;$('#m').onclick=menu};
const uc=k=>25*(G.up[k]+1);
$('#upBtn').onclick=()=>{if(mode!=='play')return;mode='modal';const draw=()=>{card(`<h2>Perlengkapan · Koin ${G.co}</h2>${UP.map(u=>`<button data-u=${u[0]} ${G.up[u[0]]>=5||G.co<uc(u[0])?'disabled':''}>${u[1]} (Lv ${G.up[u[0]]}/5)<br><small>${TIER[u[0]][G.up[u[0]]]} · ${u[2]} · ${G.up[u[0]]>=5?'Maksimal':'Harga '+uc(u[0])}</small></button>`).join('')}<button class=pri id=b>Kembali</button>`);
document.querySelectorAll('[data-u]').forEach(b=>b.onclick=()=>{const k=b.dataset.u;if(G.up[k]>=5||G.co<uc(k))return;G.co-=uc(k);G.up[k]++;snd(700);save();hud();draw()});$('#b').onclick=play};draw()};
/* ===== 3D ===== */
let R;try{R=new THREE.WebGLRenderer({canvas:$('#gl'),antialias:true})}catch(e){document.body.innerHTML='<p style="padding:24px">WebGL tidak tersedia di peramban ini.</p>';throw e}
R.setPixelRatio(Math.min(devicePixelRatio,2));R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;R.outputEncoding=THREE.sRGBEncoding;
const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(48,1,.1,300);const rs=()=>{R.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()};addEventListener('resize',rs);rs();
const skyD=new THREE.Color(0xaebfc7),skyC=new THREE.Color(0x9cc7de);sc.background=skyD.clone();sc.fog=new THREE.Fog(0xaebfc7,40,110);
sc.add(new THREE.HemisphereLight(0xdfe9f2,0x8a7a5a,.75));const sun=new THREE.DirectionalLight(0xfff0d6,1);sun.position.set(25,40,15);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);const sh=sun.shadow.camera;sh.left=-30;sh.right=30;sh.top=30;sh.bottom=-30;sh.far=120;sc.add(sun,sun.target);
function sandTex(){const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.fillStyle='#d8c59a';x.fillRect(0,0,256,256);for(let i=0;i<6000;i++){const v=170+Math.random()*70|0;x.fillStyle=`rgba(${v},${v-25},${v-70},.35)`;x.fillRect(Math.random()*256,Math.random()*256,1.5,1.5)}const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(24,24);t.anisotropy=4;return t}
const sand=new THREE.Mesh(new THREE.PlaneGeometry(140,70),new THREE.MeshStandardMaterial({map:sandTex(),roughness:1}));sand.rotation.x=-Math.PI/2;sand.position.set(0,0,10);sand.receiveShadow=true;sc.add(sand);
const wm=new THREE.MeshStandardMaterial({color:0x3b7390,roughness:.25,transparent:true,opacity:.92}),sea=new THREE.Mesh(new THREE.PlaneGeometry(200,90,60,30),wm);sea.rotation.x=-Math.PI/2;sea.position.set(0,-.05,-60);sc.add(sea);
const wp=sea.geometry.attributes.position,wb=Float32Array.from(wp.array);const dW=new THREE.Color(0x3b7390),cW=new THREE.Color(0x1887c9);
const foam=new THREE.Mesh(new THREE.PlaneGeometry(140,1.6),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.5}));foam.rotation.x=-Math.PI/2;foam.position.set(0,.02,-24.2);sc.add(foam);
const shal=new THREE.Mesh(new THREE.PlaneGeometry(140,14),new THREE.MeshStandardMaterial({color:0x5fc6d6,roughness:.3,transparent:true,opacity:.45}));shal.rotation.x=-Math.PI/2;shal.position.set(0,-.02,-30);sc.add(shal);
const mat=(c,r=.8,m=0)=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m});
function cast(o){o.traverse(m=>{if(m.isMesh){m.castShadow=true}});return o}
/* vegetasi dan batu */
const palms=[];
function palm(x,z){const g=new THREE.Group(),h=6+Math.random()*3,t=new THREE.Mesh(new THREE.CylinderGeometry(.18,.3,h,8),mat(0x7a5c3a,1));t.position.y=h/2;t.rotation.z=(Math.random()-.5)*.25;g.add(t);for(let i=0;i<7;i++){const l=new THREE.Mesh(new THREE.BoxGeometry(.4,.04,3.2),mat(0x3f7a3a,.9));const a=i/7*6.28;l.position.set(Math.cos(a)*1.4,h-.1,Math.sin(a)*1.4);l.rotation.y=-a+Math.PI/2;l.rotation.x=.55;g.add(l)}g.position.set(x,0,z);cast(g);sc.add(g);palms.push({g,ph:Math.random()*6.28})}
for(let i=0;i<22;i++)palm(-60+Math.random()*120,32+Math.random()*10);
for(let i=0;i<18;i++){const r=new THREE.Mesh(new THREE.DodecahedronGeometry(.5+Math.random()*1.1,0),mat(0x77746c,1));r.position.set(-55+Math.random()*110,.3,-17+Math.random()*50);r.scale.y=.6;r.rotation.set(Math.random()*3,Math.random()*3,0);r.castShadow=r.receiveShadow=true;sc.add(r)}
/* pos daur ulang */
const post=new THREE.Group();[['Organik',0x3f7a3a],['Anorganik',0xc9a227],['B3',0xb23b2e]].forEach((b,i)=>{const bin=new THREE.Mesh(new THREE.BoxGeometry(1.2,1.3,1.2),mat(b[1],.6)),lid=new THREE.Mesh(new THREE.BoxGeometry(1.3,.15,1.3),mat(0x333333,.5));bin.position.set(i*1.6-1.6,.65,0);lid.position.set(i*1.6-1.6,1.37,0);post.add(bin,lid)});
const board=new THREE.Mesh(new THREE.BoxGeometry(5,1.6,.15),mat(0x8a6a44,1));board.position.set(0,2.4,-.9);post.add(board);post.position.set(34,0,4);cast(post);sc.add(post);
/* manusia realistis (rig bersendi + perlengkapan per tier) */
const M={skin:mat(0xc08a63,.75),shirt:mat(0x35705f,.9),vest:mat(0xd8e23a,.7),ref:mat(0xdddddd,.3,.5),pants:mat(0x3d4659,.9),hair:mat(0x1d1a17,1),hat:mat(0xd9c9a0,.95),dark:mat(0x222222,.8)};
const mesh=(geo,m,x=0,y=0,z=0,p)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);if(p)p.add(o);return o};
const cyl=(a,b,h,m,p,x=0,y=0,z=0,sz=1)=>{const o=mesh(new THREE.CylinderGeometry(a,b,h,12),m,x,y,z,p);o.scale.z=sz;return o};
const sph=(r,m,p,x=0,y=0,z=0,sx=1,sy=1,sz=1)=>{const o=mesh(new THREE.SphereGeometry(r,14,10),m,x,y,z,p);o.scale.set(sx,sy,sz);return o};
const box=(w,h,d,m,p,x=0,y=0,z=0)=>mesh(new THREE.BoxGeometry(w,h,d),m,x,y,z,p);
const jt=(p,x,y,z=0)=>{const g=new THREE.Group();g.position.set(x,y,z);p.add(g);return g};
const clr=p=>{while(p.children.length)p.remove(p.children[0])};
function human(){const g=new THREE.Group(),hip=jt(g,0,.95),tor=jt(hip,0,0);
sph(.17,M.pants,hip,0,0,0,1,.7,.8);
cyl(.17,.16,.24,M.shirt,tor,0,.12,0,.7);cyl(.21,.17,.38,M.shirt,tor,0,.4,0,.68);
cyl(.222,.185,.3,M.vest,tor,0,.38,0,.74);cyl(.2,.2,.035,M.ref,tor,0,.3,0,.74);cyl(.218,.218,.035,M.ref,tor,0,.46,0,.74);
[-1,1].forEach(s=>sph(.07,M.shirt,tor,s*.22,.52));
cyl(.05,.055,.1,M.skin,tor,0,.64);
const head=jt(tor,0,.76);sph(.115,M.skin,head,0,0,0,.92,1.1,1);
[-1,1].forEach(s=>{sph(.014,M.dark,head,s*.04,.02,.104);box(.04,.008,.01,M.hair,head,s*.04,.045,.105);sph(.025,M.skin,head,s*.105,0,0,.5,1,.8)});
sph(.02,M.skin,head,0,-.012,.115,1,1.2,1.2);box(.05,.008,.01,mat(0x8a3b3b),head,0,-.052,.104);
const hr=mesh(new THREE.SphereGeometry(.12,14,8,0,6.283,0,1.45),M.hair,0,.045,-.015,head);hr.scale.set(.98,.95,1.02);
cyl(.11,.12,.09,M.hat,head,0,.125,0);const br=cyl(.27,.27,.012,M.hat,head,0,.085,0);br.rotation.x=-.06;
const arm=s=>{const sh=jt(tor,s*.255,.52),el=jt(sh,0,-.29),ha=jt(el,0,-.27);cyl(.05,.042,.29,M.skin,sh,0,-.145);cyl(.058,.054,.15,M.shirt,sh,0,-.075);cyl(.042,.034,.27,M.skin,el,0,-.135);return{sh,el,ha,hg:jt(ha,0,0)}};
const leg=s=>{const th=jt(hip,s*.095,0),kn=jt(th,0,-.43),an=jt(kn,0,-.42);cyl(.088,.065,.43,M.pants,th,0,-.215);cyl(.065,.052,.42,M.pants,kn,0,-.21);return{th,kn,an}};
const L=arm(-1),R=arm(1),tool=jt(R.ha,0,-.04);tool.rotation.x=-.85;
g.userData={hip,tor,head,L,R,tool,lg:[leg(-1),leg(1)],bagG:jt(tor,0,.3,-.2)};cast(g);return g}
function shoe(p,t){const sole=mat([0x3a3a3a,0xf2f2f2,0x2a2a2a,0x151515,0x1d1d1d,0x111111][t],.9);box(.1,t?.035:.015,.29,sole,p,0,-.083,.06);
if(!t){box(.085,.03,.2,M.skin,p,0,-.055,.05);box(.095,.012,.03,M.dark,p,0,-.035,.06);return}
const m=mat([0,0xe8e8e8,0x56644a,0x4b5d2a,0x6b4426,0x2d3238][t],.85);box(.1,.07,.2,m,p,0,-.04,.03);sph(.052,m,p,0,-.045,.15,1,.75,1.3);
if(t>=3)cyl(.068,.075,.12+(t-3)*.04,m,p,0,.03+(t-3)*.02,-.005);else if(t===2)cyl(.06,.062,.06,m,p,0,0,-.01);
if(t===5)cyl(.077,.077,.02,M.ref,p,0,.07,-.005);if(t>=4)box(.06,.01,.1,M.dark,p,0,-.002,.08)}
function hand(p,t,i){const m=t?mat([0,0xd8d4c4,0xd8b23a,0xd9822b,0xa8743c,0x23272b][t],.85):M.skin;
sph(.04,m,p,0,-.05,0,1,1.5,.6);box(.07,.045,.035,m,p,0,-.1,.01);sph(.02,m,p,i?.04:-.04,-.06,.02,1,1.6,1);
if(t)cyl(.045,.047,.07,mat([0,0x999999,0x8a6d1e,0x333333,0x5a3a1c,0x111111][t],.9),p,0,0,0);if(t>=4)box(.07,.02,.03,M.dark,p,0,-.07,-.02)}
function grabber(p,l){const L=.5+l*.15,o=mat(0xd9822b,.5),a=mat(l>=5?0x1b1b1b:0xb9bec2,.3,.8);
box(.04,.11,.05,l>=2?o:M.dark,p,0,-.02,0);cyl(.012,.012,L,a,p,0,-.07-L/2,0);box(.02,.05,.03,M.dark,p,0,-.1,.04);
if(l>=3)cyl(.02,.02,.03,o,p,0,-.07-L*.4,0);if(l>=4)cyl(.02,.02,.03,o,p,0,-.07-L*.75,0);
const j=s=>{const q=jt(p,0,-.07-L);box(.012,.09,.03,a,q,0,-.045,0);box(.012,.02,.04,M.dark,q,0,-.09,0);return q};p.userData.jaws=[j(-1),j(1)]}
function bagBuild(g,t){const m=mat([0xcbb98a,0x9c8456,0x8b7548,0x4f5a35,0x5d6168,0xd9822b][t],1),k=1+t*.06;let b;
if(t<3){b=sph(.22,m,g,0,0,-.04,1,1.1,.8);cyl(.05,.07,.06,M.dark,g,0,.24*k,-.04)}
else{b=box(.34,.42,.18,m,g,0,.05,-.06);box(.36,.08,.2,mat(0x33362b,1),g,0,.28*k,-.06);
if(t>=4){[-1,1].forEach(s=>box(.1,.2,.08,m,g,s*.2,-.05,-.06));[-1,1].forEach(s=>cyl(.012,.012,.5,mat(0xd9822b,.4),g,s*.15,.05,-.17))}
if(t===5){const r=cyl(.07,.07,.4,mat(0x2e6fa8,.9),g,0,-.22,-.08);r.rotation.z=1.57}}
b.scale.multiplyScalar(k);[-1,1].forEach(s=>{box(.05,.02,.6,M.dark,g,s*.13,.32,.08);box(.05,.45,.02,M.dark,g,s*.13,.2,.39)});
g.userData.body=b;g.userData.k=b.scale.clone();
g.userData.pk=[cyl(.03,.03,.14,mat(0xaed8ea,.2),g,.07,.3*k,-.08),sph(.07,mat(0xeeeeee,.9),g,-.07,.25*k,-.06,1,.5,1),cyl(.035,.035,.1,mat(0xb8bcc2,.3,.8),g,0,.27*k,-.02)]}
function applyGear(){const u=player.userData,U=G.up;u.lg.forEach(l=>{clr(l.an);shoe(l.an,U.spd)});[u.L,u.R].forEach((a,i)=>{clr(a.hg);hand(a.hg,U.bonus,i)});
clr(u.tool);if(U.reach>0)grabber(u.tool,U.reach);clr(u.bagG);u.bagG.userData={};bagBuild(u.bagG,U.cap)}
const player=human();player.position.set(0,0,12);sc.add(player);
/* hewan dan awan */
const gulls=[],crabs=[],fishes=[],clouds=[];
function gull(){const g=new THREE.Group(),w=mat(0xf4f4f0,.8),b=new THREE.Mesh(new THREE.SphereGeometry(.22,10,8),w);b.scale.set(1,.7,1.8);
const wing=s=>{const p=new THREE.Group();p.position.x=.12*s;const m=new THREE.Mesh(new THREE.BoxGeometry(.9,.03,.3),w);m.position.x=.45*s;p.add(m);return p};
const wl=wing(-1),wr=wing(1),hd=new THREE.Mesh(new THREE.SphereGeometry(.1,8,6),w);hd.position.set(0,.08,.4);const bk=new THREE.Mesh(new THREE.ConeGeometry(.03,.14,6),mat(0xe0a020));bk.rotation.x=1.57;bk.position.set(0,.06,.52);
g.add(b,wl,wr,hd,bk);g.userData={wl,wr};cast(g);sc.add(g);return g}
for(let i=0;i<6;i++)gulls.push({g:gull(),a:Math.random()*6.28,s:.25+Math.random()*.2,r:8+Math.random()*14,cx:(Math.random()-.5)*40,cz:5+Math.random()*10,h:9+Math.random()*5,ph:Math.random()*6});
function crab(){const g=new THREE.Group(),m=mat(0xc2452d,.7),b=new THREE.Mesh(new THREE.SphereGeometry(.16,10,8),m);b.scale.set(1.3,.6,1);g.add(b);[-1,1].forEach(s=>{const c=new THREE.Mesh(new THREE.SphereGeometry(.07,8,6),m);c.position.set(.24*s,.04,.14);g.add(c);const e=new THREE.Mesh(new THREE.SphereGeometry(.025,6,6),mat(0x111111));e.position.set(.07*s,.1,.12);g.add(e)});cast(g);return g}
for(let i=0;i<7;i++){const g=crab();g.position.set((Math.random()-.5)*70,.1,-14+Math.random()*30);sc.add(g);crabs.push({g,t:0,d:0})}
for(let i=0;i<8;i++){const g=new THREE.Group(),f=new THREE.Mesh(new THREE.ConeGeometry(.12,.55,6),mat(i%2?0xc0c8cc:0xd88a3a,.4,.3));f.rotation.x=Math.PI/2;g.add(f);g.rotation.order='YXZ';g.visible=false;cast(g);sc.add(g);fishes.push({g,t:-Math.random()*5,x:0,z:-30,a:0})}
const turtle=(()=>{const g=new THREE.Group(),m=mat(0x4a7a3a,.8),k=mat(0x7a9a5a,.8),s=new THREE.Mesh(new THREE.SphereGeometry(.5,12,8),m);s.scale.set(1,.35,1.2);const h=new THREE.Mesh(new THREE.SphereGeometry(.16,8,6),k);h.position.set(0,0,.7);g.add(s,h);[[-.5,.3],[.5,.3],[-.4,-.4],[.4,-.4]].forEach(p=>{const f=new THREE.Mesh(new THREE.SphereGeometry(.18,6,6),k);f.scale.set(1.4,.3,.8);f.position.set(p[0],0,p[1]);g.add(f)});g.visible=false;cast(g);sc.add(g);return g})();
for(let i=0;i<7;i++){const g=new THREE.Group(),m=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.85,fog:false});for(let k=0;k<4;k++){const s=new THREE.Mesh(new THREE.SphereGeometry(3+Math.random()*2,10,8),m);s.scale.y=.45;s.position.set(k*3.5-5,Math.random()*1.2,Math.random()*2);g.add(s)}g.position.set(-90+Math.random()*180,30+Math.random()*8,-90+Math.random()*100);g.userData.v=.5+Math.random()*.8;sc.add(g);clouds.push(g)}
/* sampah */
function mk(i){const g=new THREE.Group();let m;
if(i===0){m=new THREE.Mesh(new THREE.CylinderGeometry(.1,.1,.4,12),new THREE.MeshStandardMaterial({color:0xaed8ea,transparent:true,opacity:.65,roughness:.1}));m.rotation.z=1.57;const c=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,.05,8),mat(0xffffff,.5));c.position.y=.22;m.add(c)}
else if(i===1){m=new THREE.Mesh(new THREE.CylinderGeometry(.16,.16,.34,16),mat(0xb8bcc2,.3,.8));m.rotation.z=1.4}
else if(i===2){m=new THREE.Mesh(new THREE.SphereGeometry(.3,10,8),mat(0xe9e9e4,.9));m.scale.set(1,.2,.8)}
else if(i===3){m=new THREE.Mesh(new THREE.BoxGeometry(.6,.14,.45),mat(0x8f6f45,1))}
else if(i===4){m=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,.3,10),mat(0x2f2f33,.5,.4));m.rotation.z=1.57}
else{m=new THREE.Mesh(new THREE.BoxGeometry(.32,.04,.1),mat(0xcfb53a,.9));m.rotation.z=.2}
m.position.y=.12;g.add(m);g.rotation.y=Math.random()*6.28;g.traverse(o=>{if(o.isMesh)o.castShadow=true});return g}
let items=[];function spawnOne(){const i=Math.floor(Math.random()*T.length),g=mk(i);let x,z;do{x=(Math.random()-.5)*80;z=-17+Math.random()*44}while(Math.hypot(x-34,z-4)<6||Math.hypot(x-player.position.x,z-player.position.z)<4);g.position.set(x,0,z);g.userData={i};sc.add(g);items.push(g)}
const want=()=>Math.max(6,24-Math.floor(clean()*18));
function respawn(){items.forEach(m=>sc.remove(m));items=[];while(items.length<want())spawnOne()}
/* input */
const K={},mp={arrowup:'w',arrowdown:'s',arrowleft:'a',arrowright:'d'};addEventListener('keydown',e=>{let k=e.key.toLowerCase();K[mp[k]||k]=1;hasT=false});addEventListener('keyup',e=>{let k=e.key.toLowerCase();K[mp[k]||k]=0});
const ray=new THREE.Raycaster(),pl=new THREE.Plane(new THREE.Vector3(0,1,0),0),pt=new THREE.Vector3(),tg=new THREE.Vector3();let down=false,hasT=false;
function aim(e){if(mode!=='play')return;ray.setFromCamera({x:e.clientX/innerWidth*2-1,y:-(e.clientY/innerHeight)*2+1},cam);if(ray.ray.intersectPlane(pl,pt)){tg.set(pt.x,0,Math.max(-18,pt.z));hasT=true}}
let camYaw=0,camPit=.83,camD=16,rot=false,wk=0,ph=0,pickT=0,lastH=0,gearSig='';const tp=new Map();
const cv=$('#gl');cv.oncontextmenu=e=>e.preventDefault();
cv.onpointerdown=e=>{cv.setPointerCapture(e.pointerId);tp.set(e.pointerId,e);if(e.button===2||tp.size>1){rot=true;down=false}else{down=true;aim(e)}};
cv.onpointermove=e=>{const o=tp.get(e.pointerId),k=e.pointerType==='touch'?.5:1;if(rot&&o){camYaw-=(e.clientX-o.clientX)*.006*k;camPit=Math.max(.25,Math.min(1.35,camPit+(e.clientY-o.clientY)*.004*k))}else if(down)aim(e);if(o)tp.set(e.pointerId,e)};
cv.onpointerup=cv.onpointercancel=e=>{tp.delete(e.pointerId);if(!tp.size)rot=down=false};
cv.onwheel=e=>{camD=Math.max(6,Math.min(30,camD+e.deltaY*.01))};
let infoT;function showInfo(i){const t=T[i],n=INFO[i],e=$('#info');e.innerHTML=`<h3>${t[0]} <small>(${t[1]})</small></h3><p><b class=r>Bahaya:</b> ${n[0]}</p><p><b class=g>Jika diolah:</b> ${n[1]}</p><button id=ic>Tutup</button>`;e.style.display='block';$('#ic').onclick=()=>e.style.display='none';clearTimeout(infoT);infoT=setTimeout(()=>e.style.display='none',10000)}
const hl=new THREE.Mesh(new THREE.RingGeometry(.35,.45,24),new THREE.MeshBasicMaterial({color:0xf0c040,side:THREE.DoubleSide}));hl.rotation.x=-Math.PI/2;hl.visible=false;sc.add(hl);
function pick(g){if(G.hold.length>=cap()){toast('Karung penuh. Bawa ke pos daur ulang.');return false}sc.remove(g);items=items.filter(x=>x!==g);G.hold.push(g.userData.i);snd(520);showInfo(g.userData.i);hud();return true}
function nearest(){let b=null,bd=reach();for(const g of items){const d=Math.hypot(g.position.x-player.position.x,g.position.z-player.position.z);if(d<bd){bd=d;b=g}}return b}
let busy=0;const PD=.9;
function doPick(){if(mode!=='play'||busy)return;const g=nearest();if(!g){toast('Tidak ada sampah dalam jangkauan.');return}
if(G.hold.length>=cap()){toast('Karung penuh. Bawa ke pos daur ulang.');return}
busy=1;hasT=false;pickT=PD;player.rotation.y=Math.atan2(g.position.x-player.position.x,g.position.z-player.position.z);
setTimeout(()=>{if(g.parent){sc.remove(g);items=items.filter(x=>x!==g);G.hold.push(g.userData.i);snd(520);hud()}},PD*500);
setTimeout(()=>{busy=0;if(mode==='play')showInfo(g.userData.i)},PD*1000)}
$('#pickBtn').onclick=doPick;addEventListener('keydown',e=>{if(e.key==='e'||e.key===' ')doPick()});
let jx=0,jz=0,jid=null;const joy=$('#joy'),kn=$('#knob');
function jm(e){const r=joy.getBoundingClientRect(),cx=r.left+60,cy=r.top+60;let dx=e.clientX-cx,dy=e.clientY-cy;const l=Math.hypot(dx,dy),m=45;if(l>m){dx*=m/l;dy*=m/l}kn.style.transform=`translate(${dx}px,${dy}px)`;jx=dx/m;jz=dy/m}
joy.onpointerdown=e=>{jid=e.pointerId;joy.setPointerCapture(jid);hasT=false;jm(e)};joy.onpointermove=e=>{if(e.pointerId===jid)jm(e)};
const jend=e=>{if(e.pointerId===jid){jid=null;jx=jz=0;kn.style.transform=''}};joy.onpointerup=joy.onpointercancel=jend;
function unload(){if(!G.hold.length)return;const n=G.hold.length,cnt={Organik:0,Anorganik:0,B3:0};let pay=0;G.hold.forEach(i=>{cnt[T[i][1]]++;pay+=T[i][3]});pay=Math.round(pay*(1+G.up.bonus*.15));const o=lv();G.co+=pay;G.tot+=n;G.hold=[];snd(800,.2);
toast(`Dipilah: organik ${cnt.Organik}, anorganik ${cnt.Anorganik}, B3 ${cnt.B3}. +${pay} koin`);while(items.length<want())spawnOne();save();hud();
if(G.tot>=MAXT&&!G.win){G.win=1;save();mode='modal';card(`<h2>Pantai bersih</h2><p>${G.tot} sampah sudah terkumpul dan dipilah. Airnya kembali jernih. Kamu bisa terus bermain untuk melengkapi perlengkapan.</p><button class=pri id=b>Lanjut</button>`);$('#b').onclick=play;return}
if(lv()>o){mode='modal';card(`<h2>Level ${lv()}</h2><p>Pantai terlihat makin bersih dan airnya makin jernih. Lanjutkan.</p><button class=pri id=b>Lanjut</button>`);$('#b').onclick=play}}
let last=performance.now(),tm=0,warn=0;
function loop(t){requestAnimationFrame(loop);const dt=Math.min((t-last)/1000,.05);last=t;tm+=dt;const c=clean();
wm.color.lerpColors(dW,cW,c);sc.background.lerpColors(skyD,skyC,c);sc.fog.color.copy(sc.background);
const wa=wp.array;for(let i=0;i<wa.length;i+=3)wa[i+2]=Math.sin(wb[i]*.25+tm*1.2)*.2+Math.cos(wb[i+1]*.3+tm*.9)*.15;wp.needsUpdate=true;foam.position.z=-24.2+Math.sin(tm*.8)*.5;
palms.forEach(p=>{p.g.rotation.z=Math.sin(tm*.7+p.ph)*.025;p.g.children.forEach((c,i)=>{if(i)c.rotation.x=.55+Math.sin(tm*1.6+p.ph+i*.7)*.09})});
gulls.forEach(b=>{b.a+=dt*b.s;const a=b.a;b.g.position.set(b.cx+Math.cos(a)*b.r,b.h+Math.sin(a*3)*.4,b.cz+Math.sin(a)*b.r);b.g.rotation.y=-a;const f=Math.sin(tm*8+b.ph)*.6;b.g.userData.wl.rotation.z=-f;b.g.userData.wr.rotation.z=f});
crabs.forEach(c=>{const g=c.g;c.t-=dt;if(c.t<0){c.t=1+Math.random()*3;c.d=Math.random()<.35?0:(Math.random()<.5?-1:1)}let d=c.d;const px=g.position.x-player.position.x,pz=g.position.z-player.position.z,near=Math.hypot(px,pz)<3.5;if(near)d=px>=0?1:-1;g.position.x=Math.max(-45,Math.min(45,g.position.x+d*(near?2.6:.8)*dt));g.position.y=.1+(d?Math.abs(Math.sin(tm*14))*.02:0)});
fishes.forEach((f,i)=>{f.t+=dt;if(clean()*8<=i){f.g.visible=false;return}if(f.t<0){f.g.visible=false;return}const p=f.t/1.2;if(p>1){f.t=-(2+Math.random()*5);f.x=(Math.random()-.5)*70;f.z=-28-Math.random()*20;f.a=Math.random()*6.28;f.g.visible=false;return}f.g.visible=true;f.g.position.set(f.x+Math.cos(f.a)*p*4,Math.sin(p*Math.PI)*1.3-.15,f.z+Math.sin(f.a)*p*4);f.g.rotation.y=Math.atan2(Math.cos(f.a),Math.sin(f.a));f.g.rotation.x=-Math.cos(p*Math.PI)*.7});
turtle.visible=c>.4;{const a=tm*.12;turtle.position.set(-12+Math.cos(a)*6,-.02+Math.sin(tm)*.03,-30+Math.sin(a)*3);turtle.rotation.y=Math.atan2(-Math.sin(a)*6,Math.cos(a)*3)}
clouds.forEach(c=>{c.position.x+=dt*c.userData.v;if(c.position.x>95)c.position.x=-95});
const u=player.userData;let moving=false;
if(mode==='play'){let dx=(K.d?1:0)-(K.a?1:0)+jx,dz=(K.s?1:0)-(K.w?1:0)+jz;if(Math.hypot(dx,dz)<.2)dx=dz=0;else{const c=Math.cos(camYaw),n=Math.sin(camYaw),rx=dx*c+dz*n;dz=-dx*n+dz*c;dx=rx}if(busy){dx=dz=0;hasT=false}if(!dx&&!dz&&hasT){const ex=tg.x-player.position.x,ez=tg.z-player.position.z,d=Math.hypot(ex,ez);if(d>.3){dx=ex/d;dz=ez/d}else hasT=false}
if(dx||dz){const l=Math.hypot(dx,dz);dx/=l;dz/=l;player.position.x=Math.max(-48,Math.min(48,player.position.x+dx*spd()*dt));player.position.z=Math.max(-18,Math.min(40,player.position.z+dz*spd()*dt));
let a=Math.atan2(dx,dz),d=a-player.rotation.y;d=Math.atan2(Math.sin(d),Math.cos(d));player.rotation.y+=d*Math.min(1,dt*10);moving=true}
const nb=nearest();$('#pickBtn').classList.toggle('on',!!nb);hl.visible=!!nb;if(nb)hl.position.set(nb.position.x,.03,nb.position.z);
if(Math.hypot(player.position.x-post.position.x,player.position.z-post.position.z)<5)unload()}
ph+=dt*(moving?spd()*2.1:0);wk+=((moving?1:0)-wk)*Math.min(1,dt*10);const sig=''+G.up.spd+G.up.cap+G.up.reach+G.up.bonus;if(sig!==gearSig){gearSig=sig;applyGear()}
pickT=Math.max(0,pickT-dt);
const pk=pickT>0?Math.sin((1-pickT/PD)*Math.PI):0,sw=Math.sin(ph)*wk,fill=G.hold.length/cap();
const dr=u.lg.map((l,i)=>{const p=ph+i*Math.PI,a=-Math.sin(p)*.6*wk-pk*.5,k=Math.max(0,Math.cos(p))*.9*wk+pk*.9+.04;l.th.rotation.x=a;l.kn.rotation.x=k;l.an.rotation.x=-(a+k)*.7;return .43*Math.cos(a)+.42*Math.cos(a+k)});
u.hip.position.y=Math.max(dr[0],dr[1])+.1;player.position.y=0;
u.tor.rotation.y=sw*.14;u.hip.rotation.y=-sw*.08;u.tor.rotation.x=.06*wk+.5*pk+fill*.08;u.tor.scale.y=1+Math.sin(tm*2)*.008;u.head.rotation.y=-sw*.1;
const br=Math.sin(tm*1.5)*.03,hasTool=G.up.reach>0;
u.L.sh.rotation.x=sw*.55+br;u.L.sh.rotation.z=-.06;u.L.el.rotation.x=-.2-.25*Math.abs(sw);
u.R.sh.rotation.x=-sw*(hasTool?.2:.55)-pk-br-(hasTool?.25:0);u.R.sh.rotation.z=.06;u.R.el.rotation.x=-.2-.25*Math.abs(sw)-pk*.4-(hasTool?.5:0);
const jw=u.tool.userData.jaws;if(jw){const o=pickT>0&&pickT<PD/2?.02:.3;jw[0].rotation.x=-o;jw[1].rotation.x=o}
const bd=u.bagG.userData;if(bd.body){bd.body.scale.copy(bd.k).multiplyScalar(.85+fill*.3);bd.pk.forEach((m,i)=>m.visible=fill>(i+.5)/3.2)}
const cd=camD*Math.cos(camPit);cam.position.lerp(new THREE.Vector3(player.position.x+Math.sin(camYaw)*cd,camD*Math.sin(camPit),player.position.z+Math.cos(camYaw)*cd),.12);cam.lookAt(player.position.x,1.2,player.position.z);sun.target.position.copy(player.position);sun.position.set(player.position.x+25,40,player.position.z+15);
items.forEach((g,i)=>{g.position.y=0});R.render(sc,cam)}
respawn();hud();menu();requestAnimationFrame(loop);
