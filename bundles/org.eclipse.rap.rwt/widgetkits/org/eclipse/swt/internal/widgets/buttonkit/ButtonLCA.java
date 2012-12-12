/*******************************************************************************
 * Copyright (c) 2002, 2012 Innoopract Informationssysteme GmbH and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    Innoopract Informationssysteme GmbH - initial API and implementation
 *    EclipseSource - ongoing development
 ******************************************************************************/
package org.eclipse.swt.internal.widgets.buttonkit;

import java.io.IOException;

import org.eclipse.rap.rwt.lifecycle.AbstractWidgetLCA;
import org.eclipse.swt.SWT;
import org.eclipse.swt.widgets.Button;
import org.eclipse.swt.widgets.Widget;


public final class ButtonLCA extends AbstractWidgetLCA {

  private final static ButtonDelegateLCA PUSH = new PushButtonDelegateLCA();
  private final static ButtonDelegateLCA CHECK = new CheckButtonDelegateLCA();
  private final static ButtonDelegateLCA RADIO = new RadioButtonDelegateLCA();

  public void preserveValues( Widget widget ) {
    getLCADelegate( widget ).preserveValues( ( Button )widget );
  }

  public void readData( Widget widget ) {
    getLCADelegate( widget ).readData( ( Button )widget );
  }

  public void renderInitialization( Widget widget ) throws IOException {
    getLCADelegate( widget ).renderInitialization( ( Button )widget );
  }

  public void renderChanges( Widget widget ) throws IOException {
    getLCADelegate( widget ).renderChanges( ( Button )widget );
  }

  private static ButtonDelegateLCA getLCADelegate( Widget widget ) {
    ButtonDelegateLCA result;
    int style = ( ( Button )widget ).getStyle();
    if( ( style & SWT.CHECK ) != 0 ) {
      result = CHECK;
    } else if( ( style & SWT.PUSH ) != 0 ) {
      result = PUSH;
    } else if( ( style & SWT.RADIO ) != 0 ) {
      result = RADIO;
    } else {
      result = PUSH;
    }
    return result;
  }
}
