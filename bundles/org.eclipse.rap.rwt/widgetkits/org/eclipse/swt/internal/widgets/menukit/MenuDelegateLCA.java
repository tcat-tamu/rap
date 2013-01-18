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
package org.eclipse.swt.internal.widgets.menukit;

import java.io.IOException;

import org.eclipse.swt.widgets.Menu;


abstract class MenuDelegateLCA {

  abstract void preserveValues( Menu menu );

  abstract void readData( Menu menu );

  abstract void renderInitialization( Menu menu ) throws IOException;

  abstract void renderChanges( Menu menu ) throws IOException;
}
