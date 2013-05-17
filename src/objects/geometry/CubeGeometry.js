/**
 *
 * @project skyline
 * @author harry.northover
 * @time 12:42 06/05/2013
 *
 */

SKYLINE.CubeGeometry = function( width, height, length, wSegments, hSegments )
{
    this.width                  = 10;
    this.height                 = 10;
    this.length                 = 10;

    this.widthSegments          = 10;
    this.heightSegments         = 10;

    function init( width, height, length, wSegments, hSegments, scope )
    {
        if(width !== undefined)
        {
            scope.width                 = width;
            scope.height                = height;
            scope.length                = length;

            scope.widthSegments         = wSegments;
            scope.heightSegments        = hSegments;
        }

        SKYLINE.Geometry.call( this );
    }

    this.createVerticies = function()
    {
        /*
         * TODO: Implement create verticies for CubeGeometry.
         */
    }

    init( width, height, length, wSegments, hSegments, this );
}

SKYLINE.CubeGeometry.prototype = new SKYLINE.Geometry();