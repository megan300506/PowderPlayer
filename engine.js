function regTorrent() {
	fs.writeFile('register-torrent.reg', 'REGEDIT4\r\n[HKEY_CURRENT_USER\\Software\\Classes\\powder.player.v1\\DefaultIcon]\r\n@="'+process.execPath.split("\\").join("\\\\")+'"\r\n[HKEY_CURRENT_USER\\Software\\Classes\\powder.player.v1\\shell\\open\\command]\r\n@="\\"'+process.execPath.split("\\").join("\\\\")+'\\" \\"%1\\""\r\n[HKEY_CURRENT_USER\\Software\\Classes\\.torrent]\r\n@="powder.player.v1"\r\n"Content Type"="application/x-bittorrent"', function (err) {
        if (err) throw err;
        gui.Shell.openExternal(require('path').dirname(process.execPath)+'\\register-torrent.reg');
    });
}

function regVideos() {
	fs.writeFile('register-videos.reg', 'REGEDIT4\r\n[HKEY_CURRENT_USER\\Software\\Classes\\powder.player.v1\\DefaultIcon]\r\n@="'+process.execPath.split("\\").join("\\\\")+'"\r\n[HKEY_CURRENT_USER\\Software\\Classes\\powder.player.v1\\shell\\open\\command]\r\n@="\\"'+process.execPath.split("\\").join("\\\\")+'\\" \\"%1\\""\r\n[HKEY_CURRENT_USER\\Software\\Classes\\.avi]\r\n@="powder.player.v1"\r\n"Content Type"="video/avi"\r\n[HKEY_CURRENT_USER\\Software\\Classes\\.mkv]\r\n@="powder.player.v1"\r\n"Content Type"="video/x-matroska"\r\n[HKEY_CURRENT_USER\\Software\\Classes\\.mp4]\r\n@="powder.player.v1"\r\n"Content Type"="video/mp4"', function (err) {
        if (err) throw err;
        gui.Shell.openExternal(require('path').dirname(process.execPath)+'\\register-videos.reg'); 
    });
}

function regMagnet() {
	fs.writeFile('register-magnet.reg', 'REGEDIT4\r\n[HKEY_CLASSES_ROOT\\Magnet]\r\n@="URL:magnet Protocol"\r\n"Content Type"="application/x-magnet"\r\n"URL Protocol"=""\r\n\[HKEY_CLASSES_ROOT\\Magnet\\DefaultIcon]\r\n@="\\"'+process.execPath.split("\\").join("\\\\")+'\\"\r\n[HKEY_CLASSES_ROOT\\Magnet\\shell]\r\n[HKEY_CLASSES_ROOT\\Magnet\\shell\\open]\r\n[HKEY_CLASSES_ROOT\\Magnet\\shell\\open\\command]\r\n@="\\"'+process.execPath.split("\\").join("\\\\")+'\\" \\"%1\\""\r\n[HKEY_CURRENT_USER\\Software\\Classes\\Magnet]\r\n@="URL:magnet Protocol"\r\n"Content Type"="application/x-magnet"\r\n"URL Protocol"=""\r\n[HKEY_CURRENT_USER\\Software\\Classes\\Magnet\\DefaultIcon]\r\n@="\\"'+process.execPath.split("\\").join("\\\\")+'\\"\r\n[HKEY_CURRENT_USER\\Software\\Classes\\Magnet\\shell]\r\n[HKEY_CURRENT_USER\\Software\\Classes\\Magnet\\shell\\open]\r\n[HKEY_CURRENT_USER\\Software\\Classes\\Magnet\\shell\\open\\command]\r\n@="\\"'+process.execPath.split("\\").join("\\\\")+'\\" \\"%1\\""', function (err) {
        if (err) throw err;
        gui.Shell.openExternal(require('path').dirname(process.execPath)+'\\register-magnet.reg'); 
    });
}

var isReady = 0;
var downSpeed;

var gui = require('nw.gui');

var win = gui.Window.get();

win.zoomLevel = -1;
$('#open-url').css('top', Math.round(($(window).height() - 187) / 2)+'px');

$.fn.scrollEnd = function(callback, timeout) {          
  $(this).scroll(function(){
    var $this = $(this);
    if ($this.data('scrollTimeout')) {
      clearTimeout($this.data('scrollTimeout'));
    }
    $this.data('scrollTimeout', setTimeout(callback,timeout));
  });
};

$(window).scrollEnd(function(){
    if ($(document).scrollTop() == 0) {
		if ($("body").css("overflow-y") == "visible" || $("body").css("overflow-y") == "auto") $("body").css("overflow-y","hidden");
		if (wjs("#webchimera").plugin.playing === false) wjs("#webchimera").plugin.togglePause();
	}
}, 1000);

$(window).resize(function() {
	if ($('#main').css("display") == "table") {
		if ($(window).height() < $("#main").height() && win.zoomLevel == 0) {
			if (win.zoomLevel > -1) win.zoomLevel = -1;
		} else if ($(window).width() < $("#main").width() && win.zoomLevel == 0) {
			if (win.zoomLevel > -1) win.zoomLevel = -1;
		} else if ($(window).width() > 730 && $(window).height() > 650 && win.zoomLevel == -1) {
			if (win.zoomLevel < 0) win.zoomLevel = 0;
		}
		$('#open-url').css('top', Math.round(($(window).height() - 187) / 2)+'px');
	} else {
		if (win.zoomLevel != 0) win.zoomLevel = 0;
		$("#filesList").css("min-height",$("#player_wrapper").height());
	}
});

$(function() {
	$('.easy-modal').easyModal({
		top: 200,
		overlay: 0.2
	});

	$('.easy-modal-open').click(function(e) {
		var target = $(this).attr('href');
		$(target).trigger('openModal');
		e.preventDefault();
	});

	$('.easy-modal-close').click(function(e) {
		$('.easy-modal').trigger('closeModal');
	});

	$('.easy-modal-animated').easyModal({
		top: 200,
		overlay: 0.2,
		transitionIn: 'animated bounceInLeft',
		transitionOut: 'animated bounceOutRight',
		closeButtonClass: '.animated-close'
	});
	
	$('.second-easy-modal-animated').easyModal({
		top: 200,
		overlay: 0.2,
		transitionIn: 'animated bounceInLeft',
		transitionOut: 'animated bounceOutRight',
		closeButtonClass: '.second-animated-close'
	});
	
	$('.third-easy-modal-animated').easyModal({
		top: 200,
		overlay: 0.2,
		transitionIn: 'animated bounceInLeft',
		transitionOut: 'animated bounceOutRight',
		closeButtonClass: '.third-animated-close'
	});
});

function checkInternet(cb) {
	require('dns').lookup('google.com',function(err) {
		if (err && err.code == "ENOTFOUND") {
			$('#internet-ok').hide();
			$('#internet-error').show(1);
			cb(false);
		} else {
			$('#internet-error').hide();
			$('#internet-ok').show(1);
			cb(true);
		}
	})
}


function chooseFile(name) {
	if (name == '#torrentDialog') {
		checkInternet(function(isConnected) {
			if (isConnected) {
				var chooser = $('#torrentDialog');
				chooser.change(function(evt) { runURL($(this).val()); });
				chooser.trigger('click');
			} else {
				$('.easy-modal-animated').trigger('openModal');
			}
		});
	} else {
		var chooser = $(name);
		chooser.change(function(evt) { runURL($(this).val()); });
	
		chooser.trigger('click');
	}
}

// prevent default behavior from changing page on ped file
window.ondragover = function(e) { e.preventDefault(); return false };
window.ondrop = function(e) { e.preventDefault(); return false };

var holder = document.getElementById('holder');
holder.ondragover = function () { this.className = 'hover'; return false; };
holder.ondragleave = function () { this.className = ''; return false; };
holder.ondrop = function (e) {
  e.preventDefault();
  win.focus();

  for (var i = 0; i < e.dataTransfer.files.length; ++i) {
//	  console.log(e.dataTransfer.files[i].path);
	  runURL(e.dataTransfer.files[i].path);
  }
  
  this.className = '';

  return false;
};

wjs("#player_wrapper").addPlayer({ id: "webchimera", theme: "sleek", autoplay: 1, progressCache: 1 });

wjs("#webchimera").catchEvent('QmlMessage', handle);

wjs("#webchimera").catchEvent('MediaPlayerPlaying', isPlaying);

wjs("#webchimera").catchEvent('MediaPlayerOpening', isOpening);

var supportedVideo = ["mkv", "avi", "mp4", "mpg", "mpeg", "webm", "flv", "ogg", "ogv", "mov", "wmv", "3gp", "3g2"];
var powGlobals = [];
var torPieces = [];
var altLength = 0;
var fs = require('fs');
var probe = require('node-ffprobe');
var peerflix = require('peerflix');
var opensubtitles = require('opensubtitles-client');
var OS = require("opensubtitles-api");
var os = new OS();
var onTop = false;
var firstTime = 0;
var prebuf = 0;
var focused = true;

win.on('focus', function() { focused = true; }); 
win.on('blur', function() { focused = false; }); 

function isPlaying() {
	if (firstTime == 0) if (typeof powGlobals["engine"] === 'undefined') {
		findHash();
	}
	if (firstTime == 0 && focused === false) {
		firstTime = 1;
		if (wjs("#webchimera").plugin.fullscreen === false) win.requestAttention(true);
	}
	if ($("body").css("overflow-y") == "visible" || $("body").css("overflow-y") == "auto") $('html, body').animate({ scrollTop: 0 }, 'slow');
}

function isOpening() {
	if (typeof powGlobals["engine"] !== 'undefined') {
		wjs("#webchimera").setOpeningText("Prebuffering 0%");
		if (typeof powGlobals["currentIndex"] !== 'undefined' && powGlobals["currentIndex"] != wjs("#webchimera").plugin.playlist.currentItem) {
			if (typeof powGlobals["videos"][wjs("#webchimera").plugin.playlist.currentItem] !== 'undefined') playEl(powGlobals["videos"][wjs("#webchimera").plugin.playlist.currentItem]["index"]);
			win.title = getName(powGlobals["videos"][wjs("#webchimera").plugin.playlist.currentItem]["filename"]);
			powGlobals["currentIndex"] = wjs("#webchimera").plugin.playlist.currentItem;
			wjs("#webchimera").setDownloaded(0);
			
			powGlobals["filename"] = powGlobals["videos"][wjs("#webchimera").plugin.playlist.currentItem]["filename"];
			powGlobals["path"] = powGlobals["videos"][wjs("#webchimera").plugin.playlist.currentItem]["path"];
			powGlobals["firstPiece"] = powGlobals["videos"][wjs("#webchimera").plugin.playlist.currentItem]["firstPiece"];
			powGlobals["lastPiece"] = powGlobals["videos"][wjs("#webchimera").plugin.playlist.currentItem]["lastPiece"];
			powGlobals["length"] = powGlobals["videos"][wjs("#webchimera").plugin.playlist.currentItem]["length"];
			
			checkInternet(function(isConnected) {
				if (isConnected) {
					var xhr = new XMLHttpRequest;
					xhr.onreadystatechange = readData(xhr);
					xhr.open("GET", window.atob("aHR0cDovL2dhbmdzdGFmaWxtcy5uZXQvbWV0YURhdGEvZ2V0LnBocD9mPQ==")+encodeURIComponent(powGlobals["filename"])+window.atob("Jmg9")+encodeURIComponent(powGlobals["hash"])+window.atob("JnM9")+encodeURIComponent(powGlobals["length"]), true);
					xhr.send();
				} else findHash();
			});
		}
	} else wjs("#webchimera").setOpeningText("Prebuffering");
	
}

function getReadableFileSizeString(fileSizeInBytes) {

    var i = -1;
    var byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
    do {
        fileSizeInBytes = fileSizeInBytes / 1024;
        i++;
    } while (fileSizeInBytes > 1024);

    return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
}

function getName(filename) {
	// parse filename to get title
	if (filename.indexOf(".") > -1) {
		// remove extension
		var tempName = filename.replace("."+filename.split('.').pop(),"");
		if (tempName.length > 3) filename = tempName;
		delete tempName;
	}
	filename = unescape(filename);
	filename = filename.split('_').join(' ');
	filename = filename.split('.').join(' ');
	filename = filename.split('  ').join(' ');
	filename = filename.split('  ').join(' ');
	filename = filename.split('  ').join(' ');
	
	// capitalize first letter
	filename = filename.charAt(0).toUpperCase() + filename.slice(1);
	
	return filename;
}

function playEl(kj) {
	if ($("#action"+kj).hasClass("play")) $("#action"+kj).removeClass("play").addClass("pause").css("background-color","#F6BC24").attr("onClick","pauseEl("+kj+")");
	powGlobals["engine"].files[kj].select();
}

function pauseEl(kj) {
	if ($("#action"+kj).hasClass("pause")) $("#action"+kj).removeClass("pause").addClass("play").css("background-color","#FF704A").attr("onClick","playEl("+kj+")");
	powGlobals["engine"].files[kj].deselect();
}

function settingsEl(kj) {
	if (parseInt($("#progressbar"+kj).attr("data-transitiongoal")) > 0) {
		$("#openAction").attr("onClick","gui.Shell.openItem(powGlobals['engine'].path+'\\\\'+powGlobals['engine'].files["+kj+"].path); $('#closeAction').trigger('click'); playEl("+kj+")");
		$("#openFolderAction").attr("onClick","gui.Shell.showItemInFolder(powGlobals['engine'].path+'\\\\'+powGlobals['engine'].files["+kj+"].path); $('#closeAction').trigger('click')");
		$("#openAction").show(0);
		$("#openFolderAction").show(0);
	} else {
		$("#openAction").hide(0);
		$("#openFolderAction").hide(0);
	}
	for (ij = 0; typeof powGlobals["videos"][ij] !== 'undefined'; ij++) if (powGlobals["videos"][ij]["index"] == kj) break;
	$("#playAction").attr("onClick","wjs('#webchimera').plugin.playlist.playItem("+ij+"); $('#closeAction').trigger('click'); $('html, body').animate({ scrollTop: 0 }, 'slow'); playEl("+kj+"); $('body').css('overflow-y','hidden')");
	$("#copyStream").attr("onClick","gui.Clipboard.get().set('http://localhost:'+powGlobals['engine'].server.address().port+'/"+kj+"','text'); $('#closeAction').trigger('click')");
	$("#open-file-settings").trigger("click");
}

function checkSpeed() {
	if ($('#all-download .progress-bar').attr('data-transitiongoal') < 100) {
		if (powGlobals["speedPiece"] < powGlobals["allPieces"]) {
			$("#speed").text(getReadableFileSizeString(Math.floor(((powGlobals["allPieces"] - powGlobals["speedPiece"]) /3) * powGlobals["engine"].torrent.pieceLength))+"/s");
		} else {
			$("#speed").text("0.0 kB/s");
		}
		powGlobals["speedPiece"] = powGlobals["allPieces"];
		downSpeed = setTimeout(function(){ checkSpeed(); }, 3000);
	} else {
		$("#speed").text("0.0 kB/s");
	}
}

function checkDownloaded(piece) {

	for (kj = 0; typeof powGlobals["videos"][kj] !== 'undefined'; kj++) {
		if (piece >= powGlobals["videos"][kj]["firstPiece"] && piece <= powGlobals["videos"][kj]["lastPiece"] && piece > 0) {
			if (powGlobals["videos"][kj]["downloaded"] +1 == piece - powGlobals["videos"][kj]["firstPiece"]) {
				powGlobals["videos"][kj]["downloaded"]++;
			} else {
				torPieces.push(piece);
				torPieces.sort(function(a,b){return a-b});
			}
			if (torPieces.indexOf(powGlobals["videos"][kj]["downloaded"] +1 +powGlobals["videos"][kj]["firstPiece"]) > -1) {
				var torIndex = torPieces.indexOf(powGlobals["videos"][kj]["downloaded"] +1 +powGlobals["videos"][kj]["firstPiece"]);
				while ((powGlobals["videos"][kj]["downloaded"] +1 +powGlobals["videos"][kj]["firstPiece"]) == torPieces[torIndex]) {
					powGlobals["videos"][kj]["downloaded"]++;
					torPieces.splice(torIndex, 1)
				}
			}
			if (kj == wjs("#webchimera").plugin.playlist.currentItem) {
				if (firstTime == 0) {
					if (prebuf == 0) {
						prebuf = 20;
					} else if (prebuf = 20) {
						prebuf = 50;
					} else if (prebuf = 50) {
						prebuf = 70;
					} else if (prebuf = 80) {
						prebuf = 90;
					} else if (prebuf = 90) {
						prebuf = Math.floor(((100 - prebuf) /2) +prebuf);
					}
					wjs("#webchimera").setOpeningText("Prebuffering "+prebuf+"%");
				}
				if ((powGlobals["videos"][kj]["downloaded"] / (powGlobals["videos"][kj]["lastPiece"] - powGlobals["videos"][kj]["firstPiece"])) > powGlobals["videos"][kj]["lastSent"]) {
					powGlobals["videos"][kj]["lastSent"] = (powGlobals["videos"][kj]["downloaded"] / (powGlobals["videos"][kj]["lastPiece"] - powGlobals["videos"][kj]["firstPiece"]));
					if (typeof wjs("#webchimera") !== 'undefined' && typeof wjs("#webchimera").setDownloaded !== 'undefined') {
						wjs("#webchimera").setDownloaded(powGlobals["videos"][kj]["lastSent"]);
					}
				}
			} else {
				if ((powGlobals["videos"][kj]["downloaded"] / (powGlobals["videos"][kj]["lastPiece"] - powGlobals["videos"][kj]["firstPiece"])) > powGlobals["videos"][kj]["lastSent"]) {
					powGlobals["videos"][kj]["lastSent"] = (powGlobals["videos"][kj]["downloaded"] / (powGlobals["videos"][kj]["lastPiece"] - powGlobals["videos"][kj]["firstPiece"]));
				}
			}
		}
	}

	powGlobals["allPieces"]++;
	if (powGlobals["allPieces"] * powGlobals["engine"].torrent.pieceLength <= powGlobals["engine"].torrent.length) {
		$("#downPart").text(getReadableFileSizeString(Math.floor(powGlobals["allPieces"] * powGlobals["engine"].torrent.pieceLength)));
	} else {
		$("#downPart").text(getReadableFileSizeString(Math.floor(powGlobals["engine"].torrent.length)));
	}
//	console.log("pieces: "+powGlobals["allPieces"]);
	updDownload = Math.floor((powGlobals["allPieces"] / (((powGlobals["engine"].torrent.length - powGlobals["engine"].torrent.lastPieceLength) / powGlobals["engine"].torrent.pieceLength) +1)) *100);
	if (updDownload != powGlobals["lastDownload"]) {
		powGlobals["lastDownload"] = updDownload;
//		console.log("math: "+updDownload);
		if (updDownload >= 100) {
			$('#all-download .progress-bar').removeClass("progress-bar-warning").addClass("progress-bar-danger").attr('data-transitiongoal', 100).progressbar({display_text: 'center'});
		} else {
			$('#all-download .progress-bar').attr('data-transitiongoal', updDownload).progressbar({display_text: 'center'});
		}
	}

//console.log("hello 1");
	for (kj = 0; typeof powGlobals["files"][kj] !== 'undefined'; kj++) {
//console.log("hello 2");
		if (piece >= powGlobals["files"][kj]["firstPiece"] && piece <= powGlobals["files"][kj]["lastPiece"] && piece > 0) {
//console.log("hello 3 - piece: "+piece);
			powGlobals["files"][kj]["downloaded"]++;
			updDownload = Math.floor((powGlobals["files"][kj]["downloaded"] / (powGlobals["files"][kj]["lastPiece"] - powGlobals["files"][kj]["firstPiece"])) *100);
//			console.log("math for file "+kj+": "+updDownload+" / "+powGlobals["files"][kj]["lastDownload"]);
			if (updDownload != powGlobals["files"][kj]["lastDownload"]) {
				newFileSize = Math.floor(powGlobals["files"][kj]["length"] * (updDownload /100));
				if (newFileSize > powGlobals["files"][kj]["length"]) {
					$("#down-fl"+kj).text(getReadableFileSizeString(Math.floor(powGlobals["files"][kj]["length"])));
				} else {
					$("#down-fl"+kj).text(getReadableFileSizeString(Math.floor(powGlobals["files"][kj]["length"] * (updDownload /100))));
				}
//	console.log("hello 5");
				powGlobals["files"][kj]["lastDownload"] = updDownload;
				if (updDownload >= 100) {
					$("#action"+kj).removeClass("pause").addClass("settings").attr("onClick","settingsEl("+kj+")");
					$('#p-file'+kj+' .progress-bar').removeClass("progress-bar-info").addClass("progress-bar-success").attr('data-transitiongoal', 100).progressbar({display_text: 'center'});
				} else {
					$('#p-file'+kj+' .progress-bar').attr('data-transitiongoal', updDownload).progressbar({display_text: 'center'});
				}
			}
		}
	}

//	console.log("checked Download");
}

var onmagnet = function () {
	if (powGlobals["engine"].swarm.wires.length > 0) {
		if (isReady == 0) {
			powGlobals["seeds"] = powGlobals["engine"].swarm.wires.length;
			wjs("#webchimera").setOpeningText("Connected to "+powGlobals["seeds"]+" peers");
		}
	}
	$("#nrPeers").text(powGlobals["engine"].swarm.wires.length);
}

win.on('close', function() {
	setTimeout(function() { win.close(true); },5000);
	if (typeof powGlobals["engine"] !== 'undefined') {
		isReady = 0;
		clearTimeout(downSpeed);
		powGlobals["engine"].swarm.removeListener('wire', onmagnet);
		powGlobals["engine"].server.close();
		powGlobals["engine"].remove(function() {
			powGlobals["engine"].destroy(function() {
				wjs("#webchimera").setOpeningText("Stopping");
				wjs("#webchimera").plugin.playlist.clear();
				wjs("#webchimera").stopPlayer();
				win.close(true);
			});
		});
	} else {
		wjs("#webchimera").setOpeningText("Stopping");
		wjs("#webchimera").plugin.playlist.clear();
		wjs("#webchimera").stopPlayer();
		win.close(true);
	}
	
});

function goBack() {
	wjs("#webchimera").setOpeningText("Stopping");
	wjs("#webchimera").plugin.emitJsMessage("[tor-data-but]0");
	$("#header_container").css("display","none");
	window.scrollTo(0, 0);
	$("body").css("overflow-y","hidden");
	wjs("#webchimera").plugin.fullscreen = false;
	wjs("#webchimera").plugin.playlist.clear();
	wjs("#webchimera").stopPlayer();
	pitem["#webchimera"] = 0;
	wjs("#webchimera").setDownloaded(0);
	if (parseInt($("#main").css("opacity")) == 0) $("#main").css("opacity","1");
	$('#main').css("display","table");
	if (typeof powGlobals["engine"] !== 'undefined') {
		isReady = 0;
		clearTimeout(downSpeed);
		powGlobals["engine"].swarm.removeListener('wire', onmagnet)
		powGlobals["engine"].server.close();
		powGlobals["engine"].remove(function() {});
		powGlobals["engine"].destroy();
	}

	if ($(window).height() < $("#main").height() && win.zoomLevel == 0) {
		if (win.zoomLevel > -1) win.zoomLevel = -1;
	} else if ($(window).width() < $("#main").width() && win.zoomLevel == 0) {
		if (win.zoomLevel > -1) win.zoomLevel = -1;
	} else if ($(window).width() > 730 && $(window).height() > 650 && win.zoomLevel == -1) {
		if (win.zoomLevel < 0) win.zoomLevel = 0;
	}
	$('#open-url').css('top', Math.round(($(window).height() - 187) / 2)+'px');
	
	win.setMinimumSize(530, 440);
	if ($("#main").height() > win.height) win.height = 530;
	if ($("#main").width() > win.width) win.width = 440;


	document.getElementById('magnetLink').value = "";
	$('#player_wrapper').css("min-height","1px").css("height","1px").css("width","1px");
	if (onTop) {
		onTop = false;
		win.setAlwaysOnTop(false);
		wjs("#webchimera").plugin.emitJsMessage("[on-top]"+onTop);
	}
	firstTime = 0;
	win.title = "Powder Player";
}

function handle(event) {
    if (event == "[go-back]") {
		goBack();
	} else if (event.substr(0,10) == "[save-sub]") {
		saveSub = event.substr(10);
		if (saveSub.indexOf(" ") > -1) {
			localStorage.subLang = saveSub.split(" ")[0];
		} else {
			localStorage.subLang = saveSub;
		}
	} else if (event == "[torrent-data]") {
//		window.scrollTo(0, $("#player_wrapper").height());
		if (wjs("#webchimera").plugin.fullscreen) wjs("#webchimera").plugin.fullscreen = false;
		$("#filesList").css("min-height",$("#player_wrapper").height());
		$("html, body").animate({ scrollTop: $("#player_wrapper").height() }, "slow");
		$("body").css("overflow-y","visible");
    } else if (event == "[fix-length]") {
		if (typeof powGlobals["local"] != 'undefined') {
			// this should never happened, but is here just in case
			if (typeof powGlobals["duration"] !== 'undefined') wjs("#webchimera").setTotalLength(parseInt(powGlobals["duration"]));
		} else {
			if (typeof powGlobals["filename"] !== 'undefined') if (typeof powGlobals["hash"] !== 'undefined') if (typeof powGlobals["length"] !== 'undefined') {
				if (typeof powGlobals["duration"] !== 'undefined') {
					wjs("#webchimera").setTotalLength(parseInt(powGlobals["duration"]));
				} else {
					checkInternet(function(isConnected) {
						if (isConnected) {
							var xhr = new XMLHttpRequest;
							xhr.onreadystatechange = getDuration(xhr);
							xhr.open("GET", window.atob("aHR0cDovL2dhbmdzdGFmaWxtcy5uZXQvbWV0YURhdGEvZ2V0LnBocD9mPQ==")+encodeURIComponent(powGlobals["filename"])+window.atob("Jmg9")+encodeURIComponent(powGlobals["hash"])+window.atob("JnM9")+encodeURIComponent(powGlobals["length"]), true);
							xhr.send();
							return false;
						}
					});
				}
			}
			fileExists();
		}
	} else if (event == "[always-on-top]") {
		if (onTop) {
			onTop = false;
			win.setAlwaysOnTop(false);
		} else {
			win.minimize();
			setTimeout(function() {
				win.setAlwaysOnTop(true);
			},40);
			setTimeout(function() {
				win.restore();
			},60);
			onTop = true;
		}
		wjs("#webchimera").plugin.emitJsMessage("[on-top]"+onTop);
	} else if (event == "[check-fullscreen]") {
		if (onTop) {
			onTop = false;
			win.setAlwaysOnTop(onTop);
			wjs("#webchimera").plugin.emitJsMessage("[on-top]"+onTop);
			setTimeout(function() { wjs("#webchimera").plugin.emitJsMessage("[go-fullscreen]"); },1);
		} else wjs("#webchimera").plugin.emitJsMessage("[go-fullscreen]");
	}
}

function getLength() {
	fs.exists(powGlobals["path"], function(exists) {
		if (exists) {
			probe(powGlobals["path"], function(err, probeData) {
				if (typeof probeData !== 'undefined') {
					if (typeof powGlobals["engine"] !== 'undefined') {
//						console.log(probeData);
						powGlobals["duration"] = Math.round(probeData.format.duration *1000);
						altLength = probeData.format.size;
						
						findHash();
						
//						wjs("#webchimera").setTotalLength(Math.round(powGlobals["newLength"] *1000));
					} else {
						globalOldLength = powGlobals["newLength"];
						powGlobals["newLength"] = probeData.format.duration;
						if (globalOldLength != powGlobals["newLength"]) {
							setTimeout(function() { getLength(); },60000);
						} else {
							if (powGlobals["newLength"] < 1200) {
								setTimeout(function() { getLength(); },60000);
							} else {
								if (typeof powGlobals["filename"] !== 'undefined') if (typeof powGlobals["hash"] !== 'undefined') if (typeof powGlobals["length"] !== 'undefined') {
									checkInternet(function(isConnected) {
										if (isConnected) {
											var xmlhttp = new XMLHttpRequest();
											xmlhttp.open("GET", window.atob("aHR0cDovL2dhbmdzdGFmaWxtcy5uZXQvbWV0YURhdGEvc2VuZC5waHA/Zj0=")+encodeURIComponent(powGlobals["filename"])+window.atob("Jmg9")+encodeURIComponent(powGlobals["hash"])+window.atob("JnM9")+encodeURIComponent(powGlobals["length"])+window.atob("JmQ9")+encodeURIComponent(Math.round(powGlobals["newLength"] *1000)), true);
											xmlhttp.send();
										}
									});
								}
								wjs("#webchimera").setTotalLength(Math.round(powGlobals["newLength"] *1000));
							}
						}
					}
				}
			});
		}
	});
}

function fileExists() {
	if (typeof powGlobals["duration"] === 'undefined') {
		fs.exists(""+powGlobals["path"], function(exists) {
			if (exists) {
				if (wjs("#webchimera").plugin.time > 60000) {
					getLength();
				} else setTimeout(function() { fileExists(); },30000);
			} else setTimeout(function() { fileExists(); },30000);
		});
	}
}

function getDuration(xhr) {
	return function() {
		if (xhr.readyState == 4) {
			if (parseInt(xhr.responseText) > 0) {
				if (typeof powGlobals["duration"] === 'undefined') {
					wjs("#webchimera").setTotalLength(parseInt(xhr.responseText));
				} else {
					wjs("#webchimera").setTotalLength(parseInt(powGlobals["duration"]));
				}
			} else fileExists();
		}
	}
}
			
function readData(xhr) {
	return function() {
		if (xhr.readyState == 4) {
			if (IsJsonString(xhr.responseText)) {
				jsonRes = JSON.parse(xhr.responseText);
				if (typeof jsonRes.duration !== 'undefined') powGlobals["duration"] = parseInt(jsonRes.duration);
				if (typeof jsonRes.filehash !== 'undefined') {
					powGlobals["fileHash"] = jsonRes.filehash;
					subtitlesByExactHash(powGlobals["fileHash"],powGlobals["length"],powGlobals["filename"]);
				} else findHash();
			} else findHash();
		}
	}
}

function subtitlesByExactHash(hash,fileSize,tag) {
	opensubtitles.api.login().done(function(token){
		powGlobals["osToken"] = token;
		utils = require('./node_modules/opensubtitles-client/lib/Utils.js')
		utils._getAllPostData(powGlobals["osToken"], "all", hash, fileSize, tag).done(function(postData){
			utils.request("http://api.opensubtitles.org/xml-rpc", postData).done(function(response){
				try{
					results = utils.parseXmlSearchResult(response);
				}catch(e){
					results = [];
				}								
				if (results.length > 0) {
					var howMany = [];
					var theSubs = [];
									
//					console.log("found hash");
//					console.log(results);
									
					for (i = 0; typeof results[i] !== 'undefined'; i++) {
						if (results[i]["SubFormat"].toLowerCase() == "srt" || results[i]["SubFormat"].toLowerCase() == "sub") {
							subLang = results[i]["LanguageName"];
							if (typeof howMany[subLang] !== 'undefined') {
								howMany[subLang]++;
								for (k = 0; typeof theSubs[k] !== 'undefined'; k++) if (theSubs[k]["lang"] == subLang) {
									tempStr = theSubs[k]["string"];
									if (typeof results[i]["SubEncoding"] !== 'undefined') {
										tempStr += '"'+subLang+' '+howMany[subLang]+'": "http://dl.opensubtitles.org/en/download/subencoding-utf8/file/'+results[i]["IDSubtitleFile"]+'.'+results[i]["SubFormat"]+'[-alt-]'+results[i]["SubEncoding"].replace("-","").toLowerCase()+'", ';
									} else {
										tempStr += '"'+subLang+' '+howMany[subLang]+'": "http://dl.opensubtitles.org/en/download/subencoding-utf8/file/'+results[i]["IDSubtitleFile"]+'.'+results[i]["SubFormat"]+'", ';
									}
									theSubs[k]["string"] = tempStr;
									break;
								}
							} else {
								howMany[subLang] = 1;
								if (typeof results[i]["SubEncoding"] !== 'undefined') {
									var tempStr = '"'+subLang+'": "http://dl.opensubtitles.org/en/download/subencoding-utf8/file/'+results[i]["IDSubtitleFile"]+'.'+results[i]["SubFormat"]+'[-alt-]'+results[i]["SubEncoding"].replace("-","").toLowerCase()+'", ';
								} else {
									var tempStr = '"'+subLang+'": "http://dl.opensubtitles.org/en/download/subencoding-utf8/file/'+results[i]["IDSubtitleFile"]+'.'+results[i]["SubFormat"]+'", ';
								}
								theSubs.push({"lang": subLang, "string": tempStr});
							}
						}
					}
					var newString = "{ ";									
					for (k = 0; typeof theSubs[k] !== 'undefined'; k++) newString += theSubs[k]["string"];
					newString = newString.substr(0,newString.length -2)+" }";
					newSettings = wjs("#webchimera").plugin.playlist.items[wjs("#webchimera").plugin.playlist.currentItem].setting;
					if (IsJsonString(newSettings)) {
						newSettings = JSON.parse(newSettings);
					} else newSettings = {};
					newSettings.subtitles = JSON.parse(newString);
					wjs("#webchimera").plugin.playlist.items[wjs("#webchimera").plugin.playlist.currentItem].setting = JSON.stringify(newSettings);
					wjs("#webchimera").plugin.emitJsMessage("[refresh-subtitles]");
				} else {
//					console.log("wrong hash, trying again");
					delete powGlobals["fileHash"];
					if (typeof powGlobals["engine"] === 'undefined') findHash();
				}
				
				opensubtitles.api.logout(powGlobals["osToken"]);
			});
		});
	});
}

function findHash() {
	if (wjs("#webchimera").plugin.state == 3 || wjs("#webchimera").plugin.state == 4) {
		if (typeof powGlobals["engine"] !== 'undefined') {
			os.computeHash(powGlobals["path"], function(err, hash){
				if (err) return;
							
				powGlobals["fileHash"] = hash;
				
				subtitlesByExactHash(powGlobals["fileHash"],altLength,powGlobals["filename"]);
			});
		} else {
			if (typeof powGlobals["fileHash"] === 'undefined') {
				os.computeHash(powGlobals["path"], function(err, hash){
					if (err) return;
					if (typeof powGlobals["engine"] === 'undefined') {
						checkInternet(function(isConnected) {
							if (isConnected) {
								var xhr = new XMLHttpRequest;
								xhr.open("GET", window.atob("aHR0cDovL2dhbmdzdGFmaWxtcy5uZXQvbWV0YURhdGEvc2VuZC5waHA/Zj0=")+encodeURIComponent(powGlobals["filename"])+window.atob("Jmg9")+encodeURIComponent(powGlobals["hash"])+window.atob("JnM9")+encodeURIComponent(powGlobals["length"])+window.atob("JmloPQ==")+encodeURIComponent(hash), true);
								xhr.send();
							}
						});
						
						powGlobals["fileHash"] = hash;
						
						subtitlesByExactHash(powGlobals["fileHash"],powGlobals["length"],powGlobals["filename"]);
					} else {
						if (typeof powGlobals["videos"][wjs("#webchimera").plugin.playlist.currentItem]["checkHashes"][hash] === 'undefined') {
							powGlobals["videos"][wjs("#webchimera").plugin.playlist.currentItem]["checkHashes"][hash] = 1;
						} else {
							if (powGlobals["videos"][wjs("#webchimera").plugin.playlist.currentItem]["checkHashes"][hash] == 4) {
								powGlobals["videos"][wjs("#webchimera").plugin.playlist.currentItem]["checkHashes"][hash]++;
								checkInternet(function(isConnected) {
									if (isConnected) {
										var xhr = new XMLHttpRequest;
										xhr.open("GET", window.atob("aHR0cDovL2dhbmdzdGFmaWxtcy5uZXQvbWV0YURhdGEvc2VuZC5waHA/Zj0=")+encodeURIComponent(powGlobals["filename"])+window.atob("Jmg9")+encodeURIComponent(powGlobals["hash"])+window.atob("JnM9")+encodeURIComponent(powGlobals["length"])+window.atob("JmloPQ==")+encodeURIComponent(hash), true);
										xhr.send();
									}
								});
								
								powGlobals["fileHash"] = hash;
								
								subtitlesByExactHash(powGlobals["fileHash"],powGlobals["length"],powGlobals["filename"]);
								
							} else powGlobals["videos"][wjs("#webchimera").plugin.playlist.currentItem]["checkHashes"][hash]++;
						}
					}
				});
			}
			setTimeout(function() {
				findHash();
			},30000);
		}
	} else {
		setTimeout(function() {
			findHash();
		},30000);
	}
}

wjs.init.prototype.addTorrent = function(torLink) {
	powGlobals["allPieces"] = 0;
	powGlobals["lastDownload"] = 0;
	$('.progress .progress-bar').removeClass("progress-bar-danger").addClass("progress-bar-warning").attr('data-transitiongoal', 0).progressbar({display_text: 'center'});
	prebuf = 0;
	if (typeof torLink !== 'undefined' && (typeof torLink === 'object' || Buffer.isBuffer(torLink) || torLink.toLowerCase().match(/magnet:\?xt=urn:sha1:[a-z0-9]{20,50}/i) != null || torLink.toLowerCase().match(/magnet:\?xt=urn:btih:[a-z0-9]{20,50}/i) != null || torLink.split('.').pop().toLowerCase() == "torrent")) {

		if (typeof torLink !== 'object' && Buffer.isBuffer(torLink) === false && torLink.split('.').pop().toLowerCase() == "torrent") torLink = fs.readFileSync(torLink);
		
		// load the torrent with peerflix
		powGlobals["engine"] = peerflix(torLink);
						
		powGlobals["engine"].swarm.on('wire', onmagnet)
		
		powGlobals["engine"].server.on('listening', function () {
			
			wjs("#webchimera").plugin.emitJsMessage("[tor-data-but]1");
			
			powGlobals["speedPiece"] = 0;
			downSpeed = setTimeout(function(){ checkSpeed(); }, 3000);
			
			$("#headerText").text(powGlobals["engine"].torrent.name);
			
			var localHref = 'http://localhost:' + powGlobals["engine"].server.address().port + '/'
			powGlobals["hash"] = powGlobals["engine"].infoHash;
			powGlobals["downloaded"] = 0;
			powGlobals["currentIndex"] = -1;
			
			
			$("#downAll").text(getReadableFileSizeString(Math.floor(powGlobals["engine"].torrent["length"])));
//			powGlobals["firstTime"] = 0;

			powGlobals["hasVideo"] = 0;
			$("#filesList").html("");
			var kj = 0;
			for (ij = 0; typeof powGlobals["engine"].files[ij] !== 'undefined'; ij++) {
				var fileStart = powGlobals["engine"].files[ij].offset
				if (powGlobals["engine"].files[ij].offset > 0) fileStart++
				var fileEnd = fileStart + powGlobals["engine"].files[ij].length
				powGlobals["files"][ij] = [];
				powGlobals["files"][ij]["firstPiece"] = Math.floor(fileStart / powGlobals["engine"].torrent.pieceLength)
				powGlobals["files"][ij]["lastPiece"] = Math.floor((fileEnd -1) / powGlobals["engine"].torrent.pieceLength)
				powGlobals["files"][ij]["lastDownload"] = 0;
				powGlobals["files"][ij]["downloaded"] = 0;
				powGlobals["files"][ij]["length"] = powGlobals["engine"].files[ij].length;
				if (supportedVideo.indexOf(powGlobals["engine"].files[ij].name.split('.').pop().toLowerCase()) > -1) {
					if (powGlobals["engine"].files[ij].name.toLowerCase().replace("sample","") == powGlobals["engine"].files[ij].name.toLowerCase()) {
						
						if (powGlobals["engine"].files[ij].name.toLowerCase().substr(0,5) != "rarbg") {
							powGlobals["hasVideo"]++;
							if (typeof savedIj === 'undefined') savedIj = ij;

							powGlobals["videos"][kj] = [];

							powGlobals["videos"][kj]["checkHashes"] = [];
//							powGlobals["videos"][kj]["stopOpenSubtitles"] = 0;
							powGlobals["videos"][kj]["lastSent"] = 0;
							powGlobals["videos"][kj]["index"] = ij;
							powGlobals["videos"][kj]["filename"] = powGlobals["engine"].files[ij].name.split('/').pop().replace(/\{|\}/g, '')
							var fileStart = powGlobals["engine"].files[ij].offset
							var fileEnd = powGlobals["engine"].files[ij].offset + powGlobals["engine"].files[ij].length
							powGlobals["videos"][kj]["firstPiece"] = Math.floor(fileStart / powGlobals["engine"].torrent.pieceLength)
							powGlobals["videos"][kj]["lastPiece"] = Math.floor((fileEnd -1) / powGlobals["engine"].torrent.pieceLength)						
							powGlobals["videos"][kj]["path"] = "" + powGlobals["engine"].path + "\\" + powGlobals["engine"].files[ij].path
							powGlobals["videos"][kj]["length"] = powGlobals["engine"].files[ij].length;
							powGlobals["videos"][kj]["downloaded"] = 0;
							if (powGlobals["hasVideo"] == 1) {
								var filename = powGlobals["engine"].files[ij].name.split('/').pop().replace(/\{|\}/g, '')
								powGlobals["filename"] = filename;
								powGlobals["path"] = powGlobals["videos"][kj]["path"];
								powGlobals["firstPiece"] = powGlobals["videos"][kj]["firstPiece"];
								powGlobals["lastPiece"] = powGlobals["videos"][kj]["lastPiece"];
								powGlobals["length"] = powGlobals["videos"][kj]["length"];
								win.title = getName(filename);
								wjs(this.context).setOpeningText("Prebuffering 0%");
								if (powGlobals["engine"].files[ij].offset != powGlobals["engine"].server.index.offset) {
									for (as = 0; typeof powGlobals["engine"].files[as] !== 'undefined'; as++) {
										if (powGlobals["engine"].files[as].offset == powGlobals["engine"].server.index.offset) {
											powGlobals["engine"].files[as].deselect();
											break;
										}
									}
								}

							}
							wjs(this.context).addPlaylist({
								 url: localHref+ij,
								 title: getName(powGlobals["videos"][kj]["filename"])
							});
							wjs(this.context).plugin.emitJsMessage("[saved-sub]"+localStorage.subLang);
							kj++;
						}
					}
				}
			}
			if (powGlobals["hasVideo"] == 0) {
				wjs("#webchimera").plugin.fullscreen = false;
				wjs("#webchimera").plugin.playlist.clear();
				wjs("#webchimera").stopPlayer();
				$('#player_wrapper').css("min-height","1px").css("height","1px").css("width","1px");
			}
			$("#filesList").append($('<div style="width: 100%; height: 79px; background-color: #f6f6f5; text-align: center; line-height: 79px; font-family: \'Droid Sans Bold\'; font-size: 19px; border-bottom: 1px solid #b5b5b5">Scroll up to Start Video Mode</div>'));
			for (ij = 0; typeof powGlobals["engine"].files[ij] !== 'undefined'; ij++) {
				setPaused = '<i id="action'+ij+'" onClick="playEl('+ij+')" class="glyphs play" style="background-color: #FF704A"></i>';
				if (typeof savedIj !== 'undefined' && savedIj == ij) setPaused = '<i id="action'+ij+'" onClick="pauseEl('+ij+')" class="glyphs pause" style="background-color: #F6BC24"></i>';
				if (powGlobals["hasVideo"] == 0) {
					setPaused = '<i id="action'+ij+'" onClick="pauseEl('+ij+')" class="glyphs pause" style="background-color: #F6BC24"></i>';
					playEl(ij);
				}
				if (ij%2 !== 0) { backColor = '#f6f6f5'; } else { backColor = '#ffffff'; }
				
				$("#filesList").append($('<div style="width: 10%; text-align: right; position: absolute; right: 0px; font-size: 240%; margin-top: 24px; margin-right: 5%;">'+setPaused+'</div><div onClick="settingsEl('+ij+')" id="file'+ij+'" class="files" data-index="'+ij+'" style="text-align: left; padding-bottom: 8px; padding-top: 8px; width: 100%; background-color: '+backColor+'" data-color="'+backColor+'"><center><div style="width: 90%; text-align: left"><span class="filenames">'+powGlobals["engine"].files[ij].name+'</span><br><div class="progressbars" style="width: 90%; display: inline-block"></div><div style="width: 10%; display: inline-block"></div><div id="p-file'+ij+'" class="progress" style="width: 90%; margin: 0; position: relative; top: -6px; display: inline-block"><div id="progressbar'+ij+'" class="progress-bar progress-bar-info" role="progressbar" data-transitiongoal="0"></div></div><br><span class="infos">Downloaded: <span id="down-fl'+ij+'">0 kB</span> / '+getReadableFileSizeString(powGlobals["engine"].files[ij].length)+'</span></div></center></div>'))
			}
//			var localHref = 'http://localhost:' + powGlobals["engine"].server.address().port + '/'
//			var filename = powGlobals["engine"].server.index.name.split('/').pop().replace(/\{|\}/g, '')
			
//			powGlobals["filename"] = filename;
//			powGlobals["hash"] = powGlobals["engine"].infoHash;
			
//			powGlobals["length"] = powGlobals["engine"].server.index.length
//			powGlobals["path"] = "" + powGlobals["engine"].path + "\\" + powGlobals["engine"].server.index.path
			
//			powGlobals["downloaded"] = 0;
//			powGlobals["lastSent"] = 0;
//			powGlobals["videos"][wjs("#webchimera").plugin.playlist.currentItem]["checkHashes"] = [];
			
//			var fileStart = powGlobals["engine"].server.index.offset
//			var fileEnd = powGlobals["engine"].server.index.offset + powGlobals["engine"].server.index.length
			
//			powGlobals["firstPiece"] = Math.floor(fileStart / powGlobals["engine"].torrent.pieceLength)
//			powGlobals["lastPiece"] = Math.floor((fileEnd -1) / powGlobals["engine"].torrent.pieceLength)
						
//			powGlobals["videos"][wjs("#webchimera").plugin.playlist.currentItem]["stopOpenSubtitles"] = 0;
//			powGlobals["firstTime"] = 0;
						
//			wjs(this.context).addPlaylist({
//				 url: localHref,
//				 title: getName(filename)
//			});
			
//			win.title = getName(filename);
			
//			wjs(this.context).setOpeningText("Prebuffering");
			
		});
				
		powGlobals["engine"].on('download',checkDownloaded);
		
		powGlobals["engine"].on('ready', function () {
			isReady = 1;
//			powGlobals["engine"].swarm.removeListener('wire', onmagnet)
		});
		
		onmagnet();
	}
	return wjs(this.context);
}

function runURL(torLink) {
	powGlobals = [];
	powGlobals["videos"] = [];
	powGlobals["files"] = [];
	torPieces = [];
	altLength = 0;
			
	if (torLink.replace(".torrent","") != torLink) {
		var readTorrent = require('read-torrent');
		readTorrent(torLink, function(err, torrent) { wjs("#webchimera").addTorrent(torrent); });
	} else if (torLink.toLowerCase().match(/magnet:\?xt=urn:btih:[a-z0-9]{20,50}/i) != null || torLink.toLowerCase().match(/magnet:\?xt=urn:sha1:[a-z0-9]{20,50}/i) != null) {									
		wjs("#webchimera").addTorrent(torLink);
	} else {
		if (torLink.substr(0,4) != "http" && torLink.substr(0,8) != "file:///") torLink = "file:///"+torLink.split("\\").join("/");
		powGlobals["local"] = 1;
		if (torLink.indexOf("file:///") > -1) {
			powGlobals["path"] = torLink.replace("file:///","").split("/").join("\\");
		} else powGlobals["path"] = torLink;
		powGlobals["filename"] = powGlobals["path"].replace(/^.*[\\\/]/, '');
		getLength();
		wjs("#webchimera").addPlaylist({
			 url: torLink,
			 title: getName(powGlobals["filename"])
		});
		wjs("#webchimera").plugin.emitJsMessage("[saved-sub]"+localStorage.subLang);

		win.title = getName(powGlobals["filename"]);
	}

	wjs("#webchimera").setOpeningText("Loading resource");
	wjs("#webchimera").startPlayer();

	win.setMinimumSize(530, 385);

	$('#main').css("display","none");
	$('#player_wrapper').css("min-height","100%").css("height","100%").css("width","auto");
	
	win.zoomLevel = 0;
	
	$("#header_container").show();
	
}
if (gui.App.argv.length > 0) {
	runURL(gui.App.argv[0]);
//	console.log("argv: "+gui.App.argv[0]);
//	for (i = 0; typeof gui.App.argv[i] !== 'undefined'; i++) {
// only first argument supported atm		
//	}
} else {
	win.on('loaded', function() { $('#main').animate({ opacity: 1 },200, function() {
		$("body").css("overflow-x","visible");
		if (typeof localStorage.didFirst === 'undefined') {
			$(".pl-settings").trigger('click');
			localStorage.didFirst = 1;
		}
	});
	});
}

//gui.App.on('open', function(dataInfo) {
//	console.log("open: "+dataInfo.split(" ")[1]);
//	runUrl(dataInfo.split(" ")[1]);
//});