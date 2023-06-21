var selectionObj;
var selectionText;
var stdName;
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
  data: ["ds"],
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
var courseRegex = /^(?:(?:[A-Z]|,){1,8}\s){1,3}?[A-Z]?\d{1,3}[A-Z]{0,2}$/;
var urlPrefix =
  "https://corsproxy.io/?https://guide.berkeley.edu/ribbit/index.cgi?page=getcourse.rjs&code=";
var html;

String.prototype.getStandardName = function () {
  var workingName = this.toLowerCase().replace(/\xA0/g, " ");
  for (var [dept, names] of Object.entries(aliases)) {
    for (var name of names) {
      regex = new RegExp("^" + name + "(?:\\s|(\\d))");
      workingName = workingName.replace(regex, dept + " $1");
    }
  }
  return workingName.toUpperCase();
};

tippy.setDefaultProps({
  maxWidth: 600,
  allowHTML: true,
  trigger: "manual",
  onHide(instance) {
    setTimeout(() => {
      instance.destroy();
    }, 300);
  },
  onShow() {
    tippy.hideAll({ duration: 0 });
  },
});

document.onselectionchange = () => {
  if (!document.getSelection().isCollapsed)
    selectionObj = document.getSelection()?.anchorNode?.parentElement;

  selectionText = document.getSelection()?.toString().trim();
  if (selectionText?.getStandardName().match(courseRegex)) {
    (async () => {
      await chrome.runtime.sendMessage({
        courseName: selectionText.getStandardName(),
      });
    })();
  } else {
    (async () => {
      await chrome.runtime.sendMessage({
        courseName: false,
      });
    })();
  }
};

async function showCourseReady(response) {
  if ($(response).find("course").length) {
    html = $($.parseXML(response)).find("course").text();
  } else {
    var newResponse = await fetch(
      urlPrefix + encodeURIComponent(stdName.replace(/ (\d)/, " C$1"))
    );
    newResponse = await newResponse.text();
    if ($(newResponse).find("course").length) {
      html = $($.parseXML(newResponse)).find("course").text();
    } else {
      newResponse = await fetch(
        urlPrefix + encodeURIComponent(stdName.replace(/(\d)$/, "$1AC"))
      );
      newResponse = await newResponse.text();
      if ($(newResponse).find("course").length) {
        html = $($.parseXML(newResponse)).find("course").text();
      } else {
        html =
          "<p>Course information cannot be found. This course may " +
          "no longer be offered. If you believe there is an error or " +
          "require more information, please contact the course " +
          "department.</p>";
      }
    }
  }
  var htmlObj = $(html);
  htmlObj.find("a").each(function () {
    $(this).attr({
      href: "https://guide.berkeley.edu" + $(this).attr("href"),
      onclick: "",
    });
  });
  html = htmlObj.prop("outerHTML");

  var instance = tippy(selectionObj, {
    content: html,
  });
  instance.show();
  instance.setProps({
    hideOnClick: false,
    triggerTarget: document.querySelector(".tippy-box"),
    onClickOutside(instance) {
      instance.hide();
    },
  });

  $(".tippy-box a.bubblelink.code").click(async function (event) {
    event.preventDefault();
    let stdName = $(this).attr("title").replace(/\xA0/g, " ");

    try {
      response = await fetch(urlPrefix + encodeURIComponent(stdName));
      response = await response.text();
      showCourseReady(response);
    } catch (error) {
      showCourseError();
    }
  });
}

function showCourseError() {
  html = `<p>An error occurred trying to load course information.
          Please try your request again later.</p>`;
  tippy(selectionObj, {
    content: html,
  }).show();
}

chrome.runtime.onMessage.addListener(async (msg) => {
  if (msg.selection) {
    stdName = msg.selection.getStandardName();
    selectionObj.blur();

    tippy(selectionObj, {
      content: "Loading course description…",
    }).show();

    try {
      response = await fetch(urlPrefix + encodeURIComponent(stdName));
      response = await response.text();
      showCourseReady(response);
    } catch (error) {
      showCourseError();
    }
  }
});
