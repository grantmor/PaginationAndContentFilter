var studentsPerPage = 10;
var fadeSpeed = 300;
var previousSearchResults = [];
var $searchBox = $('<div class="student-search">' +
                    '<input placeholder="Search for students...">' +
                    '<button>Search</button></div>');

// returns an array of the names of selected students
function getSelectedStudents() {
  var selectedStudents = [];
  $('.selected div h3').each(function (student) {
    selectedStudents.push($(this).text().toLowerCase());
  });
  return selectedStudents;
}

// returns true if search results have changed, otherwise false
function needsRefresh() {
  if (JSON.stringify(previousSearchResults) !== JSON.stringify(getSelectedStudents()))
    return true;
  else
    return false;
}

function hideAllStudents() {
  $('.student-item').fadeOut(fadeSpeed);
}

// if page nav exists, clear it
function clearPageNav() {
  $('.pagination').remove();
}

function getNumberOfPages(numResults, numPerPage) {
  return Math.ceil(numResults / numPerPage);
}

function getActivePage() {
  return parseInt($('.pagination ul li a.active').text());
}

// returns text string representing html for page buttons
function generatePageNav(numPerPage) {
  var pageNav;
  var numSelected = $('.student-item.selected').length;
  var numberOfPages = getNumberOfPages(numSelected, studentsPerPage);
  var i = 0;

  pageNav = '<div class="pagination"><ul>';

  // don't display page numbers if there's only one page
  if (numberOfPages <= 1)
    i = 1;

  for(; i < numberOfPages; i++)
    pageNav += '<li><a href="#">' + (i + 1) + '</a></li>';

  return pageNav += '</ul></div>';
}

function clearResultsText() {
  $('.page-header h3').remove();
}

function generateResultsText() {
  clearResultsText();

  var numSelected = $('.student-item.selected').length;
  var numPages = getNumberOfPages(numSelected, studentsPerPage);
  var curPage = getActivePage();
  var results = '<h3 class="results">Students ';
  var numOnCurPage = curPage * studentsPerPage;
  var capacityOfAllPages = numPages * studentsPerPage;

  // if current page is the last, deal with remainder
  if (curPage === numPages)
    numOnCurPage =  capacityOfAllPages - (capacityOfAllPages - numSelected);

  results += curPage * studentsPerPage - studentsPerPage + 1;
  results += ' - ';
  results += numOnCurPage;

  results += ' out of ' + numSelected;

  // if there are no matches, inform the user
  if (numSelected === 0)
    results = '<h3 class="results">No matches. :(</h3>';

  return results;
}

// sets selected button to active and updates results
// page argument is optional; this function is either a click handlers
// or it can be manually invoked to display a given page
function selectPage(page) {
  console.log('selectpage');

  var pageNumber;
  var $buttons = $('.pagination ul li a');

  $buttons.removeClass('active');

  // if called as an event handler
  if(typeof page === 'object') {
    pageNumber = $(this).text();
  // if called with a page argument
  } else {
    $buttons.first().addClass('active');
    pageNumber = page;
  }

  // only grab selected students
  var upperBound = parseInt( (pageNumber * studentsPerPage) - 1);
  var lowerBound = parseInt( (pageNumber - 1) * studentsPerPage);

  $(this).addClass('active');

  var $students = $('.student-item.selected');
    // hide current results
    hideAllStudents();
    // fadeIn selected students for current page
    $students.each(function (student) {
      if (student >= lowerBound && student <= upperBound)
        $(this).fadeIn(fadeSpeed);
    });
    $('.page-header h2').after(generateResultsText());
}

function updatePageNav() {

  console.log('update page nav');
  clearPageNav();
  $('.page').append(generatePageNav(studentsPerPage));
  $('.pagination ul li a').on('click', selectPage);
  selectPage(1);
}

function selectAllStudents() {
  $('.student-item').toggleClass('selected');
}

function searchStudents(clearField) {

  var $searchField = $('.student-search input');
  var $allStudents = $('.student-item');
  var $studentDetails = $('.student-item .student-details');

  var text = $searchField.val().toLowerCase();
  var searchExp = new RegExp(text);
  var searchString;

  // filter function - checks if search string finds a match in name or email
  // excludes case conversion for student records because they are already
  // lowercase and this makes the code more readable
  function searchForString() {
    return $(this).find('h3').text().match(searchExp) !== null ||
           $(this).find('.email').text().match(searchExp) !== null;
  }

  if (text !== '') {
    $allStudents.removeClass('selected');
  } else {
    $allStudents.addClass('selected');
  }

  // clear search field if called with search button
  if (clearField)
    $searchField.val('');

  // search students
  $studentDetails.filter(searchForString).parent().addClass('selected');

  // only update results if new results differ from the last search
  if (needsRefresh()) {
    // fadeIn only students selected by search
    $('.student-item.selected').fadeIn(fadeSpeed);
    $('.page-header h2').after(generateResultsText());
  }

    updatePageNav();

  // load previous search into global variable
  previousSearchResults = getSelectedStudents();
}

// runs every time the search field changes
function selectByCharacter() {
  searchStudents(false);
  console.log('selectByCharacter clicked');
}

// sets up the page
function initializePage() {
  function displayFirstPage (student) {
    if (student < studentsPerPage)
      $(this).fadeIn(fadeSpeed);
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
  // display contents of first page
  $('.student-item').each(displayFirstPage);

  $('.page-header h2').after(generateResultsText());
}

initializePage();
getSelectedStudents();

/*** Event Handlers ***/
// add click handlers to buttons
$('.student-search button').on('click', searchStudents);
$('.pagination ul li a').on('click', selectPage);
$('.student-search input').on('keyup', selectByCharacter);
