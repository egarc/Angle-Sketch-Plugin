import Angle from './Angle'
import * as Shared from './Shared'

import { Error } from './Error'

export default function (context) {

    print(context.document.currentPage().children());
}
