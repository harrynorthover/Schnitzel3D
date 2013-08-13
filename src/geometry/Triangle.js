/**
 * @project skyline
 * @author harry.northover
 * @time 18:13 03/05/2013
 */

SKYLINE.Triangle = function( a, b, c )
{
    /*
     * Array index references that related to Geometry.vertices;
     */
    this.a                  = a || 0;
    this.b                  = b || 0;
    this.c                  = c || 0;

    this.normal             = new SKYLINE.Vector3( 0, 1, 0 );
    this.centroid           = new SKYLINE.Vector3( 0, 0, 0 );

    this.vertexNormals      = new Array();
}