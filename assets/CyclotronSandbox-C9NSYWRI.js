import{i as e,s as t,t as n}from"./index-BEJw1D7s.js";import{A as r,C as i,D as a,E as o,O as s,S as c,T as l,_ as u,b as d,d as f,f as p,g as m,h,k as g,l as _,m as v,n as y,p as b,r as x,t as S,u as C,v as w,w as T,y as E}from"./ControlPanel-CCAqfFli.js";var ee=Object.defineProperty,te=(e,t,n)=>t in e?ee(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,D=(e,t,n)=>(te(e,typeof t==`symbol`?t:t+``,n),n);function O(e,t,n,r,i){let a;if(e=e.subarray||e.slice?e:e.buffer,n=n.subarray||n.slice?n:n.buffer,e=t?e.subarray?e.subarray(t,i&&t+i):e.slice(t,i&&t+i):e,n.set)n.set(e,r);else for(a=0;a<e.length;a++)n[a+r]=e[a];return n}function k(e){return e instanceof Float32Array?e:e instanceof T?e.getAttribute(`position`).array:e.map(e=>{let t=Array.isArray(e);return e instanceof r?[e.x,e.y,e.z]:e instanceof g?[e.x,e.y,0]:t&&e.length===3?[e[0],e[1],e[2]]:t&&e.length===2?[e[0],e[1],0]:e}).flat()}var A=class extends T{constructor(){super(),D(this,`type`,`MeshLine`),D(this,`isMeshLine`,!0),D(this,`positions`,[]),D(this,`previous`,[]),D(this,`next`,[]),D(this,`side`,[]),D(this,`width`,[]),D(this,`indices_array`,[]),D(this,`uvs`,[]),D(this,`counters`,[]),D(this,`widthCallback`,null),D(this,`_attributes`),D(this,`_points`,[]),D(this,`points`),D(this,`matrixWorld`,new o),Object.defineProperties(this,{points:{enumerable:!0,get(){return this._points},set(e){this.setPoints(e,this.widthCallback)}}})}setMatrixWorld(e){this.matrixWorld=e}setPoints(e,t){if(e=k(e),this._points=e,this.widthCallback=t??null,this.positions=[],this.counters=[],e.length&&e[0]instanceof r)for(let t=0;t<e.length;t++){let n=e[t],r=t/(e.length-1);this.positions.push(n.x,n.y,n.z),this.positions.push(n.x,n.y,n.z),this.counters.push(r),this.counters.push(r)}else for(let t=0;t<e.length;t+=3){let n=t/(e.length-1);this.positions.push(e[t],e[t+1],e[t+2]),this.positions.push(e[t],e[t+1],e[t+2]),this.counters.push(n),this.counters.push(n)}this.process()}compareV3(e,t){let n=e*6,r=t*6;return this.positions[n]===this.positions[r]&&this.positions[n+1]===this.positions[r+1]&&this.positions[n+2]===this.positions[r+2]}copyV3(e){let t=e*6;return[this.positions[t],this.positions[t+1],this.positions[t+2]]}process(){let e=this.positions.length/6;this.previous=[],this.next=[],this.side=[],this.width=[],this.indices_array=[],this.uvs=[];let t,n;n=this.compareV3(0,e-1)?this.copyV3(e-2):this.copyV3(0),this.previous.push(n[0],n[1],n[2]),this.previous.push(n[0],n[1],n[2]);for(let r=0;r<e;r++){if(this.side.push(1),this.side.push(-1),t=this.widthCallback?this.widthCallback(r/(e-1)):1,this.width.push(t),this.width.push(t),this.uvs.push(r/(e-1),0),this.uvs.push(r/(e-1),1),r<e-1){n=this.copyV3(r),this.previous.push(n[0],n[1],n[2]),this.previous.push(n[0],n[1],n[2]);let e=r*2;this.indices_array.push(e,e+1,e+2),this.indices_array.push(e+2,e+1,e+3)}r>0&&(n=this.copyV3(r),this.next.push(n[0],n[1],n[2]),this.next.push(n[0],n[1],n[2]))}n=this.compareV3(e-1,0)?this.copyV3(1):this.copyV3(e-1),this.next.push(n[0],n[1],n[2]),this.next.push(n[0],n[1],n[2]),!this._attributes||this._attributes.position.count!==this.counters.length?this._attributes={position:new i(new Float32Array(this.positions),3),previous:new i(new Float32Array(this.previous),3),next:new i(new Float32Array(this.next),3),side:new i(new Float32Array(this.side),1),width:new i(new Float32Array(this.width),1),uv:new i(new Float32Array(this.uvs),2),index:new i(new Uint16Array(this.indices_array),1),counters:new i(new Float32Array(this.counters),1)}:(this._attributes.position.copyArray(new Float32Array(this.positions)),this._attributes.position.needsUpdate=!0,this._attributes.previous.copyArray(new Float32Array(this.previous)),this._attributes.previous.needsUpdate=!0,this._attributes.next.copyArray(new Float32Array(this.next)),this._attributes.next.needsUpdate=!0,this._attributes.side.copyArray(new Float32Array(this.side)),this._attributes.side.needsUpdate=!0,this._attributes.width.copyArray(new Float32Array(this.width)),this._attributes.width.needsUpdate=!0,this._attributes.uv.copyArray(new Float32Array(this.uvs)),this._attributes.uv.needsUpdate=!0,this._attributes.index.copyArray(new Uint16Array(this.indices_array)),this._attributes.index.needsUpdate=!0),this.setAttribute(`position`,this._attributes.position),this.setAttribute(`previous`,this._attributes.previous),this.setAttribute(`next`,this._attributes.next),this.setAttribute(`side`,this._attributes.side),this.setAttribute(`width`,this._attributes.width),this.setAttribute(`uv`,this._attributes.uv),this.setAttribute(`counters`,this._attributes.counters),this.setAttribute(`position`,this._attributes.position),this.setAttribute(`previous`,this._attributes.previous),this.setAttribute(`next`,this._attributes.next),this.setAttribute(`side`,this._attributes.side),this.setAttribute(`width`,this._attributes.width),this.setAttribute(`uv`,this._attributes.uv),this.setAttribute(`counters`,this._attributes.counters),this.setIndex(this._attributes.index),this.computeBoundingSphere(),this.computeBoundingBox()}advance({x:e,y:t,z:n}){let r=this._attributes.position.array,i=this._attributes.previous.array,a=this._attributes.next.array,o=r.length;O(r,0,i,0,o),O(r,6,r,0,o-6),r[o-6]=e,r[o-5]=t,r[o-4]=n,r[o-3]=e,r[o-2]=t,r[o-1]=n,O(r,6,a,0,o-6),a[o-6]=e,a[o-5]=t,a[o-4]=n,a[o-3]=e,a[o-2]=t,a[o-1]=n,this._attributes.position.needsUpdate=!0,this._attributes.previous.needsUpdate=!0,this._attributes.next.needsUpdate=!0}},j=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  #include <fog_pars_vertex>
  #include <clipping_planes_pars_vertex>

  attribute vec3 previous;
  attribute vec3 next;
  attribute float side;
  attribute float width;
  attribute float counters;
  
  uniform vec2 resolution;
  uniform float lineWidth;
  uniform vec3 color;
  uniform float opacity;
  uniform float sizeAttenuation;
  
  varying vec2 vUV;
  varying vec4 vColor;
  varying float vCounters;
  
  vec2 fix(vec4 i, float aspect) {
    vec2 res = i.xy / i.w;
    res.x *= aspect;
    return res;
  }
  
  void main() {
    float aspect = resolution.x / resolution.y;
    vColor = vec4(color, opacity);
    vUV = uv;
    vCounters = counters;
  
    mat4 m = projectionMatrix * modelViewMatrix;
    vec4 finalPosition = m * vec4(position, 1.0) * aspect;
    vec4 prevPos = m * vec4(previous, 1.0);
    vec4 nextPos = m * vec4(next, 1.0);
  
    vec2 currentP = fix(finalPosition, aspect);
    vec2 prevP = fix(prevPos, aspect);
    vec2 nextP = fix(nextPos, aspect);
  
    float w = lineWidth * width;
  
    vec2 dir;
    if (nextP == currentP) dir = normalize(currentP - prevP);
    else if (prevP == currentP) dir = normalize(nextP - currentP);
    else {
      vec2 dir1 = normalize(currentP - prevP);
      vec2 dir2 = normalize(nextP - currentP);
      dir = normalize(dir1 + dir2);
  
      vec2 perp = vec2(-dir1.y, dir1.x);
      vec2 miter = vec2(-dir.y, dir.x);
      //w = clamp(w / dot(miter, perp), 0., 4. * lineWidth * width);
    }
  
    //vec2 normal = (cross(vec3(dir, 0.), vec3(0., 0., 1.))).xy;
    vec4 normal = vec4(-dir.y, dir.x, 0., 1.);
    normal.xy *= .5 * w;
    //normal *= projectionMatrix;
    if (sizeAttenuation == 0.) {
      normal.xy *= finalPosition.w;
      normal.xy /= (vec4(resolution, 0., 1.) * projectionMatrix).xy * aspect;
    }
  
    finalPosition.xy += normal.xy * side;
    gl_Position = finalPosition;
    #include <logdepthbuf_vertex>
    #include <fog_vertex>
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    #include <clipping_planes_vertex>
    #include <fog_vertex>
  }
`,ne=`
  #include <fog_pars_fragment>
  #include <logdepthbuf_pars_fragment>
  #include <clipping_planes_pars_fragment>
  
  uniform sampler2D map;
  uniform sampler2D alphaMap;
  uniform float useGradient;
  uniform float useMap;
  uniform float useAlphaMap;
  uniform float useDash;
  uniform float dashArray;
  uniform float dashOffset;
  uniform float dashRatio;
  uniform float visibility;
  uniform float alphaTest;
  uniform vec2 repeat;
  uniform vec3 gradient[2];
  
  varying vec2 vUV;
  varying vec4 vColor;
  varying float vCounters;
  
  void main() {
    #include <logdepthbuf_fragment>
    vec4 diffuseColor = vColor;
    if (useGradient == 1.) diffuseColor = vec4(mix(gradient[0], gradient[1], vCounters), 1.0);
    if (useMap == 1.) diffuseColor *= texture2D(map, vUV * repeat);
    if (useAlphaMap == 1.) diffuseColor.a *= texture2D(alphaMap, vUV * repeat).a;
    if (diffuseColor.a < alphaTest) discard;
    if (useDash == 1.) diffuseColor.a *= ceil(mod(vCounters + dashOffset, dashArray) - (dashArray * dashRatio));
    diffuseColor.a *= step(vCounters, visibility);
    #include <clipping_planes_fragment>
    gl_FragColor = diffuseColor;     
    #include <fog_fragment>
    #include <tonemapping_fragment>
    #include <${parseInt(`184`.replace(/\D+/g,``))>=154?`colorspace_fragment`:`encodings_fragment`}>
  }
`,re=class extends s{constructor(e){super({uniforms:{...c.fog,lineWidth:{value:1},map:{value:null},useMap:{value:0},alphaMap:{value:null},useAlphaMap:{value:0},color:{value:new l(16777215)},gradient:{value:[new l(16711680),new l(65280)]},opacity:{value:1},resolution:{value:new g(1,1)},sizeAttenuation:{value:1},dashArray:{value:0},dashOffset:{value:0},dashRatio:{value:.5},useDash:{value:0},useGradient:{value:0},visibility:{value:1},alphaTest:{value:0},repeat:{value:new g(1,1)}},vertexShader:j,fragmentShader:ne}),D(this,`lineWidth`),D(this,`map`),D(this,`useMap`),D(this,`alphaMap`),D(this,`useAlphaMap`),D(this,`color`),D(this,`gradient`),D(this,`resolution`),D(this,`sizeAttenuation`),D(this,`dashArray`),D(this,`dashOffset`),D(this,`dashRatio`),D(this,`useDash`),D(this,`useGradient`),D(this,`visibility`),D(this,`repeat`),this.type=`MeshLineMaterial`,Object.defineProperties(this,{lineWidth:{enumerable:!0,get(){return this.uniforms.lineWidth.value},set(e){this.uniforms.lineWidth.value=e}},map:{enumerable:!0,get(){return this.uniforms.map.value},set(e){this.uniforms.map.value=e}},useMap:{enumerable:!0,get(){return this.uniforms.useMap.value},set(e){this.uniforms.useMap.value=e}},alphaMap:{enumerable:!0,get(){return this.uniforms.alphaMap.value},set(e){this.uniforms.alphaMap.value=e}},useAlphaMap:{enumerable:!0,get(){return this.uniforms.useAlphaMap.value},set(e){this.uniforms.useAlphaMap.value=e}},color:{enumerable:!0,get(){return this.uniforms.color.value},set(e){this.uniforms.color.value=e}},gradient:{enumerable:!0,get(){return this.uniforms.gradient.value},set(e){this.uniforms.gradient.value=e}},opacity:{enumerable:!0,get(){return this.uniforms.opacity.value},set(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get(){return this.uniforms.resolution.value},set(e){this.uniforms.resolution.value.copy(e)}},sizeAttenuation:{enumerable:!0,get(){return this.uniforms.sizeAttenuation.value},set(e){this.uniforms.sizeAttenuation.value=e}},dashArray:{enumerable:!0,get(){return this.uniforms.dashArray.value},set(e){this.uniforms.dashArray.value=e,this.useDash=e===0?0:1}},dashOffset:{enumerable:!0,get(){return this.uniforms.dashOffset.value},set(e){this.uniforms.dashOffset.value=e}},dashRatio:{enumerable:!0,get(){return this.uniforms.dashRatio.value},set(e){this.uniforms.dashRatio.value=e}},useDash:{enumerable:!0,get(){return this.uniforms.useDash.value},set(e){this.uniforms.useDash.value=e}},useGradient:{enumerable:!0,get(){return this.uniforms.useGradient.value},set(e){this.uniforms.useGradient.value=e}},visibility:{enumerable:!0,get(){return this.uniforms.visibility.value},set(e){this.uniforms.visibility.value=e}},alphaTest:{enumerable:!0,get(){return this.uniforms.alphaTest.value},set(e){this.uniforms.alphaTest.value=e}},repeat:{enumerable:!0,get(){return this.uniforms.repeat.value},set(e){this.uniforms.repeat.value.copy(e)}}}),this.setValues(e)}copy(e){return super.copy(e),this.lineWidth=e.lineWidth,this.map=e.map,this.useMap=e.useMap,this.alphaMap=e.alphaMap,this.useAlphaMap=e.useAlphaMap,this.color.copy(e.color),this.gradient=e.gradient,this.opacity=e.opacity,this.resolution.copy(e.resolution),this.sizeAttenuation=e.sizeAttenuation,this.dashArray=e.dashArray,this.dashOffset=e.dashOffset,this.dashRatio=e.dashRatio,this.useDash=e.useDash,this.useGradient=e.useGradient,this.visibility=e.visibility,this.alphaTest=e.alphaTest,this.repeat.copy(e.repeat),this}},M=t(e()),N={width:.2,length:1,decay:1,local:!1,stride:0,interval:1},P=(e,t=1)=>(e.set(e.subarray(t)),e.fill(-1/0,-t),e);function F(e,t){let{length:n,local:i,decay:a,interval:o,stride:s}={...N,...t},c=M.useRef(null),[l]=M.useState(()=>new r);M.useLayoutEffect(()=>{e&&(c.current=Float32Array.from({length:n*10*3},(t,n)=>e.position.getComponent(n%3)))},[n,e]);let u=M.useRef(new r),d=M.useRef(0);return E(()=>{if(e&&c.current){if(d.current===0){let t;i?t=e.position:(e.getWorldPosition(l),t=l);let n=1*a;for(let e=0;e<n;e++)t.distanceTo(u.current)<s||(P(c.current,3),c.current.set(t.toArray(),c.current.length-3));u.current.copy(t)}d.current++,d.current%=o}}),c}var I=M.forwardRef((e,t)=>{let{children:n}=e,{width:r,length:i,decay:o,local:s,stride:c,interval:l}={...N,...e},{color:u=`hotpink`,attenuation:f,target:p}=e,m=d(e=>e.size),h=d(e=>e.scene),_=M.useRef(null),[v,y]=M.useState(null),b=F(v,{length:i,decay:o,local:s,stride:c,interval:l});M.useEffect(()=>{let e=p?.current||_.current.children.find(e=>e instanceof a);e&&y(e)},[b,p]);let x=M.useMemo(()=>new A,[]),S=M.useMemo(()=>{let e=new re({lineWidth:.1*r,color:u,sizeAttenuation:1,resolution:new g(m.width,m.height)}),t;if(n)if(Array.isArray(n))t=n.find(e=>{let t=e;return typeof t.type==`string`&&t.type===`meshLineMaterial`});else{let e=n;typeof e.type==`string`&&e.type===`meshLineMaterial`&&(t=e)}return typeof t?.props==`object`&&t?.props!==null&&e.setValues(t.props),e},[r,u,m,n]);return M.useEffect(()=>{S.uniforms.resolution.value.set(m.width,m.height)},[m]),E(()=>{b.current&&x.setPoints(b.current,f)}),M.createElement(`group`,null,w(M.createElement(`mesh`,{ref:t,geometry:x,material:S}),h),M.createElement(`group`,{ref:_},n))}),L={B:4,eMax:40,initialSpeed:3};function R(e){let t=e.initialSpeed/100;return{t:0,x:0,z:0,px:1/Math.sqrt(1-t*t)*1*e.initialSpeed,pz:0}}function z(e){return 1*e.B/1}function B(e){return Math.hypot(e.px,e.pz)}function V(e){let t=B(e);return t/(y(t,1,100)*1)}function H(e){return y(B(e),1,100)}function U(e){return V(e)/100}function W(e,t){return B(t)/(1*e.B)}function G(e,t){return(n,r)=>{let i=n[0],a=x([n[2],0,n[3]],1,100),o,s;if(Math.abs(i)<1/2)o=1*e.eMax*Math.sign(Math.cos(t*r)),s=0;else{let t=_(1,a,[0,e.B,0]);o=t[0],s=t[2]}return[a[0],a[2],o,s]}}function K(e,t,n){let r=z(e),i=C.rk4([t.x,t.z,t.px,t.pz],G(e,r),n,t.t);return{t:t.t+n,x:i[0],z:i[1],px:i[2],pz:i[3]}}var q=n(),J=1/480,Y=.1,ie=.1,ae=24,X=22,Z=52;function oe({params:e,resetKey:t,onSample:n}){let r=(0,M.useRef)(e),i=(0,M.useRef)(R(e)),a=(0,M.useRef)(0),o=(0,M.useRef)(0),s=(0,M.useRef)(null),[c,l]=(0,M.useState)(0);(0,M.useEffect)(()=>{r.current=e},[e]),(0,M.useEffect)(()=>{i.current=R(r.current),a.current=0,o.current=0},[t]),E((e,t)=>{for(a.current+=Math.min(t,Y);a.current>=J;)i.current=K(r.current,i.current,J),a.current-=J;let c=i.current;if(Math.hypot(c.x,c.z)>ae){i.current=R(r.current),a.current=0,l(e=>e+1);return}s.current&&s.current.position.set(c.x,0,c.z),c.t-o.current>=ie&&(n({speed:V(c),radius:W(r.current,c),gamma:H(c),beta:U(c)}),o.current=c.t)});let u=1/2+X/2;return(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(`ambientLight`,{intensity:.25}),(0,q.jsx)(`directionalLight`,{position:[8,18,8],intensity:.6}),(0,q.jsx)(f,{args:[X,.3,Z],position:[u,-.4,0],children:(0,q.jsx)(`meshStandardMaterial`,{color:`#1c6fb5`,transparent:!0,opacity:.18})}),(0,q.jsx)(f,{args:[X,.3,Z],position:[-u,-.4,0],children:(0,q.jsx)(`meshStandardMaterial`,{color:`#1c6fb5`,transparent:!0,opacity:.18})}),(0,q.jsx)(f,{args:[1,.32,Z],position:[0,-.4,0],children:(0,q.jsx)(`meshStandardMaterial`,{color:`#ffcc33`,transparent:!0,opacity:.12,emissive:`#ffcc33`,emissiveIntensity:.4})}),(0,q.jsx)(I,{width:1.6,length:9,color:`#00e0ff`,attenuation:e=>e*e,children:(0,q.jsx)(v,{ref:s,args:[.28,16,16],children:(0,q.jsx)(`meshStandardMaterial`,{color:`#ffffff`,emissive:`#00e0ff`,emissiveIntensity:2.2})})},`${t}-${c}`),(0,q.jsx)(se,{}),(0,q.jsx)(h,{position:[0,-.6,0],args:[80,80],cellSize:1,cellThickness:.5,cellColor:`#1a1a1a`,sectionSize:5,sectionColor:`#333`,fadeDistance:90,infiniteGrid:!0}),(0,q.jsx)(m,{makeDefault:!0,enableDamping:!0})]})}function se(){return(0,q.jsx)(`group`,{children:[[-6,-6],[6,-6],[-6,6],[6,6]].map(([e,t],n)=>(0,q.jsxs)(`group`,{position:[e,0,t],children:[(0,q.jsx)(b,{args:[.03,.03,4],position:[0,2,0],children:(0,q.jsx)(`meshBasicMaterial`,{color:`#9b6bff`,transparent:!0,opacity:.4})}),(0,q.jsx)(p,{args:[.22,.6],position:[0,4,0],children:(0,q.jsx)(`meshBasicMaterial`,{color:`#9b6bff`,transparent:!0,opacity:.65})})]},n))})}var ce=[{key:`B`,label:`磁场 B`,min:.5,max:5,step:.1,unit:` T`},{key:`eMax`,label:`缝隙电场 E`,min:10,max:200,step:5},{key:`initialSpeed`,label:`初始速率 v₀ (需重发)`,min:1,max:10,step:.5,unit:` m/s`}],le={background:`rgba(18,18,22,0.82)`,borderRadius:10,padding:`12px 14px`,border:`1px solid #2c2c33`,backdropFilter:`blur(6px)`,color:`#e8e8ea`,fontSize:12,display:`flex`,flexDirection:`column`,gap:6};function Q({label:e,value:t,color:n}){return(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`},children:[(0,q.jsx)(`span`,{style:{color:`#b9b9c0`},children:e}),(0,q.jsx)(`span`,{style:{color:n,fontVariantNumeric:`tabular-nums`,fontWeight:600},children:t})]})}function $(){let[e,t]=(0,M.useState)(L),[n,r]=(0,M.useState)(0),[i,a]=(0,M.useState)({speed:0,radius:0,gamma:1,beta:0});return(0,q.jsxs)(`div`,{style:{position:`relative`,width:`100%`,height:`100%`,background:`#06060a`},children:[(0,q.jsx)(u,{camera:{position:[0,32,38],fov:45},children:(0,q.jsx)(oe,{params:e,resetKey:n,onSample:a})}),(0,q.jsxs)(`aside`,{style:{position:`absolute`,top:0,right:0,width:340,height:`100%`,overflowY:`auto`,padding:14,display:`flex`,flexDirection:`column`,gap:12,boxSizing:`border-box`},children:[(0,q.jsx)(S,{title:`回旋加速器 · 实验参数`,specs:ce,values:e,onChange:(e,n)=>t(t=>({...t,[e]:n})),onReset:()=>r(e=>e+1)}),(0,q.jsxs)(`div`,{style:le,children:[(0,q.jsx)(`div`,{style:{fontWeight:700,marginBottom:2},children:`实时遥测 (相对论)`}),(0,q.jsx)(Q,{label:`速率 |v|`,value:`${i.speed.toFixed(2)} m/s`,color:`#00e0ff`}),(0,q.jsx)(Q,{label:`v/c (β)`,value:i.beta.toFixed(4),color:`#ff6b6b`}),(0,q.jsx)(Q,{label:`洛伦兹因子 γ`,value:i.gamma.toFixed(4),color:`#ffcc33`}),(0,q.jsx)(Q,{label:`回旋半径 R`,value:`${i.radius.toFixed(2)} m`,color:`#9b6bff`}),(0,q.jsx)(`div`,{style:{marginTop:4,color:`#7a7a82`,fontSize:11,lineHeight:1.5},children:`积分动量 F=dp/dt, v=p/(γm₀) 恒<c (沙盒光速 c=100)。提速后 γ↑ 使回旋周期变长 → 粒子迟到 → 穿缝时电场已反向 → 失步被减速, 速率锁死在 c 附近(加速天花板)。`})]})]})]})}export{$ as default};