/*******************************************************************************
 * Copyright (c) 2002-2006 Innoopract Informationssysteme GmbH.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 * 
 * Contributors:
 *     Innoopract Informationssysteme GmbH - initial API and implementation
 ******************************************************************************/

package org.eclipse.rap.rwt.widgets;

import org.eclipse.rap.rwt.RWT;
import org.eclipse.rap.rwt.events.SelectionEvent;
import org.eclipse.rap.rwt.events.SelectionListener;


/**
 * TODO: [fappel] comment
 * <p>
 * </p>
 */
public class Button extends Control {

  private String text = "";
  private boolean selected = false;

  public Button( final Composite parent, final int style ) {
    super( parent, checkStyle( style ) );
  }

  static int checkStyle( final int style ) {
    int result = RWT.NONE;
    if( style > 0 ) {
      result = style;
    }
    return result;
  }

  public void addSelectionListener( final SelectionListener listener ) {
    SelectionEvent.addListener( this, listener );
  }

  public void removeSelectionListener( final SelectionListener listener ) {
    SelectionEvent.removeListener( this, listener );
  }

  public void setText( final String text ) {
    this.text = text;
  }

  public String getText() {
    return text;
  }

  public boolean getSelection() {
    if( ( style & ( RWT.CHECK | RWT.RADIO /* | RWT.TOGGLE */) ) == 0 ) {
      return false;
    }
    return selected;
  }
  
  public void setSelection( final boolean selected ) {
    if( ( style & ( RWT.CHECK | RWT.RADIO/* | SWT.TOGGLE */) ) == 0 ) {
      return;
    }
    this.selected = selected;
  }
}
