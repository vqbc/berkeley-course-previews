var aliases = {
  astron: ["astro"],
  "bio eng": ["bioe", "bio e", "bio p", "bioeng"],
  biology: ["bio"],
  "civ eng": ["cive", "civ e", "civeng"],
  chem: ["chemistry"],
  "chm eng": ["cheme"],
  classic: ["classics"],
  "cog sci": ["cogsci"],
  colwrit: ["college writing"],
  "com lit": ["comp lit", "complit", "comlit"],
  compsci: ["cs", "comp sci", "computer science"],
  "cy plan": ["cyplan", "cp"],
  "des inv": ["desinv", "design"],
  "dev eng": ["eveng"],
  "dev std": ["devstd"],
  datasci: ["ds", "data"],
  data: ["ds", "data"],
  "ea lang": ["ealang"],
  econ: ["economics"],
  "env des": ["ed"],
  "el eng": ["ee", "electrical engineering"],
  eecs: ["eecs"],
  "ene,res": ["erg", "er", "eneres"],
  engin: ["e", "engineering"],
  "env sci": ["envsci"],
  "eth std": ["ethstd"],
  "eura st": ["eurast"],
  geog: ["geography", "geo"],
  "hin-urd": ["hinurd"],
  "hum bio": ["humbio"],
  integbi: ["ib"],
  "ind eng": ["ie", "ieor"],
  japan: ["japanese"],
  legalst: ["legal studies"],
  linguis: ["linguistics", "ling"],
  "l & s": ["l&s", "ls", "lns"],
  "malay/i": ["malayi"],
  "mat sci": ["matsci", "ms", "mse"],
  mcellbi: ["mcb"],
  "mec eng": ["meceng", "meche", "mech e", "me"],
  "med st": ["medst"],
  "me stu": ["mestu", "middle eastern studies"],
  "mil aff": ["milaff"],
  "mil sci": ["milsci"],
  natamst: ["native american studies", "nat am st"],
  "ne stud": ["nestud"],
  neurosc: ["neurosci"],
  "nuc en": ["ne"],
  nusctx: ["nutrisci"],
  mediast: ["media"],
  mongoln: ["mongolian"],
  music: ["mus"],
  "pb hlth": ["pbhlth", "ph", "pub hlth", "public health"],
  "phys end": ["pe", "physed"],
  philos: ["philo", "phil", "philosophy"],
  polecon: ["poliecon"],
  plantbi: ["pmb"],
  "pol sci": ["poli", "polsci", "polisci", "poli sci", "ps"],
  "pub pol": ["pubpol", "pp", "public policy"],
  "pub aff": ["pubaff", "public affaris"],
  psych: ["psychology", "psych"],
  rhetor: ["rhetoric"],
  "s asian": ["sasian"],
  "s,seasn": ["sseasn"],
  sociol: ["sociology", "socio"],
  stat: ["stats"],
  theater: ["tdps"],
  ugba: ["haas"],
  vietnms: ["vietnamese", "viet"],
  "vis sci": ["vissci"],
  "vis std": ["visstd"],
};
var regex;
var selectionObj;

function showCourse(args) {
  var workingName = args.selectionText.toLowerCase().replace(/\xA0/g, " ");
  console.log(workingName);
  for (var [dept, names] of Object.entries(aliases)) {
    for (var name of names) {
      regex = new RegExp("^" + name + "(?:\\s|(\\d))");
      workingName = workingName.replace(regex, dept + " $1");
    }
  }
  var stdName = workingName.toUpperCase();
  console.log(stdName);

  (async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    const response = await chrome.tabs.sendMessage(tab.id, {
      courseName: stdName,
    });
    // do something with response here, not outside the function
    console.log(response);
  })();
}

chrome.runtime.onConnect.addListener(function (port) {
  console.assert(port.name === "selection");
  port.onMessage.addListener(function (msg) {
    if (msg.object) {
      selectionObj = msg.object;
    }
  });
});

// chrome.offscreen.createDocument({
//   url: chrome.runtime.getURL("offscreen.html"),
//   reasons: ["DOM_SCRAPING"],
//   justification: "Accessing selection position to add a popup",
// });

chrome.contextMenus.removeAll(function () {
  chrome.contextMenus.create({
    id: "1",
    title: "View course preview for %s",
    contexts: ["selection"], // ContextType
  });
});

chrome.contextMenus.onClicked.addListener(showCourse);
