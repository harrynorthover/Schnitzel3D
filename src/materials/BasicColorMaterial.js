/**
 *
 * @project skyline
 * @author harry.northover
 * @time 14:59 23/05/2013
 *
 */

SKYLINE.BasicColorMaterial = function( color )
{
    SKYLINE.BaseMaterial.call( this );

    this.color = color;
}

SKYLINE.BasicColorMaterial.prototype = Object.create( SKYLINE.BaseMaterial.prototype );
SKYLINE.BasicColorMaterial.prototype.constructor = SKYLINE.BasicColorMaterial;