/**
 *
 * @project skyline
 * @author Harry
 * @time 17:33 25/04/2013
 *
 */

SKYLINE.Frustum = function( p1, p2, p3, p4, p5, p6 )
{
    this.planes = [];

    function init( p1, p2, p3, p4, p5, p6, scope )
    {
        if( p1 !== undefined )
        {
            scope.setValues( p1, p2, p3, p4, p5, p6 );
        }
        else
        {
            scope.setValues( new SKYLINE.Plane(),
                             new SKYLINE.Plane(),
                             new SKYLINE.Plane(),
                             new SKYLINE.Plane(),
                             new SKYLINE.Plane(),
                             new SKYLINE.Plane() );
        }
    }

    this.setValues = function( p1, p2, p3, p4, p5, p6 )
    {
        this.planes[0] = p1;
        this.planes[1] = p2;
        this.planes[2] = p3;
        this.planes[3] = p4;
        this.planes[4] = p5;
        this.planes[5] = p6;
    }

    this.setFromMatrix = function( m )
    {
        var e = m.entries;
        var p = this.planes;

        return this;
    }

    init( p1, p2, p3, p4, p5, p6, this );
}