/* ANNOYS:
  - fix broken image (this is in webmaker nav so need to fix there)
  - chuck in the ability to search for more than 20 things at a time?
*/

var firehose = window.firehouse || {};

firehose = function() {

  var insertAfter, renderResponse, ignition, remixSearch, init;

  insertAfter = function( referenceNode, newNode ) {
    referenceNode.parentNode.insertBefore( newNode, referenceNode.nextSibling );
  };

  renderResponse = function( data, sibling, list_class ) {
    var parent = document.createElement( "ol" ),
        frag = document.createDocumentFragment();
    if ( list_class ) {
      parent.className = list_class;
    }
    if ( !data.length ) {
      var li = document.createElement( "li" );
      li.innerHTML = "No remixes";
      parent.appendChild( li );
    } else {
      data.forEach( function( d ) {
        var li = document.createElement( "li" ),
            viewUrl = "<a href='" + d.publishUrl + "'>" + d.name + "</a>",
            remixUrl = "<a data-remixId='" + d.id + "' class='remix butter-btn btn-green start' href='remixes/" + d.id + "'>Find remixes</a>";
        li.innerHTML = viewUrl + " "  + remixUrl;
        li.className = "make";
        frag.appendChild( li );
      } );
      parent.appendChild( frag );
    }
    insertAfter( sibling, parent );
    parent.addEventListener( "click", ignition );
  };

  ignition = function( e ) {
    var target = e.target;
    if ( target.hasAttribute( "data-remixId" ) ) {
      var remixId = target.getAttribute( "data-remixId" );
      $.ajax({
        type: "GET",
        dataType: "json",
        url: "https://popcorn.webmaker.org/api/project/" + remixId + "/remixes",
        success : function( response ) {
          renderResponse ( response.results, target, "remixes" );
          target.parentNode.removeChild( target );
        }
      });
      e.preventDefault();
    }
  };

  remixSearch = function( e ) {
    var remixID = document.getElementById( "want_remix" ).value,
        sibling = e.target.nextSibling;
    if ( sibling ) {
      sibling.parentNode.removeChild( sibling );
    }
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "https://popcorn.webmaker.org/api/project/" + remixID + "/remixes",
        success : function( response ) {
          renderResponse ( response.results, e.target, "remixes" );
        }
      });
    e.preventDefault();
  };

  init = function() {
    var remixForm = document.getElementById( "search_remixes" );
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "https://popcorn.webmaker.org/api/projects/recentlyCreated/20",
        success : function( response ) {
          renderResponse( response.results, document.getElementById( "new" ) );
        }
      });
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "https://popcorn.webmaker.org/api/projects/recentlyUpdated/20",
        success : function( response ) {
          renderResponse( response.results, document.getElementById( "updated" ) );
        }
      });
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "https://popcorn.webmaker.org/api/projects/recentlyRemixed/20",
        success : function( response ) {
          renderResponse( response.results, remixed = document.getElementById( "updated" ) );
        }
      });
    remixForm.addEventListener( "submit", remixSearch );
  };

  return {
    "init": init
  };

}();

firehose.init();