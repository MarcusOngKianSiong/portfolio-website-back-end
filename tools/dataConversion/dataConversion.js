module.exports = {
    objectValuesToString: (object,separator=' ')=> {
        let string = ''
        for(const value of Object.values(object)){
            string+="'"+value+"'"+separator
        }
        
        return string.slice(0,-1);
    }
    
}

