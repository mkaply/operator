EXTENSION=operator
rm  *.xpi
rm -rf $EXTENSION
mkdir $EXTENSION
cd $EXTENSION
rsync -r --exclude=.svn --exclude-from=../excludefile.txt ../* .
VERSION=`grep "em:version" install.rdf | sed -e 's/^[ \t]*//g' | sed -e 's/<[^>]*>//g'`
rm chrome.manifest
rm chrome.manifest.flat
mv chrome.manifest.jar chrome.manifest
cd chrome
cd content
export VERSION=$VERSION
perl -pi -e 's/0.0.0/$ENV{"VERSION"}/gi' operator.js
perl -pi -e 's/0.0.0/$ENV{"VERSION"}/gi' operator_options.xul
cd ../
zip -r $EXTENSION.jar content locale skin
rm -rf content
rm -rf locale
rm -rf skin
cd ../..
cd $EXTENSION
#VERSION=`grep "em:version" install.rdf | sed -e 's/[ \t]*em:version=//;s/"//g'`
XPINAME=$EXTENSION-$VERSION
zip -r -D ../$XPINAME.xpi *
cd ..
rm -rf $EXTENSION
