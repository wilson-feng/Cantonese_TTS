// Set up context menu at install time.
chrome.runtime.onInstalled.addListener(function() {
	var context = "selection";
	var title = "Cantonese TTS";
	var id = chrome.contextMenus.create({"title": title, "contexts":[context],
										 "id": "context" + context});  
});

// add click event
chrome.contextMenus.onClicked.addListener(onClickHandler);

// The onClicked callback function.
function onClickHandler(info, tab) {
	var sText = info.selectionText;
	var url = "http://translate.google.com/translate_tts?&tl=zh-yue&ie=UTF-8&q=" + encodeURIComponent(sText); 

	var req = new XMLHttpRequest();
	req.open('GET', url, true);
	req.responseType = "arraybuffer";
  
	req.send();
	
	req.onreadystatechange = function () {
		var a_context = new AudioContext();
		var cantoTTS;

		if(req.readyState == 4 && req.status == 200){

			a_context.decodeAudioData(req.response, function(buffer){
				cantoTTS = buffer;
				var playSound = a_context.createBufferSource();
				playSound.buffer = cantoTTS;
				playSound.connect(a_context.destination);
				playSound.start(0);
			});
			
		}
			
	};
  
};