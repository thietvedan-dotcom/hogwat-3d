import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
export const PI=Math.PI;
export function mesh(geometry,material,parent,x=0,y=0,z=0){const m=new THREE.Mesh(geometry,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
export function box(parent,material,x,y,z,w,h,d){return mesh(new THREE.BoxGeometry(w,h,d),material,parent,x,y,z);}
export function sphere(parent,material,x,y,z,r,sx=1,sy=1,sz=1){const m=mesh(new THREE.SphereGeometry(r,r<.17?12:24,r<.17?8:20),material,parent,x,y,z);m.scale.set(sx,sy,sz);return m;}
export function cyl(parent,material,x,y,z,rt,rb,h,n=24){return mesh(new THREE.CylinderGeometry(rt,rb,h,n),material,parent,x,y,z);}
export function torus(parent,material,x,y,z,r,tube=.025){return mesh(new THREE.TorusGeometry(r,tube,8,80),material,parent,x,y,z);}
export function tube(parent,material,points,r=.03,segments=48){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));return mesh(new THREE.TubeGeometry(curve,segments,r,6,false),material,parent);}
export function lathe(parent,material,points,x=0,y=0,z=0,segments=40){return mesh(new THREE.LatheGeometry(points.map(p=>new THREE.Vector2(...p)),segments),material,parent,x,y,z);}
export function arch(parent,material,x,y,z,width,height,thick=.22,depth=.35){
  const shape=new THREE.Shape(),w=width/2;
  shape.moveTo(-w-thick,0);shape.quadraticCurveTo(-w-thick,height*.61,0,height+thick);shape.quadraticCurveTo(w+thick,height*.61,w+thick,0);
  shape.lineTo(w,0);shape.quadraticCurveTo(w,height*.57,0,height);shape.quadraticCurveTo(-w,height*.57,-w,0);shape.closePath();
  const geo=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.028,bevelThickness:.025,curveSegments:22});geo.translate(0,0,-depth/2);return mesh(geo,material,parent,x,y,z);
}
export function pointedPane(parent,material,x,y,z,width,height){
  const w=width/2,shape=new THREE.Shape();shape.moveTo(-w,0);shape.lineTo(-w,height*.52);shape.quadraticCurveTo(-w,height*.79,0,height);shape.quadraticCurveTo(w,height*.79,w,height*.52);shape.lineTo(w,0);shape.closePath();return mesh(new THREE.ShapeGeometry(shape,28),material,parent,x,y,z);
}
export function mergeStatic(root) {
  root.updateMatrixWorld(true);const batches=new Map();
  root.traverse(o=>{if(!o.isMesh)return;let entry=batches.get(o.material);if(!entry){entry=[];batches.set(o.material,entry);}const g=o.geometry.clone();g.applyMatrix4(o.matrixWorld);g.deleteAttribute('uv1');entry.push(g.index ? g.toNonIndexed() : g);});
  root.clear();root.position.set(0,0,0);root.rotation.set(0,0,0);root.scale.set(1,1,1);
  for(const [mat,geos] of batches){const g=mergeGeometries(geos,false);if(g){const m=mesh(g,mat,root);m.castShadow=true;m.receiveShadow=true;}geos.forEach(g=>g.dispose());}
}
