/**
 *
 * @project
 * @author Harry
 * @time 11:40 22/04/2013
 *
 */

SKYLINE.Color = function( r, g, b, a )
{
    this.r              = r || 0;
    this.g              = g || 0;
    this.b              = b || 0;
    this.a              = a || 1;

    function init( r, g, b, a, scope )
    {
        if(typeof r == "string")
        {
            scope.setHex( r );
        }
    }

    /*
     * Setters
     */

    this.setHex = function(hex)
    {
        this.r = this.hexToR(hex);
        this.g = this.hexToG(hex);
        this.b = this.hexToB(hex);

        return this;
    }

    this.setRGB = function( r, g, b )
    {
        this.r = r;
        this.g = g;
        this.b = b;

        return this;
    }

    this.setAlpha = function( a )
    {
        this.a = a;

        return this;
    }

    /*
     * Getters
     */

    this.getRGB = function()
    {
        return { r:this.r,
                 g:this.g,
                 b:this.b };
    }

    this.getHex = function()
    {
        return this.rgbToHex(this.r, this.b, this.g);
    }

    this.getAlpha = function()
    {
        return this.a;
    }

    /*
     * RBG -> HEX
     */

    this.rgbToHex = function(R,G,B)
    {
        return this.toHex( R ) + this.toHex( G ) + this.toHex( B );
    }

    this.toHex = function(n)
    {
        n = parseInt(n,10);
        if (isNaN(n)) return "00";
        n = Math.max(0,Math.min(n,255));
        return "0123456789ABCDEF".charAt((n-n%16)/16) + "0123456789ABCDEF".charAt(n%16);
    }

    /*
     * HEX -> RGB
     */

    this.hexToR = function( h )
    {
        return parseInt( ( this.formatHexValue(h) ).substring(0,2),16)
    }

    this.hexToG = function( h )
    {
        return parseInt( ( this.formatHexValue(h) ).substring(2,4),16)
    }

    this.hexToB = function( h )
    {
        return parseInt( ( this.formatHexValue(h) ).substring(4,6),16)
    }

    this.formatHexValue = function( h )
    {
        return (h.charAt(0)=="#") ? h.substring(1,7):h
    }

    /*
     * Utils
     */

    this.luminance = function()
    {
        /*
         * See http://stackoverflow.com/questions/596216/formula-to-determine-brightness-of-rgb-color
         * TODO: These RGB values need to be converted to linear 0-1 from gamma-corrected 0-255;
         */
        return ( 0.2126 * this.r ) + ( 0.7152 * this.g ) + ( 0.0722 * this.b );
    }

    this.add = function( color, includeAlpha )
    {
        return this.addColors( this, color, includeAlpha );
    }

    this.addColors = function( color1, color2, includeAlpha )
    {
        var ia = (includeAlpha !== undefined) ? includeAlpha : false;

        if(color1 instanceof SKYLINE.Color && color2 instanceof SKYLINE.Color)
        {
            color1.r += color2.r;
            color1.g += color2.g;
            color1.b += color2.b;

            if(ia)
            {
                color1.a += color2.a;
            }
        }
        else
        {
            console.error("[SKYLINE.Color].add - Trying to add a color that is not an instance of SKYLINE.Color!");
        }

        return color1;
    }

    this.subtract = function( color, includeAlpha )
    {
        return this.subtractColors( this, color, includeAlpha );
    }

    this.subtractColors = function( color1, color2, includeAlpha )
    {
        var ia = (includeAlpha !== undefined) ? includeAlpha : false;

        if(color1 instanceof SKYLINE.Color && color2 instanceof SKYLINE.Color)
        {
            color1.r -= color2.r;
            color1.g -= color2.g;
            color1.b -= color2.b;

            if(ia)
            {
                color1.a -= color2.a;
            }
        }
        else
        {
            console.error("[SKYLINE.Color].subtract - Trying to subtract a color that is not an instance of SKYLINE.Color!");
        }

        return color1;
    }

    this.multiply = function( amount )
    {
        return this.multiplyColor( this, amount );
    }

    this.multiplyColor = function( color, amount )
    {
        color.r *= amount;
        color.g *= amount;
        color.b *= amount;

        return color;
    }

    this.equals = function( color )
    {
        return ( this.r === color.r && this.g === color.g && this.b === color.b );
    }

    this.copy = function( color )
    {
        this.r = color.r;
        this.g = color.g;
        this.b = color.b;
    }

    init( r, g, b, a, this );
}