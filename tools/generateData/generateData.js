const chance = require('chance')

module.exports = {
    objectName: "generateData",
    // REMEMBER TO CHANGE THE METHOD NAME!!!!
    generateRandomString: function(arr=['apple', 'banana', 'cherry', 'orange', 'pear']){
    // REMEMBER TO ADD objectName variable INSIDE THE OBJECT!!!
        //recording.recordObjectMethodExecution(arguments.callee.name,path.basename(__filename),path.dirname(__filename),this.objectName)
        
        const randomIndex = Math.floor(Math.random() * arr.length);
        const randomWord = arr[randomIndex];
        return randomWord; 
    }
}


