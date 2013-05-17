/**
 *
 * @project
 * @author Harry
 * @time 11:40 22/04/2013
 *
 */

SKYLINE.Color = function( r, g, b, a )
{
    this.r = r || 0;
    this.g = g || 0;
    this.b = b || 0;
    this.a = a || 1;

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

    this.setRGB = function(r,g,b)
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

    init( r, g, b, a, this );
}