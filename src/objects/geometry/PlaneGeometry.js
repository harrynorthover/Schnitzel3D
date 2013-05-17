/**
 *
 * @project skyline
 * @author harry.northover
 * @time 12:42 06/05/2013
 *
 */

SKYLINE.PlaneGeometry = function( width, height, widthSegments, heightSegments )
{
    this.width          = 10;
    this.height         = 10;

    this.widthSegments  = 5;
    this.heightSegments = 5;

    function init( width, height, widthSegments, heightSegments, scope )
    {
        if( width !== undefined )
        {
            scope.width                 = width;
            scope.height                = height;

            scope.widthSegments         = widthSegments;
            scope.heightSegments        = heightSegments;
        }

        SKYLINE.Geometry.call( this );
    }

    this.createVerticies = function()
    {
        /*
         * TODO: Implement create verticies for PlaneGeometry.
         */
    }

    init( width, height, widthSegments, heightSegments, this );
}

SKYLINE.PlaneGeometry.prototype = new SKYLINE.Geometry();