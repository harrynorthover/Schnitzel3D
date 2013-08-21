/**
 *
 * Geometry.
 *
 * @class SKYLINE.Geometry
 * @constructor
 *
 */

SKYLINE.Geometry = function()
{
    this.id                         = SKYLINE.GeometryCount++;
    this.name                       = "";

    this.vertices                   = [];
    this.faces                      = [];

    this.boundingBox                = null;
    this.boundingSphere             = null;

    this.normal                     = new SKYLINE.Vector3( 0, 1, 0 );
    this.weighted                   = true;

    /*
     * Internal Buffers
     */
    this.__tempVertices             = null;

    /*
     * Flags
     */
    this.verticesNeedUpdating       = false;
    this.indexArrayNeedUpdating     = false;
    this.facesNeedUpdating          = false;
    this.colorsNeedUpdating         = false;
    this.normalsNeedUpdating        = false;
    this.textureUVNeedUpdaing       = false;
};

SKYLINE.Geometry.prototype = {
    constructor: SKYLINE.Geometry,

    applyMatrix4 : function( matrix )
    {
        /*
         * Apply the matrix to the vertices.
         */
        for( var i = 0; i < this.vertices.length; ++i )
        {
            this.vertices[i].applyMatrix4( matrix );
        }

        /*
         * Update face normals and vertex normals.
         */
        for( var f = 0, fl = this.faces.length; f < fl; ++f )
        {
            var face = this.faces[f];

            face.normal.applyMatrix4( matrix );
            face.centroid.applyMatrix4( matrix );

            for( var v = 0, vl = face.vertexNormals.length; v < vl; ++v )
            {
                var vertex = face.vertexNormals[v];

                vertex.applyMatrix4( matrix );
            }
        }

        this.verticesNeedUpdating   = true;
        this.normalsNeedUpdating    = true;
    },

    computeFaceNormals : function()
    {
        for( var i = 0, len = this.faces.length; i < len; ++i )
        {
            var face = this.faces[i];

            var vA = this.vertices[ face.a ];
            var vB = this.vertices[ face.b ];
            var vC = this.vertices[ face.c ];

            var v1 = new SKYLINE.Vector3();
            var v2 = new SKYLINE.Vector3();
            var v3 = new SKYLINE.Vector3();

            v1 = v1.subtractVectors( vA, vB );
            v2 = v2.subtractVectors( vC, vB );
            v3 = v3.crossVectors( v1, v2 );

            v3.normalize();

            face.normal.copy(v3);
        }

        this.normalsNeedUpdating = true;
    },

    computeVertexNormals : function( areaIsWeighted )
    {
        var vertices, f, face, v;

        var verticesLength  = this.vertices.length,
            facesLength     = this.faces.length;

        areaIsWeighted = true;

        /*
         * If internal buffers have already been created, reset them to (0,0,0).
         */
        if(this.__tempVertices !== null)
        {
            vertices = this.__tempVertices;

            for( v = 0; v < verticesLength; ++v )
            {
                vertices[v].setPosition( 0, 0, 0 );
            }
        }
        /*
         * If internal buffers are not present then recreate them. They will need to be
         * recreated each time the geometry changes or is merged.
         */
        else
        {
            this.__tempVertices = new Array( this.vertices.length );

            vertices = this.__tempVertices;

            for( v = 0; v < verticesLength; ++v )
            {
                vertices[v] = new SKYLINE.Vertex();
            }

            /*
             * Reset the face normals
             */

            for( f = 0; f < facesLength; ++f )
            {
                var face = this.faces[f];

                if( face instanceof SKYLINE.Triangle )
                {
                    face.vertexNormals = [ new SKYLINE.Vector3(), new SKYLINE.Vector3(), new SKYLINE.Vector3() ];
                }
            }
        }

        if( areaIsWeighted )
        {
            /*
             * Weighted Vertex normals, see http://www.bytehazard.com/code/vertnorm.html
             *
             * "The solution is to determine the influence of each face in it's contribution
             * to the vertex normal. The obvious way to do that is by using the surface area
             * of each face as 'weight'. Small polygons will have little influence, large
             * polygons have large influence."
             */

            var ABcp    = new SKYLINE.Vector3();
            var BCcp    = new SKYLINE.Vector3();
            var Cross   = new SKYLINE.Vector3();

            for( f = 0; f < facesLength; ++f )
            {
                face = this.faces[f];

                if( face instanceof SKYLINE.Triangle )
                {
                    /*
                     * http://www.iquilezles.org/www/articles/normals/normals.htm
                     */

                     /*var vertexA = this.vertices[ face.a ].position;
                     var vertexB = this.vertices[ face.b ].position;
                     var vertexC = this.vertices[ face.c ].position;

                     ABcp = ABcp.subtractVectors( vertexA, vertexB );
                     BCcp = BCcp.subtractVectors( vertexC, vertexB );

                     Cross = Cross.crossVectors( ABcp, BCcp );

                     vertices[ face.a ].position.add( Cross );
                     vertices[ face.b ].position.add( Cross );
                     vertices[ face.c ].position.add( Cross );*/
                }
            }
        }
        else
        {
            for( f = 0; f < facesLength; ++f )
            {
                face = this.faces[f];

                if( face instanceof SKYLINE.Triangle )
                {
                    vertices[ face.a ].add( face.normal );
                    vertices[ face.b ].add( face.normal );
                    vertices[ face.c ].add( face.normal );
                }
            }
        }

        /*
         * Normalise all vertices.
         */
        for( var v = 0; v < verticesLength; ++v )
        {
            vertices[ v ].normalise();
        }

        for ( f = 0; f < facesLength; ++f )
        {
            var face = this.faces[f];

            face.vertexNormals[ 0 ] = vertices[ face.a ];
            face.vertexNormals[ 1 ] = vertices[ face.b ];
            face.vertexNormals[ 2 ] = vertices[ face.c ];
        }

        this.verticesNeedUpdating = true;
        this.normalsNeedUpdating = true;
    },

    computeFaceCentroids : function()
    {
        for( var i = 0, len = this.faces.length; i < len; ++i )
        {
            var face = this.faces[i];

            if( face instanceof SKYLINE.Triangle )
            {
                var v = new SKYLINE.Vector3();

                v.add( this.vertices[face.a] );
                v.add( this.vertices[face.b] );
                v.add( this.vertices[face.c] );

                v.divide( 3 );

                face.centroid.copy( v );
            }
        }
    },

    mergeGeometry : function()
    {
        /*
         * TODO: Implement merging of duplicate geometry.
         */

        /*
         * STAGES:
         *
         * 1. Iterate through all vertices, check if any of them are equal.
         * 2. Get index of first vertex that is equal to another, then map all other vertices
         *    that equal the first vertex to that.
         * 3. Update face data, remove faces that have duplicate vertices.
         * 4. Recalculate vertex normals
         */

        var hashmap         = {};

        var v               = 0,
            f               = 0,
            vLen            = this.vertices.length,
            fLen            = this.vertices.length,
            duplicates      = new Array(),
            unique          = new Array(),
            numUnique       = 0,
            numDuplicates   = 0;

        for( v; v < vLen; ++v )
        {
            var vertex  = this.vertices[v];
            var key     = [ vertex.position.x, vertex.position.y, vertex.position.z ];

            if( hashmap[ key ] !== undefined )
            {
                /* Vertex is not unique, it already exists in the hashmap.*/
                /* We store the vertex data an a key that maps it to a unique vertex.*/

                duplicates.push( [ vertex, key ] );

                numDuplicates++;

                // console.warn("[SKYLINE.Geometry].mergeVertices - Duplicate found at ", v, " [ Total Duplicates: ", numDuplicates, " ]");
            }
            else
            {
                /* Vertex is unique.*/

                hashmap[ key ] = vertex;

                unique.push( [ vertex, key ] );

                numUnique++;
            }
        }

        for( f; f < fLen; ++f )
        {
            var face = this.faces[f];

            if( face instanceof SKYLINE.Triangle )
            {
                var vertices = [ this.vertices[ face.a ],
                    this.vertices[ face.b],
                    this.vertices[ face.c] ];

                for( var j = 0; j < 3; ++j )
                {
                    /*
                     * TODO: Finish merging vertices for optimisation.
                     */
                }
            }
        }

        this.computeVertexNormals( this.weighted );

        this.verticesNeedUpdating       = true;
        this.indexArrayNeedUpdating     = true;
    },

    computeBoundingBox : function()
    {
        if(this.boundingBox == null)
        {
            this.boundingBox = new SKYLINE.Box3();
        }

        this.boundingBox.computeFromPoints( this.vertices );
    },

    computeBoundingSphere : function()
    {
        if(this.boundingSphere == null)
        {
            this.boundingSphere = new SKYLINE.Sphere();
        }

        /*
         * TODO: Finish computeBoundingSphere implementation.
         */

        this.boundingSphere.computeFromPoints( this.vertices );
    },

    copy : function( geometry )
    {
        this.id                 = SKYLINE.GeometryCount++;
        this.name               = geometry.name + '_copy';

        this.vertices           = new Array();

        for( var i = 0; i < geometry.vertices.length; ++i )
        {
            this.vertices.push( geometry.vertices[i] );
        }

        this.faces              = new Array();

        for( var i = 0; i < geometry.faces.length; ++i )
        {
            this.faces.push( geometry.faces[i] );
        }

        this.computeBoundingBox();

        /*
         * TODO: Add support for automatic computation of bounding sphere.
         */

        this.normal.copy( geometry.normal );
    },

    add : function( geometry )
    {
        for( var i = 0; i < geometry.vertices.length; ++i )
        {
            this.vertices.push( geometry.vertices[i] );
        }

        for( var i = 0; i < geometry.faces.length; ++i )
        {
            this.faces.push( geometry.faces[i] );
        }
    }
}

SKYLINE.GeometryCount = 0;