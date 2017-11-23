IriSP.Widgets.Quiz = function (player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.Quiz.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.Quiz.prototype.defaults = {
    // annotation_type: "at_quiz",
    quiz_activated: true,
    api_serializer: "ldt_annotate",
    analytics_api: "",
    api_method: "POST",
    user: "",
    userid:"",
    enable_add_question: false
};

IriSP.Widgets.Quiz.prototype.template = '<div class="Ldt-Quiz-Container">'
                                        + '<div class="Ldt-Quiz-Header">'
                                        + '  <div class="Ldt-Quiz-Index"></div><div class="Ldt-Quiz-Score"></div>'
                                        + '</div>'
                                        + '<div class="Ldt-Quiz-Content">'
                                        + '  <h1 class="Ldt-Quiz-Title">{{question}}</h1>'
                                        + '  <div class="Ldt-Quiz-Result">Bonne réponse</div>'
                                        + '  <div class="Ldt-Quiz-Questions">'
                                        + '  </div>'
                                        + '</div>'
                                        + '<div class="Ldt-Quiz-Footer">'
                                        + '  <div class="Ldt-Quiz-Votes">'
                                        + '      <span class="Ldt-Quiz-Votes-Question">Avez-vous trouvé cette question utile ?</span>'
                                        + '      <div class="Ldt-Quiz-Votes-Buttons">'
                                        + '          <div class="Ldt-Quiz-Vote-Skip-Block"><a href="#" class="Ldt-Quiz-Vote-Skip">Passer</a></div>'
                                        + '          <div><input type="button" value="Non" class="Ldt-Quiz-Vote-Useless" /></div>'
                                        + '          <div><input type="button" value="Oui" class="Ldt-Quiz-Vote-Useful" /></div>'
                                        + '      </div>'
                                        + '  </div>'
                                        + '  <div class="Ldt-Quiz-Submit">'
                                        + '      <div class="Ldt-Quiz-Submit-Button"><input type="button" value="Valider" /></div>'
                                        + '      <div class="Ldt-Quiz-Submit-Skip-Link"><a href="#">Passer</a></div><div style="clear:both;"></div>'
                                        + '  </div>'
                                        + '</div>'
                                        + '</div>';

IriSP.Widgets.Quiz.prototype.annotationTemplate = '';

IriSP.Widgets.Quiz.prototype.update = function (annotation) {
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
        } else if (annotation.content.data.type == "unique_choice") {
            this.question = new IriSP.Widgets.UniqueChoiceQuestion(annotation);
            this.resource = new IriSP.Widgets.UniqueChoiceQuestion(resource);
        }

        var output = "";
        for (i = 0; i < answers.length; i++) {
            output += '<div class="quiz-question-block"><p>' + this.question.renderQuizTemplate(answers[i], i) + '<span class="quiz-question-label">' + answers[i].content + '</span></p></div>';
        }


        var QR = '';
        //If there is an attached resource, display it on the resources overlay
        if (resource != null) {
            QR = '<div class="quiz-resource-block" id="resource" >' + resource + '</div>';
        };
        $(".Ldt-Quiz-Questions")
            .addClass(".Ldt-Quiz-Questions-" + annotation.content.data.type)
            .html(QR + output);
        $(".Ldt-Quiz-Overlay").fadeIn();

        $(".Ldt-Quiz-Submit").fadeIn();

        //Let's automatically check the checkbox/radio if we click on the label
        $(".quiz-question-label").click(function () {
            var input = $(this).siblings("input");
            if (input.prop('checked') && input.prop('type') == 'radio') {
                // Already checked. Consider a double click on unique question as a validation.
                _this.answer();
            } else {
                input.prop('checked', !input.prop('checked'));
            }
        });

        //In case we click on the first "Skip" link
        $(".Ldt-Quiz-Submit-Skip-Link").click({media: this.media}, function (event) {
            _this.player.trigger("QuizCreator.skip");
            _this.close_quiz();
        });
    }
};

IriSP.Widgets.Quiz.prototype.hide = function () {
    var _this = this;

    $(".Ldt-Quiz-Votes").hide();
    $(".Ldt-Quiz-Overlay").hide();
    $(".Ldt-Pause-Add-Question").hide();
    _this.quiz_displayed = false;
};

IriSP.Widgets.Quiz.prototype.answer = function () {
    var _this = this;

    function insert_timecode_links(s) {
        return (s || "").replace(/\s(\d+:\d+)/, function (match, timecode) {
            return ' <a href="#t=' + (IriSP.timestamp2ms(timecode) / 1000) + '">' + timecode + '</a>';
        });
    };

    var answers = _this.annotation.content.data.answers;

    // Augment answers with the correct feedback
    var i = 0;
    var wrong = 0;
    // Signature is an array giving the answers signature: 1 for checked, 0 for unchecked
    // We cannot simply store the right answer index, since there may be multiple-choice questions
    var signature = [];
    _this.$.find(".Ldt-Quiz-Question-Check").each(function (code) {
        var checked = $(this).is(":checked");
        signature.push(checked ? 1 : 0);
        var ans = answers[i];
        if ((ans.correct && !checked)
            || (!ans.correct && checked)) {
            wrong += 1;
            IriSP.jQuery(this).parents(".quiz-question-block")
                .addClass(ans.correct ? "Ldt-Quiz-Answer-Right" : "Ldt-Quiz-Answer-Wrong")
                .append('<div class="quiz-question-feedback quiz-question-incorrect-feedback">' + insert_timecode_links(ans.feedback) + '</div>');
        } else {
            IriSP.jQuery(this).parents(".quiz-question-block")
                .addClass(ans.correct ? "Ldt-Quiz-Answer-Right" : "Ldt-Quiz-Answer-Wrong")
                .append('<div class="quiz-question-feedback quiz-question-correct-feedback">' + insert_timecode_links(ans.feedback) + '</div>');
        }
        i++;
    });

    if (wrong) {
        _this.$.find(".Ldt-Quiz-Content").removeClass(".Ldt-Quiz-Result-Correct").addClass(".Ldt-Quiz-Result-Incorrect");
        $(".Ldt-Quiz-Result").html("Mauvaise réponse");
        $(".Ldt-Quiz-Result").css({"background-color" : "#f86060"});
        this.correct[this.annotation.id] = 0;
    } else {
        _this.$.find(".Ldt-Quiz-Content").removeClass(".Ldt-Quiz-Result-Incorrect").addClass(".Ldt-Quiz-Result-Correct");
        $(".Ldt-Quiz-Result").html("Bonne réponse !");
        $(".Ldt-Quiz-Result").css({"background-color" : "#5bce5b"});
        this.correct[this.annotation.id] = 1;
    }

    $(".Ldt-Quiz-Result").show(500);

    var question_number = this.annotation.number + 1;
    var correctness = this.globalScore();
    var score = "";
    score += '<span class="Ldt-Quiz-Correct-Answer">' + correctness[0] + '</span> / <span class="Ldt-Quiz-Incorrect-Answer">' + correctness[1] + '</span>';
    $(".Ldt-Quiz-Index").html("Q" + question_number + "/" + this.totalAmount);
    $(".Ldt-Quiz-Score").html(score);

    this.submit(this.user, this.userid, this.annotation.id, wrong ? 'wrong_answer' : 'right_answer', signature.join(""));

    //Hide the "Validate" button and display the UI dedicated to votes
    $(".Ldt-Quiz-Submit").fadeOut(400, function () {
        $(".Ldt-Quiz-Votes").show();
    });
};

IriSP.Widgets.Quiz.prototype.globalScore = function () {
    // Return 2 variables to know how many right and wrong answers there are
    var values = _.values(this.correct);
    var ok = values.filter(function (s) { return s == 1; }).length;
    var not_ok = values.filter(function (s) { return s == 0; }).length;
    return [ok, not_ok];
};

IriSP.Widgets.Quiz.prototype.close_quiz = function () {
    var _this = this;
    _this.hide();
    $(".Ldt-Pause-Add-Question").hide();
    _this.$.find(".Ldt-Quiz-Result").removeClass(".Ldt-Quiz-Result-Correct").removeClass(".Ldt-Quiz-Result-Incorrect").hide();
    // Resume the current video
    _this.media.play();
};

IriSP.Widgets.Quiz.prototype.refresh = function () {
    var _annotations = this.getWidgetAnnotations().sortBy(function (_annotation) {
        return _annotation.begin;
    });

    var _this = this;

    _this.totalAmount = _annotations.length;
    _this.number = 0;
    _this.correct = {};
    _this.keys = {};

    _annotations.forEach(function (_a) {
        //Fix each annotation as "non-answered yet"
        _this.correct[_a.id] = -1;
        _this.keys[_this.number] = _a.id;
        _a.number = _this.number++;
    });

};

IriSP.Widgets.Quiz.prototype.draw = function () {
    var _this = this;
    _this.quiz_displayed = false;
    this.onMediaEvent("enter-annotation", function (annotation) {
        var an = _this.getWidgetAnnotations().filter(function (a) { return a === annotation; });
        if (an.number === undefined) {
            _this.refresh();
        }
        if (an.length) {
            _this.update(an[0]);
        };
    });
    this.onMdpEvent("Quiz.activate", function () {
        _this.quiz_activated = true;
    });

    this.onMdpEvent("Quiz.deactivate", function () {
        _this.quiz_activated = false;
        _this.hide();
    });

    this.onMdpEvent("Quiz.hide", function () {
        _this.hide();
    });

    this.onMdpEvent("Quiz.refresh", function () {
        _this.refresh();
    });

    this.onMediaEvent("pause", function () {
        if (!_this.quiz_displayed && this.enable_add_question) {
            $(".Ldt-Pause-Add-Question").show();
        }
    });

    this.onMediaEvent("play", function () {
        $(".Ldt-Pause-Add-Question").hide();
    });

    // Add Ldt-Quiz-Overlay widget on top of video player
    _this.overlay = $("<div class='Ldt-Quiz-Overlay'></div>").appendTo($('#' + _this.container));
    _this.PauseAddQuestion = $("<div class='Ldt-Pause-Add-Question' title='Ajoutez une question !'>")
        .on("click", function () { _this.player.trigger("QuizCreator.create"); })
        .appendTo($('#' + _this.container));
    _this.overlay.html(this.template);
    if (!this.enable_add_question) {
        $(".Ldt-Pause-Add-Question").hide();
    }

    $(".Ldt-Quiz-Overlay").hide();

    $(".Ldt-Quiz-Submit input").click(function () {
        _this.answer();
    });

    //In case we click on the first "Skip" link
    $(".Ldt-Quiz-Submit-Skip-Link").click({ media: this.media }, function (event) {
        _this.submit(_this.user, _this.userid, _this.annotation.id, "skipped_answer", 0);
        _this.close_quiz();
        _this.player.trigger("QuizCreator.skip");
    });

    $(".Ldt-Quiz-Votes-Buttons input[type=\"button\"], .Ldt-Quiz-Votes-Buttons a").click({media: this.media}, function (event) {
        var vote_prop, vote_val;

        if ($(this).hasClass("Ldt-Quiz-Vote-Useful")) {
            vote_prop = "useful";
            vote_val = 1;
        } else if ($(this).hasClass("Ldt-Quiz-Vote-Useless")) {
            vote_prop = "useless";
            vote_val = -1;

            $(".Ldt-Ctrl-Quiz-Create").addClass("button_highlight").delay(5000).queue(function () {
                $(this).removeClass("button_highlight").dequeue();
            });
        } else {
            vote_prop = "skipped_vote";
            vote_val = 0;
        }

        _this.submit(_this.user, _this.userid, _this.annotation.id, vote_prop, vote_val);

        _this.close_quiz();
        _this.player.trigger("QuizCreator.skip");
    });

    _this.refresh();
};

//UniqueChoice Question
IriSP.Widgets.UniqueChoiceQuestion = function (annotation) {
    this.annotation = annotation;
};

IriSP.Widgets.UniqueChoiceQuestion.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.UniqueChoiceQuestion.prototype.renderQuizTemplate = function (answer, identifier) {
    return '<input type="radio" class="quiz-question Ldt-Quiz-Question-Check Ldt-Quiz-Question-Check-' + identifier + '" name="question" data-question="' + identifier + '" value="' + identifier + '" />';
};

IriSP.Widgets.UniqueChoiceQuestion.prototype.renderTemplate = function (answer, identifier) {
    var id = IriSP.generateUuid();
    return '<input type="radio" id="' + id + '" class="quiz-question-edition Ldt-Quiz-Question-Check Ldt-Quiz-Question-Check-' + identifier + '" name="question" data-question="' + identifier + '" value="' + identifier + '" /><label for="' + id + '" title="Veuillez sélectionner la réponse correcte"></label>';
};

IriSP.Widgets.UniqueChoiceQuestion.prototype.renderFullTemplate = function (answer, identifier) {
    var correct = (answer && answer.correct) ? "checked" : "";
    var id = IriSP.generateUuid();
    return '<input type="radio" id="' + id + '" ' + correct + ' class="quiz-question-edition Ldt-Quiz-Question-Check Ldt-Quiz-Question-Check-' + identifier + '" name="question" data-question="' + identifier + '" value="' + identifier + '" /><label for="' + id + '"></label>';
};


//MultipleChoice Question
IriSP.Widgets.MultipleChoiceQuestion = function (annotation) {
    this.annotation = annotation;
};

IriSP.Widgets.MultipleChoiceQuestion.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.MultipleChoiceQuestion.prototype.renderQuizTemplate = function (answer, identifier) {
    return '<input type="checkbox" class="quiz-question Ldt-Quiz-Question-Check Ldt-Quiz-Question-Check-' + identifier + '" name="question[' + identifier + ']" data-question="' + identifier + '" value="' + identifier + '" /> ';
};

IriSP.Widgets.MultipleChoiceQuestion.prototype.renderTemplate = function (answer, identifier) {
    var id = IriSP.generateUuid();
    return '<input type="checkbox" id="' + id + '" class="quiz-question-edition Ldt-Quiz-Question-Check" name="question[' + identifier + ']" data-question="' + identifier + '" value="' + identifier + '" /><label for="' + id + '" title="Veuillez sélectionner la ou les réponses correctes"></label>';
};

IriSP.Widgets.MultipleChoiceQuestion.prototype.renderFullTemplate = function (answer, identifier) {
    var correct = (answer && answer.correct) ? "checked" : "";
    var id = IriSP.generateUuid();
    return '<input type="checkbox" id="' + id + '" ' + correct + ' class="quiz-question-edition Ldt-Quiz-Question-Check" name="question[' + identifier + ']" data-question="' + identifier + '" value="' + identifier + '" /><label for="' + id + '"></label> ';
};

IriSP.Widgets.Quiz.prototype.submit = function (user,user_id,question,prop,val) {
    var _this = this;
    var _url = Mustache.to_html(this.analytics_api, {id: this.source.projectId}),
    donnees = {
            "username": user,
            "useruuid": user_id,
            "subject": question,
            "property": prop,
            "value": val,
            "session": _this.session_id
        };

    IriSP.jQuery.ajax({
        url: _url,
        type: this.api_method,
        contentType: 'application/json',
        data: JSON.stringify(donnees),
        success: function (_data) {
        },
        error: function (_xhr, _error, _thrown) {
            IriSP.log("Error when sending annotation", _thrown);
        }
    });
};
