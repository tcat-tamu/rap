/*******************************************************************************
 * Copyright (c) 2011 Frank Appel and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    Frank Appel - initial API and implementation
 *    EclipseSource - ongoing development
 ******************************************************************************/
package org.eclipse.rwt.internal.engine;

import java.text.MessageFormat;
import java.util.HashMap;
import java.util.Map;

import org.eclipse.rwt.internal.util.ClassUtil;
import org.eclipse.rwt.internal.util.ParamCheck;


public class ApplicationContext {

  public static interface InstanceTypeFactory {
    Object createInstance();
    Class getInstanceType();
  }

  private final Map instances;

  public ApplicationContext() {
    this( new Class[ 0 ] );
  }

  public ApplicationContext( Class[] instanceTypes ) {
    instances = new HashMap();
    createInstances( instanceTypes );
  }

  Object getInstance( Class instanceType ) {
    ParamCheck.notNull( instanceType, "instanceType" );
    Object result = findInstance( instanceType );
    // do param check here to avoid duplicate map access
    checkRegistered( instanceType, result );
    return result;
  }

  private void createInstances( Class[] instanceTypes ) {
    for( int i = 0; i < instanceTypes.length; i++ ) {
      Object instance = ClassUtil.newInstance( instanceTypes[ i ] );
      bufferInstance( instanceTypes[ i ], instance );
    }
  }

  private Object findInstance( Class instanceType ) {
    return instances.get( instanceType );
  }

  private void bufferInstance( Class instanceType, Object instance ) {
    Object toRegister = createInstanceFromFactory( instance );
    Class registrationType = getTypeFromFactory( instanceType, instance );
    checkInstanceOf( toRegister, registrationType );
    checkAlreadyRegistered( registrationType );
    instances.put( registrationType, toRegister );
  }

  private void checkAlreadyRegistered( Class registrationType ) {
    if( instances.containsKey( registrationType ) ) {
      String pattern
        = "The instance type ''{0}'' has already been registered.";
      Object[] arguments = new Object[] { registrationType.getName() };
      throwIllegalArgumentException( pattern, arguments );
    }
  }

  private static Object createInstanceFromFactory( Object instance ) {
    Object result = instance;
    if( instance instanceof InstanceTypeFactory ) {
      InstanceTypeFactory factory = ( InstanceTypeFactory )instance;
      result = factory.createInstance();
    }
    return result;
  }

  private static Class getTypeFromFactory( Class instanceType, Object instance ) {
    Class result = instanceType;
    if( instance instanceof InstanceTypeFactory ) {
      InstanceTypeFactory factory = ( InstanceTypeFactory )instance;
      result = factory.getInstanceType();
    }
    return result;
  }

  private static void checkRegistered( Class instanceType, Object instance ) {
    if( instance == null ) {
      String pattern = "Unregistered instance type ''{0}''";
      Object[] arguments = new Object[] { instanceType };
      throwIllegalArgumentException( pattern, arguments );
    }
  }

  private static void checkInstanceOf( Object instance, Class type ) {
    if( !type.isInstance( instance ) ) {
      String pattern
        = "Instance to register does not match declared type ''{0}''.";
      Object[] arguments = new Object[] { type.getName() };
      throwIllegalArgumentException( pattern, arguments );
    }
  }

  private static void throwIllegalArgumentException( String pattern, Object[] arx ) {
    String msg = MessageFormat.format( pattern, arx );
    throw new IllegalArgumentException( msg );
  }
}
