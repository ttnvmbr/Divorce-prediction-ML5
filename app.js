import { DecisionTree } from "./libraries/decisiontree.js"
import { VegaTree } from "./libraries/vegatree.js"

const csvFile = "./data/divorce_data.csv"
const testCsvFile = "./data/divorce_test_data.csv"
const trainingLabel = "Divorce"
let decisionTree
let predictionBox = document.getElementById("predictionBox");
predictionBox.style.display = "none"
let w = document.body.clientWidth -500
let h = 400

// inladen csv data
function loadData() {
    Papa.parse(csvFile, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: (results) => trainModel(results.data) // train het model met deze data
    })
}

//
// MACHINE LEARNING - Bouw de Decision Tree
//
function trainModel(data) {
    console.log(data)
    decisionTree = new DecisionTree({
        trainingSet: data,
        categoryAttr: trainingLabel
    })

    // Teken de boomstructuur - DOM element, breedte, hoogte, decision tree
    let visual = new VegaTree('#view', w, h, decisionTree.toJSON())
}
loadData()

function loadTestData(){
    Papa.parse(testCsvFile, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: (results) => testModel(results.data) // test het model met deze data
    })

}

// 10/10 goed voorspelt, dus de accuracy is 100%
function testModel(data){
    let i
    let total = data.length
    let correct = null
    for(i = 0; i < data.length; i++){
        const dataWithoutLabel = Object.assign({}, data[i])
        delete dataWithoutLabel.Divorce

        let predict = decisionTree.predict(dataWithoutLabel)

        if (predict == data[i].Divorce) {
            console.log("Deze voorspelling is goed gegaan!")
            correct += 1
        }else{
            console.log("Deze voorspelling is niet goed gegaan")
        }

        let accuracy = correct/total
        document.getElementById("accuracy").innerHTML = `The accuracy: ${correct} (correct amount) / ${total} (total tested amount)  = ${accuracy}`
    }

   
}
loadTestData()

//resultaten van de test
function showResult(){

    let q1 = document.getElementsByName('q1');
    let a1 = null;
    let q2 = document.getElementsByName('q2')
    let a2 = null
    let q3 = document.getElementsByName('q3')
    let a3 = null

    for (let i = 0, length = q1.length; i < length; i++) {
        if (q1[i].checked) {

            a1= q1[i].value;
            break;
        }
    }

    for (let i = 0, length = q2.length; i < length; i++) {
        if (q2[i].checked) {

            a2= q2[i].value;
            break;
        }
    }

    for (let i = 0, length = q3.length; i < length; i++) {
        if (q3[i].checked) {

            a3= q3[i].value;
            break;
        }
    }

    let predictionValues = {Q18:a1, Q26:a2, Q40:a3}
    let prediction = decisionTree.predict(predictionValues)
    console.log(prediction)
    if(!(a1 == null || a2 == null || a3 == null)){
    if(prediction == 1){
        document.getElementById("prediction").innerHTML = "you're happily married!"
        predictionBox.style.display = "block"
        document.getElementById('predictionBox').scrollIntoView()
    } else if(prediction == 0){
        document.getElementById("prediction").innerHTML = "you're divorced or will be"
        predictionBox.style.display = "block"
        document.getElementById('predictionBox').scrollIntoView()
    }else{
        document.getElementById("prediction").innerHTML = ""
        predictionBox.style.display = "none"
    }
    }
}
document.querySelector('button').addEventListener('click', showResult);
