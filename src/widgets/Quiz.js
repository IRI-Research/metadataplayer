IriSP.Widgets.Quiz = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
}

IriSP.Widgets.Quiz.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.Quiz.prototype.defaults = {
    annotation_type: "Quiz",
	quiz_activated: true,
	api_serializer: "ldt_annotate",
    api_endpoint_template: "",
    api_method: "POST",
    user: "",
    userid:""
}

IriSP.Widgets.Quiz.prototype.template = '<div class="Ldt-Quiz-Container">'
										+ '<div class="Ldt-Quiz-Header"><div class="Ldt-Quiz-Index"></div><div class="Ldt-Quiz-Score"></div></div>'
										+ '<h1 class="Ldt-Quiz-Title">{{question}}</h1>'
										+ '	<div class="Ldt-Quiz-Questions">'
										+ '	</div>'
										+ ' <div class="Ldt-Quiz-FootBar">'
										+ '		<div class="Ldt-Quiz-Result">Bonne réponse</div>'
										+ '		<div class="Ldt-Quiz-Submit">'
										+ '			<div class="quiz-submit-button"><input type="button" value="Valider" /></div>'
										+ '			<div class="quiz-submit-skip-link"><a href="#">Passer</a></div><div style="clear:both;"></div>'
										+ '		</div>'
										+ '		<div class="Ldt-Quiz-Votes">'
										+ '			<h1>Avez-vous trouvé cette question utile ?</h1>'
										+ '			<div class="Ldt-Quiz-Votes-Buttons">'
										+ '				<div><input type="button" value="Non" class="Ldt-Quiz-Vote-Useless" /></div>'
										+ '				<div><input type="button" value="Oui" class="Ldt-Quiz-Vote-Useful" /></div>'
										+ '				<div class="Ldt-Quiz-Vote-Skip-Block"><a href="#" class="Ldt-Quiz-Vote-Skip">Passer</a></div>'
										+ ' 		</div>'
										+ '		</div>'
										+ '	</div>'
										+ '</div>';

IriSP.Widgets.Quiz.prototype.annotationTemplate = '';

IriSP.Widgets.Quiz.prototype.update = function(annotation) {
	var _this = this;

	if (this.quiz_activated &&
		this.correct[annotation.id] != 1 &&
		this.correct[annotation.id] != 0) {

		_this.quiz_displayed = true;

		//Pause the current video
		this.media.pause();

		this.annotation = annotation;

		var question = annotation.content.data.question;
		var answers = annotation.content.data.answers;
		var resource = annotation.content.data.resource;

		$(".Ldt-Quiz-Votes").hide();
        $(".Ldt-Pause-Add-Question").hide();
		$(".Ldt-Quiz-Container .Ldt-Quiz-Title").html(question);

		var i = 0;

		var score = Mustache.to_html('<span class="Ldt-Quiz-Correct-Answer">{{ correctness.0 }}</span> / <span class="Ldt-Quiz-Incorrect-Answer">{{ correctness.1 }}</span>', { correctness: this.globalScore() });
		$(".Ldt-Quiz-Index").html(Mustache.to_html("Q{{index}}/{{total}}", { index: annotation.number + 1,
                                                                              total: this.totalAmount }));
		$(".Ldt-Quiz-Score").html(score);
		this.question = new IriSP.Widgets.UniqueChoiceQuestion(annotation);
		this.resource = new IriSP.Widgets.UniqueChoiceQuestion(resource);

		if (annotation.content.data.type == "multiple_choice") {
			this.question = new IriSP.Widgets.MultipleChoiceQuestion(annotation);
		this.resource = new IriSP.Widgets.MultipleChoiceQuestion(resource);
		}
		else if (annotation.content.data.type == "unique_choice") {
			this.question = new IriSP.Widgets.UniqueChoiceQuestion(annotation);
		this.resource = new IriSP.Widgets.UniqueChoiceQuestion(resource);
		}

		var output = "";
		for (i = 0; i < answers.length; i++) {
			output += '<div class="quiz-question-block"><p>' + this.question.renderQuizTemplate(answers[i], i) + '<span class="quiz-question-label">'+ answers[i].content + '</span></p>';
			var color = (answers[i].correct == true) ? "quiz-question-correct-feedback" : "quiz-question-incorrect-feedback";
			output += '<div class="quiz-question-feedback '+ color +'">'+ answers[i].feedback +'</div>';
			output += '</div>';
		}


		var QR = '';
		//If there is an attached resource, display it on the resources overlay
		if (resource != null) {
            QR = '<div class="quiz-resource-block" id="resource" ><p>' + resource + '</p></div>';
        };
		$(".Ldt-Quiz-Questions").html(QR + output);
		$(".Ldt-Quiz-Overlay").show();

		$(".Ldt-Quiz-Submit").fadeIn();

		//Let's automatically check the checkbox/radio if we click on the label
		$(".quiz-question-label").click(function() {
			var parent = $(this).parent().children('.quiz-question').first().prop('checked', true);
		});

		//In case we click on the first "Skip" link
		$(".quiz-submit-skip-link").click({media: this.media}, function(event) {
			_this.hide();
			_this.player.trigger("QuizCreator.skip");
			event.data.media.play();
		});
	}
};

IriSP.Widgets.Quiz.prototype.hide = function() {
	var _this = this;

	$(".Ldt-Quiz-Votes").fadeOut();
	$(".Ldt-Quiz-Overlay").hide();
	$(".Ldt-Pause-Add-Question").hide();
	_this.quiz_displayed = false;
}

IriSP.Widgets.Quiz.prototype.answer = function() {
	var _this = this;
	//Display feedbacks
	$( ".quiz-question-feedback").each(function(index) {
		$(this).fadeIn();
	});

	var answers = _this.annotation.content.data.answers;
	var faux = false;
	var i =0;
	var ans_property;
	var ans_value;
	while (i < answers.length && faux == false) {
		if ( !this.question.isCorrect(i, $(".Ldt-Quiz-Container .Ldt-Quiz-Question-Check-" + i).is(':checked'))) {
			faux = true;
		}
		i++;
	}
	var j = 0;
	while (j < answers.length){
		if($(".Ldt-Quiz-Container .Ldt-Quiz-Question-Check-" + j).is(':checked')) {
			ans_value = j;
		}
		j++;
	}
	$(".Ldt-Quiz-Score").fadeIn();

	// TODO: factorize this code
	if (faux == true) {
		$(".Ldt-Quiz-Result").html("Mauvaise réponse");
		$(".Ldt-Quiz-Result").css({"background-color" : "red"});
		$('*[data-annotation="'+ this.annotation.id +'"]').children(".Ldt-AnnotationsList-Duration").children(".Ldt-AnnotationsList-Begin").removeClass("Ldt-Quiz-Correct-Answer").addClass("Ldt-Quiz-Incorrect-Answer");
		this.correct[this.annotation.id] = 0;
		ans_property = "wrong_answer";
	}
	else
	{
		$(".Ldt-Quiz-Result").html("Bonne réponse !");
		$(".Ldt-Quiz-Result").css({"background-color" : "green"});
		$('*[data-annotation="'+ this.annotation.id +'"]').children(".Ldt-AnnotationsList-Duration").children(".Ldt-AnnotationsList-Begin").removeClass("Ldt-Quiz-Incorrect-Answer").addClass("Ldt-Quiz-Correct-Answer");
		this.correct[this.annotation.id] = 1;
		ans_property = "right_answer";
	}
	$(".Ldt-Quiz-Result").animate({height:"100%"},500, "linear", function() {
		$(".Ldt-Quiz-Result").delay(2000).animate({ height:"0%" }, 500);
	});

	var question_number= this.annotation.number + 1;
	var correctness = this.globalScore();
	var score = "";
	score += '<span class="Ldt-Quiz-Correct-Answer">' + correctness[0] +'</span> / <span class="Ldt-Quiz-Incorrect-Answer">' + correctness[1] + '</span>';
	$(".Ldt-Quiz-Index").html("Q"+ question_number + "/" + this.totalAmount);
	$(".Ldt-Quiz-Score").html(score);

	this.submit(this.user, this.userid, this.annotation.id, ans_property, ans_value);

	//Hide the "Validate" button and display the UI dedicated to votes
	$(".Ldt-Quiz-Submit").fadeOut();
	$(".Ldt-Quiz-Votes").delay(500).fadeIn();
};

IriSP.Widgets.Quiz.prototype.globalScore = function() {
	//Define 2 variables to know how many good and bad answers there are
    // TODO: replace by _.countBy
	var ok = 0;
	var ko = 0;
	for (var i = 0; i < this.totalAmount; i++) {
		if (this.correct[this.keys[i]] == 1) {
			ok++;
		}
		else if (this.correct[this.keys[i]] == 0)
		{
			ko++;
		}
	}
	var array = [ok, ko];
	return array;
}

IriSP.Widgets.Quiz.prototype.refresh = function() {
    var _annotations = this.getWidgetAnnotations().sortBy(function(_annotation) {
        return _annotation.begin;
    });

    var _this = this;

	_this.totalAmount = _annotations.length;
	_this.number = 0;
	_this.correct = {};
	_this.keys = {};

    _annotations.forEach(function(_a) {
		//Fix each annotation as "non-answered yet"
		_this.correct[_a.id] = -1;
		_this.keys[_this.number] = _a.id;
		_a.number = _this.number++;
        _a.on("enter", function() {
            _this.update(_a);
        });
    });

}

IriSP.Widgets.Quiz.prototype.draw = function() {
	var _this = this;
    var _annotations = this.getWidgetAnnotations().sortBy(function(_annotation) {
        return _annotation.begin;
    });
	_this.quiz_displayed = false;
    this.onMdpEvent("Quiz.activate", function() {
		_this.quiz_activated = true;
		$("#tab_quiz_toc").show();
    });

    this.onMdpEvent("Quiz.deactivate", function() {
		_this.quiz_activated = false;
		$("#tab_quiz_toc").hide();
		_this.hide();
    });

    this.onMdpEvent("Quiz.hide", function() {
		_this.hide();
    });

    this.onMdpEvent("Quiz.refresh", function() {
		_this.refresh();
    });

    this.onMediaEvent("pause", function() {
		if(! _this.quiz_displayed) {
		    $(".Ldt-Pause-Add-Question").show();
		    $(".Ldt-Pause-Add-Question").on("click", function() {
		_this.create_quiz_callback();
		});
      }

    });

    this.onMediaEvent("play", function() {
	   $(".Ldt-Pause-Add-Question").hide();
    });

    // Add Ldt-Quiz-Overlay widget on top of video player
	_this.overlay = $("<div class='Ldt-Quiz-Overlay'></div>").appendTo($('#' + _this.container));
	_this.PauseAddQuestion = $("<div class='Ldt-Pause-Add-Question'><img class='Ldt-Pause-Add-Question-icon' title='Ajoutez une question !' src='../widgets/img/buzz.svg'>").appendTo($('#' + _this.container));
	_this.overlay.html(this.template);

	$(".Ldt-Quiz-Overlay").hide();

    $(".Ldt-Quiz-Submit input").click(function() {
		_this.answer();
    });

	//In case we click on the first "Skip" link
	$(".quiz-submit-skip-link").click({ media: this.media }, function(event) {
		_this.submit(_this.user, _this.userid, _this.annotation.id, "skipped_answer", 0);
		_this.hide();
		_this.player.trigger("QuizCreator.skip");
		event.data.media.play();
	});

    $(".Ldt-Quiz-Votes-Buttons input[type=\"button\"], .Ldt-Quiz-Votes-Buttons a").click({media: this.media}, function(event) {
		var vote_prop, vote_val;

		if ($(this).hasClass("Ldt-Quiz-Vote-Useful")) {
			vote_prop = "useful";
			vote_val = 1;
		} else if ($(this).hasClass("Ldt-Quiz-Vote-Useless")) {
			vote_prop = "useless";
			vote_val = -1;

			$(".Ldt-Ctrl-Quiz-Create").addClass("button_highlight").delay(5000).queue(function() {
                $(this).removeClass("button_highlight").dequeue();
            });
		}else{
			vote_prop = "skipped_vote";
			vote_val = 0;
		}

		_this.submit(_this.user, _this.userid, _this.annotation.id, vote_prop, vote_val);

		//Resume the current video
		event.data.media.play();

		_this.hide();
		$(".Ldt-Pause-Add-Question").hide();

		_this.player.trigger("QuizCreator.skip");
	});

	_this.totalAmount = _annotations.length;
	_this.number = 0;
	_this.correct = {};
	_this.keys = {};

    _annotations.forEach(function(_a) {
		// Mark each annotation as "non-answered yet"
		_this.correct[_a.id] = -1;
		_this.keys[_this.number] = _a.id;
		_a.number = _this.number++;
        _a.on("enter", function() {
            _this.update(_a);
        });
    });
}

//Generates uid
//source : http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
IriSP.Widgets.Widget.prototype.generateUid = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

//UniqueChoice Question
IriSP.Widgets.UniqueChoiceQuestion = function(annotation) {
    this.annotation = annotation;
}

IriSP.Widgets.UniqueChoiceQuestion.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.UniqueChoiceQuestion.prototype.isCorrect = function(answer, valid) {
	if (this.annotation.content.data.answers[answer].correct && valid) {
		return true;
	} else if ((typeof this.annotation.content.data.answers[answer].correct === "undefined" || ! this.annotation.content.data.answers[answer].correct) && ! valid) {
		return true;
	}
	return false;
}

IriSP.Widgets.UniqueChoiceQuestion.prototype.renderQuizTemplate = function(answer, identifier) {
	return '<input type="radio" class="quiz-question Ldt-Quiz-Question-Check-' + identifier + '" name="question" data-question="' + identifier + '" value="' + identifier + '" />';
}

IriSP.Widgets.UniqueChoiceQuestion.prototype.renderTemplate = function(answer, identifier) {
	var id = this.generateUid();
	return '<input type="radio" id="' + id + '" class="quiz-question-edition Ldt-Quiz-Question-Check-'+ identifier +'" name="question" data-question="'+ identifier +'" value="' + identifier + '" /><label for="'+ id +'" title="Veuillez sélectionner la réponse correcte"></label>';
}

IriSP.Widgets.UniqueChoiceQuestion.prototype.renderFullTemplate = function(answer, identifier) {
	var correct = (answer.correct == true) ? "checked=\"checked\"" : "";
	var id = this.generateUid();
	return '<input type="radio" id="'+ id +'" '+ correct +' class="quiz-question-edition Ldt-Quiz-Question-Check-'+ identifier +'" name="question" data-question="'+ identifier +'" value="' + identifier + '" /><label for="'+ id +'"></label>';
}


//MultipleChoice Question
IriSP.Widgets.MultipleChoiceQuestion = function(annotation) {
    this.annotation = annotation;
}

IriSP.Widgets.MultipleChoiceQuestion.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.MultipleChoiceQuestion.prototype.isCorrect = function(answer, valid) {
	if (this.annotation.content.data.answers[answer].correct && valid) {
		return true;
	}
	else if ((typeof this.annotation.content.data.answers[answer].correct === "undefined" || ! this.annotation.content.data.answers[answer].correct) && ! valid) {
		return true;
	}
	return false;
}

IriSP.Widgets.MultipleChoiceQuestion.prototype.renderQuizTemplate = function(answer, identifier) {
	return '<input type="checkbox" class="quiz-question Ldt-Quiz-Question-Check-'+ identifier +'" name="question['+ identifier +']" data-question="'+ identifier +'" value="' + identifier + '" /> ';
}

IriSP.Widgets.MultipleChoiceQuestion.prototype.renderTemplate = function(answer, identifier) {
	var id = this.generateUid();
	return '<input type="checkbox" id="'+ id +'" class="quiz-question-edition Ldt-Quiz-Question-Check-'+ identifier +'" name="question['+ identifier +']" data-question="'+ identifier +'" value="' + identifier + '" /><label for="'+ id +'" title="Veuillez sélectionner la ou les réponses correctes"></label>';
}

IriSP.Widgets.MultipleChoiceQuestion.prototype.renderFullTemplate = function(answer, identifier) {
	var correct = (answer.correct == true) ? "checked=\"checked\"" : "";
	var id = this.generateUid();
	return '<input type="checkbox" id="'+ id +'" '+ correct +' class="quiz-question-edition Ldt-Quiz-Question-Check-'+ identifier +'" name="question['+ identifier +']" data-question="'+ identifier +'" value="' + identifier + '" /><label for="'+ id +'"></label> ';
}

IriSP.Widgets.Quiz.prototype.submit = function(user,user_id,question,prop,val) {
	var _url = Mustache.to_html(this.api_endpoint_template, {id: this.source.projectId}),
	donnees = {
			"username": user,
			"useruuid": user_id,
			"subject": question,
			"property": prop,
			"value": val
		};

	IriSP.jQuery.ajax({
        url: _url,
        type: this.api_method,
        contentType: 'application/json',
        data: JSON.stringify(donnees),
        success: function(_data) {
        },
        error: function(_xhr, _error, _thrown) {
            IriSP.log("Error when sending annotation", _thrown);
        }
    });
}
