//EDIT THESE LINES
//Title of the blog
var TITLE = "Betaout Blog";
//RSS url
var RSS = "http://www.betaout.com/blog/feed/atom/";
//Stores entries
var entries = [];
var selectedEntry = "";
var _viewCount = 5;
var DATADIR;

//listen for detail links
$(".contentLink").live("click", function() {
	selectedEntry = $(this).data("entryid");
});

function renderEntries(entries) {
    var s = '';
    $.each(entries, function(i, v) {
        s += '<li><a href="#contentPage" class="contentLink" data-entryid="'+i+'">' + v.title + '</a></li>';
    });
    $("#linksList").html(s);
    $("#linksList").listview("refresh");
}

//Listen for Google's library to load
function initialize() {
	console.log('Anas ready to use google');
	var feed = new google.feeds.Feed(RSS);
	feed.setNumEntries(_viewCount);
	$.mobile.showPageLoadingMsg();
	feed.load(function(result) {
		$.mobile.hidePageLoadingMsg();
		if(!result.error) {
			entries = result.feed.entries;
			localStorage["entries"] = JSON.stringify(entries);
			renderEntries(entries);
		} else {
			console.log("Anas Error - "+result.error.message);
			if(localStorage["entries"]) {
				$("#status").html("Using cached version...");
				entries = JSON.parse(localStorage["entries"]);
				renderEntries(entries);
			} else {
				$("#status").html("Sorry, we are unable to get the RSS and there is no cache.");
			}
		}
	});
}

//Listen for main page
$("#mainPage").live("pageinit", function() {
	//Set the title
	$("h1", this).text(TITLE);
	
	google.load("feeds", "1",{callback:initialize});
});

$("#mainPage").live("pagebeforeshow", function(event,data) {
	if(data.prevPage.length) {
		$("h1", data.prevPage).text("");
		$("#entryText", data.prevPage).html("");
	};
});

//Listen for the content page to load
$("#contentPage").live("pageshow", function(prepage) {
	//Set the title
	$("h1", this).text(entries[selectedEntry].title);
	var contentHTML = "";
	contentHTML += entries[selectedEntry].content;
	contentHTML += '<p/><a href="'+entries[selectedEntry].link + '" class="fullLink" data-role="button">Read Entry on Site</a>';
	
	$("#entryText",this).html('<h2 class="ui-title" aria-level="1" role="heading">' + entries[selectedEntry].title + '</h2>'+contentHTML);
	$("#entryText .fullLink",this).button();
	setTimeout(function(){
		$('img').css({
			'height':'auto',
			'max-width':'100%',
		})
		$.each('img',function(){
		})
	},1)

});

$(".more").live('click', function() {
    _viewCount = _viewCount+5;
    google.load("feeds", "1", {callback: initialize});
})
	
$(window).on("touchstart", ".fullLink", function(e) {
	e.preventDefault();
	window.inAppBrowser.showWebPage($(this).attr("href"));
});


function onFsSuccess(fileSystem){
	fileSystem.root.getDirectory("Android/data/com.betaout/rssreader",{create:true},gotDir,onError);
}

function gotDir(d){
	DATADIR = d;
	var reader = DATADIR.createReader();
	reader.readEntries(gotFiles,onError);
}

function gotFiles(entries){
	console.log("Anas This directory has "+entries.length+" entries");
	for (var i=0; i<entries.length; i++){
		console.log('Anas '+entries[i].name+' '+entries[i].isDirectory);
	}
}


function onError(e){
	console.log(" Anas + ERROR");
	console.log("Anas "+JSON.stringify(e));
}

/*function doOnOrientationChange()
  {
    switch(window.orientation) 
    {  
      case -90:
      case 90:
        alert('landscape');
        break; 
      default:
        alert('portrait');
        break; 
    }
  }

  window.addEventListener('orientationchange', doOnOrientationChange);

  // Initial execution if needed
  doOnOrientationChange();*/
