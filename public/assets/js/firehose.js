(function() {
  function insertAfter( referenceNode, newNode ) {
    referenceNode.parentNode.insertBefore( newNode, referenceNode.nextSibling );
  }

  function renderResponse( data, sibling, parent ) {
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
  }

  function ignition( e ) {
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
  }

  function init() {
    var create = document.getElementById( "new" ),
        apiCreates = document.createElement( "ol" ),
        updates = document.getElementById( "updated" ),
        apiUpdates = document.createElement( "ol" );
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
    apiCreates.addEventListener( "click", ignition );
    apiUpdates.addEventListener( "click", ignition );
  }

  init();

})();