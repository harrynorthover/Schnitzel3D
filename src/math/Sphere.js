/**
 *
 * @project skyline
 * @author Harry
 * @time 15:45 25/04/2013
 *
 */

SKYLINE.Sphere = function( center, radius )
{
    this.center = new SKYLINE.Vector3( 0, 0, 0 );
    this.radius = 1;

    /*
     * Sphere Constructor.
     *
     * Takes a Vector3 as the center of the sphere & the radius of the sphere.
     */
    function init( center, radius, scope )
    {
        if(center instanceof SKYLINE.Vector3)
        {
            scope.center = center;
        }

        if(radius !== undefined)
        {
            scope.radius = radius;
        }
    }

    this.setRadius = function( newRadius )
    {
        this.radius = newRadius;
    }

    /*
     * Returns the distance from the outside
     * of the sphere to a specified vector.
     */
    this.distanceTo = function( vector )
    {
        return this.center.distanceTo( vector ) - this.radius;
    }

    this.copy = function( sphere )
    {
        this.center = sphere.center;
        this.radius = sphere.radius;
    }

    init( center, radius, this );
}