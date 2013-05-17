/**
 * @project skyline
 * @author harry.northover
 * @time 18:12 03/05/2013
 */

SKYLINE.Vertex = function( pos )
{
    this.position   = new SKYLINE.Vector3( 0, 0, 0 );
    this.normal     = new SKYLINE.Vector3( 0, 1, 0 );

    function init( pos, scope )
    {
        SKYLINE.Object3D.call( this );

        if(pos !== undefined)
        {
            scope.position = pos;
        }
    }

    this.setNormal = function( vector, shouldNormalise )
    {
        if(vector !== undefined)
        {
            this.normal = vector;

            if(shouldNormalise)
            {
                this.normal.normalize();
            }
        }
        else
        {
            console.warn('[SKYLINE.Vertex] setNormal parameter "vector" is undefined!');
        }
    }

    init( pos, this );
}

SKYLINE.Vertex.prototype = new SKYLINE.Object3D();