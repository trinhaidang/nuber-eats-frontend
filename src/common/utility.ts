

export function capitalizeFirstLetter(str: String) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function capitalizeAllWords( str?: String )
{
    if(str) {
        var pieces = str.split(" ");
        for ( var i = 0; i < pieces.length; i++ )
        {
            var j = pieces[i].charAt(0).toUpperCase();
            pieces[i] = j + pieces[i].substr(1);
        }
        return pieces.join(" ");
    }
}

// String.prototype.capitalize = function() {
//     return this.charAt(0).toUpperCase() + this.slice(1);
// }