/*******************************************************************************
 * Copyright (c) 2002, 2012 Innoopract Informationssysteme GmbH.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    Innoopract Informationssysteme GmbH - initial API and implementation
 *    EclipseSource - ongoing development
 *    Frank Appel - replaced singletons and static fields (Bug 337787)
 ******************************************************************************/
package org.eclipse.rap.rwt.internal.service;

import javax.servlet.http.Cookie;

import org.eclipse.rap.rwt.RWT;
import org.eclipse.rap.rwt.internal.util.ParamCheck;
import org.eclipse.rap.rwt.service.UISession;
import org.eclipse.rap.rwt.service.ISettingStore;
import org.eclipse.rap.rwt.service.ISettingStoreFactory;


public class SettingStoreManager {
  private static final String COOKIE_NAME = "settingStore";
  private static final int COOKIE_MAX_AGE_SEC = 3600 * 24 * 90; // 3 months
  private static long last = System.currentTimeMillis();
  private static int instanceCount;

  private ISettingStoreFactory factory;

  public synchronized ISettingStore getStore() {
    UISession uiSession = ContextProvider.getUISession();
    String storeId = getStoreId();
    ISettingStore result = ( ISettingStore )uiSession.getAttribute( storeId );
    if( result == null ) {
      result = factory.createSettingStore( storeId );
      uiSession.setAttribute( storeId, result );
    }
    return result;
  }

  public synchronized void register( ISettingStoreFactory factory ) {
    ParamCheck.notNull( factory, "factory" );
    if( hasFactory() ) {
      throw new IllegalStateException( "There is already an ISettingStoreFactory registered." );
    }
    this.factory = factory;
  }

  public void deregisterFactory() {
    if( !hasFactory() ) {
      throw new IllegalStateException( "There is no ISettingStoreFactory for deregistration." );
    }
    this.factory = null;
  }

  public synchronized boolean hasFactory() {
    return factory != null;
  }

  //////////////////
  // helping methods

  private synchronized String createUniqueStoreId() {
    long now = System.currentTimeMillis();
    if( last == now ) {
      instanceCount++;
    } else {
      last = now;
      instanceCount = 0;
    }
    return String.valueOf( now ) + "_" + String.valueOf( instanceCount );
  }

  private String getStoreId() {
    UISession uiSession = ContextProvider.getUISession();
    // 1. storeId stored in session? (implies cookie exists)
    String result = ( String )uiSession.getAttribute( COOKIE_NAME );
    if( result == null ) {
      // 2. storeId stored in cookie?
      result = getStoreIdFromCookie();
      if( result == null ) {
        // 3. create new storeId
        result = createUniqueStoreId();
      }
      // (2+3) do refresh cookie, to ensure it expires in COOKIE_MAX_AGE_SEC
      Cookie cookie = new Cookie( COOKIE_NAME, result );
      cookie.setSecure( RWT.getRequest().isSecure() );
      cookie.setMaxAge( COOKIE_MAX_AGE_SEC );
      ContextProvider.getResponse().addCookie( cookie );
      // (2+3) update storeId stored in session
      // Note: This attribute must be checked for validity to prevent attacks
      // like http://www.owasp.org/index.php/Cross-User_Defacement
      uiSession.setAttribute( COOKIE_NAME, result );
    }
    return result;
  }

  private String getStoreIdFromCookie() {
    String result = null;
    Cookie[] cookies = ContextProvider.getRequest().getCookies();
    if( cookies != null ) {
      for( int i = 0; result == null && i < cookies.length; i++ ) {
        Cookie cookie = cookies[ i ];
        if( COOKIE_NAME.equals( cookie.getName() ) ) {
          String value = cookie.getValue();
          // Validate cookies to prevent cookie manipulation and related attacks
          // see https://bugs.eclipse.org/bugs/show_bug.cgi?id=275380
          if( isValidCookieValue( value ) ) {
            result = value;
          }
        }
      }
    }
    return result;
  }

  static boolean isValidCookieValue( String value ) {
    boolean result = false;
    int index = value.indexOf( '_' );
    if( index != -1 ) {
      try {
        Long.parseLong( value.substring( 0, index ) );
        Integer.parseInt( value.substring( index + 1 ) );
        result = true;
      } catch( NumberFormatException nfe ) {
        // Cookie format is invalid
      }
    }
    return result;
  }
}