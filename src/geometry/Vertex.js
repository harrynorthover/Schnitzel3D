/**
 * @project skyline
 * @author harry.northover
 * @time 18:12 03/05/2013
 */

SKYLINE.Vertex = function( pos, normal )
{
    this.normal     = new SKYLINE.Vector3( 0, 1, 0 );

    function init( pos, normal, scope )
    {
        SKYLINE.Object3D.call( this );

        if(pos !== undefined)
        {
            scope.position = pos;
        }

        if(normal !== undefined)
        {
            scope.normal = normal;
        }
    }

    this.set = function( x, y, z )
    {
        this.position.x = x || 0;
        this.position.y = y || 0;
        this.position.z = z || 0;

        return this;
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
            console.warn('[SKYLINE.Vertex].setNormal parameter "vector" is undefined!');
        }
    }

    this.normalise = function()
    {
        this.normal.normalize();
    }

    init( pos, normal, this );
}

SKYLINE.Vertex.prototype = new SKYLINE.Object3D();