module( "SKYLINE.Matrix4" );

test( "constructor",
    function() {
	var m1 = new SKYLINE.Matrix4(0, 1, 2, 3, 
								 4, 5, 6, 7, 
								 8, 9, 10, 11, 
								 12, 13, 14, 15);
	var m2 = new SKYLINE.Matrix4([0, 1, 2, 3, 
								 4, 5, 6, 7, 
								 8, 9, 10, 11, 
								 12, 13, 14, 15]);
	var e = m1.entries;
	var e2 = m2.entries;

	ok( e[0] == 0 );
	ok( e[1] == 4 );
	ok( e[2] == 8 );
	ok( e[3] == 12 );

	ok( e[4] == 1 );
	ok( e[5] == 5 );
	ok( e[6] == 9 );
	ok( e[7] == 13 );

	ok( e[8] == 2 );
	ok( e[9] == 6 );
	ok( e[10] == 10 );
	ok( e[11] == 14 );

	ok( e[12] == 3 );
	ok( e[13] == 7 );
	ok( e[14] == 11 );
	ok( e[15] == 15 );

	ok( e2[0] == 0 );
	ok( e2[1] == 4 );
	ok( e2[2] == 8 );
	ok( e2[3] == 12 );

	ok( e2[4] == 1 );
	ok( e2[5] == 5 );
	ok( e2[6] == 9 );
	ok( e2[7] == 13 );

	ok( e2[8] == 2 );
	ok( e2[9] == 6 );
	ok( e2[10] == 10 );
	ok( e2[11] == 14 );

	ok( e2[12] == 3 );
	ok( e2[13] == 7 );
	ok( e2[14] == 11 );
	ok( e2[15] == 15 );
});

test( "setValues",
    function() {
	var m1 = new SKYLINE.Matrix4();

	m1.setValues(0, 1, 2, 3, 
				 4, 5, 6, 7, 
				 8, 9, 10, 11, 
				 12, 13, 14, 15);

	var e = m1.entries;

	ok( e[0] == 0 );
	ok( e[1] == 4 );
	ok( e[2] == 8 );
	ok( e[3] == 12 );

	ok( e[4] == 1 );
	ok( e[5] == 5 );
	ok( e[6] == 9 );
	ok( e[7] == 13 );

	ok( e[8] == 2 );
	ok( e[9] == 6 );
	ok( e[10] == 10 );
	ok( e[11] == 14 );

	ok( e[12] == 3 );
	ok( e[13] == 7 );
	ok( e[14] == 11 );
	ok( e[15] == 15 );
});

test( "multiplication",
    function() {
	var m1 = new SKYLINE.Matrix4(3,2,2,2,2,3,2,2,2,2,3,2,2,2,2,3);
	var m2 = new SKYLINE.Matrix4(5,5,5,5,5,5,5,5,6,6,6,6,7,7,7,7);

	/* 
	 * Used http://ncalculators.com/transformationMatrix/4x4-transformationMatrix-multiplication-calculator.htm
	 * to calculate the result, therefore this transformationMatrix needs to be transposed before
	 * checking 
	 */
	var result = new SKYLINE.Matrix4( 51, 51, 51, 51, 51, 51, 51, 51, 52, 52, 52, 52, 53, 53, 53, 53 );

	m1.multiply(m2);
	result.transpose();

	ok( matrix4Equals(m1, result), "Passed!" );
});

test( "copy",
    function() {
	var m1 = new SKYLINE.Matrix4( 3,2,2,2,2,3,2,2,2,2,3,2,2,2,2,3 );
	var m2 = new SKYLINE.Matrix4();
	m2.copy(m1);

	ok( matrix4Equals(m1, m2), "Passed!" );
});

test( "inverse",
    function() {
	var m1 = new SKYLINE.Matrix4( 5, 5, -5, 5, 5, -20, 5, 5, 6, 6, 6, -4, 7, 7, 45, 7 );
	var result = new SKYLINE.Matrix4( 3650/65000,1900/65000, -1750/65000, 5700/65000, 2600/65000, -2600/65000,0,1140/65000, 6500/65000,0,0,-6500/65000, -750/65000,500/65000,1250/65000,1500/65000 );
	
	/*
	 * Used http://ncalculators.com/transformationMatrix/4x4-inverse-transformationMatrix-calculator.htm
	 */

	m1.getInverse();
	result.transpose();

	ok( matrix4Equals(m1, result), "Passed!" );
});

test( "determinate",
    function() {
	var m1 = new SKYLINE.Matrix4( 5, 5, -5, 5, 5, -20, 5, 5, 6, 6, 6, -4, 7, 7, 45, 7 );
	var d1 = m1.determinate();

	var m2 = new SKYLINE.Matrix4( 1, 2, 3, 4, 5, 6, 7, 8, 9, 6, 4, 7, 7, 4, 45, 6 );
	var d2 = m2.determinate();

	/*
	 * Used http://ncalculators.com/transformationMatrix/4x4-transformationMatrix-determinant-calculator.htm
	 */

	ok( d1 == -65000 );
	ok( d2 == 1200 );
});

test( "scale",
    function() {
	var m1 = new SKYLINE.Matrix4( 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2 );
	var result = new SKYLINE.Matrix4( 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4 );

	m1.scale(2);

	ok( matrix4Equals(m1, result), "Passed!" );
});