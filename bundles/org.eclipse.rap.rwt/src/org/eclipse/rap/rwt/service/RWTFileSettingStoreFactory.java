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
package org.eclipse.rap.rwt.service;

import java.io.File;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpSession;

import org.eclipse.rap.rwt.internal.service.ContextProvider;
import org.eclipse.rap.rwt.internal.service.ServletLog;
import org.eclipse.rap.rwt.internal.util.ParamCheck;


/**
 * {@link ISettingStoreFactory} that creates {@link FileSettingStore}
 * instances.
 * <p>
 * This particular implementation uses the following strategy to determine
 * the path for persisting the data of a FileSettingStore:
 * <ol>
 * <li>Use the directory specified by the init-parameter
 * <code>"org.eclipse.rap.rwt.service.FileSettingStore.dir"</code> in the
 * web.xml.
 * </li>
 * <li>Use the directory specified by the
 * <code>"javax.servlet.context.tempdir"</code> attribute in the servlet context.
 * </li>
 * <li>Use the directory specified by the <code>"java.io.tempdir"</code>
 * property.
 * </li>
 * </ol>
 * The first path that can be obtained from the above choices (in the order
 * given above) will be used. If the path determined does not exist it will
 * be created.
 * <p>
 * <b>Note:</b> This setting store factory should be used in an RWT-only
 * deployment. For a regular RAP deployment use the
 * <code>WorkbenchFileSettingStoreFactory</code>.
 *
 * @since 2.0
 */
public final class RWTFileSettingStoreFactory implements ISettingStoreFactory {

  public ISettingStore createSettingStore( String storeId ) {
    ParamCheck.notNullOrEmpty( storeId, "storeId" );
    ISettingStore result = new FileSettingStore( getWorkDir() );
    try {
      result.loadById( storeId );
    } catch( SettingStoreException sse ) {
      ServletLog.log( sse.getMessage(), sse );
    }
    return result;
  }

  //////////////////
  // helping methods

  private static ServletContext getServletContext() {
    HttpSession session = ContextProvider.getRequest().getSession();
    return session.getServletContext();
  }

  private static File getWorkDir() {
    File result = getWorkDirFromWebXml();
    if( result == null ) {
      result = getWorkDirFromServletContext();
      if ( result == null ) {
        String parent = System.getProperty( "java.io.tmpdir" );
        result = new File( parent, FileSettingStore.class.getName() );
      }
    }
    if( !result.exists() ) {
      result.mkdirs();
    }
    return result;
  }

  private static File getWorkDirFromWebXml() {
    String path = getServletContext().getInitParameter( FileSettingStore.FILE_SETTING_STORE_DIR );
    return path != null ? new File( path ) : null;
  }

  private static File getWorkDirFromServletContext() {
    File parent = ( File )getServletContext().getAttribute( "javax.servlet.context.tempdir" );
    return parent != null ? new File( parent, FileSettingStore.class.getName() ) : null;
  }
}
