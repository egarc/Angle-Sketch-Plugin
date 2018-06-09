import Angle from './Angle'
import * as Shared from './Shared'

import { Error } from './Error'

export default function (context) {

    let selectedLayersNSArray = context.selection;
    
    if (selectedLayersNSArray == null) {
        document.showMessage(Error.emptySelection.message);
        return
    }
    
    let selectedLayers = Array.fromNSArray(selectedLayersNSArray);

    if (selectedLayers.length == 0) {
        document.showMessage(Error.emptySelection.message);
        return
    }

    let possibleAngles = Angle.tryCreating({ for: selectedLayers, in: context });

    let angles = possibleAngles.filter( a => a instanceof Angle );
    let errors = possibleAngles.filter( a => !(a instanceof Angle) );

    if (angles.length == 0) {
        document.showMessage(errors[0].message);
        return
    }

    angles.forEach( a => {
        a.reverseSymmetry();
        a.applyImage();
    });

    document.showMessage("Angle flipped! ↔️");
    return
}
