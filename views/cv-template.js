function esc(s) {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
}

function buildCvHtml(data) {
  const { name, title, email, phone, loc, li, summary, skills: skillsRaw, photo, exp = [], edu = [], lang = [], proj = [] } = data;
  const skills = (skillsRaw || '').split(',').map(s => s.trim()).filter(Boolean);

  // ── LEFT COLUMN ──────────────────────────────────────────────────────────
  let left = '';

  if (photo) {
    left += `<img src="${photo}" class="cv-photo" alt="Profile photo">`;
  }
  if (summary && summary.trim()) {
    left += `<div class="cv-sec">Profile</div><div class="cv-summary">${esc(summary)}</div>`;
  }
  if (skills.length) {
    left += `<div class="cv-sec">Skills</div><div class="cv-skill-wrap">${skills.map(s => `<span class="cv-skill">${esc(s)}</span>`).join('')}</div>`;
  }

  const activeLangs = lang.filter(e => e.lang);
  if (activeLangs.length) {
    left += `<div class="cv-sec">Languages</div>`;
    activeLangs.forEach(e => {
      left += `<div class="cv-lang-row"><span>${esc(e.lang)}</span><span class="cv-lang-level">${esc(e.level || '')}</span></div>`;
    });
  }

  const activeEdu = edu.filter(e => e.degree || e.inst);
  if (activeEdu.length) {
    left += `<div class="cv-sec">Education</div>`;
    activeEdu.forEach(e => {
      const yr = (e.from || e.to) ? (esc(e.from || '') + (e.to ? ' – ' + esc(e.to) : '')) : '';
      left += `<div class="cv-item"><div class="cv-item-title">${esc(e.degree || '—')}</div><div class="cv-item-sub">${esc(e.inst || '')}</div><div class="cv-item-desc">${yr}</div></div>`;
    });
  }

  // ── RIGHT COLUMN ─────────────────────────────────────────────────────────
  let right = '';

  const activeExp = exp.filter(e => e.title || e.company);
  if (activeExp.length) {
    right += `<div class="cv-sec">Professional Experience</div>`;
    activeExp.forEach(e => {
      const period = (e.from || e.to) ? (esc(e.from || '') + (e.to ? ' – ' + esc(e.to) : '')) : '';
      right += `<div class="cv-item">
        <div class="cv-item-title">${esc(e.title || '—')}</div>
        <div class="cv-item-sub">${esc(e.company || '')}${period ? ' &nbsp;·&nbsp; ' + period : ''}</div>
        <div class="cv-item-desc">${esc(e.desc || '')}</div>
      </div>`;
    });
  }

  const activeProj = proj.filter(e => e.title);
  if (activeProj.length) {
    right += `<div class="cv-sec">Projects &amp; Achievements</div>`;
    activeProj.forEach(e => {
      right += `<div class="cv-item"><div class="cv-item-title">${esc(e.title)}</div><div class="cv-item-desc">${esc(e.desc || '')}</div></div>`;
    });
  }

  // ── CONTACTS ─────────────────────────────────────────────────────────────
  const contacts = [];
  if (email) contacts.push(`<span>${esc(email)}</span>`);
  if (phone) contacts.push(`<span>${esc(phone)}</span>`);
  if (loc)   contacts.push(`<span>${esc(loc)}</span>`);
  if (li)    contacts.push(`<span>${esc(li)}</span>`);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    width: 794px; height: 1123px;
    overflow: hidden;
    font-family: Georgia, Times, 'Times New Roman', serif;
    font-size: 14px; color: #1a1a2e; background: #fff;
  }
  .cv { display: flex; flex-direction: column; width: 794px; height: 1123px; background: #fff; overflow: hidden; }
  .cv-header { background: #185FA5; color: #fff; padding: 28px 32px 22px; flex-shrink: 0; }
  .cv-name { font-size: 28px; font-weight: 700; letter-spacing: .01em; margin-bottom: 5px; }
  .cv-jobtitle { font-size: 14px; opacity: .85; margin-bottom: 16px; font-style: italic; }
  .cv-contacts { display: flex; flex-wrap: wrap; gap: 4px 20px; font-size: 11px; opacity: .9; font-family: Arial, Helvetica, sans-serif; }
  .cv-contacts span::before { content: '• '; opacity: .6; }
  .cv-contacts span:first-child::before { content: ''; }
  .cv-body { display: grid; grid-template-columns: 242px 1fr; flex: 1; overflow: hidden; }
  .cv-left { background: #EBF3FB; padding: 22px 18px 24px 22px; border-right: 3px solid #185FA5; overflow: hidden; }
  .cv-right { padding: 22px 24px 24px; overflow: hidden; }
  .cv-photo { width: 100%; height: auto; display: block; border-radius: 4px; margin-bottom: 16px; }
  .cv-summary { font-size: 10.5px; color: #333; line-height: 1.6; font-style: italic; }
  .cv-skill-wrap { display: flex; flex-wrap: wrap; gap: 5px; }
  .cv-skill { background: #185FA5; color: #fff; font-size: 9.5px; padding: 3px 9px; border-radius: 20px; font-family: Arial, Helvetica, sans-serif; }
  .cv-lang-row { display: flex; justify-content: space-between; align-items: center; font-size: 10.5px; margin-bottom: 5px; font-family: Arial, Helvetica, sans-serif; }
  .cv-lang-level { color: #185FA5; font-weight: 700; font-size: 9.5px; }
  .cv-item { margin-bottom: 11px; }
  .cv-item-title { font-weight: 700; font-size: 11.5px; color: #0C447C; }
  .cv-item-sub { font-size: 10px; color: #378ADD; margin-bottom: 3px; font-family: Arial, Helvetica, sans-serif; }
  .cv-item-desc { font-size: 10px; color: #444; line-height: 1.5; }
  .cv-sec { font-size: 9px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #185FA5; border-bottom: 1.5px solid #185FA5; padding-bottom: 4px; margin-bottom: 10px; margin-top: 18px; font-family: Arial, Helvetica, sans-serif; }
  .cv-sec:first-child { margin-top: 0; }
  .cv-footer { text-align: left; padding: 7px 22px 9px; font-family: Arial, Helvetica, sans-serif; font-size: 8px; color: #185FA5; letter-spacing: .04em; border-top: 0.5px solid #d0e2f3; flex-shrink: 0; }
</style>
</head>
<body>
<div class="cv">
  <div class="cv-header">
    <div class="cv-name">${esc(name || '')}</div>
    <div class="cv-jobtitle">${esc(title || '')}</div>
    <div class="cv-contacts">${contacts.join('')}</div>
  </div>
  <div class="cv-body">
    <div class="cv-left">${left}</div>
    <div class="cv-right">${right}</div>
  </div>
  <div class="cv-footer">Generated with Revamp Design CV Builder &nbsp;·&nbsp; revamp.design</div>
</div>
</body>
</html>`;
}

module.exports = { buildCvHtml };
