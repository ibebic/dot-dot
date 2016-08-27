window.onload = listing();

// adds a dot and calls the listing() function to refresh the state
function adding(positionX, positionY) {
  var dotdot = document.getElementById('dotNameInput').value;
  document.getElementById('dotNameInput').value = '';

  $.ajax({
    url: '/api/bears',
    type: 'POST',
    data: {name: dotdot, posX: positionX, posY: positionY},
    dataType: 'json',
    success: function () {
      listing();
    },
    error: function (xhr, ajaxOptions, thrownError) {
      console.log(xhr.status);
      console.log(thrownError);
    }
  });
}

// shows all existing dots inside the svgFrame
function listing() {
  $.ajax({
    url: '/api/bears',
    type: 'GET',
    dataType: 'json',
    success: function (data) {
      // adding the initial dot to dotlist variable in html form
      var dotList = dotGenerator(data, 0);
      // adding the remaining dots to dotlist variable in html form
      for (var i = 1; i < data.length; i++) {
        dotList += dotGenerator(data, i);
      }
      document.getElementById('svgFrame').innerHTML = dotList;
    }
  });
}

// erases the dot and calls the listing() function to refresh the state
function erasing(dotId) {
  $.ajax({
    url: '/api/bears/' + dotId,
    dataType: 'json',
    type: 'DELETE',
    success: function () {
      listing();
    }
  });
}

// updates the existing dot name and calls the listing() function to refresh the state
function updating(dotId, dotName) {
  var updatedDotName = prompt('New name:', dotName);
  if (updatedDotName !== null) {
    $.ajax({
      url: '/api/bears/' + dotId,
      data: {name: updatedDotName},
      dataType: 'json',
      type: 'PUT',
      success: function () {
        listing();
      }
    });
  }
}

// event listener for clicks inside of svgFrame which calls the adding() function in case the dotNameInput field value lenght is greater than 0
document.getElementById('svgFrame').addEventListener('click', function (evt) {
  var originalDotName = document.getElementById('dotNameInput').value;
  if (originalDotName.length > 0) {
    adding(evt.offsetX, evt.offsetY);
  }
});

// generate SVG dot along with its corresponding rect object for appending the erasing() fuction and text with the updating function appended
function dotGenerator(data, place) {
  var x0 = parseInt(data[place].posX, 10) + 25;
  var y0 = parseInt(data[place].posY, 10) + 3;
  var name0 = data[place].name;
  var id0 = data[place]['_id'];
  return "<g><circle class='circles' cx='"+data[place].posX+"' cy='"+data[place].posY+"' r='20' fill='#e6ccff'/><rect class='btn' x='"+(data[place].posX-17)+"' y='"+(data[place].posY-17)+"' width='34' height='34' onclick='erasing(\""+data[place]["_id"]+"\")'/><text class='nameText' onclick='updating(\""+id0+ "\",\"" +name0+ "\")' x='"+x0+"' y='"+ y0 +"' font-family='Monospace' font-size='12' fill='black' >"+data[place].name+"</text></g>";
}
