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
  }

  