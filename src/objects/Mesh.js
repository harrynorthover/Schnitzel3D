/**
 *
 * @project skyline
 * @author harry.northover
 * @time 14:02 05/05/2013
 *
 */

SKYLINE.Mesh = function(geometry, material)
{
    this.geometry = null;
    this.material = null;

    function init( geom, mat, scope )
    {
        SKYLINE.Object3D.call( this );

        scope.setGeometry( geom );
        scope.setMaterial( mat );

        scope.geometry.computeBoundingBox();
    }

    this.setGeometry = function( g )
    {
        if( g !== undefined )
        {
            this.geometry = g;

            g.computeFaceNormals();
            g.computeVertexNormals();
        }
        else
        {
            this.geometry = new SKYLINE.Geometry();
        }
    }

    this.setMaterial = function( m )
    {
        if( m !== undefined )
        {
            this.material = m;
        }
        else
        {
            this.material = new SKYLINE.Color( 255, 0, 0 );
        }
    }

    init(geometry, material, this);
}

SKYLINE.Mesh.prototype = new SKYLINE.Object3D();