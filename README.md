# Berkeley Course Previews

## Introduction

This is a simple browser extension that adds a "Show course preview" option to the right-click menu whenever a course name is selected. The option gets data from the same database used by [guide.berkeley.edu](https://guide.berkeley.edu), and displays it in a popup. This allows Berkeley courses to be searched up faster by removing the need to open a new tab and search websites for the desired course, and is particularly good for when only quick information is needed. For detailed information a course catalog like Berkeleytime is recommended.

## Tips

- The popup will find courses even with the C prefix or AC suffix omitted, or with a colloquial subject name like CS61A instead of COMPSCI 61A.
- Clicking a link to another course in the popup will open a new popup, instead of going to a new site. Of course, one can just open the link in a new tab instead.

## Installation

**Google Chrome / Microsoft Edge**

1. Download this repo as a [ZIP file from GitHub](https://github.com/vqbc/berkeley-course-previews/archive/master.zip).
1. Unzip the file to get a folder named `berkeley-course-previews-master`.
1. In Chrome/Edge go to the extensions page (`chrome://extensions` or `edge://extensions`).
1. Enable Developer Mode.
1. Drag the `berkeley-course-previews-master` folder anywhere on the page to import it (do not delete the folder afterwards).
1. (Optional) If you hate seagulls, go to the `manifest.json` file in the folder. Near the bottom, replace `icon48.png` with `alticon48.png`, and `icon128.png` with `alticon128.png`. Then go back to the extensions page and click Update.

## Development

Contributions to this project are welcome. In particular, the list of aliases is incomplete, and could use expansion. If you see an abbreviation or alternative name for a department name that's not in the list, please add it!
