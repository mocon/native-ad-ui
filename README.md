# Native Ad UI
A Chrome extension for interactively creating Native ad placements on any public URL. The interface is overlayed on the page, and allows the user to select an element on the current page and select it for replication and replacement with a JSON Native advertisement.

## Installation
To install and test the extension, go to [chrome://extensions/](chrome://extensions/) and enable "Developer Mode". Click "Load Unpacked Extension", and select the main directory from this repo.

## Use
Once the extension has been loaded into Chrome, you will see a small gray and gold GumGum icon in your extension bar. Clicking on the icon will bring up the overlay. Once the overlay is visible, hover your mouse over any element in the current page and press Return or Enter on your keyboard to select the element.

The extension will copy the HTML markup of the selected element, and will do its best to calculate an efficient CSS selector path to it.
