/**
 *
 * @project skyline
 * @author Harry
 * @time 17:48 22/04/2013
 *
 */

SKYLINE.Matrix3 = function( m11, m12, m13, m21, m22, m23, m31, m32, m33 )
{
    this.entries = [];

    function init(  m11, m12, m13, m21, m22, m23, m31, m32, m33, scope )
    {
        if( m11 instanceof SKYLINE.Matrix4 )
        {
            scope.createFromMatrix4( m11 );
        }
        else if ( m11 instanceof SKYLINE.Matrix3 )
        {
            var m11 = m11.entries;

            scope.setValues( m11[0], m11[1], m11[2], m11[3], m11[4], m11[5], m11[6], m11[7], m11[8] );
            scope.transpose();
        }
        else if( m11 !== undefined && typeof m11 == 'number' )
        {
            scope.setValues(  m11, m12, m13, m21, m22, m23, m31, m32, m33 );
        }
        else
        {
            scope.setValues( 0, 0, 0, 0, 0, 0, 0, 0, 0 );
        }
    }

    /*
     * Sets value in the transformationMatrix, by columns.
     */
    this.setValues = function(  m11, m12, m13, m21, m22, m23, m31, m32, m33 )
    {
        var e = this.entries;

        e[0] = m11; e[1] = m21; e[2] = m31;
        e[3] = m12; e[4] = m22; e[5] = m32;
        e[6] = m13; e[7] = m23; e[8] = m33;

        this.entries = e;
    }

    /*
     * Creates a 3x3 transformationMatrix from a 4x4 transformationMatrix.
     */
    this.createFromMatrix4 = function( m4x4 )
    {
        m4x4.transpose(); // flip it back to rows.

        var e = m4x4.entries;

        this.setValues( e[0], e[1], e[2], e[4], e[5], e[6], e[8], e[9], e[10] );
    }

    this.identity = function()
    {
        this.setValues( 1, 0, 0,
                        0, 1, 0,
                        0, 0, 1 );

        return this;
    }

    this.multiply = function( m )
    {
        this.entries = this.multiplyMatrix( m, this ).entries;
        return this;
    }

    this.multiplyMatrix = function( m1, m2 )
    {
        var a           = m1.entries;
        var b           = m2.entries;

        var result      = new SKYLINE.Matrix3();
        var elements    = result.entries;

        var a11         = a[0],     a12 = a[1],     a13 = a[2];
        var a21         = a[3],     a22 = a[4],     a23 = a[5];
        var a31         = a[6],     a32 = a[7],     a33 = a[8];

        var b11         = b[0],     b12 = b[1],     b13 = b[2];
        var b21         = b[3],     b22 = b[4],     b23 = b[5];
        var b31         = b[6],     b32 = b[7],     b33 = b[8];

        elements[0]     = (a11 * b11) + (a12 * b21) + (a13 * b31);
        elements[3]     = (a11 * b12) + (a12 * b22) + (a13 * b32);
        elements[6]     = (a11 * b13) + (a12 * b23) + (a13 * b33);

        elements[1]     = (a21 * b11) + (a22 * b21) + (a23 * b31);
        elements[4]     = (a21 * b12) + (a22 * b22) + (a23 * b32);
        elements[7]     = (a21 * b13) + (a22 * b23) + (a23 * b33);

        elements[2]     = (a31 * b11) + (a32 * b21) + (a33 * b31);
        elements[5]     = (a31 * b12) + (a32 * b22) + (a33 * b32);
        elements[8]     = (a31 * b13) + (a32 * b23) + (a33 * b33);

        result.entries  = elements;

        return result;
    }

    this.scale = function( scalar )
    {
        this.scaleMatrix( this, scalar );
    }

    this.scaleMatrix = function( matrix, scalar )
    {
        var m           = matrix.entries;

        m[0]            *= scalar;
        m[1]            *= scalar;
        m[2]            *= scalar;
        m[3]            *= scalar;
        m[4]            *= scalar;
        m[5]            *= scalar;
        m[6]            *= scalar;
        m[7]            *= scalar;
        m[8]            *= scalar;

        matrix.entries = m;
    }

    this.transpose = function()
    {
        var e   = this.entries;
        var tmp = [];

        tmp[0] = e[0]; tmp[1] = e[3]; tmp[2] = e[6];
        tmp[3] = e[1]; tmp[4] = e[4]; tmp[5] = e[7];
        tmp[6] = e[2]; tmp[7] = e[5]; tmp[8] = e[8];

        this.entries = tmp;
    }

    this.determinate = function()
    {
        var tmp = this.entries;

        var m11 = tmp[0], m12 = tmp[1], m13 = tmp[2];
        var m21 = tmp[3], m22 = tmp[4], m23 = tmp[5];
        var m31 = tmp[6], m32 = tmp[7], m33 = tmp[8];

        var a = [ m21, m22, m31, m32 ];
        var b = [ m21, m23, m31, m33 ];
        var c = [ m22, m23, m32, m33 ];

        var minors = [ a, b, c ];
        var minorsDeterminate = [ ];

        for( var i = 0; i < 3; ++i )
        {
            minorsDeterminate.push(this.calculate2x2Determinate( minors[i] ));
        }

        /* Times the minors determinate by the cofactors to get the overall 3x3 determinate */
        return ( m11 * minorsDeterminate[2] ) - ( m12 * minorsDeterminate[1] ) + ( m13 * minorsDeterminate[0] );
    }

    this.calculate2x2Determinate = function( m11, m12, m21, m22 )
    {
        if( Object.prototype.toString.call( m11 ) === '[object Array]' ) {
            var tmp = m11;

            var m11 = tmp[0], m12 = tmp[1];
            var m21 = tmp[2], m22 = tmp[3];
        }

        return ( m11 * m22 - m21 * m12 );
    }

    this.copy = function( m )
    {
        if(m instanceof SKYLINE.Matrix3)
        {
            this.entries = m.entries;
        }
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

        console.log(" -------------");
        console.log(" | " + e[0] + ", " + e[3] + ", " + e[6] + " | ");
        console.log(" | " + e[1] + ", " + e[4] + ", " + e[7] + " | ");
        console.log(" | " + e[2] + ", " + e[5] + ", " + e[8] + " | ");
        console.log(" -------------");
        console.log('              ');
    }

    init( m11, m12, m13, m21, m22, m23, m31, m32, m33, this );
}