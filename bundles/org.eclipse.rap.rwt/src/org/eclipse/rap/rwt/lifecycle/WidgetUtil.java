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

package org.eclipse.rap.rwt.lifecycle;

import java.text.MessageFormat;
import javax.servlet.http.HttpServletRequest;
import org.eclipse.rap.rwt.internal.widgets.IWidgetAdapter;
import org.eclipse.rap.rwt.widgets.Widget;
import com.w4t.engine.service.ContextProvider;


/**
 * TODO [rh] JavaDoc
 */
public final class WidgetUtil {
  
  private WidgetUtil() {
    // prevent instantiation
  }
  
  public static IWidgetAdapter getAdapter( final Widget widget ) {
    IWidgetAdapter result;
    Class clazz = IWidgetAdapter.class;
    result = ( IWidgetAdapter )widget.getAdapter( clazz );
    if( result == null ) {
      throwAdapterException( clazz );
    }
    return result;   
  }
  
  public static String getId( final Widget widget ) {
    return getAdapter( widget ).getId();
  }

  public static AbstractWidgetLCA getLCA( final Widget widget ) {
    Class clazz = ILifeCycleAdapter.class;
    AbstractWidgetLCA result = ( AbstractWidgetLCA )widget.getAdapter( clazz );
    if( result == null ) {
      throwAdapterException( clazz );
    }
    return result;
  }

  /**
   * <p>Determines whether the property of the given <code>widget</code> has
   * changed in comparison to its 'preserved' value and thus 'something' needs 
   * to be rendered in order to reflect the changes on the client side.</p>
   * <p>If there is no preserved value, <code>null</code> will be assumed.</p>
   * @param widget the widget whose property is to be compared, must not be 
   * <code>null</code>.
   * @param property the name of the property under which the preserved value 
   * can be looked up. Must not be <code>null</code>.
   * @param newValue the value that is compared to the preserved value
   */
  public static boolean hasChanged( final Widget widget, 
                                    final String property, 
                                    final Object newValue ) 
  {
    IWidgetAdapter adapter = getAdapter( widget );
    Object oldValue = adapter.getPreserved( property );
    return !equals( oldValue, newValue );
  }

  /**
   * <p>Determines whether the property of the given <code>widget</code> has
   * changed in comparison to its 'preserved' value.</p>
   * <p>In case it is the first time that the widget is rendered (it is not yet
   * present on the client side) <code>true</code> is only returned if the 
   * <code>newValue</code> differs from the <code>defaultValue</code>. Otherwise 
   * the decision is delegated to {@link hasChanged(Widget,String,Object)
   * <code>hasChanged(Widget,String,Object)</code>}.</p>
   * @param widget the widget whose property is to be compared, must not be 
   * <code>null</code>.
   * @param property the name of the property under which the preserved value 
   * can be looked up. Must not be <code>null</code>.
   * @param newValue the value that is compared to the preserved value
   * @param defaultValue the default value 
   */
  public static boolean hasChanged( final Widget widget, 
                                    final String property, 
                                    final Object newValue, 
                                    final Object defaultValue ) 
  {
    boolean result;
    IWidgetAdapter adapter = getAdapter( widget );
    if( adapter.isInitialized() ) {
      result = hasChanged( widget, property, newValue );
    } else {
      result = !equals( newValue, defaultValue );
    }
    return result;
  }

  /**
   * <p>Returns the value of the given widget's property. The value is read out
   * from the request and may be null if no value for the given property
   * was submitted.</p>
   * 
   * @param widget the widget to which the given property belongs.
   * @param propertyName the name of the widget-property that should be
   *                     read from the request.
   *                     TODO: [fappel] create a clear specification how
   *                                    property names should look like,
   *                                    in particular properties that are
   *                                    non primitive with their own props.
   * 
   */
  public static String readPropertyValue( final Widget widget, 
                                          final String propertyName ) 
  {
    HttpServletRequest request = ContextProvider.getRequest();
    StringBuffer key = new StringBuffer();
    key.append( getId( widget ) );
    key.append( "." );
    key.append( propertyName );
    return request.getParameter( key.toString() );
  }
  
  private static void throwAdapterException( final Class clazz ) {
    String text =   "Could not retrieve an instance of ''{0}''. Probably the "
                  + "AdapterFactory was not properly registered.";
    Object[] param = new Object[]{ clazz.getName() };
    String msg = MessageFormat.format( text, param );
    throw new IllegalStateException( msg );
  }

  ////////////////////////////////////////
  // Helping methods to test for equality
  
  static boolean equals( final Object object1, final Object object2 ) {
    boolean result;
    if( object1 == object2 ) {
      result = true;
    } else if( object1 == null ) {
      result = false;
    } else {
      result = object1.equals( object2 );
    }
    return result;
  }
}