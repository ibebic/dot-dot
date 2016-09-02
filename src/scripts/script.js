window.onload = listing();

// loads current date in date field
window.onload = function () {
  document.getElementById('filterDate').valueAsDate = new Date();
};

var toggle = true;

// adds a dot and calls the listing() function to refresh the state
function adding(positionX, positionY) {
  var dotdot = document.getElementById('dotNameInput').value;
  document.getElementById('dotNameInput').value = '';

  $.ajax({
    url: '/api/bears',
    type: 'POST',
    data: JSON.stringify({ name: dotdot, posX: positionX, posY: positionY }),
    contentType: 'application/json; charset=utf-8',
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
      var dots = bears.filter(function (bears) {
        var checkDate = document.getElementById('filterDate').value;
        // if there is no createdAt value in an object, dateCreated value will be used (for older DB records)
        var createDate;
        if (bears.createdAt) {
          createDate = Date.parse(bears.createdAt);
        } else {
          createDate = Date.parse(bears.dateCreated);
        }
        return createDate < (Date.parse(checkDate) + 86400000);
      });
      dots = dots.map(function (bear) {
        return createDot(bear);
      }).join('');
      document.getElementById('svgFrame').innerHTML = dots;
    }
  });
}

// erases the dot and calls the listing() function to refresh the state
function erasing(dotId) { // eslint-disable-line no-unused-vars
  if (toggle === true) {
    $.ajax({
      url: '/api/bears/' + dotId,
      dataType: 'json',
      type: 'DELETE',
      success: function () {
        listing();
      }
    });
  }
}

// updates the existing dot name and calls the listing() function to refresh the state
function updating(dotId) { // eslint-disable-line no-unused-vars
  document.getElementById('svgFrame').style['-webkit-filter'] = 'grayscale(0%)';
  var updatedDotName = document.getElementById('updateInput').value;
  document.getElementById('updateInput').style.visibility = 'hidden';
  document.getElementById('updateButton').style.visibility = 'hidden';
  if (updatedDotName !== null) {
    $.ajax({
      url: '/api/bears/' + dotId,
      data: JSON.stringify({ name: updatedDotName }),
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      type: 'PUT',
      success: function () {
        listing();
      }
    });
  }
}

// displays input field and button fro entering a new name for existing dot and adding the call to updating function on button click
function showUpdateInput(dotId, dotName) { // eslint-disable-line no-unused-vars
  document.getElementById('svgFrame').style['-webkit-filter'] = 'grayscale(100%)';
  document.getElementById('updateInput').style.visibility = 'visible';
  document.getElementById('updateButton').style.visibility = 'visible';
  document.getElementById('updateInput').value = dotName;
  var element = document.getElementById('updateButton');
  element.onclick = updating.bind(null, dotId);
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
            cx="${ posX }" cy="${ posY }" r="16"
            fill="#339cff"/>

    <rect class="btn"
          onmouseup="erasing('${ id }')"
          x="${ posX - 17 }" y="${ posY - 17 }"
          width='34' height='34'/>

    <text class="nameText"
          onclick="showUpdateInput('${ id }', '${ name }')"
          x="${ posX + 25 }" y="${ posY + 4 }"
          font-family="Monospace" font-size="11"
          fill="black">${ name }</text>
  </g>
*/}));

// generate an SVG dot along with its corresponding rect object for appending the erasing() fuction and text with the updating function appended
function createDot(data) {
  return dotTemplate({
    posX: parseInt(data.posX, 10),
    posY: parseInt(data.posY, 10),
    name: data.name,
    id: data._id
  });
}

// toggling the button for blocking / allowing dot deletion
$(document).on('click', '.toggle-button', function () {
  $(this).toggleClass('toggle-button-selected');
  toggle = !toggle;
});
