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
  let defenderHp = null
  let defenderTempHp = 0
  let equippedArmorIndex = (C.armor || []).findIndex((a) => a.equipped)
  let equippedShieldIndex = (C.shields || []).findIndex((s) => s.equipped)
  let activeSpellLevel = 0

  loadState()

  /* ---------- Helpers ---------- */
  const SKILL_MAP = {
    acrobatics: { ability: "dex", label: "Acrobacias" },
    animalHandling: { ability: "wis", label: "Trato con animales" },
    arcana: { ability: "int", label: "Arcano" },
    athletics: { ability: "str", label: "Atletismo" },
    deception: { ability: "cha", label: "Engaño" },
    history: { ability: "int", label: "Historia" },
    insight: { ability: "wis", label: "Perspicacia" },
    intimidation: { ability: "cha", label: "Intimidación" },
    investigation: { ability: "int", label: "Investigación" },
    medicine: { ability: "wis", label: "Medicina" },
    nature: { ability: "int", label: "Naturaleza" },
    perception: { ability: "wis", label: "Percepción" },
    performance: { ability: "cha", label: "Interpretación" },
    persuasion: { ability: "cha", label: "Persuasión" },
    religion: { ability: "int", label: "Religión" },
    sleightOfHand: { ability: "dex", label: "Juego de Manos" },
    stealth: { ability: "dex", label: "Sigilo" },
    survival: { ability: "wis", label: "Supervivencia" },
  }
  const ABILITY_ORDER = ["str", "dex", "con", "int", "wis", "cha"]
  const ABILITY_LABEL = { str: "Fuerza", dex: "Destreza", con: "Constitución", int: "Inteligencia", wis: "Sabiduría", cha: "Carisma" }

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
      if (typeof s.defenderHp === "number") defenderHp = s.defenderHp
      if (typeof s.defenderTempHp === "number") defenderTempHp = s.defenderTempHp
      if (s.usedSlots) Object.assign(usedSlots, s.usedSlots)
      if (Array.isArray(s.preparedSpells)) {
        const preparedKeys = new Set(s.preparedSpells)
        ;(C.spells || []).forEach((sp) => {
          if (!sp.alwaysPrepared) {
            sp.prepared = preparedKeys.has(`${sp.level}:${sp.name}`)
          }
        })
      }
      if (Array.isArray(s.knownMagicItemPlans)) {
        const knownKeys = new Set(s.knownMagicItemPlans)
        ;(C.magicItemPlans || []).forEach((plan) => {
          plan.known = knownKeys.has(plan.name)
        })
      }
    } catch (e) {
      console.log("[v0] Could not load saved state:", e.message)
    }
  }

  function saveState() {
    try {
      const preparedSpells = (C.spells || [])
        .filter((sp) => sp.prepared && !sp.alwaysPrepared)
        .map((sp) => `${sp.level}:${sp.name}`)
      const knownMagicItemPlans = (C.magicItemPlans || [])
        .filter((plan) => plan.known)
        .map((plan) => plan.name)
      localStorage.setItem(STORE_KEY, JSON.stringify({ currentHp, tempHp, defenderHp, defenderTempHp, usedSlots, preparedSpells, knownMagicItemPlans }))
    } catch (e) {
      console.log("[v0] Could not save state:", e.message)
    }
  }

  /* ---------- Header ---------- */
  function renderHeader() {
    document.getElementById("charName").textContent = C.name || "Personaje"
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
            ${info.label} <span class="abbr">${ABILITY_LABEL[info.ability]}</span>
          </span>
          <span class="val">${fmt(bonus)}</span>`
        list.appendChild(li)
      })
  }

  /* ---------- Combat: AC, initiative, weapons ---------- */
  function computeAC() {
    const dexMod = mod(abilities.dex)
    let base = 10 + dexMod
    let label = "Sin armadura (10 + Des)"
    const armor = C.armor && C.armor[equippedArmorIndex]
    if (armor) {
      if (armor.category === "light") {
        base = armor.baseAC + dexMod
        label = `${armor.name} (${armor.baseAC} + Dex ${fmt(dexMod)})`
      } else if (armor.category === "medium") {
        const capped = Math.min(dexMod, 2)
        base = armor.baseAC + capped
        label = `${armor.name} (${armor.baseAC} + Dex ${fmt(capped)}, máx. +2)`
      } else {
        base = armor.baseAC
        label = `${armor.name} (${armor.baseAC}, sin Des)`
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
    armorSel.innerHTML = '<option value="-1">Ninguna (sin armadura)</option>'
    ;(C.armor || []).forEach((a, i) => {
      const opt = document.createElement("option")
      opt.value = i
      opt.textContent = `${a.name} — base ${a.baseAC} (${a.category})`
      if (i === equippedArmorIndex) opt.selected = true
      armorSel.appendChild(opt)
    })
    shieldSel.innerHTML = '<option value="-1">Ninguno</option>'
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
            ${abil.key.toUpperCase()}${w.useIntForAttack ? " (Preparado para la Batalla)" : ""}${w.proficient ? " · competente" : ""}
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
  const ARTIFICER_PREPARED_BY_LEVEL = {
    1: 2, 2: 3, 3: 4, 4: 5, 5: 6,
    6: 6, 7: 7, 8: 7, 9: 9, 10: 9,
    11: 10, 12: 10, 13: 11, 14: 11, 15: 12,
    16: 12, 17: 14, 18: 14, 19: 15, 20: 15,
  }

  const ARTIFICER_CANTRIPS_BY_LEVEL = {
    1: 2, 2: 2, 3: 2, 4: 2, 5: 2, 6: 2, 7: 2, 8: 2, 9: 2,
    10: 3, 11: 3, 12: 3, 13: 3, 14: 4, 15: 4, 16: 4, 17: 4,
    18: 4, 19: 4, 20: 4,
  }

  function getMaxPrepared() {
    const level = Math.max(1, Math.min(20, Number(C.level) || 1))
    return ARTIFICER_PREPARED_BY_LEVEL[level] || 0
  }

  function getMaxCantrips() {
    const level = Math.max(1, Math.min(20, Number(C.level) || 1))
    return ARTIFICER_CANTRIPS_BY_LEVEL[level] || 0
  }

  const ARTIFICER_SPELL_SLOTS_BY_LEVEL = {
    1: {1: 2}, 2: {1: 2}, 3: {1: 3}, 4: {1: 3},
    5: {1: 4, 2: 2}, 6: {1: 4, 2: 2}, 7: {1: 4, 2: 3}, 8: {1: 4, 2: 3},
    9: {1: 4, 2: 3, 3: 2}, 10: {1: 4, 2: 3, 3: 2}, 11: {1: 4, 2: 3, 3: 3},
    12: {1: 4, 2: 3, 3: 3}, 13: {1: 4, 2: 3, 3: 3, 4: 1},
    14: {1: 4, 2: 3, 3: 3, 4: 1}, 15: {1: 4, 2: 3, 3: 3, 4: 2},
    16: {1: 4, 2: 3, 3: 3, 4: 2}, 17: {1: 4, 2: 3, 3: 3, 4: 3, 5: 1},
    18: {1: 4, 2: 3, 3: 3, 4: 3, 5: 1}, 19: {1: 4, 2: 3, 3: 3, 4: 3, 5: 2},
    20: {1: 4, 2: 3, 3: 3, 4: 3, 5: 2},
  }

  function getSpellSlots() {
    const level = Math.max(1, Math.min(20, Number(C.level) || 1))
    return ARTIFICER_SPELL_SLOTS_BY_LEVEL[level] || {}
  }

  function getHighestSpellSlotLevel() {
    const slots = getSpellSlots()
    const levels = Object.keys(slots).map(Number).filter((n) => n > 0 && Number(slots[n]) > 0)
    return levels.length ? Math.max(...levels) : 0
  }

  function getPreparedCount() {
    const maxLevel = getHighestSpellSlotLevel()
    return (C.spells || []).filter((s) => Number(s.level) > 0 && Number(s.level) <= maxLevel && s.prepared && !s.alwaysPrepared).length
  }

  function getAvailableSpellsByLevel() {
    const maxLevel = getHighestSpellSlotLevel()
    const byLevel = {}
    if (Array.isArray(C.cantrips) && C.cantrips.length) {
      byLevel[0] = C.cantrips
    }
    ;(C.spells || []).forEach((sp) => {
      const level = Number(sp.level || 1)
      if (level > 0 && level <= maxLevel && (!sp.minArtificerLevel || Number(C.level) >= Number(sp.minArtificerLevel))) {
        byLevel[level] = byLevel[level] || []
        byLevel[level].push(sp)
      }
    })
    return byLevel
  }

function renderSpellStats() {
    const abil = C.spellcasting ? C.spellcasting.ability : "int"
    const spellMod = mod(abilities[abil])
    document.getElementById("spellDC").textContent = 8 + pb + spellMod
    document.getElementById("spellAtk").textContent = fmt(pb + spellMod)
    document.getElementById("spellAbility").textContent = ABILITY_LABEL[abil] || abil.toUpperCase()
    const prepared = getPreparedCount()
    const alwaysPrepared = (C.spells || []).filter((s) => {
      const level = Number(s.level || 0)
      return level > 0 && level <= getHighestSpellSlotLevel() && s.alwaysPrepared
    }).length
    document.getElementById("preparedCount").textContent = `${prepared + alwaysPrepared}/${getMaxPrepared() + alwaysPrepared}`
  }

  function renderSlots() {
    const container = document.getElementById("slotsContainer")
    container.innerHTML = ""
    const slots = getSpellSlots()
    const levels = Object.keys(slots).sort()
    if (levels.length === 0) {
      container.innerHTML = '<p class="hint">No tienes espacios de conjuro disponibles.</p>'
      return
    }
    levels.forEach((lvl) => {
      const total = slots[lvl]
      const used = usedSlots[lvl] || 0
      const row = document.createElement("div")
      row.className = "spell-slots"
      const label = document.createElement("span")
      label.className = "pill"
      label.textContent = `Nivel ${lvl}`
      row.appendChild(label)
      for (let i = 0; i < total; i++) {
        const pip = document.createElement("button")
        pip.className = "slot-pip" + (i < used ? " used" : "")
        pip.setAttribute("aria-label", `Espacio de nivel ${lvl}, ${i + 1}`)
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
      count.textContent = `${total - used}/${total} disponibles`
      row.appendChild(count)
      container.appendChild(row)
    })
  }

  function spellItem(sp) {
    const wrapper = document.createElement("div")
    wrapper.className = "spell-item" + (sp.prepared ? " prepared" : "")

    const metaParts = [sp.subclass || "", sp.school, sp.castingTime, sp.range, sp.components, sp.duration].filter(Boolean)
    const info = document.createElement("button")
    info.type = "button"
    info.className = "spell-info"
    info.innerHTML = `
      <span>
        <span class="s-name">${sp.name}</span>
        <span class="s-meta">${metaParts.join(" • ")}</span>
      </span>`
    info.addEventListener("click", () => openSpellModal(sp))

    const action = document.createElement("button")
    action.type = "button"
    action.className = "spell-toggle"
    if (sp.level === 0) {
      action.textContent = sp.known ? "Conocido" : "No conocido"
      action.disabled = true
    } else {
      action.textContent = sp.alwaysPrepared ? "Siempre" : (sp.prepared ? "Preparado" : "Preparar")
      action.setAttribute("aria-pressed", sp.prepared ? "true" : "false")
      if (sp.alwaysPrepared) {
        action.disabled = true
      } else {
        action.addEventListener("click", (e) => {
          e.stopPropagation()
          togglePreparedSpell(sp)
        })
      }
    }

    wrapper.appendChild(info)
    wrapper.appendChild(action)
    return wrapper
  }

  function togglePreparedSpell(sp) {
    if (sp.prepared) {
      sp.prepared = false
      renderSpells()
      renderSpellStats()
      saveState()
      return
    }

    const maxPrepared = getMaxPrepared()
    const currentPrepared = getPreparedCount()
    if (currentPrepared >= maxPrepared) {
      openTextModal(
        "Límite de preparados",
        `${currentPrepared}/${maxPrepared} conjuros preparados`,
        `No puedes preparar más conjuros. Desprepara uno de los actuales antes de preparar <strong>${sp.name}</strong>.`
      )
      return
    }

    sp.prepared = true
    renderSpells()
    renderSpellStats()
    saveState()
  }

  function renderSpells() {
    const container = document.getElementById("spellsByLevel")
    container.innerHTML = ""

    const byLevel = getAvailableSpellsByLevel()
    const levels = Object.keys(byLevel).map(Number).sort((a, b) => a - b)
    if (levels.length === 0) {
      container.innerHTML = "<p class='hint'>No tienes conjuros disponibles a tu nivel actual.</p>"
      return
    }

    const tabs = document.createElement("div")
    tabs.className = "spell-level-tabs"
    tabs.setAttribute("role", "tablist")
    tabs.setAttribute("aria-label", "Niveles de conjuros")

    const panels = document.createElement("div")
    panels.className = "spell-level-panels"

    if (!levels.includes(activeSpellLevel)) activeSpellLevel = levels[0]

    levels.forEach((lvl) => {
      const isActive = lvl === activeSpellLevel
      const tab = document.createElement("button")
      tab.type = "button"
      tab.className = "spell-level-tab" + (isActive ? " active" : "")
      tab.textContent = lvl === 0 ? "Nivel 0" : `Nivel ${lvl}`
      tab.setAttribute("role", "tab")
      tab.setAttribute("aria-selected", isActive ? "true" : "false")
      tab.dataset.level = String(lvl)

      const panel = document.createElement("div")
      panel.className = "spell-level-panel" + (isActive ? " active" : "")
      panel.dataset.level = String(lvl)
      panel.setAttribute("role", "tabpanel")

      const head = document.createElement("div")
      head.className = "spell-level-head"

      if (lvl === 0) {
        const known = byLevel[lvl].filter((sp) => sp.known && !sp.alwaysKnown).length
        head.innerHTML = `
          <h2>Trucos</h2>
          <span class="spell-prepared-counter">${known}/${getMaxCantrips()} conocidos</span>
        `
      } else {
        const alwaysAtLevel = byLevel[lvl].filter((sp) => sp.alwaysPrepared).length
        head.innerHTML = `
          <h2>Nivel ${lvl}</h2>
          <span class="spell-prepared-counter">${getPreparedCount()}/${getMaxPrepared()} preparados en total${alwaysAtLevel ? ` · ${alwaysAtLevel} siempre preparados` : ""}</span>
        `
      }

      panel.appendChild(head)

      const list = document.createElement("div")
      list.className = "spell-list"
      byLevel[lvl].forEach((sp) => list.appendChild(spellItem(sp)))
      panel.appendChild(list)

      tab.addEventListener("click", () => {
        activeSpellLevel = lvl
        tabs.querySelectorAll(".spell-level-tab").forEach((t) => {
          const active = t === tab
          t.classList.toggle("active", active)
          t.setAttribute("aria-selected", active ? "true" : "false")
        })
        panels.querySelectorAll(".spell-level-panel").forEach((p) => {
          p.classList.toggle("active", p === panel)
        })
      })

      tabs.appendChild(tab)
      panels.appendChild(panel)
    })

    container.appendChild(tabs)
    container.appendChild(panels)
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
      <button class="modal-close" aria-label="Cerrar">&times;</button>
      <h2>${sp.name}</h2>
      <div class="m-sub">${sp.level === 0 ? (sp.school || "") + " · Truco" : "Nivel " + sp.level + " · " + (sp.school || "")}${sp.subclass ? " · " + sp.subclass : ""}</div>
      <div class="m-meta">
        <div><div class="k">Tiempo de lanzamiento</div>${sp.castingTime || "—"}</div>
        <div><div class="k">Alcance</div>${sp.range || "—"}</div>
        <div><div class="k">Componentes</div>${sp.components || "—"}</div>
        <div><div class="k">Duración</div>${sp.duration || "—"}</div>
      </div>
      <div class="m-desc">${sp.description || "No hay descripción disponible."}</div>`
    modalContent.querySelector(".modal-close").addEventListener("click", closeModal)
    backdrop.classList.add("open")
  }

  function openMagicPlanModal(plan) {
    modalContent.innerHTML = `
      <button class="modal-close" aria-label="Cerrar">&times;</button>
      <h2>${plan.name}</h2>
      <div class="m-sub">Plan disponible desde nivel ${plan.minLevel} · ${plan.attunement === "Sí" ? "Requiere sintonización" : plan.attunement === "No" ? "No requiere sintonización" : "Sintonización variable"}</div>
      <div class="m-desc">${plan.description || "No hay descripción disponible."}</div>`
    modalContent.querySelector(".modal-close").addEventListener("click", closeModal)
    backdrop.classList.add("open")
  }

  function openTextModal(title, sub, html) {
    modalContent.innerHTML = `
      <button class="modal-close" aria-label="Cerrar">&times;</button>
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

  /* ---------- Magic Item Plans ---------- */
  const PLANS_KNOWN_BY_LEVEL = {
    1: 0, 2: 4, 3: 4, 4: 4, 5: 4,
    6: 5, 7: 5, 8: 5, 9: 5,
    10: 6, 11: 6, 12: 6, 13: 6,
    14: 7, 15: 7, 16: 7, 17: 7,
    18: 8, 19: 8, 20: 8,
  }

  function getMaxMagicItemPlans() {
    const level = Math.max(1, Math.min(20, Number(C.level) || 1))
    return PLANS_KNOWN_BY_LEVEL[level] || 0
  }

  function getKnownMagicItemPlans() {
    return (C.magicItemPlans || []).filter((plan) => plan.known).length
  }

  function toggleMagicItemPlan(plan) {
    if (plan.minLevel > C.level) return

    if (plan.known) {
      plan.known = false
      renderMagicItemPlans()
      saveState()
      return
    }

    const max = getMaxMagicItemPlans()
    const current = getKnownMagicItemPlans()
    if (current >= max) {
      openTextModal(
        "Límite de planes",
        `${current}/${max} planes conocidos`,
        `No puedes aprender más planes a tu nivel actual. Olvida uno de los planes conocidos antes de aprender <strong>${plan.name}</strong>.`
      )
      return
    }

    plan.known = true
    renderMagicItemPlans()
    saveState()
  }

  function renderMagicItemPlans() {
    const list = document.getElementById("magicItemPlansList")
    if (!list) return
    list.innerHTML = ""

    const plans = C.magicItemPlans || []
    const max = getMaxMagicItemPlans()
    const known = getKnownMagicItemPlans()
    const level = Number(C.level) || 1

    document.getElementById("plansKnownCount").textContent = known
    document.getElementById("plansMaxCount").textContent = max
    document.getElementById("plansLevel").textContent = level

    // Solo mostramos los planes que el personaje puede aprender ahora.
    const availablePlans = plans.filter((plan) => level >= Number(plan.minLevel || 1))
    const levels = [...new Set(availablePlans.map((p) => p.minLevel))].sort((a, b) => a - b)

    if (!availablePlans.length) {
      list.innerHTML = '<p class="hint">No tienes planes de objetos mágicos disponibles a tu nivel actual.</p>'
      return
    }

    levels.forEach((minLevel) => {
      const section = document.createElement("div")
      section.className = "magic-plan-section"

      const heading = document.createElement("div")
      heading.className = "magic-plan-heading"
      heading.innerHTML = `<h3>Planes disponibles desde nivel ${minLevel}</h3><span class="plan-status available">Disponibles</span>`
      section.appendChild(heading)

      const grid = document.createElement("div")
      grid.className = "magic-plan-list"

      availablePlans.filter((p) => p.minLevel === minLevel).forEach((plan) => {
        const item = document.createElement("div")
        item.className = "magic-plan-item" + (plan.known ? " known" : "")
        item.innerHTML = `
          <button type="button" class="magic-plan-info" aria-label="Ver descripción de ${plan.name}">
            <span class="magic-plan-main">
              <span class="magic-plan-name">${plan.name}</span>
              ${plan.repeatable ? '<span class="magic-plan-note">Se puede aprender varias veces</span>' : ""}
            </span>
            <span class="magic-plan-meta">${plan.attunement === "Sí" ? "Requiere sintonización" : plan.attunement === "No" ? "Sin sintonización" : "Sintonización variable"}</span>
          </button>
          <button type="button" class="magic-plan-check" aria-pressed="${plan.known ? "true" : "false"}">${plan.known ? "✓ Conocido" : "Aprender"}</button>`
        item.querySelector(".magic-plan-info").addEventListener("click", () => openMagicPlanModal(plan))
        item.querySelector(".magic-plan-check").addEventListener("click", () => toggleMagicItemPlan(plan))
        grid.appendChild(item)
      })

      section.appendChild(grid)
      list.appendChild(section)
    })
  }

  /* ---------- Features & Steel Defender ---------- */
  function renderFeatures() {
    const list = document.getElementById("featuresList")
    list.innerHTML = ""
    const dwarfFeatures = C.race === "Enano" ? [
      { minLevel: 1, name: "Visión en la Oscuridad", source: "Especie · Enano", description: "Tienes visión en la oscuridad hasta 120 pies." },
      { minLevel: 1, name: "Resiliencia Enana", source: "Especie · Enano", description: "Tienes resistencia al daño de veneno y ventaja en las tiradas de salvación para evitar o terminar el estado Envenenado." },
      { minLevel: 1, name: "Dureza Enana", source: "Especie · Enano", description: "Tus puntos de golpe máximos aumentan en 1, y vuelven a aumentar en 1 cada vez que ganas un nivel." },
      { minLevel: 1, name: "Conocimiento de la Piedra", source: "Especie · Enano", description: "Como acción adicional, obtienes sentido de las vibraciones a 60 pies durante 10 minutos mientras estés sobre piedra o tocando piedra. Puedes usarlo un número de veces igual a tu bonificador de competencia y recuperas todos los usos tras un descanso largo." },
    ] : []
    ;([...(C.features || []), ...dwarfFeatures]).filter((f) => Number(f.minLevel || 1) <= Number(C.level || 1)).forEach((f) => {
      const div = document.createElement("div")
      div.className = "feature" + (Array.isArray(f.creations) && f.creations.length ? " feature-clickable" : "")
      div.innerHTML = `
        <h3>${f.name}<span class="src">${f.source || ""}</span></h3>
        <p>${f.description || ""}</p>
        ${Array.isArray(f.creations) && f.creations.length ? `
          <div class="feature-hint">Clica per veure què pots crear <span aria-hidden="true">▾</span></div>
          <div class="feature-creations" hidden>
            <div class="creation-list">${f.creations.map((item) => `<span class="creation-item">${item}</span>`).join("")}</div>
          </div>` : ""}`

      if (Array.isArray(f.creations) && f.creations.length) {
        div.addEventListener("click", () => {
          const details = div.querySelector(".feature-creations")
          const hint = div.querySelector(".feature-hint")
          const open = details.hidden
          details.hidden = !open
          div.classList.toggle("expanded", open)
          hint.innerHTML = open
            ? 'Clica per ocultar els objectes <span aria-hidden="true">▴</span>'
            : 'Clica per veure què pots crear <span aria-hidden="true">▾</span>'
        })
      }
      list.appendChild(div)
    })
  }

  function getDefenderMaxHp() {
    return 5 + 5 * (Number(C.level) || 1)
  }

  function renderDefenderHp() {
    const max = getDefenderMaxHp()
    if (defenderHp == null) defenderHp = max
    defenderHp = Math.max(0, Math.min(defenderHp, max))
    document.getElementById("defenderHpCurrent").textContent = defenderHp
    document.getElementById("defenderHpMax").textContent = max
    document.getElementById("defenderHpBar").style.width = (max ? defenderHp / max * 100 : 0) + "%"
    const slider = document.getElementById("defenderHpSlider")
    slider.max = max
    slider.value = defenderHp
  }

  function setupDefenderHpControls() {
    const slider = document.getElementById("defenderHpSlider")
    const amount = document.getElementById("defenderHpAmount")
    slider.addEventListener("input", () => { defenderHp = Number(slider.value); renderDefenderHp(); saveState() })
    document.getElementById("defenderHpDamage").addEventListener("click", () => { defenderHp = Math.max(0, defenderHp - Math.max(0, parseInt(amount.value, 10) || 0)); renderDefenderHp(); saveState() })
    document.getElementById("defenderHpHeal").addEventListener("click", () => { defenderHp = Math.min(getDefenderMaxHp(), defenderHp + Math.max(0, parseInt(amount.value, 10) || 0)); renderDefenderHp(); saveState() })
    document.getElementById("defenderHpFull").addEventListener("click", () => { defenderHp = getDefenderMaxHp(); defenderTempHp = 0; renderDefenderHp(); saveState() })
  }

  function renderDefender() {
    const d = C.steelDefender
    const card = document.getElementById("defenderCard")
    if (!d) { card.style.display = "none"; return }
    document.getElementById("defenderName").textContent = d.name || "Thorek"
    const stats = document.getElementById("defenderStats")
    stats.innerHTML = ""
    ABILITY_ORDER.forEach((key) => {
      const score = d.abilities ? d.abilities[key] : 10
      const cell = document.createElement("div")
      cell.className = "def-stat"
      cell.innerHTML = `<div class="l">${ABILITY_LABEL[key]}</div><div class="v">${score} <span style="font-size:.8rem">(${fmt(mod(score))})</span></div>`
      stats.appendChild(cell)
    })
    const spellAttack = pb + mod(abilities.int)
    const defenderAC = 12 + mod(abilities.int)
    const meta = document.getElementById("defenderMeta")
    meta.innerHTML = `
      <div class="def-line"><strong>Tamaño:</strong> ${d.size || "—"}</div>
      <div class="def-line"><strong>Clase de Armadura:</strong> ${defenderAC} &nbsp; <strong>Puntos de Golpe:</strong> ${getDefenderMaxHp()} &nbsp; <strong>Velocidad:</strong> ${d.speed || "—"}</div>
      <div class="def-line"><strong>Tiradas de salvación:</strong> ${d.savingThrows || "—"}</div>
      <div class="def-line"><strong>Inmunidades al daño:</strong> ${d.damageImmunities || "—"}</div>
      <div class="def-line"><strong>Inmunidades a condiciones:</strong> ${d.conditionImmunities || "—"}</div>
      <div class="def-line"><strong>Sentidos:</strong> ${d.senses || "—"}</div>
      <div class="def-line"><strong>Bonificador de ataque de Thorek:</strong> ${fmt(spellAttack)} (usa tu ataque de conjuro)</div>`
    document.getElementById("defenderAc").textContent = defenderAC
    document.getElementById("defenderSpeed").textContent = String(d.speed || "").replace(/[^0-9]/g, "") || "40"
    const traits = document.getElementById("defenderTraits")
    traits.innerHTML = "<h3 style='color:var(--gold);font-size:1rem;margin-bottom:6px'>Rasgos</h3>"
    ;(d.traits || []).forEach((t) => { const p = document.createElement("p"); p.className = "def-line"; p.innerHTML = `<strong>${t.name}.</strong> ${t.description}`; traits.appendChild(p) })
    const actions = document.getElementById("defenderActions")
    actions.innerHTML = "<h3 style='color:var(--gold);font-size:1rem;margin-bottom:6px'>Acciones y reacciones</h3>"
    ;(d.actions || []).forEach((a) => {
      let desc = a.description
      if (a.name.startsWith("Desgarro")) desc = `Ataque cuerpo a cuerpo: <strong>${fmt(spellAttack)}</strong> al ataque, alcance 5 pies, un objetivo. Impacto: <strong>1d8 + ${2 + mod(abilities.int)}</strong> de daño de fuerza.`
      if (a.name.startsWith("Reparar")) desc = `Thorek, o un constructo u objeto que pueda ver a 5 pies, recupera <strong>2d8 + ${mod(abilities.int)}</strong> puntos de golpe. 3 usos al día.`
      const p = document.createElement("p"); p.className = "def-line"; p.innerHTML = `<strong>${a.name}.</strong> ${desc}`; actions.appendChild(p)
    })
    renderDefenderHp()
  }

  function renderItems() {
    const list = document.getElementById("itemsList")
    if (!list) return
    list.innerHTML = ""
    const normalItems = C.equipment || []
    const magicItems = C.magicItems || []

    const addSection = (title, items, emptyText, magic = false) => {
      const section = document.createElement("div")
      section.className = "items-section"
      const h = document.createElement("h3")
      h.className = "items-heading"
      h.textContent = title
      section.appendChild(h)
      if (!items.length) {
        const p = document.createElement("p"); p.className = "hint"; p.textContent = emptyText; section.appendChild(p); list.appendChild(section); return
      }
      items.forEach((item) => {
        const obj = typeof item === "string" ? { name: item } : item
        const div = document.createElement("div")
        div.className = "feature"
        div.innerHTML = `<h3>${obj.name || "Objeto"}${magic && obj.type ? `<span class="src">${obj.type}</span>` : ""}</h3>${obj.description ? `<p>${obj.description}</p>` : `<p class="hint">Sin descripción.</p>`}${obj.attunement ? `<p class="hint">${obj.attunement}</p>` : ""}`
        section.appendChild(div)
      })
      list.appendChild(section)
    }

    addSection("Equipo y objetos", normalItems, "No tienes objetos registrados.")
    addSection("Objetos mágicos", magicItems, "No tienes objetos mágicos registrados.", true)
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
  renderMagicItemPlans()
  renderFeatures()
  renderDefender()
  setupDefenderHpControls()
  renderItems()
  setupTabs()
})()
