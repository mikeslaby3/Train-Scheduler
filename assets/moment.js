$(document).ready(function() {

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCBzFxrhf3XAwPrfRmsxUiZIxr_EC6xa2s",
    authDomain: "train-scheduler-481a9.firebaseapp.com",
    databaseURL: "https://train-scheduler-481a9.firebaseio.com",
    projectId: "train-scheduler-481a9",
    storageBucket: "train-scheduler-481a9.appspot.com",
    messagingSenderId: "540019943049"
  };
  firebase.initializeApp(config);

  const database = firebase.database();

  let name = '';
  let destination = '';
  let firstTrain = '';
  let frequency = ''; 
  var minutesAway = '';
  var nextArrival = '';

  $('#submit').on('click', function(event) {
    event.preventDefault();

    name = $('#name-input').val().trim();
    destination = $('#destination-input').val().trim();
    firstTrain = $('#first-train-input').val().trim();
    frequency = $('#frequency-input').val().trim();

    database.ref().push({
      name: name,
      destination: destination,
      firstTrain: firstTrain,
      frequency: frequency
    });

  });
  
  function clearInputData() {
    $('#name-input').val('');
    $('#destination-input').val('');
    $('#first-train-input').val('');
    $('#frequency-input').val('');
  }

  function childAdded(childSnapshot) {

    let ftm = moment(childSnapshot.val().firstTrain, 'HH:mm');
    let ctm = moment();
    var minutes = moment.duration(ctm.diff(ftm));
    var minutesDiff = Math.floor(minutes.asMinutes())
    var timeSinceLast = minutesDiff % childSnapshot.val().frequency;
    minutesAway = childSnapshot.val().frequency - timeSinceLast;
    nextArrival = moment().add(minutesAway, 'minutes').format('HH:mm');
    
    var tRow = $('<tr>');

    var nameTd = $('<td>').text(childSnapshot.val().name);
    var destinationTd = $('<td>').text(childSnapshot.val().destination);
    var frequencyTd = $('<td>').text(childSnapshot.val().frequency);
    var minutesAwayTd = $('<td>').text(minutesAway);
    var nextArrivalTd = $('<td>').text(nextArrival);

    tRow.append(nameTd, destinationTd, frequencyTd, nextArrivalTd, minutesAwayTd);

    $('#train-scheduler').append(tRow);

    clearInputData();
  }

  database.ref().on("child_added", childAdded, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });

});