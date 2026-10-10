(function(){
  // mobile nav
  var t=document.querySelector('.nav-toggle'), l=document.getElementById('nav-links');
  if(t&&l){
    var ico=t.querySelector('svg');
    t.addEventListener('click',function(){
      var open=l.getAttribute('data-open')!=='true';
      l.setAttribute('data-open',open?'true':'false');
      t.setAttribute('aria-expanded',open?'true':'false');
      ico.innerHTML=open
        ?'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'
        :'<path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/>';
    });
  }

  // work filter
  var fs=document.querySelectorAll('[data-filter]');
  fs.forEach(function(b){
    b.addEventListener('click',function(){
      var v=b.getAttribute('data-filter');
      fs.forEach(function(o){o.setAttribute('aria-pressed',o===b?'true':'false');});
      document.querySelectorAll('[data-category]').forEach(function(c){
        c.hidden=!(b.hasAttribute('data-filter-all')||v==='All'||c.getAttribute('data-category')===v);
      });
    });
  });

  // pricing stage tabs
  var ss=document.querySelectorAll('[data-stage]');
  ss.forEach(function(b){
    b.addEventListener('click',function(){
      var id=b.getAttribute('data-stage');
      ss.forEach(function(o){o.setAttribute('aria-selected',o.getAttribute('data-stage')===id?'true':'false');});
      document.querySelectorAll('[data-stage-panel]').forEach(function(p){
        p.hidden=p.getAttribute('data-stage-panel')!==id;
      });
    });
  });

  // location studios
  var ls=document.querySelectorAll('[data-loc]');
  ls.forEach(function(b){
    b.addEventListener('click',function(){
      var id=b.getAttribute('data-loc');
      document.querySelectorAll('[data-loc]').forEach(function(o){
        var on=o.getAttribute('data-loc')===id;
        if(o.classList.contains('pin')) o.setAttribute('data-active',on?'true':'false');
        else o.setAttribute('aria-pressed',on?'true':'false');
      });
      document.querySelectorAll('[data-loc-panel]').forEach(function(p){
        p.hidden=p.getAttribute('data-loc-panel')!==id;
      });
    });
  });

  // world map
  var svg=document.getElementById('world');
  if(svg){
    Promise.all([
      import('https://cdn.jsdelivr.net/npm/d3-geo@3/+esm'),
      import('https://cdn.jsdelivr.net/npm/topojson-client@3/+esm'),
      fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(function(r){return r.json();})
    ]).then(function(res){
      var geo=res[0],topo=res[1],world=res[2];
      var proj=geo.geoMercator().scale(140).center([30,25]).translate([400,260]);
      var path=geo.geoPath(proj), g=document.getElementById('geos');
      topo.feature(world,world.objects.countries).features.forEach(function(f){
        var d=path(f); if(!d) return;
        var p=document.createElementNS('http://www.w3.org/2000/svg','path');
        p.setAttribute('d',d); p.setAttribute('class','geo'); g.appendChild(p);
      });
      document.querySelectorAll('.pin').forEach(function(pin){
        var c=pin.getAttribute('data-coords').split(',').map(Number), xy=proj(c);
        pin.setAttribute('transform','translate('+xy[0]+','+xy[1]+')');
        pin.removeAttribute('hidden');
      });
    }).catch(function(e){
      console.warn('Map data unavailable; studio details still listed.',e);
      var s=document.getElementById('map-shell'); if(s) s.hidden=true;
      var n=document.getElementById('map-fallback'); if(n) n.hidden=false;
    });
  }

  // contact form
  var form=document.getElementById('contact-form');
  if(form){
    var KEY='30117b51-b50f-4e59-9611-f16935eb19f7', TO='hello@nexyraconsulting.co.uk';
    var setErr=function(n,m){
      var el=form.elements[n], slot=form.querySelector('[data-err="'+n+'"]');
      if(el) el.setAttribute('aria-invalid',m?'true':'false');
      if(slot){slot.textContent=m||''; slot.hidden=!m;}
    };
    ['name','email','message'].forEach(function(n){
      var el=form.elements[n];
      if(el) el.addEventListener('input',function(){setErr(n,'');});
    });
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var f={};
      ['name','email','company','service','budget','message'].forEach(function(n){
        f[n]=((form.elements[n]&&form.elements[n].value)||'').trim();
      });
      var errs={};
      if(!f.name) errs.name='Full name is required.';
      if(!f.email) errs.email='Email address is required.';
      else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) errs.email='Please enter a valid email address.';
      if(!f.message) errs.message='Please tell us about your project.';
      else if(f.message.length<20) errs.message='Please provide a bit more detail (at least 20 characters).';
      ['name','email','message'].forEach(function(n){setErr(n,errs[n]);});
      if(Object.keys(errs).length){
        var first=form.querySelector('[aria-invalid="true"]'); if(first) first.focus();
        return;
      }
      var btn=document.getElementById('submit-btn'), box=document.getElementById('form-alert');
      box.hidden=true; btn.disabled=true; btn.style.opacity='.45'; btn.textContent='Sending…';
      fetch('https://api.web3forms.com/submit',{
        method:'POST',
        headers:{'Content-Type':'application/json',Accept:'application/json'},
        body:JSON.stringify({
          access_key:KEY,
          subject:'New enquiry from '+f.name+': NEXYRA Consulting',
          from_name:'NEXYRA Website',
          name:f.name,email:f.email,
          company:f.company||'Not specified',
          service:f.service||'Not specified',
          budget:f.budget||'Not specified',
          message:f.message,replyto:f.email,botcheck:''
        })
      }).then(function(r){return r.json().then(function(d){return{ok:r.ok,d:d};});})
      .then(function(res){
        if(res.ok&&res.d.success){form.hidden=true;document.getElementById('form-success').hidden=false;}
        else throw new Error(res.d.message||'Submission failed');
      }).catch(function(err){
        console.error('Form submission error:',err);
        document.getElementById('form-alert-text').textContent='Something went wrong sending your message. Please try again, or email us directly at '+TO;
        box.hidden=false;
      }).finally(function(){
        btn.disabled=false; btn.style.opacity='1'; btn.textContent='Send Message';
      });
    });
    var rs=document.getElementById('form-reset');
    if(rs) rs.addEventListener('click',function(){
      form.reset(); form.hidden=false;
      document.getElementById('form-success').hidden=true;
      ['name','email','message'].forEach(function(n){setErr(n,'');});
    });
  }

  // insight topic filter + modal
  var insData=document.getElementById('ins-data');
  if(insData){
    var posts={}; JSON.parse(insData.textContent).forEach(function(p){posts[p.id]=p;});
    var tfs=document.querySelectorAll('[data-topic-filter]');
    tfs.forEach(function(b){
      b.addEventListener('click',function(){
        var v=b.getAttribute('data-topic-filter');
        tfs.forEach(function(o){o.setAttribute('aria-pressed',o===b?'true':'false');});
        document.querySelectorAll('[data-topic]').forEach(function(c){
          c.hidden=!(b.hasAttribute('data-topic-all')||c.getAttribute('data-topic')===v);
        });
      });
    });
    var ov=document.getElementById('ins-overlay'), sheet=document.getElementById('ins-sheet'), lastFocus=null;
    var openPost=function(id){
      var p=posts[id]; if(!p) return;
      lastFocus=document.activeElement;
      document.getElementById('ins-hero').style.backgroundImage="url('../assets/img/"+p.img+"')";
      document.getElementById('ins-hero').setAttribute('aria-label',p.title);
      document.getElementById('ins-topic').textContent=p.topic;
      document.getElementById('ins-title').textContent=p.title;
      document.getElementById('ins-meta').textContent=p.meta;
      document.getElementById('ins-lead').textContent=p.ex;
      document.getElementById('ins-article').innerHTML=p.html;
      ov.hidden=false; ov.scrollTop=0;
      document.body.style.overflow='hidden';
      document.getElementById('ins-close').focus();
    };
    var closePost=function(){
      ov.hidden=true; document.body.style.overflow='';
      if(lastFocus&&lastFocus.focus) lastFocus.focus();
    };
    document.querySelectorAll('[data-post]').forEach(function(b){
      b.addEventListener('click',function(){openPost(b.getAttribute('data-post'));});
    });
    document.getElementById('ins-close').addEventListener('click',closePost);
    document.querySelectorAll('[data-ins-close]').forEach(function(b){b.addEventListener('click',closePost);});
    ov.addEventListener('click',function(e){if(!sheet.contains(e.target)) closePost();});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!ov.hidden) closePost();});
  }
})();