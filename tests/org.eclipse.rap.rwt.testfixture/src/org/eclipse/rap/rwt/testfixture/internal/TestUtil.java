/*******************************************************************************
 * Copyright (c) 2013 EclipseSource and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    EclipseSource - initial API and implementation
 ******************************************************************************/
package org.eclipse.rap.rwt.testfixture.internal;

import java.io.IOException;
import java.io.InputStream;

import org.eclipse.rap.rwt.testfixture.Fixture;
import org.eclipse.swt.graphics.Image;
import org.eclipse.swt.widgets.Display;


public class TestUtil {

  private TestUtil() {
    // prevent instantiation
  }

  public static Image createImage( Display display, String imagePath ) throws IOException {
    ClassLoader loader = Fixture.class.getClassLoader();
    InputStream stream = loader.getResourceAsStream( imagePath );
    Image result = new Image( display, stream );
    stream.close();
    return result;
  }

}
