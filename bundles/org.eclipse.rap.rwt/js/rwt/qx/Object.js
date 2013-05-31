/*******************************************************************************
 * Copyright: 2004, 2012 1&1 Internet AG, Germany, http://www.1und1.de,
 *                       and EclipseSource
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this
 * distribution, and is available at http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    1&1 Internet AG and others - original API and implementation
 *    EclipseSource - adaptation for the Eclipse Remote Application Platform
 ******************************************************************************/

/*global console: false */

/**
 * The qooxdoo root class. All other classes are direct or indirect subclasses of this one.
 *
 * This class contains methods for:
 *
 * * object management (creation and destruction)
 * * generic setter support
 * * user friendly OO interfaces like {@link #self} or {@link #base}
 */
rwt.qx.Class.define("rwt.qx.Object", {
  extend : Object,




  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */


  construct : function()
  {
    this._hashCode = rwt.qx.Object.__availableHashCode++;

    if (this._autoDispose)
    {
      // try to get a re-usable key
      this.__dbKey=rwt.qx.Object.__freeAvailableDbKeys.pop();

      if (!this.__dbKey) {
        // no re-usable key found ==> append to registry
        this.__dbKey = rwt.qx.Object.__db.length;
        rwt.qx.Object.__db.push(this);
      } else {
        // re-use key
        rwt.qx.Object.__db[this.__dbKey] = this;
      }
    }
  },

  /*
  *****************************************************************************
     STATICS
  *****************************************************************************
  */

  statics :
  {
    /** TODOC */
    __availableHashCode : 0,

    /** TODOC */
    __freeAvailableDbKeys : [],


    /** TODOC */
    __db : [],


    /** TODOC */
    __disposeAll : false,


    /** Internal type */
    $$type : "Object",


    /**
     * Returns an unique identifier for the given object. If such an identifier
     * does not yet exist, create it.
     *
     * @type static
     * @param obj {Object} the Object to get the hashcode for
     * @return {Integer} unique identifier for the given object
     */
    toHashCode : function(obj)
    {
      if (obj._hashCode != null) {
        return obj._hashCode;
      }

      return obj._hashCode = this.__availableHashCode++;
    },


    /**
     * Returns the database created, but not yet disposed elements.
     * Please be sure to not modify the given array!
     *
     * @type static
     * @internal
     * @return {Array} The database
     */
    getDb : function() {
      return this.__db;
    },


    /**
     * Destructor. This method is called by qooxdoo on object destruction.
     *
     * Any class that holds resources like links to DOM nodes must override
     * this method and free these resources.
     *
     * @type static
     * @param unload {Boolean?false} Whether the dispose is fired through the page unload event
     * @return {void}
     */
    dispose : function(unload)
    {
      if (this.__disposed) {
        return;
      }

      this.__disposed = true;
      this.__unload = unload || false;

      // var vStart = (new Date).valueOf();
      var vObject, vObjectDb = this.__db;

      for (var i=vObjectDb.length - 1; i>=0; i--)
      {
        vObject = vObjectDb[i];

        if (vObject && vObject.__disposed === false) {
          vObject.dispose();
        }
      }
    },


    /**
     * Returns whether a global dispose is currently taking place.
     *
     * @type static
     * @return {Boolean} whether a global dispose is taking place.
     */
    inGlobalDispose : function() {
      return this.__disposed || false;
    },


    /**
     * Returns whether a global unload (page unload) is currently taking place.
     *
     * @type static
     * @return {Boolean} whether a global unload is taking place.
     */
    isPageUnload : function() {
      return this.__unload || false;
    }
  },






  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /** If the object should automatically be disposed on application unload */
    _autoDispose : true,

    /**
     * Store user defined data inside the object.
     *
     * @type member
     * @param key {String} the key
     * @param value {Object} the value of the user data
     * @return {void}
     */
    setUserData : function(key, value)
    {
      if (!this.__userData) {
        this.__userData = {};
      }

      this.__userData[key] = value;
    },


    /**
     * Load user defined data from the object
     *
     * @type member
     * @param key {String} the key
     * @return {Object} the user data
     */
    getUserData : function(key)
    {
      if (!this.__userData) {
        return null;
      }
      var data = this.__userData[key];
      return data === undefined ? null : data;
    },

    /*
    ---------------------------------------------------------------------------
      BASICS
    ---------------------------------------------------------------------------
    */

    /**
     * Return unique hash code of object
     *
     * @type member
     * @return {Integer} unique hash code of the object
     */
    toHashCode : function() {
      return this._hashCode;
    },


    /**
     * Returns a string represantation of the qooxdoo object.
     *
     * @type member
     * @return {String} string representation of the object
     */
    toString : function()
    {
      if (this.classname) {
        return "[object " + this.classname + "]";
      }

      return "[object Object]";
    },


    /**
     * Call the same method of the super class.
     *
     * @type member
     * @param args {arguments} the arguments variable of the calling method
     * @param varags {var} variable number of arguments passed to the overwritten function
     * @return {var} the return value of the method of the base class.
     */
    base : function(args, varags)
    {
      if (arguments.length === 1) {
        return args.callee.base.call(this);
      } else {
        return args.callee.base.apply(this, Array.prototype.slice.call(arguments, 1));
      }
    },


    /**
     * Returns the static class (to access static members of this class)
     *
     * @type member
     * @param args {arguments} the arguments variable of the calling method
     * @return {var} the return value of the method of the base class.
     */
    self : function(args) {
      return args.callee.self;
    },


    /**
     * Returns the key of the object used in the objects DB
     * received by {@link #getDb()}.
     *
     * @type member
     * @internal
     * @return {Integer} The key in the db for the current object.
     */
    getDbKey: function() {
      return this.__dbKey;
    },


    /*
    ---------------------------------------------------------------------------
      COMMON SETTER/GETTER/RESETTER SUPPORT
    ---------------------------------------------------------------------------
    */

    /**
     * Sets multiple properties at once by using a property list or
     * sets one property and its value by the first and second argument.
     *
     * @type member
     * @param data {Map | String} a map of property values. The key is the name of the property.
     * @param value {var?} the value, only used when <code>data</code> is a string.
     * @return {Object} this instance.
     * @throws an Exception if a property defined does not exist
     */
    set : function(data, value)
    {
      var setter = rwt.qx.Property.$$method.set;

      if (typeof data === "string")
      {
        return this[setter[data]](value);
      }
      else
      {
        for (var prop in data)
        {
          this[setter[prop]](data[prop]);
        }

        return this;
      }
    },


    /**
     * Returns the value of the given property.
     *
     * @type member
     * @param prop {String} Name of the property.
     * @return {var} The value of the value
     * @throws an Exception if a property defined does not exist
     */
    get : function(prop)
    {
      var getter = rwt.qx.Property.$$method.get;
      return this[getter[prop]]();
    },


    /**
     * Resets the value of the given property.
     *
     * @type member
     * @param prop {String} Name of the property.
     * @throws an Exception if a property defined does not exist
     */
    reset : function(prop)
    {
      var resetter = rwt.qx.Property.$$method.reset;
      this[resetter[prop]]();
    },






    /*
    ---------------------------------------------------------------------------
      DISPOSER
    ---------------------------------------------------------------------------
    */

    /** TODOC */
    __disposed : false,


    /**
     * Returns true if the object is disposed.
     *
     * @type member
     * @return {Boolean} whether the object has been disposed
     */
    getDisposed : function() {
      return this.__disposed;
    },


    /**
     * Returns true if the object is disposed.
     *
     * @type member
     * @return {Boolean} whether the object has been disposed
     */
    isDisposed : function() {
      return this.__disposed;
    },


    /**
     * Dispose this object
     *
     * @type member
     * @return {void}
     */
    dispose : function()
    {
      // Check first
      if (this.__disposed) {
        return;
      }

      // Mark as disposed (directly, not at end, to omit recursions)
      this.__disposed = true;

      // Deconstructor support for classes
      var clazz = this.constructor;
      var mixins;

      while (clazz.superclass)
      {
        // Processing this class...
        if (clazz.$$destructor) {
          clazz.$$destructor.call(this);
        }

        // Destructor support for mixins
        if (clazz.$$includes)
        {
          mixins = clazz.$$flatIncludes;

          for (var i=0, l=mixins.length; i<l; i++)
          {
            if (mixins[i].$$destructor) {
              mixins[i].$$destructor.call(this);
            }
          }
        }

        // Jump up to next super class
        clazz = clazz.superclass;
      }

    },

    // Prevent old custom widgets using logging from crashing:
    debug : rwt.util.Variant.select( "qx.debug", {
      "on" : function( msg ) {
        if( window.console && typeof console.log === "function" ) {
          console.log( msg );
        }
      },
      "default" : function( msg ) {
      }
    } ),

    info : function( msg ) {
      this.debug( "INFO: " + msg );
    },

    warn : function( msg ) {
      this.debug( "WARN: " + msg );
    },

    error : function( msg ) {
      this.debug( "ERROR: " + msg );
    },

    printStackTrace : rwt.util.Variant.select( "qx.debug", {
      "on" : function() {
        if( console && typeof console.trace === "function" ) {
          this.debug( "Current stack trace:" );
          console.trace();
        }
      },
      "default" : function() {
      }
    } ),

    /*
    ---------------------------------------------------------------------------
      DISPOSER UTILITIES
    ---------------------------------------------------------------------------
    */

    /**
     * Disconnects given fields from instance.
     *
     * @type member
     * @param varargs {arguments} fields to dispose
     */
    _disposeFields : function(varargs)
    {
      var name;

      for (var i=0, l=arguments.length; i<l; i++)
      {
        var name = arguments[i];

        if (this[name] == null) {
          continue;
        }

        if (!this.hasOwnProperty(name))
        {
          continue;
        }

        this[name] = null;
      }
    },


    /**
     * Disconnects and disposes given objects from instance.
     * Only works with rwt.qx.Object based objects e.g. Widgets.
     *
     * @type member
     * @param varargs {arguments} fields to dispose
     */
    _disposeObjects : function(varargs)
    {
      var name;

      for (var i=0, l=arguments.length; i<l; i++)
      {
        var name = arguments[i];

        if (this[name] == null) {
          continue;
        }

        if (!this.hasOwnProperty(name))
        {
          continue;
        }

        if (!this[name].dispose) {
          throw new Error(this.classname + "." + name + " is not a qooxdoo object. Use _disposeFields instead of _disposeObjects.");
        }

        this[name].dispose();
        this[name] = null;
      }
    },


    /**
     * Disconnects and disposes given objects (deeply) from instance.
     * Works with arrays, maps and qooxdoo objects.
     *
     * @type member
     * @param name {String} field name to dispose
     * @param deep {Number} how deep to following sub objects. Deep=0 means
     *   just the object and all its keys. Deep=1 also dispose deletes the
     *   objects object content.
     */
    _disposeObjectDeep : function(name, deep)
    {
      var name;

      if (this[name] == null) {
        return;
      }

      if (!this.hasOwnProperty(name))
      {
        return;
      }

      this.__disposeObjectsDeepRecurser(this[name], deep || 0);
      this[name] = null;
    },


    /**
     * Helper method for _disposeObjectDeep. Do the recursive work.
     *
     * @type member
     * @param obj {Object} object to dispose
     * @param deep {Number} how deep to following sub objects. Deep=0 means
     *   just the object and all its keys. Deep=1 also dispose deletes the
     *   objects object content.
     */
    __disposeObjectsDeepRecurser : function(obj, deep)
    {
      // qooxdoo
      if (obj instanceof rwt.qx.Object)
      {
        obj.dispose();
      }

      // Array
      else if (obj instanceof Array)
      {
        for (var i=0, l=obj.length; i<l; i++)
        {
          var entry = obj[i];

          if (entry == null) {
            continue;
          }

          if (typeof entry == "object")
          {
            if (deep > 0)
            {
              this.__disposeObjectsDeepRecurser(entry, deep-1);
            }
            obj[i] = null;
          }
          else if (typeof entry == "function")
          {
            obj[i] = null;
          }
        }
      }

      // Map
      else if (obj instanceof Object)
      {
        for (var key in obj)
        {
          if (obj[key] == null || !obj.hasOwnProperty(key)) {
            continue;
          }

          var entry = obj[key];

          if (typeof entry == "object")
          {
            if (deep > 0)
            {
              this.__disposeObjectsDeepRecurser(entry, deep-1);
            }
            obj[key] = null;
          }
          else if (typeof entry == "function")
          {
            obj[key] = null;
          }
        }
      }
    }
  },

  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */

  destruct : function()
  {
    // Cleanup properties
    var clazz = this.constructor;
    var properties;
    var store = rwt.qx.Property.$$store;
    var storeUser = store.user;
    var storeTheme = store.theme;
    var storeInherit = store.inherit;
    var storeUseinit = store.useinit;
    var storeInit = store.init;

    while(clazz)
    {
      properties = clazz.$$properties;
      if (properties)
      {
        for (var name in properties)
        {
          if (properties[name].dispose) {
            this[storeUser[name]] = this[storeTheme[name]] = this[storeInherit[name]] = this[storeUseinit[name]] = this[storeInit[name]] = undefined;
          }
        }
      }

      clazz = clazz.superclass;
    }
    this._disposeFields("__userData");

    // Delete Entry from Object DB
    if (this.__dbKey != null)
    {
      if (rwt.qx.Object.__disposeAll) {
        rwt.qx.Object.__db[this.__dbKey] = null;
      } else {
        delete rwt.qx.Object.__db[this.__dbKey];
      }
      rwt.qx.Object.__freeAvailableDbKeys.push(this.__dbKey);
    }
  }
});
