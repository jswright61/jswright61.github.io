/* Tag Studio layout engine. Browser-native; no build step. */
(function(root){
'use strict';
const header='REWARD & THANKS FOR RETURN';
const sheet={qr:true,fontMax:24,paper:'letter',orientation:'auto',cols:2,rows:3,cutLines:true};
const seeds={
 templates:[
  {name:'Shacke',shape:'angled',width:4.375,height:2.25,topEdge:3.5625,endHeight:1.125,left:.5,right:.625,top:.375,bottom:.375,hole:true,holeDiameter:.25,holeInset:.375,...sheet},
  {name:'Smoafy',shape:'rectangle',width:3.75,height:2.25,topEdge:3,endHeight:1.125,left:.375,right:.625,top:.375,bottom:.375,hole:false,holeDiameter:.25,holeInset:.375,...sheet}],
 tagData:[{header,name:'A. Traveler',email:'ATRAVELER@EXAMPLE.COM',tel1:'+1 404-555-1001',tel2:'+1 404-555-1002'}]};
function defaults(kind){return JSON.parse(JSON.stringify(seeds[kind]));}
const blankTemplate=()=>({name:'',shape:'angled',width:'',height:'',topEdge:'',endHeight:'',left:'',right:'',top:'',bottom:'',hole:false,holeDiameter:'',holeInset:'',qr:true,fontMax:'',paper:'letter',orientation:'auto',cols:'',rows:'',cutLines:true});
const blankTagData=()=>({header,name:'',email:'',tel1:'',tel2:''});
function template(t){if(!t||typeof t!=='object'||Array.isArray(t))throw Error('Invalid template.');const out=blankTemplate();for(const k in out)if(k in t)out[k]=t[k];out.name=String(out.name).trim().slice(0,60);for(const k of ['qr','hole','cutLines'])out[k]=!!out[k];for(const [k,allowed] of Object.entries({shape:['rectangle','angled'],paper:['letter','a4'],orientation:['auto','portrait','landscape']}))if(!allowed.includes(out[k]))throw Error('Invalid '+k+'.');return out;}
/* Tag data is flat JSON ({key: text}). The vCard field and bold are inferred from the key; a value of {text, field, bold} overrides them. */
const fieldKinds=['none','name','email','mobile','phone','url','note'];
function fieldFor(key){const k=key.toLowerCase();return k==='name'?'name':/^e-?mail/.test(k)?'email':/^(tel|phone|mobile|cell)/.test(k)?'mobile':/^(url|web)/.test(k)?'url':/^note/.test(k)?'note':'none';}
const boldFor=key=>key.toLowerCase()==='header';
function tagDataLines(c){if(!c||typeof c!=='object'||Array.isArray(c))throw Error('Invalid tag data.');return Object.entries(c).slice(0,12).map(([key,v])=>{const o=v&&typeof v==='object',text=String((o?v.text:v)??'');if(text.length>250)throw Error('Tag data line is too long.');return{key,text,field:o&&fieldKinds.includes(v.field)?v.field:fieldFor(key),bold:o?!!v.bold:boldFor(key)};});}
function tagDataObject(lines){const out={};for(const l of lines)out[l.key]=l.field===fieldFor(l.key)&&l.bold===boldFor(l.key)?l.text:{text:l.text,field:l.field,bold:l.bold};return out;}
const tagData=c=>tagDataObject(tagDataLines(c));
const tagDataName=c=>String((c.name&&typeof c.name==='object'?c.name.text:c.name)??'').trim();
function design(t,lines){return{...t,lines:lines.map(l=>({title:l.key,text:l.text,field:l.field,bold:l.bold}))};}
function inches(v){if(typeof v==='number')return v;const s=String(v).trim().replace(/[″"]/g,'');if(/^\d+(\.\d+)?$/.test(s)||/^\.\d+$/.test(s))return Number(s);const m=s.match(/^(?:(\d+)\s+)?(\d+)\/(\d+)$/);return m&&+m[3]>0?(+(m[1]||0)+(+m[2]/+m[3])):NaN;}
const esc=s=>String(s).replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');
function vcard(lines){let out=['BEGIN:VCARD','VERSION:3.0'],named=false;for(const l of lines){const t=l.text.trim();if(!t||l.field==='none')continue;switch(l.field){case'name':if(!named){out.push('FN:'+esc(t));const parts=t.split(/\s+/);const last=parts.length>1?parts.pop():t;out.push('N:'+esc(last)+';'+esc(parts.length?parts.join(' '):'')+';;;');named=true;}break;case'email':out.push('EMAIL;TYPE=INTERNET:'+esc(t));break;case'mobile':case'phone':out.push('TEL;TYPE='+ (l.field==='mobile'?'CELL':'VOICE')+':'+esc(t.replace(/[\s().-]/g,'')));break;case'url':out.push('URL:'+esc(t));break;case'note':out.push('NOTE:'+esc(t));break;}}
if(!named)out.splice(2,0,'FN:Luggage contact','N:Luggage contact;;;;');out.push('END:VCARD');return out.join('\r\n')+'\r\n';}
function compute(state,PDF,qrFactory){
 const errors=[],warnings=[],n={};const names={width:'Length',height:'Height',topEdge:'Straight top edge',endHeight:'Short end height',left:'Left margin',right:'Right margin',top:'Top margin',bottom:'Bottom margin',holeDiameter:'Hole diameter',holeInset:'Hole inset'};
 for(const k in names){n[k]=inches(state[k])*72;if(!Number.isFinite(n[k])||n[k]<0)errors.push(names[k]+' must be a nonnegative number or fraction.');}
 if(errors.length)return{errors,warnings};
 if(n.width<36||n.height<36)errors.push('Length and height must each be at least 1/2 inch.');
 if(n.left+n.right>=n.width||n.top+n.bottom>=n.height)errors.push('Margins must leave room for the content.');
 if(state.shape==='angled'&&(!(n.topEdge>0&&n.topEdge<n.width)||!(n.endHeight>0&&n.endHeight<n.height)))errors.push('The straight top edge must be shorter than the length, and the short end shorter than the height.');
 if(state.shape==='angled'&&state.hole){if(n.holeDiameter<=0||n.holeInset<n.holeDiameter/2||n.holeInset+n.holeDiameter/2>n.width||n.holeDiameter>n.endHeight)errors.push('The punch circle must fit fully inside the tag’s short end.');if(n.holeInset+n.holeDiameter/2>n.right)errors.push('Increase the right margin to keep the punch circle clear of the content.');}
 const rows=Number(state.rows),cols=Number(state.cols),fontMax=Number(state.fontMax);
 if(!Number.isInteger(rows)||rows<1||rows>10||!Number.isInteger(cols)||cols<1||cols>6)errors.push('Use 1–10 rows and 1–6 columns.');
 if(!Number.isFinite(fontMax)||fontMax<5||fontMax>40)errors.push('Maximum font size must be between 5 and 40 pt.');
 const lines=state.lines.filter(l=>l.text.trim()).map(l=>({...l,text:l.text.trim()}));
 if(!lines.length)errors.push('Add at least one line of text.');
 if(lines.some(l=>/[^\x20-\x7e\u00a0-\u00ff\u2013\u2014\u2018\u2019\u201c\u201d\u2022]/.test(l.text)))errors.push('This version’s PDF font supports Western European text. Please remove unsupported characters.');
 if(state.qr&&!lines.some(l=>l.field!=='none'))errors.push('Choose a vCard field for at least one line, or turn off the QR code.');
 if(lines.filter(l=>l.field==='name').length>1)errors.push('Use only one Name field in the vCard.');
 const paper=state.paper==='a4'?[595.2756,841.8898]:[612,792];const fits=(w,h)=>cols*n.width<=w-28.8&&rows*n.height<=h-28.8;
 let landscape=state.orientation==='landscape'||state.orientation==='auto'&&!fits(...paper)&&fits(paper[1],paper[0]);let pw=landscape?paper[1]:paper[0],ph=landscape?paper[0]:paper[1];
 if(!fits(pw,ph))errors.push('These tags do not fit on the sheet. Reduce rows, columns, or tag size, or change orientation.');
 if(errors.length)return{errors,warnings};
 const pdf=new PDF({unit:'pt',format:[pw,ph],orientation:landscape?'landscape':'portrait'});
 const cw=n.width-n.left-n.right,ch=n.height-n.top-n.bottom;
 let matrix=[],payload='';if(state.qr){try{payload=vcard(lines);if(qrFactory.stringToBytesFuncs&&qrFactory.stringToBytesFuncs['UTF-8'])qrFactory.stringToBytes=qrFactory.stringToBytesFuncs['UTF-8'];const qr=qrFactory(0,'M');qr.addData(payload);qr.make();matrix=Array.from({length:qr.getModuleCount()},(_,r)=>Array.from({length:qr.getModuleCount()},(_,c)=>qr.isDark(r,c)));}catch(e){errors.push('The contact data is too long for a QR code. Shorten the text or omit some vCard fields.');return{errors,warnings};}}
 const edgeAt=y=>state.shape==='rectangle'?n.width:y<(n.height-n.endHeight)/2?n.topEdge+(n.width-n.topEdge)*y/((n.height-n.endHeight)/2):y>(n.height+n.endHeight)/2?n.topEdge+(n.width-n.topEdge)*(n.height-y)/((n.height-n.endHeight)/2):n.width;
 function attempt(fs){const qs=state.qr?fs*54/10.5:0;if(qs>ch||qs>cw*.48)return null;const qx=n.width-n.right-qs,qy=n.height-n.bottom-qs;const placed=[];let good=true;for(let i=0;i<lines.length;i++){const l=lines[i],yt=lines.length===1?n.top+(ch-fs)/2:n.top+i*(ch-fs)/(lines.length-1);const y=yt+.78*fs;pdf.setFont('helvetica',l.bold?'bold':'normal');pdf.setFontSize(fs);let right=Math.min(n.width-n.right,edgeAt(yt)-2,edgeAt(yt+fs)-2);if(state.qr&&yt+fs>qy&&yt<qy+qs)right=Math.min(right,qx-6);if(pdf.getTextWidth(l.text)>right-n.left)good=false;placed.push({...l,x:n.left,y});}if(lines.length>1&&fs*1.12*lines.length>ch)good=false;if(state.qr&&(qx+qs>Math.min(edgeAt(qy),edgeAt(qy+qs))-2))good=false;return good?{font:fs,qrSize:qs,qx,qy,placed}:null;}
 let lo=0,hi=fontMax;for(let i=0;i<30;i++){const mid=(lo+hi)/2;if(attempt(mid))lo=mid;else hi=mid;}let layout=attempt(lo);
 if(!layout||lo<5){errors.push('There isn’t enough room for readable text. Reduce the text, margins, or number of lines.');return{errors,warnings};}
 if(lo<8)warnings.push('Text is under 8 pt. Consider more space or shorter lines.');
 if(state.qr&&layout.qrSize/(matrix.length+8)<.65)warnings.push('The QR code is quite small. Test a printed copy with your phone.');
 return{errors,warnings,state,n,lines,pw,ph,rows,cols,landscape,x0:(pw-cols*n.width)/2,y0:(ph-rows*n.height)/2,pdf,matrix,payload,...layout};
}
function outline(m){const n=m.n;return m.state.shape==='angled'?[[0,0],[n.topEdge,0],[n.width,(n.height-n.endHeight)/2],[n.width,(n.height+n.endHeight)/2],[n.topEdge,n.height],[0,n.height]]:[[0,0],[n.width,0],[n.width,n.height],[0,n.height]];}
function qrRuns(m,callback){if(!m.state.qr)return;const mod=m.qrSize/(m.matrix.length+8);for(let r=0;r<m.matrix.length;r++){let c=0;while(c<m.matrix.length){if(!m.matrix[r][c]){c++;continue;}let start=c;while(c<m.matrix.length&&m.matrix[r][c])c++;callback(m.qx+(start+4)*mod,m.qy+(r+4)*mod,(c-start)*mod,mod);}}}
function cutSegments(m){const a=[],n=m.n;if(!m.state.cutLines)return a;for(let c=0;c<=m.cols;c++)a.push([m.x0+c*n.width,14.4,m.x0+c*n.width,m.ph-14.4]);for(let r=0;r<=m.rows;r++)a.push([14.4,m.y0+r*n.height,m.pw-14.4,m.y0+r*n.height]);if(m.state.shape==='angled')for(let r=0;r<m.rows;r++)for(let c=0;c<m.cols;c++){const x=m.x0+c*n.width,y=m.y0+r*n.height;a.push([x+n.topEdge,y,x+n.width,y+(n.height-n.endHeight)/2],[x+n.topEdge,y+n.height,x+n.width,y+(n.height+n.endHeight)/2]);}return a;}
function pdfDocument(m){const p=m.pdf;p.setProperties({title:'Luggage tag inserts',subject:'Print at 100% / Actual Size',creator:'Tag Studio'});for(let r=0;r<m.rows;r++)for(let c=0;c<m.cols;c++){const x=m.x0+c*m.n.width,y=m.y0+r*m.n.height;p.setTextColor(0);p.setFillColor(0);for(const l of m.placed){p.setFont('helvetica',l.bold?'bold':'normal');p.setFontSize(m.font);p.text(l.text,x+l.x,y+l.y);}qrRuns(m,(qx,qy,w,h)=>p.rect(x+qx,y+qy,w+.06,h+.06,'F'));if(m.state.shape==='angled'&&m.state.hole){p.setDrawColor(140);p.setLineWidth(.3);p.circle(x+m.n.width-m.n.holeInset,y+m.n.height/2,m.n.holeDiameter/2,'S');}}
p.setDrawColor(145);p.setLineWidth(.3);for(const s of cutSegments(m))p.line(...s);return p;}
root.TagCore={defaults,blankTemplate,blankTagData,template,tagData,tagDataName,tagDataLines,tagDataObject,fieldFor,design,inches,vcard,compute,outline,qrRuns,cutSegments,pdfDocument};
})(globalThis);
