module.exports = {
    objectValuesToString: (object,separator=' ')=> {
        let string = ''
        for(const value of Object.values(object)){
            string+="'"+value+"'"+separator
        }
        
        return string.slice(0,-1);
    },
    replaceLastFourCharacters(inputString, replacement) {
        if (inputString.length < 4) {
          // If the input string has less than four characters, return the original string
          return inputString;
        } else {
          // Create a new string by removing the last four characters and adding the replacement
          const modifiedString = inputString.slice(0, -4) + replacement;
          return modifiedString;
        }
      }
}

