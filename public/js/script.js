document.getElementById('calculate-btn').addEventListener('click', function() {
    // Get the input values
    var whblu = parseInt(document.getElementById('whb-lu').innerHTML);
    var sinkslu = parseInt(document.getElementById('sinks-lu').innerHTML);
    var ndslu = parseInt(document.getElementById('nds-lu').innerHTML);
    var showerslu = parseInt(document.getElementById('showers-lu').innerHTML);
    var bathslu = parseInt(document.getElementById('baths-lu').innerHTML);
    var bidetslu = parseInt(document.getElementById('bidets-lu').innerHTML);
    var wmlu = parseInt(document.getElementById('wm-lu').innerHTML);
    var dwlu = parseInt(document.getElementById('dw-lu').innerHTML);
  
    var washHandBasins = parseInt(document.getElementById('wash-hand-basins').value)*whblu || 0;
    var sinks = parseInt(document.getElementById('sinks').value)*sinkslu || 0;
    var nonDomesticSink = parseInt(document.getElementById('non-domestic-sink').value)*ndslu || 0;
    var showers = parseInt(document.getElementById('showers').value)*showerslu || 0;
    var baths = parseInt(document.getElementById('baths').value)*bathslu || 0;
    var bidets = parseInt(document.getElementById('bidets').value)*bidetslu || 0;
    var washingMachine = parseInt(document.getElementById('washing-machine').value)*wmlu || 0;
    var dishWashers = parseInt(document.getElementById('dish-washers').value)*dwlu || 0;
  
// Calculate the total
var total = washHandBasins + sinks + nonDomesticSink + showers + baths + bidets + washingMachine + dishWashers;
// alert(washHandBasins +", " + sinks +", " + nonDomesticSink +", " + showers +", " + baths +", " + bidets +", " + washingMachine +", " + dishWashers)
// Display the result
// alert("Total = " + total);
document.querySelector('.total-loading-units').textContent = total;

// Calculate the diversified flow
var divFlow = calculateFlow(total);

// Display the divFlow result
document.querySelector('.output-box').textContent = divFlow.toFixed(2) + " l/m";
});



function calculateFlow(totalFlow) {
  
  var selectedStandard = document.querySelector('input[name="standard"]:checked').id;
  var selectedUsage = document.querySelector('input[name="usage"]:checked').id;
  var selectedBuildingType = document.getElementById('building-type').value;  
  var divFlow
  // alert(selectedStandard);
  if (totalFlow <= 0) {
    console.log("DivFlow is 0");
    divFlow = 0;
  } else if (selectedStandard === "bs6700") {
    console.log("BS 6700 Calculation");
    divFlow = calc6700((totalFlow / 10) * 60) * 60;
  } else if (selectedStandard === "bs806") {
    console.log("BS 806 Calculation");
    divFlow = calc806((totalFlow / 10) * 60) * 60;
  } else {
    console.log("DIN 1988-3 Calculation");
    divFlow = DIN_1988_3Calc(selectedBuildingType, (totalFlow / 10) * 60) * 60;
  }
  console.log("Diversified Flow: " + divFlow);
  return divFlow;
}


function DIN_1988_3Calc(buildingType, totalFlow) {
    // Calculated diversified flow rate a function of total flow rate and factors due to building type
    // Flow rates need to be in litres per second, take values in at l/m
    var a, b, c, divFlow;
  
    // Set in-coming l/m to l/s
    totalFlow = totalFlow / 60;
  
    // Lookup object for building types and their corresponding values
    var buildingTypeValues = {
      "Administration Building": { a: 0.91, b: 0.31, c: 0.38 },
      "Hospital": { a: 0.75, b: 0.44, c: 0.18 },
      "Hotel": { a: 0.7, b: 0.48, c: 0.13 },
      "Leisure centre": { a: 0.91, b: 0.31, c: 0.38 },
      "Nursing home": { a: 1.4, b: 0.14, c: 0.92 },
      "Old peoples residence": { a: 1.48, b: 0.19, c: 0.94 },
      "Residential building": { a: 1.48, b: 0.19, c: 0.94 },
      "School": { a: 0.91, b: 0.31, c: 0.38 }
    };
  
    // Check if the building type exists in the lookup object
    if (buildingType in buildingTypeValues) {
      // Retrieve the values of a, b, and c from the lookup object
      var values = buildingTypeValues[buildingType];
      a = values.a;
      b = values.b;
      c = values.c;
    } else {
      // Building type not found, handle the error or set default values
      // For example:
      // throw new Error("Invalid building type");
      // or
      // a = 1.0; b = 0.5; c = 0.2; // Default values
    }
  
    // Calculate diversified flow rate, Vs = a * (SUMofVR^b) - c
    return a * (Math.pow(totalFlow, b)) - c;
    console.log("DIN_1988_3Calc is" + a * (Math.pow(totalFlow, b)) - c);
  }

function calc806(totalFlow) {
  // Calculate the diversified flow rate in l/s using 806 and loading units
  // Flow rates need to be in litres per second, take values in at l/m

  // Convert to loading units
  var lus = (totalFlow / 60) * 10;

  // Calculate the diversified flow rate based on the number of loading units
  var calc806;
  if (lus < 300) {
    calc806 = 0.2671 * Math.pow(lus, 0.314);
  } else {
    calc806 = 0.0505 * Math.pow(lus, 0.6089);
  }
  return calc806;
  console.log("Calc806 is" + calc806);
}

function calc6700(totalFlow) {
  // Calculate the diversified flow rate in l/s using 6700 and loading units
  // Flow rates need to be in litres per second, take values in at l/m

  // Convert to loading units
  var lus = (totalFlow / 60) * 10;

  // Calculate the diversified flow rate based on the number of loading units
  var calc6700;
  if (lus < 130) {
    calc6700 = 0.00002 * Math.pow(lus, 2) + 0.013 * lus + 0.1794;
  } else {
    calc6700 = 0.0424 * Math.pow(lus, 0.7347);
  }
  return calc6700;
  console.log("Calc6700 is" + calc6700);
}



// Get the usage radio buttons
const usageRadios = document.getElementsByName('usage');

// Add event listeners to the radio buttons
usageRadios.forEach(radio => {
  radio.addEventListener('change', updateLabels);
});

// Function to update the labels based on the selected radio button
function updateLabels() {
  // Get the selected radio button's value
  const selectedUsage = document.querySelector('input[name="usage"]:checked').id;
  // alert(selectedUsage)

  // Get the corresponding LU values from the JSON data
  const luData = {
    "low": {
      "whb-lu": 1,
      "sinks-lu": 2,
      "nds-lu": 8,
      "showers-lu": 2,
      "baths-lu": 4,
      "bidets-lu": 1,
      "wm-lu": 2,
      "dw-lu": 2
    },
    "medium": {
      // Add key-value pairs for the 'Medium' collection here
      "whb-lu": 2,
      "sinks-lu": 5,
      "nds-lu": 8,
      "showers-lu": 3,
      "baths-lu": 8,
      "bidets-lu": 1,
      "wm-lu": 2,
      "dw-lu": 2
    },
    "high": {
      // Add key-value pairs for the 'High' collection here
      "whb-lu": 4,
      "sinks-lu": 10,
      "nds-lu": 8,
      "showers-lu": 6,
      "baths-lu": 16,
      "bidets-lu": 1,
      "wm-lu": 2,
      "dw-lu": 2
    }
  };

  // alert(selectedUsage)

  // alert(luData[selectedUsage])

  // Update the labels' text based on the selected usage
  // Update the labels' text based on the selected usage
document.getElementById('whb-lu').textContent = luData[selectedUsage]["whb-lu"];
document.getElementById('sinks-lu').textContent = luData[selectedUsage]["sinks-lu"];
document.getElementById('nds-lu').textContent = luData[selectedUsage]["nds-lu"];
document.getElementById('showers-lu').textContent = luData[selectedUsage]["showers-lu"];
document.getElementById('baths-lu').textContent = luData[selectedUsage]["baths-lu"];
document.getElementById('bidets-lu').textContent = luData[selectedUsage]["bidets-lu"];
document.getElementById('wm-lu').textContent = luData[selectedUsage]["wm-lu"];
document.getElementById('dw-lu').textContent = luData[selectedUsage]["dw-lu"];

// Return the updated labels (optional)
return luData[selectedUsage];
  
}

// Call the function initially to set the initial labels
updateLabels();


  