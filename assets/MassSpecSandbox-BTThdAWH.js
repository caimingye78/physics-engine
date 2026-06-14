import{i as e,s as t,t as n}from"./index-DgvhKaQQ.js";import{A as r,B as i,F as a,H as o,I as s,M as c,N as l,O as u,P as d,R as f,S as p,T as m,U as h,V as g,W as _,_ as v,d as y,f as ee,g as te,h as ne,j as b,k as x,l as re,m as ie,p as ae,t as oe,u as se,v as ce,w as le,x as ue,y as de,z as S}from"./ControlPanel-11HJjY28.js";var C=parseInt(`184`.replace(/\D+/g,``)),w=C>=125?`uv1`:`uv2`,T=new m,E=new o,D=class extends r{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type=`LineSegmentsGeometry`,this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute(`position`,new x([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute(`uv`,new x([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,n=this.attributes.instanceEnd;return t!==void 0&&(t.applyMatrix4(e),n.applyMatrix4(e),t.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new b(t,6,1);return this.setAttribute(`instanceStart`,new c(n,3,0)),this.setAttribute(`instanceEnd`,new c(n,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let n;e instanceof Float32Array?n=e:Array.isArray(e)&&(n=new Float32Array(e));let r=new b(n,t*2,1);return this.setAttribute(`instanceColorStart`,new c(r,t,0)),this.setAttribute(`instanceColorEnd`,new c(r,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new _(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new m);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;e!==void 0&&t!==void 0&&(this.boundingBox.setFromBufferAttribute(e),T.setFromBufferAttribute(t),this.boundingBox.union(T))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new S),this.boundingBox===null&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(e!==void 0&&t!==void 0){let n=this.boundingSphere.center;this.boundingBox.getCenter(n);let r=0;for(let i=0,a=e.count;i<a;i++)E.fromBufferAttribute(e,i),r=Math.max(r,n.distanceToSquared(E)),E.fromBufferAttribute(t,i),r=Math.max(r,n.distanceToSquared(E));this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error(`THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.`,this)}}toJSON(){}applyMatrix(e){return console.warn(`THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4().`),this.applyMatrix4(e)}},O=class extends D{constructor(){super(),this.isLineGeometry=!0,this.type=`LineGeometry`}setPositions(e){let t=e.length-3,n=new Float32Array(2*t);for(let r=0;r<t;r+=3)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5];return super.setPositions(n),this}setColors(e,t=3){let n=e.length-t,r=new Float32Array(2*n);if(t===3)for(let i=0;i<n;i+=t)r[2*i]=e[i],r[2*i+1]=e[i+1],r[2*i+2]=e[i+2],r[2*i+3]=e[i+3],r[2*i+4]=e[i+4],r[2*i+5]=e[i+5];else for(let i=0;i<n;i+=t)r[2*i]=e[i],r[2*i+1]=e[i+1],r[2*i+2]=e[i+2],r[2*i+3]=e[i+3],r[2*i+4]=e[i+4],r[2*i+5]=e[i+5],r[2*i+6]=e[i+6],r[2*i+7]=e[i+7];return super.setColors(r,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}},k=class extends f{constructor(e){super({type:`LineMaterial`,uniforms:i.clone(i.merge([le.common,le.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new g(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
				#include <common>
				#include <fog_pars_vertex>
				#include <logdepthbuf_pars_vertex>
				#include <clipping_planes_pars_vertex>

				uniform float linewidth;
				uniform vec2 resolution;

				attribute vec3 instanceStart;
				attribute vec3 instanceEnd;

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
						attribute vec4 instanceColorStart;
						attribute vec4 instanceColorEnd;
					#else
						varying vec3 vLineColor;
						attribute vec3 instanceColorStart;
						attribute vec3 instanceColorEnd;
					#endif
				#endif

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#ifdef USE_DASH

					uniform float dashScale;
					attribute float instanceDistanceStart;
					attribute float instanceDistanceEnd;
					varying float vLineDistance;

				#endif

				void trimSegment( const in vec4 start, inout vec4 end ) {

					// trim end segment so it terminates between the camera plane and the near plane

					// conservative estimate of the near plane
					float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
					float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
					float nearEstimate = - 0.5 * b / a;

					float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

					end.xyz = mix( start.xyz, end.xyz, alpha );

				}

				void main() {

					#ifdef USE_COLOR

						vLineColor = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

					#endif

					#ifdef USE_DASH

						vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
						vUv = uv;

					#endif

					float aspect = resolution.x / resolution.y;

					// camera space
					vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
					vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

					#ifdef WORLD_UNITS

						worldStart = start.xyz;
						worldEnd = end.xyz;

					#else

						vUv = uv;

					#endif

					// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
					// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
					// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
					// perhaps there is a more elegant solution -- WestLangley

					bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

					if ( perspective ) {

						if ( start.z < 0.0 && end.z >= 0.0 ) {

							trimSegment( start, end );

						} else if ( end.z < 0.0 && start.z >= 0.0 ) {

							trimSegment( end, start );

						}

					}

					// clip space
					vec4 clipStart = projectionMatrix * start;
					vec4 clipEnd = projectionMatrix * end;

					// ndc space
					vec3 ndcStart = clipStart.xyz / clipStart.w;
					vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

					// direction
					vec2 dir = ndcEnd.xy - ndcStart.xy;

					// account for clip-space aspect ratio
					dir.x *= aspect;
					dir = normalize( dir );

					#ifdef WORLD_UNITS

						// get the offset direction as perpendicular to the view vector
						vec3 worldDir = normalize( end.xyz - start.xyz );
						vec3 offset;
						if ( position.y < 0.5 ) {

							offset = normalize( cross( start.xyz, worldDir ) );

						} else {

							offset = normalize( cross( end.xyz, worldDir ) );

						}

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

						// don't extend the line if we're rendering dashes because we
						// won't be rendering the endcaps
						#ifndef USE_DASH

							// extend the line bounds to encompass  endcaps
							start.xyz += - worldDir * linewidth * 0.5;
							end.xyz += worldDir * linewidth * 0.5;

							// shift the position of the quad so it hugs the forward edge of the line
							offset.xy -= dir * forwardOffset;
							offset.z += 0.5;

						#endif

						// endcaps
						if ( position.y > 1.0 || position.y < 0.0 ) {

							offset.xy += dir * 2.0 * forwardOffset;

						}

						// adjust for linewidth
						offset *= linewidth * 0.5;

						// set the world position
						worldPos = ( position.y < 0.5 ) ? start : end;
						worldPos.xyz += offset;

						// project the worldpos
						vec4 clip = projectionMatrix * worldPos;

						// shift the depth of the projected points so the line
						// segments overlap neatly
						vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
						clip.z = clipPose.z * clip.w;

					#else

						vec2 offset = vec2( dir.y, - dir.x );
						// undo aspect ratio adjustment
						dir.x /= aspect;
						offset.x /= aspect;

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						// endcaps
						if ( position.y < 0.0 ) {

							offset += - dir;

						} else if ( position.y > 1.0 ) {

							offset += dir;

						}

						// adjust for linewidth
						offset *= linewidth;

						// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
						offset /= resolution.y;

						// select end
						vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

						// back to clip space
						offset *= clip.w;

						clip.xy += offset;

					#endif

					gl_Position = clip;

					vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

					#include <logdepthbuf_vertex>
					#include <clipping_planes_vertex>
					#include <fog_vertex>

				}
			`,fragmentShader:`
				uniform vec3 diffuse;
				uniform float opacity;
				uniform float linewidth;

				#ifdef USE_DASH

					uniform float dashOffset;
					uniform float dashSize;
					uniform float gapSize;

				#endif

				varying float vLineDistance;

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#include <common>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <clipping_planes_pars_fragment>

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
					#else
						varying vec3 vLineColor;
					#endif
				#endif

				vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

					float mua;
					float mub;

					vec3 p13 = p1 - p3;
					vec3 p43 = p4 - p3;

					vec3 p21 = p2 - p1;

					float d1343 = dot( p13, p43 );
					float d4321 = dot( p43, p21 );
					float d1321 = dot( p13, p21 );
					float d4343 = dot( p43, p43 );
					float d2121 = dot( p21, p21 );

					float denom = d2121 * d4343 - d4321 * d4321;

					float numer = d1343 * d4321 - d1321 * d4343;

					mua = numer / denom;
					mua = clamp( mua, 0.0, 1.0 );
					mub = ( d1343 + d4321 * ( mua ) ) / d4343;
					mub = clamp( mub, 0.0, 1.0 );

					return vec2( mua, mub );

				}

				void main() {

					#include <clipping_planes_fragment>

					#ifdef USE_DASH

						if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

						if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

					#endif

					float alpha = opacity;

					#ifdef WORLD_UNITS

						// Find the closest points on the view ray and the line segment
						vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
						vec3 lineDir = worldEnd - worldStart;
						vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

						vec3 p1 = worldStart + lineDir * params.x;
						vec3 p2 = rayEnd * params.y;
						vec3 delta = p1 - p2;
						float len = length( delta );
						float norm = len / linewidth;

						#ifndef USE_DASH

							#ifdef USE_ALPHA_TO_COVERAGE

								float dnorm = fwidth( norm );
								alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

							#else

								if ( norm > 0.5 ) {

									discard;

								}

							#endif

						#endif

					#else

						#ifdef USE_ALPHA_TO_COVERAGE

							// artifacts appear on some hardware if a derivative is taken within a conditional
							float a = vUv.x;
							float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
							float len2 = a * a + b * b;
							float dlen = fwidth( len2 );

							if ( abs( vUv.y ) > 1.0 ) {

								alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

							}

						#else

							if ( abs( vUv.y ) > 1.0 ) {

								float a = vUv.x;
								float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
								float len2 = a * a + b * b;

								if ( len2 > 1.0 ) discard;

							}

						#endif

					#endif

					vec4 diffuseColor = vec4( diffuse, alpha );
					#ifdef USE_COLOR
						#ifdef USE_LINE_COLOR_ALPHA
							diffuseColor *= vLineColor;
						#else
							diffuseColor.rgb *= vLineColor;
						#endif
					#endif

					#include <logdepthbuf_fragment>

					gl_FragColor = diffuseColor;

					#include <tonemapping_fragment>
					#include <${C>=154?`colorspace_fragment`:`encodings_fragment`}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA=`1`:delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return`WORLD_UNITS`in this.defines},set:function(e){e===!0?this.defines.WORLD_UNITS=``:delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return`USE_DASH`in this.defines},set(e){!!e!=`USE_DASH`in this.defines&&(this.needsUpdate=!0),e===!0?this.defines.USE_DASH=``:delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return`USE_ALPHA_TO_COVERAGE`in this.defines},set:function(e){!!e!=`USE_ALPHA_TO_COVERAGE`in this.defines&&(this.needsUpdate=!0),e===!0?(this.defines.USE_ALPHA_TO_COVERAGE=``,this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}},A=new h,j=new o,M=new o,N=new h,P=new h,F=new h,I=new o,L=new a,R=new l,z=new o,B=new m,V=new S,H=new h,U,W;function G(e,t,n){return H.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),H.multiplyScalar(1/H.w),H.x=W/n.width,H.y=W/n.height,H.applyMatrix4(e.projectionMatrixInverse),H.multiplyScalar(1/H.w),Math.abs(Math.max(H.x,H.y))}function fe(e,t){let n=e.matrixWorld,r=e.geometry,i=r.attributes.instanceStart,a=r.attributes.instanceEnd,s=Math.min(r.instanceCount,i.count);for(let r=0,c=s;r<c;r++){R.start.fromBufferAttribute(i,r),R.end.fromBufferAttribute(a,r),R.applyMatrix4(n);let s=new o,c=new o;U.distanceSqToSegment(R.start,R.end,c,s),c.distanceTo(s)<W*.5&&t.push({point:c,pointOnLine:s,distance:U.origin.distanceTo(c),object:e,face:null,faceIndex:r,uv:null,[w]:null})}}function pe(e,t,n){let r=t.projectionMatrix,i=e.material.resolution,a=e.matrixWorld,s=e.geometry,c=s.attributes.instanceStart,l=s.attributes.instanceEnd,u=Math.min(s.instanceCount,c.count),f=-t.near;U.at(1,F),F.w=1,F.applyMatrix4(t.matrixWorldInverse),F.applyMatrix4(r),F.multiplyScalar(1/F.w),F.x*=i.x/2,F.y*=i.y/2,F.z=0,I.copy(F),L.multiplyMatrices(t.matrixWorldInverse,a);for(let t=0,s=u;t<s;t++){if(N.fromBufferAttribute(c,t),P.fromBufferAttribute(l,t),N.w=1,P.w=1,N.applyMatrix4(L),P.applyMatrix4(L),N.z>f&&P.z>f)continue;if(N.z>f){let e=N.z-P.z,t=(N.z-f)/e;N.lerp(P,t)}else if(P.z>f){let e=P.z-N.z,t=(P.z-f)/e;P.lerp(N,t)}N.applyMatrix4(r),P.applyMatrix4(r),N.multiplyScalar(1/N.w),P.multiplyScalar(1/P.w),N.x*=i.x/2,N.y*=i.y/2,P.x*=i.x/2,P.y*=i.y/2,R.start.copy(N),R.start.z=0,R.end.copy(P),R.end.z=0;let s=R.closestPointToPointParameter(I,!0);R.at(s,z);let u=d.lerp(N.z,P.z,s),p=u>=-1&&u<=1,m=I.distanceTo(z)<W*.5;if(p&&m){R.start.fromBufferAttribute(c,t),R.end.fromBufferAttribute(l,t),R.start.applyMatrix4(a),R.end.applyMatrix4(a);let r=new o,i=new o;U.distanceSqToSegment(R.start,R.end,i,r),n.push({point:i,pointOnLine:r,distance:U.origin.distanceTo(i),object:e,face:null,faceIndex:t,uv:null,[w]:null})}}}var me=class extends s{constructor(e=new D,t=new k({color:Math.random()*16777215})){super(e,t),this.isLineSegments2=!0,this.type=`LineSegments2`}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,n=e.attributes.instanceEnd,r=new Float32Array(2*t.count);for(let e=0,i=0,a=t.count;e<a;e++,i+=2)j.fromBufferAttribute(t,e),M.fromBufferAttribute(n,e),r[i]=i===0?0:r[i-1],r[i+1]=r[i]+j.distanceTo(M);let i=new b(r,2,1);return e.setAttribute(`instanceDistanceStart`,new c(i,1,0)),e.setAttribute(`instanceDistanceEnd`,new c(i,1,1)),this}raycast(e,t){let n=this.material.worldUnits,r=e.camera;r===null&&!n&&console.error(`LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.`);let i=e.params.Line2===void 0?0:e.params.Line2.threshold||0;U=e.ray;let a=this.matrixWorld,o=this.geometry,s=this.material;W=s.linewidth+i,o.boundingSphere===null&&o.computeBoundingSphere(),V.copy(o.boundingSphere).applyMatrix4(a);let c;if(c=n?W*.5:G(r,Math.max(r.near,V.distanceToPoint(U.origin)),s.resolution),V.radius+=c,U.intersectsSphere(V)===!1)return;o.boundingBox===null&&o.computeBoundingBox(),B.copy(o.boundingBox).applyMatrix4(a);let l;l=n?W*.5:G(r,Math.max(r.near,B.distanceToPoint(U.origin)),s.resolution),B.expandByScalar(l),U.intersectsBox(B)!==!1&&(n?fe(this,t):pe(this,r,t))}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(A),this.material.uniforms.resolution.value.set(A.z,A.w))}},he=class extends me{constructor(e=new O,t=new k({color:Math.random()*16777215})){super(e,t),this.isLine2=!0,this.type=`Line2`}},K=t(e()),ge=K.forwardRef(function({points:e,color:t=16777215,vertexColors:n,linewidth:r,lineWidth:i,segments:a,dashed:s,...c},l){var d;let f=p(e=>e.size),m=K.useMemo(()=>a?new me:new he,[a]),[_]=K.useState(()=>new k),v=(n==null||(d=n[0])==null?void 0:d.length)===4?4:3,y=K.useMemo(()=>{let r=a?new D:new O,i=e.map(e=>{let t=Array.isArray(e);return e instanceof o||e instanceof h?[e.x,e.y,e.z]:e instanceof g?[e.x,e.y,0]:t&&e.length===3?[e[0],e[1],e[2]]:t&&e.length===2?[e[0],e[1],0]:e});if(r.setPositions(i.flat()),n){t=16777215;let e=n.map(e=>e instanceof u?e.toArray():e);r.setColors(e.flat(),v)}return r},[e,a,n,v]);return K.useLayoutEffect(()=>{m.computeLineDistances()},[e,m]),K.useLayoutEffect(()=>{s?_.defines.USE_DASH=``:delete _.defines.USE_DASH,_.needsUpdate=!0},[s,_]),K.useEffect(()=>()=>{y.dispose(),_.dispose()},[y]),K.createElement(`primitive`,ce({object:m,ref:l},c),K.createElement(`primitive`,{object:y,attach:`geometry`}),K.createElement(`primitive`,ce({object:_,attach:`material`,color:t,vertexColors:!!n,resolution:[f.width,f.height],linewidth:r??i??1,dashed:s,transparent:v===4},c)))}),_e=.05,q=[2,3,4],ve={B:4,E:40,charge:1};function J(e){return e.E/Math.max(e.B,_e)}function ye(e,t){return t*J(e)/(e.charge*Math.max(e.B,_e))}function Y(e){return{x:-10,z:0,vx:J(e),vz:0,enteredB:!1}}function be(e,t){return n=>{let r=n[0],i=[n[2],0,n[3]],a=re(e.charge,i,[0,e.B,0]),o=a[0],s=a[2];return r<0&&(s+=e.charge*-e.E),[n[2],n[3],o/t,s/t]}}function xe(e,t,n,r){let i=se.rk4([n.x,n.z,n.vx,n.vz],be(e,t),r);return{x:i[0],z:i[1],vx:i[2],vz:i[3],enteredB:n.enteredB||i[0]>.05}}function Se(e){return e.enteredB&&e.x<=0}var X=n(),Z=1/240,Ce=.1,Q=.25,$=[`#00e0ff`,`#ffcc33`,`#ff6b6b`];function we(e){let t=[];for(let n=0;n<=48;n++){let r=Math.PI*n/48;t.push([e*Math.sin(r),Q,e*(1-Math.cos(r))])}return t}function Te({params:e,resetKey:t,onSample:n}){let r=(0,K.useRef)(e),i=(0,K.useRef)(q.map(()=>Y(e))),a=(0,K.useRef)(0),o=(0,K.useRef)([]),s=(0,K.useRef)(0);(0,K.useEffect)(()=>{r.current=e,i.current=q.map(()=>Y(e)),a.current=0},[e,t]),ue((e,t)=>{a.current+=Math.min(t,Ce);let c=r.current;for(;a.current>=Z;){let e=i.current;for(let t=0;t<e.length;t++){let n=xe(c,q[t],e[t],Z);Se(n)&&(n=Y(c)),e[t]=n}a.current-=Z}let l=i.current;for(let e=0;e<l.length;e++){let t=o.current[e];t&&t.position.set(l[e].x,Q,l[e].z)}s.current+=1,s.current>=12&&(n({vSel:J(c),radii:q.map(e=>ye(c,e))}),s.current=0)});let c=(0,K.useMemo)(()=>{let t=q.map(t=>ye(e,t));return{radii:t,arcs:t.map(e=>we(e)),maxLanding:2*Math.max(...t)}},[e]);return(0,X.jsxs)(X.Fragment,{children:[(0,X.jsx)(`ambientLight`,{intensity:.5}),(0,X.jsx)(`directionalLight`,{position:[6,18,8],intensity:.9}),(0,X.jsx)(`directionalLight`,{position:[-8,6,-6],intensity:.3}),(0,X.jsx)(y,{args:[1.2,1.2,1.2],position:[-10.6,Q,0],children:(0,X.jsx)(`meshStandardMaterial`,{color:`#444`,metalness:.6,roughness:.4})}),(0,X.jsx)(y,{args:[10,.15,.4],position:[-10/2,Q,2.4],children:(0,X.jsx)(`meshStandardMaterial`,{color:`#2a6f97`,metalness:.3,roughness:.6})}),(0,X.jsx)(y,{args:[10,.15,.4],position:[-10/2,Q,-2.4],children:(0,X.jsx)(`meshStandardMaterial`,{color:`#9a3b3b`,metalness:.3,roughness:.6})}),(0,X.jsx)(ge,{points:[[-10,Q,0],[0,Q,0]],color:`#5a5a64`,lineWidth:1,dashed:!0,dashScale:3}),(0,X.jsx)(y,{args:[.3,2.2,c.maxLanding+3],position:[-.2,Q,c.maxLanding/2],children:(0,X.jsx)(`meshStandardMaterial`,{color:`#222`,metalness:.7,roughness:.35})}),q.map((e,t)=>(0,X.jsxs)(`group`,{children:[(0,X.jsx)(ge,{points:c.arcs[t],color:$[t],lineWidth:1.5,transparent:!0,opacity:.4}),(0,X.jsx)(ne,{args:[.55,.12,8,24],position:[0,Q,2*c.radii[t]],rotation:[Math.PI/2,0,0],children:(0,X.jsx)(`meshStandardMaterial`,{color:$[t],emissive:$[t],emissiveIntensity:.6})}),(0,X.jsx)(ie,{ref:e=>{o.current[t]=e},args:[.32,16,16],children:(0,X.jsx)(`meshStandardMaterial`,{color:`#ffffff`,emissive:$[t],emissiveIntensity:2})})]},e)),(0,X.jsx)(Ee,{maxZ:c.maxLanding}),(0,X.jsx)(te,{position:[0,-.4,0],args:[140,140],cellSize:1,cellThickness:.5,cellColor:`#1c1c1c`,sectionSize:5,sectionColor:`#333`,fadeDistance:140,infiniteGrid:!0}),(0,X.jsx)(v,{makeDefault:!0,enableDamping:!0})]})}function Ee({maxZ:e}){let t=[];for(let n=2;n<=14;n+=6)for(let r=4;r<=e;r+=8)t.push([n,r]);return(0,X.jsx)(`group`,{children:t.map(([e,t],n)=>(0,X.jsxs)(`group`,{position:[e,0,t],children:[(0,X.jsx)(ae,{args:[.025,.025,3],position:[0,1.5,0],children:(0,X.jsx)(`meshBasicMaterial`,{color:`#9b6bff`,transparent:!0,opacity:.35})}),(0,X.jsx)(ee,{args:[.18,.5],position:[0,3,0],children:(0,X.jsx)(`meshBasicMaterial`,{color:`#9b6bff`,transparent:!0,opacity:.6})})]},n))})}var De=[{key:`B`,label:`磁场 B`,min:1,max:8,step:.5,unit:` T`},{key:`E`,label:`选择器电场 E`,min:10,max:120,step:5},{key:`charge`,label:`离子电荷 q`,min:1,max:4,step:1}],Oe=[`#00e0ff`,`#ffcc33`,`#ff6b6b`],ke={background:`rgba(18,18,22,0.82)`,borderRadius:10,padding:`12px 14px`,border:`1px solid #2c2c33`,backdropFilter:`blur(6px)`,color:`#e8e8ea`,fontSize:12,display:`flex`,flexDirection:`column`,gap:6};function Ae({label:e,value:t,color:n}){return(0,X.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`},children:[(0,X.jsx)(`span`,{style:{color:`#b9b9c0`},children:e}),(0,X.jsx)(`span`,{style:{color:n,fontVariantNumeric:`tabular-nums`,fontWeight:600},children:t})]})}function je(){let[e,t]=(0,K.useState)(ve),[n,r]=(0,K.useState)(0),[i,a]=(0,K.useState)({vSel:0,radii:q.map(()=>0)});return(0,X.jsxs)(`div`,{style:{position:`relative`,width:`100%`,height:`100%`,background:`#08080c`},children:[(0,X.jsx)(de,{camera:{position:[8,34,30],fov:45},children:(0,X.jsx)(Te,{params:e,resetKey:n,onSample:a})}),(0,X.jsxs)(`aside`,{style:{position:`absolute`,top:0,right:0,width:340,height:`100%`,overflowY:`auto`,padding:14,display:`flex`,flexDirection:`column`,gap:12,boxSizing:`border-box`},children:[(0,X.jsx)(oe,{title:`质谱仪 · 实验参数`,specs:De,values:e,onChange:(e,n)=>t(t=>({...t,[e]:n})),onReset:()=>r(e=>e+1)}),(0,X.jsxs)(`div`,{style:ke,children:[(0,X.jsx)(`div`,{style:{fontWeight:700,marginBottom:2},children:`实时遥测`}),(0,X.jsx)(Ae,{label:`通过速度 v = E/B`,value:`${i.vSel.toFixed(2)} m/s`,color:`#e8e8ea`}),q.map((e,t)=>(0,X.jsx)(Ae,{label:`m=${e} 半径 r / 落点 2r`,value:`${(i.radii[t]??0).toFixed(2)} / ${(2*(i.radii[t]??0)).toFixed(2)} m`,color:Oe[t]},e)),(0,X.jsx)(`div`,{style:{marginTop:4,color:`#7a7a82`,fontSize:11,lineHeight:1.5},children:`选择器只放行 v=E/B 的离子(上下电场板平衡磁力)。进入纯磁场区后半径 r=mv/(qB), 质量越大圆越大、落点 2r 越远 —— 三种离子在探测板上被分离开。`})]})]})]})}export{je as default};