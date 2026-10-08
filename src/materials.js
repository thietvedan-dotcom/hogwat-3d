import * as THREE from 'three';

export function random(seed = 7) {
  let state = seed;
  return () => { state = (Math.imul(state, 1664525) + 1013904223) | 0; return (state >>> 0) / 4294967296; };
}
function stoneTexture(floor = false) {
  const size = 1024, canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d'), rng = random(floor ? 24 : 19);
  ctx.fillStyle = floor ? '#616a6b' : '#737775'; ctx.fillRect(0,0,size,size);
  const rows = floor ? 4 : 8, cols = floor ? 4 : 3, h = size/rows, w = size/cols;
  for(let y=0;y<rows;y++) for(let x=-1;x<cols+1;x++) {
    const px=x*w+(y%2 && !floor ? w/2:0), py=y*h, v=Math.floor(91+rng()*28);
    ctx.fillStyle=`rgb(${v},${v+4},${v+3})`; ctx.fillRect(px+2,py+2,w-4,h-4);
    const g=ctx.createLinearGradient(px,py,px+w,py+h);g.addColorStop(0,'#ffffff12');g.addColorStop(1,'#00000018');ctx.fillStyle=g;ctx.fillRect(px+3,py+3,w-6,h-6);
    ctx.strokeStyle='#c9d0c21f';ctx.lineWidth=2;ctx.strokeRect(px+4,py+4,w-8,h-8);
    for(let j=0;j<14;j++){const sx=px+rng()*w,sy=py+rng()*h;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx+20+rng()*55,sy+rng()*8-4);ctx.strokeStyle=`rgba(32,41,41,${rng()*.19})`;ctx.lineWidth=rng()*1.5;ctx.stroke();}
  }
  const img=ctx.getImageData(0,0,size,size);
  for(let i=0;i<img.data.length;i+=4){const n=(rng()-.5)*15;img.data[i]+=n;img.data[i+1]+=n;img.data[i+2]+=n;}
  ctx.putImageData(img,0,0);
  const tex=new THREE.CanvasTexture(canvas);tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=8;return tex;
}
function fabricTexture() {
  const canvas=document.createElement('canvas');canvas.width=canvas.height=128;const ctx=canvas.getContext('2d');ctx.fillStyle='#ababab';ctx.fillRect(0,0,128,128);
  for(let i=0;i<128;i+=2){ctx.fillStyle=i%4===0?'#969696':'#b3b3b3';ctx.fillRect(i,0,1,128);ctx.fillStyle='#81818144';ctx.fillRect(0,i,128,1);}const t=new THREE.CanvasTexture(canvas);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(6,6);return t;
}
export function glowTexture() {
  const canvas=document.createElement('canvas');canvas.width=canvas.height=128;const ctx=canvas.getContext('2d');const g=ctx.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.12,'rgba(255,255,255,.8)');g.addColorStop(.35,'rgba(255,255,255,.18)');g.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=g;ctx.fillRect(0,0,128,128);return new THREE.CanvasTexture(canvas);
}
export async function createMaterials() {
  const loader=new THREE.TextureLoader();
  async function load(name,color=false,x=1,y=1){const t=await loader.loadAsync('/textures/'+name+'.jpg');t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(x,y);t.anisotropy=8;if(color)t.colorSpace=THREE.SRGBColorSpace;return t;}
  const [stone,stoneNormal,masonry,masonryNormal,floor,floorNormal,wood,woodRough]=await Promise.all([
    load('limestone-color',true),load('limestone-normal'),load('masonry-color',true,8,3),load('masonry-normal',false,8,3),load('paving-color',true,5,10),load('paving-normal',false,5,10),load('wood-color',true,1,2),load('wood-roughness',false,1,2)
  ]);const fabric=fabricTexture();
  const std=(color,roughness=.7,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
  return {
    stone:new THREE.MeshStandardMaterial({color:'#a1a7ac',map:stone,normalMap:stoneNormal,normalScale:new THREE.Vector2(.5,.5),roughness:.88}),
    wall:new THREE.MeshStandardMaterial({color:'#9ea5ac',map:masonry,normalMap:masonryNormal,roughness:.91}),
    edge:new THREE.MeshStandardMaterial({color:'#a8ada9',map:stone,normalMap:stoneNormal,normalScale:new THREE.Vector2(.4,.4),roughness:.72}),
    darkStone:new THREE.MeshStandardMaterial({color:'#535d61',map:stone,normalMap:stoneNormal,normalScale:new THREE.Vector2(.5,.5),roughness:.67}),
    floor:new THREE.MeshStandardMaterial({color:'#8b979e',map:floor,normalMap:floorNormal,normalScale:new THREE.Vector2(.5,.5),roughness:.34,metalness:.2}),
    dark:std('#101d25',.86),gold:std('#a5894d',.32,.78),lightGold:std('#c8ae6b',.28,.72),blackMetal:std('#1c2a31',.4,.72),
    wood:new THREE.MeshStandardMaterial({color:'#433a36',map:wood,roughnessMap:woodRough,roughness:.75}),woodEdge:new THREE.MeshStandardMaterial({color:'#61534a',map:wood,roughnessMap:woodRough,roughness:.65}),pages:std('#b6aa88',.9),bookBlue:std('#263f4b'),bookRed:std('#543538'),bookGreen:std('#3d4a3f'),
    cloth:new THREE.MeshStandardMaterial({color:'#1c344c',bumpMap:fabric,bumpScale:.01,roughness:.94,side:THREE.DoubleSide}),
    skin:new THREE.MeshStandardMaterial({color:'#d7b7af',roughness:.72}),outfit:new THREE.MeshStandardMaterial({color:'#152231',bumpMap:fabric,bumpScale:.006,roughness:.65}),
    outfitBlue:new THREE.MeshStandardMaterial({color:'#1c2d4e',bumpMap:fabric,bumpScale:.007,roughness:.58}),lace:std('#0d1320',.83),hair:std('#100f19',.48,.04),hairHighlight:std('#24212e',.46,.04),
    white:std('#d0c8b4',.9),boots:std('#111721',.35),lips:std('#945b64',.48),iris:std('#637e7b',.3),pupil:std('#11131d',.18),
    leaves:std('#253e35',.9),leavesLight:std('#3f5745',.87),wax:std('#d1be94',.74),
    flame:new THREE.MeshBasicMaterial({color:'#ffcf7b'}),cyan:new THREE.MeshStandardMaterial({color:'#85e5fa',emissive:'#67d5ee',emissiveIntensity:3,roughness:.22,metalness:.3}),
    window:new THREE.MeshBasicMaterial({color:'#375a74',transparent:true,opacity:.5,side:THREE.DoubleSide}),
    water:new THREE.MeshPhysicalMaterial({color:'#163940',metalness:.45,roughness:.12,transparent:true,opacity:.86,clearcoat:1}),
  };
}
