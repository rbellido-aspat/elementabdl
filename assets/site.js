(function () {
  // menú móvil
  var t = document.querySelector('.nav-toggle'), nav = document.getElementById('mainnav');
  if (t) t.addEventListener('click', function () {
    var o = nav.classList.toggle('open'); t.setAttribute('aria-expanded', o);
  });
  document.querySelectorAll('.sub-toggle').forEach(function (b) {
    b.addEventListener('click', function () {
      var o = b.parentNode.classList.toggle('open'); b.setAttribute('aria-expanded', o);
    });
  });

  // carrusel de portada
  var s = document.querySelector('[data-slider]');
  if (s) {
    var sl = s.querySelectorAll('.slide'), i = 0, timer;
    var go = function (n) { sl[i].classList.remove('on'); i = (n + sl.length) % sl.length; sl[i].classList.add('on'); };
    var auto = function () { clearInterval(timer); timer = setInterval(function () { go(i + 1); }, 7000); };
    s.querySelector('.sl-prev').addEventListener('click', function () { go(i - 1); auto(); });
    s.querySelector('.sl-next').addEventListener('click', function () { go(i + 1); auto(); });
    auto();
  }

  // galería con visor
  document.querySelectorAll('.gallery').forEach(function (g) {
    var items = Array.prototype.slice.call(g.querySelectorAll('.g-item'));
    items.forEach(function (a, idx) {
      a.addEventListener('click', function (e) {
        e.preventDefault(); var k = idx;
        var lb = document.createElement('div'); lb.className = 'lightbox';
        lb.innerHTML = '<img alt=""><button class="lb-close" aria-label="Cerrar">&times;</button><button class="lb-prev" aria-label="Anterior">&#8249;</button><button class="lb-next" aria-label="Siguiente">&#8250;</button>';
        var img = lb.querySelector('img');
        var show = function () { img.src = items[k].getAttribute('href'); };
        var close = function () { lb.remove(); document.removeEventListener('keydown', key); };
        var key = function (ev) { if (ev.key === 'Escape') close(); if (ev.key === 'ArrowRight') { k = (k + 1) % items.length; show(); } if (ev.key === 'ArrowLeft') { k = (k - 1 + items.length) % items.length; show(); } };
        lb.querySelector('.lb-close').onclick = close;
        lb.querySelector('.lb-prev').onclick = function (ev) { ev.stopPropagation(); k = (k - 1 + items.length) % items.length; show(); };
        lb.querySelector('.lb-next').onclick = function (ev) { ev.stopPropagation(); k = (k + 1) % items.length; show(); };
        lb.addEventListener('click', function (ev) { if (ev.target === lb) close(); });
        document.addEventListener('keydown', key);
        show(); document.body.appendChild(lb);
      });
    });
  });

  // búsqueda
  var box = document.getElementById('results');
  if (box) {
    var q = new URLSearchParams(location.search).get('q') || '';
    var input = document.getElementById('q'); input.value = q;
    if (!q.trim()) return;
    var norm = function (x) { return x.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
    var esc = function (x) { return x.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
    fetch(box.dataset.index).then(function (r) { return r.json(); }).then(function (data) {
      var terms = norm(q).split(/\s+/).filter(Boolean);
      var res = data.map(function (d) {
        var t = norm(d.t), x = norm(d.x), sc = 0;
        for (var j = 0; j < terms.length; j++) {
          if (t.indexOf(terms[j]) < 0 && x.indexOf(terms[j]) < 0) return null;
          sc += (t.indexOf(terms[j]) >= 0 ? 10 : 0) + (x.split(terms[j]).length - 1);
        }
        return { d: d, sc: sc };
      }).filter(Boolean).sort(function (a, b) { return b.sc - a.sc; });
      var c = document.getElementById('count');
      c.textContent = res.length ? res.length + ' ' + c.dataset.results : c.dataset.none;
      box.innerHTML = res.slice(0, 60).map(function (r) {
        var x = r.d.x, p = norm(x).indexOf(terms[0]), start = Math.max(0, p - 80);
        var snip = (start ? '...' : '') + x.substr(start, 240) + '...';
        return '<div class="result"><h3><a href="' + r.d.u + '">' + esc(r.d.t) + '</a></h3><p>' + esc(snip) + '</p></div>';
      }).join('');
    });
  }
})();
