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

    this.width          = width || 10;
    this.height         = height || 10;

    this.widthSegments  = widthSegments || 5;
    this.heightSegments = heightSegments || 5;

    this.constructed    = false;

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

        index += 3;
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
    var v1 = new SKYLINE.Vector3();
    var v2 = new SKYLINE.Vector3();
    var v3 = new SKYLINE.Vector3();
    var v4 = new SKYLINE.Vector3();

    var vec1 = new SKYLINE.Vertex();
    var vec2 = new SKYLINE.Vertex();
    var vec3 = new SKYLINE.Vertex();
    var vec4 = new SKYLINE.Vertex();

    v1.x = x;
    v1.y = y;
    v1.z = z;

    v2.x = x + width;
    v2.y = y;
    v2.z = z;

    v3.x = x;
    v3.y = y +  height;
    v3.z = z;

    v4.x = x + width;
    v4.y = y + height;
    v4.z = z;

    vec1.position = v1;
    vec2.position = v2;
    vec3.position = v3;
    //vec4.position = v4;

    vertices.push(vec1);
    vertices.push(vec2);
    vertices.push(vec3);

    var triangleLeft = new SKYLINE.Triangle( index, index+1, index+2 );
    faces.push(triangleLeft);

    //vertices.push(vec4);

    //var triangleRight = new SKYLINE.Triangle( index+3, index+1, index+2 );
    //faces.push(triangleRight);
}