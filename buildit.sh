EXTENSION=operator
rm  *.xpi
rm -rf $EXTENSION
mkdir $EXTENSION
cd $EXTENSION
rsync -r --exclude=.svn --exclude-from=../excludefile.txt ../* .
rm chrome.manifest
rm chrome.manifest.flat
mv chrome.manifest.jar chrome.manifest
cd chrome
zip -r $EXTENSION.jar content locale skin
rm -rf content
rm -rf locale
rm -rf skin
cd ../..
cd $EXTENSION
#VERSION=`grep "em:version" install.rdf | sed -e 's/[ \t]*em:version=//;s/"//g'`
VERSION=`grep "em:version" install.rdf | sed -e 's/^[ \t]*//g' | sed -e 's/<[^>]*>//g'`
XPINAME=$EXTENSION-$VERSION
zip -r -D ../$XPINAME.xpi *
cd ..
rm -rf $EXTENSION
