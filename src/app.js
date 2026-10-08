(() => {
'use strict';
const KEY='zhuri-open-v1';
const DAYS=['日','一','二','三','四','五','六'];
const KINDS=[['work','专注'],['break','休息'],['life','生活'],['exercise','运动'],['sleep','睡眠']];
const el=id=>document.getElementById(id);
const fmt=n=>String(n).padStart(2,'0');
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>typeof crypto!=='undefined'&&crypto.randomUUID?crypto.randomUUID():'id-'+Date.now()+'-'+Math.random().toString(36).slice(2);
const defaultState=()=>({schema:1,started:false,blankPercent:29,schedule:[],projects:[]});
function read(){try{let o=JSON.parse(localStorage.getItem(KEY));return validate(o)}catch{return defaultState()}}
function validTime(x){return typeof x==='string'&&/^([01]\d|2[0-3]):[0-5]\d$/.test(x)}
function minutes(t){const [h,m]=t.split(':').map(Number);return h*60+m}
function duration(t){let m=minutes(t.end)-minutes(t.start);return m<=0?m+1440:m}
function durationText(m){if(m<60)return m+'分钟';const h=Math.floor(m/60),r=m%60;return `${h}小时${r?r+'分钟':''}`}
function validate(data){
 if(!data||typeof data!=='object'||data.schema!==1||!Array.isArray(data.schedule)||!Array.isArray(data.projects))throw Error('文件不是逐日 v1 数据');
 if(data.schedule.length>200||data.projects.length>100)throw Error('数据项数量超过限制');
 const projects=data.projects.map(p=>{
  if(!p||typeof p.title!=='string'||!p.title.trim()||!Array.isArray(p.stages)||p.stages.length>100)throw Error('无效计划');
  return {id:String(p.id||uid()).slice(0,80),title:p.title.slice(0,100),stages:p.stages.map(s=>{
   if(!s||typeof s.title!=='string'||!Array.isArray(s.items)||s.items.length>500)throw Error('无效阶段');
   return {id:String(s.id||uid()).slice(0,80),title:s.title.slice(0,100),items:s.items.map(i=>{
    if(!i||typeof i.title!=='string')throw Error('无效任务');
    return {id:String(i.id||uid()).slice(0,80),title:i.title.slice(0,200),done:i.done===true};
   })};
  })};
 });
 const schedule=data.schedule.map(t=>{
  if(!t||!validTime(t.start)||!validTime(t.end)||typeof t.title!=='string'||!t.title.trim()||!Array.isArray(t.days))throw Error('无效时间段');
  return {id:String(t.id||uid()).slice(0,80),start:t.start,end:t.end,title:t.title.slice(0,100),type:KINDS.some(k=>k[0]===t.type)?t.type:'life',subject:String(t.subject||'').slice(0,70),projectId:String(t.projectId||''),days:[...new Set(t.days.filter(x=>Number.isInteger(x)&&x>=0&&x<=6))]};
 });
 return {schema:1,started:data.started===true,blankPercent:Math.max(0,Math.min(65,Number(data.blankPercent)||0)),schedule,projects};
}
let state=read();let nav={view:'schedule'};
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch{toast('无法自动保存，请导出备份')}}
function toast(message){const x=el('toast');x.textContent=message;x.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>x.classList.remove('show'),2200)}
function go(view,id='',stageId=''){if(nav.view===view&&nav.id===id&&nav.stageId===stageId)return;nav={view,id,stageId};render()}
function back(){if(nav.view==='stage'||nav.view==='stage-edit')go('project',nav.id);else if(nav.view==='project'||nav.view==='project-edit')go('projects');else if(nav.view==='slot'||nav.view==='schedule-edit'||nav.view==='settings')go('schedule');else if(nav.view==='item-edit')go('stage',nav.id,nav.stageId);else go('schedule')}
function kindLabel(type){return (KINDS.find(x=>x[0]===type)||['','其他'])[1]}
function project(id){return state.projects.find(p=>p.id===id)}
function stage(p,id){return p?.stages.find(x=>x.id===id)}
function itemCount(p){return p.stages.reduce((n,s)=>n+s.items.length,0)}
function completedCount(p){return p.stages.reduce((n,s)=>n+s.items.filter(i=>i.done).length,0)}
function percent(p){let total=itemCount(p);return total?Math.round(completedCount(p)*100/total):0}
function scheduleRows(day=new Date().getDay()){return state.schedule.filter(t=>t.days.includes(day)).sort((a,b)=>minutes(a.start)-minutes(b.start))}
function intervals(now){let a=[];for(let delta=-1;delta<=8;delta++){
 let d=new Date(now.getFullYear(),now.getMonth(),now.getDate()+delta),day=d.getDay();
 for(let t of state.schedule){if(!t.days.includes(day))continue;let start=new Date(d);start.setHours(...t.start.split(':').map(Number),0,0);let end=new Date(d);end.setHours(...t.end.split(':').map(Number),0,0);if(end<=start)end.setDate(end.getDate()+1);a.push({t,start,end})}
 }return a.sort((x,y)=>x.start-y.start);
}
function timeStatus(now){const all=intervals(now),cur=all.find(i=>i.start<=now&&i.end>now),next=all.find(i=>i.start>now);return {cur,next}}
function heading(title,kicker,actions='',showBack=true){return `${showBack?'<button class="back" type="button" data-action="back" aria-label="返回">←</button>':''}<div class="heading-title"><small>${esc(kicker)}</small><h2>${esc(title)}</h2></div><div class="heading-buttons">${actions}</div>`}
function button(text,action,cl=''){return `<button type="button" class="button ${cl}" data-action="${esc(action)}">${esc(text)}</button>`}
function renderSchedule(){
 let now=new Date(),rows=scheduleRows(now.getDay()),active=timeStatus(now).cur?.t;
 let h=heading('每日时间表','SCHEDULE',button('调整日程','manage-schedule'),false),b='';
 if(!state.started){h=heading('欢迎使用逐日','GET STARTED','',false);b=`<div class="content"><div class="banner"><strong>创建属于自己的桌面计划</strong><p>逐日没有预设的个人作息。你可以从空白开始，或者先试用一份不包含个人信息的通用示例。</p></div><div class="flex-actions">${button('从空白开始','start-empty','primary')}${button('载入通用示例','start-demo')}</div><p class="helper">无需登录。数据只保存在当前浏览器中，建议定期导出备份。</p></div>`;return {h,b,f:'本地数据 · 不上传到服务器'};}
 if(!rows.length)b=`<div class="content"><div class="banner"><strong>今天还没有安排</strong><p>添加时间段后，这里会自动显示六列表格、当前任务和实时倒计时。</p></div>${button('添加第一个时间段','add-time','primary')}</div>`;
 else b=`<table class="table" aria-label="每日时间表"><colgroup><col style="width:14%"><col style="width:14%"><col style="width:24%"><col style="width:13%"><col style="width:16%"><col style="width:19%"></colgroup><thead><tr><th>开始时间</th><th>结束时间</th><th>安排</th><th>类别</th><th>科目/项目</th><th>时长</th></tr></thead><tbody>${rows.map(t=>`<tr tabindex="0" role="button" data-row="${esc(t.id)}" class="${t===active?'current':''}" aria-label="查看 ${esc(t.title)}"><td class="time">${esc(t.start)}</td><td class="time">${esc(t.end)}</td><td class="activity">${esc(t.title)}</td><td class="tag type-${esc(t.type)}">${kindLabel(t.type)}</td><td class="subject">${esc(t.subject||(project(t.projectId)?.title||'—'))}</td><td class="duration">${durationText(duration(t))}</td></tr>`).join('')}</tbody></table>`;
 return {h,b,f:`今天 ${rows.length} 个时段 · 点击任意一行查看或修改`};
}
function renderSlot(){const t=state.schedule.find(t=>t.id===nav.id);if(!t)return {h:heading('时段已删除','SCHEDULE'),b:'<div class="content">这个时段不存在。</div>',f:''};
 return {h:heading(t.title,'TIME SLOT',button('编辑','edit-time')+button('删除','delete-time','danger')),b:`<div class="content"><div class="banner"><strong>${esc(t.start)} — ${esc(t.end)}</strong><p>时长 ${durationText(duration(t))} · ${kindLabel(t.type)} · ${esc(t.subject||'未设置科目/项目')}</p></div>${t.projectId&&project(t.projectId)?`<div class="heading-secondary">关联计划</div><button type="button" class="item" data-project="${esc(t.projectId)}"><span class="details"><b>${esc(project(t.projectId).title)}</b><small>在这张卡片内查看详细计划</small></span><span class="mark">→</span></button>`:''}<div class="helper">重复日期：${t.days.sort().map(i=>'周'+DAYS[i]).join('、')||'未启用'}</div></div>`,f:'时段详情 · 可自由调整'};
}
function weekdayHtml(days){return `<div class="weekday">${DAYS.map((s,i)=>`<label><input type="checkbox" name="days" value="${i}" ${days.includes(i)?'checked':''}>周${s}</label>`).join('')}</div>`}
function scheduleForm(){const t=nav.id?state.schedule.find(x=>x.id===nav.id):null,pid=t?.projectId||'';
 let f=`<form class="content" id="scheduleForm"><label class="field">安排名称<input name="title" required maxlength="100" placeholder="例如：专注处理今日任务" value="${esc(t?.title||'')}"></label><div class="two-col"><label class="field">开始时间<input type="time" name="start" required value="${esc(t?.start||'09:00')}"></label><label class="field">结束时间<input type="time" name="end" required value="${esc(t?.end||'10:00')}"></label></div><div class="two-col"><label class="field">安排类别<select name="type">${KINDS.map(([key,text])=>`<option value="${key}" ${key===(t?.type||'work')?'selected':''}>${text}</option>`).join('')}</select></label><label class="field">科目 / 标签（可选）<input name="subject" maxlength="70" placeholder="如：阅读、工作" value="${esc(t?.subject||'')}"></label></div><label class="field">关联计划（可选）<select name="projectId"><option value="">不关联</option>${state.projects.map(p=>`<option value="${esc(p.id)}" ${pid===p.id?'selected':''}>${esc(p.title)}</option>`).join('')}</select></label><span class="helper">每周重复日期：</span>${weekdayHtml(t?.days||[0,1,2,3,4,5,6])}<div class="flex-actions"><button class="button primary" type="submit">保存时间段</button>${button('取消','back')}</div></form>`;
 return {h:heading(t?'编辑时间段':'新增时间段','SCHEDULE EDITOR'),b:f,f:'跨午夜安排（例如 23:00 → 07:00）受到支持'};
}
function manageSchedule(){return {h:heading('日程管理','SCHEDULE SETTINGS',button('添加时段','add-time','primary')),b:`<div class="content"><p class="hint">选择要编辑的时间段。每个时段支持自定义周几重复、安排类别和关联计划。</p>${state.schedule.slice().sort((a,b)=>minutes(a.start)-minutes(b.start)).map(t=>`<button type="button" class="item" data-edit-time="${esc(t.id)}"><span class="details"><b>${esc(t.title)}</b><small>${esc(t.start)}–${esc(t.end)} · ${durationText(duration(t))} · ${t.days.length}天/周</small></span><span class="mark">编辑 →</span></button>`).join('')||'<p class="hint">暂无时间段</p>'}<div class="data-tools"><div class="heading-secondary">数据管理</div><div class="flex-actions">${button('导出 JSON 备份','export')}${button('导入 JSON 备份','import')}${button('恢复空白计划','clear','danger')}</div><p class="helper">换浏览器、换网址或者使用 Plash 前建议导出备份；不会自动跨设备同步。</p></div></div>`,f:'所有修改立即保存在本地'};}
function renderProjects(){return {h:heading('我的计划','PROJECTS',button('新建计划','add-project','primary')),b:`<div class="content"><p class="hint">可以创建工作项目、阅读清单、健身计划或任何需要按阶段推进的目标，不限制科目或类型。</p>${state.projects.map(p=>`<button type="button" class="item" data-project="${esc(p.id)}"><span class="details"><b>${esc(p.title)}</b><small>${completedCount(p)} / ${itemCount(p)} 已完成 · ${p.stages.length} 个阶段</small></span><span class="mark">${percent(p)}% →</span></button>`).join('')||'<div class="banner">还没有计划。点击「新建计划」即可开始。</div>'}</div>`,f:'计划和时间表独立管理；可以关联到日程时段'};}
function renderProject(){const p=project(nav.id);if(!p)return renderProjects();return {h:heading(p.title,'PROJECT',button('添加阶段','add-stage')+button('编辑','edit-project')),b:`<div class="content"><div class="banner"><strong>完成 ${completedCount(p)} / ${itemCount(p)} 项</strong><p>进度 ${percent(p)}% · ${p.stages.length} 个阶段</p></div>${p.stages.map((s,i)=>`<button type="button" class="item" data-stage="${esc(s.id)}"><span class="details"><b>${i+1}. ${esc(s.title)}</b><small>${s.items.filter(x=>x.done).length} / ${s.items.length} 项已完成</small></span><span class="mark">→</span></button>`).join('')||'<p class="hint">还没有阶段。添加一个阶段后，可以继续添加可勾选的任务。</p>'}<div class="flex-actions">${button('删除此计划','delete-project','danger')}</div></div>`,f:'进度只根据手动勾选的任务计算'};}
function renderStage(){const p=project(nav.id),s=stage(p,nav.stageId);if(!p||!s)return renderProjects();return {h:heading(s.title,p.title,button('新增任务','add-item')+button('编辑阶段','edit-stage')),b:`<div class="content"><p class="hint">点击任务前面的方框标记完成；再次点击取消完成。</p>${s.items.map(i=>`<button type="button" class="item ${i.done?'done':''}" data-check="${esc(i.id)}" aria-pressed="${i.done}"><span class="circle">${i.done?'✓':''}</span><span class="details"><b>${esc(i.title)}</b></span></button>`).join('')||'<p class="hint">这个阶段还没有任务。</p>'}<div class="flex-actions">${button('删除此阶段','delete-stage','danger')}</div></div>`,f:`${s.items.filter(i=>i.done).length} / ${s.items.length} 项已完成`};}
function editProject(){const p=nav.id?project(nav.id):null;return {h:heading(p?'编辑计划':'新建计划','PROJECT EDITOR'),b:`<form class="content" id="projectForm"><label class="field">计划名称<input required name="title" maxlength="100" placeholder="例如：本月阅读计划" value="${esc(p?.title||'')}"></label><div class="flex-actions"><button class="button primary" type="submit">保存</button>${button('取消','back')}</div></form>`,f:'你可以创建任意数量的个性化计划'};}
function editStage(){const p=project(nav.id),s=stage(p,nav.stageId);return {h:heading(s?'编辑阶段':'添加阶段','STAGE EDITOR'),b:`<form class="content" id="stageForm"><label class="field">阶段名称<input name="title" required maxlength="100" placeholder="例如：第一周" value="${esc(s?.title||'')}"></label><div class="flex-actions"><button class="button primary" type="submit">保存</button>${button('取消','back')}</div></form>`,f:'阶段内可以添加多个任务'};}
function editItem(){return {h:heading('添加任务','TASK EDITOR'),b:`<form class="content" id="itemForm"><label class="field">任务名称<input name="title" required maxlength="200" placeholder="写下具体要完成的一件事"></label><div class="flex-actions"><button class="button primary" type="submit">添加任务</button>${button('取消','back')}</div></form>`,f:'可随时勾选完成状态'};}
function render(){let page;switch(nav.view){case 'slot':page=renderSlot();break;case 'schedule-edit':page=scheduleForm();break;case 'settings':page=manageSchedule();break;case 'projects':page=renderProjects();break;case 'project':page=renderProject();break;case 'stage':page=renderStage();break;case 'project-edit':page=editProject();break;case 'stage-edit':page=editStage();break;case 'item-edit':page=editItem();break;default:page=renderSchedule()}
 el('panelHeading').innerHTML=page.h;el('panelContent').innerHTML=page.b;el('panelFooter').textContent=page.f;el('panelContent').scrollTop=0;renderPreviews();tick();}
function renderPreviews(){let html=state.projects.slice(0,4).map(p=>`<button type="button" class="preview-card" data-project="${esc(p.id)}"><b>${esc(p.title)}</b><small>${completedCount(p)} / ${itemCount(p)} 项 · ${percent(p)}%</small><span class="mini-bar"><i style="width:${percent(p)}%"></i></span></button>`).join('');el('projectsPreview').innerHTML=html||'<div class="empty-preview">添加你的第一个计划，进度会显示在这里。</div>'}
function tick(){let now=new Date();el('timeNow').textContent=`${fmt(now.getHours())}:${fmt(now.getMinutes())}`;el('seconds').textContent=fmt(now.getSeconds());let date=now.toLocaleDateString('zh-CN',{year:'numeric',month:'long',day:'numeric',weekday:'long'});el('fullDate').textContent=date;el('todayText').textContent=date;el('greeting').textContent=now.getHours()<11?'开启清晰的一天':now.getHours()<18?'保持自己的节奏':'给今天一个好收尾';
 let {cur,next}=timeStatus(now);el('activeStatus').textContent=cur?'正在进行':'当前空闲';el('activeTitle').textContent=cur?.t.title||'当前没有计划安排';el('activeRange').textContent=cur?`${cur.t.start} — ${cur.t.end} · ${kindLabel(cur.t.type)}`:'可以安排休息，也可以添加时段';el('endTime').textContent=cur?.t.end||'—';
 let remaining=cur?Math.max(0,Math.ceil((cur.end-now)/1000)):0,elapsed=cur?Math.min(100,Math.max(0,Math.floor(100*(now-cur.start)/(cur.end-cur.start)))):0;
 let hour=Math.floor(remaining/3600),min=Math.floor(remaining%3600/60),sec=remaining%60;let text=cur?(hour?`${fmt(hour)}:${fmt(min)}:${fmt(sec)}`:`${fmt(min)}:${fmt(sec)}`):'--:--';el('countdown').textContent=text;el('countdown').classList.toggle('long',hour>0);el('elapsed').textContent=cur?'本段已进行':'时段进度';el('percent').textContent=elapsed+'%';el('elapsedBar').style.width=elapsed+'%';el('nowCard').dataset.urgency=remaining&&remaining<=600?'urgent':remaining&&remaining<=1800?'soon':'normal';el('nextTitle').textContent=next?`${next.start.toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit',hour12:false})} · ${next.t.title}`:'暂无后续时段';
 if(nav.view==='schedule'&&state.started){let rows=el('panelContent').querySelectorAll('[data-row]');rows.forEach(row=>row.classList.toggle('current',row.dataset.row===cur?.t.id));}
}
function starterDemo(){state.schedule=[
 {id:uid(),start:'08:30',end:'09:00',title:'制定当天计划',type:'work',subject:'计划',projectId:'',days:[0,1,2,3,4,5,6]},
 {id:uid(),start:'09:00',end:'11:00',title:'专注时间',type:'work',subject:'主要任务',projectId:'',days:[0,1,2,3,4,5,6]},
 {id:uid(),start:'11:00',end:'11:15',title:'起身休息',type:'break',subject:'',projectId:'',days:[0,1,2,3,4,5,6]},
 {id:uid(),start:'15:00',end:'16:00',title:'推进个人计划',type:'work',subject:'个人目标',projectId:'',days:[0,1,2,3,4,5,6]},
 {id:uid(),start:'21:00',end:'21:20',title:'复盘与记录',type:'life',subject:'',projectId:'',days:[0,1,2,3,4,5,6]}];
 state.projects=[{id:uid(),title:'示例：一周计划',stages:[{id:uid(),title:'准备阶段',items:[{id:uid(),title:'设定本周重点',done:false},{id:uid(),title:'拆分具体任务',done:false}]},{id:uid(),title:'执行阶段',items:[{id:uid(),title:'完成本周一项关键任务',done:false}]}]}];}
const a=id=>el(id);
function action(name){switch(name){case 'back':return back();case 'start-empty':state.started=true;save();return render();case 'start-demo':state.started=true;starterDemo();save();return render();case 'manage-schedule':return go('settings');case 'add-time':return go('schedule-edit');case 'edit-time':return go('schedule-edit',nav.id);case 'delete-time':if(confirm('确定删除这个时间段？')){state.schedule=state.schedule.filter(x=>x.id!==nav.id);save();go('schedule')}return;
 case 'add-project':return go('project-edit');case 'edit-project':return go('project-edit',nav.id);case 'add-stage':return go('stage-edit',nav.id);case 'edit-stage':return go('stage-edit',nav.id,nav.stageId);case 'add-item':return go('item-edit',nav.id,nav.stageId);
 case 'delete-project':if(confirm('确定删除这个计划及其全部任务？')){state.projects=state.projects.filter(p=>p.id!==nav.id);state.schedule.forEach(t=>{if(t.projectId===nav.id)t.projectId=''});save();go('projects')}return;
 case 'delete-stage':if(confirm('确定删除这一阶段的所有任务？')){const p=project(nav.id);p.stages=p.stages.filter(s=>s.id!==nav.stageId);save();go('project',nav.id)}return;
 case 'export':return exportData();case 'import':return el('importPicker').click();case 'clear':if(confirm('确定清空所有计划和日程？请先导出 JSON 备份。')){state=defaultState();state.started=true;save();go('schedule')}return;
 }}
function exportData(){let blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='zhuri-backup-'+new Date().toISOString().slice(0,10)+'.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('已生成备份文件')}
function handleSubmit(form){let data=new FormData(form);const title=String(data.get('title')||'').trim();if(!title)return toast('请输入名称');
 if(form.id==='scheduleForm'){
  const start=String(data.get('start')),end=String(data.get('end')),days=data.getAll('days').map(Number);if(!validTime(start)||!validTime(end)||start===end)return toast('请输入不同的开始和结束时间');if(!days.length)return toast('至少选择一天');
  const t={id:nav.id||uid(),title,start,end,type:String(data.get('type')||'life'),subject:String(data.get('subject')||'').trim(),projectId:String(data.get('projectId')||''),days};const i=state.schedule.findIndex(x=>x.id===nav.id);if(i<0)state.schedule.push(t);else state.schedule[i]=t;state.started=true;save();go('schedule');toast('时间段已保存');return;
 }
 if(form.id==='projectForm'){let p=project(nav.id);if(p)p.title=title;else state.projects.push({id:uid(),title,stages:[]});save();go('projects');toast('计划已保存');return;}
 if(form.id==='stageForm'){let p=project(nav.id);if(!p)return;let s=stage(p,nav.stageId);if(s)s.title=title;else p.stages.push({id:uid(),title,items:[]});save();go('project',nav.id);toast('阶段已保存');return;}
 if(form.id==='itemForm'){let s=stage(project(nav.id),nav.stageId);if(!s)return;s.items.push({id:uid(),title,done:false});save();go('stage',nav.id,nav.stageId);toast('任务已添加')}
}
el('desk').addEventListener('click',e=>{let b=e.target.closest('button');if(b?.dataset.action)return action(b.dataset.action);if(b?.dataset.project)return go('project',b.dataset.project);if(b?.dataset.stage)return go('stage',nav.id,b.dataset.stage);if(b?.dataset.editTime)return go('schedule-edit',b.dataset.editTime);if(b?.dataset.check){let s=stage(project(nav.id),nav.stageId),i=s?.items.find(i=>i.id===b.dataset.check);if(i){i.done=!i.done;save();render()}return}let row=e.target.closest('[data-row]');if(row)go('slot',row.dataset.row)});
el('desk').addEventListener('keydown',e=>{let row=e.target.closest('[data-row]');if(row&&(e.key==='Enter'||e.key===' ')){e.preventDefault();go('slot',row.dataset.row)}});
el('desk').addEventListener('submit',e=>{if(['scheduleForm','projectForm','stageForm','itemForm'].includes(e.target.id)){e.preventDefault();handleSubmit(e.target)}});
el('allProjects').addEventListener('click',()=>go('projects'));
el('importPicker').addEventListener('change',async e=>{let file=e.target.files?.[0];if(!file)return;try{if(file.size>2*1024*1024)throw Error('文件超过2 MB');let json=JSON.parse(await file.text()),newState=validate(json);if(!confirm('导入将覆盖当前计划。建议先导出备份。确定继续？'))return;state=newState;state.started=true;save();setBlank(state.blankPercent,false);go('schedule');toast('数据导入成功')}catch(err){toast('导入失败：'+err.message)}finally{e.target.value=''}});
const grip=el('resizer');let pointer=null;
function setBlank(x,persist){const width=innerWidth;let max=Math.min(65,Math.max(0,(width-850)/width*100));let v=Math.max(0,Math.min(max,Number.isFinite(+x)?+x:29));state.blankPercent=v;document.documentElement.style.setProperty('--blank-percent',String(v));grip.setAttribute('aria-valuenow',String(Math.round(v)));grip.setAttribute('aria-valuemax',String(Math.round(max)));grip.setAttribute('aria-valuetext','留白宽度 '+Math.round(v)+'%');if(persist)save()}
function dragX(x){setBlank(100*(innerWidth-x)/innerWidth,false)}
grip.addEventListener('pointerdown',e=>{if(e.button!==0)return;pointer=e.pointerId;grip.setPointerCapture(e.pointerId);dragX(e.clientX)});
grip.addEventListener('pointermove',e=>{if(pointer===e.pointerId)dragX(e.clientX)});
function finish(e){if(pointer===e.pointerId){pointer=null;save()}}
grip.addEventListener('pointerup',finish);grip.addEventListener('pointercancel',finish);
grip.addEventListener('dblclick',()=>setBlank(29,true));
grip.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();setBlank(e.key==='Home'?65:e.key==='End'?0:state.blankPercent+(e.key==='ArrowLeft'?1:-1),true)}});
addEventListener('resize',()=>setBlank(state.blankPercent,false));
setBlank(state.blankPercent,false);render();setInterval(tick,1000);
if('serviceWorker' in navigator && (location.protocol==='https:' || location.hostname==='localhost' || location.hostname==='127.0.0.1')){
  navigator.serviceWorker.register('./sw.js').catch(()=>{});
}
})();
