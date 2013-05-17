/**
 *
 * @project skyline
 * @author Harry
 * @time 14:48 21/04/2013
 *
 */

SKYLINE.Geometry = function()
{
    this.verticies          = new Array();
    this.faces              = new Array();
    this.boundingBox        = null;

    this.normal             = new SKYLINE.Vector3( 0, 1, 0 );

    function init( scope )
    {
        scope.computeVertexNormals();
        scope.computeFaceNormals();
        scope.computeBoundingBox();
    }

    this.applyMatrix4 = function( matrix )
    {
        for( var i = 0; i < this.verticies.length; ++i )
        {
            this.verticies[i].applyMatrix4( matrix );
        }
    }

    this.computeFaceNormals = function()
    {
        for( var i = 0, len = this.faces.length; i < len; ++i )
        {
            this.faces[i].computeFaceNormal();
        }
    }

    this.computeVertexNormals = function()
    {
        /*
         * TODO: Implement computeVertexNormals.
         */
    }

    this.computeBoundingBox = function()
    {
        if(this.boundingBox == null)
        {
            this.boundingBox = new SKYLINE.Box3();
        }

        this.boundingBox.computeFromPoints( this.verticies );
    }

    init( this );
};