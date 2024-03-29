	//import  dict  from './dict.js';
	//console.log(dict);

	var coin = new Audio('./coin.wav');
	var No = new Audio('./No.wav');
	var win = new Audio('./winSong.wav');
	var ohNo = new Audio('./ohNo.wav');

	var coin2 = document.getElementById('coin2'); 
		
	No.volume=0.1;
	coin.volume=0.1;
	coin2.volume=0.2
	ohNo.volume=0.5;
	win.volume=0.2;

    //Defaults
	//var ChapterNr = 1;
	//var DictPage = 0;
	//---1000 words
	var ChapterNr = 1;
	
	let DictPage;

	console.log ("localStorage.getItem('dictPage'):"+localStorage.getItem("dictPage"));
	let localPage = localStorage.getItem("dictPage");
	if (localPage > 0 ) { 
		DictPage = localPage; 
		console.log("loading from local storage");
	} else { DictPage = 2; console.log("loading defalt page")}
	
	var currentWord="";

		
	let wH =window.innerHeight;
	console.log(wH);
	document.getElementById('bodydiv').style.height =wH-20;
	var myCanvas = document.getElementById('myCanvas').getContext('2d');
		//myCanvas.volume=0;

	var Answer;
	var pageChanged=false;
	var guessedWrong=false;
	var WIDTH = 600;
	var HEIGHT = 550;
	var intervalVar,score;
	var maxWordOnPage=0;
	var TryAgainScreen = false; 
	var easyMode = true;
	var speakCounter = 0;

	// let windowHeight = window.innerHeight;
	//if (windowHeight < HEIGHT){HEIGHT=windowHeight};
		
	var levDone= [false,0,0,0,0,0,0,0,0,0];
	//var levDone= [false,1,1,2,0,1,0,1,0,0];

	
		

		//Start screen
		/*
		myCanvas.font = "48px Calibri";
		myCanvas.fillText('Danish tutor',140, 200);
		
		myCanvas.font = "18px Calibri";
		myCanvas.fillText('press + or - to change chapters',160, 400);
		
		myCanvas.font = "24px Calibri";
		myCanvas.fillText('press Enter to start',160, 300);
		*/

		//---------------------------------Start Screen--------------------//

	myCanvas.font = "48px Calibri";
	myCanvas.fillText('Danish tutor',140, 200);
		
	myCanvas.font = "24px Calibri";
	myCanvas.fillText('press Enter to start',160, 300);
	myCanvas.save();

		//myCanvas.font = "18px Calibri";
		//myCanvas.fillText('press + or -  to change chapters',160, 400);

		//myCanvas.font = "18px Calibri";
		//myCanvas.fillText('press 1,2,3...9  to change pages',160, 450);

	myCanvas.font = "18px Calibri";
	myCanvas.fillText(('current page is: '+DictPage),160, 450);

	myCanvas.font = "18px Calibri";
	myCanvas.fillText(('current chapter is: '+ ChapterNr),160, 480);  

	myCanvas.restore();

	//---------------------------------------------------------------------//
		

	var levelStarted = false;
	var gameInterval= 100;
	var framesPerSecond=30;
	var skoreY=30;
	var wordY=30;
	var DanNum=0; //arrays start with index 0 
	

		
	document.getElementById('myCanvas').onmousedown= function(){
			if (levelStarted==false){
				startLevel();
				 document.getElementById("myInput").value='';
			}
	}

		document.onkeydown = function(event) {
			if ((levelStarted==false)&&(event.keyCode ==48)) {changePage(0);}
			if ((levelStarted==false)&&(event.keyCode ==49)) {changePage(1);}
			if ((levelStarted==false)&&(event.keyCode ==50)) {changePage(2);}
			if ((levelStarted==false)&&(event.keyCode ==51)) {changePage(3);}
			if ((levelStarted==false)&&(event.keyCode ==52)) {changePage(4);}
			if ((levelStarted==false)&&(event.keyCode ==53)) {changePage(5);}
			if ((levelStarted==false)&&(event.keyCode ==54)) {changePage(6);}
			if ((levelStarted==false)&&(event.keyCode ==55)) {changePage(7);}
			if ((levelStarted==false)&&(event.keyCode ==56)) {changePage(8);}
			if ((levelStarted==false)&&(event.keyCode ==57)) {changePage(9);}
			//if ((levelStarted==false)&&(event.keyCode ==48)) {changePage(10);}

			if ((levelStarted==false)&&(event.keyCode ==187)) { //"+" pressed
							myCanvas.save();
							myCanvas.fillRect(0,0,WIDTH,HEIGHT);
							ChapterNr++; drawRects(); drawHomeRect(ChapterNr);
							myCanvas.font = "18px Calibri";
							myCanvas.fillStyle = 'Orange';
							myCanvas.fillText(('Chapter changed to: '+ ChapterNr),160, 520);  
							myCanvas.restore();
			};
		
			if ((levelStarted==false)&&(event.keyCode ==189)) {   //"-" pressed
							myCanvas.save();
							myCanvas.fillRect(0,0,WIDTH,HEIGHT);
							ChapterNr--;drawRects();drawHomeRect(ChapterNr);
							
							myCanvas.font = "18px Calibri";
							myCanvas.fillStyle = 'Orange';
							myCanvas.fillText(('Chapter changed to: '+ ChapterNr),160, 520);  
							myCanvas.restore();
			};
				
			if ((levelStarted==false)&&(event.keyCode ==13)){ //enter pressed
				
				getInputValue();
				if (Answer=="Y"||Answer=="y"){ GoToYoutube(); }
				else if (Answer=="E"||Answer=="e"){ GoToYoutubeEnglish(); }
				else{
					document.getElementById("myInput").value='';
					startLevel();
				}
			
			//Enter
			}else if (event.keyCode ==13){//enter
				getInputValue();
			};
			if ((levelStarted==true)&&(event.keyCode ==27)){ //Esc pressed
				tryAgain();
				gameReset();
			}
			if ((TryAgainScreen==true)&&(event.keyCode ==89)) { GoToYoutube(); }//Y
		}

		function changePage(page){

			 DictPage=page;
			 localStorage.setItem("dictPage", DictPage);
			 console.log('DictPage='+page);
			 

			 		//var inputVal2 = document.getElementById("myInput").value;
					
					myCanvas.fillRect(0,0,WIDTH,HEIGHT);  //draw black canvas 
					myCanvas.save();
					myCanvas.fillStyle = 'Orange';
					myCanvas.font = "24px Calibri";

					myCanvas.fillText('DictPage changed to:'+DictPage,140, 500);
					myCanvas.restore();

					//document.getElementById("myInput").value='';
		}

		function getInputValue(){ //Function is called on pressing Enter
            // Selecting the input element and get its value 
            var inputVal = document.getElementById("myInput").value;
            if (levelStarted==false){
				if (inputVal!=''){
					if (inputVal<=9){
            		changePage(inputVal);
            	}}
            	
            }
            Answer=inputVal;
            console.log("Your answer: "+inputVal);
            document.getElementById("myInput").value='';//clear prompt field
           if (levelStarted==true){
	           if (checkAnswer()==true) {
	           			wordRight();
			        }else{
			        	wordWrong();
			        };        
			}
		}

        checkAnswer = function(){
        	let AnswerLow=Answer.toLowerCase();			//Ignore higher or lower case
			let ctAnswerLow=currentAnswer.toLowerCase();
			let AnswerLowTrimmed=AnswerLow.trim();         //cuts spaces at beginning and at the end
			let ctAnswerLowTrimmed=ctAnswerLow.trim();
			return (AnswerLowTrimmed==ctAnswerLowTrimmed);
       }
	   
	   


        wordWrong = function(){
	        	guessedWrong=true;
	        	No.play();
	        	score--;
        }
        wordRight = function(){
        	//word is guessed right
	           	var soundFlag = true;
	           	if (soundFlag){
	           		coin2.pause();
	           		coin2.currentTime=0;
	           		coin2.play();
	           		soundFlag=false;

	           	}
	           	//coin.play();
				   //alert(inputVal+" is Right!!!");
				incWordsCounter();
	           	score++;
	           	DanNum++;
	           	//console.log("Danish.length: "+Danish.length);

	           	console.log("DanNum: "+DanNum);
	           	wordY=0;
				   guessedWrong=false;
				   setCurrentWord(ChapterNr,DictPage);
	           	//document.getElementById("myInput").value='';
        }
		
		drawScore = function (){
			myCanvas.save();
			myCanvas.fillStyle = "white";
			myCanvas.fillText("Score:"+score, 420, skoreY);
			myCanvas.restore();

		}

		setCurrentWord = function(ChapterNr,DictPage){
			
			console.log('-----setCurrentWord = function');
			
			console.log('ChapterNr='+ChapterNr);
			let chap = "chapter" + ChapterNr;
			console.log('DictPage='+DictPage);
			let pg = "page"+ DictPage;
			console.log('pg='+pg);
			
			try {
				if ((dict[chap]) == undefined){console.log("---chapter  does not exist");}
			  }
			  catch(err) {
				console.log(err.message);
				console.log("chapter  does not exist");
			  }
			
			if ((dict[chap][pg]) == undefined){console.log("chapter or PAGE does not exist");}
			console.log(`dict[chap][pg] =`);
			console.log(dict[chap][pg]);
			
			

			//console.log(`dict[chap] =`);
			//console.log(dict[chap]);
		
			
			let currentWordNumber = 0;
	
			 maxWordOnPage=0;

			 for(let dan in dict[chap][pg] ){
				//here we iterate an object, and if number of object property is the same as DanNum , we show it
				if (currentWordNumber == DanNum){
						currentWord = dan;
						currentAnswer = dict[chap][pg][dan];
				}
					currentWordNumber++;
					if(currentWordNumber > maxWordOnPage){
							
							maxWordOnPage = currentWordNumber;
					};
			}


			 /*
			 //Old function to iterate. 
			 //If we know names of objects inside objects there is no need for this big function
			 //
			for (let chapter in dict ){
				if (currentDictChapter==ChapterNr){
					console.log('right chapter');
				
				for (let page in dict[chapter]){
					if (currentDictPage == (DictPage)){
						console.log("right page!");
						for(let dan in dict[chapter][page] ){
							//here we iterate an object, and if number of object property is the same as DanNum , we show it
							if (currentWordNumber == DanNum){
									currentWord = dan;
									currentAnswer = dict[chapter][page][dan];
									//myCanvas.fillText(currentAnswer, i, wordY+50);//draws answer
									//i+=150;
									
							}
								currentWordNumber++;
								if(currentWordNumber > maxWordOnPage){
										
										maxWordOnPage = currentWordNumber;
										//console.log("maxWordOnPage is set to:"+maxWordOnPage);
									};
						}

							
						}else{console.log('Wrong dict page');}
						currentDictPage++;

						//console.log("dict:"+dict);
						//console.log("DictPage:"+DictPage);
						
					}
			}else(currentDictChapter++);
		}
		*/
			console.log('-----setCurrentWord = function END');
		}

		drawWord = function (){
			//here we need to draw a word, according to the current word number(DanNum)
			let i=250;   //horizontal word position
			myCanvas.save();
			myCanvas.fillStyle = "white";
			myCanvas.font = "30px Calibri";
			myCanvas.fillText(" "+ currentWord, i, wordY);

			
			wordY++;//moves word position
			if (wordY>600){
				DanNum++;
				wordY=0;
				if (guessedWrong==true){score=score-1;}
				else{score=score-2;}
				document.getElementById("myInput").value='';//clear prompt field
				ohNo.play();
				setCurrentWord(ChapterNr,DictPage);
				guessedWrong=false;
			}
			myCanvas.restore();

		}

		drawAnswer = function (){
			if ((guessedWrong==true)||((easyMode==true)&&(wordY>300))){
				myCanvas.save();
				myCanvas.fillStyle = "white";
				{myCanvas.fillText("Answer: "+currentAnswer, 10, skoreY);}
				myCanvas.restore();
		}

		}
		

		isGameOver = function() {
			
			if (DanNum == dictLength()){gameOver();}
			
		}
		dictLength = function(){
			//console.log("maxWordOnPage:"+maxWordOnPage)
			return maxWordOnPage;

		}

		
		gameOver = function (){

					if (score >= DanNum){
						youWon();
					}else{   tryAgain();	}
					
				gameReset();
				return;
		}

		gameReset = function(){
					console.log("gameReset = function");
					levelStarted=false;
					score=0;
					DanNum=0;
					console.log("clear interval");
					clearInterval(intervalVar);// this stops programm
		}

		youWon = function(){
					
					

					TryAgainScreen=true; 
					levelStarted=false;
					myCanvas.save();
					levDone[DictPage]=2;
						if (DictPage==9)
					   {
						   ChapterNr++;
						   DictPage=1;
						};
					drawCoin();
					myCanvas.fillStyle = 'Orange';
					myCanvas.font = "24px Calibri";
					let wordsGuessed=localStorage.getItem("wordsGuessed");
					myCanvas.fillText(wordsGuessed ,100, 100);

					myCanvas.fillText(score +' out of '+DanNum,140, 150);
					myCanvas.fillText('Perfect score, you won!',100, 250);
					myCanvas.fillText('Press 1, 2, 3 etc. to change Page of Dictionary', 100, 350);
					myCanvas.fillText('Current Page:'+DictPage,140, 450);
					myCanvas.fillText('Press Y/E to wach a cartoon (Dansk/English)', 100, 500); //will fire GoToYoutube function
					DictPage++;
					localStorage.setItem("dictPage", DictPage); //saving dictPage
					
					pageChanged=true;
					myCanvas.restore();
					win.play();

		}

		function incWordsCounter(){
			console.log("------------------------------"+localStorage.getItem("wordsGuessed"));
				   let wordsGuessed=localStorage.getItem("wordsGuessed");
				   console.log("wordsGuessed:"+wordsGuessed);
				   if (wordsGuessed=='NaN'){wordsGuessed=1}
				   if (wordsGuessed=='null'){wordsGuessed=1}
				   else 
				   {wordsGuessed=parseInt(wordsGuessed);
				   wordsGuessed++;}
				   localStorage.setItem("wordsGuessed",wordsGuessed);
		}


		tryAgain =function(){
			TryAgainScreen=true; 
			levelStarted=false;
					//window.location = "http://www.example.com"; //works
					
					let wordsGuessed=localStorage.getItem("wordsGuessed");
					console.log('------------------------------wordsGuessed='+wordsGuessed);
					//myCanvas.fillText(wordsGuessed ,100, 100);


					myCanvas.save();
					myCanvas.fillStyle = 'Orange';
					myCanvas.font = "24px Calibri";
					myCanvas.fillText("Total words guessed:"+wordsGuessed ,20, 30);

					myCanvas.fillText(score +' out of '+DanNum,140, 150);
					

					myCanvas.fillText('Press 1, 2, 3 etc. to change Page of Dictionary', 100, 350);
					myCanvas.fillText('Current Page:'+DictPage,140, 450);
					if (score >= (DanNum-2)){
						win.play();
						levDone[DictPage]=1;
						
						drawCoin();
						myCanvas.fillText('Nice try, press Enter to try again',100, 250);
						if (DictPage==9)
					   {
						   ChapterNr++;
						   DictPage=1;
						}else
						{DictPage++;}
						pageChanged=true;
					}
					else{
						myCanvas.fillText('Not perfect, press Enter to try again',100, 250);
						pageChanged=false;
					}

					
					

					myCanvas.fillText('Press Y/E to wach a cartoon', 100, 500); //will fire GoToYoutube function
					myCanvas.restore();
		}
		

		

		
		drawCoin = function(){
			

			ldl=levDone.length;
			
			coinX=WIDTH-25;
			cDist=45;
			for (i = 1; i < ldl; i++){
				if (levDone[i]==1){
				drawCoinFx((coinX),i*cDist-20,"silver");
				}else if(levDone[i]==2){drawCoinFx((coinX),i*cDist-20,"gold");}

			}
			
		}
		drawCoinFx = function(x,y,color){
			var c = document.getElementById("myCanvas");
				var ctx = c.getContext("2d");

				ctx.strokeStyle = color;
				ctx.lineWidth = 14;

				ctx.beginPath();
				ctx.arc(x, y, 10, 0, 2 * Math.PI);
				ctx.stroke();
				//-------------------------
				ctx.strokeStyle = "dimgray";
				ctx.lineWidth = 2;

				ctx.beginPath();
				ctx.arc(x, y, 17, 0, 2 * Math.PI);
				ctx.stroke();

		}
		function drawRects(){
			for (let rn=1;rn<=10;rn++ )
			drawRect(30,40*rn+10,"dimgray")
		}
		function drawHomeRect(rectNum){

			drawRect(30,40*rectNum+10,"silver");

		}
		function drawRect(x,y,color){
			    
				let c = document.getElementById("myCanvas");
				var ctx = c.getContext("2d");
				ctx.strokeStyle = color;
				ctx.beginPath();
				ctx.rect(x, y, 30, 30);
				ctx.stroke();


		}
		//----------------W3school-sound-----------//
		function sound(src) {
		  this.sound = document.createElement("audio");
		  this.sound.src = src;
		  this.sound.setAttribute("preload", "auto");
		  this.sound.setAttribute("controls", "none");
		  this.sound.style.display = "none";
		  document.body.appendChild(this.sound);
		 
		  this.play = function(){
		    	this.sound.play();
		 	 }

		  this.stop = function(){
		    this.sound.pause();
		  }
		}
		//----------------W3school-sound-----------//
	gameLoop = function(){			
			myCanvas.fillRect(0,0,WIDTH,HEIGHT);  //draw black canvas 
			//myCanvas.clearRect(0,0,WIDTH,HEIGHT);
			drawRects();
			drawHomeRect(ChapterNr);
			drawScore();
			drawCoin();
			drawWord();
			
			drawAnswer();
			textSpeak();
			isGameOver();
	}


	startLevel = function(){
		console.log("startLevel = function")
			setCurrentWord(ChapterNr,DictPage);
			levelStarted=true;
			TryAgainScreen=false;
			score =0;wordY=0;
			
			intervalVar = setInterval(gameLoop,1000/framesPerSecond);//30 frames
	}
	textSpeak = function(){
			if ((wordY>20) && (speakCounter>150))
			{

				console.log("inside textSpeak function");
				
				responsiveVoice.speak(currentWord, "Danish Female");
			
				speakCounter=0;
			}
			else
			{speakCounter++;}
		}
		