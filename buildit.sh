rm operator.xpi
cp chrome.manifest.jar chrome.manifest
cd chrome
rm operator.jar
cd operator
zip -r ../operator.jar content locale
cd ../..
zip operator.xpi chrome/operator.jar chrome.manifest defaults/preferences/prefs.js install.rdf LICENSE
cp chrome.manifest.flat chrome.manifest
