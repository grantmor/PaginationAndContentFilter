var studentsPerPage = 10;

var $studentList = $('.student-item');
var $searchBox = $('<div class="student-search"><input placeholder="Search for students..."><button>Search</button></div>');

function removeAllStudents() {
  $('.student-item').hide();
}

// if page nav exists, clear it
function clearPageNav() {
  $('.pagination').remove();
}

// returns text string representing html for page buttons
function updatePageNav(numPerPage) {
  clearPageNav();
  var pageNav;
  var numberOfStudents = $('.student-list').children().length; // change this to only get students with class of 'visible'
  var remainder = numberOfStudents % numPerPage;
  var numberOfPages = Math.floor(numberOfStudents / numPerPage);
  if (remainder > 0)
    numberOfPages += 1;
  console.log(numberOfPages);

  pageNav = '<div class="pagination"><ul>';

  for(var i = 0; i < numberOfPages; i++) {
    pageNav += '<li><a href="#">' + (i + 1) + '</a></li>';
  }

  return pageNav += '</ul></div>';
}

// sets selected button to active and updates results
function selectPage() {
  var $buttons = $('.pagination ul li a');
  var $students = $('.student-item');

  var pageNumber = $(this).text();

  var upperBound = parseInt( (pageNumber * studentsPerPage) - 1);
  var lowerBound = parseInt( (pageNumber - 1) * studentsPerPage);
  console.log(lowerBound);
  console.log(upperBound);

  $buttons.removeClass('active');
  $(this).addClass('active');

  removeAllStudents();

  // add students from current page to the DOM
  $students.each(function (student) {
    if (student >= lowerBound && student <= upperBound)
      $(this).show();
  });
}

// hide all by default
removeAllStudents();
// inserting search box to the DOM
$('.page-header').append($searchBox);
// inserting page navigation into the DOM
$('.page').append(updatePageNav(studentsPerPage));
// setting active page to first
$('.pagination ul li a:first').toggleClass('active');
// display contents of first page (HACK - figure out how to reuse this with selectPage) // ? function that looks at current page and displays those ?
$('.student-item').each(function (student) {
  if (student < studentsPerPage)
    $(this).show();
});

// add click handlers to buttons
$('.pagination ul li a').on('click', selectPage);
