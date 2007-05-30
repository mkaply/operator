del operator.xpi
copy chrome.manifest.jar chrome.manifest
cd chrome
del operator.jar
cd operator
zip -r ..\operator.jar content locale
cd ..\..
zip operator.xpi chrome\operator.jar chrome.manifest defaults\preferences\prefs.js install.rdf LICENSE
copy chrome.manifest.flat chrome.manifest
