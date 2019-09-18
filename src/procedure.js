import sketch from 'sketch'
import Angle from './Angle'
import * as Shared from './Shared'

import { Error } from './Error'
import { PixelDensity } from './PixelDensity'
import { CompressionRatio } from './CompressionRatio'

function applyAngles (options) {

  let { angles, artboard } = options;

  angles.forEach(function (a) {
    a.artboard = artboard;
    a.pixelDensity = 0;
    a.selectedCompressionRatio = 0;
  });

  angles.forEach(a => {
    a.guessRotationAndReversion();
    a.applyImage();
  });

  return true
}

export default function (context) {

  var document = sketch.getSelectedDocument(); 
  var fileManager = NSFileManager.defaultManager();

  var parentArtboard;
  let assignments = context.assignments

  assignments.forEach(function(a) {
    let imageURL = a.image;
    let layerId = a.target;
    let artboardID = a.source;

    const artboard = context.document.documentData().layerWithID(artboardID);
    var targetLayer = context.document.documentData().layerWithID(layerId)

    const selectedLayers = [targetLayer];
    console.log(`ImageURL: ${imageURL}`);
    let fileURL = NSURL.URLWithString(imageURL.stringByAddingPercentEscapesUsingEncoding(NSUTF8StringEncoding));

    if( fileManager.fileExistsAtPath(fileURL.path())) {
    
      let replacementImage = NSImage.alloc().initWithContentsOfFile(imageURL);
      var old_width = artboard.frame().width();
      var old_height = artboard.frame().height();

      var replaceAction = MSReplaceImageAction.alloc().init();

      let children = artboard.childrenIncludingSelf(false);
      console.log(`Children: ${children}`);

      replaceAction.applyImage_tolayer(replacementImage, children[0]);
      children[0].frame().setWidth(old_width);
      children[0].frame().setHeight(old_height);
    }

    if (selectedLayers.length == 0) {
      Shared.show({
        message: Error.emptySelection.message,
        inDocument: document
      });
      return
    }

    parentArtboard = selectedLayers[0].parentArtboard();

    let possibleAngles = Angle.tryCreating({ for: selectedLayers, in: context });

    let angles = possibleAngles.filter( a => a instanceof Angle );
    let errors = possibleAngles.filter( a => !(a instanceof Angle) );


    if (angles.length != 0) {
      angles.forEach(function (a) {
        a.pixelDensity = 1.0;
        a.selectedCompressionRatio = 1.0;
      });
      let appliedShapeAngles = applyAngles({
        angles: angles,
        artboard: artboard
      });
    }
  });

  let parentArtboardID = parentArtboard.objectID();
  var layer = document.getLayerWithID(parentArtboardID)
    if (layer) {
      sketch.export(layer);
      console.log(`Exported ${layer.name}\n`);
    }
}
