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

import com.w4t.ParamCheck;

/**
 * TODO [rh] JavaDoc
 * <p>
 * </p>
 */
public abstract class Item extends Widget {

  private String text;

  public Item( final Widget parent, final int style ) {
    super( parent, style );
    text = "";
  }

  public void setText( final String text ) {
    ParamCheck.notNull( text, "text" );
    this.text = text;
  }

  public String getText() {
    return text;
  }
}
