import{a as $e,U as Mt,R as yt,d as bt,e as St,L as Et,f as Tt,g as At,h as rt,i as Ct,j as Dt,k as Lt,V as De,l as lt,m as ct,n as ee,o as zt,P as Ve,M as we,I as dt,p as Ke,q as _t,T as Pt,r as Gt,c as We,D as Ye,s as Je,t as ut,u as ft,B as Se,v as Be,w as Ze,E as kt,x as et,y as pt,z as Rt,G as Oe,J as Nt,K as Bt,b as ne,Q as Ut,X as I,F as Le,Y as Ie,Z as Xe,A as be,_ as Ht,S as nt,$ as at,a0 as ht,a1 as re,a2 as gt,a3 as mt,a4 as Ft,a5 as It,a6 as Ot,a7 as Wt,a8 as jt,a9 as qt,aa as it,C as Vt}from"./three-engine-C9xaCsgE.js";import{P as wt,F as Xt,E as Yt,U as Zt,S as Kt}from"./postprocessing-BEhDdGVE.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const g of document.querySelectorAll('link[rel="modulepreload"]'))i(g);new MutationObserver(g=>{for(const p of g)if(p.type==="childList")for(const r of p.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function o(g){const p={};return g.integrity&&(p.integrity=g.integrity),g.referrerPolicy&&(p.referrerPolicy=g.referrerPolicy),g.crossOrigin==="use-credentials"?p.credentials="include":g.crossOrigin==="anonymous"?p.credentials="omit":p.credentials="same-origin",p}function i(g){if(g.ep)return;g.ep=!0;const p=o(g);fetch(g.href,p)}})();class Qt extends wt{constructor(e,o,i=null,g=null,p=null){super(),this.scene=e,this.camera=o,this.overrideMaterial=i,this.clearColor=g,this.clearAlpha=p,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new $e}render(e,o,i){const g=e.autoClear;e.autoClear=!1;let p,r;this.overrideMaterial!==null&&(r=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(p=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(p),this.overrideMaterial!==null&&(this.scene.overrideMaterial=r),e.autoClear=g}}const qe={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class $t extends wt{constructor(){super(),this.uniforms=Mt.clone(qe.uniforms),this.material=new yt({name:qe.name,uniforms:this.uniforms,vertexShader:qe.vertexShader,fragmentShader:qe.fragmentShader}),this._fsQuad=new Xt(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,o,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},bt.getTransfer(this._outputColorSpace)===St&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Et?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Tt?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===At?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===rt?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Ct?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Dt?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===Lt&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(o),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}const Jt={name:"FXAAShader",uniforms:{tDiffuse:{value:null},resolution:{value:new De(1/1024,1/512)}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec2 resolution;
		varying vec2 vUv;

		#define EDGE_STEP_COUNT 6
		#define EDGE_GUESS 8.0
		#define EDGE_STEPS 1.0, 1.5, 2.0, 2.0, 2.0, 4.0
		const float edgeSteps[EDGE_STEP_COUNT] = float[EDGE_STEP_COUNT]( EDGE_STEPS );

		float _ContrastThreshold = 0.0312;
		float _RelativeThreshold = 0.063;
		float _SubpixelBlending = 1.0;

		vec4 Sample( sampler2D  tex2D, vec2 uv ) {

			return texture( tex2D, uv );

		}

		float SampleLuminance( sampler2D tex2D, vec2 uv ) {

			return dot( Sample( tex2D, uv ).rgb, vec3( 0.3, 0.59, 0.11 ) );

		}

		float SampleLuminance( sampler2D tex2D, vec2 texSize, vec2 uv, float uOffset, float vOffset ) {

			uv += texSize * vec2(uOffset, vOffset);
			return SampleLuminance(tex2D, uv);

		}

		struct LuminanceData {

			float m, n, e, s, w;
			float ne, nw, se, sw;
			float highest, lowest, contrast;

		};

		LuminanceData SampleLuminanceNeighborhood( sampler2D tex2D, vec2 texSize, vec2 uv ) {

			LuminanceData l;
			l.m = SampleLuminance( tex2D, uv );
			l.n = SampleLuminance( tex2D, texSize, uv,  0.0,  1.0 );
			l.e = SampleLuminance( tex2D, texSize, uv,  1.0,  0.0 );
			l.s = SampleLuminance( tex2D, texSize, uv,  0.0, -1.0 );
			l.w = SampleLuminance( tex2D, texSize, uv, -1.0,  0.0 );

			l.ne = SampleLuminance( tex2D, texSize, uv,  1.0,  1.0 );
			l.nw = SampleLuminance( tex2D, texSize, uv, -1.0,  1.0 );
			l.se = SampleLuminance( tex2D, texSize, uv,  1.0, -1.0 );
			l.sw = SampleLuminance( tex2D, texSize, uv, -1.0, -1.0 );

			l.highest = max( max( max( max( l.n, l.e ), l.s ), l.w ), l.m );
			l.lowest = min( min( min( min( l.n, l.e ), l.s ), l.w ), l.m );
			l.contrast = l.highest - l.lowest;
			return l;

		}

		bool ShouldSkipPixel( LuminanceData l ) {

			float threshold = max( _ContrastThreshold, _RelativeThreshold * l.highest );
			return l.contrast < threshold;

		}

		float DeterminePixelBlendFactor( LuminanceData l ) {

			float f = 2.0 * ( l.n + l.e + l.s + l.w );
			f += l.ne + l.nw + l.se + l.sw;
			f *= 1.0 / 12.0;
			f = abs( f - l.m );
			f = clamp( f / l.contrast, 0.0, 1.0 );

			float blendFactor = smoothstep( 0.0, 1.0, f );
			return blendFactor * blendFactor * _SubpixelBlending;

		}

		struct EdgeData {

			bool isHorizontal;
			float pixelStep;
			float oppositeLuminance, gradient;

		};

		EdgeData DetermineEdge( vec2 texSize, LuminanceData l ) {

			EdgeData e;
			float horizontal =
				abs( l.n + l.s - 2.0 * l.m ) * 2.0 +
				abs( l.ne + l.se - 2.0 * l.e ) +
				abs( l.nw + l.sw - 2.0 * l.w );
			float vertical =
				abs( l.e + l.w - 2.0 * l.m ) * 2.0 +
				abs( l.ne + l.nw - 2.0 * l.n ) +
				abs( l.se + l.sw - 2.0 * l.s );
			e.isHorizontal = horizontal >= vertical;

			float pLuminance = e.isHorizontal ? l.n : l.e;
			float nLuminance = e.isHorizontal ? l.s : l.w;
			float pGradient = abs( pLuminance - l.m );
			float nGradient = abs( nLuminance - l.m );

			e.pixelStep = e.isHorizontal ? texSize.y : texSize.x;

			if (pGradient < nGradient) {

				e.pixelStep = -e.pixelStep;
				e.oppositeLuminance = nLuminance;
				e.gradient = nGradient;

			} else {

				e.oppositeLuminance = pLuminance;
				e.gradient = pGradient;

			}

			return e;

		}

		float DetermineEdgeBlendFactor( sampler2D  tex2D, vec2 texSize, LuminanceData l, EdgeData e, vec2 uv ) {

			vec2 uvEdge = uv;
			vec2 edgeStep;
			if (e.isHorizontal) {

				uvEdge.y += e.pixelStep * 0.5;
				edgeStep = vec2( texSize.x, 0.0 );

			} else {

				uvEdge.x += e.pixelStep * 0.5;
				edgeStep = vec2( 0.0, texSize.y );

			}

			float edgeLuminance = ( l.m + e.oppositeLuminance ) * 0.5;
			float gradientThreshold = e.gradient * 0.25;

			vec2 puv = uvEdge + edgeStep * edgeSteps[0];
			float pLuminanceDelta = SampleLuminance( tex2D, puv ) - edgeLuminance;
			bool pAtEnd = abs( pLuminanceDelta ) >= gradientThreshold;

			for ( int i = 1; i < EDGE_STEP_COUNT && !pAtEnd; i++ ) {

				puv += edgeStep * edgeSteps[i];
				pLuminanceDelta = SampleLuminance( tex2D, puv ) - edgeLuminance;
				pAtEnd = abs( pLuminanceDelta ) >= gradientThreshold;

			}

			if ( !pAtEnd ) {

				puv += edgeStep * EDGE_GUESS;

			}

			vec2 nuv = uvEdge - edgeStep * edgeSteps[0];
			float nLuminanceDelta = SampleLuminance( tex2D, nuv ) - edgeLuminance;
			bool nAtEnd = abs( nLuminanceDelta ) >= gradientThreshold;

			for ( int i = 1; i < EDGE_STEP_COUNT && !nAtEnd; i++ ) {

				nuv -= edgeStep * edgeSteps[i];
				nLuminanceDelta = SampleLuminance( tex2D, nuv ) - edgeLuminance;
				nAtEnd = abs( nLuminanceDelta ) >= gradientThreshold;

			}

			if ( !nAtEnd ) {

				nuv -= edgeStep * EDGE_GUESS;

			}

			float pDistance, nDistance;
			if ( e.isHorizontal ) {

				pDistance = puv.x - uv.x;
				nDistance = uv.x - nuv.x;

			} else {

				pDistance = puv.y - uv.y;
				nDistance = uv.y - nuv.y;

			}

			float shortestDistance;
			bool deltaSign;
			if ( pDistance <= nDistance ) {

				shortestDistance = pDistance;
				deltaSign = pLuminanceDelta >= 0.0;

			} else {

				shortestDistance = nDistance;
				deltaSign = nLuminanceDelta >= 0.0;

			}

			if ( deltaSign == ( l.m - edgeLuminance >= 0.0 ) ) {

				return 0.0;

			}

			return 0.5 - shortestDistance / ( pDistance + nDistance );

		}

		vec4 ApplyFXAA( sampler2D  tex2D, vec2 texSize, vec2 uv ) {

			LuminanceData luminance = SampleLuminanceNeighborhood( tex2D, texSize, uv );
			if ( ShouldSkipPixel( luminance ) ) {

				return Sample( tex2D, uv );

			}

			float pixelBlend = DeterminePixelBlendFactor( luminance );
			EdgeData edge = DetermineEdge( texSize, luminance );
			float edgeBlend = DetermineEdgeBlendFactor( tex2D, texSize, luminance, edge, uv );
			float finalBlend = max( pixelBlend, edgeBlend );

			if (edge.isHorizontal) {

				uv.y += edge.pixelStep * finalBlend;

			} else {

				uv.x += edge.pixelStep * finalBlend;

			}

			return Sample( tex2D, uv );

		}

		void main() {

			gl_FragColor = ApplyFXAA( tDiffuse, resolution.xy, vUv );

		}`};class eo extends lt{constructor(){super();const e=new ct;e.deleteAttribute("uv");const o=new ee({side:zt}),i=new ee,g=new Ve(16777215,900,28,2);g.position.set(.418,16.199,.3),this.add(g);const p=new we(e,o);p.position.set(-.757,13.219,.717),p.scale.set(31.713,28.305,28.591),this.add(p);const r=new dt(e,i,6),f=new Ke;f.position.set(-10.906,2.009,1.846),f.rotation.set(0,-.195,0),f.scale.set(2.328,7.905,4.651),f.updateMatrix(),r.setMatrixAt(0,f.matrix),f.position.set(-5.607,-.754,-.758),f.rotation.set(0,.994,0),f.scale.set(1.97,1.534,3.955),f.updateMatrix(),r.setMatrixAt(1,f.matrix),f.position.set(6.167,.857,7.803),f.rotation.set(0,.561,0),f.scale.set(3.927,6.285,3.687),f.updateMatrix(),r.setMatrixAt(2,f.matrix),f.position.set(-2.017,.018,6.124),f.rotation.set(0,.333,0),f.scale.set(2.002,4.566,2.064),f.updateMatrix(),r.setMatrixAt(3,f.matrix),f.position.set(2.291,-.756,-2.621),f.rotation.set(0,-.286,0),f.scale.set(1.546,1.552,1.496),f.updateMatrix(),r.setMatrixAt(4,f.matrix),f.position.set(-2.193,-.369,-5.547),f.rotation.set(0,.516,0),f.scale.set(3.875,3.487,2.986),f.updateMatrix(),r.setMatrixAt(5,f.matrix),this.add(r);const w=new we(e,Ne(50));w.position.set(-16.116,14.37,8.208),w.scale.set(.1,2.428,2.739),this.add(w);const y=new we(e,Ne(50));y.position.set(-16.109,18.021,-8.207),y.scale.set(.1,2.425,2.751),this.add(y);const m=new we(e,Ne(17));m.position.set(14.904,12.198,-1.832),m.scale.set(.15,4.265,6.331),this.add(m);const v=new we(e,Ne(43));v.position.set(-.462,8.89,14.52),v.scale.set(4.38,5.441,.088),this.add(v);const C=new we(e,Ne(20));C.position.set(3.235,11.486,-12.541),C.scale.set(2.5,2,.1),this.add(C);const A=new we(e,Ne(100));A.position.set(0,20,0),A.scale.set(1,.1,1),this.add(A)}dispose(){const e=new Set;this.traverse(o=>{o.isMesh&&(e.add(o.geometry),e.add(o.material))});for(const o of e)o.dispose()}}function Ne(l){return new _t({color:0,emissive:16777215,emissiveIntensity:l})}function vt(l=7){let e=l;return()=>(e=Math.imul(e,1664525)+1013904223|0,(e>>>0)/4294967296)}function to(){const l=document.createElement("canvas");l.width=l.height=128;const e=l.getContext("2d");e.fillStyle="#ababab",e.fillRect(0,0,128,128);for(let i=0;i<128;i+=2)e.fillStyle=i%4===0?"#969696":"#b3b3b3",e.fillRect(i,0,1,128),e.fillStyle="#81818144",e.fillRect(0,i,128,1);const o=new Je(l);return o.wrapS=o.wrapT=ut,o.repeat.set(6,6),o}function xt(){const l=document.createElement("canvas");l.width=l.height=128;const e=l.getContext("2d"),o=e.createRadialGradient(64,64,0,64,64,64);return o.addColorStop(0,"rgba(255,255,255,1)"),o.addColorStop(.12,"rgba(255,255,255,.8)"),o.addColorStop(.35,"rgba(255,255,255,.18)"),o.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=o,e.fillRect(0,0,128,128),new Je(l)}async function oo(){const l=new Pt;async function e(C,A=!1,O=1,K=1){const _=await l.loadAsync("/hogwat-3d/textures/"+C+".jpg");return _.wrapS=_.wrapT=ut,_.repeat.set(O,K),_.anisotropy=8,A&&(_.colorSpace=ft),_}const[o,i,g,p,r,f,w,y]=await Promise.all([e("limestone-color",!0),e("limestone-normal"),e("masonry-color",!0,8,3),e("masonry-normal",!1,8,3),e("paving-color",!0,5,10),e("paving-normal",!1,5,10),e("wood-color",!0,1,2),e("wood-roughness",!1,1,2)]),m=to(),v=(C,A=.7,O=0)=>new ee({color:C,roughness:A,metalness:O});return{stone:new ee({color:"#a1a7ac",map:o,normalMap:i,normalScale:new De(.5,.5),roughness:.88}),wall:new ee({color:"#9ea5ac",map:g,normalMap:p,roughness:.91}),edge:new ee({color:"#a8ada9",map:o,normalMap:i,normalScale:new De(.4,.4),roughness:.72}),darkStone:new ee({color:"#535d61",map:o,normalMap:i,normalScale:new De(.5,.5),roughness:.67}),floor:new ee({color:"#8b979e",map:r,normalMap:f,normalScale:new De(.5,.5),roughness:.34,metalness:.2}),dark:v("#101d25",.86),gold:v("#a5894d",.32,.78),lightGold:v("#c8ae6b",.28,.72),blackMetal:v("#1c2a31",.4,.72),wood:new ee({color:"#433a36",map:w,roughnessMap:y,roughness:.75}),woodEdge:new ee({color:"#61534a",map:w,roughnessMap:y,roughness:.65}),pages:v("#b6aa88",.9),bookBlue:v("#263f4b"),bookRed:v("#543538"),bookGreen:v("#3d4a3f"),cloth:new ee({color:"#1c344c",bumpMap:m,bumpScale:.01,roughness:.94,side:Ye}),skin:new ee({color:"#d7b7af",roughness:.72}),outfit:new ee({color:"#152231",bumpMap:m,bumpScale:.006,roughness:.65}),outfitBlue:new ee({color:"#1c2d4e",bumpMap:m,bumpScale:.007,roughness:.58}),lace:v("#0d1320",.83),hair:v("#100f19",.48,.04),hairHighlight:v("#24212e",.46,.04),white:v("#d0c8b4",.9),boots:v("#111721",.35),lips:v("#945b64",.48),iris:v("#637e7b",.3),pupil:v("#11131d",.18),leaves:v("#253e35",.9),leavesLight:v("#3f5745",.87),wax:v("#d1be94",.74),flame:new We({color:"#ffcf7b"}),cyan:new ee({color:"#85e5fa",emissive:"#67d5ee",emissiveIntensity:3,roughness:.22,metalness:.3}),window:new We({color:"#375a74",transparent:!0,opacity:.5,side:Ye}),water:new Gt({color:"#163940",metalness:.45,roughness:.12,transparent:!0,opacity:.86,clearcoat:1})}}function no(l,e=!1){const o=l[0].index!==null,i=new Set(Object.keys(l[0].attributes)),g=new Set(Object.keys(l[0].morphAttributes)),p={},r={},f=l[0].morphTargetsRelative,w=new Se;let y=0;for(let m=0;m<l.length;++m){const v=l[m];let C=0;if(o!==(v.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+m+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const A in v.attributes){if(!i.has(A))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+m+'. All geometries must have compatible attributes; make sure "'+A+'" attribute exists among all geometries, or in none of them.'),null;p[A]===void 0&&(p[A]=[]),p[A].push(v.attributes[A]),C++}if(C!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+m+". Make sure all geometries have the same number of attributes."),null;if(f!==v.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+m+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const A in v.morphAttributes){if(!g.has(A))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+m+".  .morphAttributes must be consistent throughout all geometries."),null;r[A]===void 0&&(r[A]=[]),r[A].push(v.morphAttributes[A])}if(e){let A;if(o)A=v.index.count;else if(v.attributes.position!==void 0)A=v.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+m+". The geometry must have either an index or a position attribute"),null;w.addGroup(y,A,m),y+=A}}if(o){let m=0;const v=[];for(let C=0;C<l.length;++C){const A=l[C].index;for(let O=0;O<A.count;++O)v.push(A.getX(O)+m);m+=l[C].attributes.position.count}w.setIndex(v)}for(const m in p){const v=st(p[m]);if(!v)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+m+" attribute."),null;w.setAttribute(m,v)}for(const m in r){const v=r[m][0].length;if(v===0)break;w.morphAttributes=w.morphAttributes||{},w.morphAttributes[m]=[];for(let C=0;C<v;++C){const A=[];for(let K=0;K<r[m].length;++K)A.push(r[m][K][C]);const O=st(A);if(!O)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+m+" morphAttribute."),null;w.morphAttributes[m].push(O)}}return w}function st(l){let e,o,i,g=-1,p=0;for(let y=0;y<l.length;++y){const m=l[y];if(e===void 0&&(e=m.array.constructor),e!==m.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(o===void 0&&(o=m.itemSize),o!==m.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=m.normalized),i!==m.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(g===-1&&(g=m.gpuType),g!==m.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;p+=m.count*o}const r=new e(p),f=new Be(r,o,i);let w=0;for(let y=0;y<l.length;++y){const m=l[y];if(m.isInterleavedBufferAttribute){const v=w/o;for(let C=0,A=m.count;C<A;C++)for(let O=0;O<o;O++){const K=m.getComponent(C,O);f.setComponent(C+v,O,K)}}else r.set(m.array,w);w+=m.count*o}return g!==void 0&&(f.gpuType=g),f}const E=Math.PI;function Z(l,e,o,i=0,g=0,p=0){const r=new we(l,e);return r.position.set(i,g,p),r.castShadow=!0,r.receiveShadow=!0,o.add(r),r}function M(l,e,o,i,g,p,r,f){return Z(new ct(p,r,f),e,l,o,i,g)}function U(l,e,o,i,g,p,r=1,f=1,w=1){const y=Z(new Oe(p,p<.17?12:24,p<.17?8:20),e,l,o,i,g);return y.scale.set(r,f,w),y}function H(l,e,o,i,g,p,r,f,w=24){return Z(new pt(p,r,f,w),e,l,o,i,g)}function le(l,e,o,i,g,p,r=.025){return Z(new Rt(p,r,8,80),e,l,o,i,g)}function X(l,e,o,i=.03,g=48){const p=new Bt(o.map(r=>new ne(...r)));return Z(new Ut(p,g,i,6,!1),e,l)}function Ue(l,e,o,i=0,g=0,p=0,r=40){return Z(new Nt(o.map(f=>new De(...f)),r),e,l,i,g,p)}function ue(l,e,o,i,g,p,r,f=.22,w=.35){const y=new Ze,m=p/2;y.moveTo(-m-f,0),y.quadraticCurveTo(-m-f,r*.61,0,r+f),y.quadraticCurveTo(m+f,r*.61,m+f,0),y.lineTo(m,0),y.quadraticCurveTo(m,r*.57,0,r),y.quadraticCurveTo(-m,r*.57,-m,0),y.closePath();const v=new kt(y,{depth:w,bevelEnabled:!0,bevelSegments:2,steps:1,bevelSize:.028,bevelThickness:.025,curveSegments:22});return v.translate(0,0,-w/2),Z(v,e,l,o,i,g)}function ye(l,e,o,i,g,p,r){const f=p/2,w=new Ze;return w.moveTo(-f,0),w.lineTo(-f,r*.52),w.quadraticCurveTo(-f,r*.79,0,r),w.quadraticCurveTo(f,r*.79,f,r*.52),w.lineTo(f,0),w.closePath(),Z(new et(w,28),e,l,o,i,g)}function Qe(l){l.updateMatrixWorld(!0);const e=new Map;l.traverse(o=>{if(!o.isMesh)return;let i=e.get(o.material);i||(i=[],e.set(o.material,i));const g=o.geometry.clone();g.applyMatrix4(o.matrixWorld),g.deleteAttribute("uv1"),i.push(g.index?g.toNonIndexed():g)}),l.clear(),l.position.set(0,0,0),l.rotation.set(0,0,0),l.scale.set(1,1,1);for(const[o,i]of e){const g=no(i,!1);if(g){const p=Z(g,o,l);p.castShadow=!0,p.receiveShadow=!0}i.forEach(p=>p.dispose())}}function ao(l,e){const o=new I;l.add(o);const i=vt(71),g=[],p=[],r=[],f=xt(),w=new I;l.add(w);const y=new I;y.position.set(0,1.6,-5),l.add(y);function m(t,a,d,u,h,S,c=.5){const b=new gt(new mt({map:f,color:a,transparent:!0,opacity:c,depthWrite:!1,blending:be}));return b.position.set(d,u,h),b.scale.set(S,S,S),t.add(b),b}function v(t,a,d,u=4.75){M(t,e.darkStone,a,.13,d,1.15,.26,1.15),M(t,e.edge,a,.32,d,.97,.14,.97),M(t,e.stone,a,u/2,d,.64,u,.64);for(const[h,S]of[[-.36,-.36],[.36,-.36],[-.36,.36],[.36,.36]])H(t,e.edge,a+h,u/2+.1,d+S,.11,.15,u-.15,12),H(t,e.edge,a+h,.5,d+S,.17,.21,.23,12),H(t,e.edge,a+h,u-.12,d+S,.21,.13,.25,12);M(t,e.edge,a,u,d,.98,.24,.98),M(t,e.stone,a,u+.18,d,1.12,.15,1.12),M(t,e.edge,a,.72,d,.78,.12,.78)}function C(t,a,d,u,h=.38,S=!1){const c=new I;c.position.set(a,d,u),t.add(c),H(c,e.gold,0,.03,0,.105,.13,.06,12),H(c,e.wax,0,h/2+.055,0,.055,.06,h,12);const b=U(c,e.flame,0,h+.11,0,.06,.6,1.6,.6);b.castShadow=!1;const N=m(c,"#ffb856",0,h+.13,0,.7,.52);return g.push({flame:b,light:N,phase:i()*E*2,base:h+.11}),S&&p.push({g:c,y:d,phase:i()*E*2}),c}function A(t,a,d){const u=new I;u.position.set(t,0,a),u.rotation.y=d,o.add(u),M(u,e.wood,0,.58,0,2.3,.15,.67),M(u,e.wood,0,1.08,-.28,2.3,.75,.11);for(const h of[-.87,.87])M(u,e.woodEdge,h,.28,0,.13,.56,.5),M(u,e.woodEdge,h,.95,0,.08,.65,.08),M(u,e.woodEdge,h,1.2,0,.12,.09,.7);for(let h=-3;h<=3;h++)M(u,e.woodEdge,h*.29,1.08,-.22,.045,.6,.045);r.push({x:t,z:a,r:1.3})}function O(t,a){Ue(o,e.darkStone,[[0,0],[.45,0],[.45,.15],[.26,.23],[.22,.38],[.42,.5],[.54,.84],[.48,1],[.55,1.07],[.55,1.13],[.43,1.13],[.36,.8],[0,.65]],t,0,a);for(let d=0;d<17;d++){const u=i()*E*2,h=.55+i()*.9,S=.3+i()*.4,c=[[t,1,a],[t+Math.cos(u)*S*.6,1+h*.6,a+Math.sin(u)*S*.6],[t+Math.cos(u)*S,1+h,a+Math.sin(u)*S]];X(o,e.leaves,c,.015,6);for(let b=1;b<4;b++){const N=b/3;U(o,d%2?e.leaves:e.leavesLight,t+Math.cos(u)*S*N,1+h*N,a+Math.sin(u)*S*N,.16,.5,1.5,.19).rotation.set(i(),u,i())}}r.push({x:t,z:a,r:.7})}function K(t,a,d){const u=new I;o.add(u),u.position.set(t,0,a),u.rotation.y=d,M(u,e.gold,0,5.7,0,1.4,.045,.05),U(u,e.gold,-.76,5.7,0,.065),U(u,e.gold,.76,5.7,0,.065);const h=new Ze;h.moveTo(-.59,5.65),h.lineTo(.59,5.65),h.lineTo(.59,3.28),h.lineTo(0,2.94),h.lineTo(-.59,3.28),h.closePath(),Z(new et(h),e.cloth,u),X(u,e.gold,[[-.54,5.5,.02],[-.54,3.33,.02],[0,3.02,.02],[.54,3.33,.02],[.54,5.5,.02]],.015,12),le(u,e.gold,0,4.55,.035,.31,.014);const S=le(u,e.lightGold,0,4.55,.055,.21,.032);S.scale.x=.68;for(let c=0;c<4;c++){const b=c*E/2;U(u,e.gold,Math.sin(b)*.4,4.55+Math.cos(b)*.4,.035,.035)}}M(o,e.floor,0,-.14,-2,23,.24,44);for(const t of[-10.55,10.55])M(o,e.darkStone,t,.12,-2,.7,.24,44),M(o,e.gold,t+Math.sign(t)*-.44,.008,-2,.024,.02,44);for(const t of[-7.3,7.3])M(o,e.darkStone,t,.004,-2,.16,.02,43.5);for(let t=-22;t<20;t+=3.2)for(const a of[-7.1,7.1]){const d=M(o,e.gold,a,.014,t,.1,.015,.1);d.rotation.y=E/4}const _=[-22,-15.5,-9,-2.5,4,10.5,17];for(const t of[-1,1]){M(o,e.wall,t*11.6,4,-2,.55,8.2,44),M(o,e.edge,t*11.25,1.08,-2,.12,.13,44),M(o,e.darkStone,t*11.24,.36,-2,.16,.55,44),M(o,e.darkStone,t*9.1,8.4,-2,5.2,.45,44),M(o,e.edge,t*8,8.68,-2,.25,.16,44),M(o,e.stone,t*9.65,9.2,-2,3.1,1,44);for(let a=-23;a<20;a+=1.2)M(o,e.edge,t*8.15,8.91,a,.24,.22,.75),M(o,e.darkStone,t*8.3,9.65,a,.65,.36,.5);for(const a of _)v(o,t*8,a),v(o,t*11.18,a,4.7);for(let a=0;a<_.length-1;a++){const d=(_[a]+_[a+1])/2,u=ue(o,e.edge,t*8,4.83,d,5.55,3.05,.26,.7);u.rotation.y=E/2;const h=ue(o,e.darkStone,t*8,4.81,d,5.05,2.89,.1,.76);h.rotation.y=E/2;const S=new I;S.position.set(t*11.27,0,d),S.rotation.y=t===1?-E/2:E/2,o.add(S),ye(S,e.dark,0,1.55,.01,3.65,5.8),ye(S,e.window,0,1.72,.035,3.3,5.35),ue(S,e.edge,0,4.61,.08,3.6,2.65,.16,.2),M(S,e.edge,-1.82,3.13,.05,.2,3,.22),M(S,e.edge,1.82,3.13,.05,.2,3,.22),M(S,e.edge,0,1.57,.06,3.95,.2,.3);for(const c of[-.92,0,.92])M(S,e.edge,c,3.5,.09,.07,3.6,.1),ue(S,e.edge,c,5.07,.09,.81,1.1,.045,.1);M(S,e.edge,0,3.75,.09,3.5,.06,.1),M(S,e.edge,0,5.04,.09,3.4,.07,.1),ue(o,e.edge,t*9.65,4.95,d,3.15,2.7,.12,.18),a%2===0&&K(t*7.58,d,t===1?-E/2:E/2)}}M(o,e.wall,0,5.1,-24,24,10.2,.75),M(o,e.darkStone,0,11.2,-24,12,2,.85);const P=new I;P.position.set(0,0,-23.5),o.add(P),ye(P,e.dark,0,.05,.02,6.4,8.5),ye(P,e.window,0,.12,.06,5.98,8.1),ue(P,e.edge,0,4.55,.18,6.45,4.2,.34,.5),ue(P,e.gold,0,4.54,.46,5.82,3.85,.035,.045);for(const t of[-3.4,3.4])v(P,t,0,4.5),M(P,e.edge,t,7.4,-.05,.37,4.9,.75),H(P,e.edge,t,10.3,-.05,0,.36,1.25,6);for(const t of[-2,-1,0,1,2])M(P,e.darkStone,t,3.25,.16,.08,6.2,.13),ue(P,e.edge,t,5.45,.14,.91,1.7,.05,.16);for(const t of[1.8,4.1,5.5])M(P,e.darkStone,0,t,.14,6,.09,.14);const te=.47;for(const t of[2.08,1.86,1.59,.54])le(P,t===1.86?e.gold:e.edge,0,9.6,te,t,t===2.08?.16:.075);const ve=H(P,e.window,0,9.6,.1,1.9,1.9,.03,64);ve.rotation.x=E/2;for(let t=0;t<12;t++){const a=t*E/6,d=le(P,e.edge,Math.cos(a)*1.08,9.6+Math.sin(a)*1.08,te,.5,.05);d.scale.y=1.1;const u=M(P,e.gold,Math.cos(a)*1.09,9.6+Math.sin(a)*1.09,.53,.04,1.15,.05);u.rotation.z=a-E/2}for(const t of[-1,1]){for(const a of[5.1,9.4]){const d=a*t;v(P,d,0,6.8),ue(P,e.edge,d,6.84,.1,2.7,2.4,.15,.3),ye(P,e.dark,d,1.1,.03,2.5,7.7),M(P,e.edge,d,3.7,.14,.08,5,.1)}K(t*5.1,-22.95,0)}M(o,e.edge,0,.17,-21,12,.34,4),M(o,e.darkStone,0,.1,-18.9,11.2,.2,.5);for(let t=0;t<2;t++)M(o,e.darkStone,0,.04+t*.065,-18.2-t*.3,10.8-t*.3,.1,.4);const G=new I;G.position.set(0,0,21),G.rotation.y=E,o.add(G),M(G,e.wall,0,5,0,24,10,.65),ye(G,e.dark,0,.02,.39,6.6,8.1),ye(G,e.wood,0,.05,.43,5.8,7.65),ue(G,e.edge,0,4.6,.5,6.1,3.4,.27,.55);for(const t of[-3.15,3.15])v(G,t,.42,4.6);M(G,e.woodEdge,0,3.5,.51,.12,6.8,.16);for(const t of[-2.42,-1.22,1.22,2.42]){M(G,e.woodEdge,t,2.75,.51,.09,5.35,.12);for(const a of[.5,2.2,4.4])M(G,e.woodEdge,t-Math.sign(t)*.4,a,.51,.8,.07,.12);ue(G,e.gold,t-Math.sign(t)*.45,4.45,.51,.84,1.45,.022,.06)}for(const t of[-.3,.3])le(G,e.gold,t,2.55,.57,.14,.025),U(G,e.gold,t,2.72,.56,.065);for(const t of[-7.8,7.8])ye(G,e.dark,t,1.4,.36,3.2,5.8),ue(G,e.edge,t,4.55,.45,3.2,2.7,.18,.3),M(G,e.edge,t-1.67,2.98,.43,.2,3,.3),M(G,e.edge,t+1.67,2.98,.43,.2,3,.3),K(t,20.45,E);M(G,e.edge,0,9.9,0,24,.26,1),M(G,e.darkStone,0,.12,.7,24,.24,1.4);for(const t of[-3.5,3.5])C(w,t,.1,19.7,.5),C(w,t+.2,.1,19.8,.3);for(const t of[-1,1])for(let a=0;a<5;a++){const d=t*(12+i()*11),u=-29-i()*7,h=10+i()*8;M(o,e.darkStone,d,h/2,u,2.2,h,2.2),H(o,e.blackMetal,d,h+2.5,u,0,1.9,5,8),H(o,e.gold,d,h+5.4,u,.03,.03,1.2,8)}H(o,e.darkStone,0,.055,-5,3.5,3.65,.11,96),H(o,e.edge,0,.13,-5,3.18,3.45,.17,96),H(o,e.darkStone,0,.235,-5,2.96,3.13,.16,96);for(const t of[3.22,2.84,2.55]){const a=le(o,e.gold,0,.327,-5,t,.022);a.rotation.x=E/2}for(let t=0;t<48;t++){const a=t*E/24,d=2.7,u=M(o,e.lightGold,Math.sin(a)*d,.332,-5+Math.cos(a)*d,.022,.012,t%4===0?.22:.08);u.rotation.y=a}for(let t=0;t<8;t++){const a=t*E/4,d=new I;o.add(d),d.position.set(Math.sin(a)*2.21,.337,-5+Math.cos(a)*2.21),d.rotation.y=a;for(const u of[-1,1]){const h=M(d,e.gold,u*.045,0,0,.018,.015,.22);h.rotation.y=u*.35}M(d,e.gold,0,0,.04,.12,.015,.018)}Ue(o,e.darkStone,[[0,0],[1.05,0],[1.1,.1],[.98,.2],[.82,.26],[.7,.48],[.68,.85],[.9,.96],[1.02,1.08],[1.02,1.2],[.89,1.25],[0,1.25]],0,.3,-5);for(const t of[.52,1.32,1.48]){const a=le(o,e.gold,0,t,-5,t<1?.91:.98,.035);a.rotation.x=E/2}H(o,e.water,0,1.555,-5,.9,.9,.018,64);const oe=[];for(let t=0;t<4;t++){const a=new I;y.add(a),a.position.y=1.5,a.rotation.set(.35+t*.63,.2+t*.71,.2+t*.4);const d=1.1+t*.28;le(a,t%2?e.lightGold:e.gold,0,0,0,d,.026+t*.004);for(let S=0;S<24;S++){const c=S*E/12,b=M(a,e.lightGold,Math.cos(c)*d,Math.sin(c)*d,0,.017,.1,.036);b.rotation.z=c-E/2}const u=a.position.clone(),h=a.rotation.clone();y.remove(a),a.position.set(0,0,0),a.rotation.set(0,0,0),Qe(a),a.position.copy(u),a.rotation.copy(h),y.add(a),oe.push(a)}const ce=U(y,e.cyan,0,1.5,0,.22);m(y,"#6fddff",0,1.5,0,2.5,.46);const Me=le(y,e.cyan,0,1.5,0,.32,.007);Me.rotation.x=E/2;const fe=[];for(let t=0;t<160;t++){const a=i()*E*2,d=.5+i()*1.9;fe.push(Math.cos(a)*d,(i()-.5)*2.5+1.5,Math.sin(a)*d)}const ae=new Se;ae.setAttribute("position",new Le(fe,3));const j=new Ie(ae,new Xe({color:"#87daee",size:.035,map:f,transparent:!0,opacity:.8,depthWrite:!1,blending:be}));y.add(j),r.push({x:0,z:-5,r:1.16});for(const t of[-1,1]){A(t*9.7,3.1,t===1?-E/2:E/2),A(t*9.7,-10.5,t===1?-E/2:E/2);for(const d of[8,-15.5])O(t*7.15,d);for(const d of[-18,0,13]){const u=t*8.04,h=le(o,e.blackMetal,u,2.7,d,.22,.035);h.rotation.y=E/2,H(o,e.gold,u,3.03,d,.2,.08,.22,16),C(w,u,3.16,d,.52),C(w,u,3.16,d-.23,.35),C(w,u,3.16,d+.23,.4),m(w,"#ffad55",u-t*.12,3.55,d,2.7,.11)}const a=new I;a.position.set(t*9.75,0,-4.2),o.add(a),M(a,e.wood,0,.95,0,1.8,.12,1.5);for(const d of[-.7,.7])for(const u of[-.57,.57])H(a,e.woodEdge,d,.45,u,.045,.085,.9,12),U(a,e.woodEdge,d,.65,u,.085);for(let d=0;d<6;d++){const u=new I;u.position.set((i()-.5)*.5,1.08+d*.09,(i()-.5)*.2),u.rotation.y=i()*.6,o.add(u),u.position.x+=t*9.75,u.position.z+=-4.2,M(u,e.pages,0,0,0,.43,.07,.55);for(const h of[-.043,.043])M(u,[e.bookBlue,e.bookRed,e.bookGreen][d%3],0,h,0,.47,.017,.58);M(u,e.gold,-.222,0,.19,.009,.07,.025)}C(w,t*9.75+.55,1.02,-4.5,.65),r.push({x:t*9.75,z:-4.2,r:1.2})}for(let t=0;t<34;t++){const d=(t%2===0?-1:1)*(1.7+i()*4.6),u=-18+i()*34,h=4.1+i()*3.4;C(w,d,h,u,.22+i()*.28,!0)}for(const t of[-19,-11,0,11])for(const a of[-6.8,6.8])C(w,a,.02,t,.3),C(w,a+.18,.02,t+.2,.16),C(w,a-.13,.02,t-.15,.23);for(const t of[-1,1])for(const a of[-20,-8,11]){const d=t*7.62,u=[];for(let h=0;h<9;h++)u.push([d+Math.sin(h*1.7)*.13,h*.83,a+Math.sin(h*.75)*.6]);X(o,e.wood,u,.025,24);for(let h=0;h<36;h++){const S=i()*6.6,c=a+Math.sin(S*.9)*.6+(i()-.5)*.8,b=d+(i()-.5)*.35;U(o,h%3?e.leaves:e.leavesLight,b,S,c,.12,1,.45,1.5).rotation.set(i()*E,i()*E,i()*E)}}for(let t=0;t<65;t++){const a=(i()-.5)*20,d=(i()-.5)*40;if(Math.abs(a)<3)continue;const u=U(o,e.leavesLight,a,.017,d,.04,1,.08,1.8);u.rotation.y=i()*E}Qe(o),w.updateMatrixWorld(!0);const J=new Map,pe=[];w.traverse(t=>{t.isMesh&&(J.has(t.material)||J.set(t.material,[]),J.get(t.material).push(t)),t.isSprite&&pe.push(t)});const q=[];for(const[t,a]of J){const d=new dt(a[0].geometry,t,a.length);d.instanceMatrix.setUsage(Ht),d.frustumCulled=!1,d.castShadow=t!==e.flame,l.add(d),q.push({batch:d,sources:a,baseHeight:a[0].geometry.parameters.height||1})}l.remove(w);const ge=new Float32Array(pe.length*3),Ee=new Float32Array(pe.length*3),xe=new Float32Array(pe.length),k=new Float32Array(pe.length);pe.forEach((t,a)=>{t.material.color.toArray(Ee,a*3),xe[a]=t.scale.x,k[a]=t.material.opacity});const n=new Se;n.setAttribute("position",new Be(ge,3)),n.setAttribute("color",new Be(Ee,3)),n.setAttribute("size",new Be(xe,1)),n.setAttribute("alpha",new Be(k,1));const s=new nt({uniforms:{map:{value:f},screenHeight:{value:window.innerHeight}},vertexShader:"attribute float size;attribute float alpha;varying vec3 vColor;varying float vAlpha;uniform float screenHeight;void main(){vColor=color;vAlpha=alpha;vec4 mv=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*mv;gl_PointSize=size*screenHeight/(-mv.z);}",fragmentShader:"uniform sampler2D map;varying vec3 vColor;varying float vAlpha;void main(){vec4 t=texture2D(map,gl_PointCoord);gl_FragColor=vec4(vColor,t.a*vAlpha);}",vertexColors:!0,transparent:!0,depthWrite:!1,blending:be}),x=new Ie(n,s);x.frustumCulled=!1,l.add(x);const L=new at,R=new at,T=new ne,W=new We({color:"#ddeaf0",fog:!1}),V=Z(new Oe(1.1,64,40),W,l,-9,17,-42);V.castShadow=!1,m(l,"#bcd5e4",-9,17,-42,8,.13),m(l,"#a3bbd9",-9,17,-42,18,.035);const Q=new nt({transparent:!0,depthWrite:!1,side:Ye,blending:be,uniforms:{tint:{value:new $e("#7199bb")}},vertexShader:"varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:"varying vec2 vUv;uniform vec3 tint;void main(){float edge=pow(sin(vUv.x*3.14159),3.);float fade=sin(vUv.y*3.14159);gl_FragColor=vec4(tint,edge*fade*.021);}"});for(const t of[-13,3]){const a=Z(new pt(.3,2.7,15,24,1,!0),Q,l,-2,6.8,t);a.rotation.z=-.48,a.castShadow=!1,a.receiveShadow=!1}const ie=[];for(let t=0;t<750;t++){const a=i()*E*2,d=.1+i()*1.1,u=85;ie.push(Math.cos(a)*Math.cos(d)*u,Math.sin(d)*u,Math.sin(a)*Math.cos(d)*u)}const me=new Se;me.setAttribute("position",new Le(ie,3));const Te=new Ie(me,new Xe({color:"#b5c9d5",size:.1,map:f,transparent:!0,opacity:.75,depthWrite:!1,fog:!1}));l.add(Te);const je=[],ze=[];for(let t=0;t<250;t++)je.push((i()-.5)*19,i()*8,-22+i()*40),ze.push(.1+i()*.2);const He=new Se;He.setAttribute("position",new Le(je,3));const _e=new Ie(He,new Xe({color:"#c2b38c",map:f,size:.04,transparent:!0,opacity:.55,depthWrite:!1,blending:be}));l.add(_e);const he=document.createElement("canvas");he.width=he.height=512;const $=he.getContext("2d");$.translate(256,256),$.strokeStyle="#a2e2ea",$.lineWidth=1.5;for(const t of[180,190,228])$.beginPath(),$.arc(0,0,t,0,E*2),$.stroke();$.font="24px Georgia",$.fillStyle="#a2e2ea",$.textAlign="center";for(let t=0;t<24;t++)$.save(),$.rotate(t*E/12),$.fillText(["ᚨ","ᚱ","ᛟ","ᛉ","ᛞ","ᚾ"][t%6],0,-200),$.restore();const Ae=Z(new ht(8,8),new We({map:new Je(he),transparent:!0,opacity:.12,depthWrite:!1,blending:be,side:Ye}),l,0,.35,-5);return Ae.rotation.x=-E/2,{colliders:r,orrery:y,orb:ce,runes:Ae,update(t,a,d){g.forEach(({flame:h,light:S,phase:c,base:b})=>{const N=1+Math.sin(t*8+c)*.12+Math.sin(t*13+c)*.05;h.scale.y=1.6*N,h.position.y=b+Math.sin(t*4+c)*.01,S.material.opacity=.45+N*.08}),p.forEach(({g:h,y:S,phase:c})=>{h.position.y=S+Math.sin(t*.65+c)*.13,h.rotation.z=Math.sin(t*.4+c)*.04}),w.updateMatrixWorld(!0);for(const{batch:h,sources:S,baseHeight:c}of q)S.forEach((b,N)=>{L.copy(b.matrixWorld),R.makeScale(1,(b.geometry.parameters.height||1)/c,1),L.multiply(R),h.setMatrixAt(N,L)}),h.instanceMatrix.needsUpdate=!0;pe.forEach((h,S)=>{h.getWorldPosition(T),n.attributes.position.setXYZ(S,T.x,T.y,T.z)}),n.attributes.position.needsUpdate=!0,s.uniforms.screenHeight.value=window.innerHeight,oe.forEach((h,S)=>{h.rotation.y+=a*(S%2?1:-1)*(d?.28:.055),h.rotation.z+=a*.026*(S+1)}),ce.position.y=1.5+Math.sin(t)*.08,j.rotation.y=t*.1,Ae.rotation.z=t*.015,Ae.material.opacity=re.lerp(Ae.material.opacity,d?.7:.12,.03);const u=_e.geometry.attributes.position;for(let h=0;h<u.count;h++)u.array[h*3]+=Math.sin(t*.2+h)*a*.025,u.array[h*3+1]+=ze[h]*a*.22,u.array[h*3+1]>8&&(u.array[h*3+1]=.2);u.needsUpdate=!0}}}function io(l){const e=[],o=[],i=[];for(let f=0;f<=16;f++)for(let w=0;w<=72;w++){const y=f/16,m=w/72*E*2,v=.19+Math.pow(y,.67)*.265+Math.sin(m*14)*.018*y,C=(Math.cos(m)+1)*.055;if(e.push(Math.sin(m)*v,1.13-y*(.83+C),Math.cos(m)*v*.78),o.push(w/72,y),f<16&&w<72){const A=f*73+w;i.push(A,A+72+1,A+1,A+1,A+72+1,A+72+2)}}const r=new Se;return r.setAttribute("position",new Le(e,3)),r.setAttribute("uv",new Le(o,2)),r.setIndex(i),r.computeVertexNormals(),new we(r,l)}function so(l,e){const o=new I;l.add(o);const i=new I;o.add(i);const g=vt(63),p=new I,r=new I,f=new I;i.add(p,r,f);const w=[],y=[],m=Ue(p,e.outfit,[[.17,1.04],[.185,1.14],[.155,1.24],[.21,1.39],[.24,1.46],[.15,1.54],[.08,1.56]],0,0,0,40);m.scale.z=.67,U(p,e.outfit,0,1.43,.015,.2,1.15,.57,.65);const v=Ue(p,e.outfitBlue,[[.178,1.1],[.182,1.13],[.171,1.19]],0,0,0);v.scale.z=.69;const C=le(p,e.gold,0,1.145,.133,.037,.009);C.scale.x=1.2,H(p,e.skin,0,1.573,.004,.061,.069,.13,24);const A=Ue(p,e.white,[[.073,1.515],[.083,1.53],[.072,1.601]],0,0,0);A.scale.z=.85;for(const n of[-1,1]){const s=new Ze;s.moveTo(n*.065,1.565),s.lineTo(n*.215,1.442),s.lineTo(n*.076,1.265),s.lineTo(n*.032,1.435),s.closePath();const x=Z(new et(s),e.outfitBlue,p,0,0,.148);x.rotation.y=n*.1,X(p,e.gold,[[n*.067,1.552,.156],[n*.192,1.444,.168],[n*.076,1.288,.16]],.005,12);for(let L=0;L<4;L++)U(p,e.gold,n*.062,1.25+L*.055,.145,.011,1,1,.5)}const O=Ue(p,e.outfitBlue,[[.025,1.32],[.035,1.35],[.014,1.52],[.024,1.55]],0,0,.172,4);O.scale.z=.22,U(p,e.lightGold,-.16,1.445,.147,.027,.7,1,.2);const K=U(p,e.cyan,-.16,1.445,.154,.012,.75,1,.3);K.material=e.iris,X(p,e.gold,[[.12,1.23,.145],[.13,1.17,.168],[.06,1.14,.178],[-.055,1.2,.157]],.004,20);for(const n of[-1,1]){const s=new I;s.position.set(n*.23,1.44,0),i.add(s),w.push(s),U(s,e.outfit,0,-.035,0,.105,.87,1.02,.95);const x=H(s,e.outfit,n*.025,-.19,0,.082,.06,.32,20);x.rotation.z=n*.13,U(s,e.outfit,n*.046,-.36,0,.064);const L=H(s,e.outfit,n*.065,-.49,.02,.062,.047,.27,20);L.rotation.z=n*.11;const R=H(s,e.outfitBlue,n*.08,-.625,.024,.057,.057,.065,24);R.rotation.z=n*.1;for(let T=0;T<3;T++)U(s,e.gold,n*.12,-.61+T*.035,.037,.01);U(s,e.outfitBlue,n*.087,-.704,.025,.052,.72,1.2,.48);for(let T=0;T<4;T++){const W=H(s,e.outfitBlue,n*.068+T*n*.012,-.763,.027,.007,.006,.055-(T===3?.012:0),8);W.rotation.z=n*.08}X(s,e.outfitBlue,[[n*-.065,.002,-.04],[n*.015,.035,.083],[n*.082,-.025,.04]],.012,12)}const _=new I;w[1].add(_),_.position.set(.09,-.745,.055),_.rotation.x=-.45,H(_,e.woodEdge,0,.08,0,.008,.013,.25,10),H(_,e.gold,0,.19,0,.013,.012,.045,10),H(_,e.wood,0,.36,0,.003,.008,.31,10);const P=new Ke;P.position.y=.52,_.add(P);const te=io(e.outfitBlue);te.castShadow=!0,te.receiveShadow=!0,f.add(te);const ve=[],G=[],oe=[];for(let n=0;n<=12;n++)for(let s=0;s<=40;s++){const x=n/12,L=.48+s/40*(E*2-.96),R=.197+Math.pow(x,.72)*.292;if(ve.push(Math.sin(L)*R,1.15-x*.8,Math.cos(L)*R*.8),G.push(s/40,x),n<12&&s<40){let T=n*41+s;oe.push(T,T+41,T+1,T+1,T+41,T+42)}}const ce=new Se;ce.setAttribute("position",new Le(ve,3)),ce.setAttribute("uv",new Le(G,2)),ce.setIndex(oe),ce.computeVertexNormals(),Z(ce,e.outfit,f);for(const n of[-1,1]){const s=[];for(let x=0;x<=18;x++){const L=x/18,R=.197+Math.pow(L,.72)*.294,T=n*.48;s.push([Math.sin(T)*R,1.15-L*.8,Math.cos(T)*R*.81])}X(f,e.gold,s,.006,24)}const Me=[];for(let n=0;n<=100;n++){const s=n/100*E*2,x=.457+Math.sin(s*14)*.018;Me.push([Math.sin(s)*x,.3-(Math.cos(s)+1)*.055,Math.cos(s)*x*.78])}X(f,e.lace,Me,.013,100);for(let n=0;n<38;n++){const s=n/38*E*2,x=le(f,e.lace,Math.sin(s)*.462,.31-(Math.cos(s)+1)*.055,Math.cos(s)*.36,.028,.005);x.rotation.y=s}for(const n of[-1,1]){const s=new I;s.position.set(n*.11,.68,0),i.add(s),y.push(s),H(s,e.lace,0,-.22,0,.061,.048,.44,20),H(s,e.boots,0,-.45,0,.065,.058,.33,20),U(s,e.boots,0,-.59,.062,.08,.83,.66,1.7),M(s,e.boots,0,-.642,.048,.13,.035,.26),M(s,e.blackMetal,0,-.626,-.046,.1,.07,.067);for(let x=0;x<5;x++)X(s,e.gold,[[-.032,-.4-x*.031,.052],[.032,-.421-x*.031,.052]],.0025,3)}r.position.set(0,1.78,.005);const fe=new Oe(1,64,48),ae=fe.attributes.position;for(let n=0;n<ae.count;n++){const s=ae.getX(n),x=ae.getY(n),L=ae.getZ(n),R=x<-.18?1+.28*(x+.18):1;let T=L*.154;if(L>0){const W=Math.exp(-((Math.abs(s)-.44)**2/.12+(x+.25)**2/.14))*.006;T+=W}ae.setXYZ(n,s*.171*R,x*.211,T)}fe.computeVertexNormals(),Z(fe,e.skin,r);const j=(n,s,x,L,R,T=1,W=1,V=1)=>{const Q=Z(new Oe(R,32,24),n,r,s,x,L);return Q.scale.set(T,W,V),Q};for(const n of[-1,1])U(r,e.skin,n*.155,-.025,-.008,.033,.6,1.28,.63);j(e.skin,0,-.03,.153,.025,.48,1.25,.64),j(e.skin,0,-.052,.161,.017,.81,.57,.7),j(e.lips,0,-.097,.139,.029,1,.16,.22),j(e.lips,0,-.104,.139,.027,1,.18,.25);for(const n of[-1,1]){j(e.white,n*.069,.006,.137,.035,1,.3,.4),j(e.iris,n*.069,.006,.15,.013,.77,.9,.3),j(e.pupil,n*.069,.005,.154,.0065,.7,.9,.3),U(r,e.white,n*.065,.011,.157,.004),X(r,e.hair,[[n*.035,.015,.148],[n*.068,.028,.151],[n*.106,.011,.141]],.004,12),X(r,e.hair,[[n*.037,.063,.13],[n*.068,.067,.134],[n*.105,.051,.123]],.006,12);for(let s=0;s<4;s++)X(r,e.hair,[[n*(.083+s*.006),.02-s*.002,.147],[n*(.089+s*.007),.032-s*.001,.151]],.0018,3)}const J=new I;J.position.set(-.068,.013,.153),J.rotation.y=-.17,r.add(J),U(J,e.lace,0,0,0,.059,1,1.05,.3);for(let n=0;n<13;n++){const s=n/13*E*2;le(J,e.hair,Math.cos(s)*.054,Math.sin(s)*.057,.004,.014,.004).scale.set(.75,1,.65)}for(let n=0;n<3;n++)for(let s=0;s<5+n*2;s++){const x=s/(5+n*2)*E*2+n*.8,L=.01+n*.012,R=U(J,n%2?e.hair:e.hairHighlight,Math.cos(x)*L,Math.sin(x)*L,.023-n*.004,.019,.55,1,.28);R.rotation.z=x-.5}X(r,e.lace,[[-.16,.057,.062],[-.116,.052,.139],[-.029,-.035,.163],[.141,-.017,.077]],.007,18),Z(new Oe(.19,40,26,0,E*2,0,E*.46),e.hair,r,0,.025,-.024).scale.set(1,1.05,.98),U(r,e.hair,0,-.093,-.1,.173,1,1.4,.7);for(let n=0;n<44;n++){const s=n/44*E*2,x=[];for(let L=0;L<=20;L++){const R=.09+L/20*1.31;x.push([Math.sin(R)*Math.sin(s)*.191,.025+Math.cos(R)*.201,-.024+Math.sin(R)*Math.cos(s)*.188])}X(r,e.hairHighlight,x,.0016,24)}for(let n=0;n<18;n++){const s=n/18*E*2;if(Math.cos(s)>.3)continue;const L=Math.sin(s)*.15,R=Math.cos(s)*.13-.045,T=.5+g()*.15,W=[];for(let V=0;V<=50;V++){const Q=V/50,ie=.025+Math.sin(Q*E)*.013,me=Q*E*10+n*.7;W.push([L+Math.cos(me)*ie,-.005-Q*T,R+Math.sin(me)*ie])}X(r,n%3===0?e.hairHighlight:e.hair,W,.021,70)}for(const n of[-1,1])for(let s=0;s<4;s++){const x=[],L=n*(.159+s*.024),R=.04-s*.044,T=.47+s*.046;for(let V=0;V<=80;V++){const Q=V/80,ie=Q*E*12+s*.7;x.push([L+Math.sin(ie)*(.017+Q*.018),.03-Q*T,R+Math.cos(ie)*(.022+Q*.009)])}X(r,s===1?e.hairHighlight:e.hair,x,.019,90);const W=x.map(V=>[V[0]+n*.011,V[1],V[2]+.01]);X(r,e.hairHighlight,W,.003,90)}for(let n=0;n<15;n++){const s=(n/14-.5)*.3,x=[[s*.5,.193,.006],[s,.139,.108],[s*.98,.071+n%3*.009,.153],[s*.96,.037+n%4*.009,.156]];X(r,n%4===0?e.hairHighlight:e.hair,x,.014,18)}const q=new I;q.position.set(.145,.16,-.024),q.rotation.z=-.48,r.add(q);const ge=H(q,e.outfitBlue,0,0,0,.13,.13,.014,32);ge.scale.z=.72,H(q,e.outfitBlue,0,.055,0,.086,.097,.1,32),H(q,e.lace,0,.022,0,.101,.101,.025,32);for(let n=0;n<7;n++){const s=n/7*E*2,x=U(q,e.outfitBlue,-.035+Math.cos(s)*.025,.05+Math.sin(s)*.025,.078,.027,.7,1,.3);x.rotation.z=s}X(q,e.hair,[[.025,.08,-.03],[.1,.17,-.04],[.13,.27,-.08]],.015,18);for(let n=0;n<10;n++){const s=n/10;for(const x of[-1,1])X(q,e.hairHighlight,[[.035+s*.085,.1+s*.15,-.04-s*.03],[.035+s*.085+x*.025,.12+s*.15,-.04-s*.03]],.004,5)}for(let n=0;n<12;n++){const s=n/11*E;U(q,e.white,Math.cos(s)*.076,.053-Math.sin(s)*.045,.069,.006)}U(r,e.gold,.153,-.078,.008,.012),U(r,e.white,.155,-.11,.01,.013,.6,1,.6);const Ee=[p,r,f,...w,...y];for(const n of Ee){const s=n.position.clone(),x=n.parent;x.remove(n),n.position.set(0,0,0),n.updateMatrixWorld(!0),Qe(n),n.position.copy(s),x.add(n)}const xe=new Ke;xe.position.set(.1,-.3,-.17),w[1].add(xe),r.scale.set(.9,.96,.95),o.position.set(-.65,0,7.7),o.rotation.y=E;let k=0;return{group:o,visual:i,tip:xe,update(n,s,x,L,R){k+=s*(L?12:8)*Math.min(x,1);const T=Math.min(x,1),W=L?.68:.4;i.position.y=(R?0:Math.abs(Math.sin(k))*.024*T)+Math.sin(n*1.8)*.006,i.rotation.z=Math.sin(k)*.017*T,w[0].rotation.x=Math.sin(k)*W*T-.08,w[1].rotation.x=-Math.sin(k)*W*T-.13,w[0].rotation.z=.035+Math.sin(n*1.5)*.012,w[1].rotation.z=-.035-Math.sin(n*1.5)*.012,y[0].rotation.x=-Math.sin(k)*W*T,y[1].rotation.x=Math.sin(k)*W*T,f.rotation.x=Math.sin(k)*.025*T,f.rotation.z=Math.sin(k)*.021*T,f.scale.z=1+Math.sin(k*2)*.035*T,r.rotation.y=Math.sin(n*.4)*.045*(1-T),r.rotation.x=Math.sin(n*.9)*.017}}}class ro{constructor(){this.enabled=!1,this.context=null,this.master=null}async toggle(){if(!this.context){const e=window.AudioContext||window.webkitAudioContext;if(!e)return!1;this.context=new e,this.master=this.context.createGain(),this.master.gain.value=0,this.master.connect(this.context.destination);const o=this.context.createBuffer(1,this.context.sampleRate*4,this.context.sampleRate),i=o.getChannelData(0);let g=0;for(let f=0;f<i.length;f++){const w=Math.random()*2-1;g=(g+.025*w)/1.025,i[f]=g*2.5}const p=this.context.createBufferSource();p.buffer=o,p.loop=!0;const r=this.context.createBiquadFilter();r.type="lowpass",r.frequency.value=430,p.connect(r),r.connect(this.master),p.start();for(const[f,w]of[[73.42,.035],[110,.021],[146.83,.012],[220,.009]]){const y=this.context.createOscillator();y.type="sine",y.frequency.value=f;const m=this.context.createGain();m.gain.value=w,y.connect(m),m.connect(this.master),y.start()}}return await this.context.resume(),this.enabled=!this.enabled,this.master.gain.setTargetAtTime(this.enabled?.38:0,this.context.currentTime,.8),this.enabled}chime(){if(!this.enabled||!this.context)return;const e=this.context.currentTime;for(const[o,i]of[293.66,440,587.33,880].entries()){const g=this.context.createOscillator(),p=this.context.createGain();g.type="sine",g.frequency.value=i,g.connect(p),p.connect(this.master),p.gain.setValueAtTime(0,e+o*.12),p.gain.linearRampToValueAtTime(.15,e+o*.12+.02),p.gain.exponentialRampToValueAtTime(.001,e+2+o*.12),g.start(e+o*.12),g.stop(e+2.1+o*.12)}}}const z=l=>document.getElementById(l),D={ready:!1,awakened:!1,photo:!1,settings:!1,sound:!1,quality:"high",fps:0,casts:0,energy:100},tt=l=>{z("loading").classList.add("hidden"),z("error-panel").classList.remove("hidden"),z("error-detail").textContent=l};window.addEventListener("error",l=>{D.ready||tt(l.message)});lo().catch(l=>{console.error(l),tt(`This experience could not initialize. ${l.message}`)});async function lo(){const l=z("scene"),e=new Ft({canvas:l,antialias:!0,powerPreference:"high-performance"});e.setPixelRatio(Math.min(window.devicePixelRatio,1.5)),e.setSize(innerWidth,innerHeight),e.shadowMap.enabled=!0,e.shadowMap.type=It,e.info.autoReset=!1,e.toneMapping=rt,e.toneMappingExposure=1.1,e.outputColorSpace=ft;const o=new lt;o.background=new $e("#112032"),o.fog=new Ot("#1b3043",.019);const i=new Wt(53,innerWidth/innerHeight,.08,160),g=new jt(e),p=new eo;o.environment=g.fromScene(p,.04).texture,o.environmentIntensity=.27,p.dispose(),g.dispose(),o.add(new qt("#a0c4e4","#283237",1.22));const r=new it("#b2d9fa",3.6);r.position.set(-10,20,-16),r.target.position.set(0,0,-3),r.castShadow=!0,r.shadow.mapSize.set(2048,2048),Object.assign(r.shadow.camera,{left:-20,right:20,top:25,bottom:-25,near:1,far:60}),r.shadow.normalBias=.035,r.shadow.bias=-15e-5,r.shadow.radius=3,o.add(r,r.target);const f=new it("#91a3c9",.95);f.position.set(5,9,14),o.add(f);const w=new Ve("#76d9f3",17,10,2);w.position.set(0,3,-5),o.add(w);for(const[c,b]of[[-7.8,0],[7.8,0],[-7.8,-18],[7.8,-18],[-7.8,13],[7.8,13]]){const N=new Ve("#ffc27e",24,10,2);N.position.set(c,3.5,b),o.add(N)}const y=await oo(),m=ao(o,y),v=so(o,y),C=new Yt(e);C.addPass(new Qt(o,i));const A=new Zt(new De(innerWidth,innerHeight),.35,.65,1.1);C.addPass(A),C.addPass(new $t);const O=new Kt(Jt);C.addPass(O);let K=.8,_=.04,P=.1,te=5.9,ve=5.9,G=0,oe=!0,ce=!1,Me=0,fe=0;const ae=new ne,j=new ne,J=new ne,pe=new ne,q=new ne,ge=new ne,Ee=new ne,xe=new ne,k=new Set,n=new Vt,s=new ro;let x=null,L,R,T=0,W=0,V=0;const Q=xt(),ie=[],me=new Ve("#b1e6ff",0,7,2);o.add(me);const Te=new we(new ht(1.35,1.1),new We({map:Q,color:"#020712",transparent:!0,opacity:.55,depthWrite:!1}));Te.rotation.x=-Math.PI/2,o.add(Te);function je(c,b){const N=Math.hypot(c,b+5);return N<3.15?.32:N<3.48?.15:b<-19&&Math.abs(c)<6?.34:0}function ze(){_=.04,P=.1,ve=5.9,te=5.9,v.group.position.set(-.65,0,7.7),v.group.rotation.y=Math.PI,q.set(0,0,0),G=0,oe=!0,He(1,!0)}function He(c,b=!1){te=re.damp(te,ve,7,c),J.copy(v.group.position).add(new ne(Math.cos(_)*.57,1.33,-Math.sin(_)*.57)),b?ae.copy(J):ae.lerp(J,1-Math.exp(-8*c)),j.set(Math.sin(_)*Math.cos(P)*te,Math.sin(P)*te,Math.cos(_)*Math.cos(P)*te).add(ae),j.x=re.clamp(j.x,-10.9,10.9),j.z=re.clamp(j.z,-22.8,19.5),j.y=Math.max(j.y,.4),b?i.position.copy(j):i.position.lerp(j,1-Math.exp(-12*c)),pe.copy(ae),i.lookAt(pe),document.querySelector(".compass-n").textContent=["N","NE","E","SE","S","SW","W","NW"][(Math.round(-_/(Math.PI/4))%8+8)%8]}function _e(c,b=3600){z("toast").textContent=c,z("toast").classList.remove("hidden"),clearTimeout(L),L=setTimeout(()=>z("toast").classList.add("hidden"),b)}function he(c=!D.settings){D.settings=c,z("settings").classList.toggle("hidden",!c),k.clear(),c||l.focus({preventScroll:!0})}function $(){D.photo=!D.photo,z("app").classList.toggle("photo-mode",D.photo),z("photo-hint").classList.toggle("hidden",!D.photo),clearTimeout(R),D.photo&&(he(!1),R=setTimeout(()=>z("photo-hint").classList.add("hidden"),4500))}function Ae(){if(fe>0||D.settings||D.energy<18)return;fe=.85,D.casts++,D.energy-=18;const c=new ne;v.tip.getWorldPosition(c);const b=new ne(0,.13,1).applyAxisAngle(new ne(0,1,0),v.group.rotation.y),N=new gt(new mt({map:Q,color:"#b7e6ff",transparent:!0,blending:be,depthWrite:!1}));N.position.copy(c),N.scale.setScalar(.6),o.add(N);const Ce=new Float32Array(270);for(let Ge=0;Ge<90;Ge++)Ce.set(c.toArray(),Ge*3);const Pe=new Se;Pe.setAttribute("position",new Be(Ce,3));const Fe=new Ie(Pe,new Xe({map:Q,color:"#a3deff",size:.09,transparent:!0,blending:be,depthWrite:!1}));o.add(Fe),ie.push({sprite:N,trail:Fe,direction:b,life:0,origin:c}),s.chime(),z("spell-flash").style.opacity=".13",setTimeout(()=>z("spell-flash").style.opacity="0",130)}function t(){D.settings||Math.hypot(v.group.position.x,v.group.position.z+5)>4.5||(D.awakened?(s.chime(),_e("“Even in darkness, we belong to the stars.”",4e3)):(D.awakened=!0,z("objective-text").textContent="The stars remember your name",z("objective-distance").textContent="Constellation discovered",document.querySelector(".objective-diamond").textContent="✦",_e("The heavens stir. A forgotten constellation returns.",5500),s.chime(),z("spell-flash").style.opacity=".28",setTimeout(()=>z("spell-flash").style.opacity="0",1500)))}window.addEventListener("keydown",c=>{if(!(c.target instanceof HTMLInputElement||c.target instanceof HTMLSelectElement)){if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(c.code)&&c.preventDefault(),c.code==="Escape"){D.photo?$():he(!D.settings);return}if(!c.repeat){if(c.code==="KeyP"){$();return}if(c.code==="Space"&&!D.settings){oe&&(ce=!0);return}if(c.code==="KeyE"){t();return}if(c.code==="KeyQ"){Ae();return}D.settings||k.add(c.code)}}}),window.addEventListener("keyup",c=>k.delete(c.code)),window.addEventListener("blur",()=>{k.clear(),x=null}),document.addEventListener("visibilitychange",()=>{k.clear(),n.getDelta()}),l.addEventListener("pointerdown",c=>{l.focus({preventScroll:!0}),D.settings&&he(!1),x={id:c.pointerId,x:c.clientX,y:c.clientY},l.setPointerCapture(c.pointerId)}),l.addEventListener("pointermove",c=>{if(!x||x.id!==c.pointerId)return;const b=c.clientX-x.x,N=c.clientY-x.y;_-=b*.004*K,P=re.clamp(P+N*.003*K,-.08,1.18),x.x=c.clientX,x.y=c.clientY});const a=()=>x=null;l.addEventListener("pointerup",a),l.addEventListener("pointercancel",a),l.addEventListener("lostpointercapture",a),l.addEventListener("wheel",c=>{c.preventDefault(),ve=re.clamp(ve+c.deltaY*.006,2.2,10)},{passive:!1}),l.addEventListener("contextmenu",c=>c.preventDefault()),z("settings-toggle").addEventListener("click",()=>he()),z("settings-close").addEventListener("click",()=>he(!1)),z("photo-toggle").addEventListener("click",$),z("reset-view").addEventListener("click",()=>{ze(),he(!1)}),document.querySelector(".brand").addEventListener("click",c=>{c.preventDefault(),ze()});async function d(){try{D.sound=await s.toggle(),z("ambient-setting").textContent=D.sound?"On":"Off",z("sound-toggle").title=D.sound?"Mute ambient sound":"Enable ambient sound",z("sound-toggle").setAttribute("aria-label",z("sound-toggle").title),z("sound-toggle").innerHTML=D.sound?'<svg viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4V5Zm4 3c3 2 3 6 0 8m3-11c5 4 5 10 0 14"/></svg>':'<svg viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4V5Zm5 4 5 6m0-6-5 6"/></svg>'}catch{_e("Ambient audio is unavailable in this browser.")}}z("sound-toggle").addEventListener("click",d),z("ambient-setting").addEventListener("click",d),z("sensitivity").addEventListener("input",c=>K=Number(c.target.value));function u(){e.setSize(innerWidth,innerHeight),C.setSize(innerWidth,innerHeight),i.aspect=innerWidth/innerHeight,i.updateProjectionMatrix();const c=e.getPixelRatio();O.material.uniforms.resolution.value.set(1/(innerWidth*c),1/(innerHeight*c))}z("quality").addEventListener("change",c=>{D.quality=c.target.value,e.setPixelRatio(Math.min(devicePixelRatio,D.quality==="high"?1.5:D.quality==="medium"?1:.75)),A.enabled=D.quality!=="low",e.shadowMap.enabled=D.quality!=="low",u()}),window.addEventListener("resize",u),u(),ze(),l.addEventListener("webglcontextlost",c=>{c.preventDefault(),tt("The graphics context was interrupted. Reload to return to the cloister.")});let h=0;function S(){requestAnimationFrame(S);const c=n.getDelta(),b=Math.min(c,.05);T+=b,W++,V+=c,V>1&&(D.fps=Math.round(W/V),W=0,V=0);let N=0,Ce=0;D.settings||(N=Number(k.has("KeyD")||k.has("ArrowRight"))-Number(k.has("KeyA")||k.has("ArrowLeft")),Ce=Number(k.has("KeyW")||k.has("ArrowUp"))-Number(k.has("KeyS")||k.has("ArrowDown")));const Pe=N!==0||Ce!==0,Fe=k.has("ShiftLeft")||k.has("ShiftRight");Ee.set(-Math.sin(_),0,-Math.cos(_)),xe.set(Math.cos(_),0,-Math.sin(_)),ge.copy(Ee).multiplyScalar(Ce).addScaledVector(xe,N),Pe&&ge.normalize();const Ge=Fe?4.7:2.25;q.x=re.damp(q.x,ge.x*Ge,10,b),q.z=re.damp(q.z,ge.z*Ge,10,b);const F=v.group.position;F.addScaledVector(q,b),F.x=re.clamp(F.x,-10.55,10.55),F.z=re.clamp(F.z,-20.5,17.5);for(const Y of m.colliders){const B=F.x-Y.x,se=F.z-Y.z,de=Math.hypot(B,se),Re=Y.r+.23;if(de<Re){const ot=Re/(de||.001);F.x=Y.x+B*ot,F.z=Y.z+se*ot}}for(const Y of[-8,8])for(const B of[-22,-15.5,-9,-2.5,4,10.5,17]){const se=F.x-Y,de=F.z-B,Re=Math.hypot(se,de);Re<.79&&(F.x=Y+se/(Re||1)*.79,F.z=B+de/(Re||1)*.79)}const ke=je(F.x,F.z);if(ce&&oe&&!D.settings&&(G=4.9,oe=!1),ce=!1,G-=12*b,F.y+=G*b,F.y<=ke?(F.y=ke,G=0,oe=!0):F.y>ke+.05&&(oe=!1),Pe){const Y=Math.atan2(ge.x,ge.z);let B=re.euclideanModulo(Y-v.group.rotation.y+Math.PI,Math.PI*2)-Math.PI;v.group.rotation.y+=B*(1-Math.exp(-12*b))}Me=re.damp(Me,Pe?1:0,8,b),v.update(T,b,Me,Fe,!oe),m.update(T,b,D.awakened),Te.position.set(F.x,ke+.012,F.z),Te.material.opacity=.48-Math.min(F.y-ke,1)*.25,Te.scale.setScalar(1+Math.max(0,F.y-ke)*.3),He(b),fe=Math.max(0,fe-b),D.energy=Math.min(100,D.energy+b*6),w.intensity=re.damp(w.intensity,D.awakened?34:17,2,b),me.intensity=0;for(let Y=ie.length-1;Y>=0;Y--){const B=ie[Y];B.life+=b,B.sprite.position.addScaledVector(B.direction,b*7),B.sprite.position.y+=Math.sin(T*3)*b*.2,B.sprite.material.opacity=Math.max(0,1-B.life/2.7);const se=B.trail.geometry.attributes.position;for(let de=se.count-1;de>0;de--)se.setXYZ(de,se.getX(de-1),se.getY(de-1),se.getZ(de-1));se.setXYZ(0,B.sprite.position.x,B.sprite.position.y,B.sprite.position.z),se.needsUpdate=!0,B.trail.material.opacity=Math.max(0,.7-B.life/4),me.position.copy(B.sprite.position),me.intensity=7*B.sprite.material.opacity,B.life>2.7&&(o.remove(B.sprite,B.trail),B.sprite.material.dispose(),B.trail.geometry.dispose(),B.trail.material.dispose(),ie.splice(Y,1))}if(T-h>.15){h=T;const Y=Math.hypot(F.x,F.z+5);z("interaction").classList.toggle("hidden",Y>4.5||D.settings),z("interaction-label").textContent=D.awakened?"LISTEN TO THE STARS":"AWAKEN THE ORRERY",z("interaction-description").textContent=D.awakened?"The cloister remembers you":"A forgotten constellation awaits",D.awakened||(z("objective-distance").textContent=`${Math.max(1,Math.round(Y))} m · Follow the starlight`),z("energy-fill").style.width=`${D.energy}%`}e.info.reset(),C.render(),D.ready||(D.ready=!0,setTimeout(()=>z("loading").classList.add("done"),250),setTimeout(()=>z("loading").classList.add("hidden"),1500))}window.__NOCTURNE__={getState:()=>({...D,simulationTime:T,position:v.group.position.toArray(),camera:i.position.toArray(),yaw:_,pitch:P,distance:te,grounded:oe,drawCalls:e.info.render.calls,triangles:e.info.render.triangles}),scene:o,camera:i,renderer:e},S()}
