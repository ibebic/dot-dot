window.onload = listing();

// adds a dot and calls the listing() function to refresh the state
function adding(positionX, positionY) {
  var dotdot = document.getElementById('dotNameInput').value;
  document.getElementById('dotNameInput').value = '';

  $.ajax({
    url: '/api/bears',
    type: 'POST',
    data: { name: dotdot, posX: positionX, posY: positionY },
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
    success: function (bears) {
      var dots = bears.map(function (bear) {
        return createDot(bear);
      }).join('');

      document.getElementById('svgFrame').innerHTML = dots;
    }
  });
}

// erases the dot and calls the listing() function to refresh the state
function erasing(dotId) { // eslint-disable-line no-unused-vars
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
function updating(dotId, dotName) { // eslint-disable-line no-unused-vars
  var updatedDotName = prompt('New name:', dotName);
  if (updatedDotName !== null) {
    $.ajax({
      url: '/api/bears/' + dotId,
      data: { name: updatedDotName },
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

var dotTemplate = lodash.template(multiline.stripIndent(function () {/*
  <g>
    <circle class="circles"
            cx="${ posX }" cy="${ posY }" r="20"
            fill="#e6ccff"/>

    <rect class="btn"
          onclick="erasing('${ id }')"
          x="${ posX - 17 }" y="${ posY - 17 }"
          width='34' height='34'/>

    <text class="nameText"
          onclick="updating('${ id }', '${ name }')"
          x="${ posX + 25 }" y="${ posY + 3 }"
          font-family="Monospace" font-size="12"
          fill="black">${ name }</text>
  </g>
*/}));

// generate SVG dot along with its corresponding rect object for appending the erasing() fuction and text with the updating function appended
function createDot(data) {
  return dotTemplate({
    posX: parseInt(data.posX, 10),
    posY: parseInt(data.posY, 10),
    name: data.name,
    id: data._id
  });
}
