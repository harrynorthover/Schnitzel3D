function matrix4Equals(m1, m2)
{
    var boundary = 0.0001;

    if(m1.entries.length !== m2.entries.length)
    {
        return;
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

function matrix3Equals(m1, m2)
{
    var boundary = 0.0001;

    if(m1.entries.length !== m2.entries.length)
    {
        return;
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