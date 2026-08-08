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
  // maxPrepared se calcula automáticamente = mod. Int + mitad del nivel de Artífice (redondeado hacia abajo).
  // maxCantrips = número de trucos que conoces a este nivel.
  spellcasting: {
    ability: "int",
    spellSlots: { 1: 3 }, // Artífice nivel 4 = tres espacios de nivel 1
    maxCantrips: 2,
  },

  // ---- TRUCOS (marca "known": true los que conoces, máx = maxCantrips) ----
  cantrips: [    { name: "Reparar", level: 0, school: "Transmutación", known: true, alwaysKnown: true, description: "Reparas una rotura o desgarro en un objeto que toques, dentro de los límites del conjuro." },

    { name: "Salpicadura Ácida", level: 0, school: "Evocación", known: false, description: "" },
    { name: "Luces Danzantes", level: 0, school: "Ilusión", known: false, description: "" },
    { name: "Elementalismo", level: 0, school: "Transmutación", known: false, description: "" },
    { name: "Rayo de Fuego", level: 0, school: "Evocación", known: true, description: "" },
    { name: "Guía", level: 0, school: "Adivinación", known: false, description: "" },
    { name: "Luz", level: 0, school: "Evocación", known: false, description: "" },
    { name: "Mano de Mago", level: 0, school: "Conjuración", known: false, description: "" },
    { name: "Mensaje", level: 0, school: "Transmutación", known: false, description: "" },
    { name: "Rociada Venenosa", level: 0, school: "Nigromancia", known: false, description: "" },
    { name: "Prestidigitación", level: 0, school: "Transmutación", known: false, description: "" },
    { name: "Rayo de Escarcha", level: 0, school: "Evocación", known: false, description: "" },
    { name: "Resistencia", level: 0, school: "Abjuración", known: false, description: "" },
    { name: "Descarga Estremecedora", level: 0, school: "Evocación", known: false, description: "" },
    { name: "Perdonar la Vida", level: 0, school: "Nigromancia", known: false, description: "" },
    { name: "Látigo de Espinas", level: 0, school: "Transmutación", known: false, description: "" },
    { name: "Estruendo", level: 0, school: "Evocación", known: false, description: "" },
    { name: "Ataque Certero", level: 0, school: "Adivinación", known: false, description: "" },
  ],

  // ---- CONJUROS (lista completa de Artífice; marca "prepared": true) ----
  // Puedes añadir conjuros de cualquier nivel: la web crea automáticamente su pestaña.
  spells: [
    // Conjuros adicionales del Herrero de Guerra: siempre preparados y se desbloquean por nivel.
    { name: "Heroísmo", level: 1, school: "Encantamiento", alwaysPrepared: true, minArtificerLevel: 3, subclass: "Herrero de Guerra", prepared: true, description: "Tú o una criatura voluntaria que puedas ver dentro del alcance obtiene inmunidad a estar asustada y, mientras dure el conjuro, gana una reserva de puntos de golpe temporales que se recuperan al inicio de cada uno de sus turnos. El conjuro requiere concentración y dura hasta 1 minuto.", castingTime: "1 acción", range: "Toque", components: "V, M", duration: "Concentración, hasta 1 minuto" },
    { name: "Escudo", level: 1, school: "Abjuración", alwaysPrepared: true, minArtificerLevel: 3, subclass: "Herrero de Guerra", prepared: true, description: "Una barrera invisible de fuerza mágica aparece para protegerte cuando una criatura te impacta con un ataque o eres objetivo de Misil Mágico. Como reacción, obtienes un bonificador de +5 a la Clase de Armadura hasta el comienzo de tu siguiente turno y el efecto bloquea los proyectiles de Misil Mágico durante ese tiempo.", castingTime: "1 reacción", range: "Personal", components: "V, S", duration: "Hasta el comienzo de tu siguiente turno" },
    { name: "Golpe Radiante", level: 2, school: "Evocación", alwaysPrepared: true, minArtificerLevel: 5, subclass: "Herrero de Guerra", prepared: true, description: "Como acción adicional, haces que el próximo impacto con un arma durante la duración del conjuro inflija daño radiante adicional y produzca el efecto propio de Golpe Radiante. Requiere concentración y utiliza un espacio de nivel 2 o superior según corresponda a las reglas del conjuro.", castingTime: "1 acción adicional", range: "Personal", components: "V", duration: "Concentración, hasta 1 minuto" },
    { name: "Vínculo Protector", level: 2, school: "Abjuración", alwaysPrepared: true, minArtificerLevel: 5, subclass: "Herrero de Guerra", prepared: true, description: "Vinculas a dos criaturas voluntarias que estén dentro del alcance. Mientras permanezcan dentro de la distancia indicada, cada objetivo obtiene un bonificador a las tiradas de salvación y a la Clase de Armadura, y cuando uno de ellos recibe daño, el otro puede recibir parte de ese daño. El conjuro requiere concentración y tiene una duración limitada.", castingTime: "1 acción", range: "30 pies", components: "V, S, M", duration: "1 hora" },
    { name: "Aura de Vitalidad", level: 3, school: "Evocación", alwaysPrepared: true, minArtificerLevel: 9, subclass: "Herrero de Guerra", prepared: true, description: "Creas una aura de energía curativa a tu alrededor. Hasta que termine el conjuro, puedes usar una acción adicional en tus turnos para restaurar puntos de golpe a una criatura dentro del alcance del aura. Requiere concentración.", castingTime: "1 acción", range: "Personal", components: "V", duration: "Concentración, hasta 1 minuto" },
    { name: "Conjurar Bombardeo", level: 3, school: "Conjuración", alwaysPrepared: true, minArtificerLevel: 9, subclass: "Herrero de Guerra", prepared: true, description: "Creas una lluvia de proyectiles mágicos que cae sobre un punto que puedas ver. Las criaturas de la zona deben superar la salvación indicada por el conjuro o sufrir daño, y las que tengan éxito reciben la mitad. El efecto usa el daño y el área especificados por las reglas del conjuro.", castingTime: "1 acción", range: "150 pies", components: "V, S, M", duration: "Instantánea" },
    { name: "Aura de Pureza", level: 4, school: "Abjuración", alwaysPrepared: true, minArtificerLevel: 13, subclass: "Herrero de Guerra", prepared: true, description: "Una aura protectora se extiende desde ti. Las criaturas voluntarias que permanezcan dentro del aura obtienen resistencia a veneno y ventaja en las tiradas de salvación contra efectos que las enfermen o impongan ciertas condiciones, mientras mantengas la concentración.", castingTime: "1 acción", range: "Personal", components: "V", duration: "Concentración, hasta 10 minutos" },
    { name: "Escudo de Fuego", level: 4, school: "Evocación", alwaysPrepared: true, minArtificerLevel: 13, subclass: "Herrero de Guerra", prepared: true, description: "Una capa de llamas mágicas te envuelve. Eliges entre fuego cálido o llamas frías, obteniendo resistencia al tipo de daño correspondiente y haciendo daño de fuego o frío a una criatura que te impacte con un ataque cuerpo a cuerpo.", castingTime: "1 acción", range: "Personal", components: "V, S, M", duration: "10 minutos" },
    { name: "Golpe Desterrador", level: 5, school: "Conjuración", alwaysPrepared: true, minArtificerLevel: 17, subclass: "Herrero de Guerra", prepared: true, description: "La próxima vez que impactes con un ataque de arma durante la duración, el objetivo sufre daño de fuerza adicional y, si queda con una cantidad reducida de puntos de golpe, puede ser desterrado temporalmente a un plano inofensivo hasta que termine el conjuro.", castingTime: "1 acción adicional", range: "Personal", components: "V", duration: "Concentración, hasta 1 minuto" },
    { name: "Curar Heridas en Masa", level: 5, school: "Conjuración", alwaysPrepared: true, minArtificerLevel: 17, subclass: "Herrero de Guerra", prepared: true, description: "Liberas energía curativa que restaura puntos de golpe a hasta seis criaturas que puedas ver dentro del alcance. Cada objetivo recupera una cantidad de puntos de golpe determinada por la tirada del conjuro y tu modificador de aptitud mágica.", castingTime: "1 acción", range: "60 pies", components: "V, S", duration: "Instantánea" },
    { name: "Alarma", level: 1, school: "Abjuración", prepared: false, description: "" },
    { name: "Curar Heridas", level: 1, school: "Abjuración", prepared: true, description: "" },
    { name: "Detectar Magia", level: 1, school: "Adivinación", prepared: true, description: "" },
    { name: "Disfrazarse", level: 1, school: "Ilusión", prepared: false, description: "" },
    { name: "Retirada Expeditiva", level: 1, school: "Transmutación", prepared: false, description: "" },
    { name: "Fuego de Hadas", level: 1, school: "Evocación", prepared: true, description: "" },
    { name: "Vida Fingida", level: 1, school: "Nigromancia", prepared: false, description: "" },
    { name: "Caída de Pluma", level: 1, school: "Transmutación", prepared: false, description: "" },
    { name: "Grasa", level: 1, school: "Conjuración", prepared: false, description: "" },
    { name: "Identificar", level: 1, school: "Adivinación", prepared: false, description: "" },
    { name: "Salto", level: 1, school: "Transmutación", prepared: false, description: "" },
    { name: "Zancada Larga", level: 1, school: "Transmutación", prepared: false, description: "" },
    { name: "Purificar Comida y Bebida", level: 1, school: "Transmutación", prepared: false, description: "" },
    { name: "Santuario", level: 1, school: "Abjuración", prepared: false, description: "" },
    { name: "Auxilio", level: 2, school: "Abjuración", prepared: false, description: "" },
    { name: "Alterar el Yo", level: 2, school: "Transmutación", prepared: false, description: "" },
    { name: "Cerradura Arcana", level: 2, school: "Abjuración", prepared: false, description: "" },
    { name: "Vigor Arcano", level: 2, school: "Abjuración", prepared: false, description: "" },
    { name: "Difuminarse", level: 2, school: "Ilusión", prepared: false, description: "" },
    { name: "Llama Continua", level: 2, school: "Evocación", prepared: false, description: "" },
    { name: "Visión en la Oscuridad", level: 2, school: "Transmutación", prepared: false, description: "" },
    { name: "Aliento de Dragón", level: 2, school: "Transmutación", prepared: false, description: "" },
    { name: "Mejorar Característica", level: 2, school: "Transmutación", prepared: false, description: "" },
    { name: "Agrandar/Reducir", level: 2, school: "Transmutación", prepared: false, description: "" },
    { name: "Calentar Metal", level: 2, school: "Transmutación", prepared: false, description: "" },
    { name: "Servidor Homúnculo", level: 2, school: "Conjuración", prepared: false, description: "" },
    { name: "Invisibilidad", level: 2, school: "Ilusión", prepared: false, description: "" },
    { name: "Restablecimiento Menor", level: 2, school: "Abjuración", prepared: false, description: "" },
    { name: "Levitar", level: 2, school: "Transmutación", prepared: false, description: "" },
    { name: "Boca Mágica", level: 2, school: "Ilusión", prepared: false, description: "" },
    { name: "Arma Mágica", level: 2, school: "Transmutación", prepared: false, description: "" },
    { name: "Protección contra el Veneno", level: 2, school: "Abjuración", prepared: false, description: "" },
    { name: "Truco de la Cuerda", level: 2, school: "Transmutación", prepared: false, description: "" },
    { name: "Ver Invisibilidad", level: 2, school: "Adivinación", prepared: false, description: "" },
    { name: "Trepar como una Araña", level: 2, school: "Transmutación", prepared: false, description: "" },
    { name: "Caparazón de Tortuga", level: 2, school: "Abjuración", prepared: false, description: "" },
    { name: "Telaraña", level: 2, school: "Conjuración", prepared: false, description: "" },
    { name: "Parpadeo", level: 3, school: "Transmutación", prepared: false, description: "" },
    { name: "Crear Comida y Agua", level: 3, school: "Conjuración", prepared: false, description: "" },
    { name: "Disipar Magia", level: 3, school: "Abjuración", prepared: false, description: "" },
    { name: "Arma Elemental", level: 3, school: "Transmutación", prepared: false, description: "" },
    { name: "Volar", level: 3, school: "Transmutación", prepared: false, description: "" },
    { name: "Glifo de Custodia", level: 3, school: "Abjuración", prepared: false, description: "" },
    { name: "Prisa", level: 3, school: "Transmutación", prepared: false, description: "" },
    { name: "Protección contra la Energía", level: 3, school: "Abjuración", prepared: false, description: "" },
    { name: "Revivir", level: 3, school: "Nigromancia", prepared: false, description: "" },
    { name: "Respirar bajo el Agua", level: 3, school: "Transmutación", prepared: false, description: "" },
    { name: "Caminar sobre el Agua", level: 3, school: "Transmutación", prepared: false, description: "" },
    { name: "Ojo Arcano", level: 4, school: "Adivinación", prepared: false, description: "" },
    { name: "Fabricar", level: 4, school: "Transmutación", prepared: false, description: "" },
    { name: "Libertad de Movimiento", level: 4, school: "Abjuración", prepared: false, description: "" },
    { name: "Cofre Secreto de Leomund", level: 4, school: "Conjuración", prepared: false, description: "" },
    { name: "Sabueso Fiel de Mordenkainen", level: 4, school: "Conjuración", prepared: false, description: "" },
    { name: "Santuario Privado de Mordenkainen", level: 4, school: "Abjuración", prepared: false, description: "" },
    { name: "Esfera Resistente de Otiluke", level: 4, school: "Abjuración", prepared: false, description: "" },
    { name: "Moldear Piedra", level: 4, school: "Transmutación", prepared: false, description: "" },
    { name: "Piel Pétrea", level: 4, school: "Transmutación", prepared: false, description: "" },
    { name: "Convocar Constructo", level: 4, school: "Conjuración", prepared: false, description: "" },
    { name: "Animar Objetos", level: 5, school: "Transmutación", prepared: false, description: "" },
    { name: "Mano de Bigby", level: 5, school: "Evocación", prepared: false, description: "" },
    { name: "Círculo de Poder", level: 5, school: "Abjuración", prepared: false, description: "" },
    { name: "Creación", level: 5, school: "Ilusión", prepared: false, description: "" },
    { name: "Restablecimiento Mayor", level: 5, school: "Abjuración", prepared: false, description: "" },
    { name: "Muro de Piedra", level: 5, school: "Evocación", prepared: false, description: "" },
  ],

  magicItemPlans: [
    // Artífice 2+
    { name: "Jarra de Alquimia", minLevel: 2, attunement: "No", known: false, description: "Como acción, puedes nombrar un líquido y hacer que la jarra produzca una cantidad limitada de ese líquido, con restricciones sobre qué líquidos puede crear y en qué cantidades. Una vez que la jarra empieza a producir un líquido, puedes volver a elegir otro mediante la acción indicada por el objeto. El líquido aparece a través de su abertura y sigue las propiedades normales de ese líquido." },
    { name: "Bolsa de Contención", minLevel: 2, attunement: "No", known: false, description: "El interior de la bolsa es un espacio extradimensional. Puede contener hasta 500 libras de materia, con un volumen interior limitado, y siempre que no excedas su capacidad puedes guardar o sacar objetos de ella. Si la bolsa se perfora, se rasga o se sobrecarga, se rompe y sus contenidos se pierden según las reglas del objeto. Si un efecto de Replicar Objeto Mágico hace que la bolsa desaparezca, sus contenidos aparecen de forma segura en su espacio." },
    { name: "Gorra de Respiración Acuática", minLevel: 2, attunement: "No", known: false, description: "Mientras llevas puesta la gorra puedes respirar bajo el agua. No necesitas quitarla para respirar normalmente en el aire." },
    { name: "Objeto mágico común no maldito que no sea poción ni pergamino", minLevel: 2, attunement: "Varía", known: false, repeatable: true, description: "Puedes elegir un objeto mágico común que no sea una poción, un pergamino ni un objeto maldito. Cada objeto concreto que elijas cuenta como un plan diferente. La sintonización depende del objeto elegido." },
    { name: "Gafas de Noche", minLevel: 2, attunement: "No", known: false, description: "Mientras las llevas puestas, puedes ver en la oscuridad hasta 60 pies como si fuera luz tenue y en la luz tenue como si fuera luz brillante. No cambia la capacidad de distinguir colores en la oscuridad." },
    { name: "Herramienta Multifunción", minLevel: 2, attunement: "Sí", known: false, description: "Objeto maravilloso común que requiere sintonización. Como acción Mágica puedes transformarlo en un tipo de herramientas de artesano que elijas. Sea cual sea su forma, eres competente con las herramientas cuando las utilizas." },
    { name: "Disparo Repetitivo", minLevel: 2, attunement: "Sí", known: false, description: "Arma con la propiedad Munición que concede un +1 a las tiradas de ataque y daño realizadas con ella y permite ignorar la propiedad Carga. Si no tiene munición, crea automáticamente una pieza de munición mágica cuando haces un ataque a distancia; esa munición desaparece inmediatamente después de impactar o fallar." },
    { name: "Arma Retornante", minLevel: 2, attunement: "No", known: false, description: "Arma con la propiedad Arrojadiza que concede un +1 a las tiradas de ataque y daño. Después de realizar con ella un ataque a distancia, vuelve inmediatamente a tu mano." },
    { name: "Cuerda Trepadora", minLevel: 2, attunement: "No", known: false, description: "Cuerda de 60 pies que puede moverse y fijarse mágicamente cuando se le da la orden adecuada. Puede trepar por superficies y facilitar el ascenso, y una vez asegurada puede soportar el peso permitido por el objeto. Resulta especialmente útil para salvar desniveles sin tener que escalar manualmente toda la distancia." },
    { name: "Piedras Mensajeras", minLevel: 2, attunement: "No", known: false, description: "Dos piedras mágicas forman un par. Mientras sostienes una piedra puedes usarla para enviar un mensaje breve a la criatura que sostiene la otra piedra, siempre que esté dentro del alcance permitido por el objeto. La respuesta puede recibirse de la misma manera. Una piedra deja de funcionar para este propósito si se encuentra fuera de las condiciones de uso del objeto." },
    { name: "Escudo +1", minLevel: 2, attunement: "No", known: false, description: "Escudo mágico que proporciona un bonificador adicional de +1 a la Clase de Armadura además del +2 normal de un escudo. No requiere sintonización." },
    { name: "Varita de Detección de Magia", minLevel: 2, attunement: "No", known: false, description: "La varita tiene 3 cargas. Puedes gastar 1 carga para lanzar Detectar Magia desde ella. Recupera 1d3 cargas gastadas diariamente al amanecer y desaparece si gastas la última carga, según las reglas del objeto." },
    { name: "Varita de Secretos", minLevel: 2, attunement: "No", known: false, description: "La varita tiene 3 cargas. Puedes gastar 1 carga para señalar la dirección del objeto oculto o puerta secreta más cercana dentro de su alcance, si existe. Recupera 1d3 cargas gastadas diariamente al amanecer y desaparece si gasta la última carga." },
    { name: "Varita del Mago de Guerra +1", minLevel: 2, attunement: "Sí", known: false, description: "Requiere sintonización. Mientras la sostienes, obtienes un bonificador de +1 a las tiradas de ataque de tus conjuros." },
    { name: "Arma +1", minLevel: 2, attunement: "No", known: false, description: "Arma mágica que concede un bonificador de +1 a las tiradas de ataque y daño realizadas con ella. No requiere sintonización." },
    { name: "Vendajes de Poder Desarmado +1", minLevel: 2, attunement: "No", known: false, description: "Protecciones mágicas para las manos que mejoran tus ataques desarmados. Conceden un bonificador de +1 a las tiradas de ataque y daño de tus ataques desarmados y cuentan como objeto mágico para los efectos que interactúan con armas o ataques mágicos." },

    // Artífice 6+
    { name: "Armadura +1", minLevel: 6, attunement: "No", known: false, description: "Armadura mágica que concede un bonificador adicional de +1 a la Clase de Armadura. No requiere sintonización." },
    { name: "Botas Élficas", minLevel: 6, attunement: "No", known: false, description: "Mientras las llevas, tus pasos son silenciosos. Tienes ventaja en las pruebas de Destreza (Sigilo) que dependan de no hacer ruido." },
    { name: "Botas del Camino Cambiante", minLevel: 6, attunement: "Sí", known: false, description: "Requieren sintonización. Mientras las llevas, puedes usar una acción adicional para teletransportarte hasta 15 pies a un espacio desocupado que puedas ver, siempre que hayas ocupado ese espacio en algún momento durante el turno actual." },
    { name: "Capa Élfica", minLevel: 6, attunement: "Sí", known: false, description: "Requiere sintonización. Tienes ventaja en las pruebas de Destreza (Sigilo) realizadas mientras llevas la capa, y las criaturas tienen desventaja en las pruebas de Sabiduría (Percepción) para verte. La capa mejora especialmente tus intentos de ocultarte en condiciones donde ya puedes hacerlo." },
    { name: "Capa de la Raya Manta", minLevel: 6, attunement: "No", known: false, description: "Mientras la llevas, puedes respirar bajo el agua y tienes velocidad de nado. Además, puedes extender la capa para desplazarte sobre el agua de una forma similar a una raya manta, siempre que dispongas del espacio y las condiciones necesarias." },
    { name: "Ojos Encantadores", minLevel: 6, attunement: "Sí", known: false, description: "Requieren sintonización. Tienen cargas que puedes gastar para lanzar Encantar Persona sin gastar un espacio de conjuro. Las cargas gastadas se recuperan diariamente al amanecer según las reglas del objeto." },
    { name: "Ojos de Visión Minuciosa", minLevel: 6, attunement: "No", known: false, description: "Mientras los llevas puedes ver detalles extremadamente pequeños a corta distancia, lo que facilita inspeccionar objetos, mecanismos, escrituras y otras cosas diminutas. No aumenta por sí mismo tu visión en la oscuridad." },
    { name: "Guantes de Hurto", minLevel: 6, attunement: "No", known: false, description: "Mientras los llevas tienes una bonificación especial para las pruebas de Destreza (Juego de Manos) realizadas para robar o manipular objetos. También puedes usar su poder para abrir o manipular cerraduras con mayor facilidad, según las reglas del objeto." },
    { name: "Linterna Reveladora", minLevel: 6, attunement: "No", known: false, description: "Cuando está encendida, la linterna emite luz que revela criaturas y objetos invisibles dentro de su área iluminada, haciendo que su presencia pueda percibirse aunque un efecto mágico los mantenga invisibles." },
    { name: "Afilador Mental", minLevel: 6, attunement: "Sí", known: false, description: "Anillo con 4 cargas. Cuando fallas una salvación de Constitución para mantener la concentración, puedes usar una reacción y gastar 1 carga para convertir el fallo en un éxito. Recupera 1d4 cargas gastadas diariamente al amanecer." },
    { name: "Collar de Adaptación", minLevel: 6, attunement: "Sí", known: false, description: "Requiere sintonización. Puedes respirar normalmente en cualquier entorno y tienes ventaja contra gases o sustancias que se introduzcan en tus pulmones a través del aire. El collar crea el aire respirable que necesitas cuando el entorno no lo proporciona." },
    { name: "Flautas de Aparición", minLevel: 6, attunement: "No", known: false, description: "Puedes gastar una de sus cargas para tocar una melodía sobrenatural que afecta a criaturas cercanas. Las criaturas que fallen la salvación correspondiente quedan asustadas durante el tiempo indicado por el objeto. El objeto recupera sus cargas según sus reglas de recuperación." },
    { name: "Arma Radiante", minLevel: 6, attunement: "Sí", known: false, description: "Requiere sintonización por un lanzador de conjuros. Concede +1 a las tiradas de ataque y daño. Como acción adicional puede emitir luz brillante en 30 pies y luz tenue 30 pies adicionales, y puedes apagarla con otra acción adicional. Tiene 4 cargas: inmediatamente después de que una tirada de ataque te impacte, puedes usar una reacción y gastar 1 carga para obligar al atacante a superar una salvación de Constitución CD 15; si falla, queda cegado hasta el final de su siguiente turno. Recupera 1d4 cargas gastadas diariamente al amanecer." },
    { name: "Escudo Repulsor", minLevel: 6, attunement: "No", known: false, description: "Escudo mágico que concede +1 a la Clase de Armadura mientras lo empuñas. Tiene 4 cargas. Inmediatamente después de que una tirada de ataque cuerpo a cuerpo te impacte, puedes usar una reacción y gastar 1 carga para empujar al atacante hasta 15 pies. Recupera 1d4 cargas gastadas diariamente al amanecer." },
    { name: "Anillo de Natación", minLevel: 6, attunement: "No", known: false, description: "Mientras lo llevas, obtienes una velocidad de nado igual a tu velocidad al caminar. Te permite desplazarte bajo el agua con normalidad sin que la natación reduzca tu movimiento a la mitad." },
    { name: "Anillo de Caminar sobre el Agua", minLevel: 6, attunement: "No", known: false, description: "Mientras lo llevas, puedes moverte por la superficie del agua como si fuera terreno firme. Puedes entrar y salir del agua normalmente y seguir caminando sobre su superficie mientras mantengas el objeto puesto." },
    { name: "Escudo Centinela", minLevel: 6, attunement: "No", known: false, description: "Mientras lo llevas, obtienes ventaja en las tiradas de iniciativa y no puedes ser sorprendido mientras estés consciente. El escudo también puede ayudarte a percibir amenazas antes de que empiece el combate." },
    { name: "Anillo de Recuperación de Conjuros", minLevel: 6, attunement: "Sí", known: false, description: "Requiere sintonización por un lanzador de conjuros. Como acción adicional puedes recuperar un espacio de conjuro gastado de nivel 3 o inferior. Una vez utilizado, no puedes volver a usar el anillo hasta el siguiente amanecer." },
    { name: "Varita de Misiles Mágicos", minLevel: 6, attunement: "No", known: false, description: "Varita con cargas que permite lanzar Misil Mágico gastando una carga. Las cargas se recuperan diariamente al amanecer según las reglas del objeto, y si se gasta la última carga la varita puede perder su poder mágico." },
    { name: "Varita de Telaraña", minLevel: 6, attunement: "Sí", known: false, description: "Requiere sintonización. Tiene cargas que puedes gastar para lanzar Telaraña sin gastar un espacio de conjuro. Las cargas se recuperan diariamente al amanecer según las reglas del objeto." },
    { name: "Arma de Advertencia", minLevel: 6, attunement: "Sí", known: false, description: "Requiere sintonización. Mientras la lleves, tú y tus aliados cercanos no podéis ser sorprendidos y obtienes ventaja en las tiradas de iniciativa. El arma te advierte mediante una señal mágica cuando detecta peligro cercano." },

    // Artífice 10+
    { name: "Armadura de Resistencia", minLevel: 10, attunement: "Sí", known: false, description: "Requiere sintonización. Cuando te sintonizas eliges un tipo de daño entre las opciones permitidas por el objeto y obtienes resistencia a ese tipo de daño mientras permanezcas sintonizado." },
    { name: "Daga de Veneno", minLevel: 10, attunement: "No", known: false, description: "Arma mágica que puede liberar veneno al atacar. Su poder permite que un objetivo sufra daño de veneno adicional y, si falla la salvación correspondiente, quede envenenado durante el tiempo establecido por el objeto. El poder se recupera después del descanso indicado." },
    { name: "Cota Élfica", minLevel: 10, attunement: "No", known: false, description: "Armadura de malla ligera y flexible. Puedes añadir tu bonificador completo de Destreza a la Clase de Armadura mientras la llevas, aunque normalmente una armadura media limitaría ese bonificador." },
    { name: "Anillo de Caída de Pluma", minLevel: 10, attunement: "Sí", known: false, description: "Requiere sintonización. Cuando caes, puedes usar una reacción para reducir enormemente tu velocidad de caída, evitando o reduciendo el daño de la caída y permitiendo que aterrices con seguridad." },
    { name: "Anillo de Salto", minLevel: 10, attunement: "Sí", known: false, description: "Requiere sintonización. Aumenta considerablemente la distancia que puedes cubrir con tus saltos y te permite realizar saltos mucho mayores que los que permitiría normalmente tu Fuerza." },
    { name: "Anillo de Protección Mental", minLevel: 10, attunement: "Sí", known: false, description: "Requiere sintonización. Protege tus pensamientos: otras criaturas no pueden leer tu mente sin tu permiso y eres consciente de los intentos de hacerlo. También puede ocultar tu alineamiento y tipo de criatura ante determinados efectos que intentarían averiguarlos." },
    { name: "Escudo +2", minLevel: 10, attunement: "No", known: false, description: "Escudo mágico que proporciona un bonificador adicional de +2 a la Clase de Armadura además del +2 normal de un escudo. No requiere sintonización." },
    { name: "Objeto maravilloso poco común no maldito", minLevel: 10, attunement: "Varía", known: false, repeatable: true, description: "Puedes elegir un objeto maravilloso poco común que no esté maldito. Cada objeto concreto que elijas cuenta como un plan diferente y su requisito de sintonización depende del objeto elegido." },
    { name: "Varita del Mago de Guerra +2", minLevel: 10, attunement: "Sí", known: false, description: "Requiere sintonización. Mientras la sostienes, obtienes un bonificador de +2 a las tiradas de ataque de tus conjuros." },
    { name: "Arma +2", minLevel: 10, attunement: "No", known: false, description: "Arma mágica que concede un bonificador de +2 a las tiradas de ataque y daño realizadas con ella. No requiere sintonización." },
    { name: "Vendajes de Poder Desarmado +2", minLevel: 10, attunement: "No", known: false, description: "Protecciones mágicas para las manos que conceden un bonificador de +2 a las tiradas de ataque y daño de tus ataques desarmados." },

    // Artífice 14+
    { name: "Armadura +2", minLevel: 14, attunement: "No", known: false, description: "Armadura mágica que concede un bonificador adicional de +2 a la Clase de Armadura. No requiere sintonización." },
    { name: "Escudo Atrapaflechas", minLevel: 14, attunement: "Sí", known: false, description: "Requiere sintonización. Mejora tu defensa contra ataques a distancia y puede desviar o atraer proyectiles que te tengan como objetivo, permitiéndote reducir el peligro de determinados ataques a distancia mediante su reacción o poder especial." },
    { name: "Lengua de Fuego", minLevel: 14, attunement: "Sí", known: false, description: "Requiere sintonización. Como acción adicional puedes hacer que el arma se envuelva en llamas, emitiendo luz y añadiendo daño de fuego a sus impactos. Puedes apagar las llamas con otra acción adicional." },
    { name: "Objeto maravilloso raro no maldito", minLevel: 14, attunement: "Varía", known: false, repeatable: true, description: "Puedes elegir un objeto maravilloso raro que no esté maldito. Cada objeto concreto elegido cuenta como un plan diferente y mantiene las reglas de sintonización y uso de ese objeto." },
    { name: "Anillo de Libertad de Movimiento", minLevel: 14, attunement: "Sí", known: false, description: "Requiere sintonización. Tu movimiento no se ve reducido por terreno difícil ni por ciertos efectos mágicos, y puedes gastar movimiento normalmente para escapar de restricciones que impedirían desplazarte. También puedes moverte bajo el agua sin que esta reduzca tu movimiento." },
    { name: "Anillo de Protección", minLevel: 14, attunement: "Sí", known: false, description: "Requiere sintonización. Obtienes +1 a la Clase de Armadura y +1 a todas tus tiradas de salvación mientras lo lleves." },
    { name: "Anillo del Ariete", minLevel: 14, attunement: "Sí", known: false, description: "Requiere sintonización. El anillo tiene cargas que puedes gastar para realizar un ataque mágico de fuerza contra una criatura u objeto a distancia. Si impacta, inflige daño de fuerza y puede empujar al objetivo. El número de cargas y su recuperación siguen las reglas del objeto." },
  ],


  // ---- Rasgos de clase (UA3). Solo se muestran los que ya has alcanzado. ----
  features: [
    {
      minLevel: 1,
      name: "Lanzamiento de Conjuros",
      source: "Nivel 1",
      description: "Usas tu Inteligencia para lanzar conjuros de Artífice. Necesitas una herramienta con la que seas competente como foco de lanzamiento. Conoces dos trucos de Artífice y puedes cambiar uno de ellos tras un descanso largo. Preparas la cantidad de conjuros de nivel 1 o superior indicada por tu nivel y solo puedes preparar conjuros para los que tengas espacios.",
    },
    {
      minLevel: 1,
      name: "Magia de Inventor",
      source: "Nivel 1 · UA3",
      description: "Conoces el truco Reparar. Con herramientas de inventor en la mano, como acción Mágica puedes crear un objeto de la lista durante un descanso largo. Puedes usar este rasgo un número de veces igual a tu modificador de Inteligencia (mínimo 1), recuperando todos los usos al terminar un descanso largo.",
      creations: ["Bolitas de plomo", "Red", "Cesta", "Aceite", "Rollo de cama", "Papel", "Campana", "Pergamino", "Manta", "Pértiga", "Polea y aparejo", "Bolsa", "Cubo", "Cuerda", "Abrojos", "Saco", "Vela", "Pala", "Palanca", "Cordel", "Frasco", "Yesquero", "Jarra", "Antorcha", "Lámpara", "Vial"],
    },
    {
      minLevel: 2,
      name: "Replicar Objeto Mágico",
      source: "Nivel 2 · UA3",
      description: "Aprendes cuatro planes de objetos mágicos. Puedes sustituir un plan conocido al subir de nivel y aprendes planes adicionales en determinados niveles. Al terminar un descanso largo puedes crear uno o dos objetos mágicos diferentes basados en tus planes conocidos. Los objetos creados no son permanentes y un arma o varita creada mediante este rasgo puede servir como foco de lanzamiento de conjuros.",
    },
    {
      minLevel: 3,
      name: "Subclase de Artífice",
      source: "Nivel 3",
      description: "Eliges una subclase de Artífice. Tu subclase te proporciona rasgos adicionales en los niveles indicados por ella.",
    },
    {
      minLevel: 4,
      name: "Mejora de Característica",
      source: "Nivel 4",
      description: "Obtienes la dote Mejora de Característica u otra dote para la que cumplas los requisitos. Vuelves a obtener este rasgo en los niveles 8, 12 y 16.",
    },
    {
      minLevel: 6,
      name: "Manipulador de Objetos Mágicos",
      source: "Nivel 6 · UA3",
      description: "Puedes recargar objetos mágicos que hayas creado gastando espacios de conjuro, convertir uno de tus objetos mágicos creados en un espacio de conjuro y transformar uno de tus objetos mágicos creados en otro objeto basado en un plan que conozcas.",
    },
    {
      minLevel: 7,
      name: "Destello de Genio",
      source: "Nivel 7",
      description: "Cuando tú o una criatura que puedas ver a 30 pies falle una prueba de característica o una tirada de salvación, puedes usar tu reacción para añadir tu modificador de Inteligencia a la tirada. Puedes usar este rasgo un número de veces igual a tu modificador de Inteligencia y recuperas todos los usos tras un descanso largo.",
    },
    {
      minLevel: 10,
      name: "Experto en Objetos Mágicos",
      source: "Nivel 10",
      description: "Puedes sintonizarte con hasta cuatro objetos mágicos a la vez.",
    },
    {
      minLevel: 11,
      name: "Objeto Almacena-Conjuros",
      source: "Nivel 11 · UA3",
      description: "Al terminar un descanso largo puedes almacenar un conjuro de Artífice de nivel 1, 2 o 3 que cumpla los requisitos del rasgo en un arma o foco. Una criatura que sostenga el objeto puede producir el efecto del conjuro mediante una acción Mágica, usando tu aptitud para lanzar conjuros.",
    },
    {
      minLevel: 14,
      name: "Sabio de los Objetos Mágicos",
      source: "Nivel 14",
      description: "Puedes sintonizarte con hasta cinco objetos mágicos a la vez.",
    },
    {
      minLevel: 18,
      name: "Maestro de los Objetos Mágicos",
      source: "Nivel 18",
      description: "Puedes sintonizarte con hasta seis objetos mágicos a la vez.",
    },
    {
      minLevel: 19,
      name: "Don Épico",
      source: "Nivel 19",
      description: "Obtienes una dote de Don Épico u otra dote para la que cumplas los requisitos.",
    },
    {
      minLevel: 20,
      name: "Alma del Artífice",
      source: "Nivel 20",
      description: "Tu vínculo con tus objetos mágicos te permite sacrificar objetos mágicos creados mediante Replicar Objeto Mágico para evitar la muerte y mejora la fiabilidad de Destello de Genio mientras estás sintonizado con al menos un objeto mágico.",
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
