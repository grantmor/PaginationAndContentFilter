var studentsPerPage = 10;
var $searchBox = $('<div class="student-search"><input placeholder="Search for students..."><button>Search</button></div>');

function hideAllStudents() {
  $('.student-item').hide();
}

// if page nav exists, clear it
function clearPageNav() {
  $('.pagination').remove();
}

// returns text string representing html for page buttons
function generatePageNav(numPerPage) {
  var pageNav;
  var numberOfStudents = $('.student-item.selected').length;
  var numberOfPages = Math.ceil(numberOfStudents / numPerPage);

  pageNav = '<div class="pagination"><ul>';

  for(var i = 0; i < numberOfPages; i++) {
    pageNav += '<li><a href="#">' + (i + 1) + '</a></li>';
  }
  return pageNav += '</ul></div>';
}

function updatePageNav() {
  clearPageNav();
  $('.page').append(generatePageNav(studentsPerPage));
  $('.pagination ul li a').on('click', selectPage);
  selectPage(1);
}
// sets selected button to active and updates results
// page argument is optional; this function is either a click handlers
// or it can be manually invoked to display a given page
function selectPage(page) {

  var pageNumber;
  var $buttons = $('.pagination ul li a');

  $buttons.removeClass('active');

  // if called as an event handler
  if(typeof page === 'object') {
    pageNumber = $(this).text();
  } else {
    // NOT WORKING
    $buttons.first().addClass('active');
    pageNumber = page;
  }

  // only grab selected students
  var upperBound = parseInt( (pageNumber * studentsPerPage) - 1);
  var lowerBound = parseInt( (pageNumber - 1) * studentsPerPage);

  $(this).addClass('active');

  hideAllStudents();

  var $students = $('.student-item.selected');
  // show selected students for current page
  $students.each(function (student) {
    if (student >= lowerBound && student <= upperBound)
      $(this).show();
  });
}

function selectAllStudents() {
  $('.student-item').toggleClass('selected');
}

function searchStudents() {
  var $searchField = $(this).siblings('input');
  var text = $searchField.val().toLowerCase();
  var searchExp = new RegExp(text);
  var searchString;
  var $allStudents = $('.student-item');
  var $studentDetails = $('.student-item .student-details');


  if (text !== '') {
    $allStudents.removeClass('selected');
  } else {
    $allStudents.addClass('selected');
  }

  $searchField.val('');

  // search students
  $studentDetails.filter(function () {
    return $(this).find('h3').text().match(searchExp) !== null ||
           $(this).find('.email').text().match(searchExp) !== null;
  }).parent().addClass('selected');
  hideAllStudents();
  $('.student-item.selected').show();
  updatePageNav();
}

// select all by default
selectAllStudents();
// hide all by default
hideAllStudents();
// inserting search box to the DOM
$('.page-header').append($searchBox);
// inserting page navigation into the DOM
$('.page').append(generatePageNav(studentsPerPage));
// setting active page to first
$('.pagination ul li a:first').toggleClass('active');
// display contents of first page (HACK - figure out how to reuse this with selectPage) // ? function that looks at current page and displays those ?
$('.student-item').each(function (student) {
  if (student < studentsPerPage)
    $(this).show();
});

/*** Event Handlers ***/
// add click handlers to buttons
$('.student-search button').on('click', searchStudents);
$('.pagination ul li a').on('click', selectPage);
