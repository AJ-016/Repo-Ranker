let currentRepos = [], activeIdx = null, dragSrcEl = null;

const TAG_ALIASES = {
    "javascript": "JS", "typescript": "TS", "python": "Py", "golang": "Go",
    "rust": "Rs", "csharp": "C#", "cpp": "C++", "postgresql": "Postgres",
    "mongodb": "Mongo", "redis": "Redis", "stargazers_count": "Stars"
};

const UI_GROUP = ["React", "Next.js", "Vue", "HTML", "CSS", "Tailwind", "JS", "TS", "Flutter"];
const UX_GROUP = ["Py", "FastAPI", "Node.js", "Express", "Kotlin", "Java", "SQL", "Go", "Postgres", "Mongo", "Redis"];

function showApp() { document.getElementById('app-container').scrollIntoView({ behavior: 'smooth' }); }
function goHome() { document.getElementById('landing-page').scrollIntoView({ behavior: 'smooth' }); }

function normalizeTagName(tag) {
    const cleanTag = tag.toLowerCase().trim().replace(/\s+/g, "");
    for (const [full, short] of Object.entries(TAG_ALIASES)) {
        if (cleanTag === full) return short;
    }
    return tag.charAt(0).toUpperCase() + tag.slice(1);
}

function sortStackByPriority(stackStr) {
    if (!stackStr) return "Misc";
    let tags = [...new Set(stackStr.split(/[ ,/]+/).filter(Boolean).map(t => normalizeTagName(t)))];
    return tags.sort((a, b) => {
        const getWeight = (tag) => { if (UI_GROUP.includes(tag)) return 1; if (UX_GROUP.includes(tag)) return 2; return 3; };
        const weightA = getWeight(a), weightB = getWeight(b);
        if (weightA !== weightB) return weightA - weightB;
        const fullList = [...UI_GROUP, ...UX_GROUP];
        const indexA = fullList.indexOf(a), indexB = fullList.indexOf(b);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        return a.localeCompare(b);
    }).join(', ');
}

function updatePreview() {
    const preview = document.getElementById('md-preview');
    if (currentRepos.length === 0) {
        preview.innerHTML = '<p style="color:var(--dim); font-style:italic; text-align:center; padding: 40px;">No data to preview.</p>';
        return;
    }
    let htmlContent = `<div class="preview-header">README.md Preview</div><div class="preview-body"><table class="gh-table"><thead><tr><th>Project</th><th>Stack</th><th>Description</th></tr></thead><tbody>`;
    currentRepos.forEach(r => {
        const tagsHtml = r.lang.split(',').filter(Boolean).map(s => `<span class="gh-badge">${s.trim()}</span>`).join('');
        htmlContent += `<tr><td class="project-name">${r.name}</td><td><div class="badge-container">${tagsHtml}</div></td><td class="project-desc">${r.desc}</td></tr>`;
    });
    htmlContent += `</tbody></table></div>`;
    preview.innerHTML = htmlContent;
}

async function fetchData() {
    const user = document.getElementById('username').value;
    if (!user) return;
    const btnIcon = document.querySelector('.stack-section .btn-export i');
    if (btnIcon) btnIcon.className = 'fa-solid fa-spinner fa-spin';
    try {
        const res = await fetch(`/api/fetch/${user}`);
        if (res.status !== 200) throw new Error("User not found");
        let data = await res.json();
        currentRepos = data.map(repo => ({ ...repo, lang: sortStackByPriority(repo.lang) }));
        document.getElementById('empty-state').classList.add('hidden');
        document.getElementById('table-wrapper').classList.remove('hidden');
        renderTable();
    } catch (e) { alert(e.message); }
    finally { if (btnIcon) btnIcon.className = 'fa-solid fa-arrow-right'; }
}

function moveItem(idx, direction) {
    const to = idx + direction;
    if (to < 0 || to >= currentRepos.length) return;
    const item = currentRepos.splice(idx, 1)[0];
    currentRepos.splice(to, 0, item);
    renderTable();
}

function renderTable() {
    const body = document.getElementById('repo-body');
    body.innerHTML = '';
    currentRepos.forEach((repo, idx) => {
        const tr = document.createElement('tr');
        tr.draggable = true; tr.dataset.index = idx;
        tr.ondragstart = (e) => { dragSrcEl = tr; e.dataTransfer.effectAllowed = 'move'; tr.classList.add('dragging'); };
        tr.ondragover = (e) => { e.preventDefault(); return false; };
        tr.ondrop = (e) => {
            e.preventDefault();
            const fromIdx = parseInt(dragSrcEl.dataset.index);
            const toIdx = parseInt(tr.dataset.index);
            if (fromIdx !== toIdx) {
                const item = currentRepos.splice(fromIdx, 1)[0];
                currentRepos.splice(toIdx, 0, item);
                renderTable();
            }
        };
        tr.ondragend = () => { tr.classList.remove('dragging'); document.querySelectorAll('tr').forEach(r => r.classList.remove('drag-over')); };
        tr.innerHTML = `<td style="text-align:center"><div class="move-controls"><button class="arrow-btn" onclick="moveItem(${idx},-1)" ${idx===0?'disabled':''}>▲</button><span class="drag-handle">⠿</span><button class="arrow-btn" onclick="moveItem(${idx},1)" ${idx===currentRepos.length-1?'disabled':''}>▼</button></div></td><td><span class="editable-text" contenteditable="true" oninput="currentRepos[${idx}].name=this.innerText"><strong>${repo.name}</strong></span></td><td><div class="stack-row"><div class="stack-list">${repo.lang.split(',').map(s=>s.trim()).filter(Boolean).map(s=>`<span class="tag">${s}</span>`).join('')}</div><i class="fa-solid fa-pen edit-icon" onclick="openStackModal(${idx})"></i></div></td><td><span class="editable-text" contenteditable="true" oninput="currentRepos[${idx}].desc=this.innerText">${repo.desc}</span></td><td style="text-align:center"><i class="fa-solid fa-trash delete-icon" onclick="currentRepos.splice(${idx},1);renderTable();"></i></td>`;
        body.appendChild(tr);
    });
    updatePreview();
}

function openStackModal(idx) {
    activeIdx = idx;
    const tags = currentRepos[idx].lang.split(',').map(s=>s.trim()).filter(Boolean);
    document.getElementById('modal-stack-display').innerHTML = tags.map(t => `<span class="tag deletable" onclick="removeTag('${t}')">${t} <i class="fa-solid fa-xmark"></i></span>`).join('');
    document.getElementById('stack-modal').classList.remove('hidden');
}

function removeTag(t) {
    let tags = currentRepos[activeIdx].lang.split(',').map(s=>s.trim()).filter(Boolean).filter(tag => tag !== t);
    currentRepos[activeIdx].lang = tags.join(', ') || "Misc";
    openStackModal(activeIdx); renderTable();
}

function applyStack() {
    const inp = document.getElementById('stack-input');
    if (inp.value) { currentRepos[activeIdx].lang = sortStackByPriority(`${currentRepos[activeIdx].lang}, ${inp.value}`); inp.value = ""; openStackModal(activeIdx); renderTable(); }
}

function clearStack() { currentRepos[activeIdx].lang = "Misc"; openStackModal(activeIdx); renderTable(); }
function closeStackModal() { document.getElementById('stack-modal').classList.add('hidden'); }
function sortRepos() { currentRepos.sort((a,b) => b.stars - a.stars); renderTable(); }

function downloadMarkdown() {
    if (currentRepos.length === 0) return alert("Nothing to export!");
    let md = "### 🚀 Top Projects\n\n| Project | Stack | Description |\n| :--- | :--- | :--- |\n";
    currentRepos.forEach(r => {
        const s = r.lang.split(',').filter(Boolean).map(x=>`\`${x.trim()}\``).join(' ');
        md += `| **[${r.name}](${r.url})** | ${s} | ${r.desc} |\n`;
    });
    const blob = new Blob([md], { type: 'text/markdown' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = document.getElementById('file-name').value || "PROJECTS.md"; a.click();
}