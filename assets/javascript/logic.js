 // Your web app's Firebase configuration from my own firebase
 var firebaseConfig = {
    apiKey: "AIzaSyCJE8iEf402O4U_XZvUdlAmJ0MzE-_3tCM",
    authDomain: "extension-training-96f1f.firebaseapp.com",
    databaseURL: "https://extension-training-96f1f.firebaseio.com",
    projectId: "extension-training-96f1f",
    storageBucket: "",
    messagingSenderId: "132611352734",
    appId: "1:132611352734:web:3aeb24cc5ef3cb06"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  var trainData = firebase.database();
  

  // added a button for adding trains
  $("#add-train-btn").on("click", function(event) {
    // stop it from returning to the default input
    event.preventDefault();
  
    // each topic has an interactive input option addressing the corresponding html id
    var trainName = $("#train-name")
      .val()
      .trim();
    var destination = $("#destination-input")
      .val()
      .trim();
    var firstTrain = $("#first-train")
      .val()
      .trim();
    var frequency = $("#frequency-input")
      .val()
      .trim();
  
    // Creates local "temporary" object for holding train data 
    var newTrain = {
      name: trainName,
      destination: destination,
      firstTrain: firstTrain,
      frequency: frequency
    };
  
    // Uploads all of the new and specific train data to the database in firebase we made earlier
    trainData.ref().push(newTrain);
  
    // Alert
    alert("Train schedule successfully tracked.");
  
    // Clears all of the text-boxes after your input
    $("#train-name").val("");
    $("#destination-input").val("");
    $("#first-train").val("");
    $("#frequency-input").val("");
  });
  
  // make a Firebase event for adding trains to the database and a row in the html when a user adds a train
  trainData.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
  
    // put everything into a new variable with the snapshot from the database
    // and set it to a function including the object inside the newTrain variable
    var tName = childSnapshot.val().name;
    var tDestination = childSnapshot.val().destination;
    var tFrequency = childSnapshot.val().frequency;
    var tFirstTrain = childSnapshot.val().firstTrain;
    // this is to make the user input readable for us
    var timeArr = tFirstTrain.split(":");
    var trainTime = moment()
    // this tells the variable exactly where each value is placed so it knows how to display
      .hours(timeArr[0])
      .minutes(timeArr[1]);
    var maxMoment = moment.max(moment(), trainTime);
    var tMinutes;
    var tArrival;
  
    // If the first train is later than the current time, we send the data to the first train time
    if (maxMoment === trainTime) {
      tArrival = trainTime.format("hh:mm A");
      tMinutes = trainTime.diff(moment(), "minutes");
    } else {
      // To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain time
      // and find the modulus between the difference and the frequency.
      var differenceTimes = moment().diff(trainTime, "minutes");
      var tRemainder = differenceTimes % tFrequency;
      tMinutes = tFrequency - tRemainder;
      // To calculate the arrival time, add the tMinutes to the current time
      tArrival = moment()
        .add(tMinutes, "m")
        .format("hh:mm A");
    }
    console.log("tMinutes:", tMinutes);
    console.log("tArrival:", tArrival);
  
    // put each train's data into the table on the html
    $("#train-table > tbody").append(
      $("<tr>").append(
        $("<td>").text(tName),
        $("<td>").text(tDestination),
        $("<td>").text(tFrequency),
        $("<td>").text(tArrival),
        $("<td>").text(tMinutes)
      )
    );
  });
