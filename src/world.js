import * as THREE from 'three';
import {box,sphere,cyl,torus,tube,lathe,arch,pointedPane,mesh,mergeStatic,PI} from './geometry.js';
import {random,glowTexture} from './materials.js';

export function createWorld(scene,m) {
  const root=new THREE.Group();scene.add(root);const rng=random(71),flames=[],floaters=[],colliders=[],glow=glowTexture();
  const ornament=new THREE.Group();scene.add(ornament);
  const orrery=new THREE.Group();orrery.position.set(0,1.6,-5);scene.add(orrery);
  function sprite(parent,color,x,y,z,size,opacity=.5){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glow,color,transparent:true,opacity,depthWrite:false,blending:THREE.AdditiveBlending}));s.position.set(x,y,z);s.scale.set(size,size,size);parent.add(s);return s;}
  function pillar(parent,x,z,h=4.75){
    box(parent,m.darkStone,x,.13,z,1.15,.26,1.15);box(parent,m.edge,x,.32,z,.97,.14,.97);box(parent,m.stone,x,h/2,z,.64,h,.64);
    for(const [dx,dz] of [[-.36,-.36],[.36,-.36],[-.36,.36],[.36,.36]]){cyl(parent,m.edge,x+dx,h/2+.1,z+dz,.11,.15,h-.15,12);cyl(parent,m.edge,x+dx,.5,z+dz,.17,.21,.23,12);cyl(parent,m.edge,x+dx,h-.12,z+dz,.21,.13,.25,12);}
    box(parent,m.edge,x,h,z,.98,.24,.98);box(parent,m.stone,x,h+.18,z,1.12,.15,1.12);box(parent,m.edge,x,.72,z,.78,.12,.78);
  }
  function candle(parent,x,y,z,height=.38,floating=false){
    const g=new THREE.Group();g.position.set(x,y,z);parent.add(g);
    cyl(g,m.gold,0,.03,0,.105,.13,.06,12);cyl(g,m.wax,0,height/2+.055,0,.055,.06,height,12);
    const flame=sphere(g,m.flame,0,height+.11,0,.06,.6,1.6,.6);flame.castShadow=false;
    const light=sprite(g,'#ffb856',0,height+.13,0,.7,.52);flames.push({flame,light,phase:rng()*PI*2,base:height+.11});
    if(floating)floaters.push({g,y,phase:rng()*PI*2});return g;
  }
  function bench(x,z,rotation){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=rotation;root.add(g);box(g,m.wood,0,.58,0,2.3,.15,.67);box(g,m.wood,0,1.08,-.28,2.3,.75,.11);for(const sx of [-.87,.87]){box(g,m.woodEdge,sx,.28,0,.13,.56,.5);box(g,m.woodEdge,sx,.95,0,.08,.65,.08);box(g,m.woodEdge,sx,1.2,0,.12,.09,.7);}for(let i=-3;i<=3;i++)box(g,m.woodEdge,i*.29,1.08,-.22,.045,.6,.045);colliders.push({x,z,r:1.3});}
  function urn(x,z){lathe(root,m.darkStone,[[0,0],[.45,0],[.45,.15],[.26,.23],[.22,.38],[.42,.5],[.54,.84],[.48,1],[.55,1.07],[.55,1.13],[.43,1.13],[.36,.8],[0,.65]],x,0,z);for(let i=0;i<17;i++){const a=rng()*PI*2,h=.55+rng()*.9,rad=.3+rng()*.4;const points=[[x,1,z],[x+Math.cos(a)*rad*.6,1+h*.6,z+Math.sin(a)*rad*.6],[x+Math.cos(a)*rad,1+h,z+Math.sin(a)*rad]];tube(root,m.leaves,points,.015,6);for(let j=1;j<4;j++){const t=j/3;const leaf=sphere(root,i%2?m.leaves:m.leavesLight,x+Math.cos(a)*rad*t,1+h*t,z+Math.sin(a)*rad*t,.16,.5,1.5,.19);leaf.rotation.set(rng(),a,rng());}}colliders.push({x,z,r:.7});}
  function banner(x,z,rotation){const g=new THREE.Group();root.add(g);g.position.set(x,0,z);g.rotation.y=rotation;
    box(g,m.gold,0,5.7,0,1.4,.045,.05);sphere(g,m.gold,-.76,5.7,0,.065);sphere(g,m.gold,.76,5.7,0,.065);
    const shape=new THREE.Shape();shape.moveTo(-.59,5.65);shape.lineTo(.59,5.65);shape.lineTo(.59,3.28);shape.lineTo(0,2.94);shape.lineTo(-.59,3.28);shape.closePath();mesh(new THREE.ShapeGeometry(shape),m.cloth,g);
    tube(g,m.gold,[[-.54,5.5,.02],[-.54,3.33,.02],[0,3.02,.02],[.54,3.33,.02],[.54,5.5,.02]],.015,12);
    torus(g,m.gold,0,4.55,.035,.31,.014);const crescent=torus(g,m.lightGold,0,4.55,.055,.21,.032);crescent.scale.x=.68;
    for(let i=0;i<4;i++){const a=i*PI/2;sphere(g,m.gold,Math.sin(a)*.4,4.55+Math.cos(a)*.4,.035,.035);}
  }
  // A tiled, open-air cloister with a raised stone perimeter.
  box(root,m.floor,0,-.14,-2,23,.24,44);
  for(const x of [-10.55,10.55]){box(root,m.darkStone,x,.12,-2,.7,.24,44);box(root,m.gold,x+Math.sign(x)*-.44,.008,-2,.024,.02,44);}
  for(const x of [-7.3,7.3])box(root,m.darkStone,x,.004,-2,.16,.02,43.5);
  for(let z=-22;z<20;z+=3.2) for(const x of [-7.1,7.1]) {const b=box(root,m.gold,x,.014,z,.1,.015,.1);b.rotation.y=PI/4;}
  const stations=[-22,-15.5,-9,-2.5,4,10.5,17];
  for(const side of [-1,1]) {
    box(root,m.wall,side*11.6,4,-2,.55,8.2,44);
    box(root,m.edge,side*11.25,1.08,-2,.12,.13,44);
    box(root,m.darkStone,side*11.24,.36,-2,.16,.55,44);
    box(root,m.darkStone,side*9.1,8.4,-2,5.2,.45,44);
    box(root,m.edge,side*8,8.68,-2,.25,.16,44);
    box(root,m.stone,side*9.65,9.2,-2,3.1,1,44);
    for(let z=-23;z<20;z+=1.2){box(root,m.edge,side*8.15,8.91,z,.24,.22,.75);box(root,m.darkStone,side*8.3,9.65,z,.65,.36,.5);}
    for(const z of stations){pillar(root,side*8,z);pillar(root,side*11.18,z,4.7);}
    for(let i=0;i<stations.length-1;i++){
      const z=(stations[i]+stations[i+1])/2;
      const a=arch(root,m.edge,side*8,4.83,z,5.55,3.05,.26,.7);a.rotation.y=PI/2;
      const trim=arch(root,m.darkStone,side*8,4.81,z,5.05,2.89,.10,.76);trim.rotation.y=PI/2;
      const back=new THREE.Group();back.position.set(side*11.27,0,z);back.rotation.y=side===1?-PI/2:PI/2;root.add(back);
      pointedPane(back,m.dark,0,1.55,.01,3.65,5.8);pointedPane(back,m.window,0,1.72,.035,3.3,5.35);
      arch(back,m.edge,0,4.61,.08,3.6,2.65,.16,.2);
      box(back,m.edge,-1.82,3.13,.05,.2,3,.22);box(back,m.edge,1.82,3.13,.05,.2,3,.22);box(back,m.edge,0,1.57,.06,3.95,.2,.3);
      for(const offset of [-.92,0,.92]){box(back,m.edge,offset,3.5,.09,.07,3.6,.1);arch(back,m.edge,offset,5.07,.09,.81,1.1,.045,.1);}
      box(back,m.edge,0,3.75,.09,3.5,.06,.1);box(back,m.edge,0,5.04,.09,3.4,.07,.1);
      // transverse vault ribs above each side aisle
      const rib=arch(root,m.edge,side*9.65,4.95,z,3.15,2.7,.12,.18);
      if(i%2===0)banner(side*7.58,z,side===1?-PI/2:PI/2);
    }
  }
  // The distant sanctuary and its rose window.
  box(root,m.wall,0,5.1,-24,24,10.2,.75);
  box(root,m.darkStone,0,11.2,-24,12,2,.85);
  const rear=new THREE.Group();rear.position.set(0,0,-23.5);root.add(rear);
  pointedPane(rear,m.dark,0,.05,.02,6.4,8.5);pointedPane(rear,m.window,0,.12,.06,5.98,8.1);
  arch(rear,m.edge,0,4.55,.18,6.45,4.2,.34,.5);arch(rear,m.gold,0,4.54,.46,5.82,3.85,.035,.045);
  for(const x of [-3.4,3.4]){pillar(rear,x,0,4.5);box(rear,m.edge,x,7.4,-.05,.37,4.9,.75);cyl(rear,m.edge,x,10.3,-.05,0,.36,1.25,6);}
  for(const x of [-2,-1,0,1,2]){box(rear,m.darkStone,x,3.25,.16,.08,6.2,.13);arch(rear,m.edge,x,5.45,.14,.91,1.7,.05,.16);}
  for(const y of [1.8,4.1,5.5])box(rear,m.darkStone,0,y,.14,6,.09,.14);
  const roseZ=.47;
  for(const r of [2.08,1.86,1.59,.54])torus(rear,r===1.86?m.gold:m.edge,0,9.6,roseZ,r,r===2.08?.16:.075);
  const roseBack=cyl(rear,m.window,0,9.6,.1,1.9,1.9,.03,64);roseBack.rotation.x=PI/2;
  for(let i=0;i<12;i++){const a=i*PI/6;const ring=torus(rear,m.edge,Math.cos(a)*1.08,9.6+Math.sin(a)*1.08,roseZ,.5,.05);ring.scale.y=1.1;const spoke=box(rear,m.gold,Math.cos(a)*1.09,9.6+Math.sin(a)*1.09,.53,.04,1.15,.05);spoke.rotation.z=a-PI/2;}
  for(const side of [-1,1]){for(const xx of [5.1,9.4]){const x=xx*side;pillar(rear,x,0,6.8);arch(rear,m.edge,x,6.84,.1,2.7,2.4,.15,.3);pointedPane(rear,m.dark,x,1.1,.03,2.5,7.7);box(rear,m.edge,x,3.7,.14,.08,5,.1);}
    banner(side*5.1,-22.95,0);
  }
  box(root,m.edge,0,.17,-21,12,.34,4);box(root,m.darkStone,0,.1,-18.9,11.2,.2,.5);
  for(let i=0;i<2;i++)box(root,m.darkStone,0,.04+i*.065,-18.2-i*.3,10.8-i*.3,.1,.4);
  // A carved entrance completes the cloister in every camera direction.
  const entrance=new THREE.Group();entrance.position.set(0,0,21);entrance.rotation.y=PI;root.add(entrance);
  box(entrance,m.wall,0,5,0,24,10,.65);
  pointedPane(entrance,m.dark,0,.02,.39,6.6,8.1);
  pointedPane(entrance,m.wood,0,.05,.43,5.8,7.65);
  arch(entrance,m.edge,0,4.6,.5,6.1,3.4,.27,.55);
  for(const x of [-3.15,3.15])pillar(entrance,x,.42,4.6);
  box(entrance,m.woodEdge,0,3.5,.51,.12,6.8,.16);
  for(const x of [-2.42,-1.22,1.22,2.42]){
    box(entrance,m.woodEdge,x,2.75,.51,.09,5.35,.12);
    for(const y of [.5,2.2,4.4])box(entrance,m.woodEdge,x-Math.sign(x)*.4,y,.51,.8,.07,.12);
    arch(entrance,m.gold,x-Math.sign(x)*.45,4.45,.51,.84,1.45,.022,.06);
  }
  for(const x of [-.3,.3]){torus(entrance,m.gold,x,2.55,.57,.14,.025);sphere(entrance,m.gold,x,2.72,.56,.065);}
  for(const x of [-7.8,7.8]){pointedPane(entrance,m.dark,x,1.4,.36,3.2,5.8);arch(entrance,m.edge,x,4.55,.45,3.2,2.7,.18,.3);box(entrance,m.edge,x-1.67,2.98,.43,.2,3,.3);box(entrance,m.edge,x+1.67,2.98,.43,.2,3,.3);banner(x,20.45,PI);}
  box(entrance,m.edge,0,9.9,0,24,.26,1);box(entrance,m.darkStone,0,.12,.7,24,.24,1.4);
  for(const x of [-3.5,3.5]){candle(ornament,x,.1,19.7,.5);candle(ornament,x+.2,.1,19.8,.3);}
  // Silhouettes above the parapets.
  for(const side of [-1,1])for(let i=0;i<5;i++){const x=side*(12+rng()*11),z=-29-rng()*7,h=10+rng()*8;box(root,m.darkStone,x,h/2,z,2.2,h,2.2);cyl(root,m.blackMetal,x,h+2.5,z,0,1.9,5,8);cyl(root,m.gold,x,h+5.4,z,.03,.03,1.2,8);}
  // Central inlaid mosaic and brass astrolabe.
  cyl(root,m.darkStone,0,.055,-5,3.5,3.65,.11,96);cyl(root,m.edge,0,.13,-5,3.18,3.45,.17,96);cyl(root,m.darkStone,0,.235,-5,2.96,3.13,.16,96);
  for(const radius of [3.22,2.84,2.55]){const ring=torus(root,m.gold,0,.327,-5,radius,.022);ring.rotation.x=PI/2;}
  for(let i=0;i<48;i++){const a=i*PI/24,rad=2.7;const mark=box(root,m.lightGold,Math.sin(a)*rad,.332,-5+Math.cos(a)*rad,.022,.012,i%4===0?.22:.08);mark.rotation.y=a;}
  for(let i=0;i<8;i++){const a=i*PI/4;const g=new THREE.Group();root.add(g);g.position.set(Math.sin(a)*2.21,.337,-5+Math.cos(a)*2.21);g.rotation.y=a;for(const p of [-1,1]){const mark=box(g,m.gold,p*.045,0,0,.018,.015,.22);mark.rotation.y=p*.35;}box(g,m.gold,0,0,.04,.12,.015,.018);}
  lathe(root,m.darkStone,[[0,0],[1.05,0],[1.1,.1],[.98,.2],[.82,.26],[.7,.48],[.68,.85],[.9,.96],[1.02,1.08],[1.02,1.2],[.89,1.25],[0,1.25]],0,.3,-5);
  for(const y of [.52,1.32,1.48]){const ring=torus(root,m.gold,0,y,-5,y<1?.91:.98,.035);ring.rotation.x=PI/2;}
  cyl(root,m.water,0,1.555,-5,.9,.9,.018,64);
  const arms=[];
  for(let i=0;i<4;i++){const g=new THREE.Group();orrery.add(g);g.position.y=1.5;g.rotation.set(.35+i*.63,.2+i*.71,.2+i*.4);const radius=1.1+i*.28;torus(g,i%2?m.lightGold:m.gold,0,0,0,radius,.026+i*.004);for(let j=0;j<24;j++){const a=j*PI/12;const tick=box(g,m.lightGold,Math.cos(a)*radius,Math.sin(a)*radius,0,.017,.10,.036);tick.rotation.z=a-PI/2;}const savedPos=g.position.clone(),savedRot=g.rotation.clone();orrery.remove(g);g.position.set(0,0,0);g.rotation.set(0,0,0);mergeStatic(g);g.position.copy(savedPos);g.rotation.copy(savedRot);orrery.add(g);arms.push(g);}
  const orb=sphere(orrery,m.cyan,0,1.5,0,.22);sprite(orrery,'#6fddff',0,1.5,0,2.5,.46);
  const halo=torus(orrery,m.cyan,0,1.5,0,.32,.007);halo.rotation.x=PI/2;
  const orbitPoints=[];for(let i=0;i<160;i++){const a=rng()*PI*2,r=.5+rng()*1.9;orbitPoints.push(Math.cos(a)*r,(rng()-.5)*2.5+1.5,Math.sin(a)*r);}
  const starGeo=new THREE.BufferGeometry();starGeo.setAttribute('position',new THREE.Float32BufferAttribute(orbitPoints,3));const orbitDust=new THREE.Points(starGeo,new THREE.PointsMaterial({color:'#87daee',size:.035,map:glow,transparent:true,opacity:.8,depthWrite:false,blending:THREE.AdditiveBlending}));orrery.add(orbitDust);
  colliders.push({x:0,z:-5,r:1.16});
  // Furniture and candlelit studies tucked into the arcade.
  for(const side of [-1,1]){
    bench(side*9.7,3.1,side===1?-PI/2:PI/2);bench(side*9.7,-10.5,side===1?-PI/2:PI/2);
    for(const z of [8,-15.5])urn(side*7.15,z);
    for(const z of [-18,0,13]){
      const x=side*8.04;
      const bracket=torus(root,m.blackMetal,x,2.7,z,.22,.035);bracket.rotation.y=PI/2;
      cyl(root,m.gold,x,3.03,z,.2,.08,.22,16);
      candle(ornament,x,3.16,z,.52);candle(ornament,x,3.16,z-.23,.35);candle(ornament,x,3.16,z+.23,.4);
      sprite(ornament,'#ffad55',x-side*.12,3.55,z,2.7,.11);
    }
    const table=new THREE.Group();table.position.set(side*9.75,0,-4.2);root.add(table);box(table,m.wood,0,.95,0,1.8,.12,1.5);for(const x of [-.7,.7])for(const z of [-.57,.57]){cyl(table,m.woodEdge,x,.45,z,.045,.085,.9,12);sphere(table,m.woodEdge,x,.65,z,.085);}
    for(let i=0;i<6;i++){const b=new THREE.Group();b.position.set((rng()-.5)*.5,1.08+i*.09,(rng()-.5)*.2);b.rotation.y=rng()*.6;root.add(b);b.position.x+=side*9.75;b.position.z+=-4.2;box(b,m.pages,0,0,0,.43,.07,.55);for(const y of [-.043,.043])box(b,[m.bookBlue,m.bookRed,m.bookGreen][i%3],0,y,0,.47,.017,.58);box(b,m.gold,-.222,0,.19,.009,.07,.025);}
    candle(ornament,side*9.75+.55,1.02,-4.5,.65);colliders.push({x:side*9.75,z:-4.2,r:1.2});
  }
  for(let i=0;i<34;i++){const side=i%2===0?-1:1;const x=side*(1.7+rng()*4.6),z=-18+rng()*34,y=4.1+rng()*3.4;candle(ornament,x,y,z,.22+rng()*.28,true);}
  for(const z of [-19,-11,0,11])for(const x of [-6.8,6.8]){candle(ornament,x,.02,z,.3);candle(ornament,x+.18,.02,z+.2,.16);candle(ornament,x-.13,.02,z-.15,.23);}
  // Ivy follows the stone rather than covering the architecture in a flat decal.
  for(const side of [-1,1])for(const z of [-20,-8,11]){
    const baseX=side*7.62, points=[];for(let k=0;k<9;k++)points.push([baseX+Math.sin(k*1.7)*.13,k*.83,z+Math.sin(k*.75)*.6]);tube(root,m.wood,points,.025,24);
    for(let i=0;i<36;i++){const y=rng()*6.6,zz=z+Math.sin(y*.9)*.6+(rng()-.5)*.8,xx=baseX+(rng()-.5)*.35;const leaf=sphere(root,i%3?m.leaves:m.leavesLight,xx,y,zz,.12,1,.45,1.5);leaf.rotation.set(rng()*PI,rng()*PI,rng()*PI);}
  }
  // Tiny, irregular imperfections soften the empty paving.
  for(let i=0;i<65;i++){const x=(rng()-.5)*20,z=(rng()-.5)*40;if(Math.abs(x)<3)continue;const leaf=sphere(root,m.leavesLight,x,.017,z,.04,1,.08,1.8);leaf.rotation.y=rng()*PI;}
  mergeStatic(root);
  // Hundreds of candles share three instanced draws; their individual motion is retained.
  ornament.updateMatrixWorld(true);
  const sourceMeshes=new Map(),sourceSprites=[];
  ornament.traverse(o=>{if(o.isMesh){if(!sourceMeshes.has(o.material))sourceMeshes.set(o.material,[]);sourceMeshes.get(o.material).push(o);}if(o.isSprite)sourceSprites.push(o);});
  const candleBatches=[];
  for(const [material,sources] of sourceMeshes){const batch=new THREE.InstancedMesh(sources[0].geometry,material,sources.length);batch.instanceMatrix.setUsage(THREE.DynamicDrawUsage);batch.frustumCulled=false;batch.castShadow=material!==m.flame;scene.add(batch);candleBatches.push({batch,sources,baseHeight:sources[0].geometry.parameters.height||1});}
  scene.remove(ornament);
  const glowPositions=new Float32Array(sourceSprites.length*3),glowColors=new Float32Array(sourceSprites.length*3),glowSizes=new Float32Array(sourceSprites.length),glowOpacity=new Float32Array(sourceSprites.length);
  sourceSprites.forEach((s,i)=>{s.material.color.toArray(glowColors,i*3);glowSizes[i]=s.scale.x;glowOpacity[i]=s.material.opacity;});
  const glowGeo=new THREE.BufferGeometry();glowGeo.setAttribute('position',new THREE.BufferAttribute(glowPositions,3));glowGeo.setAttribute('color',new THREE.BufferAttribute(glowColors,3));glowGeo.setAttribute('size',new THREE.BufferAttribute(glowSizes,1));glowGeo.setAttribute('alpha',new THREE.BufferAttribute(glowOpacity,1));
  const glowMat=new THREE.ShaderMaterial({uniforms:{map:{value:glow},screenHeight:{value:window.innerHeight}},vertexShader:`attribute float size;attribute float alpha;varying vec3 vColor;varying float vAlpha;uniform float screenHeight;void main(){vColor=color;vAlpha=alpha;vec4 mv=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*mv;gl_PointSize=size*screenHeight/(-mv.z);}`,fragmentShader:`uniform sampler2D map;varying vec3 vColor;varying float vAlpha;void main(){vec4 t=texture2D(map,gl_PointCoord);gl_FragColor=vec4(vColor,t.a*vAlpha);}`,vertexColors:true,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
  const glows=new THREE.Points(glowGeo,glowMat);glows.frustumCulled=false;scene.add(glows);const candleMatrix=new THREE.Matrix4(),candleScale=new THREE.Matrix4(),candlePos=new THREE.Vector3();
  // Moon and a field of stars beyond the open roof.
  const moonMat=new THREE.MeshBasicMaterial({color:'#ddeaf0',fog:false});const moon=mesh(new THREE.SphereGeometry(1.1,64,40),moonMat,scene,-9,17,-42);moon.castShadow=false;
  sprite(scene,'#bcd5e4',-9,17,-42,8,.13);sprite(scene,'#a3bbd9',-9,17,-42,18,.035);
  const shaftMaterial=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,uniforms:{tint:{value:new THREE.Color('#7199bb')}},vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`varying vec2 vUv;uniform vec3 tint;void main(){float edge=pow(sin(vUv.x*3.14159),3.);float fade=sin(vUv.y*3.14159);gl_FragColor=vec4(tint,edge*fade*.021);}`});
  for(const z of [-13,3]){const shaft=mesh(new THREE.CylinderGeometry(.3,2.7,15,24,1,true),shaftMaterial,scene,-2,6.8,z);shaft.rotation.z=-.48;shaft.castShadow=false;shaft.receiveShadow=false;}
  const stars=[];for(let i=0;i<750;i++){const a=rng()*PI*2,e=.1+rng()*1.1,r=85;stars.push(Math.cos(a)*Math.cos(e)*r,Math.sin(e)*r,Math.sin(a)*Math.cos(e)*r);}
  const starsGeo=new THREE.BufferGeometry();starsGeo.setAttribute('position',new THREE.Float32BufferAttribute(stars,3));const starfield=new THREE.Points(starsGeo,new THREE.PointsMaterial({color:'#b5c9d5',size:.10,map:glow,transparent:true,opacity:.75,depthWrite:false,fog:false}));scene.add(starfield);
  const dustPositions=[],dustSpeeds=[];for(let i=0;i<250;i++){dustPositions.push((rng()-.5)*19,rng()*8,-22+rng()*40);dustSpeeds.push(.1+rng()*.2);}
  const dustGeo=new THREE.BufferGeometry();dustGeo.setAttribute('position',new THREE.Float32BufferAttribute(dustPositions,3));const dust=new THREE.Points(dustGeo,new THREE.PointsMaterial({color:'#c2b38c',map:glow,size:.04,transparent:true,opacity:.55,depthWrite:false,blending:THREE.AdditiveBlending}));scene.add(dust);
  const runeCanvas=document.createElement('canvas');runeCanvas.width=runeCanvas.height=512;const ctx=runeCanvas.getContext('2d');ctx.translate(256,256);ctx.strokeStyle='#a2e2ea';ctx.lineWidth=1.5;for(const r of [180,190,228]){ctx.beginPath();ctx.arc(0,0,r,0,PI*2);ctx.stroke();}ctx.font='24px Georgia';ctx.fillStyle='#a2e2ea';ctx.textAlign='center';for(let i=0;i<24;i++){ctx.save();ctx.rotate(i*PI/12);ctx.fillText(['ᚨ','ᚱ','ᛟ','ᛉ','ᛞ','ᚾ'][i%6],0,-200);ctx.restore();}const runes=mesh(new THREE.PlaneGeometry(8,8),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(runeCanvas),transparent:true,opacity:.12,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide}),scene,0,.35,-5);runes.rotation.x=-PI/2;
  return {colliders,orrery,orb,runes,update(t,dt,awakened){
    flames.forEach(({flame,light,phase,base})=>{const f=1+Math.sin(t*8+phase)*.12+Math.sin(t*13+phase)*.05;flame.scale.y=1.6*f;flame.position.y=base+Math.sin(t*4+phase)*.01;light.material.opacity=.45+f*.08;});
    floaters.forEach(({g,y,phase})=>{g.position.y=y+Math.sin(t*.65+phase)*.13;g.rotation.z=Math.sin(t*.4+phase)*.04;});
    ornament.updateMatrixWorld(true);
    for(const {batch,sources,baseHeight} of candleBatches){sources.forEach((o,i)=>{candleMatrix.copy(o.matrixWorld);candleScale.makeScale(1,(o.geometry.parameters.height||1)/baseHeight,1);candleMatrix.multiply(candleScale);batch.setMatrixAt(i,candleMatrix);});batch.instanceMatrix.needsUpdate=true;}
    sourceSprites.forEach((s,i)=>{s.getWorldPosition(candlePos);glowGeo.attributes.position.setXYZ(i,candlePos.x,candlePos.y,candlePos.z);});glowGeo.attributes.position.needsUpdate=true;glowMat.uniforms.screenHeight.value=window.innerHeight;
    arms.forEach((arm,i)=>{arm.rotation.y+=dt*(i%2?1:-1)*(awakened?.28:.055);arm.rotation.z+=dt*.026*(i+1);});
    orb.position.y=1.5+Math.sin(t)*.08;orbitDust.rotation.y=t*.1;runes.rotation.z=t*.015;runes.material.opacity=THREE.MathUtils.lerp(runes.material.opacity,awakened?.7:.12,.03);
    const pos=dust.geometry.attributes.position;for(let i=0;i<pos.count;i++){pos.array[i*3]+=Math.sin(t*.2+i)*dt*.025;pos.array[i*3+1]+=dustSpeeds[i]*dt*.22;if(pos.array[i*3+1]>8)pos.array[i*3+1]=.2;}pos.needsUpdate=true;
  }};
}
