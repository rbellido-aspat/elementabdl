// Eventos GA4 de www.elementabdl.cl: contacto, clics salientes y CTA.
// Nunca envía teléfono, correo ni URLs de WhatsApp a Analytics.
(function () {
  function send() { if (typeof window.gtag === 'function') window.gtag.apply(null, arguments); }

  // quita correos (todo texto con @) y secuencias de 8 o más dígitos con o sin espacios, +, guiones o paréntesis
  function sanitize(s) {
    if (!s) return '';
    s = String(s).replace(/\S*@\S*/g, ' ');
    s = s.replace(/\+?\(?\d[\d\s().\-]*\d/g, function (m) { return m.replace(/\D/g, '').length >= 8 ? ' ' : m; });
    return s.replace(/\s+/g, ' ').trim().slice(0, 100);
  }

  function zone(el) {
    if (el.closest('.wa-float')) return 'flotante';
    if (el.closest('.site-header')) return 'header';
    if (el.closest('.site-footer')) return 'footer';
    if (el.closest('.hero, .intro')) return 'hero';
    if (el.closest('.prods, .contact-grid')) return 'ficha';
    return 'contenido';
  }

  function contactMethod(href) {
    if (/^tel:/i.test(href)) return 'phone';
    if (/^mailto:/i.test(href)) return 'email';
    if (/(wa\.me|whatsapp\.com|^whatsapp:)/i.test(href)) return 'whatsapp';
    return null;
  }

  function put(obj, key, val) { if (val) obj[key] = val; }

  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var where = zone(a);

    var method = contactMethod(href);
    if (method) { send('event', 'contact_click', { method: method, link_location: where }); return; }

    if (a.classList.contains('btn')) {
      var cta = { link_location: where };
      put(cta, 'cta_text', sanitize(a.textContent));
      send('event', 'cta_click', cta);
    }

    var u;
    try { u = new URL(a.href, location.href); } catch (err) { return; }
    if (!/^https?:$/.test(u.protocol) || u.hostname === location.hostname || u.hostname === 'www.elementabdl.cl') return;
    var ev = { outbound: true, link_domain: u.hostname, link_location: where };
    // si la ruta tiene secuencias que parecen teléfono o correo, se envía solo el dominio
    var full = u.origin + u.pathname;
    put(ev, 'link_url', sanitize(full) === full.slice(0, 100) ? full.slice(0, 100) : u.origin + '/');
    put(ev, 'link_text', sanitize(a.textContent || a.getAttribute('aria-label')));
    send('event', 'click', ev);
  }, true);
})();
