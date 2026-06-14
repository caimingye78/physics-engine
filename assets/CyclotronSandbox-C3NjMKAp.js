import{i as e,s as t,t as n}from"./index-DgvhKaQQ.js";import{D as r,E as i,F as a,H as o,L as s,O as c,R as l,S as u,V as d,_ as f,b as p,d as m,f as h,g,l as _,m as v,n as y,p as b,r as x,t as S,u as C,w,x as T,y as ee}from"./ControlPanel-11HJjY28.js";import{I as te,V as E,a as D,i as O,l as k,r as A,t as ne,u as re,x as ie}from"./LineChart-BjFyLdeX.js";var ae=Object.defineProperty,oe=(e,t,n)=>t in e?ae(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,j=(e,t,n)=>(oe(e,typeof t==`symbol`?t:t+``,n),n);function M(e,t,n,r,i){let a;if(e=e.subarray||e.slice?e:e.buffer,n=n.subarray||n.slice?n:n.buffer,e=t?e.subarray?e.subarray(t,i&&t+i):e.slice(t,i&&t+i):e,n.set)n.set(e,r);else for(a=0;a<e.length;a++)n[a+r]=e[a];return n}function se(e){return e instanceof Float32Array?e:e instanceof r?e.getAttribute(`position`).array:e.map(e=>{let t=Array.isArray(e);return e instanceof o?[e.x,e.y,e.z]:e instanceof d?[e.x,e.y,0]:t&&e.length===3?[e[0],e[1],e[2]]:t&&e.length===2?[e[0],e[1],0]:e}).flat()}var ce=class extends r{constructor(){super(),j(this,`type`,`MeshLine`),j(this,`isMeshLine`,!0),j(this,`positions`,[]),j(this,`previous`,[]),j(this,`next`,[]),j(this,`side`,[]),j(this,`width`,[]),j(this,`indices_array`,[]),j(this,`uvs`,[]),j(this,`counters`,[]),j(this,`widthCallback`,null),j(this,`_attributes`),j(this,`_points`,[]),j(this,`points`),j(this,`matrixWorld`,new a),Object.defineProperties(this,{points:{enumerable:!0,get(){return this._points},set(e){this.setPoints(e,this.widthCallback)}}})}setMatrixWorld(e){this.matrixWorld=e}setPoints(e,t){if(e=se(e),this._points=e,this.widthCallback=t??null,this.positions=[],this.counters=[],e.length&&e[0]instanceof o)for(let t=0;t<e.length;t++){let n=e[t],r=t/(e.length-1);this.positions.push(n.x,n.y,n.z),this.positions.push(n.x,n.y,n.z),this.counters.push(r),this.counters.push(r)}else for(let t=0;t<e.length;t+=3){let n=t/(e.length-1);this.positions.push(e[t],e[t+1],e[t+2]),this.positions.push(e[t],e[t+1],e[t+2]),this.counters.push(n),this.counters.push(n)}this.process()}compareV3(e,t){let n=e*6,r=t*6;return this.positions[n]===this.positions[r]&&this.positions[n+1]===this.positions[r+1]&&this.positions[n+2]===this.positions[r+2]}copyV3(e){let t=e*6;return[this.positions[t],this.positions[t+1],this.positions[t+2]]}process(){let e=this.positions.length/6;this.previous=[],this.next=[],this.side=[],this.width=[],this.indices_array=[],this.uvs=[];let t,n;n=this.compareV3(0,e-1)?this.copyV3(e-2):this.copyV3(0),this.previous.push(n[0],n[1],n[2]),this.previous.push(n[0],n[1],n[2]);for(let r=0;r<e;r++){if(this.side.push(1),this.side.push(-1),t=this.widthCallback?this.widthCallback(r/(e-1)):1,this.width.push(t),this.width.push(t),this.uvs.push(r/(e-1),0),this.uvs.push(r/(e-1),1),r<e-1){n=this.copyV3(r),this.previous.push(n[0],n[1],n[2]),this.previous.push(n[0],n[1],n[2]);let e=r*2;this.indices_array.push(e,e+1,e+2),this.indices_array.push(e+2,e+1,e+3)}r>0&&(n=this.copyV3(r),this.next.push(n[0],n[1],n[2]),this.next.push(n[0],n[1],n[2]))}n=this.compareV3(e-1,0)?this.copyV3(1):this.copyV3(e-1),this.next.push(n[0],n[1],n[2]),this.next.push(n[0],n[1],n[2]),!this._attributes||this._attributes.position.count!==this.counters.length?this._attributes={position:new i(new Float32Array(this.positions),3),previous:new i(new Float32Array(this.previous),3),next:new i(new Float32Array(this.next),3),side:new i(new Float32Array(this.side),1),width:new i(new Float32Array(this.width),1),uv:new i(new Float32Array(this.uvs),2),index:new i(new Uint16Array(this.indices_array),1),counters:new i(new Float32Array(this.counters),1)}:(this._attributes.position.copyArray(new Float32Array(this.positions)),this._attributes.position.needsUpdate=!0,this._attributes.previous.copyArray(new Float32Array(this.previous)),this._attributes.previous.needsUpdate=!0,this._attributes.next.copyArray(new Float32Array(this.next)),this._attributes.next.needsUpdate=!0,this._attributes.side.copyArray(new Float32Array(this.side)),this._attributes.side.needsUpdate=!0,this._attributes.width.copyArray(new Float32Array(this.width)),this._attributes.width.needsUpdate=!0,this._attributes.uv.copyArray(new Float32Array(this.uvs)),this._attributes.uv.needsUpdate=!0,this._attributes.index.copyArray(new Uint16Array(this.indices_array)),this._attributes.index.needsUpdate=!0),this.setAttribute(`position`,this._attributes.position),this.setAttribute(`previous`,this._attributes.previous),this.setAttribute(`next`,this._attributes.next),this.setAttribute(`side`,this._attributes.side),this.setAttribute(`width`,this._attributes.width),this.setAttribute(`uv`,this._attributes.uv),this.setAttribute(`counters`,this._attributes.counters),this.setAttribute(`position`,this._attributes.position),this.setAttribute(`previous`,this._attributes.previous),this.setAttribute(`next`,this._attributes.next),this.setAttribute(`side`,this._attributes.side),this.setAttribute(`width`,this._attributes.width),this.setAttribute(`uv`,this._attributes.uv),this.setAttribute(`counters`,this._attributes.counters),this.setIndex(this._attributes.index),this.computeBoundingSphere(),this.computeBoundingBox()}advance({x:e,y:t,z:n}){let r=this._attributes.position.array,i=this._attributes.previous.array,a=this._attributes.next.array,o=r.length;M(r,0,i,0,o),M(r,6,r,0,o-6),r[o-6]=e,r[o-5]=t,r[o-4]=n,r[o-3]=e,r[o-2]=t,r[o-1]=n,M(r,6,a,0,o-6),a[o-6]=e,a[o-5]=t,a[o-4]=n,a[o-3]=e,a[o-2]=t,a[o-1]=n,this._attributes.position.needsUpdate=!0,this._attributes.previous.needsUpdate=!0,this._attributes.next.needsUpdate=!0}},N=`
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
`,P=`
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
`,F=class extends l{constructor(e){super({uniforms:{...w.fog,lineWidth:{value:1},map:{value:null},useMap:{value:0},alphaMap:{value:null},useAlphaMap:{value:0},color:{value:new c(16777215)},gradient:{value:[new c(16711680),new c(65280)]},opacity:{value:1},resolution:{value:new d(1,1)},sizeAttenuation:{value:1},dashArray:{value:0},dashOffset:{value:0},dashRatio:{value:.5},useDash:{value:0},useGradient:{value:0},visibility:{value:1},alphaTest:{value:0},repeat:{value:new d(1,1)}},vertexShader:N,fragmentShader:P}),j(this,`lineWidth`),j(this,`map`),j(this,`useMap`),j(this,`alphaMap`),j(this,`useAlphaMap`),j(this,`color`),j(this,`gradient`),j(this,`resolution`),j(this,`sizeAttenuation`),j(this,`dashArray`),j(this,`dashOffset`),j(this,`dashRatio`),j(this,`useDash`),j(this,`useGradient`),j(this,`visibility`),j(this,`repeat`),this.type=`MeshLineMaterial`,Object.defineProperties(this,{lineWidth:{enumerable:!0,get(){return this.uniforms.lineWidth.value},set(e){this.uniforms.lineWidth.value=e}},map:{enumerable:!0,get(){return this.uniforms.map.value},set(e){this.uniforms.map.value=e}},useMap:{enumerable:!0,get(){return this.uniforms.useMap.value},set(e){this.uniforms.useMap.value=e}},alphaMap:{enumerable:!0,get(){return this.uniforms.alphaMap.value},set(e){this.uniforms.alphaMap.value=e}},useAlphaMap:{enumerable:!0,get(){return this.uniforms.useAlphaMap.value},set(e){this.uniforms.useAlphaMap.value=e}},color:{enumerable:!0,get(){return this.uniforms.color.value},set(e){this.uniforms.color.value=e}},gradient:{enumerable:!0,get(){return this.uniforms.gradient.value},set(e){this.uniforms.gradient.value=e}},opacity:{enumerable:!0,get(){return this.uniforms.opacity.value},set(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get(){return this.uniforms.resolution.value},set(e){this.uniforms.resolution.value.copy(e)}},sizeAttenuation:{enumerable:!0,get(){return this.uniforms.sizeAttenuation.value},set(e){this.uniforms.sizeAttenuation.value=e}},dashArray:{enumerable:!0,get(){return this.uniforms.dashArray.value},set(e){this.uniforms.dashArray.value=e,this.useDash=e===0?0:1}},dashOffset:{enumerable:!0,get(){return this.uniforms.dashOffset.value},set(e){this.uniforms.dashOffset.value=e}},dashRatio:{enumerable:!0,get(){return this.uniforms.dashRatio.value},set(e){this.uniforms.dashRatio.value=e}},useDash:{enumerable:!0,get(){return this.uniforms.useDash.value},set(e){this.uniforms.useDash.value=e}},useGradient:{enumerable:!0,get(){return this.uniforms.useGradient.value},set(e){this.uniforms.useGradient.value=e}},visibility:{enumerable:!0,get(){return this.uniforms.visibility.value},set(e){this.uniforms.visibility.value=e}},alphaTest:{enumerable:!0,get(){return this.uniforms.alphaTest.value},set(e){this.uniforms.alphaTest.value=e}},repeat:{enumerable:!0,get(){return this.uniforms.repeat.value},set(e){this.uniforms.repeat.value.copy(e)}}}),this.setValues(e)}copy(e){return super.copy(e),this.lineWidth=e.lineWidth,this.map=e.map,this.useMap=e.useMap,this.alphaMap=e.alphaMap,this.useAlphaMap=e.useAlphaMap,this.color.copy(e.color),this.gradient=e.gradient,this.opacity=e.opacity,this.resolution.copy(e.resolution),this.sizeAttenuation=e.sizeAttenuation,this.dashArray=e.dashArray,this.dashOffset=e.dashOffset,this.dashRatio=e.dashRatio,this.useDash=e.useDash,this.useGradient=e.useGradient,this.visibility=e.visibility,this.alphaTest=e.alphaTest,this.repeat.copy(e.repeat),this}},I=t(e()),L={width:.2,length:1,decay:1,local:!1,stride:0,interval:1},R=(e,t=1)=>(e.set(e.subarray(t)),e.fill(-1/0,-t),e);function z(e,t){let{length:n,local:r,decay:i,interval:a,stride:s}={...L,...t},c=I.useRef(null),[l]=I.useState(()=>new o);I.useLayoutEffect(()=>{e&&(c.current=Float32Array.from({length:n*10*3},(t,n)=>e.position.getComponent(n%3)))},[n,e]);let u=I.useRef(new o),d=I.useRef(0);return T(()=>{if(e&&c.current){if(d.current===0){let t;r?t=e.position:(e.getWorldPosition(l),t=l);let n=1*i;for(let e=0;e<n;e++)t.distanceTo(u.current)<s||(R(c.current,3),c.current.set(t.toArray(),c.current.length-3));u.current.copy(t)}d.current++,d.current%=a}}),c}var B=I.forwardRef((e,t)=>{let{children:n}=e,{width:r,length:i,decay:a,local:o,stride:c,interval:l}={...L,...e},{color:f=`hotpink`,attenuation:m,target:h}=e,g=u(e=>e.size),_=u(e=>e.scene),v=I.useRef(null),[y,b]=I.useState(null),x=z(y,{length:i,decay:a,local:o,stride:c,interval:l});I.useEffect(()=>{let e=h?.current||v.current.children.find(e=>e instanceof s);e&&b(e)},[x,h]);let S=I.useMemo(()=>new ce,[]),C=I.useMemo(()=>{let e=new F({lineWidth:.1*r,color:f,sizeAttenuation:1,resolution:new d(g.width,g.height)}),t;if(n)if(Array.isArray(n))t=n.find(e=>{let t=e;return typeof t.type==`string`&&t.type===`meshLineMaterial`});else{let e=n;typeof e.type==`string`&&e.type===`meshLineMaterial`&&(t=e)}return typeof t?.props==`object`&&t?.props!==null&&e.setValues(t.props),e},[r,f,g,n]);return I.useEffect(()=>{C.uniforms.resolution.value.set(g.width,g.height)},[g]),T(()=>{x.current&&S.setPoints(x.current,m)}),I.createElement(`group`,null,p(I.createElement(`mesh`,{ref:t,geometry:S,material:C}),_),I.createElement(`group`,{ref:v},n))}),V={B:4,eMax:40,initialSpeed:3};function H(e){let t=e.initialSpeed/100;return{t:0,x:0,z:0,px:1/Math.sqrt(1-t*t)*1*e.initialSpeed,pz:0}}function U(e){return 1*e.B/1}function W(e){return Math.hypot(e.px,e.pz)}function G(e){let t=W(e);return t/(y(t,1,100)*1)}function le(e){return y(W(e),1,100)}function ue(e){return G(e)/100}function de(e,t){return W(t)/(1*e.B)}function fe(e,t){return(n,r)=>{let i=n[0],a=x([n[2],0,n[3]],1,100),o,s;if(Math.abs(i)<1/2)o=1*e.eMax*Math.sign(Math.cos(t*r)),s=0;else{let t=_(1,a,[0,e.B,0]);o=t[0],s=t[2]}return[a[0],a[2],o,s]}}function pe(e,t,n){let r=U(e),i=C.rk4([t.x,t.z,t.px,t.pz],fe(e,r),n,t.t);return{t:t.t+n,x:i[0],z:i[1],px:i[2],pz:i[3]}}var K=600;function me(){let e={samples:[],latest:null},t=new Set,n=()=>{for(let e of t)e()};return{subscribe(e){return t.add(e),()=>t.delete(e)},getSnapshot(){return e},push(t){let r=e.samples.concat(t);r.length>K&&r.splice(0,r.length-K),e={samples:r,latest:t},n()},reset(){e={samples:[],latest:null},n()}}}var q=me();function he(){return(0,I.useSyncExternalStore)(q.subscribe,q.getSnapshot)}var J=n(),Y=1/480,ge=.1,_e=.08,ve=34,X=34,Z=74;function ye({params:e,resetKey:t,onSample:n}){let r=(0,I.useRef)(e),i=(0,I.useRef)(H(e)),a=(0,I.useRef)(0),o=(0,I.useRef)(0),s=(0,I.useRef)(null),[c,l]=(0,I.useState)(0);(0,I.useEffect)(()=>{r.current=e},[e]),(0,I.useEffect)(()=>{i.current=H(r.current),a.current=0,o.current=0,q.reset()},[t]),T((e,t)=>{for(a.current+=Math.min(t,ge);a.current>=Y;)i.current=pe(r.current,i.current,Y),a.current-=Y;let c=i.current;if(Math.hypot(c.x,c.z)>ve){i.current=H(r.current),a.current=0,o.current=0,q.reset(),l(e=>e+1);return}if(s.current&&s.current.position.set(c.x,0,c.z),c.t-o.current>=_e){let e=ue(c),t=le(c);n({speed:G(c),radius:de(r.current,c),gamma:t,beta:e}),q.push({t:Number(c.t.toFixed(2)),beta:Number(e.toFixed(4)),gamma:Number(t.toFixed(4))}),o.current=c.t}});let u=1/2+X/2;return(0,J.jsxs)(J.Fragment,{children:[(0,J.jsx)(`ambientLight`,{intensity:.25}),(0,J.jsx)(`directionalLight`,{position:[8,18,8],intensity:.6}),(0,J.jsx)(m,{args:[X,.3,Z],position:[u,-.4,0],children:(0,J.jsx)(`meshStandardMaterial`,{color:`#1c6fb5`,transparent:!0,opacity:.18})}),(0,J.jsx)(m,{args:[X,.3,Z],position:[-u,-.4,0],children:(0,J.jsx)(`meshStandardMaterial`,{color:`#1c6fb5`,transparent:!0,opacity:.18})}),(0,J.jsx)(m,{args:[1,.32,Z],position:[0,-.4,0],children:(0,J.jsx)(`meshStandardMaterial`,{color:`#ffcc33`,transparent:!0,opacity:.12,emissive:`#ffcc33`,emissiveIntensity:.4})}),(0,J.jsx)(B,{width:1.6,length:9,color:`#00e0ff`,attenuation:e=>e*e,children:(0,J.jsx)(v,{ref:s,args:[.28,16,16],children:(0,J.jsx)(`meshStandardMaterial`,{color:`#ffffff`,emissive:`#00e0ff`,emissiveIntensity:2.2})})},`${t}-${c}`),(0,J.jsx)(be,{}),(0,J.jsx)(g,{position:[0,-.6,0],args:[80,80],cellSize:1,cellThickness:.5,cellColor:`#1a1a1a`,sectionSize:5,sectionColor:`#333`,fadeDistance:90,infiniteGrid:!0}),(0,J.jsx)(f,{makeDefault:!0,enableDamping:!0})]})}function be(){return(0,J.jsx)(`group`,{children:[[-6,-6],[6,-6],[-6,6],[6,6]].map(([e,t],n)=>(0,J.jsxs)(`group`,{position:[e,0,t],children:[(0,J.jsx)(b,{args:[.03,.03,4],position:[0,2,0],children:(0,J.jsx)(`meshBasicMaterial`,{color:`#9b6bff`,transparent:!0,opacity:.4})}),(0,J.jsx)(h,{args:[.22,.6],position:[0,4,0],children:(0,J.jsx)(`meshBasicMaterial`,{color:`#9b6bff`,transparent:!0,opacity:.65})})]},n))})}var xe={background:`rgba(18,18,22,0.82)`,borderRadius:10,padding:`10px 12px 4px`,border:`1px solid #2c2c33`,backdropFilter:`blur(6px)`},Se={margin:`0 0 6px`,fontSize:13,fontWeight:600,color:`#e8e8ea`,textAlign:`center`},Ce={backgroundColor:`#1a1a1f`,border:`1px solid #333`,borderRadius:6};function we(){let{samples:e}=he();return(0,J.jsxs)(`div`,{style:xe,children:[(0,J.jsx)(`h3`,{style:Se,children:`加速天花板 · β=v/c 与 γ 随时间`}),(0,J.jsx)(E,{width:`100%`,height:190,children:(0,J.jsxs)(ne,{data:e,margin:{top:4,right:6,left:-12,bottom:0},children:[(0,J.jsx)(k,{strokeDasharray:`3 3`,stroke:`#333`}),(0,J.jsx)(O,{dataKey:`t`,stroke:`#888`,tick:{fontSize:11},unit:`s`}),(0,J.jsx)(A,{yAxisId:`beta`,domain:[0,1],stroke:`#00e0ff`,tick:{fontSize:11},width:34}),(0,J.jsx)(A,{yAxisId:`gamma`,orientation:`right`,domain:[1,`auto`],stroke:`#ffcc33`,tick:{fontSize:11},width:30}),(0,J.jsx)(ie,{contentStyle:Ce}),(0,J.jsx)(te,{verticalAlign:`top`,height:24,wrapperStyle:{fontSize:11}}),(0,J.jsx)(re,{yAxisId:`beta`,y:1,stroke:`#ff4d4d`,strokeDasharray:`5 4`,label:{value:`光速 c (β=1)`,fill:`#ff6b6b`,fontSize:10,position:`insideTopRight`}}),(0,J.jsx)(D,{yAxisId:`beta`,type:`monotone`,dataKey:`beta`,name:`v/c (β)`,stroke:`#00e0ff`,strokeWidth:2,dot:!1,isAnimationActive:!1}),(0,J.jsx)(D,{yAxisId:`gamma`,type:`monotone`,dataKey:`gamma`,name:`洛伦兹因子 γ`,stroke:`#ffcc33`,strokeWidth:2,dot:!1,isAnimationActive:!1})]})})]})}var Q=[{key:`B`,label:`磁场 B`,min:.5,max:5,step:.1,unit:` T`},{key:`eMax`,label:`缝隙电场 E`,min:10,max:200,step:5},{key:`initialSpeed`,label:`初始速率 v₀ (需重发)`,min:1,max:10,step:.5,unit:` m/s`}],Te={background:`rgba(18,18,22,0.82)`,borderRadius:10,padding:`12px 14px`,border:`1px solid #2c2c33`,backdropFilter:`blur(6px)`,color:`#e8e8ea`,fontSize:12,display:`flex`,flexDirection:`column`,gap:6};function $({label:e,value:t,color:n}){return(0,J.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`},children:[(0,J.jsx)(`span`,{style:{color:`#b9b9c0`},children:e}),(0,J.jsx)(`span`,{style:{color:n,fontVariantNumeric:`tabular-nums`,fontWeight:600},children:t})]})}function Ee(){let[e,t]=(0,I.useState)(V),[n,r]=(0,I.useState)(0),[i,a]=(0,I.useState)({speed:0,radius:0,gamma:1,beta:0});return(0,J.jsxs)(`div`,{style:{position:`relative`,width:`100%`,height:`100%`,background:`#06060a`},children:[(0,J.jsx)(ee,{camera:{position:[0,48,56],fov:45},children:(0,J.jsx)(ye,{params:e,resetKey:n,onSample:a})}),(0,J.jsxs)(`aside`,{style:{position:`absolute`,top:0,right:0,width:340,height:`100%`,overflowY:`auto`,padding:14,display:`flex`,flexDirection:`column`,gap:12,boxSizing:`border-box`},children:[(0,J.jsx)(S,{title:`回旋加速器 · 实验参数`,specs:Q,values:e,onChange:(e,n)=>t(t=>({...t,[e]:n})),onReset:()=>r(e=>e+1)}),(0,J.jsxs)(`div`,{style:Te,children:[(0,J.jsx)(`div`,{style:{fontWeight:700,marginBottom:2},children:`实时遥测 (相对论)`}),(0,J.jsx)($,{label:`速率 |v|`,value:`${i.speed.toFixed(2)} m/s`,color:`#00e0ff`}),(0,J.jsx)($,{label:`v/c (β)`,value:i.beta.toFixed(4),color:`#ff6b6b`}),(0,J.jsx)($,{label:`洛伦兹因子 γ`,value:i.gamma.toFixed(4),color:`#ffcc33`}),(0,J.jsx)($,{label:`回旋半径 R`,value:`${i.radius.toFixed(2)} m`,color:`#9b6bff`}),(0,J.jsx)(`div`,{style:{marginTop:4,color:`#7a7a82`,fontSize:11,lineHeight:1.5},children:`积分动量 F=dp/dt, v=p/(γm₀) 恒<c (沙盒光速 c=100)。提速后 γ↑ 使回旋周期变长 → 粒子迟到 → 穿缝时电场已反向 → 失步被减速, 速率锁死在 c 附近(加速天花板)。`})]}),(0,J.jsx)(we,{})]})]})}export{Ee as default};