/*******************************************************************************
 * Copyright (c) 2002, 2009 Innoopract Informationssysteme GmbH.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *     Innoopract Informationssysteme GmbH - initial API and implementation
 *     EclipseSource - ongoing development
 ******************************************************************************/
package org.eclipse.swt.internal.widgets;

import org.eclipse.swt.graphics.Color;
import org.eclipse.swt.graphics.Font;
import org.eclipse.swt.graphics.Image;
import org.eclipse.swt.widgets.Shell;


public interface IControlAdapter {

  int getZIndex();
  
  Shell getShell();

  int getTabIndex();
  void setTabIndex( int index );

  Font getUserFont();
  Color getUserForeground();
  Color getUserBackground();
  Image getUserBackgroundImage();

  boolean getBackgroundTransparency();
  
  boolean isPacked();
}
