/* TODO:
  - add in a form for finding remixes on a special projectID
  - columns, add in a column grid to make things look less shit
  - css, make some better CSS and remove the need for the butter.ui.css file?
  - chuck in the ability to search for more than 20 things at a time
  - lots of repeated code, we should fix that I think
  - convert templates to nunjucks

  ANNOYS:
  - fix broken image (this is in webmaker nav)
*/

var firehose = window.firehouse || {};

firehose = function() {

  var insertAfter, renderResponse, ignition, init;

  insertAfter = function( referenceNode, newNode ) {
    referenceNode.parentNode.insertBefore( newNode, referenceNode.nextSibling );
  };

  renderResponse = function( data, sibling, parent ) {
    var frag = document.createDocumentFragment();
    if ( !data.length ) {
      var li = document.createElement( "li" );
      li.innerHTML = "No remixes";
      parent.appendChild( li );
    } else {
      data.forEach( function( d ) {
        var li = document.createElement( "li" ),
            viewUrl = "<a href='" + d.publishUrl + "'>" + d.name + "</a>",
            remixUrl = "<a data-remixId='" + d.id + "' class='remix' href='remixes/" + d.id + "'>show me the remixes</a>";
        li.innerHTML = viewUrl + " - " + remixUrl;
        frag.appendChild( li );
      } );
      parent.appendChild( frag );
    }
    insertAfter( sibling, parent );
  };

  ignition = function( e ) {
    var target = e.target;
    if ( target.className === "remix" ) {
      var remixId = target.getAttribute( "data-remixId");
      $.ajax({
        type: "GET",
        dataType: "json",
        url: "https://popcorn.webmaker.org/api/project/" + remixId + "/remixes",
        success : function( response ) {
          renderResponse ( response.results, target, document.createElement( "ol" ) );
        target.parentNode.removeChild( target );
        }
      });
      e.preventDefault();
    }
  };

  init = function() {
    var create = document.getElementById( "new" ),
        apiCreates = document.createElement( "ol" ),
        updates = document.getElementById( "updated" ),
        apiUpdates = document.createElement( "ol" ),
        remixed = document.getElementById( "updated" ),
        remixedUpdates = document.createElement( "ol" );
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "https://popcorn.webmaker.org/api/projects/recentlyCreated/20",
        success : function( response ) {
          renderResponse( response.results, create, apiCreates );
        }
      });
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "https://popcorn.webmaker.org/api/projects/recentlyUpdated/20",
        success : function( response ) {
          renderResponse( response.results, updates, apiUpdates  );
        }
      });
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "https://popcorn.webmaker.org/api/projects/recentlyRemixed/20",
        success : function( response ) {
          renderResponse( response.results, remixed, remixedUpdates  );
        }
      });
    apiCreates.addEventListener( "click", ignition );
    apiUpdates.addEventListener( "click", ignition );
    remixedUpdates.addEventListener( "click", ignition );
  };

  return {
    "init": init
  };

}();

firehose.init();