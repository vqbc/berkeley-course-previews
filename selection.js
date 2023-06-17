var selectionObj;
var stdName;
tippy.setDefaultProps({
  maxWidth: 600,
  allowHTML: true,
  trigger: "click",
  onHide(instance) {
    setTimeout(() => {
      instance.destroy();
    }, 3000);
  },
  onShow() {
    tippy.hideAll({ duration: 0 });
  },
});

document.onselectionchange = () => {
  selectionObj = document.getSelection()?.anchorNode?.parentElement;
};

function showCourseReady(req) {
  if ($(req).find("course").length) {
    var html = $(req).find("course").text();
  } else {
    var html =
      "<p>Course information cannot be found. This course may " +
      "no longer be offered. If you believe there is an error or " +
      "require more information, please contact the course " +
      "department.</p>";
  }
  tippy(selectionObj, {
    content: html,
  }).show();
}
function showCourseError(req) {
  var html =
    "<p>An error occurred trying to load course information.  Please try your request again later. (" +
    req.status +
    " - " +
    req.statusText +
    ")</p>";
  tippy(selectionObj, {
    content: html,
  }).show();
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.courseName) {
    stdName = request.courseName;
    selectionObj.blur();
    ribbiturl = "https://guide.berkeley.edu/ribbit/index.cgi";
    var gcurl =
      "https://corsproxy.io/?" +
      ribbiturl +
      "?page=getcourse.rjs&code=" +
      encodeURIComponent(stdName);
    $.ajax({
      url: gcurl,
      success: showCourseReady,
      error: showCourseError,
    });
    tippy(selectionObj, {
      content: "Loading course description…",
    }).show();
    sendResponse(true);
  }
});
