/**
 * Concatenates the values of a variable into an easily readable string
 * @param {Object} obj The variable to debug
 * @param {Number} max The maximum number of recursions allowed (keep low, around 5 for HTML elements to prevent errors) [default: 10]
 * @param {String} sep The separator to use between [default: a single space ' ']
 * @param {Number} level The current level deep (amount of recursion). Do not use this parameter: it's for the function's own use
 */
export default function print_r( obj, max, sep, level ) {
    level = level || 0;
    max = max || 10;
    sep = sep || ' ';

    if( level > max ) return "[WARNING: Too much recursion]\n";

    var i, result = '', tab = '', t = typeof obj;

    if( obj === null ) {
        result += "(null)\n";
    } else if( t == 'object' ) {
        level++;

        for( i = 0; i < level; i++ ) { tab += sep; }
        if( obj && obj.length ) { t = 'array'; }

        result += '(' + t + ") :\n";
        for( i in obj ) {
            try {
                result += tab + '[' + i + '] : ' + print_r( obj[i], max, sep, (level + 1) );
            } catch( error ) {
                return "[ERROR: " + error + "]\n";
            }
        }
    } else {
        if( t == 'string' ) {
            if( obj == '' )    obj = '(empty)';
        }
        result += '(' + t + ') ' + obj + "\n";
    }
    return result;
};
