/**
 *
 * Plane Geometry.
 *
 * @class SKYLINE.PlaneGeometry
 * @constructor
 *
 */

SKYLINE.PlaneGeometry = function( width, height, widthSegments, heightSegments )
{
    SKYLINE.Geometry.call( this );

    this.width = width || 10;
    this.height = height || 10;

    this.widthSegments  = widthSegments || 5;
    this.heightSegments = heightSegments || 5;

    this.buildPlane( this.width, this.height, this.widthSegments, this.heightSegments, this );
}

SKYLINE.PlaneGeometry.prototype = new SKYLINE.Geometry();
SKYLINE.PlaneGeometry.prototype.constructor = SKYLINE.PlaneGeometry;

SKYLINE.PlaneGeometry.prototype.buildPlane = function( width, height, widthSegments, heightSegments, geometry )
{
    var vertices = [],
        faces = [],
        index = 0;

    var segmentWidth = width/widthSegments,
        segmentHeight = height/heightSegments,
        totalSegments = widthSegments * heightSegments;

    for( var s = 0; s < totalSegments; ++s )
    {
        var currentRow = Math.floor(s/heightSegments);
        var currentColumn = s % widthSegments;

        var x = currentRow * segmentWidth;
        var y = currentColumn * segmentHeight;
        var z = 0;

        this.buildSegment( x, y, z, index, segmentWidth, segmentHeight, vertices, faces );

        /*
         * Increase the index value by the number of vertices used when building
         * the segment below.
         */
        index += 6;
    }

    geometry.vertices = vertices;
    geometry.faces = faces;
    geometry.constructed = true;
}

/*
 * Constructs a square segment out of two planes.
 */

SKYLINE.PlaneGeometry.prototype.buildSegment = function(x, y, z, index, width, height, vertices, faces)
{
    var v1, v2, v3, v4, v5, v6, triangleLeft, triangleRight;

    v1 = new SKYLINE.Vertex( new SKYLINE.Vector3( x, y, z ) );
    v2 = new SKYLINE.Vertex( new SKYLINE.Vector3( x + width, y, z ) );
    v3 = new SKYLINE.Vertex( new SKYLINE.Vector3( x, y + height, z ) );

    v4 = new SKYLINE.Vertex( new SKYLINE.Vector3( x, y + height, z ) );
    v5 = new SKYLINE.Vertex( new SKYLINE.Vector3( x + width, y, z ) );
    v6 = new SKYLINE.Vertex( new SKYLINE.Vector3( x + width, y + height, z ) );

    vertices.push( v1, v2, v3, v4, v5, v6 );

    triangleLeft = new SKYLINE.Triangle( index, index+1, index+2 );
    faces.push(triangleLeft);

    triangleRight = new SKYLINE.Triangle( index+5, index+3, index+4 );
    faces.push(triangleRight);

}