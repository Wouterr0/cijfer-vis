var _=Object.defineProperty;var l=Object.getOwnPropertySymbols;var k=Object.prototype.hasOwnProperty,g=Object.prototype.propertyIsEnumerable;var d=(r,e,t)=>e in r?_(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t,p=(r,e)=>{for(var t in e||(e={}))k.call(e,t)&&d(r,t,e[t]);if(l)for(var t of l(e))g.call(e,t)&&d(r,t,e[t]);return r};import{_ as b,E as h,p as v,l as f,s as j}from"./Errors.0eff594f.js";import{c as a,f as y,a as s,F as c,r as x,y as C,b as E,o as n,t as m,x as q}from"./vendor.e07bfb2c.js";var I="/assets/demo.3138aa56.gif";const z={name:"Import",components:{Errors:h},data(){return{imported_results:[],errors:[]}},mounted(){document.querySelector("body").addEventListener("paste",r=>{try{const e=v(r.clipboardData.getData("text/html"),t=>{this.errors.push(t)});this.imported_results=e}catch(e){console.error(e),this.errors.push(e);return}})},watch:{imported_results(){let r=p({},f("results",{}));for(const e of this.imported_results)r[e.assignment.id]=e.score;j("results",r)}}},B={style:{display:"flex",gap:"1em"}},S=C('<div class="instructions"><h1>Resultaten importeren uit magister</h1><ol><li>Ga naar je magister cijfers</li><li>Klik op &quot;Bekijk cijferoverzicht&quot;</li><li> Onder <strong>Cijfersoort</strong> bij <strong>Weergave</strong> selecteer <strong>PTA - kolommen</strong></li><li> Selecteer alles op de pagina met de toetsencombinatie <kbd>Ctrl</kbd>+<kbd>a</kbd> (<span class="kbdcb"><kbd>\u2318 Command</kbd>+<kbd>a</kbd></span> voor Apple producten) </li><li> Kopieer het geselecteerde naar je klipbord met de toetsencombinatie <kbd>Ctrl</kbd>+<kbd>c</kbd></li><li>Ga terug naar deze pagina</li><li> Laad je resultaten door ze te plakken op deze pagina met <kbd>Ctrl</kbd>+<kbd>v</kbd></li><li><a href="./">Ga terug</a> naar de hoofdpagina</li></ol><i>TIP: je kunt de resultaten ook plakken in het &quot;Importeer resultaten&quot; invoerveld op de hoofdpagina</i></div><img src="'+I+'" class="demo" alt="Voorbeeld van het importeren van magister cijfers">',2),V={class:"magister_results"};function A(r,e,t,G,i,L){const u=E("Errors");return n(),a(c,null,[y(u,{errors:i.errors},null,8,["errors"]),s("div",B,[S,s("table",V,[(n(!0),a(c,null,x(i.imported_results,o=>(n(),a("tr",{key:o.magister},[s("td",null,m(o.magister),1),s("td",null,m(o.score),1)]))),128))])])],64)}var D=b(z,[["render",A]]);q(D).mount("#app");
