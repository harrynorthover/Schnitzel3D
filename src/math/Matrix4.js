/**
 *
 * @project skyline
 * @author Harry
 * @time 11:32 20/04/2013
 *
 */

SKYLINE.Matrix4 = function( m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44 ) {

    this.entries = [ 0, 0, 0, 0,
                     0, 0, 0, 0,
                     0, 0, 0, 0,
                     0, 0, 0, 0];//new Float32Array( 16 );
    this.init = false;

    function init( m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44, scope )
    {
        if( m11 instanceof SKYLINE.Matrix4 )
        {
            var e = m11.entries;

            scope.setValues( e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7], e[8], e[9], e[10], e[11], e[12], e[13], e[14], e[15] );
            scope.transpose();
        }
        else if ( Object.prototype.toString.call( m11 ) === '[object Array]' )
        {
            /*
             * Parameters are an array of numbers.
             */
            var a = m11;

            /*
             * If the array passed in doesn't have enough elements to fill a 4x4 matrix then pad it out with 0's.
             * TODO: Test this.
             */
            if(a.length < 16)
            {
                var len = a.length;
                var diff = 16 - len;

                for( var i = 0; i < diff; ++i )
                {
                    a.push(0);
                }
            }
            
            scope.setValues( a[0],  a[1],  a[2],  a[3], a[4],  a[5],  a[6],  a[7], a[8],  a[9],  a[10], a[11], a[12], a[13], a[14], a[15] );
        }
        else if( m11 !== undefined && typeof m11 == 'number' )
        {
            /*
             * Parameters are 16 numbers.
             */
            scope.setValues( m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44 );
        }
        else
        {
            /*
             * If no parameters are specified or they are not of a valid type then set the matrix to the identity.
             */
            //if(!scope.init)
                //scope.identity();
        }

        scope.init = true;
    }

    this.setValues = function( m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44 )
    {
        var e = this.entries;

        /*
         * NOTE: This switches rows into columns.
         */

        e[0]  = m11;  e[1]  = m21;  e[2]  = m31;  e[3]  = m41;
        e[4]  = m12;  e[5]  = m22;  e[6]  = m32;  e[7]  = m42;
        e[8]  = m13;  e[9]  = m23;  e[10] = m33;  e[11] = m43;
        e[12] = m14;  e[13] = m24;  e[14] = m34;  e[15] = m44;

        this.entries = e;
    }

    this.setValueAtIndex = function( index, value )
    {
        this.entries[index] = value;
    }

    this.identity = function()
    {
        /*this.setValues( 1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        0, 0, 0, 1 );

        return this;*/
    }

    this.scale = function( value )
    {
        return this.scaleMatrix(this, value);
    }

    this.scaleMatrix = function( matrix, scalar )
    {
        var m           = matrix.entries;
        var result      = new SKYLINE.Matrix4();

        m[0]            *= scalar;
        m[1]            *= scalar;
        m[2]            *= scalar;
        m[3]            *= scalar;
        m[4]            *= scalar;
        m[5]            *= scalar;
        m[6]            *= scalar;
        m[7]            *= scalar;
        m[8]            *= scalar;
        m[9]            *= scalar;
        m[10]           *= scalar;
        m[11]           *= scalar;
        m[12]           *= scalar;
        m[13]           *= scalar;
        m[14]           *= scalar;
        m[15]           *= scalar;

        result.entries = m;

        return result;
    }

    this.multiply = function( matrix )
    {
        this.entries = this.multiplyMatrix( matrix, this ).entries;

        return this;
    }

    this.multiplyMatrix = function( m1, m2 )
    {
        var a           = m1.entries;
        var b           = m2.entries;

        var result      = new SKYLINE.Matrix4();
        var elements    = result.entries;

        var a11         = a[0],     a12 = a[1],     a13 = a[2],     a14 = a[3];
        var a21         = a[4],     a22 = a[5],     a23 = a[6],     a24 = a[7];
        var a31         = a[8],     a32 = a[9],     a33 = a[10],    a34 = a[11];
        var a41         = a[12],    a42 = a[13],    a43 = a[14],    a44 = a[15];

        var b11         = b[0],     b12 = b[1],     b13 = b[2],     b14 = b[3];
        var b21         = b[4],     b22 = b[5],     b23 = b[6],     b24 = b[7];
        var b31         = b[8],     b32 = b[9],     b33 = b[10],    b34 = b[11];
        var b41         = b[12],    b42 = b[13],    b43 = b[14],    b44 = b[15];

        elements[0]     = (a11 * b11) + (a12 * b21) + (a13 * b31) + (a14 * b41);
        elements[4]     = (a11 * b12) + (a12 * b22) + (a13 * b32) + (a14 * b42);
        elements[8]     = (a11 * b13) + (a12 * b23) + (a13 * b33) + (a14 * b43);
        elements[12]    = (a11 * b14) + (a12 * b24) + (a13 * b34) + (a14 * b44);

        elements[1]     = (a21 * b11) + (a22 * b21) + (a23 * b31) + (a24 * b41);
        elements[5]     = (a21 * b12) + (a22 * b22) + (a23 * b32) + (a24 * b42);
        elements[9]     = (a21 * b13) + (a22 * b23) + (a23 * b33) + (a24 * b43);
        elements[13]    = (a21 * b14) + (a22 * b24) + (a23 * b34) + (a24 * b44);

        elements[2]     = (a31 * b11) + (a32 * b21) + (a33 * b31) + (a34 * b41);
        elements[6]     = (a31 * b12) + (a32 * b22) + (a33 * b32) + (a34 * b42);
        elements[10]    = (a31 * b13) + (a32 * b23) + (a33 * b33) + (a34 * b43);
        elements[14]    = (a31 * b14) + (a32 * b24) + (a33 * b34) + (a34 * b44);

        elements[3]     = (a41 * b11) + (a42 * b21) + (a43 * b31) + (a44 * b41);
        elements[7]     = (a41 * b12) + (a42 * b22) + (a43 * b32) + (a44 * b42);
        elements[11]    = (a41 * b13) + (a42 * b23) + (a43 * b33) + (a44 * b43);
        elements[15]    = (a41 * b14) + (a42 * b24) + (a43 * b34) + (a44 * b44);

        result.entries  = elements;

        return result;
    }

    this.getInverse = function( blockOnInvertable )
    {
        return this.calculateInverse( this, blockOnInvertable );
    }

    this.calculateInverse = function( matrixToInverse, blockOnInvertable )
    {
        var block   = blockOnInvertable || false;
        var m       = new SKYLINE.Matrix4();

        m.copy(matrixToInverse);

        var e = m.entries;

        var m00 = e[0], m01 = e[4], m02 = e[8],  m03 = e[12];
        var m10 = e[1], m11 = e[5], m12 = e[9],  m13 = e[13];
        var m20 = e[2], m21 = e[6], m22 = e[10], m23 = e[14];
        var m30 = e[3], m31 = e[7], m32 = e[11], m33 = e[15];

        var r00, r01, r02, r03,
            r10, r11, r12, r13,
            r20, r21, r22, r23,
            r30, r31, r32, r33;

        /*
         * Based on http://www.euclideanspace.com/maths/algebra/transformationMatrix/functions/inverse/fourD/index.htm.
         */

        r00 = m12 *m23 *m31 - m13*m22*m31 + m13*m21*m32 - m11*m23*m32 - m12*m21*m33 + m11*m22*m33;
        r01 = m03 *m22 *m31 - m02*m23*m31 - m03*m21*m32 + m01*m23*m32 + m02*m21*m33 - m01*m22*m33;
        r02 = m02 *m13 *m31 - m03*m12*m31 + m03*m11*m32 - m01*m13*m32 - m02*m11*m33 + m01*m12*m33;
        r03 = m03 *m12 *m21 - m02*m13*m21 - m03*m11*m22 + m01*m13*m22 + m02*m11*m23 - m01*m12*m23;
        r10 = m13 *m22 *m30 - m12*m23*m30 - m13*m20*m32 + m10*m23*m32 + m12*m20*m33 - m10*m22*m33;
        r11 = m02 *m23 *m30 - m03*m22*m30 + m03*m20*m32 - m00*m23*m32 - m02*m20*m33 + m00*m22*m33;
        r12 = m03 *m12 *m30 - m02*m13*m30 - m03*m10*m32 + m00*m13*m32 + m02*m10*m33 - m00*m12*m33;
        r13 = m02 *m13 *m20 - m03*m12*m20 + m03*m10*m22 - m00*m13*m22 - m02*m10*m23 + m00*m12*m23;
        r20 = m11 *m23 *m30 - m13*m21*m30 + m13*m20*m31 - m10*m23*m31 - m11*m20*m33 + m10*m21*m33;
        r21 = m03 *m21 *m30 - m01*m23*m30 - m03*m20*m31 + m00*m23*m31 + m01*m20*m33 - m00*m21*m33;
        r22 = m01 *m13 *m30 - m03*m11*m30 + m03*m10*m31 - m00*m13*m31 - m01*m10*m33 + m00*m11*m33;
        r23 = m03 *m11 *m20 - m01*m13*m20 - m03*m10*m21 + m00*m13*m21 + m01*m10*m23 - m00*m11*m23;
        r30 = m12 *m21 *m30 - m11*m22*m30 - m12*m20*m31 + m10*m22*m31 + m11*m20*m32 - m10*m21*m32;
        r31 = m01 *m22 *m30 - m02*m21*m30 + m02*m20*m31 - m00*m22*m31 - m01*m20*m32 + m00*m21*m32;
        r32 = m02 *m11 *m30 - m01*m12*m30 - m02*m10*m31 + m00*m12*m31 + m01*m10*m32 - m00*m11*m32;
        r33 = m01 *m12 *m20 - m02*m11*m20 + m02*m10*m21 - m00*m12*m21 - m01*m10*m22 + m00*m11*m22;

        var det = m.determinate();

        if ( det == 0 )
        {
            m.identity();

            /*
             * TODO: Should this be console.error or downgrade it to console.warn
             * as it might not be a blocker if the inverse cannot be found...
             */

            var error = "[SKYLINE.Matrix4].getInverse - The inverse of this transformationMatrix cannot be found!";

            if(block)
            {
                throw new Error(error);
            }
            else
            {
                console.warn(error);
            }
        }
        else
        {
            var result = new SKYLINE.Matrix4( r00, r01, r02, r03,
                                              r10, r11, r12, r13,
                                              r20, r21, r22, r23,
                                              r30, r31, r32, r33 );

            result.scale( 1 / det );

            m.copy(result);
        }

        return m;
    }

    this.transpose = function( )
    {
        return this.transposeMatrix( this );
    }

    this.transposeMatrix = function( m )
    {
        var e   = m.entries;
        var tmp = [];

        tmp[0]  = e[0]; tmp[1]  = e[4]; tmp[2]  = e[8];  tmp[3]  = e[12];
        tmp[4]  = e[1]; tmp[5]  = e[5]; tmp[6]  = e[9];  tmp[7]  = e[13];
        tmp[8]  = e[2]; tmp[9]  = e[6]; tmp[10] = e[10]; tmp[11] = e[14];
        tmp[12] = e[3]; tmp[13] = e[7]; tmp[14] = e[11]; tmp[15] = e[15];

        m.entries = tmp;

        return m;
    }

    this.invertRows = function( m )
    {
        var e = m.entries;
        var tmp = [];

        tmp[0]  = e[3];  tmp[1]  = e[2];  tmp[2]  = e[1];  tmp[3]  = e[0];
        tmp[4]  = e[7];  tmp[5]  = e[6];  tmp[6]  = e[5];  tmp[7]  = e[4];
        tmp[8]  = e[11]; tmp[9]  = e[10]; tmp[10] = e[9];  tmp[11] = e[8];
        tmp[12] = e[15]; tmp[13] = e[14]; tmp[14] = e[13]; tmp[15] = e[12];

        m.entries = tmp;

        return m;
    }

    /**
     * determinate()
     *
     * This is used to see whether a set of linear equations are solvable.
     * This means it can be used to check whether to transformationMatrix can be inverted
     * or not.
     */
    this.determinate = function()
    {
        var e = this.entries;

        var m11 = e[0], m12 = e[4], m13 = e[8], m14 = e[12];
        var m21 = e[1], m22 = e[5], m23 = e[9], m24 = e[13];
        var m31 = e[2], m32 = e[6], m33 = e[10], m34 = e[14];
        var m41 = e[3], m42 = e[7], m43 = e[11], m44 = e[15];

        var a = new SKYLINE.Matrix3( m21, m22, m23, m31, m32, m33, m41, m42, m43 );
        var b = new SKYLINE.Matrix3( m21, m23, m24, m31, m33, m34, m41, m43, m44 );
        var c = new SKYLINE.Matrix3( m21, m22, m24, m31, m32, m34, m41, m42, m44 );
        var d = new SKYLINE.Matrix3( m22, m23, m24, m32, m33, m34, m42, m43, m44 );

        var minors = [a, b, c, d];
        var minorsDeterminate = [];

        for( var i = 0; i < 4; ++i)
        {
            minorsDeterminate.push(minors[i].determinate());
        }

        /* Times the minors determinate by the cofactors to get the overall 4x4 determinate */
        return ( m11 * minorsDeterminate[3] ) - ( m12 * minorsDeterminate[1] ) + ( m13 * minorsDeterminate[2] ) - ( m14 * minorsDeterminate[0] );
    }

    this.applyTranslation = function( v )
    {
        var e = this.entries;

        e[12] = v.x;
        e[13] = v.y;
        e[14] = v.z;

        return this;
    }

    this.applyScaleVector = function( v )
    {
        var e = this.entries;

        e[0] *= v.x;  e[1] *= v.x;  e[2]  *= v.x;  e[3]  *= v.x;
        e[4] *= v.y;  e[5] *= v.y;  e[6]  *= v.y;  e[7]  *= v.y;
        e[8] *= v.z;  e[9] *= v.z;  e[10] *= v.z;  e[11] *= v.z;

        this.entries = e;
    }

    /*
     * Note about rotation.
     * The reason for the values being placed where they are in the matrix is because when rotating
     * around an axis (x for example), only values on the y & z axis get changed. This is why there
     * are not values places on the x column and row of the matrix.
     */

    this.rotateX = function( amount )
    {
        var c = Math.cos( amount );
        var s = Math.sin( amount );

        /*
         * X column and row is left untouched.
         */

                      /*x   y   z   t */
        this.setValues( 1,  0,  0,  0,   // x
                        0,  c, -s,  0,   // y
                        0,  s,  c,  0,   // z
                        0,  0,  0,  0 ); // w
    }

    this.rotateY = function( amount )
    {
        var c = Math.cos( amount );
        var s = Math.sin( amount );

        this.setValues( c,  0,  s,  0,
                        0,  1,  0,  0,
                        -s, 0,  c,  0,
                        0,  0,  0,  0 );
    }

    this.rotateZ = function( amount )
    {
        var c = Math.cos( amount );
        var s = Math.sin( amount );

        this.setValues( c, -s,  0,  0,
                        s,  c,  0,  0,
                        0,  0,  1,  0,
                        0,  0,  0,  0 );
    }

    this.extractRotation = function()
    {
        var r = this.extractRotationFromMatrix(this);
        this.copy(r);

        return this;
    }

    this.extractRotationFromMatrix = function( m )
    {
        var result      = new SKYLINE.Matrix4();
        var scale       = new SKYLINE.Vector3();

        scale.getScaleFromMatrix(m);

        scale.x         = 1 / scale.x;
        scale.y         = 1 / scale.y;
        scale.z         = 1 / scale.z;

        var e           = m.entries;
        var r           = result.entries;

        r[0]            = e[0] * scale.x;
        r[1]            = e[1] * scale.x;
        r[2]            = e[2] * scale.x;

        r[3]            = e[3] * scale.y;
        r[4]            = e[4] * scale.y;
        r[5]            = e[5] * scale.y;

        r[6]            = e[6] * scale.z;
        r[7]            = e[7] * scale.z;
        r[8]            = e[8] * scale.z;

        result.entries  = r;

        return result;
    }

    /**
     * Takes a Euler angle as a vector then converts it into a Matrix.
     *
     * TODO: Test conversion from Euler angle to Matrix 4x4.
     */
    this.makeRotationFromEuler = function( v, order )
    {
        var e = this.entries;

        var cx = Math.cos( v.x );
        var cy = Math.cos( v.y );
        var cz = Math.cos( v.z );

        var sx = Math.sin( v.x );
        var sy = Math.sin( v.y );
        var sz = Math.sin( v.z );

        /*
         * TODO: Finish this Euler to Matrix conversion.
         */

        if( order === EULER_ORDER_XYZ || order === undefined )
        {
            /*
             * TODO: This has been optimised, testing needed.
             */

            var a = sy * sz;

            e[0]    = cy * cz;
            e[4]    = - cy * sz;
            e[8]    = sy;

            e[1]    = ( sx * sy * cz ) + ( cx * sz );
            e[5]    = ( -sx * /*sy * sz*/ a ) + ( cx * cz );
            e[9]    = - sx * cy;

            e[2]    = ( -cx * sy * cz ) + ( sx * sz );
            e[6]    = ( cx * /*sy * sz*/ a ) + ( sx * cz );
            e[10]   = cx * cy;
        }
        else if ( order === EULER_ORDER_YXZ )
        {
            e[0]    = cy * cz;
            e[4]    = ( -cy * sz * cx ) + ( sy * sx );
            e[8]    = ( cy * sz * sx ) + ( sy * cx );

            e[1]    = sz;
            e[5]    = cz * cx;
            e[9]    = -cz * sx;

            e[2]    = -sy * cz;
            e[6]    = ( sy * sz * cx ) + ( cy * sx );
            e[10]   = - ( sy * sz * sx ) + ( cy * cx );
        }
        else if ( order === EULER_ORDER_ZXY )
        {
            /*
             * TODO: Finish euler -> matrix conversion orders ZXY, ZYX, YZX, XZY.
             */

            console.error("[SKYLINE.Matrix4].makeRotationFromEuler - Conversion from EULER_ORDER_ZXY to Matrix4 is not implemented yet.");
        }
        else if ( order == EULER_ORDER_ZYX )
        {
            console.error("[SKYLINE.Matrix4].makeRotationFromEuler - Conversion from EULER_ORDER_ZYX to Matrix4 is not implemented yet.");
        }
        else if( order === EULER_ORDER_YZX )
        {
            console.error("[SKYLINE.Matrix4].makeRotationFromEuler - Conversion from EULER_ORDER_YZX to Matrix4 is not implemented yet.");
        }
        else if( order === EULER_ORDER_XZY )
        {
            console.error("[SKYLINE.Matrix4].makeRotationFromEuler - Conversion from EULER_ORDER_XZY to Matrix4 is not implemented yet.");
        }

        /*
         * Set the outer row and column to 0.
         */

        e[3]    = 0;
        e[7]    = 0;
        e[11]   = 0;
        e[12]   = 0;
        e[13]   = 0;
        e[14]   = 0;
        e[15]   = 0;
    }

    this.makeFromPositionRotationScale = function( pos, rot, eulerOrder, scale )
    {
        /*
         * This is used in SKYLINE.Object3D to calculate the transformation
         * matrix, before calculating the world matrix.
         */

        this.makeRotationFromEuler(rot, eulerOrder);
        this.applyTranslation( pos );
        this.applyScaleVector( scale );

        return this;
    }

    this.calculatePerspective = function( fov, aspect, near, far, smartAdjustment )
    {
        var r = SKYLINE.Math.Utils.degreesToRadians( fov );

        /*
         * This is used to fix the perspective when height is greater than width.
         *
         * NOTE: Aspect used here must calculate the aspect Ws/Hs in ViewPort
         * calculations. If these do not equal then there will be distortion.
         */
        if ( smartAdjustment && aspect < 1 )
        {
            r /= aspect;
        }

        var f       = 1 / Math.tan( SKYLINE.Math.Utils.degreesToRadians( r * 0.5 ) );

        /*var ymax    = near * Math.tan( SKYLINE.Math.Utils.degreesToRadians( r * 0.5 ) ); *//* TODO: Should this be "ymax = near * f" instead? Oha *//*
        var ymin    = -ymax;
        var xmax    = aspect * ymin;
        var xmin    = aspect * ymax;*/

                      //  width   height      near                         far
        this.setValues( f/aspect,   0,         0,                           0,
                            0,      f,         0,                           0,
                            0,      0,   near+far/(near-far), ( 2 * (near * far) ) / (near - far),
                            0,      0,        -1,                           0 );

        this.transpose();
    }

    /*
     * TODO: Test viewport matrix calculation. Also, does the viewport depth need
     * to be specified or will it always be 1?
     */
    this.calculateViewport = function( viewX, viewY, viewWidth, viewHeight )
    {
        var x = viewX;
        var y = viewY;
        var w = viewWidth;
        var h = viewHeight;
        var d = 1;

        var w2 = w/2;
        var h2 = h/2;

        this.setValues(
            w2,    0,     0,   (w2)+x,
            0,   -(h2),   0,   (h2)*y,
            0,     0,    d/2,    d/2,
            0,     0,     0,      1
        );

        this.transpose();
    }

    this.convertProjectionToFrustumMatrix = function( m )
    {
        /*
         * TODO: Implement projection to frustum matrix conversion.
         */

        console.error("[SKYLINE.Matrix4].convertProjectionToFrustumMatrix - NOT IMPLEMENTED YET.");
    }

    /**
     * copy( matrixToCopy )
     *
     * Copies over transformationMatrix data.
     */
    this.copy = function( matrix )
    {
        if( matrix instanceof SKYLINE.Matrix4 )
        {
            this.entries = matrix.entries;
        }
        else
        {
            console.error("[SKYLINE.Matrix4].copy - Requires an instance of a Matrix4 to be passed in.");
        }
    }

    /*
     * Uses this.matricesAreEqual to check if this matrix is equal to another specified matrix.
     */
    this.equals = function( matrix, lowerPrecision )
    {
        return this.matricesAreEqual( this, matrix, lowerPrecision );
    }

    this.matricesAreEqual = function( matrix1, matrix2, lowerPrecision )
    {
        /*
         * Check if lowerPrecision parameter has been passed in. If not, enable
         * lower precision as it is unlikely these matrices will be completely equal.
         */
        var lP          = (lowerPrecision !== undefined) ? lowerPrecision : true;

        /*
         * Boundary to check the matrix elements delta against.
         */
        var boundary    = (lP) ? 0.0001 : 0;

        var m1          = matrix1;
        var m2          = matrix2;

        if(m1.entries.length !== m2.entries.length)
        {
            console.error("[SKYLINE.Matrix4].matricesAreEqual - Trying to compare matrices of unequal length! Cannot proceed");

            return false;
        }

        for( var i = 0; i < m1.entries.length; ++i )
        {
            var delta = m1.entries[i] - m2.entries[i];

            if(delta > boundary)
            {
                return false;
            }
        }

        return true;
    }

    this.toString = function( transpose )
    {
        var shouldTranspose = (transpose === undefined) ? false : transpose;
        var tmp = this;

        if(shouldTranspose)
        {
            tmp.transpose();
        }

        var e = tmp.entries;

        console.log(" -----------------");
        console.log(" | " + e[0] + ", " + e[4] + ", " + e[8] + ", " + e[12] + " | ");
        console.log(" | " + e[1] + ", " + e[5] + ", " + e[9] + ", " + e[13] + " | ");
        console.log(" | " + e[2] + ", " + e[6] + ", " + e[10] + ", " + e[14] + " | ");
        console.log(" | " + e[3] + ", " + e[7] + ", " + e[11] + ", " + e[15] + " | ");
        console.log(" -----------------");
        console.log('                  ');
    }

    init( m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44, this );
}
