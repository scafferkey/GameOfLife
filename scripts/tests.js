

function compareArrays(array1,array2){
    if(array1.length != array2.length){
        return false
    }
    for(let i = 0; i < array1.length; i++){
        if(Array.isArray(array1) && Array.isArray(array2)){
            if(!(compareArrays(array1[i],array2[i]))){
                return false;
            }
        }else if(typeof(array1[i]) != typeof(array2[i])){
            return false;
        }else if(array1[i] != array2[i]){
            return false;
        }
    }
    return true
}

describe("matrixToCoords",function(){
    describe("Base cases:",function(){
        it("1x1 matrix, full",function(){
            assert(compareArrays(GameInstance.matrixToCoords([[1]]),[[0,0]]))
        })
        it("1x1 matrix, empty",function(){
            assert(compareArrays(GameInstance.matrixToCoords([[0]]),[]))
        })
        for(let i = 2; i <= 20; i++){
            let emptyMatrix = []
            let line = [];
            for(let j = 1; j <= i; j++){
                line.push(0)
            }
            for(let j = 1; j <= i; j++){
                emptyMatrix.push(line)
            }
        it(`${i}x${i} matrix, empty`, function(){
            assert(compareArrays(GameInstance.matrixToCoords(emptyMatrix),[]))
        }
        
        )}
    })
    describe("Error Cases",function(){
        it("fed an uneven matrix")
        it("fed a matrix not containing 1/0")
        it("called on a list that's too shallow")
        it("called on a list that's too deep")
    })
})