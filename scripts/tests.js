

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
            expect(GameInstance.matrixToCoords([[1]])).to.deep.equal([[0,0]])
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
describe("match",function() {
    describe("Base cases",function(){
        it("Finding element in single element list",function(){
            assert.equal(GameInstance.match([0,0],[[0,0]]),0)
        })
        it("finds string equivalent in single element list",function(){
            assert.equal(GameInstance.match([0,0],[["0","0"]]),0)
        })
        it("returns -1 on an empty list",function(){
            assert.equal(GameInstance.match([0,0],[]),-1)
        })
    })
})
describe("Game Instance methods",function(){
    describe("step",function(){
        it("A single cell disappears",function(){
            let testInstance = new GameInstance([[0,0]],ctx)
            testInstance.step()
            expect(testInstance.state).to.deep.equal([])
            delete testInstance
        })
        it("a 2x2 block gives unchanging",function(){
            let testInstance = new GameInstance([[0,0],[1,0],[0,1],[1,1]],ctx)
            testInstance.step()
            expect(testInstance.state).to.deep.equal([[0,0],[0,1],[1,0],[1,1]])
            delete testInstance
        })
        it("3 blocks reduce to one",function(){
            let testInstance = new GameInstance([[0,0],[1,1],[-1,2]],ctx)
            testInstance.step()
            expect(testInstance.state).to.deep.equal([[0,1]])
            delete testInstance
        })
    })
})