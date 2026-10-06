/* HIMMA static demo.
   The pages are HIMMA's own prerendered Next.js screens (from the himma-ui image). This script restores
   their client behaviour with the same logic and classes as the original components, but answers from
   results recorded on the real k3s cluster (July 2026) instead of the in-cluster models, which are offline. */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const page = document.documentElement.dataset.page;
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- recorded on the cluster ---------- */
  const REC = {
    chat: [
      { q: 'Write two short sentences about cloud computing.',
        a: 'Cloud computing allows users to access computing resources over the internet, paying only for what they use. This model enables flexible scalability and cost-efficiency for businesses of all sizes.' },
      { q: 'what is ai infra ?',
        a: 'AI infrastructure refers to the underlying technology and resources that support the development, training, and deployment of artificial intelligence models. It includes hardware, software, data, and network components that work together to enable AI applications. Here’s a breakdown of what typically makes up AI infrastructure: 1. **Hardware**: This includes servers, GPUs (Graphics Processing Units), TPUs (Tensor Processing Units), and other specialized hardware designed to accelerate machine learning computations. 2. **Software**: This encompasses the operating systems, frameworks, libraries, and tools used for developing and deploying AI models. Examples include TensorFlow, PyTorch, Keras, and various cloud-based services like AWS SageMaker, Google AI Platform, and Azure Machine Learning. 3. **Data**: High-quality data is crucial for training effective AI models. Data infrastructure includes data storage solutions, data management tools, and data preprocessing pipelines. 4. **Network**: Efficient data transfer between different components of the AI system is essential. This includes internal network connectivity within data centers and external network connections for data transfer. …' }
    ],
    transcription: { name: 'RPReplay_Final1784333522 2.mp3', seconds: 24.50,
      text: "how you can become a detect of that very engine. Okay, let's really think about this for a second. The whole world is fascinated by what AI models can create and predict, but have you ever stopped to wonder what they all run on? I mean, who is building the massive digital superhighways these things need to operate? And this is where it gets really interesting, especially if you're already in DevOps or cloud engineering. Because guess what? You're not starting from scratch here. You are already standing right at the front door of the next big thing in infrastructure." },
    ocr: { file: 'demo/samples/a4-scan.png', name: 'a4-scan.png', seconds: 3.12,
      text: 'HIMMA Sovereign Al Platform\n\nInternal Meeting Minutes\n\nDate: 18 July 2026\n\nAttendees: Platform team\n\n1. Kubernetes cluster is healthy.\n\n2. Qwen 7B AWQ runs on NVIDIA T4 via vLLM.\n\n3. Whisper transcription runs on CPU workers.\n\n4. OCR digitisation target is under 15 seconds.\n\n5. No company data may leave company infrastructure.\nAction: capture SLA evidence and submit PDF.' },
    vqa: { file: 'demo/samples/chart-tickets.png', name: 'chart-tickets.png',
      q: 'Which department has the most open tickets, and approximately how many?',
      a: 'The department with the most open tickets is Support, with approximately 150 tickets.' }
  };
  const OFFLINE = 'This is a static demo, so the lab cluster and its models are offline — it can only replay results recorded on the real cluster. Try the recorded sample.';

  /* ---------- demo bar ---------- */
  const bar = document.createElement('div');
  bar.className = 'demo-bar'; bar.setAttribute('role', 'note');
  bar.innerHTML = '<b>Live demo</b><span>Results recorded on the HIMMA k3s cluster (Jul 2026) · nothing leaves your browser</span>' +
    '<a href="https://layanharbi9.github.io/#work">Back to portfolio ↗</a>';
  document.body.appendChild(bar);

  /* ---------- theme (same as ThemeProvider) ---------- */
  const SUN = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun text-amber-300" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>';
  const MOON = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon text-himma-blue" aria-hidden="true"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"></path></svg>';
  const themeBtn = $('button[aria-label="Switch to light mode"], button[aria-label="Switch to dark mode"]');
  function applyTheme(t) {
    const d = document.documentElement;
    d.dataset.theme = t; d.classList.toggle('dark', t === 'dark'); d.classList.toggle('light', t === 'light'); d.style.colorScheme = t;
    if (themeBtn) {
      const dark = t === 'dark';
      themeBtn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      themeBtn.innerHTML = (dark ? SUN : MOON) + '<span class="hidden sm:inline">' + (dark ? 'Light' : 'Dark') + '</span>';
    }
  }
  applyTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
  if (themeBtn) themeBtn.addEventListener('click', () => {
    const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('himma-theme', t); } catch (e) {}
    applyTheme(t);
  });

  /* ---------- Info dialog (same content and classes as InfoButton) ---------- */
  const X = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>';
  const STEPS = [['Start the lab cluster', 'Start CPU workers, then the GPU node (T4). Wait until all nodes are Ready.'],
    ['Apply workloads', 'Deploy AI services (assistant / transcription / ocr / vqa) plus the platform UI in himma-frontend.'],
    ['Open the platform', 'Browse to http://<any-node-external-IP>:30080 — this is the only public entrypoint.']];
  const DNS = [['LLM · FR1', 'llm.assistant.svc.cluster.local:8000', 'ClusterIP only'], ['Whisper · FR2', 'whisper.transcription.svc.cluster.local:8000', 'ClusterIP only'],
    ['OCR · FR3', 'ocr.ocr.svc.cluster.local:8080', 'ClusterIP only'], ['VQA · FR4', 'vqa.vqa.svc.cluster.local:8000', 'ClusterIP only · GPU time-shared']];
  const KUBECTL = ['kubectl get svc -n himma-frontend', "kubectl get pods -A | grep -E 'llm|whisper|ocr|vqa|himma-ui'",
    'kubectl port-forward -n himma-frontend svc/himma-ui 3080:3000  # local fallback → http://127.0.0.1:3080'];
  let infoEl = null, lastFocus = null;
  function openInfo() {
    lastFocus = document.activeElement;
    infoEl = document.createElement('div');
    infoEl.className = 'fixed inset-0 z-[9999] overflow-y-auto overscroll-contain';
    infoEl.innerHTML = '<div class="flex min-h-full items-start justify-center p-4 sm:items-center sm:p-6">' +
      '<button type="button" class="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-label="Close dialog" data-close></button>' +
      '<div role="dialog" aria-modal="true" aria-labelledby="himma-info-title" class="relative z-10 my-4 flex w-full max-w-2xl max-h-[min(90vh,880px)] flex-col overflow-hidden rounded-2xl border border-himma-border bg-himma-panel shadow-2xl">' +
      '<div class="flex shrink-0 items-start justify-between gap-3 border-b border-himma-border px-5 py-4 sm:px-6"><div class="min-w-0">' +
      '<h2 id="himma-info-title" class="text-lg font-bold text-himma-text sm:text-xl">How to run &amp; access HIMMA</h2>' +
      '<p class="mt-1 font-[family-name:var(--font-tajawal)] text-sm text-himma-muted">كيف تشغّل وتدخل على هِمَّة</p></div>' +
      '<button type="button" data-close aria-label="Close" class="shrink-0 rounded-lg border border-himma-border p-2 text-himma-muted hover:text-himma-text">' + X + '</button></div>' +
      '<div class="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6">' +
      '<p class="text-sm leading-relaxed text-himma-muted">The HIMMA UI runs inside the k3s cluster and talks to AI models over ClusterIP DNS. Only the platform Service is exposed.</p>' +
      '<p class="mt-1 font-[family-name:var(--font-tajawal)] text-sm text-himma-muted">واجهة هِمَّة تعمل داخل الكلستر وتتصل بالنماذج من الداخل. الخدمة الوحيدة المكشوفة خارجياً هي المنصة نفسها.</p>' +
      '<ol class="mt-5 space-y-3">' + STEPS.map((s, i) => '<li class="rounded-xl border border-himma-border bg-himma-input p-3 sm:p-4"><div class="text-sm font-semibold text-himma-text">' + (i + 1) + '. ' + esc(s[0]) + '</div><p class="mt-1 text-sm leading-relaxed text-himma-muted">' + esc(s[1]) + '</p></li>').join('') + '</ol>' +
      '<div class="mt-6"><h3 class="text-sm font-semibold uppercase tracking-wider text-himma-teal">Public port (only this)</h3><div class="mt-2 overflow-x-auto rounded-xl border border-himma-border"><table class="w-full min-w-[420px] text-left text-sm"><thead class="bg-himma-input text-himma-muted"><tr><th class="px-3 py-2 font-medium">Service</th><th class="px-3 py-2 font-medium">Port</th><th class="px-3 py-2 font-medium">Note</th></tr></thead>' +
      '<tbody><tr class="border-t border-himma-border"><td class="px-3 py-2 text-himma-text">HIMMA Platform (UI)</td><td class="px-3 py-2 font-mono text-himma-blue">30080</td><td class="px-3 py-2 text-himma-muted">NodePort — employee / instructor access</td></tr></tbody></table></div>' +
      '<p class="mt-2 text-xs text-himma-muted">Example: <code class="break-all text-himma-text">http://&lt;node-ip&gt;:30080</code></p></div>' +
      '<div class="mt-6"><h3 class="text-sm font-semibold uppercase tracking-wider text-himma-teal">Internal model endpoints (ClusterIP)</h3><div class="mt-2 space-y-2">' +
      DNS.map(d => '<div class="rounded-xl border border-himma-border bg-himma-input px-3 py-2 text-sm"><div class="font-medium text-himma-text">' + esc(d[0]) + '</div><div class="mt-0.5 break-all font-mono text-xs text-himma-blue">' + esc(d[1]) + '</div><div class="mt-0.5 text-xs text-himma-muted">' + esc(d[2]) + '</div></div>').join('') + '</div></div>' +
      '<div class="mt-6 pb-2"><h3 class="text-sm font-semibold uppercase tracking-wider text-himma-teal">Useful kubectl</h3><div class="mt-2 space-y-2">' +
      KUBECTL.map(k => '<code class="block overflow-x-auto rounded-lg border border-himma-border bg-himma-input px-3 py-2 text-xs text-himma-text">' + esc(k) + '</code>').join('') + '</div></div>' +
      '</div></div></div>';
    document.body.appendChild(infoEl); document.body.style.overflow = 'hidden';
    infoEl.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeInfo(); });
    $('[data-close][aria-label="Close"]', infoEl).focus();
  }
  function closeInfo() { if (!infoEl) return; infoEl.remove(); infoEl = null; document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); }
  const infoBtn = $('button[aria-label="Platform access information"]');
  if (infoBtn) infoBtn.addEventListener('click', openInfo);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeInfo(); closeMenu(); } });

  /* ---------- mobile menu (same as AppShell) ---------- */
  let menuEl = null;
  const menuBtn = $('button[aria-label="Open menu"]');
  function closeMenu() { if (menuEl) { menuEl.remove(); menuEl = null; } }
  if (menuBtn) menuBtn.addEventListener('click', () => {
    const aside = $('aside'); if (!aside) return;
    menuEl = document.createElement('div');
    menuEl.className = 'fixed inset-0 z-40 md:hidden';
    menuEl.innerHTML = '<button type="button" class="absolute inset-0 bg-black/50" aria-label="Close menu"></button><div class="relative z-10 h-full w-72 shadow-2xl"></div>';
    menuEl.lastChild.appendChild(aside.cloneNode(true));
    menuEl.firstChild.addEventListener('click', closeMenu);
    document.body.appendChild(menuEl);
  });

  /* ---------- dashboard: service monitoring snapshot ---------- */
  if (page === 'index') {
    const DOT = { healthy: 'bg-himma-healthy shadow-[0_0_8px_rgba(34,197,94,0.55)] animate-pulse-soft', down: 'bg-red-500' };
    const snap = { 'LLM Service': 'healthy', 'Whisper Service': 'healthy', 'OCR Service': 'healthy', 'VQA Service': 'down' };
    document.querySelectorAll('.grid .rounded-xl.bg-himma-input').forEach(card => {
      const name = card.querySelector('.truncate.text-sm'); if (!name || !(name.textContent in snap)) return;
      const st = snap[name.textContent], dot = card.querySelector('span.rounded-full'), label = card.querySelector('.mt-3');
      dot.className = 'h-2.5 w-2.5 shrink-0 rounded-full ' + DOT[st];
      label.textContent = st === 'healthy' ? 'Healthy' : 'Down';
      card.title = st === 'down' ? 'Recorded snapshot: VQA was scaled down so the LLM could keep the single T4 (GPU time-share).' : 'Recorded snapshot from the live cluster';
    });
  }

  /* ---------- AI Assistant ---------- */
  if (page === 'assistant') {
    const list = $('main .himma-card .flex-1'), form = $('main .himma-card form'), input = $('input', form), send = $('button', form);
    let busy = false;
    const bubble = (role, text) => {
      const d = document.createElement('div');
      d.className = role === 'assistant'
        ? 'max-w-[85%] rounded-2xl rounded-tl-sm border border-himma-border bg-himma-input px-4 py-3 text-sm text-himma-text'
        : 'ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-gradient-to-r from-himma-blue to-himma-purple px-4 py-3 text-sm text-white';
      d.textContent = text; list.appendChild(d); list.scrollTop = list.scrollHeight; return d;
    };
    const sync = () => { send.disabled = busy || !input.value.trim(); send.textContent = busy ? '…' : 'Send'; input.disabled = busy; };
    input.addEventListener('input', sync);
    const chips = document.createElement('div');
    chips.className = 'demo-chips text-himma-text';
    chips.innerHTML = '<span class="demo-note">Recorded prompts:</span>' + REC.chat.map((c, i) => '<button type="button" class="demo-chip" data-i="' + i + '">' + esc(c.q) + '</button>').join('');
    form.parentNode.insertBefore(chips, form);
    chips.addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (!b || busy) return; input.value = REC.chat[+b.dataset.i].q; sync(); form.requestSubmit(); });
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const q = input.value.trim(); if (!q || busy) return;
      bubble('user', q); input.value = ''; busy = true; sync();
      chips.querySelectorAll('button').forEach(b => b.disabled = true);
      const out = bubble('assistant', '…');
      const hit = REC.chat.find(c => c.q.toLowerCase().replace(/\s+/g, ' ') === q.toLowerCase().replace(/\s+/g, ' '));
      await wait(750);                                 // measured time to first token
      if (!hit) { out.textContent = OFFLINE; }
      else {                                           // replay at the measured ~47 tokens/s (~4 chars per token)
        out.textContent = '';
        const words = hit.a.split(/(\s+)/);
        for (const w of words) { out.textContent += w; list.scrollTop = list.scrollHeight; await wait(w.trim() ? 85 : 0); }
      }
      busy = false; sync(); chips.querySelectorAll('button').forEach(b => b.disabled = false); input.focus();
    });
    sync();
  }

  /* ---------- shared: file pages ---------- */
  async function sampleInto(input, url, name) {
    const blob = await (await fetch(url)).blob();
    const dt = new DataTransfer(); dt.items.add(new File([blob], name, { type: blob.type || 'application/octet-stream' }));
    input.files = dt.files; input.dispatchEvent(new Event('change', { bubbles: true }));
  }
  function fileForm(opts) {
    const form = $('main form.himma-card'), file = $('input[type=file]', form), btn = $('button[type=submit]', form);
    const q = form.querySelector('input:not([type=file])');
    const sampleLabel = '\u2193 Use the recorded sample \u00b7 ' + opts.sampleName;
    let busy = false, useSample = false, loadingSample = false;
    const sync = () => {
      btn.disabled = busy || !(useSample || file.files.length) || !!(q && !q.value.trim());
      btn.textContent = busy ? opts.busyLabel : opts.label;
    };
    const sBtn = document.createElement('button');
    sBtn.type = 'button'; sBtn.className = 'demo-sample text-himma-teal'; sBtn.textContent = sampleLabel;
    file.after(sBtn);
    let preview = null;
    if (opts.preview) { preview = document.createElement('img'); preview.className = 'demo-preview'; preview.alt = ''; preview.hidden = true; sBtn.after(preview); }
    const results = [];
    const clear = () => results.splice(0).forEach(n => n.remove());
    const add = html => { const t = document.createElement('div'); t.innerHTML = html; const n = t.firstChild; form.appendChild(n); results.push(n); return n; };
    file.addEventListener('change', () => {
      if (!loadingSample) { useSample = false; sBtn.textContent = sampleLabel; }
      const f = file.files[0];
      if (preview) { preview.hidden = !f || !(f.type || '').startsWith('image/'); if (!preview.hidden) preview.src = URL.createObjectURL(f); }
      clear(); sync();
    });
    sBtn.addEventListener('click', async () => {
      if (busy) return;
      useSample = true; sBtn.textContent = '\u2713 Recorded sample selected \u00b7 ' + opts.sampleName;
      if (opts.url) { loadingSample = true; try { await sampleInto(file, opts.url, opts.sampleName); } finally { loadingSample = false; } }
      if (q && opts.question) q.value = opts.question;
      clear(); sync();
    });
    if (q) q.addEventListener('input', sync);
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (busy || btn.disabled) return;
      busy = true; clear(); sync();
      await wait(useSample ? opts.replayMs : 900);
      if (!useSample) add('<p class="text-xs text-red-300">' + esc(OFFLINE) + '</p>');
      else if (q && opts.question && q.value.trim().toLowerCase() !== opts.question.toLowerCase())
        add('<p class="text-xs text-red-300">This demo can only replay the question asked on the cluster: \u201c' + esc(opts.question) + '\u201d</p>');
      else opts.render(add);
      busy = false; sync();
    });
    sync();
  }

  if (page === 'transcription') fileForm({
    label: 'Transcribe', busyLabel: 'Transcribing…', sampleName: REC.transcription.name, replayMs: 2400,
    render: add => {
      add('<p class="text-xs text-himma-teal">Completed in ' + REC.transcription.seconds.toFixed(2) + 's <span class="demo-note">(recorded run on the cluster)</span></p>');
      add('<pre class="whitespace-pre-wrap rounded-xl border border-himma-border bg-himma-input p-4 text-sm text-himma-text">' + esc(REC.transcription.text) + '</pre>');
    }
  });
  if (page === 'ocr') fileForm({
    label: 'Extract text', busyLabel: 'Digitising…', sampleName: REC.ocr.name, url: REC.ocr.file, preview: true, replayMs: 1600,
    render: add => {
      add('<p class="text-xs text-himma-teal">Completed in ' + REC.ocr.seconds.toFixed(2) + 's <span class="demo-note">(recorded run on the cluster)</span></p>');
      add('<pre class="whitespace-pre-wrap rounded-xl border border-himma-border bg-himma-input p-4 text-sm text-himma-text">' + esc(REC.ocr.text) + '</pre>');
    }
  });
  if (page === 'vqa') fileForm({
    label: 'Ask', busyLabel: 'Thinking…', sampleName: REC.vqa.name, url: REC.vqa.file, preview: true, question: REC.vqa.q, replayMs: 1800,
    render: add => add('<div class="rounded-xl border border-himma-border bg-himma-input p-4 text-sm text-himma-text">' + esc(REC.vqa.a) + '</div>')
  });
})();
