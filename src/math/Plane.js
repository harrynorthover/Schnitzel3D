/**
 *
 * @project skyline
 * @author Harry
 * @time 15:07 21/04/2013
 *
 * reference: http://mathworld.wolfram.com/Plane.html
 *
 */

SKYLINE.Plane = function(normal, constant)
{
    this.normal         = new SKYLINE.Vector3(1,0,0);

    /*
     * The constant of a plane is the dot product
     * of the normal and a point on the plane?
     */
    this.constant       = 0;

    function init( normal, constant, scope )
    {
        if(normal instanceof SKYLINE.Vector3)
        {
            scope.normal = normal;
        }

        if(constant !== undefined)
        {
            scope.constant = constant;
        }
    }

    this.generatePlaneFromNormalCoplanarPoint = function(normal, point)
    {
        this.normal.copy(normal);

        this.constant = - this.normal.dot( point );

        return this;
    }

    this.generateFromCoplanarPoints = function( a, b, c )
    {
        var v1 = new SKYLINE.Vector3();
        var v2 = new SKYLINE.Vector3();

        v1.copy(c);
        v1.sub(b);

        v2.copy(a);
        v2.sub(b);

        v1.crossProduct(v2);
        v1.normalize();

        return this.generatePlaneFromNormalCoplanarPoint( v1, a );
    }

    /*
     * Calculates the distance to a point from the normal.
     * Formula is | (normalX * vectorX) + (normalY * vectorY) + (normalZ * vectorZ) + constant |
     */
    this.distanceToPoint = function( vector )
    {
        return this.normal.dot( vector ) + this.constant;
    }

    this.distanceToSphere = function( sphere )
    {
        return this.normal.dot( sphere.center ) - sphere.radius;
    }

    this.equals = function( plane )
    {
        return this.normal.equals( plane.normal ) && this.constant == plane.constant;
    }

    this.copy = function( plane )
    {
        this.normal.copy(plane.normal);
        this.constant = plane.constant;
    }

    init( normal, constant, this );
}

SKYLINE.Plane.prototyoe = {

}