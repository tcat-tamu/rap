/*******************************************************************************
 * Copyright (c) 2005, 2013 David Orme <djo@coconut-palm-software.com> and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    David Orme - Initial API and implementation
 *    Brad Reynolds - bug 139407
 *    EclipseSource - ongoing development
 ******************************************************************************/
package org.eclipse.rap.demo.databinding.nestedselection;

import java.util.Date;
import java.util.LinkedList;
import java.util.List;

public class SimplePerson extends ModelObject {

  private String name = "";
  private String address = "";
  private String city = "";
  private String state = "";
  private final List<SimpleOrder> orders = new LinkedList<SimpleOrder>();

  public SimplePerson( final String name,
                       final String address,
                       final String city,
                       final String state )
  {
    this.name = name;
    this.address = address;
    this.city = city;
    this.state = state;
    int numOrders = ( int )( Math.random() * 5 );
    for( int i = 0; i < numOrders; ++i ) {
      orders.add( new SimpleOrder( i, new Date() ) );
    }
  }

  public SimplePerson() {
  }

  /**
   * @return Returns the address.
   */
  public String getAddress() {
    return address;
  }

  /**
   * @param address The address to set.
   */
  public void setAddress( final String address ) {
    String old = this.address;
    this.address = address;
    firePropertyChange( "address", old, address );
  }

  /**
   * @return Returns the city.
   */
  public String getCity() {
    return city;
  }

  /**
   * @param city The city to set.
   */
  public void setCity( final String city ) {
    String old = this.city;
    firePropertyChange( "city", old, this.city = city );
  }

  /**
   * @return Returns the name.
   */
  public String getName() {
    return name;
  }

  /**
   * @param name The name to set.
   */
  public void setName( final String name ) {
    firePropertyChange( "name", this.name, this.name = name );
  }

  /**
   * @return Returns the state.
   */
  public String getState() {
    return state;
  }

  /**
   * @param state The state to set.
   */
  public void setState( final String state ) {
    firePropertyChange( "state", this.state, this.state = state ); //$NON-NLS-1$
  }

  /**
   * @return Returns the orders.
   */
  public List getOrders() {
    return orders;
  }
}
