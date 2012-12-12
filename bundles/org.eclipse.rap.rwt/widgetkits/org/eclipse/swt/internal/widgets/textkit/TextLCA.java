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
package org.eclipse.swt.internal.widgets.textkit;

import java.io.IOException;

import org.eclipse.rap.rwt.lifecycle.AbstractWidgetLCA;
import org.eclipse.swt.SWT;
import org.eclipse.swt.widgets.Text;
import org.eclipse.swt.widgets.Widget;

public final class TextLCA extends AbstractWidgetLCA {

  private final static AbstractTextDelegateLCA SINGLE = new SingleTextLCA();
  private final static AbstractTextDelegateLCA PASSWORD = new PasswordTextLCA();
  private final static AbstractTextDelegateLCA MULTI = new MultiTextLCA();

  public void preserveValues( Widget widget ) {
    getLCADelegate( widget ).preserveValues( ( Text )widget );
  }

  public void readData( Widget widget ) {
    getLCADelegate( widget ).readData( ( Text )widget );
  }

  public void renderInitialization( Widget widget ) throws IOException {
    getLCADelegate( widget ).renderInitialization( ( Text )widget );
  }

  public void renderChanges( Widget widget ) throws IOException {
    getLCADelegate( widget ).renderChanges( ( Text )widget );
  }

  private static AbstractTextDelegateLCA getLCADelegate( Widget widget ) {
    AbstractTextDelegateLCA result;
    int style = ( ( Text )widget ).getStyle();
    if( ( style & SWT.PASSWORD ) != 0 ) {
      result = PASSWORD;
    } else if( ( style & SWT.SINGLE ) != 0 ) {
      result = SINGLE;
    } else if( ( style & SWT.MULTI ) != 0 ) {
      result = MULTI;
    } else {
      result = SINGLE;
    }
    return result;
  }
}
