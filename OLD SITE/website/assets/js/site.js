(function(){
  var t=document.querySelector('.nav-toggle');
  if(t) t.addEventListener('click',function(){
    var l=document.getElementById('nav-links');
    var open=l.classList.toggle('open');
    t.setAttribute('aria-expanded',open?'true':'false');
  });

  // Work: category filter
  var fs=document.querySelectorAll('[data-filter]');
  if(fs.length) fs.forEach(function(b){
    b.addEventListener('click',function(){
      var v=b.getAttribute('data-filter');
      fs.forEach(function(o){o.setAttribute('aria-pressed',o===b?'true':'false');});
      document.querySelectorAll('[data-category]').forEach(function(c){
        c.hidden = !(v==='All'||c.getAttribute('data-category')===v);
      });
    });
  });

  // Pricing: stage switcher
  var ss=document.querySelectorAll('[data-stage]');
  if(ss.length) ss.forEach(function(b){
    b.addEventListener('click',function(){
      var id=b.getAttribute('data-stage');
      ss.forEach(function(o){
        var on=o.getAttribute('data-stage')===id;
        if(o.classList.contains('tab')) o.setAttribute('aria-selected',on?'true':'false');
        else o.setAttribute('aria-pressed',on?'true':'false');
      });
      document.querySelectorAll('[data-stage-panel]').forEach(function(p){
        p.hidden = p.getAttribute('data-stage-panel')!==id;
      });
    });
  });

  // Location: pin + pill selection
  var ls=document.querySelectorAll('[data-loc]');
  if(ls.length) ls.forEach(function(b){
    b.addEventListener('click',function(){
      var id=b.getAttribute('data-loc');
      document.querySelectorAll('[data-loc]').forEach(function(o){
        var on=o.getAttribute('data-loc')===id;
        if(o.classList.contains('pin')) o.setAttribute('data-active',on?'true':'false');
        else o.setAttribute('aria-pressed',on?'true':'false');
      });
      document.querySelectorAll('[data-loc-card]').forEach(function(c){
        c.hidden = c.getAttribute('data-loc-card')!==id;
      });
      var card=document.querySelector('[data-loc-card="'+id+'"]');
      if(card) card.scrollIntoView===undefined;
    });
  });

  // Location: draw world map (progressive enhancement)
  var svg=document.getElementById('world');
  if(svg&&window.Promise){
    Promise.all([
      import('https://cdn.jsdelivr.net/npm/d3-geo@3/+esm'),
      import('https://cdn.jsdelivr.net/npm/topojson-client@3/+esm'),
      fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(function(r){return r.json();})
    ]).then(function(res){
      var geo=res[0],topo=res[1],world=res[2];
      var proj=geo.geoMercator().scale(140).center([30,25]).translate([400,260]);
      var path=geo.geoPath(proj);
      var g=document.getElementById('geos');
      topo.feature(world,world.objects.countries).features.forEach(function(f){
        var d=path(f); if(!d) return;
        var p=document.createElementNS('http://www.w3.org/2000/svg','path');
        p.setAttribute('d',d); p.setAttribute('class','geo'); g.appendChild(p);
      });
      document.querySelectorAll('.pin').forEach(function(pin){
        var c=pin.getAttribute('data-coords').split(',').map(Number);
        var xy=proj(c);
        pin.setAttribute('transform','translate('+xy[0]+','+xy[1]+')');
        pin.removeAttribute('hidden');
      });
    }).catch(function(e){
      console.warn('Map data unavailable; studio list still available.',e);
      var n=document.getElementById('map-fallback');
      if(n) n.hidden=false;
      var s=document.getElementById('map-shell');
      if(s) s.hidden=true;
    });
  }

  // Contact form
  var form=document.getElementById('contact-form');
  if(form){
    var KEY='30117b51-b50f-4e59-9611-f16935eb19f7';
    var TO='hello@nexyraconsulting.co.uk';
    var setErr=function(name,msg){
      var input=form.elements[name];
      var slot=form.querySelector('[data-err="'+name+'"]');
      if(input) input.setAttribute('aria-invalid',msg?'true':'false');
      if(slot){ slot.textContent=msg||''; slot.hidden=!msg; }
    };
    ['name','email','message'].forEach(function(n){
      var el=form.elements[n];
      if(el) el.addEventListener('input',function(){setErr(n,'');});
    });
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var f={};
      ['name','email','company','service','budget','message'].forEach(function(n){
        f[n]=(form.elements[n]&&form.elements[n].value||'').trim();
      });
      var errors={};
      if(!f.name) errors.name='Full name is required.';
      if(!f.email) errors.email='Email address is required.';
      else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) errors.email='Please enter a valid email address.';
      if(!f.message) errors.message='Please tell us about your project.';
      else if(f.message.length<20) errors.message='Please provide a bit more detail (at least 20 characters).';
      ['name','email','message'].forEach(function(n){setErr(n,errors[n]);});
      if(Object.keys(errors).length){
        var first=form.querySelector('[aria-invalid="true"]');
        if(first) first.focus();
        return;
      }
      var btn=document.getElementById('submit-btn');
      var alertBox=document.getElementById('form-alert');
      alertBox.hidden=true;
      btn.disabled=true; btn.textContent='Sending…';
      fetch('https://api.web3forms.com/submit',{
        method:'POST',
        headers:{'Content-Type':'application/json',Accept:'application/json'},
        body:JSON.stringify({
          access_key:KEY,
          subject:'New enquiry from '+f.name+' — NEXYRA Consulting',
          from_name:'NEXYRA Website',
          name:f.name,email:f.email,
          company:f.company||'Not specified',
          service:f.service||'Not specified',
          budget:f.budget||'Not specified',
          message:f.message,replyto:f.email,botcheck:''
        })
      }).then(function(r){return r.json().then(function(d){return{ok:r.ok,d:d};});})
      .then(function(res){
        if(res.ok&&res.d.success){
          form.hidden=true;
          document.getElementById('form-success').hidden=false;
        } else { throw new Error(res.d.message||'Submission failed'); }
      }).catch(function(err){
        console.error('Form submission error:',err);
        document.getElementById('form-alert-text').textContent='Something went wrong sending your message. Please try again, or email us directly at '+TO;
        alertBox.hidden=false;
      }).finally(function(){
        btn.disabled=false; btn.textContent='Send Message';
      });
    });
    var reset=document.getElementById('form-reset');
    if(reset) reset.addEventListener('click',function(){
      form.reset(); form.hidden=false;
      document.getElementById('form-success').hidden=true;
      ['name','email','message'].forEach(function(n){setErr(n,'');});
    });
  }
})();