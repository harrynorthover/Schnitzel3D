/**
 *
 * @project skyline
 * @author Harry
 * @time 16:13 21/04/2013
 *
 */

SKYLINE.Vector2 = function( x, y )
{
    this.x = x || 0;
    this.y = y || 0;

    this.set = function( x, y )
    {
        this.x = x;
        this.y = y;
    }

    this.add = function( vec )
    {
        this.addVectors(this, vec);
    }

    this.addVectors = function( vec1, vec2 )
    {
        this.x = vec1.x + vec2.x;
        this.y = vec1.y + vec2.y;

        return this;
    }

    this.subtract = function( vec )
    {
        this.subtractVectors( this, vec );
    }

    this.subtractVectors = function( vec1, vec2 )
    {
        this.x = vec1.x - vec2.x;
        this.y = vec1.y - vec2.y;

        return this;
    }

    this.scale = function( factor )
    {
        return this.multiplyScalar( factor );
    }

    this.multiply = function( obj )
    {
        if(obj instanceof SKYLINE.Vector2 || obj instanceof SKYLINE.Vector3)
        {
            this.multiplyVectors(this, obj);
        }
        else if(typeof obj === "number")
        {
            this.multiplyScalar(obj);
        }
        else
        {
            console.error("To multiply a SKYLINE.Vector2 you need to pass in one of the following: SKYLINE.Vector2, SKYLINE.Vector3 or Number");
        }
    }

    this.multiplyVectors = function( vec1, vec2 )
    {
        this.x = vec1.x * vec2.x;
        this.y = vec1.y * vec2.y;
    }

    this.multiplyScalar = function( scalar )
    {
        this.x *= scalar;
        this.y *= scalar;
    }

    this.toArray = function()
    {
        return [this.x, this.y];
    }

    this.fromArray = function( a )
    {
        this.x = a[0];
        this.y = a[1];

        return this;
    }

    this.copy = function(vec)
    {
        this.x = vec.x;
        this.y = vec.y;
    }

    this.clone = function()
    {
        return new SKYLINE.Vector2(this.x, this.y);
    }
}