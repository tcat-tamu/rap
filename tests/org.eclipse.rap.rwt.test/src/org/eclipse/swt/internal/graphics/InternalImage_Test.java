/*******************************************************************************
 * Copyright (c) 2011, 2012 EclipseSource and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    EclipseSource - initial API and implementation
 ******************************************************************************/
package org.eclipse.swt.internal.graphics;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;

import org.eclipse.rap.rwt.testfixture.Fixture;
import org.junit.Test;


public class InternalImage_Test {

  @Test
  public void testConstructorWithNullResourceName() {
    try {
      new InternalImage( null, 1, 1 );
      fail();
    } catch( NullPointerException expected ) {
    }
  }

  @Test
  public void testConstructorWithZeroWidth() {
    try {
      new InternalImage( "res", 0, 1 );
      fail();
    } catch( IllegalArgumentException expected ) {
    }
  }

  @Test
  public void testConstructorWithNegativeWidth() {
    try {
      new InternalImage( "res", -1, 1 );
      fail();
    } catch( IllegalArgumentException expected ) {
    }
  }

  @Test
  public void testConstructorWithZeroHeight() {
    try {
      new InternalImage( "res", 1, 0 );
      fail();
    } catch( IllegalArgumentException expected ) {
    }
  }

  @Test
  public void testConstructorWithNegativeHeight() {
    try {
      new InternalImage( "res", 1, 0 );
      fail();
    } catch( IllegalArgumentException expected ) {
    }
  }

  @Test
  public void testGetBounds() {
    InternalImage internalImage = new InternalImage( "res", 1, 2 );
    assertEquals( 0, internalImage.getBounds().x );
    assertEquals( 0, internalImage.getBounds().y );
    assertEquals( 1, internalImage.getBounds().width );
    assertEquals( 2, internalImage.getBounds().height );
  }

  @Test
  public void testGetResourceName() {
    String resourceName = "resourceName";
    InternalImage internalImage = new InternalImage( resourceName, 1, 2 );
    assertEquals( resourceName, internalImage.getResourceName() );
  }

  @Test
  public void testSerialize() throws Exception {
    String resourceName = "resourceName";
    int width = 1;
    int height = 2;
    InternalImage internalImage = new InternalImage( resourceName, width, height );

    InternalImage deserializedInternalImage = Fixture.serializeAndDeserialize( internalImage );

    assertEquals( resourceName, deserializedInternalImage.getResourceName() );
    assertEquals( width, deserializedInternalImage.getBounds().width );
    assertEquals( height, deserializedInternalImage.getBounds().height );
  }

}
