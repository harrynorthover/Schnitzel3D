/**
 * @project skyline
 * @author harry.northover
 * @time 18:13 03/05/2013
 */

SKYLINE.Face3 = function( a, b, c )
{
    this.a                  = new SKYLINE.Vertex();
    this.b                  = new SKYLINE.Vertex();
    this.c                  = new SKYLINE.Vertex();

    this.normal             = new SKYLINE.Vector3( 0, 1, 0 );
    this.vertexNormals      = new Array();

    function init( a, b, c, scope )
    {
        scope.a = a;
        scope.b = b;
        scope.c = c;

        /*
         * TODO: Does this need to be called straight away?
         */

        this.computeFaceNormal();
    }

    this.computeFaceNormal = function()
    {
        var v1 = this.a.subtractVectors( a, b );
        var v2 = this.b.subtractVectors( c, b );
        var v3 = this.c.crossVectors( v1, v2 );

        v3.normalize();

        this.normal.copy(v3);
    }

    init( a, b, c, this );
}