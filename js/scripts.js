window.presentation_mode_active = true;

function coverOpenHandler() {
	Cookies.set('doNotShow', 'false', { expires: 30 });
	console.log("DoNotShow: "+Cookies.get('doNotShow'));
	document.getElementById('control_panel').classList.remove('hidden');
	document.getElementById('instructions_panel').classList.add('hidden');
}
function doNotShow(e) {
	Cookies.set('doNotShow', 'true', { expires: 30 });
	console.log("DoNotShow: "+Cookies.get('doNotShow'));
	document.getElementById('control_panel').classList.remove('hidden');
	document.getElementById('instructions_panel').classList.add('hidden');
}
function presentationModeClickHandler(e) {
	if(window.presentation_mode_active) {
		window.presentation_mode_active = false;
	} else {
		window.presentation_mode_active = true;
	}
	document.getElementById('myonoffswitch').classList.toggle('active');
}
function buttonMouseDownHandler(e) {
	if(window.presentation_mode_active) {
		if(this.classList.contains('active')) {
			this.classList.remove('active');
			cover_indicator.classList.remove('active');
			console.log("laser off");
			Nexpaq.API.Module.SendCommand(Nexpaq.Arguments[0], 'TurnOffLaser', []);
		} else {
			this.classList.add('active');
			cover_indicator.classList.add('active');
			console.log("laser on");
			Nexpaq.API.Module.SendCommand(Nexpaq.Arguments[0], 'TurnOnLaser', []);
		}
	} else {
		this.classList.add('active');
		cover_indicator.classList.add('active');
		console.log("laser on");
		Nexpaq.API.Module.SendCommand(Nexpaq.Arguments[0], 'TurnOnLaser', []);
	}
}
function buttonMouseUpHandler(e) {
	if(!window.presentation_mode_active) {
		this.classList.remove('active');
		cover_indicator.classList.remove('active');
		console.log("laser off");
		Nexpaq.API.Module.SendCommand(Nexpaq.Arguments[0], 'TurnOffLaser', []);
	}
}

document.addEventListener('NexpaqAPIReady', function(event) {
	Nexpaq.API.Module.SendCommand(Nexpaq.Arguments[0], 'RequestStatus', []);

	Nexpaq.API.Module.addEventListener('DataReceived', function(event) {
      // we don't care about data not related to our module
      if(event.module_uuid != Nexpaq.Arguments[0]) return;
	  if(event.data_source == 'LaserStateResponse') {
		if(event.variables.laser_state == 'on') {
			document.getElementById('laser_button').classList.add('active');
			cover_indicator.classList.add('active');
			console.log("laser on");
		}
	  }

    });  
});

/* =========== ON PAGE LOAD HANDLER */
document.addEventListener("DOMContentLoaded", function(event) {
	Nexpaq.Header.create('Laser');
	Nexpaq.Header.customize({backgroundColor:"black",color:"#FFFFFF",iconColor:"#FFFFFF", borderBottom: "none"});
	Nexpaq.Header.hideShadow();

	document.getElementById('myonoffswitch').addEventListener('change', presentationModeClickHandler);
	document.getElementById('button-close-instruction').addEventListener('click', coverOpenHandler);
	document.getElementById('button-doNotShow').addEventListener('click', doNotShow);
	document.getElementById('laser_button').addEventListener('touchstart', buttonMouseDownHandler);
	document.getElementById('laser_button').addEventListener('touchend', buttonMouseUpHandler);
	console.log("DoNotShow: "+Cookies.get('doNotShow'));
	if(Cookies.get('doNotShow') == 'true') {
		document.getElementById('instructions_panel').classList.add('hidden');
		document.getElementById('control_panel').classList.remove('hidden');
	} else {
		document.getElementById('control_panel').classList.add('hidden');
		document.getElementById('instructions_panel').classList.remove('hidden');
	}	
});
