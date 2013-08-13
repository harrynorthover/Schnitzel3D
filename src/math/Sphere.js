/**
 *
 * @project skyline
 * @author Harry
 * @time 15:45 25/04/2013
 *
 */

SKYLINE.Sphere = function( center, radius )
{
    this.center = center || new SKYLINE.Vector3( 0, 0, 0 );
    this.radius = radius || 1;
}

SKYLINE.Sphere.prototye = {
    constructor: SKYLINE.Sphere,

    setRadius : function( newRadius )
    {
        this.radius = newRadius;
    },

    /*
     * Returns the distance from the outside
     * of the sphere to a specified vector.
     */
    distanceTo : function( vector )
    {
        return this.center.distanceTo( vector ) - this.radius;
    },

    copy : function( sphere )
    {
        this.center = sphere.center;
        this.radius = sphere.radius;
    }
}