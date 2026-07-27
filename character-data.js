/* =========================================================================
   DATOS DE TU PERSONAJE  —  edita lo que quieras y recarga la página.
   -------------------------------------------------------------------------
   Es un objeto JSON normal. Cambia números, añade armas, conjuros, etc.
   Mantén las comillas y las comas en su sitio.

   Cálculos automáticos importantes:
   - "abilities" gobiernan cada modificador, habilidad, salvación, CD y CA.
   - Las armas con "useIntForAttack": true usan tu Inteligencia de Artífice
     para ataque y daño (rasgo "Preparado para la Batalla" del Herrero de Guerra).
   - La "category" de armadura es "light" | "medium" | "heavy". La CA es automática.
   - Conjuros: pon "known": true en trucos y "prepared": true en conjuros para
     tenerlos activos. Los marcados "alwaysPrepared" no cuentan para el máximo.
   ========================================================================= */
window.CHARACTER = {
  name: "Jörg Doblegaferro",
  race: "Enano",
  class: "Artífice",
  subclass: "Herrero de Guerra",
  level: 4,
  background: "Artesano de Gremio",
  alignment: "Neutral",
  proficiencyBonus: 2,
  speed: 25, // en pies
  initiativeBonus: 0, // bonificador plano extra sobre tu mod. de Destreza

  // ---- Puntuaciones de característica (los modificadores se calculan solos) ----
  abilities: {
    str: 12,
    dex: 10,
    con: 16,
    int: 18,
    wis: 10,
    cha: 9,
  },

  // Salvaciones en las que eres competente
  savingThrowProficiencies: ["con", "int"],

  // Habilidades con competencia / con pericia (doble competencia)
  skillProficiencies: ["arcana", "history", "perception", "medicine"],
  skillExpertise: [],

  // ---- Idiomas ----
  languages: ["Común", "Gnomo", "Mediano (Halfling)", "Gigante"],

  // ---- Competencias ----
  proficiencies: {
    armor: ["Armadura ligera", "Armadura media", "Escudos"],
    weapons: ["Armas sencillas", "Armas marciales (Preparado para la Batalla)"],
    tools: [
      "Herramientas de ladrón",
      "Herramientas de inventor (tinker's tools)",
      "Herramientas de artesano",
      "Herramientas de herrero (smith's tools)",
    ],
  },

  // ---- Puntos de golpe y dados de golpe ----
  maxHp: 45,
  hitDice: "4d8",

  // ---- Armaduras. Marca UNA como equipped:true (o ninguna para sin armadura) ----
  // "light": CA = base + Destreza completa
  // "medium": CA = base + Destreza (máx +2)
  // "heavy": CA = base (sin Destreza)
  armor: [
    { name: "Cota de Escamas", category: "medium", baseAC: 14, stealthDisadvantage: true, equipped: true },
  ],

  // ---- Escudos. Marca UNO como equipped:true (o ninguno) ----
  shields: [
    { name: "Escudo", acBonus: 2, equipped: true },
	{ name: "Escudo +1", acBonus: 3, equipped: false },
  ],

  // ---- Equipo (mochila / objetos que llevas) ----
  equipment: [
    "Cota de escamas",
    "Escudo",
    "Maza",
    "Herramientas de inventor (tinker's tools)",
    "Herramientas de herrero (smith's tools)",
    "Equipo de mazmorrero (dungeoneer's pack)",
  ],

  // ---- Armas ----
  // ability: "str" | "dex"  (característica que rige normalmente el arma)
  // finesse:true permite usar la mejor de Fue/Des automáticamente
  // useIntForAttack:true  -> arma mágica de Herrero de Guerra, usa Inteligencia
  // bonus: bonificador mágico/otro añadido al ataque Y al daño
  weapons: [
    {
      name: "Maza",
      ability: "str",
      useIntForAttack: true,
      proficient: true,
      bonus: 0,
      damageDice: "1d6",
      damageType: "contundente",
      properties: [],
      range: "Cuerpo a cuerpo (5 pies)",
      notes: "Con 'Preparado para la Batalla' usa Inteligencia al ataque/daño si el arma es mágica (p. ej. con la infusión Arma Mejorada activa, pon bonus: 1).",
    },
	{
      name: "Maza +1",
      ability: "int",
      useIntForAttack: true,
      proficient: true,
      bonus: 0,
      damageDice: "1d6+1",
      damageType: "contundente",
      properties: [],
      range: "Cuerpo a cuerpo (5 pies)",
      notes: "Con 'Preparado para la Batalla' usa Inteligencia al ataque/daño si el arma es mágica (p. ej. con la infusión Arma Mejorada activa, pon bonus: 1).",
    },
  ],

  // ---- Lanzamiento de conjuros ----
  // El Artífice es semi-lanzador; la Inteligencia es la aptitud mágica.
  // maxPrepared se calcula solo = mod. Int + mitad del nivel de Artífice (abajo).
  // maxCantrips = número de trucos que conoces a este nivel.
  spellcasting: {
    ability: "int",
    spellSlots: { 1: 3 }, // Artífice nivel 4 = tres espacios de nivel 1
    maxCantrips: 2,
  },

  // ---- TRUCOS (marca "known": true los que conoces, máx = maxCantrips) ----
  cantrips: [
    { name: "Salpicadura Ácida", level: 0, school: "Conjuración", castingTime: "1 acción", range: "60 pies", components: "V, S", duration: "Instantáneo", known: false,
      description: "Lanzas una burbuja de ácido. Elige una o dos criaturas a 5 pies entre sí; cada una hace salvación de Destreza o recibe 1d6 de daño de ácido. Aumenta a 2d6 (nv5), 3d6 (nv11) y 4d6 (nv17)." },
    { name: "Filo Estruendoso (Booming Blade)", level: 0, school: "Evocación", castingTime: "1 acción", range: "Personal (radio 5 pies)", components: "V, M (un arma)", duration: "1 asalto", known: false,
      description: "Haces un ataque cuerpo a cuerpo con arma. Si impacta, el objetivo queda envuelto en energía atronadora; si se mueve voluntariamente antes de tu próximo turno recibe 1d8 de daño de trueno. El daño extra crece con el nivel." },
    { name: "Crear Hoguera (Create Bonfire)", level: 0, school: "Conjuración", castingTime: "1 acción", range: "60 pies", components: "V, S", duration: "Concentración, hasta 1 minuto", known: false,
      description: "Creas una hoguera en un cubo de 5 pies. Quien esté en su espacio hace salvación de Destreza o recibe 1d8 de daño de fuego. El daño aumenta con el nivel." },
    { name: "Luces Danzantes (Dancing Lights)", level: 0, school: "Ilusión", castingTime: "1 acción", range: "120 pies", components: "V, S, M (fósforo)", duration: "Concentración, hasta 1 minuto", known: false,
      description: "Creas hasta cuatro luces del tamaño de antorchas que puedes mover con una acción adicional, o una forma luminosa vagamente humanoide." },
    { name: "Rayo de Fuego (Fire Bolt)", level: 0, school: "Evocación", castingTime: "1 acción", range: "120 pies", components: "V, S", duration: "Instantáneo", known: true,
      description: "Lanzas una mota de fuego. Ataque de conjuro a distancia; si impacta, 1d10 de daño de fuego. Objetos inflamables no llevados se incendian. Aumenta a 2d10 (nv5), 3d10 (nv11), 4d10 (nv17)." },
    { name: "Escarcha (Frostbite)", level: 0, school: "Evocación", castingTime: "1 acción", range: "60 pies", components: "V, S", duration: "Instantáneo", known: false,
      description: "Una criatura hace salvación de Constitución o recibe 1d6 de daño de frío y tiene desventaja en su próximo ataque con arma antes del final de su siguiente turno. El daño crece con el nivel." },
    { name: "Filo de Llama Verde (Green-Flame Blade)", level: 0, school: "Evocación", castingTime: "1 acción", range: "Personal (radio 5 pies)", components: "V, M (un arma)", duration: "Instantáneo", known: false,
      description: "Haces un ataque cuerpo a cuerpo; si impacta, llamas verdes saltan a otra criatura a 5 pies causándole daño de fuego. El salto de daño aumenta con el nivel." },
    { name: "Guía (Guidance)", level: 0, school: "Adivinación", castingTime: "1 acción", range: "Toque", components: "V, S", duration: "Concentración, hasta 1 minuto", known: false,
      description: "Una criatura voluntaria añade 1d4 a una prueba de característica de su elección antes de que acabe el conjuro." },
    { name: "Luz (Light)", level: 0, school: "Evocación", castingTime: "1 acción", range: "Toque", components: "V, M (una luciérnaga o musgo fosforescente)", duration: "1 hora", known: false,
      description: "Un objeto emite luz brillante en 20 pies y tenue otros 20. Salvación de Destreza para objetos sostenidos por otros." },
    { name: "Látigo Relámpago (Lightning Lure)", level: 0, school: "Evocación", castingTime: "1 acción", range: "Personal (radio 15 pies)", components: "V", duration: "Instantáneo", known: false,
      description: "Una criatura a 15 pies hace salvación de Fuerza o es atraída hasta 10 pies hacia ti; si acaba a 5 pies recibe 1d8 de daño de rayo. El daño crece con el nivel." },
    { name: "Mano de Mago (Mage Hand)", level: 0, school: "Conjuración", castingTime: "1 acción", range: "30 pies", components: "V, S", duration: "1 minuto", known: false,
      description: "Creas una mano espectral que manipula objetos, abre puertas, vierte contenidos, etc. Puede cargar hasta 10 libras." },
    { name: "Piedra Mágica (Magic Stone)", level: 0, school: "Transmutación", castingTime: "1 acción adicional", range: "Toque", components: "V, S", duration: "1 minuto", known: false,
      description: "Encantas hasta tres piedras. Tú u otro pueden lanzarlas: ataque de conjuro; si impacta 1d6 + mod. de aptitud de daño contundente." },
    { name: "Reparar (Mending)", level: 0, school: "Transmutación", castingTime: "1 minuto", range: "Toque", components: "V, S, M (dos piedras imán)", duration: "Instantáneo", known: true,
      description: "Repara una rotura o desgarro de hasta 30 cm en un objeto. Puede reparar físicamente un objeto mágico pero no le devuelve la magia perdida." },
    { name: "Mensaje (Message)", level: 0, school: "Transmutación", castingTime: "1 acción", range: "120 pies", components: "V, S, M (un trozo de alambre de cobre)", duration: "1 asalto", known: false,
      description: "Susurras un mensaje a una criatura que solo ella oye, y puede responderte en un susurro que solo tú oyes." },
    { name: "Rociada Venenosa (Poison Spray)", level: 0, school: "Nigromancia", castingTime: "1 acción", range: "10 pies", components: "V, S", duration: "Instantáneo", known: false,
      description: "Una criatura hace salvación de Constitución o recibe 1d12 de daño de veneno. El daño crece con el nivel." },
    { name: "Prestidigitación (Prestidigitation)", level: 0, school: "Transmutación", castingTime: "1 acción", range: "10 pies", components: "V, S", duration: "Hasta 1 hora", known: false,
      description: "Truco menor de magia: efectos sensoriales, encender/apagar, ensuciar/limpiar, calentar/enfriar, crear una baratija o marca, etc." },
    { name: "Rayo de Escarcha (Ray of Frost)", level: 0, school: "Evocación", castingTime: "1 acción", range: "60 pies", components: "V, S", duration: "Instantáneo", known: false,
      description: "Ataque de conjuro a distancia; si impacta 1d8 de daño de frío y la velocidad del objetivo baja 10 pies hasta tu próximo turno. El daño crece con el nivel." },
    { name: "Resistencia (Resistance)", level: 0, school: "Abjuración", castingTime: "1 acción", range: "Toque", components: "V, S, M (una capa en miniatura)", duration: "Concentración, hasta 1 minuto", known: false,
      description: "Una criatura voluntaria puede añadir 1d4 a una tirada de salvación de su elección antes de que acabe el conjuro." },
    { name: "Descarga Estremecedora (Shocking Grasp)", level: 0, school: "Evocación", castingTime: "1 acción", range: "Toque", components: "V, S", duration: "Instantáneo", known: false,
      description: "Ataque de conjuro cuerpo a cuerpo con ventaja si el objetivo lleva metal; si impacta 1d8 de daño de rayo y no puede usar reacciones hasta su próximo turno. El daño crece con el nivel." },
    { name: "Perdonar la Vida (Spare the Dying)", level: 0, school: "Nigromancia", castingTime: "1 acción", range: "Toque", components: "V, S", duration: "Instantáneo", known: false,
      description: "Tocas a una criatura con 0 PG y se estabiliza." },
    { name: "Estallido de Espada (Sword Burst)", level: 0, school: "Conjuración", castingTime: "1 acción", range: "Personal (radio 5 pies)", components: "V", duration: "Instantáneo", known: false,
      description: "Creas un anillo de hojas espectrales. Cada criatura a 5 pies (menos tú) hace salvación de Destreza o recibe 1d6 de daño de fuerza. El daño crece con el nivel." },
    { name: "Estruendo (Thunderclap)", level: 0, school: "Evocación", castingTime: "1 acción", range: "Personal (radio 5 pies)", components: "S", duration: "Instantáneo", known: false,
      description: "Una onda de sonido. Cada criatura a 5 pies (menos tú) hace salvación de Constitución o recibe 1d6 de daño de trueno. El daño crece con el nivel." },
    { name: "Doblar por los Muertos (Toll the Dead)", level: 0, school: "Nigromancia", castingTime: "1 acción", range: "60 pies", components: "V, S", duration: "Instantáneo", known: false,
      description: "Una criatura hace salvación de Sabiduría o recibe 1d8 de daño necrótico (1d12 si ya estaba herida). El daño crece con el nivel." },
  ],

  // ---- CONJUROS (lista completa de Artífice; marca "prepared": true) ----
  spells: [
    // ---------------- NIVEL 1 ----------------
    { name: "Absorber Elementos", level: 1, school: "Abjuración", castingTime: "1 reacción", range: "Personal", components: "S", duration: "1 asalto", prepared: true,
      description: "Al recibir daño de ácido, frío, fuego, rayo o trueno, ganas resistencia a ese daño hasta tu próximo turno y tu siguiente ataque cuerpo a cuerpo hace +1d6 de ese tipo. A niveles altos: +1d6 por nivel." },
    { name: "Alarma", level: 1, school: "Abjuración", castingTime: "1 minuto (ritual)", range: "30 pies", components: "V, S, M (una campanilla y alambre de plata)", duration: "8 horas", prepared: false,
      description: "Preparas una alarma en un área de 20 pies de cubo. Te avisa (mental o audible) si una criatura toca o entra en el área." },
    { name: "Catapulta", level: 1, school: "Transmutación", castingTime: "1 acción", range: "60 pies", components: "S", duration: "Instantáneo", prepared: false,
      description: "Un objeto de 1 a 5 libras sale disparado hacia un punto; si impacta a una criatura, salvación de Destreza o 3d8 de daño contundente. A niveles altos: +1d8 por nivel." },
    { name: "Curar Heridas", level: 1, school: "Evocación", castingTime: "1 acción", range: "Toque", components: "V, S", duration: "Instantáneo", prepared: true,
      description: "Una criatura que tocas recupera 1d8 + tu mod. de aptitud de PG. Sin efecto en muertos vivientes ni constructos. A niveles altos: +1d8 por nivel." },
    { name: "Detectar Magia", level: 1, school: "Adivinación", castingTime: "1 acción (ritual)", range: "Personal", components: "V, S", duration: "Concentración, hasta 10 minutos", prepared: true,
      description: "Percibes la presencia de magia a 30 pies. Con una acción ves un aura tenue alrededor de criaturas u objetos mágicos visibles y aprendes su escuela." },
    { name: "Disfrazarse", level: 1, school: "Ilusión", castingTime: "1 acción", range: "Personal", components: "V, S", duration: "1 hora", prepared: false,
      description: "Cambias tu apariencia (y equipo) hasta que acaba. La ilusión no soporta inspección táctil; quien sospeche puede investigar (prueba de Inteligencia vs tu CD)." },
    { name: "Retirada Expeditiva", level: 1, school: "Transmutación", castingTime: "1 acción adicional", range: "Personal", components: "V, S", duration: "Concentración, hasta 10 minutos", prepared: false,
      description: "Puedes usar la acción de Correr como acción adicional en cada turno mientras dure." },
    { name: "Fuego de Hadas", level: 1, school: "Evocación", castingTime: "1 acción", range: "60 pies", components: "V", duration: "Concentración, hasta 1 minuto", prepared: true,
      description: "Objetos y criaturas en un cubo de 20 pies quedan perfilados de luz (salvación de Destreza). Los ataques contra ellos tienen ventaja si el atacante los ve; no pueden beneficiarse de invisibilidad." },
    { name: "Vida Fingida", level: 1, school: "Nigromancia", castingTime: "1 acción", range: "Personal", components: "V, S, M (un poco de alcohol)", duration: "1 hora", prepared: false,
      description: "Ganas 1d4+4 PG temporales durante 1 hora. A niveles altos: +5 PG temporales por nivel." },
    { name: "Caída de Pluma", level: 1, school: "Transmutación", castingTime: "1 reacción", range: "60 pies", components: "V, M (una plumita)", duration: "1 minuto", prepared: false,
      description: "Hasta cinco criaturas que caen reducen su velocidad de caída y no reciben daño al aterrizar mientras dure." },
    { name: "Grasa", level: 1, school: "Conjuración", castingTime: "1 acción", range: "60 pies", components: "V, S, M (corteza de tocino o mantequilla)", duration: "1 minuto", prepared: false,
      description: "Cubres de grasa un cuadrado de 10 pies (terreno difícil). Quien esté al aparecer o entre en él hace salvación de Destreza o cae derribado." },
    { name: "Identificar", level: 1, school: "Adivinación", castingTime: "1 minuto (ritual)", range: "Toque", components: "V, S, M (una perla de 100 po y una pluma de búho)", duration: "Instantáneo", prepared: false,
      description: "Aprendes las propiedades de un objeto mágico y cómo usarlo, si requiere sintonía y cuántas cargas tiene, además de conjuros que lo afecten." },
    { name: "Salto", level: 1, school: "Transmutación", castingTime: "1 acción", range: "Toque", components: "V, S, M (pata trasera de saltamontes)", duration: "1 minuto", prepared: false,
      description: "La distancia de salto de la criatura tocada se triplica hasta que acaba." },
    { name: "Zancada Larga (Longstrider)", level: 1, school: "Transmutación", castingTime: "1 acción", range: "Toque", components: "V, S, M (una pizca de tierra)", duration: "1 hora", prepared: false,
      description: "La velocidad de la criatura tocada aumenta 10 pies durante el conjuro. A niveles altos: una criatura más por nivel." },
    { name: "Purificar Comida y Bebida", level: 1, school: "Transmutación", castingTime: "1 acción (ritual)", range: "10 pies", components: "V, S", duration: "Instantáneo", prepared: false,
      description: "Toda la comida y bebida no mágica en una esfera de 5 pies queda purificada y libre de veneno y enfermedad." },
    { name: "Santuario", level: 1, school: "Abjuración", castingTime: "1 acción adicional", range: "30 pies", components: "V, S, M (un espejito de plata)", duration: "1 minuto", prepared: false,
      description: "Proteges a una criatura: quien quiera atacarla hace salvación de Sabiduría o debe elegir otro objetivo. Se rompe si la criatura protegida ataca o lanza un conjuro dañino." },
    { name: "Trampa (Snare)", level: 1, school: "Abjuración", castingTime: "1 minuto", range: "Toque", components: "S, M (25 pies de cuerda)", duration: "8 horas", prepared: false,
      description: "Creas una trampa mágica en el suelo. La primera criatura Media o menor que pise queda colgada y apresada (salvación de Destreza), pudiendo repetir la salvación." },
    { name: "Brebaje Cáustico de Tasha", level: 1, school: "Evocación", castingTime: "1 acción", range: "30 pies", components: "V, S, M (un poco de ácido)", duration: "Concentración, hasta 1 minuto", prepared: false,
      description: "Una línea de 30 pies de ácido; salvación de Destreza o 2d4 de daño de ácido al inicio de cada turno. A niveles altos: +2d4 por nivel." },

    // ---------------- NIVEL 2 ----------------
    { name: "Auxilio (Aid)", level: 2, school: "Abjuración", castingTime: "1 acción", range: "30 pies", components: "V, S, M (una tira de tela)", duration: "8 horas", prepared: false,
      description: "Hasta tres criaturas aumentan sus PG máximos y actuales en 5 durante 8 horas. A niveles altos: +5 por nivel." },
    { name: "Alterarse (Alter Self)", level: 2, school: "Transmutación", castingTime: "1 acción", range: "Personal", components: "V, S", duration: "Concentración, hasta 1 hora", prepared: false,
      description: "Te transformas: adaptación acuática, cambio de apariencia o armas naturales. Puedes cambiar la opción con una acción mientras dure." },
    { name: "Cerradura Arcana (Arcane Lock)", level: 2, school: "Abjuración", castingTime: "1 acción", range: "Toque", components: "V, S, M (polvo de oro por 25 po)", duration: "Permanente", prepared: false,
      description: "Cierras mágicamente una puerta, cofre o similar. Solo tú y quienes designes lo abren libremente; la CD para forzarlo o abrir cerradura sube +10." },
    { name: "Difuminarse (Blur)", level: 2, school: "Ilusión", castingTime: "1 acción", range: "Personal", components: "V", duration: "Concentración, hasta 1 minuto", prepared: false,
      description: "Tu silueta se vuelve borrosa. Los ataques contra ti tienen desventaja salvo que el atacante no dependa de la vista o vea a través de ilusiones." },
    { name: "Llama Continua (Continual Flame)", level: 2, school: "Evocación", castingTime: "1 acción", range: "Toque", components: "V, S, M (rubí en polvo por 50 po)", duration: "Hasta que se disipe", prepared: false,
      description: "Creas una llama sin calor ni consumo que emite luz como una antorcha en un objeto. Puede cubrirse pero no ahogarse." },
    { name: "Visión en la Oscuridad (Darkvision)", level: 2, school: "Transmutación", castingTime: "1 acción", range: "Toque", components: "V, S, M (zanahorias o agáricas)", duration: "8 horas", prepared: false,
      description: "La criatura tocada obtiene visión en la oscuridad hasta 60 pies durante 8 horas." },
    { name: "Mejorar Característica (Enhance Ability)", level: 2, school: "Transmutación", castingTime: "1 acción", range: "Toque", components: "V, S, M (pelo o pluma de bestia)", duration: "Concentración, hasta 1 hora", prepared: false,
      description: "Otorgas a una criatura ventaja en pruebas de una característica elegida (y beneficios extra según la característica). A niveles altos: una criatura más por nivel." },
    { name: "Agrandar/Reducir (Enlarge/Reduce)", level: 2, school: "Transmutación", castingTime: "1 acción", range: "30 pies", components: "V, S, M (una pizca de hierro en polvo)", duration: "Concentración, hasta 1 minuto", prepared: false,
      description: "Agrandas (ventaja en Fuerza, +1d4 daño) o reduces (desventaja en Fuerza, -1d4 daño) a una criatura u objeto un tamaño." },
    { name: "Calentar Metal (Heat Metal)", level: 2, school: "Transmutación", castingTime: "1 acción", range: "60 pies", components: "V, S, M (una pieza de hierro y una llama)", duration: "Concentración, hasta 1 minuto", prepared: false,
      description: "Un objeto metálico se pone al rojo: 2d8 de daño de fuego y quien lo sostenga puede soltarlo o tener desventaja. Con acción adicional repites el daño. A niveles altos: +1d8 por nivel." },
    { name: "Invisibilidad (Invisibility)", level: 2, school: "Ilusión", castingTime: "1 acción", range: "Toque", components: "V, S, M (una pestaña en goma arábiga)", duration: "Concentración, hasta 1 hora", prepared: false,
      description: "Una criatura se vuelve invisible; termina si ataca o lanza un conjuro. A niveles altos: una criatura más por nivel." },
    { name: "Restablecimiento Menor (Lesser Restoration)", level: 2, school: "Abjuración", castingTime: "1 acción", range: "Toque", components: "V, S", duration: "Instantáneo", prepared: false,
      description: "Curas a la criatura tocada de una enfermedad o de una condición: ciega, sorda, paralizada o envenenada." },
    { name: "Levitar (Levitate)", level: 2, school: "Transmutación", castingTime: "1 acción", range: "60 pies", components: "V, S, M (hilo dorado o pata de saltamontes)", duration: "Concentración, hasta 10 minutos", prepared: false,
      description: "Una criatura u objeto (hasta 500 libras) flota hasta 20 pies y permanece suspendido. Puedes moverlo verticalmente con tu acción." },
    { name: "Boca Mágica (Magic Mouth)", level: 2, school: "Ilusión", castingTime: "1 minuto (ritual)", range: "30 pies", components: "V, S, M (panal y polvo de jade por 10 po)", duration: "Hasta que se disipe", prepared: false,
      description: "Implantas un mensaje en un objeto que se reproduce (hasta 10 s) cuando se cumple una condición que definas." },
    { name: "Arma Mágica (Magic Weapon)", level: 2, school: "Transmutación", castingTime: "1 acción adicional", range: "Toque", components: "V, S", duration: "Concentración, hasta 1 hora", prepared: false,
      description: "Un arma no mágica se vuelve mágica con +1 al ataque y daño. A niveles altos: +2 (nv4) o +3 (nv6)." },
    { name: "Protección contra Veneno (Protection from Poison)", level: 2, school: "Abjuración", castingTime: "1 acción", range: "Toque", components: "V, S", duration: "1 hora", prepared: false,
      description: "Neutralizas un veneno de la criatura tocada y le das ventaja en salvaciones contra veneno y resistencia al daño de veneno durante 1 hora." },
    { name: "Pirotecnia (Pyrotechnics)", level: 2, school: "Transmutación", castingTime: "1 acción", range: "60 pies", components: "V, S", duration: "Instantáneo", prepared: false,
      description: "Transformas una fuente de fuego en fuegos artificiales (criaturas cegadas) o en una nube de humo (oscurece el área)." },
    { name: "Truco de la Cuerda (Rope Trick)", level: 2, school: "Transmutación", castingTime: "1 acción", range: "Toque", components: "V, S, M (polvo de maíz y pergamino enrollado)", duration: "1 hora", prepared: false,
      description: "Una cuerda se alza y su extremo lleva a un espacio extradimensional donde caben hasta ocho criaturas Medianas durante 1 hora." },
    { name: "Ver Invisibilidad (See Invisibility)", level: 2, school: "Adivinación", castingTime: "1 acción", range: "Personal", components: "V, S, M (talco y polvo de plata)", duration: "1 hora", prepared: false,
      description: "Ves criaturas y objetos invisibles y percibes el plano Etéreo (en tono grisáceo) durante 1 hora." },
    { name: "Escritura Celeste (Skywrite)", level: 2, school: "Transmutación", castingTime: "1 acción (ritual)", range: "Ilimitado", components: "V, S", duration: "Concentración, hasta 1 día", prepared: false,
      description: "Haces aparecer hasta diez palabras formadas por nubes en el cielo, visibles a millas." },
    { name: "Trepar como Araña (Spider Climb)", level: 2, school: "Transmutación", castingTime: "1 acción", range: "Toque", components: "V, S, M (gota de asfalto y una araña)", duration: "Concentración, hasta 1 hora", prepared: false,
      description: "La criatura tocada puede trepar por superficies y techos con las manos libres, a su velocidad de trepar." },
    { name: "Telaraña (Web)", level: 2, school: "Conjuración", castingTime: "1 acción", range: "60 pies", components: "V, S, M (un poco de telaraña)", duration: "Concentración, hasta 1 hora", prepared: false,
      description: "Rellenas un cubo de 20 pies con telarañas (terreno difícil). Quien entre o empiece ahí hace salvación de Destreza o queda apresado." },

    // ---------------- NIVEL 3 ----------------
    { name: "Parpadeo (Blink)", level: 3, school: "Transmutación", castingTime: "1 acción", range: "Personal", components: "V, S", duration: "1 minuto", prepared: false,
      description: "Al final de tus turnos tira 1d20: con 11+ desapareces al plano Etéreo y regresas al inicio de tu próximo turno, evitando ataques mientras estás fuera." },
    { name: "Siesta (Catnap)", level: 3, school: "Encantamiento", castingTime: "1 acción", range: "30 pies", components: "S, M (una pizca de arena)", duration: "10 minutos", prepared: false,
      description: "Hasta tres criaturas voluntarias se duermen 10 minutos y obtienen el beneficio de un descanso corto." },
    { name: "Crear Comida y Agua", level: 3, school: "Conjuración", castingTime: "1 acción", range: "30 pies", components: "V, S", duration: "Instantáneo", prepared: false,
      description: "Creas 45 libras de comida y 30 galones de agua, suficientes para quince humanoides o cinco monturas durante 24 horas." },
    { name: "Disipar Magia (Dispel Magic)", level: 3, school: "Abjuración", castingTime: "1 acción", range: "120 pies", components: "V, S", duration: "Instantáneo", prepared: false,
      description: "Terminas un conjuro en una criatura, objeto o zona (nivel 3 o menor automáticamente; superiores con prueba de aptitud CD 10 + nivel)." },
    { name: "Arma Elemental (Elemental Weapon)", level: 3, school: "Transmutación", castingTime: "1 acción", range: "Toque", components: "V, S", duration: "Concentración, hasta 1 hora", prepared: false,
      description: "Un arma no mágica gana +1 al ataque y +1d4 de daño de un tipo elemental. A niveles altos aumenta el bonificador y el daño." },
    { name: "Flechas de Fuego (Flame Arrows)", level: 3, school: "Transmutación", castingTime: "1 acción", range: "Toque", components: "V, S", duration: "Concentración, hasta 1 hora", prepared: false,
      description: "Hasta 12 piezas de munición hacen +1d6 de daño de fuego al impactar. A niveles altos: 2 piezas más por nivel." },
    { name: "Volar (Fly)", level: 3, school: "Transmutación", castingTime: "1 acción", range: "Toque", components: "V, S, M (una pluma de ala)", duration: "Concentración, hasta 10 minutos", prepared: false,
      description: "La criatura tocada gana velocidad de vuelo de 60 pies. A niveles altos: una criatura más por nivel." },
    { name: "Glifo de Custodia (Glyph of Warding)", level: 3, school: "Abjuración", castingTime: "1 hora", range: "Toque", components: "V, S, M (incienso y polvo de diamante por 200 po)", duration: "Hasta que se disipe", prepared: false,
      description: "Inscribes un glifo que estalla (daño elemental) o almacena un conjuro cuando se cumple la condición de activación." },
    { name: "Prisa (Haste)", level: 3, school: "Transmutación", castingTime: "1 acción", range: "30 pies", components: "V, S, M (una viruta de raíz de regaliz)", duration: "Concentración, hasta 1 minuto", prepared: false,
      description: "Una criatura duplica su velocidad, +2 CA, ventaja en salvaciones de Destreza y una acción extra limitada. Al terminar queda aturdida 1 turno." },
    { name: "Fortaleza Intelectual (Intellect Fortress)", level: 3, school: "Abjuración", castingTime: "1 acción", range: "30 pies", components: "V", duration: "Concentración, hasta 1 hora", prepared: false,
      description: "Una criatura gana resistencia al daño psíquico y ventaja en salvaciones de Inteligencia, Sabiduría y Carisma." },
    { name: "Protección contra Energía (Protection from Energy)", level: 3, school: "Abjuración", castingTime: "1 acción", range: "Toque", components: "V, S", duration: "Concentración, hasta 1 hora", prepared: false,
      description: "La criatura tocada gana resistencia a un tipo de daño: ácido, frío, fuego, rayo o trueno." },
    { name: "Revivir (Revivify)", level: 3, school: "Nigromancia", castingTime: "1 acción", range: "Toque", components: "V, S, M (diamantes por 300 po, consumidos)", duration: "Instantáneo", prepared: false,
      description: "Devuelves la vida (con 1 PG) a una criatura muerta hace menos de 1 minuto. No restaura miembros ni cura de vejez." },
    { name: "Enviar Mensaje (Sending)", level: 3, school: "Evocación", castingTime: "1 acción", range: "Ilimitado", components: "V, S, M (alambre de cobre fino)", duration: "1 asalto", prepared: false,
      description: "Envías un mensaje de 25 palabras a una criatura conocida en cualquier lugar; puede responder de inmediato." },
    { name: "Sirviente Diminuto (Tiny Servant)", level: 3, school: "Transmutación", castingTime: "1 minuto", range: "Toque", components: "V, S", duration: "8 horas", prepared: false,
      description: "Animas hasta dos objetos Diminutos que obedecen tus órdenes y actúan como sirvientes durante 8 horas. A niveles altos: más objetos." },
    { name: "Respirar bajo el Agua (Water Breathing)", level: 3, school: "Transmutación", castingTime: "1 acción (ritual)", range: "30 pies", components: "V, S, M (una caña corta o paja)", duration: "24 horas", prepared: false,
      description: "Hasta diez criaturas pueden respirar bajo el agua durante 24 horas." },
    { name: "Caminar sobre el Agua (Water Walk)", level: 3, school: "Transmutación", castingTime: "1 acción (ritual)", range: "30 pies", components: "V, S, M (un trozo de corcho)", duration: "1 hora", prepared: false,
      description: "Hasta diez criaturas pueden moverse sobre superficies líquidas como si fueran terreno sólido." },

    // ---------------- NIVEL 4 ----------------
    { name: "Ojo Arcano (Arcane Eye)", level: 4, school: "Adivinación", castingTime: "1 acción", range: "30 pies", components: "V, S, M (un poco de piel de murciélago)", duration: "Concentración, hasta 1 hora", prepared: false,
      description: "Creas un ojo flotante invisible que mueves 30 pies por turno y a través de él ves (con visión en la oscuridad 30 pies)." },
    { name: "Perdición Elemental (Elemental Bane)", level: 4, school: "Transmutación", castingTime: "1 acción", range: "90 pies", components: "V, S", duration: "Concentración, hasta 1 minuto", prepared: false,
      description: "Una criatura hace salvación de Constitución o pierde su resistencia a un tipo de daño elegido y recibe +2d6 de ese daño la primera vez que la golpean por turno." },
    { name: "Fabricar (Fabricate)", level: 4, school: "Transmutación", castingTime: "10 minutos", range: "120 pies", components: "V, S", duration: "Instantáneo", prepared: false,
      description: "Conviertes materias primas en productos acabados (p. ej. madera en un puente, tela en ropa) del tamaño permitido." },
    { name: "Libertad de Movimiento (Freedom of Movement)", level: 4, school: "Abjuración", castingTime: "1 acción", range: "Toque", components: "V, S, M (una correa de cuero)", duration: "1 hora", prepared: false,
      description: "La criatura tocada ignora el terreno difícil, no puede quedar apresada ni paralizada por magia, y puede gastar 5 pies para escapar de sujeciones no mágicas." },
    { name: "Esfera Resistente de Otiluke", level: 4, school: "Evocación", castingTime: "1 acción", range: "30 pies", components: "V, S, M (una hemiesfera de cuarzo y una de cristal)", duration: "Concentración, hasta 1 minuto", prepared: false,
      description: "Una esfera de fuerza rodea a una criatura u objeto; nada la atraviesa. Puedes rodarla la mitad de tu velocidad." },
    { name: "Moldear Piedra (Stone Shape)", level: 4, school: "Transmutación", castingTime: "1 acción", range: "Toque", components: "V, S, M (arcilla blanda)", duration: "Instantáneo", prepared: false,
      description: "Moldeas un objeto de piedra (hasta 5 pies) con la forma que desees: una puerta, un arma tosca, etc." },
    { name: "Piel Pétrea (Stoneskin)", level: 4, school: "Abjuración", castingTime: "1 acción", range: "Toque", components: "V, S, M (polvo de diamante por 100 po)", duration: "Concentración, hasta 1 hora", prepared: false,
      description: "La criatura tocada gana resistencia al daño contundente, perforante y cortante no mágico." },
    { name: "Convocar Constructo (Summon Construct)", level: 4, school: "Conjuración", castingTime: "1 acción", range: "90 pies", components: "V, S, M (una estatuilla de 400 po)", duration: "Concentración, hasta 1 hora", prepared: false,
      description: "Invocas un espíritu constructo que lucha a tus órdenes; sus estadísticas escalan con el nivel de espacio usado." },
    { name: "Convocar Elemental (Summon Elemental)", level: 4, school: "Conjuración", castingTime: "1 acción", range: "90 pies", components: "V, S, M (agua, tierra, humo y llama en un cofrecito de 400 po)", duration: "Concentración, hasta 1 hora", prepared: false,
      description: "Invocas un espíritu elemental (aire, tierra, fuego o agua) que combate bajo tu control durante el conjuro." },

    // ---------------- NIVEL 5 ----------------
    { name: "Animar Objetos (Animate Objects)", level: 5, school: "Transmutación", castingTime: "1 acción", range: "120 pies", components: "V, S", duration: "Concentración, hasta 1 minuto", prepared: false,
      description: "Cobras vida a hasta diez objetos no mágicos que atacan a tus órdenes. Objetos más pequeños son más numerosos pero débiles." },
    { name: "Mano de Bigby (Arcane Hand)", level: 5, school: "Evocación", castingTime: "1 acción", range: "120 pies", components: "V, S, M (cáscara de huevo y un guante de serpiente)", duration: "Concentración, hasta 1 minuto", prepared: false,
      description: "Creas una mano de fuerza Grande que golpea, empuja, agarra o te protege según la acción que uses cada turno." },
    { name: "Creación (Creation)", level: 5, school: "Ilusión", castingTime: "1 minuto", range: "30 pies", components: "V, S, M (un trozo de la materia a crear)", duration: "Especial", prepared: false,
      description: "Creas un objeto de materia vegetal o mineral. Cuanto más duradero el material, menos dura el objeto." },
    { name: "Restablecimiento Mayor (Greater Restoration)", level: 5, school: "Abjuración", castingTime: "1 acción", range: "Toque", components: "V, S, M (polvo de diamante por 100 po, consumido)", duration: "Instantáneo", prepared: false,
      description: "Reduces el agotamiento un nivel o eliminas un efecto: hechizado, petrificado, una maldición, reducción de característica o de PG máximos." },
    { name: "Potenciar Habilidad (Skill Empowerment)", level: 5, school: "Transmutación", castingTime: "1 acción", range: "Toque", components: "V, S", duration: "Concentración, hasta 1 hora", prepared: false,
      description: "Una criatura competente en una habilidad gana pericia (dobla su bonificador de competencia) en ella durante el conjuro." },
    { name: "Muro de Piedra (Wall of Stone)", level: 5, school: "Evocación", castingTime: "1 acción", range: "120 pies", components: "V, S, M (un pequeño bloque de granito)", duration: "Concentración, hasta 10 minutos", prepared: false,
      description: "Creas un muro de piedra de hasta diez paneles de 10x10 pies. Si se mantiene 10 minutos se vuelve permanente." },
  ],

  // ---- Rasgos de clase / subclase ----
  features: [
    {
      name: "Magia de Artesano (Tinker's Magic)",
      source: "Artífice 1",
      description:
        "Con herramientas de ladrón o de artesano en la mano puedes imbuir un objeto Diminuto no mágico con una propiedad menor. Puedes tener hasta tu modificador de Inteligencia de objetos afectados a la vez. Pulsa el botón para ver todo lo que puedes crear.",
      creations: [
        "Luz: el objeto emite luz brillante en un radio de 5 pies y luz tenue otros 5 pies.",
        "Mensaje grabado: al tocarlo reproduce un mensaje hablado de hasta 6 segundos.",
        "Sonido continuo: emite un sonido concreto no musical (olas, viento, chasquidos...).",
        "Olor: despide un olor a tu elección (perfume, humo, tierra mojada...).",
        "Efecto visual estático: muestra una imagen fija o hasta 25 palabras de texto.",
      ],
    },
    {
      name: "Lanzamiento de Conjuros",
      source: "Artífice 1",
      description:
        "Usas Inteligencia para tus conjuros de artífice. Siempre tienes un foco de lanzamiento (herramientas de ladrón o de artesano) en la mano para lanzar. Preparas un número de conjuros igual a tu modificador de Inteligencia + la mitad de tu nivel de artífice (redondeando hacia abajo).",
    },
    {
      name: "Infundir Objeto",
      source: "Artífice 2",
      description:
        "Puedes imbuir objetos mundanos con magia. A nivel 4 conoces 4 infusiones y puedes tener 2 objetos infundidos activos a la vez (ver la pestaña Objetos). Las infusiones se transfieren al terminar un descanso largo.",
    },
    {
      name: "La Herramienta Adecuada",
      source: "Artífice 3",
      description:
        "Con herramientas de ladrón o de artesano en la mano puedes crear mágicamente un juego de herramientas de artesano en un espacio libre a 5 pies durante 1 hora. Las herramientas desaparecen tras 8 horas o al volver a usar este rasgo.",
    },
    {
      name: "Preparado para la Batalla (Battle Ready)",
      source: "Herrero de Guerra 3",
      description:
        "Ganas competencia con armas marciales. Cuando atacas con un arma mágica puedes usar tu modificador de Inteligencia en lugar de Fuerza o Destreza para las tiradas de ataque y de daño.",
    },
    {
      name: "Compañero de Acero (Steel Defender)",
      source: "Herrero de Guerra 3",
      description:
        "Construyes un fiel autómata que lucha a tu lado. Comparte tu iniciativa (pero actúa justo después de ti) y obedece tus órdenes. Consulta su bloque de estadísticas más abajo.",
    },
    {
      name: "Mejora de Puntuación de Característica",
      source: "Artífice 4",
      description:
        "Aumentas una puntuación de característica en 2, o dos en 1 cada una (máx 20). Esta construcción metió +2 en Inteligencia.",
    },
  ],

  // ---- Infusiones conocidas (marca hasta 2 con active:true en la app) ----
  // A nivel 4 conoces 4 infusiones y puedes tener 2 activas a la vez.
  infusions: [
    {
      name: "Bolsa de Contención (Replicar Objeto Mágico)",
      requiresAttunement: false,
      description:
        "Réplica de una Bolsa de Contención: su interior es un espacio extradimensional que aguanta hasta 500 libras sin exceder 64 pies cúbicos, pesando siempre 15 libras. Sacar un objeto es una acción.",
    },
    {
      name: "Defensa Mejorada — Escudo +1",
      requiresAttunement: false,
      description:
        "Un escudo (o armadura) infundido otorga +1 a la CA. Aplicado a tu escudo, tu Clase de Armadura aumenta en 1 mientras la infusión esté activa.",
    },
    {
      name: "Arma Mejorada — Arma +1",
      requiresAttunement: false,
      description:
        "Un arma sencilla o marcial infundida otorga +1 a las tiradas de ataque y de daño hechas con ella. Al ser mágica, puedes usar Inteligencia con ella gracias a Preparado para la Batalla.",
    },
    {
      name: "Jarra de Alquimia (Replicar Objeto Mágico)",
      requiresAttunement: false,
      description:
        "Réplica de una Jarra de Alquimia: con una acción puedes ordenarle producir un líquido (agua dulce, cerveza, vino, aceite, vinagre, agua salada, miel o mayonesa) hasta un límite diario por tipo.",
    },
  ],

  // ---- Objetos mágicos (edítalos tú; se muestran con su descripción) ----
  magicItems: [
    {
      name: "Objeto Mágico (edítame en character-data.js)",
      attunement: "Requiere sintonización",
      description:
        "Aquí va la descripción de tu objeto mágico. Cambia el nombre, la sintonización y este texto en el archivo character-data.js cuando lo tengas definido. Se mostrará tal cual y podrás pulsarlo para ver el texto completo.",
    },
  ],

  // ---- Compañero de Acero (Steel Defender) ----
  steelDefender: {
    name: "Compañero de Acero",
    size: "Constructo Mediano",
    armorClass: 15, // 15 = 12 + Comp. x2. Editable.
    hitPoints: 27, // 2 + tu mod. Int + cinco veces tu nivel de artífice
    speed: "40 pies",
    abilities: { str: 14, dex: 12, con: 14, int: 4, wis: 10, cha: 6 },
    savingThrows: "Des +3, Con +4 (suma tu bono de competencia en las que sea competente)",
    damageImmunities: "veneno",
    conditionImmunities: "hechizado, agotamiento, envenenado",
    senses: "visión en la oscuridad 60 pies, Percepción pasiva 12",
    traits: [
      { name: "Vigilante", description: "El Compañero de Acero no puede ser sorprendido." },
      { name: "Diligente", description: "Realiza la acción de Esquivar en su turno si no le ordenas otra acción." },
    ],
    actions: [
      { name: "Desgarro Potenciado por Fuerza", description: "Ataque de arma cuerpo a cuerpo: tu modificador de ataque de conjuro para impactar, alcance 5 pies, un objetivo. Impacto: 1d8 + BC de daño de fuerza." },
      { name: "Reparar (3/día)", description: "El compañero restaura 2d8 + BC PG a sí mismo o a otro constructo u objeto a 5 pies." },
      { name: "Desviar Ataque (Reacción)", description: "Impone desventaja a la tirada de ataque de una criatura que vea a 5 pies, siempre que el ataque sea contra otra criatura distinta del compañero." },
    ],
  },
}
