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
    this.width          = 10;
    this.height         = 10;

    this.widthSegments  = 5;
    this.heightSegments = 5;

    this.constructed    = false;

    function init( width, height, widthSegments, heightSegments, scope )
    {
        if( width !== undefined && height !== undefined )
        {
            scope.width                 = width;
            scope.height                = height;

            scope.widthSegments         = widthSegments;
            scope.heightSegments        = heightSegments;

            buildPlane( scope.width, scope.height, scope.widthSegments, scope.heightSegments, scope );
        }

        SKYLINE.Geometry.call( this );
    }

    function buildPlane( width, height, widthSegments, heightSegments, geometry )
    {
        var vertices = [],
            faces = [],
            index = 0;

        var segmentWidth = width/widthSegments,
            segmentHeight = height/heightSegments;

        for( var i = 0, wLen = widthSegments; i < wLen; ++i )
        {
            for( var j = 0, hLen = heightSegments; j < hLen; ++j )
            {
                var v1 = new SKYLINE.Vector3();
                var v2 = new SKYLINE.Vector3();
                var v3 = new SKYLINE.Vector3();
                var v4 = new SKYLINE.Vector3();

                var vec1 = new SKYLINE.Vertex();
                var vec2 = new SKYLINE.Vertex();
                var vec3 = new SKYLINE.Vertex();
                var vec4 = new SKYLINE.Vertex();

                var x = ( i * segmentWidth );
                var y = ( j * segmentHeight );
                var z = 1;

                v1.x = x;
                v1.y = y;
                v1.z = z;

                v2.x = x + segmentWidth;
                v2.y = y;
                v2.z = z;

                v3.x = x;
                v3.y = y + segmentHeight;
                v3.z = z;

                v4.x = x + segmentWidth;
                v4.y = y + segmentHeight;
                v4.z = z;

                vec1.position = v1;
                vec2.position = v2;
                vec3.position = v3;
                vec4.position = v4;

                vertices.push(vec1);
                vertices.push(vec2);
                vertices.push(vec3);
                vertices.push(vec4);

                var triangle = new SKYLINE.Triangle( index, index+1, index+2 );
                var triangle2 = new SKYLINE.Triangle( index+3, index+1, index+2 );

                faces.push(triangle);
                faces.push(triangle2);

                index += 4;
            }
        }

        geometry.vertices = vertices;
        geometry.faces = faces;
        geometry.constructed = true;
    }

    init( width, height, widthSegments, heightSegments, this );
}

SKYLINE.PlaneGeometry.prototype = new SKYLINE.Geometry();