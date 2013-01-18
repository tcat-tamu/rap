/*******************************************************************************
 * Copyright (c) 2010, 2012 EclipseSource and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    EclipseSource - initial API and implementation
 ******************************************************************************/

rwt.qx.Class.define( "org.eclipse.rwt.test.tests.IFrameTest", {

  extend : rwt.qx.Object,

  members : {

    testIFrameDimension : function() {
      var platform = rwt.client.Client.getPlatform();
      if( platform !== "ios" ) {
        var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
        var iframe = new rwt.widgets.base.Iframe();
        iframe.addToDocument();
        iframe.setWidth( 300 );
        iframe.setHeight( 400 );
        TestUtil.flush();
        var node = iframe.getIframeNode();
        var widgetNode = iframe.getElement();
        assertEquals( "100%", node.width );
        assertEquals( "100%", node.height );
        var style = node.style;
        assertTrue( style.width === "" || style.minWidth === undefined );
        assertTrue( style.height === "" || style.minWidth === undefined );
        assertTrue( style.minWidth === "" || style.minWidth === undefined );
        assertTrue( style.minHeight === "" || style.minWidth === undefined );
        assertTrue( style.maxWidth === "" || style.minWidth === undefined );
        assertTrue( style.maxHeight === "" || style.minWidth === undefined );
        assertEquals( 300, parseInt( widgetNode.style.width ) );
        assertEquals( 400, parseInt( widgetNode.style.height ) );
      }
    }

  }

} );