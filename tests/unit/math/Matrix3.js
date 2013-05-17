/**
 * @project: skyline
 * @author: harry.northover
 * @time: 20:43 26/04/2013
 */

module( "SKYLINE.Matrix3" );

test( "constructor",
    function() {
        var m1 = new SKYLINE.Matrix3(0, 1, 2,
                                     4, 5, 6,
                                     8, 9, 10);

        var m2 = new SKYLINE.Matrix3([0, 1, 2,
                                      4, 5, 6,
                                      8, 9, 10]);

        var e = m1.entries;
        var e2 = m2.entries;

        ok( e[0] == 0 );
        ok( e[1] == 4 );
        ok( e[2] == 8 );
        ok( e[3] == 1 );
        ok( e[4] == 5 );
        ok( e[5] == 9 );
        ok( e[6] == 2 );
        ok( e[7] == 6 );
        ok( e[8] == 10 );

        ok( e[0] == 0 );
        ok( e[1] == 4 );
        ok( e[2] == 8 );
        ok( e[3] == 1 );
        ok( e[4] == 5 );
        ok( e[5] == 9 );
        ok( e[6] == 2 );
        ok( e[7] == 6 );
        ok( e[8] == 10 );

    });

test( "setValues",
    function() {
        var m1 = new SKYLINE.Matrix3();

        m1.setValues(0,1,2,
                     3,4,5,
                     6,7,8);

        var e = m1.entries;

        ok( e[0] == 0 );
        ok( e[1] == 3 );
        ok( e[2] == 6 );

        ok( e[3] == 1 );
        ok( e[4] == 4 );
        ok( e[5] == 7 );

        ok( e[6] == 2 );
        ok( e[7] == 5 );
        ok( e[8] == 8 );
    });

test( "multiplication",
    function() {
        var m1 = new SKYLINE.Matrix3(3, 2, 2, 2, 2 ,3, 2, 2, 2);
        var m2 = new SKYLINE.Matrix3(5, 5, 5, 5, 5, 5, 5, 5, 6);

        /*
         * Used http://ncalculators.com/transformationMatrix/4x4-transformationMatrix-multiplication-calculator.htm
         * to calculate the result, therefore this transformationMatrix needs to be transposed before
         * checking
         */
        var result = new SKYLINE.Matrix3( 35, 35, 37,
                                          35, 35, 38,
                                          30, 30, 32 );

        result.transpose();

        m1.multiply(m2);

        result.toString();
        m1.toString();

        ok( matrix3Equals(m1, result), "Passed!" );
    });

test( "copy",
    function() {
        var m1      = new SKYLINE.Matrix3( 3,2,2, 2,2,3, 2,2,2 );
        var m2      = new SKYLINE.Matrix3();

        m2.copy(m1);

        ok( matrix3Equals(m1, m2), "Passed!" );
    });

test( "determinate",
    function() {
        var m1 = new SKYLINE.Matrix3( 5, 5, -5, 5, 5, -20, 5, 5, 6 );
        var d1 = m1.determinate();

        var m2 = new SKYLINE.Matrix3( -10, 2, 3, 4, 5, 6, 7, 8, 9 );
        var d2 = m2.determinate();

        /*
         * Used http://ncalculators.com/transformationMatrix/transformationMatrix-determinant-calculator.htm
         */

        ok( d1 == 0 );
        ok( d2 == 33 );
    });

test( "scale",
    function() {
        var m1      = new SKYLINE.Matrix3( 2, 2, 2, 2, 2, 2, 2, 2, 2 );
        var result  = new SKYLINE.Matrix3( 4, 4, 4, 4, 4, 4, 4, 4, 4 );

        m1.scale(2);

        ok( matrix3Equals(m1, result), "Passed!" );
    });