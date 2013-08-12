/**
 *
 * @project skyline
 * @author harry.northover
 * @time 12:42 06/05/2013
 *
 */

SKYLINE.CubeGeometry = function( width, height, depth, wSegments, hSegments, dSegments )
{
    this.width                  = 10;
    this.height                 = 10;
    this.depth                  = 10;

    this.widthSegments          = 10;
    this.heightSegments         = 10;
    this.depthSegments          = 10;

    function init( width, height, depth, wSegments, hSegments, dSegments, scope )
    {
        if(width !== undefined)
        {
            scope.width                 = width;
            scope.height                = height;
            scope.depth                 = depth;

            scope.widthSegments         = wSegments;
            scope.heightSegments        = hSegments;
            scope.depthSegments         = dSegments;
        }

        SKYLINE.Geometry.call( this );
    }

    this.createVerticies = function()
    {
        /*
         * TODO: Implement create vertices for CubeGeometry.
         */
    }

    init( width, height, depth, wSegments, hSegments, dSegments, this );
}

SKYLINE.CubeGeometry.prototype = new SKYLINE.Geometry();