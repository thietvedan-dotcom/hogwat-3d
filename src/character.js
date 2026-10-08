import * as THREE from 'three';
import {box,sphere,cyl,torus,tube,lathe,mesh,mergeStatic,PI} from './geometry.js';
import {random} from './materials.js';

function tailoredSkirt(material) {
  const positions=[],uv=[],indices=[],radial=72,rings=16;
  for(let j=0;j<=rings;j++)for(let i=0;i<=radial;i++){
    const t=j/rings,a=i/radial*PI*2;
    const radius=.19+Math.pow(t,.67)*.265+Math.sin(a*14)*.018*t;
    const hem=(Math.cos(a)+1)*.055;
    positions.push(Math.sin(a)*radius,1.13-t*(.83+hem),Math.cos(a)*radius*.78);uv.push(i/radial,t);
    if(j<rings&&i<radial){const n=j*(radial+1)+i;indices.push(n,n+radial+1,n+1,n+1,n+radial+1,n+radial+2);}
  }
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();return new THREE.Mesh(geo,material);
}
export function createCharacter(scene,m) {
  const character=new THREE.Group();scene.add(character);const visual=new THREE.Group();character.add(visual);const rng=random(63);
  const body=new THREE.Group(),head=new THREE.Group(),skirt=new THREE.Group();visual.add(body,head,skirt);
  const shoulders=[],legs=[],curls=[];
  // A tailored silhouette: fitted bodice, structured shoulders, pleated midnight skirt.
  const bodice=lathe(body,m.outfit,[[.17,1.04],[.185,1.14],[.155,1.24],[.21,1.39],[.24,1.46],[.15,1.54],[.08,1.56]],0,0,0,40);bodice.scale.z=.67;
  sphere(body,m.outfit,0,1.43,.015,.2,1.15,.57,.65);
  const belt=lathe(body,m.outfitBlue,[[.178,1.1],[.182,1.13],[.171,1.19]],0,0,0);belt.scale.z=.69;
  const buckle=torus(body,m.gold,0,1.145,.133,.037,.009);buckle.scale.x=1.2;
  cyl(body,m.skin,0,1.573,.004,.061,.069,.13,24);
  const collar=lathe(body,m.white,[[.073,1.515],[.083,1.53],[.072,1.601]],0,0,0);collar.scale.z=.85;
  for(const side of [-1,1]){
    const shape=new THREE.Shape();shape.moveTo(side*.065,1.565);shape.lineTo(side*.215,1.442);shape.lineTo(side*.076,1.265);shape.lineTo(side*.032,1.435);shape.closePath();const lapel=mesh(new THREE.ShapeGeometry(shape),m.outfitBlue,body,0,0,.148);lapel.rotation.y=side*.1;
    tube(body,m.gold,[[side*.067,1.552,.156],[side*.192,1.444,.168],[side*.076,1.288,.16]],.005,12);
    for(let i=0;i<4;i++)sphere(body,m.gold,side*.062,1.25+i*.055,.145,.011,1,1,.5);
  }
  const tie=lathe(body,m.outfitBlue,[[.025,1.32],[.035,1.35],[.014,1.52],[.024,1.55]],0,0,.172,4);tie.scale.z=.22;
  sphere(body,m.lightGold,-.16,1.445,.147,.027,.7,1,.2);
  const brooch=sphere(body,m.cyan,-.16,1.445,.154,.012,.75,1,.3);brooch.material=m.iris;
  // Silver watch-chain draped across the waistcoat.
  tube(body,m.gold,[[.12,1.23,.145],[.13,1.17,.168],[.06,1.14,.178],[-.055,1.2,.157]],.004,20);
  for(const side of [-1,1]){
    const shoulder=new THREE.Group();shoulder.position.set(side*.23,1.44,0);visual.add(shoulder);shoulders.push(shoulder);
    sphere(shoulder,m.outfit,0,-.035,0,.105,.87,1.02,.95);
    const arm=cyl(shoulder,m.outfit,side*.025,-.19,0,.082,.06,.32,20);arm.rotation.z=side*.13;
    sphere(shoulder,m.outfit,side*.046,-.36,0,.064);
    const forearm=cyl(shoulder,m.outfit,side*.065,-.49,.02,.062,.047,.27,20);forearm.rotation.z=side*.11;
    const cuff=cyl(shoulder,m.outfitBlue,side*.08,-.625,.024,.057,.057,.065,24);cuff.rotation.z=side*.1;
    for(let i=0;i<3;i++)sphere(shoulder,m.gold,side*.12,-.61+i*.035,.037,.01);
    sphere(shoulder,m.outfitBlue,side*.087,-.704,.025,.052,.72,1.2,.48);
    for(let i=0;i<4;i++){const finger=cyl(shoulder,m.outfitBlue,side*.068+i*side*.012,-.763,.027,.007,.006,.055-(i===3?.012:0),8);finger.rotation.z=side*.08;}
    // Folded seam on the shoulder.
    tube(shoulder,m.outfitBlue,[[side*-.065,.002,-.04],[side*.015,.035,.083],[side*.082,-.025,.04]],.012,12);
  }
  // A slender walnut wand held in the right glove.
  const wand=new THREE.Group();shoulders[1].add(wand);wand.position.set(.09,-.745,.055);wand.rotation.x=-.45;
  cyl(wand,m.woodEdge,0,.08,0,.008,.013,.25,10);cyl(wand,m.gold,0,.19,0,.013,.012,.045,10);cyl(wand,m.wood,0,.36,0,.003,.008,.31,10);const wandTip=new THREE.Object3D();wandTip.position.y=.52;wand.add(wandTip);
  const dress=tailoredSkirt(m.outfitBlue);dress.castShadow=true;dress.receiveShadow=true;skirt.add(dress);
  // A second overskirt creates a tailored swallowtail, with visible satin edging.
  const overPositions=[],overUvs=[],overIndices=[];
  for(let j=0;j<=12;j++)for(let i=0;i<=40;i++){const t=j/12,a=.48+i/40*(PI*2-.96),r=.197+Math.pow(t,.72)*.292;overPositions.push(Math.sin(a)*r,1.15-t*.80,Math.cos(a)*r*.80);overUvs.push(i/40,t);if(j<12&&i<40){let n=j*41+i;overIndices.push(n,n+41,n+1,n+1,n+41,n+42);}}
  const overGeo=new THREE.BufferGeometry();overGeo.setAttribute('position',new THREE.Float32BufferAttribute(overPositions,3));overGeo.setAttribute('uv',new THREE.Float32BufferAttribute(overUvs,2));overGeo.setIndex(overIndices);overGeo.computeVertexNormals();mesh(overGeo,m.outfit,skirt);
  for(const side of [-1,1]){const points=[];for(let i=0;i<=18;i++){const t=i/18,r=.197+Math.pow(t,.72)*.294,a=side*.48;points.push([Math.sin(a)*r,1.15-t*.8,Math.cos(a)*r*.81]);}tube(skirt,m.gold,points,.006,24);}
  const hem=[];for(let i=0;i<=100;i++){const a=i/100*PI*2,r=.457+Math.sin(a*14)*.018;hem.push([Math.sin(a)*r,.30-(Math.cos(a)+1)*.055,Math.cos(a)*r*.78]);}tube(skirt,m.lace,hem,.013,100);
  for(let i=0;i<38;i++){const a=i/38*PI*2;const petal=torus(skirt,m.lace,Math.sin(a)*.462,.31-(Math.cos(a)+1)*.055,Math.cos(a)*.36,.028,.005);petal.rotation.y=a;}
  for(const side of [-1,1]){
    const leg=new THREE.Group();leg.position.set(side*.11,.68,0);visual.add(leg);legs.push(leg);
    cyl(leg,m.lace,0,-.22,0,.061,.048,.44,20);cyl(leg,m.boots,0,-.45,0,.065,.058,.33,20);sphere(leg,m.boots,0,-.59,.062,.08,.83,.66,1.7);
    box(leg,m.boots,0,-.642,.048,.13,.035,.26);box(leg,m.blackMetal,0,-.626,-.046,.10,.07,.067);
    for(let i=0;i<5;i++){tube(leg,m.gold,[[-.032,-.4-i*.031,.052],[.032,-.421-i*.031,.052]],.0025,3);}
  }
  // Delicate face proportions and a sculpted, layered hairstyle.
  head.position.set(0,1.78,.005);
  const faceGeometry=new THREE.SphereGeometry(1,64,48);
  const faceVertices=faceGeometry.attributes.position;
  for(let i=0;i<faceVertices.count;i++){
    const x=faceVertices.getX(i),y=faceVertices.getY(i),z=faceVertices.getZ(i);
    const jaw=y<-.18?1+.28*(y+.18):1;
    let depth=z*.154;
    if(z>0){const cheeks=Math.exp(-((Math.abs(x)-.44)**2/.12+(y+.25)**2/.14))*.006;depth+=cheeks;}
    faceVertices.setXYZ(i,x*.171*jaw,y*.211,depth);
  }
  faceGeometry.computeVertexNormals();mesh(faceGeometry,m.skin,head);
  const faceSphere=(material,x,y,z,r,sx=1,sy=1,sz=1)=>{const o=mesh(new THREE.SphereGeometry(r,32,24),material,head,x,y,z);o.scale.set(sx,sy,sz);return o;};
  for(const side of [-1,1])sphere(head,m.skin,side*.155,-.025,-.008,.033,.6,1.28,.63);
  faceSphere(m.skin,0,-.030,.153,.025,.48,1.25,.64);faceSphere(m.skin,0,-.052,.161,.017,.81,.57,.7);
  faceSphere(m.lips,0,-.097,.139,.029,1,.16,.22);faceSphere(m.lips,0,-.104,.139,.027,1,.18,.25);
  for(const side of [-1,1]){
    faceSphere(m.white,side*.069,.006,.137,.035,1,.30,.4);
    faceSphere(m.iris,side*.069,.006,.150,.013,.77,.9,.3);faceSphere(m.pupil,side*.069,.005,.154,.0065,.7,.9,.3);sphere(head,m.white,side*.065,.011,.157,.004);
    tube(head,m.hair,[[side*.035,.015,.148],[side*.068,.028,.151],[side*.106,.011,.141]],.004,12);
    tube(head,m.hair,[[side*.037,.063,.13],[side*.068,.067,.134],[side*.105,.051,.123]],.006,12);
    for(let i=0;i<4;i++)tube(head,m.hair,[[side*(.083+i*.006),.02-i*.002,.147],[side*(.089+i*.007),.032-i*.001,.151]],.0018,3);
  }
  // Black floral eyepatch, with lace scallops and a coiled rose.
  const patch=new THREE.Group();patch.position.set(-.068,.013,.153);patch.rotation.y=-.17;head.add(patch);
  sphere(patch,m.lace,0,0,0,.059,1,1.05,.3);
  for(let i=0;i<13;i++){const a=i/13*PI*2;const loop=torus(patch,m.hair,Math.cos(a)*.054,Math.sin(a)*.057,.004,.014,.004);loop.scale.set(.75,1,.65);}
  for(let j=0;j<3;j++)for(let i=0;i<5+j*2;i++){const a=i/(5+j*2)*PI*2+j*.8,r=.010+j*.012;const petal=sphere(patch,j%2?m.hair:m.hairHighlight,Math.cos(a)*r,Math.sin(a)*r,.023-j*.004,.019,.55,1,.28);petal.rotation.z=a-.5;}
  tube(head,m.lace,[[-.16,.057,.062],[-.116,.052,.139],[-.029,-.035,.163],[.141,-.017,.077]],.007,18);
  // Hair cap stops above the face; many fine locks break up the silhouette.
  const cap=mesh(new THREE.SphereGeometry(.19,40,26,0,PI*2,0,PI*.46),m.hair,head,0,.025,-.024);cap.scale.set(1,1.05,.98);
  sphere(head,m.hair,0,-.093,-.10,.173,1.0,1.4,.7);
  for(let i=0;i<44;i++){
    const a=i/44*PI*2,points=[];
    for(let j=0;j<=20;j++){const t=.09+j/20*1.31;points.push([Math.sin(t)*Math.sin(a)*.191,.025+Math.cos(t)*.201,-.024+Math.sin(t)*Math.cos(a)*.188]);}
    tube(head,m.hairHighlight,points,.0016,24);
  }
  for(let i=0;i<18;i++){
    const a=(i/18)*PI*2,front=Math.cos(a)>.3;
    if(front)continue;
    const x=Math.sin(a)*.15,z=Math.cos(a)*.13-.045,len=.50+rng()*.15,points=[];
    for(let j=0;j<=50;j++){const t=j/50,rr=.025+Math.sin(t*PI)*.013,angle=t*PI*10+i*.7;points.push([x+Math.cos(angle)*rr,-.005-t*len,z+Math.sin(angle)*rr]);}
    tube(head,i%3===0?m.hairHighlight:m.hair,points,.021,70);
    curls.push({a,x,z,len});
  }
  // Long, glossy ringlets frame the cheeks, echoing the reference.
  for(const side of [-1,1])for(let i=0;i<4;i++){
    const points=[],x=side*(.159+i*.024),z=.04-i*.044,len=.47+i*.046;
    for(let j=0;j<=80;j++){const t=j/80,a=t*PI*12+i*.7;points.push([x+Math.sin(a)*(.017+t*.018),.03-t*len,z+Math.cos(a)*(.022+t*.009)]);}
    tube(head,i===1?m.hairHighlight:m.hair,points,.019,90);
    const sheen=points.map(p=>[p[0]+side*.011,p[1],p[2]+.01]);tube(head,m.hairHighlight,sheen,.003,90);
  }
  for(let i=0;i<15;i++){
    const x=(i/14-.5)*.3,points=[[x*.5,.193,.006],[x,.139,.108],[x*.98,.071+(i%3)*.009,.153],[x*.96,.037+(i%4)*.009,.156]];
    tube(head,i%4===0?m.hairHighlight:m.hair,points,.014,18);
  }
  // Small velvet fascinator, black rose, a feather, and a fine pearl chain.
  const hat=new THREE.Group();hat.position.set(.145,.16,-.024);hat.rotation.z=-.48;head.add(hat);
  const brim=cyl(hat,m.outfitBlue,0,0,0,.13,.13,.014,32);brim.scale.z=.72;
  cyl(hat,m.outfitBlue,0,.055,0,.086,.097,.1,32);cyl(hat,m.lace,0,.022,0,.101,.101,.025,32);
  for(let i=0;i<7;i++){const a=i/7*PI*2;const petal=sphere(hat,m.outfitBlue,-.035+Math.cos(a)*.025,.05+Math.sin(a)*.025,.078,.027,.7,1,.3);petal.rotation.z=a;}
  const feather=tube(hat,m.hair,[[.025,.08,-.03],[.10,.17,-.04],[.13,.27,-.08]],.015,18);
  for(let i=0;i<10;i++){const t=i/10;for(const side of [-1,1])tube(hat,m.hairHighlight,[[.035+t*.085,.10+t*.15,-.04-t*.03],[.035+t*.085+side*.025,.12+t*.15,-.04-t*.03]],.004,5);}
  for(let i=0;i<12;i++){const a=i/11*PI; sphere(hat,m.white,Math.cos(a)*.076,.053-Math.sin(a)*.045,.069,.006);}
  sphere(head,m.gold,.153,-.078,.008,.012);sphere(head,m.white,.155,-.11,.01,.013,.6,1,.6);
  // Batch each articulated piece while preserving its pivot.
  const pieces=[body,head,skirt,...shoulders,...legs];
  for(const group of pieces){const pos=group.position.clone();const parent=group.parent;parent.remove(group);group.position.set(0,0,0);group.updateMatrixWorld(true);mergeStatic(group);group.position.copy(pos);parent.add(group);}
  // The wand tip marker was flattened with the arm; retain an explicit animated anchor.
  const tip=new THREE.Object3D();tip.position.set(.1,-.30,-.17);shoulders[1].add(tip);
  head.scale.set(.9,.96,.95);
  character.position.set(-.65,0,7.7);character.rotation.y=PI;
  let phase=0;
  return {group:character,visual,tip,update(t,dt,speed,running,inAir){
    phase+=dt*(running?12:8)*Math.min(speed,1);
    const amount=Math.min(speed,1),stride=running?.68:.4;
    visual.position.y=(inAir?0:Math.abs(Math.sin(phase))*.024*amount)+Math.sin(t*1.8)*.006;
    visual.rotation.z=Math.sin(phase)*.017*amount;
    shoulders[0].rotation.x=Math.sin(phase)*stride*amount-.08;shoulders[1].rotation.x=-Math.sin(phase)*stride*amount-.13;
    shoulders[0].rotation.z=.035+Math.sin(t*1.5)*.012;shoulders[1].rotation.z=-.035-Math.sin(t*1.5)*.012;
    legs[0].rotation.x=-Math.sin(phase)*stride*amount;legs[1].rotation.x=Math.sin(phase)*stride*amount;
    skirt.rotation.x=Math.sin(phase)*.025*amount;skirt.rotation.z=Math.sin(phase)*.021*amount;skirt.scale.z=1+Math.sin(phase*2)*.035*amount;
    head.rotation.y=Math.sin(t*.4)*.045*(1-amount);head.rotation.x=Math.sin(t*.9)*.017;
  }};
}
