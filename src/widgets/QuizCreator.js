/* TODO: Add Social Network Sharing */

IriSP.Widgets.QuizCreator = function(player, config) {
    var _this = this;
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.QuizCreator.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.QuizCreator.prototype.defaults = {
    creator_name : "",
    tags : false,
    tag_titles : false,
    pause_on_write : true,
    annotation_type: "Quiz",
    api_serializer: "ldt_annotate",
    api_endpoint_template: "",
    api_method: "POST"
};

IriSP.Widgets.QuizCreator.prototype.messages = {
    en: {
    },
    fr: {
    }
};

IriSP.Widgets.QuizCreator.prototype.template =
	  '<div class="Ldt-QuizCreator-Ui Ldt-TraceMe">'
	+	'<div class="Ldt-QuizCreator-Question-Form">'
	+		'<textarea class="Ldt-QuizCreator-Question-Area" placeholder="Votre question"></textarea><br />'
	+		'<textarea class="Ldt-QuizCreator-Resource-Area" placeholder="Ressources (lien vers une image, etc.)"></textarea><br />'
	+	'</div>'
	+		'<p>Type de question  '
	+ 		'<select name="type" class="Ldt-QuizCreator-Question-Type">'
	+			'<option value="unique_choice">Choix unique</option>'
	+			'<option value="multiple_choice">Choix multiple</option>'
	+		'</select>'
	+		' à <input type="text" placeholder="hh:mm:ss" size="6" class="Ldt-QuizCreator-Time" />'
	+ 	'<div class="Ldt-QuizCreator-Questions-Block">'
	+ 	'</div>'
	+	'<div>'
    +   '  <button class="Ldt-QuizCreator-Question-Add">Ajouter une réponse</button><hr>'
    +   '  <button class="Ldt-QuizCreator-Question-Save">Sauvegarder</button>'
    +   '</div>'
	+ '</div>';

/* Hide and clear the interface is case of someone skipped or answer the current question in the Quiz panel*/
IriSP.Widgets.QuizCreator.prototype.skip = function() {
	this.$.find(".Ldt-QuizCreator-Time").val("");
	this.$.find(".Ldt-QuizCreator-Question-Area").val("");
	this.$.find(".Ldt-QuizCreator-Resource-Area").val("");
	this.$.find(".Ldt-QuizCreator-Questions-Block").html("");
    this.current_annotation = undefined;
};

IriSP.Widgets.QuizCreator.prototype.nbAnswers = function(){
	var numItems = this.$.find('.Ldt-QuizCreator-Questions-Answer').length;
	return numItems;
};

IriSP.Widgets.QuizCreator.prototype.draw = function() {
	var _this = this;

    this.onMediaEvent("timeupdate", function(_time) {
    	_this.setBegin(_time);
    });

	this.onMdpEvent("QuizCreator.show", function() {
		_this.setBegin(_this.media.currentTime);
    });

	this.onMdpEvent("QuizCreator.create", function() {
		_this.skip();
		_this.setBegin(_this.media.currentTime);
    });

    this.onMdpEvent("QuizCreator.skip", function() {
		_this.skip();
    });

    this.onMdpEvent("QuizCreator.edit", function (_annotation) {
		_this.skip();
        _this.addQuestion(_annotation);
    });

	this.$.on("click", ".Ldt-QuizCreator-Remove", function() {
        $(this).parents(".Ldt-QuizCreator-Questions-Answer").remove();
	});

    this.begin = new IriSP.Model.Time();
    this.end = this.source.getDuration();
	this.answers = [];

    this.renderTemplate();

	/* Quiz creator */

	this.question = new IriSP.Widgets.UniqueChoiceQuestion();

	this.$.find(".Ldt-QuizCreator-Question-Type").bind("change", this.functionWrapper("onQuestionTypeChange"));
	this.$.find(".Ldt-QuizCreator-Question-Add").bind("click", this.functionWrapper("onQuestionAdd"));
	this.$.find(".Ldt-QuizCreator-Question-Save").bind("click", this.functionWrapper("onSave"));

	this.$.find(".Ldt-QuizCreator-Time").keyup(function() {
		var str = _this.$.find(".Ldt-QuizCreator-Time").val();
		_this.begin = IriSP.timestamp2ms(str);
		_this.end = _this.begin + 1000;
	});

    this.onMediaEvent("timeupdate", function(_time) {
        // Do not update timecode if description is not empty
        if (_this.getDescription()) {
            _this.setBegin(_time);
        };
    });
};

IriSP.Widgets.QuizCreator.prototype.getDescription = function() {
    return this.$.find(".Ldt-QuizCreator-Question-Area").val().trim();
};

IriSP.Widgets.QuizCreator.prototype.addQuestion = function(annotation, number) {
    var _this = this;

	if (annotation.content.data.type == "multiple_choice") {
		this.question = new IriSP.Widgets.MultipleChoiceQuestion(annotation);
	}
	else if (annotation.content.data.type == "unique_choice") {
		this.question = new IriSP.Widgets.UniqueChoiceQuestion(annotation);
	}

	var answers = annotation.content.data.answers;

	this.answers = [];


	this.$.find(".Ldt-QuizCreator-Time").val(annotation.begin);
	this.$.find(".Ldt-QuizCreator-Question-Area").val(annotation.content.data.question);
	this.$.find(".Ldt-QuizCreator-Resource-Area").val(annotation.content.data.resource);
	this.$.find(".Ldt-QuizCreator-Questions-Block").html('');
    answers.forEach( function (ans) {
        _this.onQuestionAdd(null, ans);
    });
    _this.current_annotation = annotation;
};

IriSP.Widgets.QuizCreator.prototype.onQuestionTypeChange = function(e) {

    var _field = this.$.find(".Ldt-QuizCreator-Question-Type");
    var _contents = _field.val();

	var _this = this;
	switch(_contents) {
		case "unique_choice":
			this.question = new IriSP.Widgets.UniqueChoiceQuestion();
		break;

		case "multiple_choice":
			this.question = new IriSP.Widgets.MultipleChoiceQuestion();
		break;
	}

	var output = "";

	_this.$.find(".Ldt-QuizCreator-Questions-Block").html(output);

    this.pauseOnWrite();
};

// Either e !== undefined, then it has been called by the interface and answer === undefined, generate an empty form.
// Or e === null && answer !== undefined, an existing answer is provided.
IriSP.Widgets.QuizCreator.prototype.onQuestionAdd = function(e, answer) {
	var output = '<div class="Ldt-QuizCreator-Questions-Answer">'
		+	'Réponse <div class="Ldt-QuizCreator-Questions-Answer-Correct">'+ this.question.renderFullTemplate(answer, this.nbAnswers()) +'</div><br />'
		+ 	'<div class="Ldt-QuizCreator-Questions-Answer-Content">'
		+		'<input type="text" class="Ldt-QuizCreator-Answer-Content" data-question="'+ this.nbAnswers() +'" id="question'+ this.nbAnswers() + '"' +  (answer ? ' value="'+ answer.content + '"' : "") + '/><br />'
		+		'Commentaire <br/><textarea class="Ldt-QuizCreator-Answer-Feedback" data-question="'+ this.nbAnswers() +'" id="feedback'+ this.nbAnswers() +'">' + (answer ? answer.feedback : "") + '</textarea>'
		+	'</div>'
		+ 	'<div class="Ldt-QuizCreator-Questions-Answer-Delete"><div class="Ldt-QuizCreator-Remove">&nbsp;</div></div>'
		+	'</div>';
	this.$.find(".Ldt-QuizCreator-Questions-Block").append(output);
	this.$.find(".Ldt-QuizCreator-Answer-Content").last().focus();

    this.pauseOnWrite();
};

IriSP.Widgets.QuizCreator.prototype.pauseOnWrite = function() {
    if (this.pause_on_write && !this.media.getPaused()) {
        this.media.pause();
    }
};

IriSP.Widgets.QuizCreator.prototype.setBegin = function (t) {
    this.begin = new IriSP.Model.Time(t || 0);
	this.end = this.begin + 500;
    this.$.find(".Ldt-QuizCreator-Time").val(this.begin.toString());
};

IriSP.Widgets.QuizCreator.prototype.get_local_annotation = function (ident) {
    return this.player.getLocalAnnotation(ident);
};

IriSP.Widgets.QuizCreator.prototype.save_local_annotations = function() {
    this.player.saveLocalAnnotations();
    // Merge modifications into widget source
    this.source.merge(this.player.localSource);
};

IriSP.Widgets.QuizCreator.prototype.delete_local_annotation = function(ident) {
    this.source.getAnnotations().removeId(ident);
    this.player.deleteLocalAnnotation(ident);
    this.current_annotation = undefined;
    this.refresh(true);
};

IriSP.Widgets.QuizCreator.prototype.show = function() {
	this.$.find(".Ldt-QuizCreator-Question-Area").focus();
};

IriSP.Widgets.QuizCreator.prototype.hide = function() {
	this.$.find(".Ldt-QuizCreator-Questions-Block").html("");
	this.$.find(".Ldt-QuizCreator-Question-Area").val("");
	this.$.find(".Ldt-QuizCreator-Resource-Area").val("");
	this.$.find(".Ldt-QuizCreator-Time").val("");
};

/* Save a local annotation */
IriSP.Widgets.QuizCreator.prototype.onSave = function(event, should_publish) {
    // Either the annotation already exists (then we overwrite its
    // content) or it must be created.
    var is_created = false;

	if (this.nbAnswers() <= 0) {
		alert("Vous devez spécifier au moins une réponse à votre question !");
		return false;
	};
    // Check that there is at least 1 valid answer
    if (! this.$.find(".quiz-question-edition:checked").length) {
        alert("Vous n'avez pas indiqué de bonne réponse.");
        return false;
    };
    var _annotation;
    if (this.current_annotation) {
        is_created = false;
        _annotation = this.current_annotation;
    } else {
        is_created = true;
        var _annotationTypes = this.source.getAnnotationTypes().searchByTitle(this.annotation_type, true), /* Récupération du type d'annotation dans lequel l'annotation doit être ajoutée */
        _annotationType = (_annotationTypes.length ? _annotationTypes[0] : new IriSP.Model.AnnotationType(false, this.player.localSource)); /* Si le Type d'Annotation n'existe pas, il est créé à la volée */

        /* Si nous avons dû générer un ID d'annotationType à la volée... */
        if (!_annotationTypes.length) {
            /* Il ne faudra pas envoyer l'ID généré au serveur */
            _annotationType.dont_send_id = true;
            /* Il faut inclure le titre dans le type d'annotation */
            _annotationType.title = this.annotation_type;
        }

        _annotation = new IriSP.Model.Annotation(false, this.player.localSource); /* Création d'une annotation dans cette source avec un ID généré à la volée (param. false) */

        // Initialize some fields in case of creation
        _annotation.created = new Date(); /* Date de création de l'annotation */
        _annotation.creator = this.creator_name;
        _annotation.setAnnotationType(_annotationType.id); /* Id du type d'annotation */
        this.player.localSource.getMedias().push(this.source.currentMedia);
        _annotation.setMedia(this.source.currentMedia.id); /* Id du média annoté */
    }

    /*
     * Nous remplissons les données de l'annotation
     * */
    _annotation.setBeginEnd(this.begin, this.end);
    _annotation.modified = new Date(); /* Date de modification de l'annotation */
    _annotation.contributor = this.creator_name;
    _annotation.description = this.getDescription();
    _annotation.title = _annotation.description;
	_annotation.content = {};
	_annotation.content.data = {};
	_annotation.content.data.type = this.$.find(".Ldt-QuizCreator-Question-Type").val();
	_annotation.content.data.question = _annotation.description;
	_annotation.content.data.resource = this.$.find(".Ldt-QuizCreator-Resource-Area").val();
    _annotation.content.data.answers = $.makeArray($(".Ldt-QuizCreator-Questions-Answer")
                                                   .map(function (ans)
                                                        {
                                                            return {
                                                                content: $(this).find(".Ldt-QuizCreator-Answer-Content").val(),
                                                                feedback: $(this).find(".Ldt-QuizCreator-Answer-Feedback").val(),
                                                                correct: $(this).find(".Ldt-Quiz-Question-Check").is(':checked')
                                                            };
                                                        }));
    this.current_annotation = _annotation;
    if (is_created) {
        // Add the annotation to the localSource
        this.player.addLocalAnnotation(_annotation);
        // Update also the remote source
        this.source.getAnnotations().push(_annotation);
        this.player.trigger("Annotation.create", _annotation);
    } else {
        // Update the annotation
        this.player.saveLocalAnnotations();
        this.player.trigger("Annotation.update", _annotation);
    };
    this.player.trigger("AnnotationsList.refresh"); /* On force le rafraîchissement des widgets AnnotationsList */
    this.player.trigger("Quiz.refresh"); /* On force le rafraîchissement des widgets Quiz */
};
