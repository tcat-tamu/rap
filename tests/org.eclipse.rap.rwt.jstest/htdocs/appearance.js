/*
  NOTE : delete this file after fixing
  Bug 378225 - [ipad] JavaScript tests not working when using jetty/ClientResourcesServiceHandler
*/

rwt.theme.AppearanceManager.getInstance().setCurrentTheme( {
  name : "rwtAppearance",
  appearances : {

  "empty" : {
  },

  "widget" : {
  },

  "image" : {
  },

  /*
  ---------------------------------------------------------------------------
    CORE
  ---------------------------------------------------------------------------
  */

  "cursor-dnd-move" : {
    style : function( states ) {
      return {
        source : "widget/cursors/move.gif"
      };
    }
  },

  "cursor-dnd-copy" : {
    style : function( states ) {
      return {
        source : "widget/cursors/copy.gif"
      };
    }
  },

  "cursor-dnd-alias" : {
    style : function( states ) {
      return {
        source : "widget/cursors/alias.gif"
      };
    }
  },

  "cursor-dnd-nodrop" : {
    style : function( states ) {
      return {
        source : "widget/cursors/nodrop.gif"
      };
    }
  },

  "client-document" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      return {
        font : tv.getCssFont( "*", "font" ),
        textColor : "black",
        backgroundColor : "white"
      };
    }
  },

  "client-document-blocker" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {
        cursor : "default",
        animation : tv.getCssAnimation( "Shell-DisplayOverlay", "animation" ),
        backgroundColor : tv.getCssColor( "Shell-DisplayOverlay", "background-color" ),
        backgroundImage : tv.getCssImage( "Shell-DisplayOverlay", "background-image" ),
        opacity : tv.getCssFloat( "Shell-DisplayOverlay", "opacity" )
      };
      if(    result.backgroundImage == null
          && result.backgroundColor == "undefined" ) {
        // A background image or color is always needed for mshtml to
        // block the events successfully.
        result.backgroundImage = "static/image/blank.gif";
      }
      return result;
    }
  },

  "atom" : {
    style : function( states ) {
      return {
        cursor : "default",
        spacing : 4,
        width : "auto",
        height : "auto",
        horizontalChildrenAlign : "center",
        verticalChildrenAlign : "middle"
      };
    }
  },

  // Note: This appearance applies to qooxdoo labels (as embedded in Atom,
  //       Button, etc.). For SWT Label, see apperance "label-wrapper".
  //       Any styles set for this appearance cannot be overridden by themeing
  //       of controls that include a label! This is because the "inheritance"
  //       feature does not overwrite theme property values from themes.
  "label" : {
  },

  // Appearance used for qooxdoo "labelObjects" which are part of Atoms etc.
  "label-graytext" : {
    style : function( states ) {
    }
  },

  // this applies to a qooxdoo rwt.widgets.base.Atom that represents an RWT Label


  "htmlcontainer" : {
    include : "label"
  },

  "popup" : {
  },

  "iframe" : {
    style : function( states ) {
      return { };
    }
  },

  /*
  ---------------------------------------------------------------------------
    RESIZER
  ---------------------------------------------------------------------------
  */

  // TODO [rst] necessary?

  "resizer" : {
    style : function( states ) {
      return {};
    }
  },

  "resizer-frame" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      return {
        border : tv.getCssNamedBorder( "shadow" )
      };
    }
  },

  "widget-tool-tip" : {
    include : "popup",

    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {};
      result.border = tv.getCssBorder( "Widget-ToolTip", "border" );
      result.animation = tv.getCssAnimation( "Widget-ToolTip", "animation" );
      result.padding = tv.getCssBoxDimensions( "Widget-ToolTip", "padding" );
      result.textColor = tv.getCssColor( "Widget-ToolTip", "color" );
      result.font = tv.getCssFont( "Widget-ToolTip", "font" );
      result.backgroundColor = tv.getCssColor( "Widget-ToolTip", "background-color" );
      result.backgroundImage = tv.getCssImage( "Widget-ToolTip", "background-image" );
      result.backgroundGradient = tv.getCssGradient( "Widget-ToolTip", "background-image" );
      result.opacity = tv.getCssFloat( "Widget-ToolTip", "opacity" );
      result.shadow = tv.getCssShadow( "Widget-ToolTip", "box-shadow" );
      return result;
    }
  }
,

  "composite" : {
    style : function( states ) {
      var result = {};
      var tv = new rwt.theme.ThemeValues( states );
      result.backgroundColor = tv.getCssColor( "Composite", "background-color" );
      result.backgroundImage = tv.getCssImage( "Composite", "background-image" );
      result.backgroundGradient = tv.getCssGradient( "Composite", "background-image" );
      result.border = tv.getCssBorder( "Composite", "border" );
      result.opacity = tv.getCssFloat( "Composite", "opacity" );
      result.shadow = tv.getCssShadow( "Composite", "box-shadow" );
      return result;
    }
  }
,

  "button" : {
    include : "atom",

    style : function( states ) {
      // [tb] exists for compatibility with the original qooxdoo button
      var result = {};
      var tv = new rwt.theme.ThemeValues( states );
      result.font = tv.getCssFont( "Button", "font" );
      result.textColor = tv.getCssColor( "Button", "color" );
      result.backgroundColor = tv.getCssColor( "Button", "background-color" );
      result.backgroundImage = tv.getCssImage( "Button", "background-image" );
      result.backgroundGradient = tv.getCssGradient( "Button", "background-image" );
      result.border = tv.getCssBorder( "Button", "border" );
      result.spacing = tv.getCssDimension( "Button", "spacing" );
      result.padding = tv.getCssBoxDimensions( "Button", "padding" );
      result.cursor = tv.getCssCursor( "Button", "cursor" );
      result.opacity = tv.getCssFloat( "Button", "opacity" );
      result.textShadow = tv.getCssShadow( "Button", "text-shadow" );
      return result;
    }
  },

  "push-button" : {
    include : "button",

    style : function( states ) {
      var result = {};
      var tv = new rwt.theme.ThemeValues( states );
      result.animation = tv.getCssAnimation( "Button", "animation" );
      if( states.rwt_ARROW ) {
        result.icon = tv.getCssSizedImage( "Button-ArrowIcon", "background-image" );
      }
      return result;
    }
  },

  // ------------------------------------------------------------------------
  // CheckBox

  "check-box" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      return {
        border : tv.getCssBorder( "Button", "border" ),
        font : tv.getCssFont( "Button", "font" ),
        textColor : tv.getCssColor( "Button", "color" ),
        backgroundColor : tv.getCssColor( "Button", "background-color" ),
        backgroundImage : tv.getCssImage( "Button", "background-image" ),
        backgroundGradient : tv.getCssGradient( "Button", "background-image" ),
        spacing : tv.getCssDimension( "Button", "spacing" ),
        padding : tv.getCssBoxDimensions( "Button", "padding" ),
        selectionIndicator : tv.getCssSizedImage( "Button-CheckIcon", "background-image" ),
        cursor : tv.getCssCursor( "Button", "cursor" ),
        opacity : tv.getCssFloat( "Button", "opacity" ),
        textShadow : tv.getCssShadow( "Button", "text-shadow" )
      };
    }
  },


  // ------------------------------------------------------------------------
  // RadioButton

  "radio-button" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      return {
        border : tv.getCssBorder( "Button", "border" ),
        font : tv.getCssFont( "Button", "font" ),
        textColor : tv.getCssColor( "Button", "color" ),
        backgroundColor : tv.getCssColor( "Button", "background-color" ),
        backgroundImage : tv.getCssImage( "Button", "background-image" ),
        backgroundGradient : tv.getCssGradient( "Button", "background-image" ),
        spacing : tv.getCssDimension( "Button", "spacing" ),
        padding : tv.getCssBoxDimensions( "Button", "padding" ),
        selectionIndicator : tv.getCssSizedImage( "Button-RadioIcon", "background-image" ),
        cursor : tv.getCssCursor( "Button", "cursor" ),
        opacity : tv.getCssFloat( "Button", "opacity" ),
        textShadow : tv.getCssShadow( "Button", "text-shadow" )
      };
    }
  }
,

  "combo" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {};
      result.border = tv.getCssBorder( "Combo", "border" );
      result.backgroundColor = tv.getCssColor( "Combo", "background-color" );
      result.backgroundGradient = tv.getCssGradient( "Combo", "background-image" );
      result.textColor = tv.getCssColor( "Combo", "color" );
      result.font = tv.getCssFont( "Combo", "font" );
      result.shadow = tv.getCssShadow( "Combo", "box-shadow" );
      return result;
    }
  },

  "combo-list" : {
    include : "list",
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {};
      result.border = tv.getCssBorder( "Combo-List", "border" );
      result.textColor = tv.getCssColor( "Combo", "color" );
      result.font = tv.getCssFont( "Combo", "font" );
      result.backgroundColor = tv.getCssColor( "Combo", "background-color" );
      result.shadow = tv.getCssShadow( "Combo-List", "box-shadow" );
      result.textShadow = tv.getCssShadow( "Combo", "text-shadow" );
      return result;
    }
  },

  "combo-field" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {};
      result.font = tv.getCssFont( "Combo", "font" );
      // [if] Do not apply top/bottom paddings on the client
      var cssPadding = tv.getCssBoxDimensions( "Combo-Field", "padding" );
      result.paddingRight = cssPadding[ 1 ];
      result.paddingLeft = cssPadding[ 3 ];
      result.width = null;
      result.height = null;
      result.left = 0;
      result.right = tv.getCssDimension( "Combo-Button", "width" );
      result.top = 0;
      result.bottom = 0;
      result.textColor = tv.getCssColor( "Combo", "color" );
      result.textShadow = tv.getCssShadow( "Combo", "text-shadow" );
      return result;
    }
  },

  "combo-button" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {};
      var border = tv.getCssBorder( "Combo-Button", "border" );
      var borderLeft = tv.getCssBorder( "Combo-Button", "border-left" );
      result.border = tv.mergeBorders( border, null, null, null, borderLeft );
      result.width = tv.getCssDimension( "Combo-Button", "width" );
      result.height = null;
      result.top = 0;
      result.bottom = 0;
      result.right = 0;
      result.icon = tv.getCssImage( "Combo-Button-Icon", "background-image" );
      if( result.icon === rwt.theme.ThemeValues.NONE_IMAGE ) {
        result.icon = tv.getCssImage( "Combo-Button", "background-image" );
      } else {
        result.backgroundImage = tv.getCssImage( "Combo-Button", "background-image" );
      }
      result.backgroundGradient = tv.getCssGradient( "Combo-Button", "background-image" );
      // TODO [rst] rather use button.bgcolor?
      result.backgroundColor = tv.getCssColor( "Combo-Button", "background-color" );
      result.cursor = tv.getCssCursor( "Combo-Button", "cursor" );
      return result;
    }
  }
,

  "coolbar" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {};
      result.border = tv.getCssBorder( "*", "border" );
      result.backgroundGradient = tv.getCssGradient( "CoolBar", "background-image" );
      result.backgroundImage = tv.getCssImage( "CoolBar", "background-image" );
      return result;
    }
  },

  "coolitem" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {};
      result.border = tv.getCssBorder( "*", "border" );
      return result;
    }
  },

  "coolitem-handle" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {};
      if( states.vertical ) {
        result.height = tv.getCssDimension( "CoolItem-Handle", "width" );
      } else {
        result.width = tv.getCssDimension( "CoolItem-Handle", "width" );
      }
      result.border = tv.getCssBorder( "CoolItem-Handle", "border" );
      result.margin = [ 1, 2, 1, 0 ];
      result.cursor = "col-resize";
      return result;
    }
  }
,

  "ctabfolder" : {
    style: function( states ) {
      var result = {};
      var tv = new rwt.theme.ThemeValues( states );
      result.font = tv.getCssFont( "CTabItem", "font" );
      result.textColor = tv.getCssColor( "CTabItem", "color" );
      return result;
    }
  },

  "ctabfolder-body" : {
    style: function( states ) {
      var result = {};
      var tv = new rwt.theme.ThemeValues( states );
      result.backgroundColor = tv.getCssColor( "CTabItem", "background-color" );
      var color = tv.getCssColor( "CTabFolder", "border-color" );
      var radii = tv.getCssBoxDimensions( "CTabFolder", "border-radius" );
      var borderWidth = states.rwt_BORDER ? 1 : 0;
      if( radii[ 0 ] > 0 || radii[ 1 ] > 0 || radii[ 2 ] > 0 || radii[ 3 ] > 0 ) {
        var borderRadii;
        if( states.barTop ) {
          borderRadii = [ radii[ 0 ], radii[ 1 ], 0, 0 ];
        } else {
          borderRadii = [ 0, 0, radii[ 2 ], radii[ 3 ] ];
        }
        result.border = new rwt.html.Border( borderWidth, "rounded", color, borderRadii );
      } else {
        result.border = new rwt.html.Border( borderWidth, "solid", color );
      }
      return result;
    }
  },

  "ctabfolder-frame" : {
    style: function( states ) {
      var result = {};
      if( !states.rwt_FLAT ) {
        // get the background color for selected items
        var statesWithSelected = { "selected": true };
        for( var property in states ) {
          statesWithSelected[ property ] = states[ property ];
        }
        var tv = new rwt.theme.ThemeValues( statesWithSelected );
        var color = tv.getCssColor( "CTabItem", "background-color" );
        result.border = new rwt.html.Border( 2, "solid", color );
      } else {
        result.border = "undefined";
      }
      result.backgroundColor = "undefined";
      return result;
    }
  },

  "ctabfolder-separator" : {
    style: function( states ) {
      var result = {};
      var tv = new rwt.theme.ThemeValues( states );
      var color = tv.getCssColor( "CTabFolder", "border-color" );
      var border;
      if( states.barTop ) {
        border = new rwt.html.Border( [ 0, 0, 1, 0 ], "solid", color );
      } else {
        border = new rwt.html.Border( [ 1, 0, 0, 0 ], "solid", color );
      }
      result.border = border;
      return result;
    }
  },

  "ctab-item" : {
    style: function( states ) {
      var result = {};
      var tv = new rwt.theme.ThemeValues( states );
      result.cursor = "default";
      var padding = tv.getCssBoxDimensions( "CTabItem", "padding" );
      result.paddingLeft = padding[ 3 ];
      result.paddingRight = padding[ 1 ];
      result.spacing = tv.getCssDimension( "CTabItem", "spacing" );
      result.font = tv.getCssFont( "CTabItem", "font" );
      result.textColor = tv.getCssColor( "CTabItem", "color" );
      result.textShadow = tv.getCssShadow( "CTabItem", "text-shadow" );
      var color = tv.getCssColor( "CTabFolder", "border-color" );
      // create a copy of the radii from theme
      var radii = tv.getCssBoxDimensions( "CTabFolder", "border-radius" ).slice( 0 );
      // cut off rounded corners at opposite side of tabs
      if( states.barTop ) {
        radii[ 2 ] = 0;
        radii[ 3 ] = 0;
      } else {
        radii[ 0 ] = 0;
        radii[ 1 ] = 0;
      }
      var rounded = radii[ 0 ] > 0 || radii[ 1 ] > 0 || radii[ 2 ] > 0 || radii[ 3 ] > 0;
      var borderWidths = [ 0, 0, 0, 0 ];
      if( !states.nextSelected ) {
        borderWidths[ 1 ] = 1;
      }
      if( states.selected ) {
        borderWidths[ 3 ] = 1;
        if( states.barTop ) {
          borderWidths[ 0 ] = 1;
        } else {
          borderWidths[ 2 ] = 1;
        }
      }
      if( states.firstItem && states.rwt_BORDER && !rounded ) {
        borderWidths[ 3 ] = 1;
      }
      if( rounded && states.selected ) {
        result.border = new rwt.html.Border( borderWidths, "rounded", color, radii );
        result.containerOverflow = false;
      } else {
        result.border = new rwt.html.Border( borderWidths, "solid", color );
      }
      if( states.selected ) {
        result.backgroundColor = tv.getCssColor( "CTabItem", "background-color" );
        result.backgroundImage = tv.getCssImage( "CTabItem", "background-image" );
        result.backgroundGradient = tv.getCssGradient( "CTabItem", "background-image" );
      } else {
        result.backgroundColor = "undefined";
        result.backgroundImage = null;
        result.backgroundGradient = null;
      }
      return result;
    }
  },

  "ctabfolder-button" : {
    include : "image",
    style : function( states ) {
      var result = {};
      var tv = new rwt.theme.ThemeValues( states );
      if( states.over ) {
        result.backgroundColor = "white";
        var color = tv.getCssColor( "CTabFolder", "border-color" );
        result.border = new rwt.html.Border( 1, "solid", color );
      } else {
        result.backgroundColor = "undefined";
        result.border = "undefined";
      }
      return result;
    }
  },

  "ctabfolder-drop-down-button" : {
    include : "ctabfolder-button",
    style : function( states ) {
      var result = {};
      var tv = new rwt.theme.ThemeValues( states );
      result.icon = tv.getCssImage( "CTabFolder-DropDownButton-Icon", "background-image" );
      return result;
    }
  },

  "ctab-close-button" : {
    include : "image",

    style : function( states ) {
      return {
        source : states.over ? "widget/ctabfolder/close_hover.gif" : "widget/ctabfolder/close.gif"
      };
    }
  }
    ,

  "group-box" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      return {
        backgroundColor : tv.getCssColor( "Group", "background-color" ),
        border : tv.getCssBorder( "Group", "border" ),
        font : tv.getCssFont( "Group", "font"),
        textColor : tv.getCssColor( "Group", "color" )
      };
    }
  },

  "group-box-legend" : {
    include : "atom",
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      return {
        top : 0,
        left : 0,
        border : tv.getCssBorder( "Group-Label", "border" ),
        padding : tv.getCssBoxDimensions( "Group-Label", "padding" ),
        margin : tv.getCssBoxDimensions( "Group-Label", "margin" ),
        backgroundColor : tv.getCssColor( "Group-Label", "background-color" ),
        font : tv.getCssFont( "Group", "font"),
        textColor : tv.getCssColor( "Group-Label", "color" ),
        textShadow : tv.getCssShadow( "Group-Label", "text-shadow" )
      };
    }
  },

  "group-box-frame" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var margin = tv.getCssBoxDimensions( "Group-Frame", "margin" );
      return {
        top : margin[ 0 ],
        right : margin[ 1 ],
        bottom : margin[ 2 ],
        left : margin[ 3 ],
        border : tv.getCssBorder( "Group-Frame", "border" )
      };
    }
  }
,

  "label-wrapper" : {
    style : function( states ) {
      var result = {};
      var tv = new rwt.theme.ThemeValues( states );
      result.font = tv.getCssFont( "Label", "font" );
      var decoration = tv.getCssIdentifier( "Label", "text-decoration" );
      if( decoration != null && decoration != "none" ) {
        var decoratedFont = new rwt.html.Font();
        decoratedFont.setSize( result.font.getSize() );
        decoratedFont.setFamily( result.font.getFamily() );
        decoratedFont.setBold( result.font.getBold() );
        decoratedFont.setItalic( result.font.getItalic() );
        decoratedFont.setDecoration( decoration );
        result.font = decoratedFont;
      }
      result.textColor = tv.getCssColor( "Label", "color" );
      result.backgroundColor = tv.getCssColor( "Label", "background-color" );
      result.backgroundImage = tv.getCssImage( "Label", "background-image" );
      result.backgroundGradient = tv.getCssGradient( "Label", "background-image" );
      result.border = tv.getCssBorder( "Label", "border" );
      result.cursor = tv.getCssCursor( "Label", "cursor" );
      result.opacity = tv.getCssFloat( "Label", "opacity" );
      result.textShadow = tv.getCssShadow( "Label", "text-shadow" );
      return result;
    }
  },

  "separator-line" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {};
      if( states.rwt_VERTICAL ) {
        result.width = tv.getCssDimension( "Label-SeparatorLine", "width" );
      } else {
        result.height = tv.getCssDimension( "Label-SeparatorLine", "width" );
      }
      result.border = tv.getCssBorder( "Label-SeparatorLine", "border" );
      var orient = states.rwt_VERTICAL ? "vertical" : "horizontal";
      // TODO [tb] : Can we prevent creating a potentially useless border instance?
      var borderName;
      if( result.border === tv.getCssNamedBorder( "thinInset" ) ) {
        borderName = "separator.shadowin." + orient + ".border";
      } else if( result.border === tv.getCssNamedBorder( "thinOutset" ) ) {
        borderName = "separator.shadowout." + orient + ".border";
      }
      if( borderName ) {
        result.border = tv.getCssNamedBorder( borderName );
      }
      result.backgroundColor = tv.getCssColor( "Label-SeparatorLine", "background-color" );
      result.backgroundImage = tv.getCssImage( "Label-SeparatorLine", "background-image" );
      result.backgroundGradient = tv.getCssGradient( "Label-SeparatorLine", "background-image" );
      return result;
    }
  },

  "separator" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      return {
        backgroundColor : tv.getCssColor( "Label", "background-color" ),
        backgroundImage : tv.getCssImage( "Label", "background-image" ),
        backgroundGradient : tv.getCssGradient( "Label", "background-image" ),
        border : tv.getCssBorder( "Label", "border" ),
        cursor : tv.getCssCursor( "Label", "cursor" ),
        opacity : tv.getCssFloat( "Label", "opacity" )
      };
    }
  }
,

 "link" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      return {
        cursor: "default",
        padding : 2,
        font : tv.getCssFont( "Link", "font" ),
        border : tv.getCssBorder( "Link", "border" ),
        textColor : tv.getCssColor( "*", "color" ),
        textShadow : tv.getCssShadow( "Link", "text-shadow" )
      };
    }
  },

  "link-text" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      return {
        textColor: "inherit"
      };
    }
  }
,

  "list" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {};
      result.cursor = "default";
      result.overflow = "hidden";
      result.font = tv.getCssFont( "List", "font" );
      result.textColor = tv.getCssColor( "List", "color" );
      result.backgroundColor = tv.getCssColor( "List", "background-color" );
      result.border = tv.getCssBorder( "List", "border" );
      return result;
    }
  },

  "list-item" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {
        height : "auto",
        horizontalChildrenAlign : "left",
        verticalChildrenAlign : "middle",
        spacing : 4,
        minWidth : "auto"
      };
      result.textColor = tv.getCssColor( "List-Item", "color" );
      result.backgroundColor = tv.getCssColor( "List-Item", "background-color" );
      result.backgroundImage = tv.getCssImage( "List-Item", "background-image" );
      result.backgroundGradient = tv.getCssGradient( "List-Item", "background-image" );
      result.textShadow = tv.getCssShadow( "List-Item", "text-shadow" );
      result.padding = tv.getCssBoxDimensions( "List-Item", "padding" );
      return result;
    }
  }
,

  "menu" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      return {
        width : "auto",
        height : "auto",
        textColor : tv.getCssColor( "Menu", "color" ),
        backgroundColor : tv.getCssColor( "Menu", "background-color" ),
        backgroundImage : tv.getCssImage( "Menu", "background-image" ),
        backgroundGradient : tv.getCssGradient( "Menu", "background-image" ),
        animation : tv.getCssAnimation( "Menu", "animation" ),
        font : tv.getCssFont( "Menu", "font" ),
        overflow : "hidden",
        border : tv.getCssBorder( "Menu", "border" ),
        padding : tv.getCssBoxDimensions( "Menu", "padding" ),
        opacity : tv.getCssFloat( "Menu", "opacity" ),
        shadow : tv.getCssShadow( "Menu", "box-shadow" )
      };
    }
  },

  "menu-item" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {
        spacing : 2,
        padding : tv.getCssBoxDimensions( "MenuItem", "padding" ),
        backgroundImage : tv.getCssImage( "MenuItem", "background-image" ),
        backgroundGradient : tv.getCssGradient( "MenuItem", "background-image" ),
        backgroundColor : tv.getCssColor( "MenuItem", "background-color" ),
        height : states.onMenuBar ? "100%" : "auto",
        opacity : tv.getCssFloat( "MenuItem", "opacity" ),
        textShadow : tv.getCssShadow( "MenuItem", "text-shadow" )
      };
      result.textColor = tv.getCssColor( "MenuItem", "color" );
      if( states.cascade ) {
        result.arrow = tv.getCssSizedImage( "MenuItem-CascadeIcon", "background-image" );
      } else {
        result.arrow = null;
      }
      if( states.selected ) {
        if( states.check ) {
           result.selectionIndicator
             = tv.getCssSizedImage( "MenuItem-CheckIcon", "background-image" );
        } else if( states.radio ) {
           result.selectionIndicator
             = tv.getCssSizedImage( "MenuItem-RadioIcon", "background-image" );
        }
      } else {
        if( states.radio ) {
          var radioWidth = tv.getCssSizedImage( "MenuItem-RadioIcon", "background-image" )[ 1 ];
          result.selectionIndicator = [ null, radioWidth, 0 ];
        } else if( states.check ) {
          var checkWidth = tv.getCssSizedImage( "MenuItem-CheckIcon", "background-image" )[ 1 ];
          result.selectionIndicator = [ null, checkWidth, 0 ];
        } else {
          result.selectionIndicator = null;
        }
      }
      return result;
    }
  },

  "menu-separator" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      return {
        height : "auto",
        marginTop : 3,
        marginBottom : 2,
        padding : tv.getCssBoxDimensions( "MenuItem", "padding" )
      };
    }
  },

  "menu-separator-line" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      return {
        right : 0,
        left : 0,
        height : 0,
        border : tv.getCssNamedBorder( "verticalDivider" )
      };
    }
  }
,

  "progressbar" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {};
      result.border = tv.getCssBorder( "ProgressBar", "border" );
      result.backgroundColor = tv.getCssColor( "ProgressBar", "background-color" );
      result.backgroundImageSized = tv.getCssSizedImage( "ProgressBar", "background-image" );
      result.backgroundGradient = tv.getCssGradient( "ProgressBar", "background-image" );
      result.separatorBorder = tv.getCssBorder( "ProgressBar-Indicator", "border" );
      result.indicatorColor = tv.getCssColor( "ProgressBar-Indicator", "background-color" );
      result.indicatorImage = tv.getCssSizedImage( "ProgressBar-Indicator", "background-image" );
      result.indicatorGradient = tv.getCssGradient( "ProgressBar-Indicator", "background-image" );
      result.indicatorOpacity = tv.getCssFloat( "ProgressBar-Indicator", "opacity" );
      return result;
    }
  },

  "scrollbar-blocker" : {
    style : function( states ) {
      return {
        backgroundColor : "black",
        opacity : 0.2
      };
    }
  }
,

  "window" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {};
      // padding is only applied on the server, since client area content is
      // positioned absolutely
      result.backgroundColor = tv.getCssColor( "Shell", "background-color" );
      result.backgroundImage = tv.getCssImage( "Shell", "background-image" );
      result.backgroundGradient = tv.getCssGradient( "Shell", "background-image" );
      result.border = tv.getCssBorder( "Shell", "border" );
      result.minWidth = states.rwt_TITLE ? 80 : 5;
      result.minHeight = states.rwt_TITLE ? 25 : 5;
      result.opacity = tv.getCssFloat( "Shell", "opacity" );
      result.shadow = tv.getCssShadow( "Shell", "box-shadow" );
      result.animation = tv.getCssAnimation( "Shell", "animation" );
      return result;
    }
  },

  "window-captionbar" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {
        verticalChildrenAlign : "middle"
      };
      result.margin = tv.getCssBoxDimensions( "Shell-Titlebar", "margin" );
      result.padding = tv.getCssBoxDimensions( "Shell-Titlebar", "padding" );
      result.textColor = tv.getCssColor( "Shell-Titlebar", "color" );
      result.backgroundColor = tv.getCssColor( "Shell-Titlebar", "background-color" );
      result.backgroundImage = tv.getCssImage( "Shell-Titlebar", "background-image" );
      result.backgroundGradient = tv.getCssGradient( "Shell-Titlebar", "background-image" );
      result.border = tv.getCssBorder( "Shell-Titlebar", "border" );
      if( states.rwt_TITLE ) {
        result.minHeight = tv.getCssDimension( "Shell-Titlebar", "height" );
      } else {
        result.minHeight = 0;
      }
      result.maxHeight = result.minHeight;
      result.textShadow = tv.getCssShadow( "Shell-Titlebar", "text-shadow" );
      return result;
    }
  },

  "window-resize-frame" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      return {
        border : tv.getCssNamedBorder( "shadow" )
      };
    }
  },

  "window-captionbar-icon" : {
    style : function( states ) {
      return {
        marginRight : 2
      };
    }
  },

  "window-captionbar-title" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      return {
        cursor : "default",
        font : tv.getCssFont( "Shell-Titlebar", "font" ),
        marginRight : 2
      };
    }
  },

  "window-captionbar-minimize-button" : {
    style : function( states ) {
      var result = {};
      var tv = new rwt.theme.ThemeValues( states );
      result.icon = tv.getCssImage( "Shell-MinButton", "background-image" );
      result.margin = tv.getCssBoxDimensions( "Shell-MinButton", "margin" );
      return result;
    }
  },

  "window-captionbar-maximize-button" : {
    style : function( states ) {
      var result = {};
      var tv = new rwt.theme.ThemeValues( states );
      result.icon = tv.getCssImage( "Shell-MaxButton", "background-image" );
      result.margin = tv.getCssBoxDimensions( "Shell-MaxButton", "margin" );
      return result;
    }
  },

  "window-captionbar-restore-button" : {
    include : "window-captionbar-maximize-button"
  },

  "window-captionbar-close-button" : {
    style : function( states ) {
      var result = {};
      var tv = new rwt.theme.ThemeValues( states );
      result.icon = tv.getCssImage( "Shell-CloseButton", "background-image" );
      result.margin = tv.getCssBoxDimensions( "Shell-CloseButton", "margin" );
      return result;
    }
  },

  "window-statusbar" : {
    style : function( states ) {
      return {};
    }
  },

  "window-statusbar-text" : {
    style : function( states ) {
      return {};
    }
  }
,

  "spinner" : {
    style : function( states ) {
      var result = {};
      var tv = new rwt.theme.ThemeValues( states );
      result.font = tv.getCssFont( "Spinner", "font" );
      result.textColor = tv.getCssColor( "Spinner", "color" );
      result.backgroundColor = tv.getCssColor( "Spinner", "background-color" );
      result.border = tv.getCssBorder( "Spinner", "border" );
      result.backgroundGradient = tv.getCssGradient( "Spinner", "background-image" );
      result.shadow = tv.getCssShadow( "Spinner", "box-shadow" );
      return result;
    }
  },

  "spinner-text-field" : {
    style : function( states ) {
      var result = {};
      var tv = new rwt.theme.ThemeValues( states );
      // [if] Do not apply top/bottom paddings on the client
      var cssPadding = tv.getCssBoxDimensions( "Spinner-Field", "padding" );
      result.paddingRight = cssPadding[ 1 ];
      result.paddingLeft = cssPadding[ 3 ];
      result.top = 0;
      result.left = 0;
      result.right = 0;
      result.bottom = 0;
      result.textShadow = tv.getCssShadow( "Spinner", "text-shadow" );
      return result;
    }
  },

  "spinner-button-up" : {
    style : function( states ) {
      var result = {};
      var tv = new rwt.theme.ThemeValues( states );
      var border = tv.getCssBorder( "Spinner-UpButton", "border" );
      var borderLeft = tv.getCssBorder( "Spinner-UpButton", "border-left" );
      result.border = tv.mergeBorders( border, null, null, null, borderLeft );
      result.width = tv.getCssDimension( "Spinner-UpButton", "width" );
      result.icon = tv.getCssImage( "Spinner-UpButton-Icon", "background-image" );
      if( result.icon === rwt.theme.ThemeValues.NONE_IMAGE ) {
        result.icon = tv.getCssImage( "Spinner-UpButton", "background-image" );
      } else {
        result.backgroundImage = tv.getCssImage( "Spinner-UpButton", "background-image" );
      }
      result.backgroundGradient = tv.getCssGradient( "Spinner-UpButton", "background-image" );
      result.backgroundColor = tv.getCssColor( "Spinner-UpButton", "background-color" );
      result.cursor = tv.getCssCursor( "Spinner-UpButton", "cursor" );
      return result;
    }
  },

  "spinner-button-down" : {
    style : function( states ) {
      var result = {};
      var tv = new rwt.theme.ThemeValues( states );
      var border = tv.getCssBorder( "Spinner-DownButton", "border" );
      var borderLeft = tv.getCssBorder( "Spinner-DownButton", "border-left" );
      result.border = tv.mergeBorders( border, null, null, null, borderLeft );
      result.width = tv.getCssDimension( "Spinner-DownButton", "width" );
      result.icon = tv.getCssImage( "Spinner-DownButton-Icon", "background-image" );
      if( result.icon === rwt.theme.ThemeValues.NONE_IMAGE ) {
        result.icon = tv.getCssImage( "Spinner-DownButton", "background-image" );
      } else {
        result.backgroundImage = tv.getCssImage( "Spinner-DownButton", "background-image" );
      }
      result.backgroundGradient = tv.getCssGradient( "Spinner-DownButton", "background-image" );
      result.backgroundColor = tv.getCssColor( "Spinner-DownButton", "background-color" );
      result.cursor = tv.getCssCursor( "Spinner-DownButton", "cursor" );
      return result;
    }
  }
,

  "tab-view" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {};
      result.textColor = tv.getCssColor( "*", "color" );
      result.font = tv.getCssFont( "TabFolder", "font" );
      result.spacing = -1;
      result.border = tv.getCssBorder( "TabFolder", "border" );
      return result;
    }
  },

  "tab-view-bar" : {
    style : function( states ) {
      return {
        height : "auto"
      };
    }
  },

  "tab-view-pane" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {};
      result.overflow = "hidden";
      result.backgroundColor = tv.getCssColor( "*", "background-color" );
      result.border = tv.getCssBorder( "TabFolder-ContentContainer", "border" );
      return result;
    }
  },

  "tab-view-page" : {
//          style : function( states ) {
//            return {
// TODO [rst] disappeared in qx 0.7
//              top : 0,
//              right : 0,
//              bottom : 0,
//              left : 0
//            };
//          }
  },

  "tab-view-button" : {
    include : "atom",

    style : function( states ) {
      var result = {};
      var tv = new rwt.theme.ThemeValues( states );
      var borderColor = tv.getCssNamedColor( "thinborder" );
      var top_color = tv.getCssColor( "TabItem", "border-top-color" );
      var bottom_color = tv.getCssColor( "TabItem", "border-bottom-color" );
      var checkedColorTop = [ top_color, borderColor, borderColor, borderColor ];
      var checkedColorBottom = [ borderColor, borderColor, bottom_color, borderColor ];
      if( states.checked ) {
        result.zIndex = 1; // TODO [rst] Doesn't this interfere with our z-order?
        if( states.barTop ) {
          result.border = new rwt.html.Border( [ 3, 1, 0, 1 ], "solid", checkedColorTop );
        } else {
          result.border = new rwt.html.Border( [ 0, 1, 3, 1 ], "solid", checkedColorBottom );
        }
        result.margin = [ 0, -1, 0, -2 ];
        if( states.firstChild ) {
          result.marginLeft = 0;
        }
      } else {
        result.zIndex = 0; // TODO [rst] Doesn't this interfere with our z-order?
        result.marginRight = 1;
        result.marginLeft = 0;
        if( states.barTop ) {
          result.border = new rwt.html.Border( [ 1, 1, 0, 1 ], "solid", borderColor );
          result.marginTop = 3;
          result.marginBottom = 1;
        } else {
          result.border = new rwt.html.Border( [ 0, 1, 1, 1 ], "solid", borderColor );
          result.marginTop = 1;
          result.marginBottom = 3;
        }
      }
      result.padding = tv.getCssBoxDimensions( "TabItem", "padding" );
      if( states.checked ) {
        // Hack to hide the content containder border below the selected tab
        var containerBorder = tv.getCssBorder( "TabFolder-ContentContainer", "border" );
        result.paddingBottom = result.padding[ 2 ]  + containerBorder.getWidthTop();
      }
      result.backgroundColor = tv.getCssColor( "TabItem", "background-color" );
      result.backgroundImage = tv.getCssImage( "TabItem", "background-image" );
      result.backgroundGradient = tv.getCssGradient( "TabItem", "background-image" );
      result.textShadow = tv.getCssShadow( "TabItem", "text-shadow" );
      return result;
    }
  }
,

  "table" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      return {
        textColor : tv.getCssColor( "Table", "color" ),
        font : tv.getCssFont( "Table", "font" ),
        border : tv.getCssBorder( "Table", "border" ),
        backgroundColor : tv.getCssColor( "Table", "background-color" ),
        backgroundImage : tv.getCssImage( "Table", "background-image" ),
        backgroundGradient : tv.getCssGradient( "Table", "background-image" )
      };
    }
  },

  "table-column" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {
        cursor : "default",
        spacing : 2,
        opacity : states.moving ? 0.6 : 1.0
      };
      result.padding = tv.getCssBoxDimensions( "TableColumn", "padding" );
      result.textColor = tv.getCssColor( "TableColumn", "color" );
      result.font = tv.getCssFont( "TableColumn", "font" );
      result.backgroundColor = tv.getCssColor( "TableColumn", "background-color" );
      result.backgroundImage = tv.getCssImage( "TableColumn", "background-image" );
      result.backgroundGradient = tv.getCssGradient( "TableColumn", "background-image" );
      var borderColors = [ null, null, null, null ];
      var borderWidths = [ 0, 0, 0, 0 ];
      var borderStyles = [ "solid", "solid", "solid", "solid" ];
      if( !states.dummy ) {
        var verticalState = { "vertical" : true };
        var tvGrid = new rwt.theme.ThemeValues( verticalState );
        var gridColor = tvGrid.getCssColor( "Table-GridLine", "color" );
        gridColor = gridColor == "undefined" ? "transparent" : gridColor;
        borderColors[ 1 ] = gridColor;
        borderWidths[ 1 ] = 1;
      }
      var borderBottom = tv.getCssBorder( "TableColumn", "border-bottom" );
      borderWidths[ 2 ] = borderBottom.getWidthBottom();
      borderStyles[ 2 ] = borderBottom.getStyleBottom();
      borderColors[ 2 ] = borderBottom.getColorBottom();
      result.border = new rwt.html.Border( borderWidths, borderStyles, borderColors );
      result.textShadow = tv.getCssShadow( "TableColumn", "text-shadow" );
      return result;
    }
  },

  "table-column-resizer" : {
    style : function( states ) {
      return {
        width : 3,
        opacity : 0.3,
        backgroundColor : "black"
      };
    }
  },

  "table-column-sort-indicator" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {};
      result.source = tv.getCssImage( "TableColumn-SortIndicator", "background-image" );
      return result;
    }
  },

  "table-row" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {};
      result.itemBackground = tv.getCssColor( "TableItem", "background-color" );
      result.itemBackgroundImage = tv.getCssImage( "TableItem", "background-image" );
      result.itemBackgroundGradient = tv.getCssGradient( "TableItem", "background-image" );
      result.itemForeground = tv.getCssColor( "TableItem", "color" );
      result.overlayBackground = tv.getCssColor( "Table-RowOverlay", "background-color" );
      result.overlayBackgroundImage = tv.getCssImage( "Table-RowOverlay", "background-image" );
      result.overlayBackgroundGradient = tv.getCssGradient( "Table-RowOverlay", "background-image" );
      result.overlayForeground = tv.getCssColor( "Table-RowOverlay", "color" );
      result.textDecoration = tv.getCssIdentifier( "TableItem", "text-decoration" );
      result.textShadow = tv.getCssShadow( "TableItem", "text-shadow" );
      return result;
    }
  },

  "table-row-check-box" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      return {
        backgroundImage : tv.getCssImage( "Table-Checkbox", "background-image" )
      };
    }
  },

  "table-gridline-vertical" : {
    style : function( states ) {
      var verticalState = { "vertical" : true };
      var tv = new rwt.theme.ThemeValues( verticalState );
      var gridColor = tv.getCssColor( "Table-GridLine", "color" );
      gridColor = gridColor == "undefined" ? "transparent" : gridColor;
      var result = {};
      result.border = new rwt.html.Border( [ 0, 0, 0, 1 ], "solid", gridColor );
      return result;
    }
  }
,

  "text-field" : {
    style : function( states ) {
      var result = {};
      var tv = new rwt.theme.ThemeValues( states );
      result.font = tv.getCssFont( "Text", "font" );
      result.textColor = tv.getCssColor( "Text", "color" );
      result.backgroundColor = tv.getCssColor( "Text", "background-color" );
      result.backgroundImage = tv.getCssImage( "Text", "background-image" );
      result.backgroundGradient = tv.getCssGradient( "Text", "background-image" );
      result.border = tv.getCssBorder( "Text", "border" );
      // [if] Do not apply top/bottom paddings on the client
      var cssPadding = tv.getCssBoxDimensions( "Text", "padding" );
      result.paddingRight = cssPadding[ 1 ];
      result.paddingLeft = cssPadding[ 3 ];
      result.textShadow = tv.getCssShadow( "Text", "text-shadow" );
      result.shadow = tv.getCssShadow( "Text", "box-shadow" );
      return result;
    }
  },

  "text-field-message" : {
    style : function( states ) {
      var result = {};
      var tv = new rwt.theme.ThemeValues( states );
      result.font = tv.getCssFont( "Text", "font" );
      result.textColor = tv.getCssColor( "Text-Message", "color" );
      // [if] Do not apply top/bottom paddings on the client
      var cssPadding = tv.getCssBoxDimensions( "Text", "padding" );
      result.paddingRight = cssPadding[ 1 ];
      result.paddingLeft = cssPadding[ 3 ];
      result.horizontalChildrenAlign = "left";
      result.textShadow = tv.getCssShadow( "Text-Message", "text-shadow" );
      return result;
    }
  },

  "text-area" : {
    include : "text-field",
    style : function( states ) {
      return {
        padding : [ 0, 0, 0, 3 ]
      };
    }
  }
,

  "toolbar" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      return {
        font : tv.getCssFont( "ToolBar", "font" ),
        overflow : "hidden",
        border : tv.getCssBorder( "ToolBar", "border" ),
        textColor : tv.getCssColor( "ToolBar", "color" ),
        backgroundColor : tv.getCssColor( "ToolBar", "background-color" ),
        backgroundGradient : tv.getCssGradient( "ToolBar", "background-image" ),
        backgroundImage : tv.getCssImage( "ToolBar", "background-image" ),
        opacity : tv.getCssFloat( "ToolBar", "opacity" )
      };
    }
  },

  "toolbar-separator" : {
    style : function( states ) {
      return {};
    }
  },

  "toolbar-separator-line" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = null;
      if( states.vertical ) {
        result = {
          left : 2,
          height : 2,
          right : 2,
          border : tv.getCssNamedBorder( "verticalDivider" )
        };
      } else {
        result = {
          top : 2,
          width : 2,
          bottom : 2,
          border : tv.getCssNamedBorder( "horizontalDivider" )
        };
      }
      return result;
    }
  },

  "toolbar-button" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {
        cursor : "default",
        overflow : "hidden",
        width : "auto",
        verticalChildrenAlign : "middle"
      };
      result.spacing = tv.getCssDimension( "ToolItem", "spacing" );
      result.animation = tv.getCssAnimation( "ToolItem", "animation" );
      result.textColor = tv.getCssColor( "ToolItem", "color" );
      result.textShadow = tv.getCssShadow( "ToolItem", "text-shadow" );
      result.backgroundColor = tv.getCssColor( "ToolItem", "background-color" );
      result.opacity = tv.getCssFloat( "ToolItem", "opacity" );
      result.backgroundImage = tv.getCssImage( "ToolItem", "background-image" );
      result.backgroundGradient = tv.getCssGradient( "ToolItem", "background-image" );
      result.border = tv.getCssBorder( "ToolItem", "border" );
      result.padding = tv.getCssBoxDimensions( "ToolItem", "padding" );
      result.horizontalChildrenAlign = states.rwt_VERTICAL ? "left" : "center";
      if( states.dropDown ) {
        result.dropDownArrow = tv.getCssSizedImage( "ToolItem-DropDownIcon", "background-image" );
        result.separatorBorder = tv.getCssBorder( "ToolItem-DropDownIcon", "border" );
      } else {
        result.dropDownArrow = null;
        result.separatorBorder = null;
      }
      return result;
    }
  }
,

"tree" : {
  style : function( states ) {
    var tv = new rwt.theme.ThemeValues( states );
    return {
      backgroundColor : tv.getCssColor( "Tree", "background-color" ),
      textColor : tv.getCssColor( "Tree", "color" ),
      font : tv.getCssFont( "Tree", "font" ),
      border : tv.getCssBorder( "Tree", "border" )
    };
  }
},

"tree-row" : {
  style : function( states ) {
    var tv = new rwt.theme.ThemeValues( states );
    var result = {};
    result.itemBackground = tv.getCssColor( "TreeItem", "background-color" );
    result.itemBackgroundImage = tv.getCssImage( "TreeItem", "background-image" );
    result.itemBackgroundGradient = tv.getCssGradient( "TreeItem", "background-image" );
    result.itemForeground = tv.getCssColor( "TreeItem", "color" );
    result.overlayBackground = tv.getCssColor( "Tree-RowOverlay", "background-color" );
    result.overlayBackgroundImage = tv.getCssImage( "Tree-RowOverlay", "background-image" );
    result.overlayBackgroundGradient = tv.getCssGradient( "Tree-RowOverlay", "background-image" );
    result.overlayForeground = tv.getCssColor( "Tree-RowOverlay", "color" );
    result.textDecoration = tv.getCssIdentifier( "TreeItem", "text-decoration" );
    result.textShadow = tv.getCssShadow( "TreeItem", "text-shadow" );
    return result;
  }
},

"tree-row-check-box" : {
  style : function( states ) {
    var tv = new rwt.theme.ThemeValues( states );
    return {
      backgroundImage : tv.getCssImage( "Tree-Checkbox", "background-image" )
    };
  }
},

"tree-row-indent" : {
  style : function( states ) {
    var tv = new rwt.theme.ThemeValues( states );
    return {
      backgroundImage : tv.getCssImage( "Tree-Indent", "background-image" )
    };
  }
},

"tree-column" : {
  style : function( states ) {
    var tv = new rwt.theme.ThemeValues( states );
    var result = {};
    result.cursor = "default";
    result.spacing = 2;
    result.textColor = tv.getCssColor( "TreeColumn", "color" );
    result.font = tv.getCssFont( "TreeColumn", "font" );
    if( states.footer ) {
      //result.backgroundColor = "#efefef"; // this would make it "merged" with scrollbars
      result.backgroundColor = "#dddddd";
      result.backgroundImage = null;
      result.backgroundGradient = null;
    } else {
      result.backgroundColor = tv.getCssColor( "TreeColumn", "background-color" );
      result.backgroundImage = tv.getCssImage( "TreeColumn", "background-image" );
      result.backgroundGradient = tv.getCssGradient( "TreeColumn", "background-image" );
    }
    result.opacity = states.moving ? 0.85 : 1.0;
    result.padding = tv.getCssBoxDimensions( "TreeColumn", "padding" );
    var borderColors = [ null, null, null, null ];
    var borderWidths = [ 0, 0, 0, 0 ];
    var borderStyles = [ "solid", "solid", "solid", "solid" ];
    if( !states.dummy && !states.footer ) {
      var verticalState = { "vertical" : true };
      var tvGrid = new rwt.theme.ThemeValues( verticalState );
      var gridColor = tvGrid.getCssColor( "Tree-GridLine", "color" );
      gridColor = gridColor == "undefined" ? "transparent" : gridColor;
      borderColors[ 1 ] = gridColor;
      borderWidths[ 1 ] = 1;
      if( states.moving ) {
        borderColors[ 3 ] = gridColor;
        borderWidths[ 3 ] = 1;
      }
    }
    var borderBottom = tv.getCssBorder( "TreeColumn", "border-bottom" );
    if( states.footer ) {
      borderWidths[ 0 ] = borderBottom.getWidthBottom();
      borderStyles[ 0 ] = "solid";
      borderColors[ 0 ] = "#000000";
    } else {
      borderWidths[ 2 ] = borderBottom.getWidthBottom();
      borderStyles[ 2 ] = borderBottom.getStyleBottom();
      borderColors[ 2 ] = borderBottom.getColorBottom();
    }
    result.border = new rwt.html.Border( borderWidths, borderStyles, borderColors );
    result.textShadow = tv.getCssShadow( "TreeColumn", "text-shadow" );
    return result;
  }
},

"tree-column-sort-indicator" : {
  style : function( states ) {
    var tv = new rwt.theme.ThemeValues( states );
    var result = {};
    result.backgroundImage = tv.getCssSizedImage( "TreeColumn-SortIndicator", "background-image" );
    return result;
  }
},

"tree-column-chevron" : {
  style : function( states ) {
    var tv = new rwt.theme.ThemeValues( states );
    var result = {};
    if( states.loading ) {
      result.backgroundImage = [ "widget/tree/loading.gif", 16, 16 ];
    } else {
      var source = "widget/arrows/chevron-";
      source += states.expanded ? "left" : "right";
      source += states.mouseover ? "-hover" : "";
      source += ".png";
      result.backgroundImage = [ source, 10, 7 ];
    }
    return result;
  }
},

  "scale" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      return {
        border : tv.getCssBorder( "Scale", "border" ),
        font : tv.getCssFont( "*", "font" ),
        textColor : tv.getCssColor( "*", "color" ),
        backgroundColor : tv.getCssColor( "Scale", "background-color" )
      };
    }
  },

  "scale-line" : {
    include : "image",

    style : function( states ) {
      var result = {};
      if( states.horizontal ) {
        result.left = rwt.widgets.Scale.PADDING;
        result.top = rwt.widgets.Scale.SCALE_LINE_OFFSET;
        result.source = "widget/scale/h_line.gif";
      } else {
        result.left = rwt.widgets.Scale.SCALE_LINE_OFFSET;
        result.top = rwt.widgets.Scale.PADDING;
        result.source = "widget/scale/v_line.gif";
      }
      return result;
    }
  },

  "scale-thumb" : {
    include : "atom",

    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {};
      if( states.horizontal ) {
        result.left = rwt.widgets.Scale.PADDING;
        result.top = rwt.widgets.Scale.THUMB_OFFSET;
        // TODO: make it themable
        result.width = 11;
        result.height = 21;
      } else {
        result.left = rwt.widgets.Scale.THUMB_OFFSET;
        result.top = rwt.widgets.Scale.PADDING;
        // TODO: make it themable
        result.width = 21;
        result.height = 11;
      }
      // TODO: add themable background-image (gradient)
      result.border = tv.getCssBorder( "Scale-Thumb", "border" );
      result.backgroundColor = tv.getCssColor( "Scale-Thumb", "background-color" );
      return result;
    }
  }
,

  "datetime-date" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {};
      result.border = tv.getCssBorder( "DateTime", "border" );
      result.font = tv.getCssFont( "DateTime", "font" );
      result.textColor = tv.getCssColor( "DateTime", "color" );
      result.backgroundColor = tv.getCssColor( "DateTime", "background-color" );
      result.backgroundGradient = tv.getCssGradient( "DateTime", "background-image" );
      result.textShadow = tv.getCssShadow( "DateTime", "text-shadow" );
      return result;
    }
  },

  "datetime-time" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {};
      result.border = tv.getCssBorder( "DateTime", "border" );
      result.font = tv.getCssFont( "DateTime", "font" );
      result.textColor = tv.getCssColor( "DateTime", "color" );
      result.backgroundColor = tv.getCssColor( "DateTime", "background-color" );
      result.backgroundGradient = tv.getCssGradient( "DateTime", "background-image" );
      result.textShadow = tv.getCssShadow( "DateTime", "text-shadow" );
      return result;
    }
  },

  "datetime-calendar" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {};
      result.border = tv.getCssBorder( "DateTime", "border" );
      result.font = tv.getCssFont( "*", "font" );
      result.textColor = tv.getCssColor( "DateTime", "color" );
      result.backgroundColor = tv.getCssColor( "DateTime", "background-color" );
      result.textShadow = tv.getCssShadow( "DateTime", "text-shadow" );
      return result;
    }
  },

  "datetime-field" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {
        cursor : "default",
        textAlign : "center",
        padding : [ 0, 3 ]
      };
      if( states.selected ) {
        result.textColor = tv.getCssColor( "DateTime-Field", "color" );
        result.backgroundColor = tv.getCssColor( "DateTime-Field", "background-color" );
      } else {
        result.textColor = tv.getCssColor( "*", "color" );
        result.backgroundColor = "undefined";
      }
      result.textShadow = tv.getCssShadow( "DateTime-Field", "text-shadow" );
      return result;
    }
  },

  "datetime-separator" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {
        cursor : "default"
      };
      return result;
    }
  },

  "datetime-button-up" : {
    style : function( states ) {
      var result = {};
      var tv = new rwt.theme.ThemeValues( states );
      var border = tv.getCssBorder( "DateTime-UpButton", "border" );
      var borderLeft = tv.getCssBorder( "DateTime-UpButton", "border-left" );
      result.border = tv.mergeBorders( border, null, null, null, borderLeft );
      result.width = tv.getCssDimension( "DateTime-UpButton", "width" );
      result.icon = tv.getCssImage( "DateTime-UpButton-Icon",
                                    "background-image" );
      if( result.icon === rwt.theme.ThemeValues.NONE_IMAGE ) {
        result.icon = tv.getCssImage( "DateTime-UpButton", "background-image" );
      } else {
        result.backgroundImage = tv.getCssImage( "DateTime-UpButton", "background-image" );
      }
      result.backgroundGradient = tv.getCssGradient( "DateTime-UpButton", "background-image" );
      result.backgroundColor = tv.getCssColor( "DateTime-UpButton", "background-color" );
      result.cursor = tv.getCssCursor( "DateTime-UpButton", "cursor" );
      return result;
    }
  },

  "datetime-button-down" : {
    style : function( states ) {
      var result = {};
      var tv = new rwt.theme.ThemeValues( states );
      var border = tv.getCssBorder( "DateTime-DownButton", "border" );
      var borderLeft = tv.getCssBorder( "DateTime-DownButton", "border-left" );
      result.border = tv.mergeBorders( border, null, null, null, borderLeft );
      result.width = tv.getCssDimension( "DateTime-DownButton", "width" );
      result.icon = tv.getCssImage( "DateTime-DownButton-Icon", "background-image" );
      if( result.icon === rwt.theme.ThemeValues.NONE_IMAGE ) {
        result.icon = tv.getCssImage( "DateTime-DownButton", "background-image" );
      } else {
        result.backgroundImage = tv.getCssImage( "DateTime-DownButton", "background-image" );
      }
      result.backgroundGradient = tv.getCssGradient( "DateTime-DownButton", "background-image" );
      result.backgroundColor = tv.getCssColor( "DateTime-DownButton", "background-color" );
      result.cursor = tv.getCssCursor( "DateTime-DownButton", "cursor" );
      return result;
    }
  },

  "datetime-drop-down-button" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {};
      var border = tv.getCssBorder( "DateTime-DropDownButton", "border" );
      var borderLeft = tv.getCssBorder( "DateTime-DropDownButton", "border-left" );
      result.border = tv.mergeBorders( border, null, null, null, borderLeft );
      result.icon = tv.getCssImage( "DateTime-DropDownButton-Icon", "background-image" );
      if( result.icon === rwt.theme.ThemeValues.NONE_IMAGE ) {
        result.icon = tv.getCssImage( "DateTime-DropDownButton", "background-image" );
      } else {
        result.backgroundImage = tv.getCssImage( "DateTime-DropDownButton", "background-image" );
      }
      result.backgroundGradient = tv.getCssGradient( "DateTime-DropDownButton", "background-image" );
      result.backgroundColor = tv.getCssColor( "DateTime-DropDownButton", "background-color" );
      result.cursor = tv.getCssCursor( "DateTime-DropDownButton", "cursor" );
      return result;
    }
  },

  "datetime-drop-down-calendar" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {};
      result.border = tv.getCssBorder( "DateTime-DropDownCalendar", "border" );
      result.backgroundColor = tv.getCssColor( "DateTime", "background-color" );
      return result;
    }
  },

  //------------------------------------------------------------------------
  // Calendar

  "calendar-navBar" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      return {
        border : tv.getCssBorder( "DateTime-Calendar-Navbar", "border" ),
        backgroundColor : tv.getCssColor( "DateTime-Calendar-Navbar", "background-color" ),
        backgroundImage : tv.getCssImage( "DateTime-Calendar-Navbar", "background-image" ),
        backgroundGradient : tv.getCssGradient( "DateTime-Calendar-Navbar", "background-image" ),
        padding : [ 4, 4, 4, 4 ]
      };
    }
  },

  "calendar-toolbar-button" : {
    style : function( states ) {
      var result = {
        spacing : 4,
        width : 16,
        height : 16,
        clipWidth : 16,
        clipHeight : 16,
        verticalChildrenAlign : "middle"
      };
      if (states.pressed || states.checked || states.abandoned) {
        result.padding = [ 2, 0, 0, 2 ];
      } else {
        result.padding = 2;
      }
      return result;
    }
  },

  "calendar-toolbar-previous-year-button" : {
    include: "calendar-toolbar-button",

    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      return {
        icon : tv.getCssImage( "DateTime-Calendar-PreviousYearButton", "background-image" ),
        cursor : tv.getCssCursor( "DateTime-Calendar-PreviousYearButton", "cursor" )
      };
    }
  },

  "calendar-toolbar-previous-month-button" : {
    include: "calendar-toolbar-button",

    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      return {
        icon : tv.getCssImage( "DateTime-Calendar-PreviousMonthButton", "background-image" ),
        cursor : tv.getCssCursor( "DateTime-Calendar-PreviousMonthButton", "cursor" )
      };
    }
  },

  "calendar-toolbar-next-month-button" : {
    include: "calendar-toolbar-button",

    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      return {
        icon : tv.getCssImage( "DateTime-Calendar-NextMonthButton", "background-image" ),
        cursor : tv.getCssCursor( "DateTime-Calendar-NextMonthButton", "cursor" )
      };
    }
  },

  "calendar-toolbar-next-year-button" : {
    include: "calendar-toolbar-button",

    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      return {
        icon : tv.getCssImage( "DateTime-Calendar-NextYearButton", "background-image" ),
        cursor : tv.getCssCursor( "DateTime-Calendar-NextYearButton", "cursor" )
      };
    }
  },

  "calendar-monthyear" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      return {
        font : tv.getCssFont( "DateTime-Calendar-Navbar", "font" ),
        textAlign : "center",
        textColor : tv.getCssColor( "DateTime-Calendar-Navbar", "color" ),
        textShadow : tv.getCssShadow( "DateTime-Calendar-Navbar", "text-shadow" ),
        verticalAlign : "middle",
        cursor : "default"
      };
    }
  },

  "calendar-datepane" : {
    style : function( states ) {
      return {
        backgroundColor : "undefined"
      };
    }
  },

  "calendar-week" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      if( states.header ) {
        var border = new rwt.html.Border( [ 0, 1, 1, 0 ], "solid", "gray" );
      } else {
        var border = new rwt.html.Border( [ 0, 1, 0, 0 ], "solid", "gray" );
      }
      return {
        textAlign : "center",
        verticalAlign : "middle",
        border : border
      };
    }
  },

  "calendar-weekday" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var border = new rwt.html.Border( [ 0, 0, 1, 0 ], "solid", "gray" );
      // FIXME: [if] Bigger font size leads to text cutoff
      var font = tv.getCssFont( "*", "font" );
      var smallFont = rwt.html.Font.fromString( font.toCss() );
      smallFont.setSize( 11 );
      return {
        font : smallFont,
        border : border,
        textAlign : "center"
      };
    }
  },

  "calendar-day" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {
        textAlign : "center",
        verticalAlign : "middle"
      };
      if( !states.disabled && ( states.selected || states.otherMonth || states.over ) ) {
        result.textColor = tv.getCssColor( "DateTime-Calendar-Day", "color" );
        result.backgroundColor = tv.getCssColor( "DateTime-Calendar-Day", "background-color" );
      } else {
        result.textColor = tv.getCssColor( "*", "color" );
        result.backgroundColor = "undefined";
      }
      result.textShadow = tv.getCssShadow( "DateTime-Calendar-Day", "text-shadow" );
      var borderColor = states.disabled ? tv.getCssColor( "*", "color" ) : "red";
      var border = new rwt.html.Border( 1, "solid", borderColor );
      result.border = states.today ? border : "undefined";
      return result;
    }
  }
,

  "expand-bar" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {};
      result.border = tv.getCssBorder( "ExpandBar", "border" );
      result.font = tv.getCssFont( "ExpandBar", "font" );
      result.textColor = tv.getCssColor( "ExpandBar", "color" );
      return result;
    }
  },

  "expand-item" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      return {
        overflow : "hidden",
        border : tv.getCssBorder( "ExpandItem", "border" )
      };
    }
  },

  "expand-item-chevron-button" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {};
      result.width = 16;
      result.height = 16;
      result.clipWidth = 16;
      result.clipHeight = 16;
      result.right = 4;
      result.source = tv.getCssImage( "ExpandItem-Button", "background-image" );
      result.cursor = tv.getCssCursor( "ExpandItem-Header", "cursor" );
      return result;
    }
  },

  "expand-item-header" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {};
      result.top = 0;
      result.left = 0;
      result.width = "100%";
      result.horizontalChildrenAlign =  "left";
      result.verticalChildrenAlign = "middle";
      result.paddingLeft = 4;
      result.paddingRight = 24;
      result.border = tv.getCssBorder( "ExpandItem-Header", "border" );
      result.backgroundColor = tv.getCssColor( "ExpandItem-Header", "background-color" );
      result.cursor = tv.getCssCursor( "ExpandItem-Header", "cursor" );
      result.backgroundImage = tv.getCssImage( "ExpandItem-Header", "background-image" );
      result.backgroundGradient = tv.getCssGradient( "ExpandItem-Header", "background-image" );
      result.textShadow = tv.getCssShadow( "ExpandItem-Header", "text-shadow" );
      return result;
    }
  }
,

  "sash" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      return {
        backgroundColor : tv.getCssColor( "Sash", "background-color" ),
        backgroundImage : tv.getCssImage( "Sash", "background-image" ),
        border : tv.getCssBorder( "Sash", "border" ),
        cursor : states.disabled ? "undefined" : states.horizontal ? "row-resize" : "col-resize"
      };
    }
  },

  "sash-slider" : {
    style : function( states ) {
      return {
        zIndex : 1e7,
        opacity : 0.3,
        backgroundColor : "black"
      };
    }
  },

  "sash-handle" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {};
      result.backgroundImage = tv.getCssImage( "Sash-Handle", "background-image" );
      result.backgroundGradient = tv.getCssGradient( "Sash-Handle", "background-image" );
      result.backgroundRepeat = "no-repeat";
      return result;
    }
  }
,

  "slider" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      return {
        border : tv.getCssBorder( "Slider", "border" ),
        font : tv.getCssFont( "*", "font" ),
        textColor : tv.getCssColor( "*", "color" ),
        backgroundColor : tv.getCssColor( "Slider", "background-color" )
      };
    }
  },

  "slider-thumb" : {
    include : "atom",
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {};
      result.backgroundColor = tv.getCssColor( "Slider-Thumb", "background-color" );
      result.border = tv.getCssBorder( "Slider-Thumb", "border" );
      result.backgroundImage = tv.getCssImage( "Slider-Thumb", "background-image" );
      result.backgroundGradient = tv.getCssGradient( "Slider-Thumb", "background-image" );
      return result;
    }
  },

  "slider-min-button" : {
    include : "atom",
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {};
      result.font = tv.getCssFont( "Button", "font" );
      result.textColor = tv.getCssColor( "Button", "color" );
      result.spacing = tv.getCssDimension( "Button", "spacing" );
      result.padding = tv.getCssBoxDimensions( "Slider-DownButton", "padding" );
      result.backgroundColor = tv.getCssColor( "Slider-DownButton", "background-color" );
      result.icon = tv.getCssSizedImage( "Slider-DownButton-Icon", "background-image" );
      if( result.icon === rwt.theme.ThemeValues.NONE_IMAGE ) {
        result.icon = tv.getCssSizedImage( "Slider-DownButton", "background-image" );
      } else {
        result.backgroundImage = tv.getCssImage( "Slider-DownButton", "background-image" );
      }
      result.backgroundGradient = tv.getCssGradient( "Slider-DownButton", "background-image" );
      result.border = tv.getCssBorder( "Slider-DownButton", "border" );
      if( states[ "rwt_HORIZONTAL" ] ){
        result.width = 16;
      } else {
        result.height = 16;
      }
      result.cursor = tv.getCssCursor( "Slider-DownButton", "cursor" );
      return result;
    }
  },

  "slider-max-button" : {
    include : "atom",
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {};
      result.font = tv.getCssFont( "Button", "font" );
      result.textColor = tv.getCssColor( "Button", "color" );
      result.spacing = tv.getCssDimension( "Button", "spacing" );
      result.padding = tv.getCssBoxDimensions( "Slider-UpButton", "padding" );
      result.backgroundColor = tv.getCssColor( "Slider-UpButton", "background-color" );
      result.icon = tv.getCssSizedImage( "Slider-UpButton-Icon", "background-image" );
      if( result.icon === rwt.theme.ThemeValues.NONE_IMAGE ) {
        result.icon = tv.getCssSizedImage( "Slider-UpButton", "background-image" );
      } else {
        result.backgroundImage = tv.getCssImage( "Slider-UpButton", "background-image" );
      }
      result.backgroundGradient = tv.getCssGradient( "Slider-UpButton", "background-image" );
      result.border = tv.getCssBorder( "Slider-UpButton", "border" );
      if( states[ "rwt_HORIZONTAL" ] ) {
        result.width = 16;
      } else {
        result.height = 16;
      }
      result.cursor = tv.getCssCursor( "Slider-UpButton", "cursor" );
      return result;
    }
  }
,

  "tool-tip" : {
    include : "popup",

    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {};
      result.width = "auto";
      result.height = "auto";
      result.minWidth = 36;
      result.minHeight = 36;
      result.cursor = tv.getCssCursor( "ToolTip", "cursor" );
      result.font = tv.getCssFont( "ToolTip", "font" );
      result.textColor = tv.getCssColor( "ToolTip", "color" );
      result.padding = tv.getCssBoxDimensions( "ToolTip", "padding" );
      result.border = tv.getCssBorder( "ToolTip", "border" );
      result.backgroundColor = tv.getCssColor( "ToolTip", "background-color" );
      result.backgroundImage = tv.getCssImage( "ToolTip", "background-image" );
      result.backgroundGradient = tv.getCssGradient( "ToolTip", "background-image" );
      result.animation = tv.getCssAnimation( "ToolTip", "animation" );
      result.opacity = tv.getCssFloat( "ToolTip", "opacity" );
      result.shadow = tv.getCssShadow( "ToolTip", "box-shadow" );
      return result;
    }
  },

  "tool-tip-image" : {
    include: "image",
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      return {
        source : tv.getCssImage( "ToolTip-Image", "background-image" )
      };
    }
  },

  "tool-tip-text" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {
        font : tv.getCssFont( "ToolTip-Text", "font" ),
        textColor : tv.getCssColor( "ToolTip-Text", "color" ),
        textShadow : tv.getCssShadow( "ToolTip-Text", "text-shadow" )
      };
      return result;
    }
  },

  "tool-tip-message" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {
        font : tv.getCssFont( "ToolTip-Message", "font" ),
        textColor : tv.getCssColor( "ToolTip-Message", "color" ),
        textShadow : tv.getCssShadow( "ToolTip-Message", "text-shadow" )
      };
      return result;
    }
  }
,

  "ccombo" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {};
      result.border = tv.getCssBorder( "CCombo", "border" );
      result.backgroundColor = tv.getCssColor( "CCombo", "background-color" );
      result.backgroundGradient = tv.getCssGradient( "CCombo", "background-image" );
      result.textColor = tv.getCssColor( "CCombo", "color" );
      result.font = tv.getCssFont( "CCombo", "font" );
      result.shadow = tv.getCssShadow( "CCombo", "box-shadow" );
      return result;
    }
  },

  "ccombo-list" : {
    include : "list",
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {};
      result.border = tv.getCssBorder( "CCombo-List", "border" );
      result.textColor = tv.getCssColor( "CCombo", "color" );
      result.font = tv.getCssFont( "CCombo", "font" );
      result.backgroundColor = tv.getCssColor( "CCombo", "background-color" );
      result.shadow = tv.getCssShadow( "CCombo-List", "box-shadow" );
      result.textShadow = tv.getCssShadow( "CCombo", "text-shadow" );
      return result;
    }
  },

  "ccombo-field" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {};
      result.font = tv.getCssFont( "CCombo", "font" );
      // [if] Do not apply top/bottom paddings on the client
      var cssPadding = tv.getCssBoxDimensions( "CCombo-Field", "padding" );
      result.paddingRight = cssPadding[ 1 ];
      result.paddingLeft = cssPadding[ 3 ];
      result.width = null;
      result.height = null;
      result.left = 0;
      result.right = tv.getCssDimension( "CCombo-Button", "width" );
      result.top = 0;
      result.bottom = 0;
      result.textColor = tv.getCssColor( "CCombo", "color" );
      result.textShadow = tv.getCssShadow( "CCombo", "text-shadow" );
      return result;
    }
  },

  "ccombo-button" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {};
      var border = tv.getCssBorder( "CCombo-Button", "border" );
      var borderLeft = tv.getCssBorder( "CCombo-Button", "border-left" );
      result.border = tv.mergeBorders( border, null, null, null, borderLeft );
      result.width = tv.getCssDimension( "CCombo-Button", "width" );
      result.height = null;
      result.top = 0;
      result.bottom = 0;
      result.right = 0;
      result.icon = tv.getCssImage( "CCombo-Button-Icon", "background-image" );
      if( result.icon === rwt.theme.ThemeValues.NONE_IMAGE ) {
        result.icon = tv.getCssImage( "CCombo-Button", "background-image" );
      } else {
        result.backgroundImage = tv.getCssImage( "CCombo-Button", "background-image" );
      }
      result.backgroundGradient = tv.getCssGradient( "CCombo-Button", "background-image" );
      // TODO [rst] rather use button.bgcolor?
      result.backgroundColor = tv.getCssColor( "CCombo-Button", "background-color" );
      result.cursor = tv.getCssCursor( "CCombo-Button", "cursor" );
      return result;
    }
  }
,

  "clabel" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {};
      result.textColor = tv.getCssColor( "CLabel", "color" );
      result.backgroundColor = tv.getCssColor( "CLabel", "background-color" );
      result.font = tv.getCssFont( "CLabel", "font" );
      if( states.rwt_SHADOW_IN ) {
        result.border = tv.getCssNamedBorder( "thinInset" );
      } else if( states.rwt_SHADOW_OUT ) {
        result.border = tv.getCssNamedBorder( "thinOutset" );
      } else {
        result.border = tv.getCssBorder( "CLabel", "border" );
      }
      result.backgroundImage = tv.getCssImage( "CLabel", "background-image" );
      result.backgroundGradient = tv.getCssGradient( "CLabel", "background-image" );
      result.cursor = tv.getCssCursor( "CLabel", "cursor" );
      result.padding = tv.getCssBoxDimensions( "CLabel", "padding" );
      result.spacing = tv.getCssDimension( "CLabel", "spacing" );
      result.opacity = tv.getCssFloat( "CLabel", "opacity" );
      result.textShadow = tv.getCssShadow( "CLabel", "text-shadow" );
      return result;
    }
  }
,

  "browser" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      return {
        border : tv.getCssBorder( "Browser", "border" ),
        backgroundColor : "white"
      };
    }
  }
  ,

  "scrolledcomposite" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {};
      if( states.rwt_BORDER ) {
        result.border = tv.getCssNamedBorder( "shadow" );
      } else {
        result.border = tv.getCssBorder( "*", "border" );
      }
      return result;
    }
  }
,

  "scrollbar" : {
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {
        border : tv.getCssBorder( "ScrollBar", "border" ),
        backgroundColor : tv.getCssColor( "ScrollBar", "background-color" ),
        backgroundImage : tv.getCssImage( "ScrollBar", "background-image" ),
        backgroundGradient : tv.getCssGradient( "ScrollBar", "background-image" )
      };
      var width = tv.getCssDimension( "ScrollBar", "width" );
      if( states[ "rwt_HORIZONTAL" ] ) {
        result.height = width;
      } else {
        result.width = width;
      }
      return result;
    }
  },

  "scrollbar-thumb" : {
    include : "atom",
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {};
      result.backgroundColor = tv.getCssColor( "ScrollBar-Thumb", "background-color" );
      result.border = tv.getCssBorder( "ScrollBar-Thumb", "border" );
      result.backgroundImage = tv.getCssImage( "ScrollBar-Thumb", "background-image" );
      result.backgroundGradient = tv.getCssGradient( "ScrollBar-Thumb", "background-image" );
      result.icon = tv.getCssSizedImage( "ScrollBar-Thumb-Icon", "background-image" );
      return result;
    }
  },

  "scrollbar-min-button" : {
    include : "atom",
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {};
      result.spacing = tv.getCssDimension( "Button", "spacing" );
      result.padding = tv.getCssBoxDimensions( "Button", "padding" );
      result.backgroundColor = tv.getCssColor( "ScrollBar-DownButton", "background-color" );
      result.icon = tv.getCssSizedImage( "ScrollBar-DownButton-Icon", "background-image" );
      if( result.icon === rwt.theme.ThemeValues.NONE_IMAGE ) {
        result.icon = tv.getCssSizedImage( "ScrollBar-DownButton", "background-image" );
      } else {
        result.backgroundImage = tv.getCssImage( "ScrollBar-DownButton", "background-image" );
      }
      result.backgroundGradient = tv.getCssGradient( "ScrollBar-DownButton", "background-image" );
      result.border = tv.getCssBorder( "ScrollBar-DownButton", "border" );
      var width = tv.getCssDimension( "ScrollBar", "width" );
      if( states[ "rwt_HORIZONTAL" ] ){
        result.width = width;
      } else {
        result.height = width;
      }
      result.cursor = tv.getCssCursor( "ScrollBar-DownButton", "cursor" );
      return result;
    }
  },

  "scrollbar-max-button" : {
    include : "atom",
    style : function( states ) {
      var tv = new rwt.theme.ThemeValues( states );
      var result = {};
      result.font = tv.getCssFont( "Button", "font" );
      result.textColor = tv.getCssColor( "Button", "color" );
      result.spacing = tv.getCssDimension( "Button", "spacing" );
      result.padding = tv.getCssBoxDimensions( "Button", "padding" );
      result.backgroundColor = tv.getCssColor( "ScrollBar-UpButton", "background-color" );
      result.icon = tv.getCssSizedImage( "ScrollBar-UpButton-Icon", "background-image" );
      if( result.icon === rwt.theme.ThemeValues.NONE_IMAGE ) {
        result.icon = tv.getCssSizedImage( "ScrollBar-UpButton", "background-image" );
      } else {
        result.backgroundImage = tv.getCssImage( "ScrollBar-UpButton", "background-image" );
      }
      result.backgroundGradient = tv.getCssGradient( "ScrollBar-UpButton", "background-image" );
      result.border = tv.getCssBorder( "ScrollBar-UpButton", "border" );
      var width = tv.getCssDimension( "ScrollBar", "width" );
      if( states[ "rwt_HORIZONTAL" ] ) {
        result.width = width;
      } else {
        result.height = width;
      }
      result.cursor = tv.getCssCursor( "ScrollBar-UpButton", "cursor" );
      return result;
    }
  }
,

 "file-upload" : {
    include : "atom",

    style : function( states ) {
      var result = {};
      var tv = new rwt.theme.ThemeValues( states );
      result.font = tv.getCssFont( "FileUpload", "font" );
      result.textColor = tv.getCssColor( "FileUpload", "color" );
      result.backgroundColor = tv.getCssColor( "FileUpload", "background-color" );
      result.backgroundImage = tv.getCssImage( "FileUpload", "background-image" );
      result.backgroundGradient = tv.getCssGradient( "FileUpload", "background-image" );
      result.border = tv.getCssBorder( "FileUpload", "border" );
      result.spacing = tv.getCssDimension( "FileUpload", "spacing" );
      result.padding = tv.getCssBoxDimensions( "FileUpload", "padding" );
      result.cursor = tv.getCssCursor( "FileUpload", "cursor" );
      result.opacity = tv.getCssFloat( "FileUpload", "opacity" );
      result.textShadow = tv.getCssShadow( "FileUpload", "text-shadow" );
      result.animation = tv.getCssAnimation( "FileUpload", "animation" );
      return result;
    }
  }

  }
} );
