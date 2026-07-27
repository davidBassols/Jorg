/* =========================================================================
   D&D Character Sheet — offline app logic (vanilla JS)
   Reads window.CHARACTER from character-data.js and renders everything.
   All modifiers are calculated live from the ability scores.
   ========================================================================= */
;(() => {
  "use strict"

  const C = window.CHARACTER
  if (!C) {
    document.body.innerHTML = "<p style='padding:20px'>Could not find character data. Make sure character-data.js is present.</p>"
    return
  }

  /* ---------- Working state (live ability scores + play state) ---------- */
  // Ability scores start from the JSON and can be nudged in the UI (temporary).
  const abilities = { ...C.abilities }

  // Play state (current HP / temp HP / used spell slots) persists across reloads.
  const STORE_KEY = "dnd-sheet:" + (C.name || "character")
  const usedSlots = {} // { level: numberUsed }
  let currentHp = C.maxHp
  let tempHp = 0
  let equippedArmorIndex = (C.armor || []).findIndex((a) => a.equipped)
  let equippedShieldIndex = (C.shields || []).findIndex((s) => s.equipped)

  loadState()

  /* ---------- Helpers ---------- */
  const SKILL_MAP = {
    acrobatics: { ability: "dex", label: "Acrobacias" },
    animalHandling: { ability: "wis", label: "Trato con animales" },
    arcana: { ability: "int", label: "Arcano" },
    athletics: { ability: "str", label: "Atletismo" },
    deception: { ability: "cha", label: "Deception" },
    history: { ability: "int", label: "History" },
    insight: { ability: "wis", label: "Insight" },
    intimidation: { ability: "cha", label: "Intimidation" },
    investigation: { ability: "int", label: "Investigation" },
    medicine: { ability: "wis", label: "Medicine" },
    nature: { ability: "int", label: "Nature" },
    perception: { ability: "wis", label: "Perception" },
    performance: { ability: "cha", label: "Performance" },
    persuasion: { ability: "cha", label: "Persuasion" },
    religion: { ability: "int", label: "Religion" },
    sleightOfHand: { ability: "dex", label: "Sleight of Hand" },
    stealth: { ability: "dex", label: "Stealth" },
    survival: { ability: "wis", label: "Survival" },
  }
  const ABILITY_ORDER = ["str", "dex", "con", "int", "wis", "cha"]
  const ABILITY_LABEL = { str: "Fuerza", dex: "Destreza", con: "Constitucion", int: "Inteligencia", wis: "Sabiduria", cha: "Carisma" }

  const mod = (score) => Math.floor((score - 10) / 2)
  const fmt = (n) => (n >= 0 ? "+" + n : "" + n)
  const pb = C.proficiencyBonus || 2

  function loadState() {
    try {
      const raw = localStorage.getItem(STORE_KEY)
      if (!raw) return
      const s = JSON.parse(raw)
      if (typeof s.currentHp === "number") currentHp = s.currentHp
      if (typeof s.tempHp === "number") tempHp = s.tempHp
      if (s.usedSlots) Object.assign(usedSlots, s.usedSlots)
    } catch (e) {
      console.log("[v0] Could not load saved state:", e.message)
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ currentHp, tempHp, usedSlots }))
    } catch (e) {
      console.log("[v0] Could not save state:", e.message)
    }
  }

  /* ---------- Header ---------- */
  function renderHeader() {
    document.getElementById("charName").textContent = C.name || "Character"
    document.getElementById("charSubtitle").textContent =
      [C.race, C.background, C.alignment].filter(Boolean).join(" • ")
    const badges = document.getElementById("headerBadges")
    badges.innerHTML = ""
    const items = [
      { l: "Nivel", v: C.level },
      { l: "Clase", v: C.class },
      { l: "Especialista", v: C.subclass },
    ]
    items.forEach((i) => {
      const b = document.createElement("span")
      b.className = "badge"
      b.innerHTML = `${i.l} <strong>${i.v}</strong>`
      badges.appendChild(b)
    })
  }

  /* ---------- Abilities ---------- */
  function renderAbilities() {
    const grid = document.getElementById("abilitiesGrid")
    grid.innerHTML = ""
    ABILITY_ORDER.forEach((key) => {
      const score = abilities[key]
      const cell = document.createElement("div")
      cell.className = "ability"
      cell.innerHTML = `
        <div class="label">${ABILITY_LABEL[key]}</div>
        <div class="mod" id="mod-${key}">${fmt(mod(score))}</div>
        <div class="score-static" id="score-${key}">${score}</div>`
      grid.appendChild(cell)
    })
  }

  /* ---------- Saves & Skills ---------- */
  function renderSaves() {
    const list = document.getElementById("savesList")
    list.innerHTML = ""
    ABILITY_ORDER.forEach((key) => {
      const prof = (C.savingThrowProficiencies || []).includes(key)
      const total = mod(abilities[key]) + (prof ? pb : 0)
      const li = document.createElement("li")
      li.innerHTML = `
        <span class="name"><span class="dot ${prof ? "filled" : ""}"></span>${ABILITY_LABEL[key]}</span>
        <span class="val">${fmt(total)}</span>`
      list.appendChild(li)
    })
  }

  function renderSkills() {
    const list = document.getElementById("skillsList")
    list.innerHTML = ""
    Object.keys(SKILL_MAP)
      .sort((a, b) => SKILL_MAP[a].label.localeCompare(SKILL_MAP[b].label))
      .forEach((key) => {
        const info = SKILL_MAP[key]
        const prof = (C.skillProficiencies || []).includes(key)
        const exp = (C.skillExpertise || []).includes(key)
        const bonus = mod(abilities[info.ability]) + (exp ? pb * 2 : prof ? pb : 0)
        const li = document.createElement("li")
        li.innerHTML = `
          <span class="name">
            <span class="dot ${exp ? "expertise" : prof ? "filled" : ""}"></span>
            ${info.label} <span class="abbr">${info.ability}</span>
          </span>
          <span class="val">${fmt(bonus)}</span>`
        list.appendChild(li)
      })
  }

  /* ---------- Combat: AC, initiative, weapons ---------- */
  function computeAC() {
    const dexMod = mod(abilities.dex)
    let base = 10 + dexMod
    let label = "Unarmored (10 + Dex)"
    const armor = C.armor && C.armor[equippedArmorIndex]
    if (armor) {
      if (armor.category === "light") {
        base = armor.baseAC + dexMod
        label = `${armor.name} (${armor.baseAC} + Dex ${fmt(dexMod)})`
      } else if (armor.category === "medium") {
        const capped = Math.min(dexMod, 2)
        base = armor.baseAC + capped
        label = `${armor.name} (${armor.baseAC} + Dex ${fmt(capped)}, max +2)`
      } else {
        base = armor.baseAC
        label = `${armor.name} (${armor.baseAC}, no Dex)`
      }
    }
    let shieldBonus = 0
    const shield = C.shields && C.shields[equippedShieldIndex]
    if (shield) {
      shieldBonus = shield.acBonus
      label += ` + ${shield.name} (${fmt(shield.acBonus)})`
    }
    return { total: base + shieldBonus, label }
  }

  function renderCombatTop() {
    const ac = computeAC()
    document.getElementById("acValue").textContent = ac.total
    document.getElementById("acBreakdown").textContent = ac.label
    document.getElementById("initValue").textContent = fmt(mod(abilities.dex) + (C.initiativeBonus || 0))
    document.getElementById("speedValue").textContent = C.speed || 30
    document.getElementById("pbValue").textContent = fmt(pb)
  }

  function renderGearSelectors() {
    const armorSel = document.getElementById("armorSelect")
    const shieldSel = document.getElementById("shieldSelect")
    armorSel.innerHTML = '<option value="-1">None (Unarmored)</option>'
    ;(C.armor || []).forEach((a, i) => {
      const opt = document.createElement("option")
      opt.value = i
      opt.textContent = `${a.name} — base ${a.baseAC} (${a.category})`
      if (i === equippedArmorIndex) opt.selected = true
      armorSel.appendChild(opt)
    })
    shieldSel.innerHTML = '<option value="-1">None</option>'
    ;(C.shields || []).forEach((s, i) => {
      const opt = document.createElement("option")
      opt.value = i
      opt.textContent = `${s.name} (${fmt(s.acBonus)} AC)`
      if (i === equippedShieldIndex) opt.selected = true
      shieldSel.appendChild(opt)
    })
    armorSel.addEventListener("change", () => {
      equippedArmorIndex = Number(armorSel.value)
      renderCombatTop()
    })
    shieldSel.addEventListener("change", () => {
      equippedShieldIndex = Number(shieldSel.value)
      renderCombatTop()
    })
  }

  function weaponAbilityMod(w) {
    // Determine which ability governs this weapon.
    if (w.useIntForAttack) return { key: "int", mod: mod(abilities.int) }
    if (w.finesse) {
      // best of str/dex
      const s = mod(abilities.str)
      const d = mod(abilities.dex)
      return d >= s ? { key: "dex", mod: d } : { key: "str", mod: s }
    }
    return { key: w.ability, mod: mod(abilities[w.ability]) }
  }

  function renderWeapons() {
    const body = document.getElementById("weaponsBody")
    body.innerHTML = ""
    ;(C.weapons || []).forEach((w) => {
      const abil = weaponAbilityMod(w)
      const bonus = w.bonus || 0
      const attack = abil.mod + (w.proficient ? pb : 0) + bonus
      const dmgMod = abil.mod + bonus
      const dmg = `${w.damageDice}${dmgMod !== 0 ? " " + fmt(dmgMod) : ""} ${w.damageType || ""}`.trim()
      const props = (w.properties || []).map((p) => `<span class="tag">${p}</span>`).join("")
      const tr = document.createElement("tr")
      tr.innerHTML = `
        <td>
          <strong>${w.name}</strong>
          <div class="s-meta" style="font-size:.72rem;color:var(--muted)">
            ${abil.key.toUpperCase()}${w.useIntForAttack ? " (Battle Ready)" : ""}${w.proficient ? " • proficient" : ""}
          </div>
        </td>
        <td><span class="attack">${fmt(attack)}</span></td>
        <td>${dmg}</td>
        <td>${w.range || "—"}</td>
        <td>${props || "—"}</td>`
      body.appendChild(tr)
    })
  }

  /* ---------- Hit points ---------- */
  function renderHp() {
    const max = C.maxHp
    currentHp = Math.max(0, Math.min(currentHp, max))
    document.getElementById("hpCurrent").textContent = currentHp
    document.getElementById("hpMax").textContent = max
    document.getElementById("hpTemp").textContent = tempHp > 0 ? `(+${tempHp} temp)` : ""
    const pct = max > 0 ? (currentHp / max) * 100 : 0
    document.getElementById("hpBar").style.width = pct + "%"
    const slider = document.getElementById("hpSlider")
    slider.max = max
    slider.value = currentHp
  }

  function setupHpControls() {
    const slider = document.getElementById("hpSlider")
    const amount = document.getElementById("hpAmount")
    const tempAmount = document.getElementById("tempAmount")

    slider.addEventListener("input", () => {
      currentHp = Number(slider.value)
      renderHp()
      saveState()
    })
    document.getElementById("hpDamage").addEventListener("click", () => {
      let dmg = Math.max(0, parseInt(amount.value, 10) || 0)
      if (tempHp > 0) {
        const absorbed = Math.min(tempHp, dmg)
        tempHp -= absorbed
        dmg -= absorbed
      }
      currentHp = Math.max(0, currentHp - dmg)
      renderHp()
      saveState()
    })
    document.getElementById("hpHeal").addEventListener("click", () => {
      const heal = Math.max(0, parseInt(amount.value, 10) || 0)
      currentHp = Math.min(C.maxHp, currentHp + heal)
      renderHp()
      saveState()
    })
    document.getElementById("setTemp").addEventListener("click", () => {
      tempHp = Math.max(0, parseInt(tempAmount.value, 10) || 0)
      renderHp()
      saveState()
    })
    document.getElementById("hpFull").addEventListener("click", () => {
      currentHp = C.maxHp
      tempHp = 0
      renderHp()
      saveState()
    })
  }

  /* ---------- Spells ---------- */
  function renderSpellStats() {
    const abil = C.spellcasting ? C.spellcasting.ability : "int"
    const spellMod = mod(abilities[abil])
    document.getElementById("spellDC").textContent = 8 + pb + spellMod
    document.getElementById("spellAtk").textContent = fmt(pb + spellMod)
    document.getElementById("spellAbility").textContent = abil.toUpperCase()
    const prepared = (C.spells || []).filter((s) => s.prepared).length + (C.cantrips || []).length
    document.getElementById("preparedCount").textContent = prepared
  }

  function renderSlots() {
    const container = document.getElementById("slotsContainer")
    container.innerHTML = ""
    const slots = (C.spellcasting && C.spellcasting.spellSlots) || {}
    const levels = Object.keys(slots).sort()
    if (levels.length === 0) {
      container.innerHTML = '<p class="hint">No leveled spell slots.</p>'
      return
    }
    levels.forEach((lvl) => {
      const total = slots[lvl]
      const used = usedSlots[lvl] || 0
      const row = document.createElement("div")
      row.className = "spell-slots"
      const label = document.createElement("span")
      label.className = "pill"
      label.textContent = `Level ${lvl}`
      row.appendChild(label)
      for (let i = 0; i < total; i++) {
        const pip = document.createElement("button")
        pip.className = "slot-pip" + (i < used ? " used" : "")
        pip.setAttribute("aria-label", `Level ${lvl} slot ${i + 1}`)
        pip.addEventListener("click", () => {
          // clicking pip i toggles used count to i+1, or clears if already there
          const newUsed = usedSlots[lvl] === i + 1 ? i : i + 1
          usedSlots[lvl] = newUsed
          renderSlots()
          saveState()
        })
        row.appendChild(pip)
      }
      const count = document.createElement("span")
      count.className = "s-meta"
      count.textContent = `${total - used}/${total} left`
      row.appendChild(count)
      container.appendChild(row)
    })
  }

  function spellItem(sp) {
    const btn = document.createElement("button")
    btn.className = "spell-item"
    const metaParts = [sp.school, sp.castingTime, sp.range].filter(Boolean)
    const preparedPill = sp.level === 0
      ? '<span class="pill">Cantrip</span>'
      : sp.prepared
        ? `<span class="pill">${sp.alwaysPrepared ? "Always Prepared" : "Prepared"}</span>`
        : '<span class="pill muted">Known</span>'
    btn.innerHTML = `
      <span>
        <span class="s-name">${sp.name}</span>
        <div class="s-meta">${metaParts.join(" • ")}</div>
      </span>
      ${preparedPill}`
    btn.addEventListener("click", () => openSpellModal(sp))
    return btn
  }

  function renderSpells() {
    // cantrips
    const cList = document.getElementById("cantripList")
    cList.innerHTML = ""
    ;(C.cantrips || []).forEach((sp) => cList.appendChild(spellItem(sp)))

    // leveled spells grouped
    const container = document.getElementById("spellsByLevel")
    container.innerHTML = ""
    const byLevel = {}
    ;(C.spells || []).forEach((sp) => {
      const l = sp.level || 1
      byLevel[l] = byLevel[l] || []
      byLevel[l].push(sp)
    })
    const levels = Object.keys(byLevel).sort()
    if (levels.length === 0) {
      container.innerHTML = "<h2>Spells</h2><p class='hint'>No leveled spells listed.</p>"
      return
    }
    levels.forEach((lvl) => {
      const head = document.createElement("h2")
      head.textContent = ordinal(lvl) + " Level Spells"
      container.appendChild(head)
      const list = document.createElement("div")
      list.className = "spell-list"
      byLevel[lvl].forEach((sp) => list.appendChild(spellItem(sp)))
      container.appendChild(list)
    })
  }

  function ordinal(n) {
    n = Number(n)
    const s = ["th", "st", "nd", "rd"]
    const v = n % 100
    return n + (s[(v - 20) % 10] || s[v] || s[0])
  }

  /* ---------- Modal ---------- */
  const backdrop = document.getElementById("modalBackdrop")
  const modalContent = document.getElementById("modalContent")

  function openSpellModal(sp) {
    modalContent.innerHTML = `
      <button class="modal-close" aria-label="Close">&times;</button>
      <h2>${sp.name}</h2>
      <div class="m-sub">${sp.level === 0 ? sp.school + " cantrip" : ordinal(sp.level) + "-level " + (sp.school || "")}</div>
      <div class="m-meta">
        <div><div class="k">Casting Time</div>${sp.castingTime || "—"}</div>
        <div><div class="k">Range</div>${sp.range || "—"}</div>
        <div><div class="k">Components</div>${sp.components || "—"}</div>
        <div><div class="k">Duration</div>${sp.duration || "—"}</div>
      </div>
      <div class="m-desc">${sp.description || "No description provided."}</div>`
    modalContent.querySelector(".modal-close").addEventListener("click", closeModal)
    backdrop.classList.add("open")
  }

  function openTextModal(title, sub, html) {
    modalContent.innerHTML = `
      <button class="modal-close" aria-label="Close">&times;</button>
      <h2>${title}</h2>
      ${sub ? `<div class="m-sub">${sub}</div>` : ""}
      <div class="m-desc">${html}</div>`
    modalContent.querySelector(".modal-close").addEventListener("click", closeModal)
    backdrop.classList.add("open")
  }

  function closeModal() {
    backdrop.classList.remove("open")
  }
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeModal()
  })
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal()
  })

  /* ---------- Features & Steel Defender ---------- */
  function renderFeatures() {
    const list = document.getElementById("featuresList")
    list.innerHTML = ""
    ;(C.features || []).forEach((f) => {
      const div = document.createElement("div")
      div.className = "feature"
      div.innerHTML = `
        <h3>${f.name}<span class="src">${f.source || ""}</span></h3>
        <p>${f.description || ""}</p>`
      list.appendChild(div)
    })
  }

  function renderDefender() {
    const d = C.steelDefender
    const card = document.getElementById("defenderCard")
    if (!d) {
      card.style.display = "none"
      return
    }
    document.getElementById("defenderName").textContent = d.name || "Steel Defender"

    const stats = document.getElementById("defenderStats")
    stats.innerHTML = ""
    ABILITY_ORDER.forEach((key) => {
      const score = d.abilities ? d.abilities[key] : 10
      const cell = document.createElement("div")
      cell.className = "def-stat"
      cell.innerHTML = `<div class="l">${key}</div><div class="v">${score} <span style="font-size:.8rem">(${fmt(mod(score))})</span></div>`
      stats.appendChild(cell)
    })

    const meta = document.getElementById("defenderMeta")
    meta.innerHTML = `
      <div class="def-line"><strong>Size:</strong> ${d.size || "—"}</div>
      <div class="def-line"><strong>Armor Class:</strong> ${d.armorClass} &nbsp; <strong>Hit Points:</strong> ${d.hitPoints} &nbsp; <strong>Speed:</strong> ${d.speed || "—"}</div>
      <div class="def-line"><strong>Saving Throws:</strong> ${d.savingThrows || "—"}</div>
      <div class="def-line"><strong>Damage Immunities:</strong> ${d.damageImmunities || "—"}</div>
      <div class="def-line"><strong>Condition Immunities:</strong> ${d.conditionImmunities || "—"}</div>
      <div class="def-line"><strong>Senses:</strong> ${d.senses || "—"}</div>`

    const traits = document.getElementById("defenderTraits")
    traits.innerHTML = "<h3 style='color:var(--gold);font-size:1rem;margin-bottom:6px'>Traits</h3>"
    ;(d.traits || []).forEach((t) => {
      const p = document.createElement("p")
      p.className = "def-line"
      p.innerHTML = `<strong>${t.name}.</strong> ${t.description}`
      traits.appendChild(p)
    })

    const actions = document.getElementById("defenderActions")
    actions.innerHTML = "<h3 style='color:var(--gold);font-size:1rem;margin-bottom:6px'>Actions</h3>"
    ;(d.actions || []).forEach((a) => {
      const p = document.createElement("p")
      p.className = "def-line"
      p.innerHTML = `<strong>${a.name}.</strong> ${a.description}`
      actions.appendChild(p)
    })
  }

  /* ---------- Recalc (everything that depends on abilities) ---------- */
  function recalcAll() {
    ABILITY_ORDER.forEach((key) => {
      const m = document.getElementById("mod-" + key)
      if (m) m.textContent = fmt(mod(abilities[key]))
      const s = document.getElementById("score-" + key)
      if (s) s.textContent = abilities[key]
    })
    renderSaves()
    renderSkills()
    renderCombatTop()
    renderWeapons()
    renderSpellStats()
  }

  /* ---------- Tabs ---------- */
  function setupTabs() {
    const tabs = document.querySelectorAll(".tab")
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"))
        document.querySelectorAll(".panel").forEach((p) => p.classList.remove("active"))
        tab.classList.add("active")
        document.getElementById(tab.dataset.tab).classList.add("active")
      })
    })
  }

  /* ---------- Init ---------- */
  renderHeader()
  renderAbilities()
  renderSaves()
  renderSkills()
  renderCombatTop()
  renderGearSelectors()
  renderWeapons()
  renderHp()
  setupHpControls()
  renderSpellStats()
  renderSlots()
  renderSpells()
  document.getElementById("resetSlots").addEventListener("click", () => {
    Object.keys(usedSlots).forEach((k) => (usedSlots[k] = 0))
    renderSlots()
    saveState()
  })
  renderFeatures()
  renderDefender()
  setupTabs()
})()
