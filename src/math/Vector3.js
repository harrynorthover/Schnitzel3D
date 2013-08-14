/**
 *
 * @project skyline
 * @author Harry
 * @time 12:46 19/04/2013
 *
 */

SKYLINE.Vector3 = function(x, y, z)
{
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
};

SKYLINE.Vector3.prototype = {
    constructor: SKYLINE.Vector3,

    scale : function(factor)
    {
        this.multiplyScalar( factor );
    },

    equals : function(vector)
    {
        if( this.x == vector.x && this.y == vector.y && this.z == vector.z )
        {
            return true;
        }

        return false;
    },

    add : function(vector)
    {
        return this.addVectors( this, vector );
    },

    addVectors : function( vector1, vector2 )
    {
        vector1.x += vector2.x;
        vector1.y += vector2.y;
        vector1.z += vector2.z;

        return vector1;
    },

    sub : function(vector)
    {
        return this.subtractVectors( this, vector );
    },

    subtractVectors : function( vector1, vector2 )
    {
        vector1.x -= vector2.x;
        vector1.y -= vector2.y;
        vector1.z -= vector2.z;

        return vector1;
    },

    divide : function(value)
    {
        this.divideScalar( value );
    },

    multiply : function( obj )
    {
        if(obj instanceof SKYLINE.Vector3)
        {
            this.multiplyVectors(this, obj);
        }
        else if(typeof obj === "number")
        {
            this.multiplyScalar(obj);
        }
        else
        {
            console.error("To multiply a SKYLINE.Vector3 you must pass in either a Vector3 or Number scale value.");
        }
    },

    /*
     * Returns the cosine of the angle of two vectors. Use dotAngle to calculate the actual angle in Degrees.
     * NB. This can be used in conjunction with the crossProduct to find the axis of rotation and the angle
     * of rotation between two vectors
     *
     * 1  = Both vectors are facing the same way.
     * 0  = Vector is perpendicular (at right angle) to this.
     * -1 = Vector is facing the other way.
     */
    dot : function( vector )
    {
        return ( this.x * vector.x ) + ( this.y * vector.y ) + ( this.z * vector.z );
    },

    /*
     * Returns the actual angle of the dot product.
     */
    angleOfRotation : function( vector )
    {
        return ( Math.acos( this.dot(vector) ) * ( 180 / Math.PI ) );
    },

    /*
     * Returns a vector this is perpendicular to
     * both this and 'vector'.
     */
    crossProduct : function( vector )
    {
        return this.crossVectors(this, vector);
    },

    /*
     * See above.
     * Used to find the axis of rotation between two vectors.
     */
    crossVectors : function( v1, v2 )
    {
        var cross   = new SKYLINE.Vector3( 0, 0, 0 );

        cross.x     = (v1.y * v2.z) - (v1.z * v2.y);
        cross.y     = (v1.z * v2.x) - (v1.x * v2.z);
        cross.z     = (v1.x * v2.y) - (v1.y * v2.x);

        return cross;
    },

    /*
     * Makes then length of the vector equal to 0.
     * Useful to use when working with other vectors.
     */
    normalize : function()
    {
        this.divideScalar( this.length() );
    },

    /*
     * Divides each component (x,y,z) by a value.
     */
    divideScalar : function( value )
    {
        if( value != 0 ) {
            this.x /= value;
            this.y /= value;
            this.z /= value;
        } else {
            this.x = this.y = this.z = 0;
        }
    },

    /*
     * Multiplies each component (x,y,z) by a value.
     */
    multiplyScalar : function( value )
    {
        if( value != 0 )
        {
            this.x *= value;
            this.y *= value;
            this.z *= value;
        }
        else
        {
            this.x = this.y = this.z = 0;
        }
    },

    /*
     * Multiplies two vectors together.
     */
    multiplyVectors : function( v1, v2 )
    {
        if( v1 instanceof SKYLINE.Vector3 && v2 instanceof SKYLINE.Vector3 )
        {
            this.x = v1.x * v2.x;
            this.y = v1.y * v2.y;
            this.z = v1.z * v2.z;

            return this;
        }
        else
        {
            console.error("Vector3.multiplyVectors requires two objects of SKYLINE.Vector3 type to be passed in.");
        }
    },

    /*
     * Multiplies the vector by a SKYLINE.Matrix4.
     */
    applyMatrix4 : function( matrix )
    {
        if(matrix instanceof  SKYLINE.Matrix4)
        {
            var x   = this.x,
                y   = this.y,
                z   = this.z;

            this.x  = (x * matrix.entries[0] + y * matrix.entries[4] + z * matrix.entries[8] + matrix.entries[12]);
            this.y  = (x * matrix.entries[1] + y * matrix.entries[5] + z * matrix.entries[9] + matrix.entries[13]);
            this.z  = (x * matrix.entries[2] + y * matrix.entries[6] + z * matrix.entries[10] + matrix.entries[14]);
        }
        else
        {
            console.error("To use Vector3.applyMatrix4 the parameter needs to been an instance of SKYLINE.Matrix4.");
        }
    },

    /*
     * @param - A perspective projection matrix.
     */
    applyProjectionMatrix : function( matrix )
    {
        if(matrix instanceof SKYLINE.Matrix4)
        {
            var e = matrix.entries;

            var x   = this.x,
                y   = this.y,
                z   = this.z;

            /*
             * This is where the magic happens. The bottom row of a 4x4 matrix is
             * what is used to calculate the perspective (w) value which x, y & z
             * and all multiplied by to scale them relative to the camera.
             *
             * TODO: Is there a reason why three.js calculates perspective by
             * 1 / and then * instead of / ?
             *
             * NOTE: Could this be todo with accuracy when multiplying. Z calculated
             * using the 1 / method was .2 (17d.p) higher than / method.
             */

            var w = ( x * e[3] ) + ( y * e[7] ) + ( z * e[11] ) + e[15];

            this.x  = (x * e[0] + y * e[4] + z * e[8] + e[12]) / w;
            this.y  = (x * e[1] + y * e[5] + z * e[9] + e[13]) / w;
            this.z  = (x * e[2] + y * e[6] + z * e[10] + e[14]) / w;

            return this;
        }
        else
        {
            console.error("To use Vector3.applyProjectionMatrix the parameter needs to been an instance of SKYLINE.Matrix4.");
        }
    },

    getScaleFromMatrix : function( m )
    {
        var e = m.entries;

        var scaleX = new SKYLINE.Vector3( e[0], e[1], e[2] );
        var scaleY = new SKYLINE.Vector3( e[3], e[4], e[5] );
        var scaleZ = new SKYLINE.Vector3( e[6], e[7], e[8] );

        this.x = scaleX.length();
        this.y = scaleY.length();
        this.z = scaleZ.length();

        return this;
    },

    getPositionFromMatrix : function( m )
    {
        this.x = m.entries[12];
        this.y = m.entries[13];
        this.z = m.entries[14];
    },

    makeEulerFromMatrix : function( m, order )
    {
        var r = this.createEulerFromMatrix( m, order );

        this.x = r.x;
        this.y = r.y;
        this.z = r.z;

        return this;
    },

    createEulerFromMatrix : function( m, order )
    {
        var result  = new SKYLINE.Vector3( 0,0,0 );
        var e       = m.entries;

        function clamp( value )
        {
            return Math.max( -1, Math.min(1, value) );
        }

        if(m instanceof SKYLINE.Matrix3)
        {
            var m11     = e[0], m12 = e[3], m13 = e[6];
            var m21     = e[1], m22 = e[4], m23 = e[7];
            var m31     = e[2], m32 = e[5], m33 = e[8];
        }
        else
        {
            var m11     = e[0], m12 = e[4], m13 = e[8];
            var m21     = e[1], m22 = e[5], m23 = e[9];
            var m31     = e[2], m32 = e[6], m33 = e[10];
        }

        console.log('OHA!');

        if(m instanceof SKYLINE.Matrix4 || m instanceof SKYLINE.Matrix3)
        {
            if( order == EULER_ORDER_XYZ || order === undefined )
            {
                result.y = Math.asin( clamp( m13 ) );

                /*
                 * This checks to see if the x & z axis have become aligned or not.
                 */
                if( Math.abs( m13 ) < 0.99999 )
                {
                    result.x = Math.atan2( - m23, m33 );
                    result.z = Math.atan2( - m12, m11 );
                }
                else
                {
                    result.x = Math.atan2( m32, m22 );
                    result.z = 0;
                }
            }
            else if ( order === EULER_ORDER_YXZ )
            {
                result.x = Math.asin( - clamp( m23 ) );

                if( Math.abs( m23 ) < 0.99999 )
                {
                    result.y = Math.atan2( m13, m33 );
                    result.z = Math.atan2( m21, m22 );
                }
                else
                {
                    result.y = Math.atan2( -m31, m11 );
                    result.z = 0;
                }
            }
            else if ( order === EULER_ORDER_ZXY )
            {
                result.x = Math.asin( clamp( m32 ) );

                if( Math.abs( m32 ) < 0.99999 )
                {
                    this.y = Math.atan2( - m31, m33 );
                    this.z = Math.atan2( - m12, m22 );
                }
                else
                {
                    this.y = 0;
                    this.z = Math.atan2( m21, m11 );
                }
            }
            else if ( order == EULER_ORDER_ZYX )
            {
                result.y = Math.asin( - clamp( m31 ) );

                if( Math.abs( m31 ) < 0.99999 )
                {
                    result.x = Math.atan2( m32, m33 );
                    result.z = Math.atan2( m21, m11 );
                }
                else
                {
                    result.x = 0;
                    result.z = Math.atan2( - m12, m22 );
                }
            }
            else if ( order == EULER_ORDER_YZX )
            {
                result.z = Math.asin( clamp( m21 ) );

                if( Math.abs( m21 ) < 0.99999 )
                {
                    result.x = Math.atan2( - m23, m22 );
                    result.y = Math.atan2( - m31, m11 );
                }
                else
                {
                    result.x = 0;
                    result.y = Math.atan2( m13, m33 );
                }
            }
            else if ( order == EULER_ORDER_XZY )
            {
                result.z = Math.asin( - clamp( m12 ) );

                if( Math.abs( m12 ) < 0.99999 )
                {
                    result.x = Math.atan2( m32, m22 );
                    result.y = Math.atan2( m13, m11 );
                }
                else
                {
                    result.x = Math.atan2( - m23, m33 );
                    result.y = 0;
                }
            }
        }

        return result;
    },

    /*
     * Returns the magnitude of the vector.
     */
    length : function()
    {
        return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );
    },

    /*
     * Returns the distance to a specified vector.
     */
    distanceTo : function(vector)
    {
        return Math.sqrt( this.distanceToSquared( this, vector ) );
    },

    /*
     * Calculates the distance between two vectors.
     */
    distanceToSquared : function( vec1, vec2 )
    {
        var xDist = vec1.x - vec2.x;
        var yDist = vec1.y - vec2.y;
        var zDist = vec1.z - vec2.z;

        return xDist * xDist, yDist * yDist, zDist * zDist;
    },

    toArray : function()
    {
        return [this.x, this.y, this.z];
    },

    fromArray : function( a )
    {
        this.x = a[0];
        this.y = a[1];
        this.z = a[2];

        return this;
    },

    /*
     * Copies a vector.
     */
    copy : function( vector )
    {
        if(vector instanceof SKYLINE.Vector3)
        {
            this.x = vector.x;
            this.y = vector.y;
            this.z = vector.z;
        }
    },

    toString : function()
    {
        console.log("[ X: ", this.x, " Y: ", this.y, " Z: ", this.z, " ]");
    }
};