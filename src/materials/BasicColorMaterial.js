/**
 *
 * @project skyline
 * @author harry.northover
 * @time 14:59 23/05/2013
 *
 */

SKYLINE.BasicColorMaterial = function( color )
{
    this.color = color;

    function init( color, scope )
    {
        SKYLINE.BaseMaterial.call( this );
    }

    init( color, this );
}

SKYLINE.BasicColorMaterial.prototype = new SKYLINE.BaseMaterial();