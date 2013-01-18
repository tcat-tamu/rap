/*******************************************************************************
 * Copyright (c) 2007, 2012 Innoopract Informationssysteme GmbH and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    Innoopract Informationssysteme GmbH - initial API and implementation
 *    EclipseSource - ongoing development
 ******************************************************************************/
appearances = {
// BEGIN TEMPLATE //

  "hyperlink" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      return {
        font: tv.getCssFont( "*", "font" ),
        cursor : states.disabled ? "default" : "pointer",
        spacing : 4,
        width : "auto",
        height : "auto",
        horizontalChildrenAlign : "left",
        verticalChildrenAlign : "middle"
      }
    }
  },

  "hyperlink-label" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      return {
        textColor : states.disabled
                  ? tv.getCssColor( "*", "color" )
                  : "undefined",
        cursor : states.disabled ? "default" : "pointer"
      }
    }
  }

// END TEMPLATE //
};
