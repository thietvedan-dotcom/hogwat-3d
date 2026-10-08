import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import './style.css';
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createMaterials, glowTexture, random } from './materials.js';
import { createWorld } from './world.js';
import { createCharacter } from './character.js';
import { Ambience } from './audio.js';

const $=id=>document.getElementById(id);
const state={ready:false,awakened:false,photo:false,settings:false,sound:false,quality:'high',fps:0,casts:0,energy:100};
const error=message=>{$('loading').classList.add('hidden');$('error-panel').classList.remove('hidden');$('error-detail').textContent=message;};
window.addEventListener('error',e=>{if(!state.ready)error(e.message);});
boot().catch(e=>{console.error(e);error(`This experience could not initialize. ${e.message}`);});

async function boot(){
  const canvas=$('scene');
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.info.autoReset=false;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;renderer.outputColorSpace=THREE.SRGBColorSpace;
  const scene=new THREE.Scene();scene.background=new THREE.Color('#112032');scene.fog=new THREE.FogExp2('#1b3043',.019);
  const camera=new THREE.PerspectiveCamera(53,innerWidth/innerHeight,.08,160);
  const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment();scene.environment=pmrem.fromScene(room,.04).texture;scene.environmentIntensity=.27;room.dispose();pmrem.dispose();
  scene.add(new THREE.HemisphereLight('#a0c4e4','#283237',1.22));
  const moonlight=new THREE.DirectionalLight('#b2d9fa',3.6);moonlight.position.set(-10,20,-16);moonlight.target.position.set(0,0,-3);moonlight.castShadow=true;moonlight.shadow.mapSize.set(2048,2048);Object.assign(moonlight.shadow.camera,{left:-20,right:20,top:25,bottom:-25,near:1,far:60});moonlight.shadow.normalBias=.035;moonlight.shadow.bias=-.00015;moonlight.shadow.radius=3;scene.add(moonlight,moonlight.target);
  const fill=new THREE.DirectionalLight('#91a3c9',.95);fill.position.set(5,9,14);scene.add(fill);
  const orreryLight=new THREE.PointLight('#76d9f3',17,10,2);orreryLight.position.set(0,3,-5);scene.add(orreryLight);
  for(const [x,z] of [[-7.8,0],[7.8,0],[-7.8,-18],[7.8,-18],[-7.8,13],[7.8,13]]){const light=new THREE.PointLight('#ffc27e',24,10,2);light.position.set(x,3.5,z);scene.add(light);}
  const m=await createMaterials(),world=createWorld(scene,m),character=createCharacter(scene,m);
  const composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));
  const bloom=new UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),.35,.65,1.1);composer.addPass(bloom);composer.addPass(new OutputPass());const fxaa=new ShaderPass(FXAAShader);composer.addPass(fxaa);
  let sensitivity=.8,yaw=.04,pitch=.10,distance=5.9,targetDistance=5.9,verticalVelocity=0,grounded=true,jumpRequested=false,moveBlend=0,castCooldown=0;
  const cameraTarget=new THREE.Vector3(),desiredPosition=new THREE.Vector3(),desiredTarget=new THREE.Vector3(),lookTarget=new THREE.Vector3(),velocity=new THREE.Vector3(),movement=new THREE.Vector3(),forward=new THREE.Vector3(),right=new THREE.Vector3();
  const keys=new Set(),clock=new THREE.Clock(),audio=new Ambience();let pointer=null,toastTimeout,photoHintTimeout,time=0,frameCount=0,fpsTime=0;
  const spellTexture=glowTexture(),spells=[];
  const spellLight=new THREE.PointLight('#b1e6ff',0,7,2);scene.add(spellLight);
  // A soft contact shadow remains legible under diffuse moonlight.
  const shadow=new THREE.Mesh(new THREE.PlaneGeometry(1.35,1.1),new THREE.MeshBasicMaterial({map:spellTexture,color:'#020712',transparent:true,opacity:.55,depthWrite:false}));shadow.rotation.x=-Math.PI/2;scene.add(shadow);
  function groundHeight(x,z){const d=Math.hypot(x,z+5);if(d<3.15)return .32;if(d<3.48)return .15;if(z<-19.0&&Math.abs(x)<6)return .34;return 0;}
  function resetCamera(){yaw=.04;pitch=.10;targetDistance=5.9;distance=5.9;character.group.position.set(-.65,0,7.7);character.group.rotation.y=Math.PI;velocity.set(0,0,0);verticalVelocity=0;grounded=true;updateCamera(1,true);}
  function updateCamera(dt,instant=false){
    distance=THREE.MathUtils.damp(distance,targetDistance,7,dt);
    desiredTarget.copy(character.group.position).add(new THREE.Vector3(Math.cos(yaw)*.57,1.33,-Math.sin(yaw)*.57));
    if(instant)cameraTarget.copy(desiredTarget);else cameraTarget.lerp(desiredTarget,1-Math.exp(-8*dt));
    desiredPosition.set(Math.sin(yaw)*Math.cos(pitch)*distance,Math.sin(pitch)*distance,Math.cos(yaw)*Math.cos(pitch)*distance).add(cameraTarget);
    desiredPosition.x=THREE.MathUtils.clamp(desiredPosition.x,-10.9,10.9);desiredPosition.z=THREE.MathUtils.clamp(desiredPosition.z,-22.8,19.5);desiredPosition.y=Math.max(desiredPosition.y,.4);
    if(instant)camera.position.copy(desiredPosition);else camera.position.lerp(desiredPosition,1-Math.exp(-12*dt));
    lookTarget.copy(cameraTarget);camera.lookAt(lookTarget);
    document.querySelector('.compass-n').textContent=['N','NE','E','SE','S','SW','W','NW'][((Math.round(-yaw/(Math.PI/4))%8)+8)%8];
  }
  function toast(text,ms=3600){$('toast').textContent=text;$('toast').classList.remove('hidden');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>$('toast').classList.add('hidden'),ms);}
  function toggleSettings(value=!state.settings){state.settings=value;$('settings').classList.toggle('hidden',!value);keys.clear();if(!value)canvas.focus({preventScroll:true});}
  function togglePhoto(){state.photo=!state.photo;$('app').classList.toggle('photo-mode',state.photo);$('photo-hint').classList.toggle('hidden',!state.photo);clearTimeout(photoHintTimeout);if(state.photo){toggleSettings(false);photoHintTimeout=setTimeout(()=>$('photo-hint').classList.add('hidden'),4500);}}
  function cast(){
    if(castCooldown>0||state.settings||state.energy<18)return;
    castCooldown=.85;state.casts++;state.energy-=18;const origin=new THREE.Vector3();character.tip.getWorldPosition(origin);
    const direction=new THREE.Vector3(0,.13,1).applyAxisAngle(new THREE.Vector3(0,1,0),character.group.rotation.y);
    const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:spellTexture,color:'#b7e6ff',transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));sprite.position.copy(origin);sprite.scale.setScalar(.6);scene.add(sprite);
    const positions=new Float32Array(90*3);for(let i=0;i<90;i++)positions.set(origin.toArray(),i*3);const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));const trail=new THREE.Points(geometry,new THREE.PointsMaterial({map:spellTexture,color:'#a3deff',size:.09,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));scene.add(trail);spells.push({sprite,trail,direction,life:0,origin});audio.chime();
    $('spell-flash').style.opacity='.13';setTimeout(()=>$('spell-flash').style.opacity='0',130);
  }
  function interact(){if(state.settings||Math.hypot(character.group.position.x,character.group.position.z+5)>4.5)return;
    if(!state.awakened){state.awakened=true;$('objective-text').textContent='The stars remember your name';$('objective-distance').textContent='Constellation discovered';document.querySelector('.objective-diamond').textContent='✦';toast('The heavens stir. A forgotten constellation returns.',5500);audio.chime();$('spell-flash').style.opacity='.28';setTimeout(()=>$('spell-flash').style.opacity='0',1500);}else{audio.chime();toast('“Even in darkness, we belong to the stars.”',4000);}
  }
  window.addEventListener('keydown',e=>{
    if(e.target instanceof HTMLInputElement||e.target instanceof HTMLSelectElement)return;
    if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();
    if(e.code==='Escape'){if(state.photo)togglePhoto();else toggleSettings(!state.settings);return;}
    if(e.repeat)return;
    if(e.code==='KeyP'){togglePhoto();return;}
    if(e.code==='Space'&&!state.settings){if(grounded)jumpRequested=true;return;}
    if(e.code==='KeyE'){interact();return;}if(e.code==='KeyQ'){cast();return;}
    if(!state.settings)keys.add(e.code);
  });
  window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',()=>{keys.clear();pointer=null;});
  document.addEventListener('visibilitychange',()=>{keys.clear();clock.getDelta();});
  canvas.addEventListener('pointerdown',e=>{canvas.focus({preventScroll:true});if(state.settings)toggleSettings(false);pointer={id:e.pointerId,x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{if(!pointer||pointer.id!==e.pointerId)return;const dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;yaw-=dx*.004*sensitivity;pitch=THREE.MathUtils.clamp(pitch+dy*.003*sensitivity,-.08,1.18);pointer.x=e.clientX;pointer.y=e.clientY;});
  const release=()=>pointer=null;canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);canvas.addEventListener('lostpointercapture',release);
  canvas.addEventListener('wheel',e=>{e.preventDefault();targetDistance=THREE.MathUtils.clamp(targetDistance+e.deltaY*.006,2.2,10);},{passive:false});
  canvas.addEventListener('contextmenu',e=>e.preventDefault());
  $('settings-toggle').addEventListener('click',()=>toggleSettings());$('settings-close').addEventListener('click',()=>toggleSettings(false));$('photo-toggle').addEventListener('click',togglePhoto);$('reset-view').addEventListener('click',()=>{resetCamera();toggleSettings(false);});document.querySelector('.brand').addEventListener('click',e=>{e.preventDefault();resetCamera();});
  async function toggleSound(){try{state.sound=await audio.toggle();$('ambient-setting').textContent=state.sound?'On':'Off';$('sound-toggle').title=state.sound?'Mute ambient sound':'Enable ambient sound';$('sound-toggle').setAttribute('aria-label',$('sound-toggle').title);$('sound-toggle').innerHTML=state.sound?'<svg viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4V5Zm4 3c3 2 3 6 0 8m3-11c5 4 5 10 0 14"/></svg>':'<svg viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4V5Zm5 4 5 6m0-6-5 6"/></svg>';}catch{toast('Ambient audio is unavailable in this browser.');}}
  $('sound-toggle').addEventListener('click',toggleSound);$('ambient-setting').addEventListener('click',toggleSound);$('sensitivity').addEventListener('input',e=>sensitivity=Number(e.target.value));
  function resize(){renderer.setSize(innerWidth,innerHeight);composer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();const ratio=renderer.getPixelRatio();fxaa.material.uniforms.resolution.value.set(1/(innerWidth*ratio),1/(innerHeight*ratio));}
  $('quality').addEventListener('change',e=>{state.quality=e.target.value;renderer.setPixelRatio(Math.min(devicePixelRatio,state.quality==='high'?1.5:state.quality==='medium'?1:.75));bloom.enabled=state.quality!=='low';renderer.shadowMap.enabled=state.quality!=='low';resize();});window.addEventListener('resize',resize);resize();resetCamera();
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();error('The graphics context was interrupted. Reload to return to the cloister.');});
  let lastUi=0;
  function frame(){
    requestAnimationFrame(frame);const elapsed=clock.getDelta(),dt=Math.min(elapsed,.05);time+=dt;frameCount++;fpsTime+=elapsed;if(fpsTime>1){state.fps=Math.round(frameCount/fpsTime);frameCount=0;fpsTime=0;}
    let inputX=0,inputZ=0;if(!state.settings){inputX=Number(keys.has('KeyD')||keys.has('ArrowRight'))-Number(keys.has('KeyA')||keys.has('ArrowLeft'));inputZ=Number(keys.has('KeyW')||keys.has('ArrowUp'))-Number(keys.has('KeyS')||keys.has('ArrowDown'));}
    const moving=inputX!==0||inputZ!==0,running=keys.has('ShiftLeft')||keys.has('ShiftRight');
    forward.set(-Math.sin(yaw),0,-Math.cos(yaw));right.set(Math.cos(yaw),0,-Math.sin(yaw));movement.copy(forward).multiplyScalar(inputZ).addScaledVector(right,inputX);if(moving)movement.normalize();
    const speed=running?4.7:2.25;velocity.x=THREE.MathUtils.damp(velocity.x,movement.x*speed,10,dt);velocity.z=THREE.MathUtils.damp(velocity.z,movement.z*speed,10,dt);
    const p=character.group.position;p.addScaledVector(velocity,dt);p.x=THREE.MathUtils.clamp(p.x,-10.55,10.55);p.z=THREE.MathUtils.clamp(p.z,-20.5,17.5);
    for(const c of world.colliders){const dx=p.x-c.x,dz=p.z-c.z,dist=Math.hypot(dx,dz),min=c.r+.23;if(dist<min){const scale=min/(dist||.001);p.x=c.x+dx*scale;p.z=c.z+dz*scale;}}
    // Clustered arcade columns have real collision, leaving the arches traversable.
    for(const x of [-8,8])for(const z of [-22,-15.5,-9,-2.5,4,10.5,17]){const dx=p.x-x,dz=p.z-z,dist=Math.hypot(dx,dz);if(dist<.79){p.x=x+dx/(dist||1)*.79;p.z=z+dz/(dist||1)*.79;}}
    const floorY=groundHeight(p.x,p.z);if(jumpRequested&&grounded&&!state.settings){verticalVelocity=4.9;grounded=false;}jumpRequested=false;
    verticalVelocity-=12*dt;p.y+=verticalVelocity*dt;if(p.y<=floorY){p.y=floorY;verticalVelocity=0;grounded=true;}else if(p.y>floorY+.05)grounded=false;
    if(moving){const targetAngle=Math.atan2(movement.x,movement.z);let diff=THREE.MathUtils.euclideanModulo(targetAngle-character.group.rotation.y+Math.PI,Math.PI*2)-Math.PI;character.group.rotation.y+=diff*(1-Math.exp(-12*dt));}
    moveBlend=THREE.MathUtils.damp(moveBlend,moving?1:0,8,dt);character.update(time,dt,moveBlend,running,!grounded);world.update(time,dt,state.awakened);
    shadow.position.set(p.x,floorY+.012,p.z);shadow.material.opacity=.48-Math.min(p.y-floorY,1)*.25;shadow.scale.setScalar(1+Math.max(0,p.y-floorY)*.3);
    updateCamera(dt);castCooldown=Math.max(0,castCooldown-dt);state.energy=Math.min(100,state.energy+dt*6);
    orreryLight.intensity=THREE.MathUtils.damp(orreryLight.intensity,state.awakened?34:17,2,dt);
    spellLight.intensity=0;
    for(let i=spells.length-1;i>=0;i--){const s=spells[i];s.life+=dt;s.sprite.position.addScaledVector(s.direction,dt*7);s.sprite.position.y+=Math.sin(time*3)*dt*.2;s.sprite.material.opacity=Math.max(0,1-s.life/2.7);const a=s.trail.geometry.attributes.position;for(let j=a.count-1;j>0;j--){a.setXYZ(j,a.getX(j-1),a.getY(j-1),a.getZ(j-1));}a.setXYZ(0,s.sprite.position.x,s.sprite.position.y,s.sprite.position.z);a.needsUpdate=true;s.trail.material.opacity=Math.max(0,.7-s.life/4);spellLight.position.copy(s.sprite.position);spellLight.intensity=7*s.sprite.material.opacity;if(s.life>2.7){scene.remove(s.sprite,s.trail);s.sprite.material.dispose();s.trail.geometry.dispose();s.trail.material.dispose();spells.splice(i,1);}}
    if(time-lastUi>.15){lastUi=time;const near=Math.hypot(p.x,p.z+5);$('interaction').classList.toggle('hidden',near>4.5||state.settings);$('interaction-label').textContent=state.awakened?'LISTEN TO THE STARS':'AWAKEN THE ORRERY';$('interaction-description').textContent=state.awakened?'The cloister remembers you':'A forgotten constellation awaits';if(!state.awakened)$('objective-distance').textContent=`${Math.max(1,Math.round(near))} m · Follow the starlight`;$('energy-fill').style.width=`${state.energy}%`;}
    renderer.info.reset();composer.render();
    if(!state.ready){state.ready=true;setTimeout(()=>$('loading').classList.add('done'),250);setTimeout(()=>$('loading').classList.add('hidden'),1500);}
  }
  // Read-only diagnostics make browser validation reproducible without changing play behavior.
  window.__NOCTURNE__={getState:()=>({...state,simulationTime:time,position:character.group.position.toArray(),camera:camera.position.toArray(),yaw,pitch,distance,grounded,drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles}),scene,camera,renderer};
  frame();
}
