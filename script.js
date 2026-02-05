let isP = {I:1,L:1,A:1}, cur = {I:33000,L:33000,A:34000};

function it() {
    const fcs = ["なし","1","2","3","4","5","6","7","8","9","10"];
    const tiers = ["T7","T8","T9","T10","T11"];
    document.querySelectorAll('[id^="fc"]').forEach(s => { fcs.forEach(f => s.add(new Option("FC "+f,f))); });
    document.querySelectorAll('select[id^="t"]').forEach(s => { tiers.forEach(t => s.add(new Option(t,t))); });
    document.querySelectorAll('[id^="fc"]').forEach(s => s.value = "4");
    document.querySelectorAll('select[id^="t"]').forEach(s => s.value = "T10");
    sy();
}

function toggleEdition() {
    document.body.classList.toggle('junk-theme');
    document.getElementById('editionLabel').innerText = document.body.classList.contains('junk-theme') ? "じゃんくedition" : "るびぃedition";
    calc();
}

function cl(e) { e.value = ""; }
function re(e) { if(e.value==="") e.value="0.0"; sy(); }
function vM(e) { if(e.value < 0) e.value = 0; }
function st(v) { let r = document.getElementById('tr'); r.value = Math.max(0, parseInt(r.value) + v); sy(); }

function setP(i, l, a) {
    ['I','L','A'].forEach(t => { isP[t] = true; document.getElementById('m'+t).innerText = "割合"; document.getElementById('m'+t).classList.add('active'); });
    document.getElementById('iI').value = i; document.getElementById('iL').value = l; document.getElementById('iA').value = a;
    sy();
}

function sy() {
    const tot = parseInt(document.getElementById('tr').value);
    document.getElementById('tDisp').innerText = tot.toLocaleString();
    let sumP = 0;
    ['I','L','A'].forEach(t => { 
        if(isP[t]) cur[t] = Math.floor(tot*(parseFloat(document.getElementById('i'+t).value)||0)/100);
        sumP += Math.round(cur[t]/tot*100);
    });
    document.getElementById('remDisp').innerText = `残り：${100 - sumP}%`;
    ['I','L','A'].forEach(t => { document.getElementById('s'+t).innerText = isP[t] ? `→ ${cur[t].toLocaleString()}` : `(${Math.round(cur[t]/tot*100)}%)`; });
    calc();
}

function tg(t) {
    isP[t] = !isP[t];
    const b = document.getElementById('m'+t), tot = parseInt(document.getElementById('tr').value);
    b.innerText = isP[t]?"割合":"人数"; b.classList.toggle('active', isP[t]);
    document.getElementById('i'+t).value = isP[t]?Math.round(cur[t]/tot*100):cur[t];
    sy();
}

function hi(t) {
    const tot = parseInt(document.getElementById('tr').value), v = parseFloat(document.getElementById('i'+t).value)||0;
    cur[t] = isP[t]?Math.floor(tot*(v/100)):v; sy();
}

function calc() {
    let lb = "<span class='log-head'>1. 基礎ステータス</span>\n";
    let lc = "<span class='log-head'>2. バフ適用係数</span>\n";
    let ld = "<span class='log-head'>3. 各兵種ダメージ</span>\n";
    const tot = parseInt(document.getElementById('tr').value);
    
    const process = (row, key, atkId, kilId) => {
        const fc = document.getElementById('fc'+row).value, t = document.getElementById('t'+row).value,
              b = (SOLDIER_DATA[key][fc] && SOLDIER_DATA[key][fc][t]) ? SOLDIER_DATA[key][fc][t] : SOLDIER_DATA[key]["なし"][t],
              a = parseFloat(document.getElementById(atkId).value)||0, k = parseFloat(document.getElementById(kilId).value)||0;
        const base = b[0] * b[1];
        const coeff = base * (1 + a/100) * (1 + k/100);
        const damage = Math.sqrt(cur[row.toUpperCase()]) * coeff;
        lb += `${key}(${t}/${fc}): ${b[0]}×${b[1]}=${base}\n`;
        lc += `${key}: 係数:${coeff.toFixed(1)}\n`;
        ld += `${key}: ${Math.floor(damage).toLocaleString()}\n`;
        return {dmg: damage, m: coeff};
    };

    const rI = process('i','盾','bAi','bKi'), rL = process('l','槍','bAl','bKl'), rA = process('a','弓','bAa','bKa');
    document.getElementById('resDmg').innerText = Math.floor(rI.dmg + rL.dmg + rA.dmg).toLocaleString();
    document.getElementById('log').innerHTML = lb + lc + ld;
    
    const sQ = rI.m**2 + rL.m**2 + rA.m**2;
    if(sQ>0) {
        const pI = Math.round(rI.m**2/sQ*100), pL = Math.round(rL.m**2/sQ*100), pA = 100 - pI - pL;
        document.getElementById('bT').innerText = `推奨: 盾${pI}% 槍${pL}% 弓${pA}%`;
    }
}

function rs() {
    ['bAi','bKi','bAl','bKl','bAa','bKa'].forEach(id => document.getElementById(id).value="0.0");
    document.getElementById('iI').value=33; document.getElementById('iL').value=33; document.getElementById('iA').value=34;
    document.getElementById('tr').value=100000; sy();
}
window.onload = it;
