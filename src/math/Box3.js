/**
 *
 * @project skyline
 * @author harry.northover
 * @time 17:59 05/05/2013
 *
 */

SKYLINE.Box3 = function()
{
    this.min = new SKYLINE.Vector3( -1, -1, -1 );
    this.max = new SKYLINE.Vector3( 1, 1, -1 );

    this.computeFromPoints = function( points )
    {
        if( points.length == 0 )
        {
            return;
        }

        for( var i = 0, len = points.length; i < len; ++i )
        {
            var p = points[i];

            /*
             * Check for new maximum points.
             */

            if( p.x > this.max.x )
            {
                this.max.x = p.x;
            }

            if( p.y > this.max.y )
            {
                this.max.y = p.y;
            }

            if( p.z > this.max.z )
            {
                this.max.z = p.z;
            }

            /*
             * Check for new minimum points.
             */

            if( p.x < this.min.x )
            {
                this.min.x = p.x;
            }

            if( p.y < this.min.y )
            {
                this.min.y = p.y;
            }

            if( p.z < this.min.z )
            {
                this.min.z = p.z;
            }
        }

        return this;
    }

    this.computeFromCenterAndSize = function( center, size )
    {
        if(center instanceof SKYLINE.Vector3 === false)
        {
            console.warn("[SKYLINE.Box3] To create box from center and size, center parameter must be an instance of SKYLINE.Vector3.");

            return false;
        }

        this.max.copy(center.add(size.divideScalar(2)));
        this.min.copy(center.sub(size.divideScalar(2)));

        return this;
    }

    this.getSize = function()
    {
        return this.max.subtractVectors( max, min );
    }
}