var ang = 0;
var startVel;
var vel;
var wheelRotating = false;
var rotInt;
var correctionFactor;
var angNew;
var angOld = 112;
var pegColor;
var dir;
var sound;
var friction = 1.5;
var pegFriction = 2.5;
var pegTimeout;
var pegSpeed;
var viewportHeight;
var viewportWidth;
var isMobileWidth;
var spinDelay;
var showVideos;

//******* Wheel Effects ***********

function startWheel(){
	if(videoWalkinPlaying == false && videoSpinPlaying == false && videoWalkoutPlaying == false){
		startMessageVisible = false;
		if(isMobileWidth == true || showVideos == false){
			spinDelay = 0;
		} else {
			spinDelay = allPersons[currentPersonIndex].spinDelay;
		}
		$('#startMessageContainer').animate({'top':startMessageContainerTopPosUp},500,'easeInBack',function(){
			if(isMobileWidth == false){
				switchToSpinningVid();
			}
			$('#wheelDarkening').css({'display':'none'});
			setTimeout(function(){
				wheelRotating = true;
				startVel = -1*(200 + Math.random()*100 - 50);
				//startVel = -150;
				vel = startVel;
				rotInt = setInterval(function(){
					rotateWheel();
				},16);
			},spinDelay);
		});
	}
}

function stopWheel(finishedAngle){
	wheelRotating = false;
	clearInterval(rotInt);
	switch(parseInt((360*((finishedAngle/360)-parseInt(finishedAngle/360))-11.25)/22.5)){
		case -0:
		case -3:
		case -7:
		case -10:
		case -13:
			selectedCategoryID = 0;
			break;
		case -1:
		case -5:
		case -8:
		case -11:
		case -14:
			selectedCategoryID = 1;
			break;
		case -2:
		case -6:
		case -9:
		case -12:
		case -15:
			selectedCategoryID = 2;
			break;
		case -4:
			selectedCategoryID = 3;
	}
	//selectedCategoryID = 3;
	launchWinningCategory(selectedCategoryID);
	//spinAgain();
}

function pegUp(pegAng,pegSpd){
	$('#clickerPeg').rotate({animateTo:pegAng,duration:pegSpd,center:["60%","40%"]});
}

function pegDown(){
	$('#clickerPeg').rotate({animateTo:0,duration:100});
}

//function beep(){
//	sound.pause();
//	sound.currentTime = 0;
//	sound.play();
//}

//function beepIE(){
//	sound.stop();
//	sound.play();
//}

function rotateWheel(){
	dir = vel >= 0 ? 'aClockwise' : 'clockwise';
	if (dir == 'aClockwise'){
		if (vel > 0.01 || vel < -0.01){
			vel -= friction/100 + friction*vel/startVel;
		}else{ // Wheel has finished
			stopWheel(ang/10);
		}
		angNew = ang + vel;
		if ((angNew - angOld) > 225){ //hit a clickerPeg
			angOld += 225;
			correctionFactor = pegFriction;
			//if(browser.isIE == true){beepIE();}else{beep();}
			if(vel - correctionFactor > 0){
				vel -= correctionFactor*0.8;
				pegSpeed = 75*(1-(vel/startVel));
				clearTimeout(pegTimeout);
				pegUp(-60,pegSpeed);
				pegTimeout = setTimeout(function(){pegDown();},pegSpeed);
			} else {
				vel = -1.01*vel;
				clearTimeout(pegTimeout);
				pegUp(-10,100);
				pegTimeout = setTimeout(function(){pegDown();},100);
			}
		} else { // not hit a clickerPeg
			correctionFactor = 0;
		}
	} else {
		if (vel > 0.01 || vel < -0.01){
			vel += friction/100 + friction*vel/startVel;
		}else{
			stopWheel(ang/10); //Wheel has finished
		}
		angNew = ang + vel;
		if ((angOld - angNew) > 225){ //hit a clickerPeg
			angOld -= 225;
			correctionFactor = -1*pegFriction;
			//if(browser.isIE == true){beepIE();}else{beep();}
			if(vel - correctionFactor < 0){
				vel -= correctionFactor*0.8;
				pegSpeed = 75*(1-(vel/startVel));
				clearTimeout(pegTimeout);
				pegUp(60,pegSpeed);
				pegTimeout = setTimeout(function(){pegDown();},pegSpeed);
			} else {
				vel = -0.9*vel;
				clearTimeout(pegTimeout);
				pegUp(10,100);
				pegTimeout = setTimeout(function(){pegDown();},100);
			}
		} else { // not hit a clickerPeg
			correctionFactor = 0;
		}
	}
	ang += vel;
	$('#wheelCategories').rotate(ang/10);
}

//******* Intro Page Effects *********
var msgLine3Height;
var introAnimationComplete = false;


function initIntroAnimation(){
	$('#msgLine1').css({'left':-0.5*(viewportWidth + $('#msgLine1').width()),'opacity':0});
	$('#msgLine2').css({'left': 0.5*(viewportWidth + $('#msgLine1').width()),'opacity':0});
	$('#SWLogo').css({'left':0.5*(viewportWidth + $('#SWLogo').width())});
	$('#withThe').css({'left': -0.5*(viewportWidth + $('#withThe').width())});
	$('#msgLine4').css({'opacity':0});
	$('#scrollTapContainer').css({'opacity':0});
}

function runIntroAnimation(){
	introAnimationComplete = false;
	$('#msgLine1').animate({'left': 0,'opacity': 1},500,'easeOutQuad',function(){
		$('#msgLine2').animate({'left': 0,'opacity': 1},500,'easeOutQuad',function(){
			$('#withThe').delay(500).animate({'left':0},500,'easeOutQuad');
			$('#SWLogo').delay(500).animate({'left': 0},500,'easeOutQuad',function(){
				$('#msgLine4').delay(1000).animate({'opacity':1},10,'easeOutQuad',function(){
					$('#scrollTapContainer').delay(1000).animate({'opacity':1},2000,'easeOutQuad', function(){
						introAnimationComplete = true;
					});
					initMainPage();
				});
			});
		});
	});

}

function setIntroAnimationToEnd(){
	$('#msgLine1').stop(true,true).css({'left':0,'opacity':1});
	$('#msgLine2').stop(true,true).css({'left':0,'opacity':1});
	$('#msgLine3').stop(true,true).css({'left':0});
	$('#SWLogo').stop(true,true).css({'left':0}).removeClass('SWLogoFixed');
	$('#withThe').stop(true,true).css({'left':0,'opacity':1});
	$('#msgLine4').stop(true,true).css({'opacity':1});
	$('#topBar').css({'opacity':0});
	$('#topBarBack').css({'opacity':0});
	$('#bottomBar').css({'opacity':0});
	$('#FSSTLogoImg').css({'width':'','opacity':1});
	$('#scrollTapContainer').stop(true,true).css({'opacity':1});
	$('#SWLogoImgBlack').css({'width':'','opacity':1})
	$('#msgLine4').removeClass('FSSTLogoFixed');
}

function introPageScroll(){
	$('html,body').animate({scrollTop:viewportHeight},2000,'easeOutExpo');
}

//******* Scroll Page Effects *********
var FSSTLogoTop;
var SWLogoTop;
var windowScrollTop;
var controller
var scene1;
var scene2;
var scene3;
var scene4;
var scene5;
var scene6;
var scene7;
var scene8;
var scene9;
var scene10;
var scene11;
var logo1Fixed = false;
var logo2Fixed = false;

function initScrollEffects(){
	controller = new ScrollMagic();
	FSSTLogoTop = $('#msgLine4').position().top + 48;
	SWLogoTop = $('#msgLine3').position().top + 20;

	scene1 = new ScrollScene({offset: 0, reverse: true, duration: 200}).setTween(TweenMax.to('#msgLine1',1,{'left':-0.5*(viewportWidth + $('#msgLine1').width()),'opacity':0}));
	scene2 = new ScrollScene({offset: 0, reverse: true, duration: 200}).setTween(TweenMax.to('#msgLine2',1,{'left':0.5*(viewportWidth + $('#msgLine1').width()),'opacity':0}));
	scene3 = new ScrollScene({offset: 100, reverse: true, duration: SWLogoTop-100}).setTween(TweenMax.to('#msgLine3',1,{'left':-0.5*viewportWidth + $('#SWLogo').width()- 0.5*$('#msgLine3').width()+20}));
	scene4 = new ScrollScene({offset: 100, reverse: true, duration: 200}).setTween(TweenMax.to('#withThe',1,{'opacity':0}));
	scene5 = new ScrollScene({offset: 100, reverse: true, duration: FSSTLogoTop + 74 - 100}).setTween(TweenMax.to('#FSSTLogoImg',1,{'width':323}));
	scene6 = new ScrollScene({offset: 100, reverse: true, duration: 200}).setTween(TweenMax.to('#scrollTapContainer',1,{'opacity':0}));
	scene7 = new ScrollScene({offset: FSSTLogoTop, reverse: true, duration: 200}).setTween(TweenMax.to('#topBar',1,{'opacity':1}));
	scene8 = new ScrollScene({offset: FSSTLogoTop, reverse: true, duration: 200}).setTween(TweenMax.to('#topBarBack',1,{'opacity':1}));
	scene9 = new ScrollScene({offset: FSSTLogoTop, reverse: true, duration: 200}).setTween(TweenMax.to('#bottomBar',1,{'opacity':1}));
	scene10 = new ScrollScene({offset: FSSTLogoTop, reverse: true, duration: 200}).setTween(TweenMax.to('#SWLogoImgBlack',1,{'opacity':0}));	
	scene11 = new ScrollScene({offset: FSSTLogoTop, reverse: true, duration: 200}).setTween(TweenMax.to('#FSSTLogoImg',1,{'opacity':0}));
	
	
	controller.addScene([scene1,scene2,scene3,scene4,scene5,scene6,scene7,scene8,scene9,scene10,scene11]);
}

function reInitScrollEffects(){

	setIntroAnimationToEnd();
	
	FSSTLogoTop = $('#msgLine4').position().top + 48;
	SWLogoTop = $('#msgLine3').position().top + 20;
	
	scene1.setTween(TweenMax.to('#msgLine1',1,{'left':-0.5*(viewportWidth + $('#msgLine1').width()),'opacity':0}));
	scene2.setTween(TweenMax.to('#msgLine2',1,{'left':0.5*(viewportWidth + $('#msgLine1').width()),'opacity':0}));
	scene3.duration(SWLogoTop-100).setTween(TweenMax.to('#msgLine3',1,{'left':-0.5*viewportWidth + $('#SWLogo').width()- 0.5*$('#msgLine3').width()+20}));
	scene5.duration(FSSTLogoTop + 74 - 100).setTween(TweenMax.to('#FSSTLogoImg',1,{'width':323}));
	scene7.offset(FSSTLogoTop-100).setTween(TweenMax.to('#topBar',1,{'opacity':1}));
	scene8.offset(FSSTLogoTop-100).setTween(TweenMax.to('#topBarBack',1,{'opacity':1}));
	scene9.offset(FSSTLogoTop-100).setTween(TweenMax.to('#bottomBar',1,{'opacity':1}));
	scene10.offset(FSSTLogoTop-100).setTween(TweenMax.to('#SWLogoImgBlack',1,{'opacity':0}));
	scene11.offset(FSSTLogoTop-100).setTween(TweenMax.to('#FSSTLogoImg',1,{'opacity':0}));
	
	controller.updateScene([scene1,scene2,scene3,scene5,scene7,scene8,scene9,scene10,scene11]);
}

//****** Main Page Effects *********
var startMessageVisible = false;
var startMessageContainerTopPosUp;
var startMessageContainerTopPosDown;
var winningCategoryBannerTopPosUp;
var winningCategoryBannerTopPosDown;
var introPageRemoved = false;
var winningCategoryBannerVisible = false;
var websiteIframeVisible = false;
var selectedCategoryID;
var selectedWebsiteID;
var websites = [
	{categoryName:'Xmas Fun', categoryFilename:'XmasFunNew.png', categoryWebsites: [ 
		{websiteName: 'Christmas + Small cute dogs. Game over.', websiteUrl: 'http://www.youtube.com/embed/4qSlFu4cy3o?autoplay=1'},
		{websiteName: 'Disco Santa.', websiteUrl: 'http://www.youtube.com/embed/Yh99e8BSer0?autoplay=1'},
		{websiteName: 'Christmas Tree Napkin Folding', websiteUrl: 'http://www.youtube.com/embed/plkWFQ89XyE?autoplay=1'},
		{websiteName: 'Simon\'s Cat - "Christmas Presence"', websiteUrl: 'http://www.youtube.com/embed/abPLDLV8O4s?autoplay=1'},
		{websiteName: 'Cats vs Christmas Trees', websiteUrl: 'http://www.youtube.com/embed/Pj2ceEcpbgg?autoplay=1'},
		{websiteName: 'Circles in the snow. Pretty!', websiteUrl: 'http://www.youtube.com/embed/nf5ZedXo1Ro?autoplay=1'},
		{websiteName: 'Minions. Christmas. Christmas Minions.', websiteUrl: 'http://www.youtube.com/embed/YJ50YCpYkqM?autoplay=1'},
		{websiteName: 'Jingle Cats. Say no more.', websiteUrl: 'http://www.youtube.com/embed/cHI8M1K2LXs?autoplay=1'},
		{websiteName: 'Drone captures Xmas light display from above.', websiteUrl: 'http://www.youtube.com/embed/ziXYL6sXVm8?autoplay=1'},
		{websiteName: 'Christmas in Hollis. The Emoticon Version', websiteUrl: 'http://www.youtube.com/embed/9g6EfPiO8iQ?autoplay=1'},
		{websiteName: 'Cats & Dogs & Snow & FAIL', websiteUrl: 'http://www.youtube.com/embed/azEIDf1YhiQ?autoplay=1'},
		{websiteName: 'Snowflakes are pretty awesome', websiteUrl: 'http://www.youtube.com/embed/DYgbsAWNHq0?autoplay=1'}         
	]},
	{categoryName:'Prize Draw', categoryFilename:'PrizeDrawNew.png', categoryWebsites: [ 
		{websiteName: 'Fabulous Prize Draw!!', websiteUrl: 'prizedraw.html'}
	]},
	{categoryName:'Surprise', categoryFilename:'SurpriseNew.png', categoryWebsites: [ 
		{websiteName: 'Smaller Worlders Festive Greetings', websiteUrl: 'http://www.youtube.com/embed/DqQjtyN2tPk?autoplay=1'}
	]}

];




function animateStartMessage(){
	$('#startMessageContainer').animate({'top':startMessageContainerTopPosDown},1000,'easeOutBounce');
	$('#intropageContainerTable').remove();
	controller.removeScene([scene1,scene2,scene3,scene4,scene5,scene6,scene7,scene8,scene9,scene10,scene11]);
	$('#topBar').css({'opacity':1});
	$('#topBarBack').css({'opacity':1});
	$('#bottomBar').css({'opacity':1});
	$('#mainPage').height(viewportHeight);
	introPageRemoved = true;
}

function preInitMainPage(){
	$('#mainPage').css({'display':'none'});
}

function initMainPage(){
	$('#mainPage').css({'display':''});
	$('#wheelContainer').height($('#wheelContainer').width());
	$('#nextPersonButtonContainer').height($('#nextPersonButtonContainer').width()*127/260);
}

function launchWinningCategory(){
	if(selectedCategoryID == 3){
		spinAgain();
	} else {
		$(window).trigger('resize');
		winningCategoryBannerVisible = true;
		document.getElementById('winningCategoryImg').src = 'image/' + websites[selectedCategoryID].categoryFilename;
		selectedWebsiteID = parseInt(Math.random()*websites[selectedCategoryID].categoryWebsites.length);
		$('#wMesgLine4').html(websites[selectedCategoryID].categoryWebsites[selectedWebsiteID].websiteName);
		$('#winningCategoryBanner').css({'top':winningCategoryBannerTopPosDown});
		$('#winningCategoryContainer').css({'top':-1*viewportHeight, 'opacity':1});
		$('#winningCategoryContainer').animate({'top':0},1000,'easeOutBounce', function(){
			launchWinningWebsite();
		});
		$('#winningCategoryContainerBack').animate({'opacity':1},5000);
	}
}

function launchWinningWebsite(){
	websiteIframeVisible = true;
	$('#websiteIframe').attr({'src':websites[selectedCategoryID].categoryWebsites[selectedWebsiteID].websiteUrl});
	setTimeout(function(){
		$('#winningCategoryBanner').animate({'top':winningCategoryBannerTopPosUp},500,'easeInBack',function(){
			winningCategoryBannerVisible = false;
		});
		$('#winningCategoryContainerBack').stop(true,true).css({'opacity':0});
		$('#websiteIframeContainer').css({'display':'block'});
		document.getElementById('websiteIframe').focus();
		$('#topBarBack').addClass('opaque');
		$('#bottomBar').addClass('opaque');
		if(selectedCategoryID == 0){
			$('#websiteSource').css({'display':'block'}).animate({'opacity':1});
		}
		$('#websiteSourceUrl').html(websites[selectedCategoryID].categoryWebsites[selectedWebsiteID].websiteUrl);
		$('#customTopText').html(websites[selectedCategoryID].categoryWebsites[selectedWebsiteID].websiteName);
		$('#customBottomText').html(websites[selectedCategoryID].categoryWebsites[selectedWebsiteID].websiteName);
		$('#spinAgain').animate({'opacity':1});
	},5000);
}

function spinAgain(){
	websiteIframeVisible = false;
	$('#topBarBack').removeClass('opaque');
	$('#bottomBar').removeClass('opaque');
	$('#websiteIframeContainer').css({'display':'none'});
	$('#websiteIframe').attr({'src':''});
	$('#spinAgain').animate({'opacity':0});
	$('#winningCategoryContainer').css({'top':-1*viewportHeight});
	$('#winningCategoryBanner').css({'top':winningCategoryBannerTopPosDown});
	$('#customTopText').html('Spinny-Spin-Thing');
	$('#customBottomText').html('Spinny-Spin-Thing');
	$('#websiteSource').css({'display':'none','opacity':0});
	nextPerson(true);
}

//******* Video Effects *********
var videoWalkin;
var videoStanding;
var videoSpin;
var videoWalkout;
var currentPersonIndex;
var currentPersonIndex;
var nextPersonIndex;
var nextPersonName;
var videoPath = '';
var videoWalkinPlaying = true;
var videoSpinPlaying = false;
var videoStandingPlaying = false;
var videoWalkoutPlaying = false;

var allPersons = [
	{personName: 'Cedric', walkoutLength: 3000, walkinLength: 3000, spinDelay: 600},
	{personName: 'Chris', walkoutLength: 3000, walkinLength: 3000, spinDelay: 1400},
	{personName: 'John', walkoutLength: 3200, walkinLength: 4000, spinDelay: 1700},
	{personName: 'Jude', walkoutLength: 2500, walkinLength: 3000, spinDelay: 1200},
	{personName: 'Kevin', walkoutLength: 3500, walkinLength: 3000, spinDelay: 1200},
	{personName: 'Reena', walkoutLength: 3000, walkinLength: 3000, spinDelay: 1600},
	{personName: 'Rosie', walkoutLength: 3000, walkinLength: 3000, spinDelay: 1550},
	{personName: 'Shazad', walkoutLength: 2600, walkinLength: 3000, spinDelay: 2200},
	{personName: 'Simon', walkoutLength: 3000, walkinLength: 3000, spinDelay: 700},
	{personName: 'Vonnie', walkoutLength: 2500, walkinLength: 3000, spinDelay: 1900},
	{personName: 'Dan', walkoutLength: 2500, walkinLength: 2500, spinDelay: 700},
	{personName: 'Jakub', walkoutLength: 3800, walkinLength: 2500, spinDelay: 1200}
];

function switchToStandingVid(element){
	if(showVideos == true){
		element.style.display = 'none';
		element.pause();
		element.currentTime = 0;
		videoStanding.style.display = '';
		videoStanding.play();
	}
}

function switchToSpinningVid(){
	if(showVideos == true){
		videoStanding.style.display = 'none';
		videoStanding.pause();
		videoStanding.currentTime = 0;
		videoSpin.style.display = '';
		videoSpin.play();
	}
}

function switchToWalkoutVid(){
	if(showVideos == true){
		videoStanding.style.display = 'none';
		videoStanding.pause();
		videoStanding.currentTime = 0;
		videoWalkout.style.display = '';
		videoWalkout.play();
	}
}

function switchToWalkinVid(autoSpin){
	if(showVideos == true){
		videoWalkout.style.display = 'none';
		videoWalkin.style.display = '';
		videoWalkin.play();
	}
	if(autoSpin == true){
		$('#startMessageContainer').animate({'top':startMessageContainerTopPosDown},1000,'easeOutBounce');
		$('#wheelDarkening').css({'display':'inline-block'});
		startMessageVisible = true;
		//setTimeout(function(){
			//startWheel();
		//},allPersons[currentPersonIndex].walkinLength)
	}
}

function initVideos(){
	//if(browser.isIE == false){
		initPerson();
		if(showVideos == true){
			videoWalkin.play();
		}
	//}
}

function cancelVideos(){
	if(showVideos == true){
		videoWalkin.src = '';
		videoStanding.src = '';
		videoSpin.src = '';
		videoWalkout.src = '';
	} else {
		gifStanding.src = '';
	}
}

function initPerson(){
	currentPersonIndex = parseInt(Math.random()*allPersons.length);
	//currentPersonIndex = 9;
	$('#personName').html('('+allPersons[currentPersonIndex].personName+')');
	if(isMobileWidth == false){
		if(showVideos == true){
			videoWalkin.src = videoPath + allPersons[currentPersonIndex].personName + '-_-WalkIn.mp4';
			videoStanding.src = videoPath + allPersons[currentPersonIndex].personName + '-_-Standing.mp4';
			videoSpin.src = videoPath + allPersons[currentPersonIndex].personName + '-_-Spin.mp4';
			videoWalkout.src = videoPath + allPersons[currentPersonIndex].personName + '-_-WalkOut.mp4';
			videoWalkin.play();
		} else {
			gifStanding.src = videoPath + allPersons[currentPersonIndex].personName + '-_-Standing.gif';
		}
	}
}

function nextPerson(autoSpin){
	if((videoSpinPlaying == false && videoWalkinPlaying == false && videoWalkoutPlaying == false) || autospin == true){
		switchToWalkoutVid();
		initNextPerson(autoSpin);
	}
}

function initNextPerson(autoSpin){
	if (currentPersonIndex == allPersons.length-1){
		nextPersonIndex = 0;
	} else {
		nextPersonIndex = currentPersonIndex + 1;
	}

	nextPersonName = allPersons[nextPersonIndex].personName

	if(showVideos == true){
		videoWalkin.src = videoPath + nextPersonName + '-_-WalkIn.mp4';
		videoStanding.src = videoPath + nextPersonName + '-_-Standing.mp4';
		videoSpin.src = videoPath + nextPersonName + '-_-Spin.mp4';
		setTimeout(function(){
			videoWalkoutPlaying=false;
			currentPersonIndex = nextPersonIndex;
			$('#personName').html('('+allPersons[currentPersonIndex].personName+')');
			switchToWalkinVid(autoSpin);
			videoWalkout.src = videoPath + nextPersonName + '-_-WalkOut.mp4';
		},allPersons[currentPersonIndex].walkoutLength);
	} else {
		if(isMobileWidth == false){
			gifStanding.src = videoPath + nextPersonName + '-_-Standing.gif';
		}
		currentPersonIndex = nextPersonIndex;
		switchToWalkinVid(autoSpin);
	}
}

//******** Page Event Handlers *********
var browser = {isIE:false,isIpad:false};

function checkBrowser(){
  try{document.documentMode = "";}catch(e){};
  browser.isIE = typeof document.documentMode == "number" || eval("/*@cc_on!@*/!1");
  browser.isIpad = navigator.userAgent.match(/iPad/i) != null;
  if(browser.version == 'IE9'){
	browser.isIpad = true;
  }
}

function initMobileWidth(){
	initPerson();
	cancelVideos();
	videoSpinPlaying = false;
	videoWalkinPlaying = false;
	videoWalkoutPlaying = false;
	$('#winningCategoryBannerImg').attr('src','image/optionSelectedBackgroundPortrait.png');
	winningCategoryBannerTopPosUp = -1*$('#winningCategoryBanner').height();
	winningCategoryBannerTopPosDown = -1*(0.63*$('#winningCategoryBanner').height()-viewportHeight/2);
}

function initFullWidth(){
	initVideos();
	$('#winningCategoryBannerImg').attr('src','image/optionSelectedBackground2.png');
	winningCategoryBannerTopPosUp = -1*$('#winningCategoryBanner').height();
	winningCategoryBannerTopPosDown = -1*(0.65*$('#winningCategoryBanner').height()-viewportHeight/2);
}

function initPage(){
	checkBrowser();
	//if(browser.isIE == true){
	//	sound = document.getElementById('beepIE');
	//} else {
	//	sound = document.getElementById('beep');
	//}
	$('html,body').animate({scrollTop:0},10);
	viewportHeight = $(window).height();
	viewportWidth = $(window).width();
	videoWalkin = document.getElementById('videoWalkin');
	videoStanding = document.getElementById('videoStanding');
	videoSpin = document.getElementById('videoSpin');
	videoWalkout = document.getElementById('videoWalkout');
	gifStanding = document.getElementById('gifImg');
	videoPath = '';
	for(i=0;i<videoWalkin.src.split('/').length-1;i++){
		videoPath += videoWalkin.src.split('/')[i];
		videoPath += '/';
	}
	if(browser.isIpad == false){
		showVideos = true;
	} else {
		showVideos = false;
		videoSpinPlaying = false;
		videoWalkinPlaying = false;
		videoWalkoutPlaying = false;
		$('#videoContainer').css({'display':'none'});
		$('#gifImgContainer').css({'display':'block'});
	}
	if(viewportWidth < 768){
		isMobileWidth = true;
		showVideos = false;
		initMobileWidth();
	} else {
		isMobileWidth = false;
		if(browser.isIpad == false){
			showVideos = true;
		}
		initFullWidth();
	}
	$('#intropageContainerTable').height(viewportHeight);
	$('#mainPage').height(viewportHeight);
	$('#winningCategoryBanner').css({'top':winningCategoryBannerTopPosDown});
	$('#winningCategoryContainer').css({'top':-1*viewportHeight, 'opacity':1});
	$('#intropageContainerTable').css({'display':'table'});
	startMessageContainerTopPosUp = -1*$('#startMessageContainer').height();
	startMessageContainerTopPosDown = -1*(0.955*$('#startMessageContainer').height()-viewportHeight/2);
	$('#startMessageContainer').css({'top':startMessageContainerTopPosUp,'opacity':1});
	scrollPage();
	initScrollEffects();
	preInitMainPage();
	initIntroAnimation();
	runIntroAnimation();
}

function scrollPage(){
	windowScrollTop = $(window).scrollTop();
	if(introAnimationComplete == false){
		$('#scrollTapContainer').stop(true,true).css({'opacity':1});
		introAnimationComplete = true;
	}
	if(windowScrollTop > SWLogoTop){
		$('#SWLogo').addClass('SWLogoFixed');
	} else {
		$('#SWLogo').removeClass('SWLogoFixed');
	}
	if(windowScrollTop > FSSTLogoTop){
		$('#msgLine4').addClass('FSSTLogoFixed');
	} else {
		$('#msgLine4').removeClass('FSSTLogoFixed');
	}
	if(windowScrollTop >= viewportHeight - 1){
		if(startMessageVisible == false){
			startMessageVisible = true;
			animateStartMessage();
		}
	}
	if(introPageRemoved == false){
		if(windowScrollTop > FSSTLogoTop-100){
			$('#bottomBar').css({'display':''});
		} else {
			$('#bottomBar').css({'display':'none'});
		}
	}
}

function resizePage(){
	viewportHeight = $(window).height();
	viewportWidth = $(window).width();
	if(viewportWidth < 768){
		if(isMobileWidth == false){
			isMobileWidth = true;
			showVideos = false;
			initMobileWidth();
		} 
		winningCategoryBannerTopPosUp = -1*$('#winningCategoryBanner').height();
		winningCategoryBannerTopPosDown = -1*(0.63*$('#winningCategoryBanner').height()-viewportHeight/2);
	} else {
		if(isMobileWidth == true){
			isMobileWidth = false;
			if(browser.isIpad == false){
				showVideos = true;
			}
			initFullWidth();
		} 
		winningCategoryBannerTopPosUp = -1*$('#winningCategoryBanner').height();
		winningCategoryBannerTopPosDown = -1*(0.65*$('#winningCategoryBanner').height()-viewportHeight/2);
	}
	$('#intropageContainerTable').height(viewportHeight);
	$('#mainPage').height(viewportHeight);
	winningCategoryBannerTopPosUp = -1*$('#winningCategoryBanner').height();
	if(websiteIframeVisible == false){
		$('#winningCategoryContainer').css({'top':-1*viewportHeight});
	} 
	if(winningCategoryBannerVisible == false){
		$('#winningCategoryBanner').css({'top':winningCategoryBannerTopPosUp});
	} else {
		$('#winningCategoryBanner').css({'top':winningCategoryBannerTopPosDown});
	}
	if(introPageRemoved == false){
		reInitScrollEffects();
		initMainPage();
	} else {
		$('#wheelContainer').height($('#wheelContainer').width());
		$('#nextPersonButtonContainer').height($('#nextPersonButtonContainer').width()*127/260);
	}
	startMessageContainerTopPosUp = -1*$('#startMessageContainer').height();
	startMessageContainerTopPosDown = -1*(0.955*$('#startMessageContainer').height()-viewportHeight/2);
	if(startMessageVisible == false){
		$('#startMessageContainer').css({'top':startMessageContainerTopPosUp});
	} else {
		$('#startMessageContainer').css({'top':startMessageContainerTopPosDown});
	}
	$(window).trigger('scroll');
}

$(window).on('load',function(){initPage();});
$(window).on('scroll',function(){scrollPage();});
$(window).on('resize',function(){resizePage();});