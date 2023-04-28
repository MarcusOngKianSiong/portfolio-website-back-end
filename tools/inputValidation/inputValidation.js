module.exports = {
    validateDataType: (expected,data)=>{

        const availableDataTypes = ["string", "number", "boolean", "undefined", null, "symbol", "object", "function","bigint","array"];

        if (!availableDataTypes.includes(expected)) {
            throw new Error(`expected datatype (${expected}) does not exist...`);
        }

        if(expected === null){
            if(data === null){
                return true
            }else{
                throw new Error(`actual dataType (null) does not match with expected (${typeof data})`);      
            }
        }

        if(expected === "array"){
            if(Array.isArray(data)){
                return true
            }else{
                throw new Error(`actual dataType (array) does not match with expected (${typeof data})`);      
            }
        }

        
        
        if (typeof data !== expected) {
          throw new Error(`actual dataType (${typeof data}) does not match with expected (${expected})`);
        }
        
        

        return true;
      
          
    },
    validateObject: (obj,supposedKeys)=>{
        if(obj){
            supposedKeys.forEach(key=>{
                if(obj.hasOwnProperty(key) === false){
                    throw new Error(`ValidateOject function: Key (${key}) does not exist in object`)
                }
            })
            return true;
        }else{
            throw new Error('ValidateObject: Input obj is empty')
        }
    }
    
}