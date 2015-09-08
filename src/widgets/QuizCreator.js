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
    api_method: "POST",
    // Id that will be used as localStorage key
    editable_storage: ""
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
    +   '  <button class="Ldt-QuizCreator-Question-Publish">Publier</button></p>'
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

IriSP.Widgets.QuizCreator.prototype.reloadAnnotations = function() {
	var _this = this;
    var _annotations = this.getWidgetAnnotations().sortBy(function(_annotation) {
        return _annotation.begin;
    });
	var flag = 1;

    _annotations.forEach(function(_a) {
		_a.on("enter", function() {
            _this.addQuestion(_a, flag++);
        });
    });

};

IriSP.Widgets.QuizCreator.prototype.nbAnswers = function(){
	var numItems = this.$.find('.Ldt-QuizCreator-Questions-Answer').length;
	return numItems;
};

IriSP.Widgets.QuizCreator.prototype.draw = function() {
	var _this = this;
    this.reloadAnnotations();

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
	this.$.find(".Ldt-QuizCreator-Question-Publish").bind("click", this.functionWrapper("onPublish"));

	this.$.find(".Ldt-QuizCreator-Export-Link").click(function() {
		_this.exportAnnotations();
	});

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


IriSP.Widgets.QuizCreator.prototype.exportAnnotations = function() {
    var widget = this;
    var annotations = this.getWidgetAnnotations().sortBy(function(_annotation) {
        return _annotation.begin;
    });
    var $ = IriSP.jQuery;

	var content = "{annotations : [\n";

	var i = 0;
	var goal = annotations.length - 1;
	var _this = this;

	annotations.forEach(function(_a) {
		var _exportedAnnotations = new IriSP.Model.List(_this.player.sourceManager), /* Création d'une liste d'annotations contenant une annotation afin de l'envoyer au serveur */
        _export = _this.player.sourceManager.newLocalSource({serializer: IriSP.serializers[_this.api_serializer]}); /* Création d'un objet source utilisant un sérialiseur spécifique pour l'export */
		_a.setAnnotationType("Quiz");
		_exportedAnnotations.push(_a); /* Ajout de l'annotation à la liste à exporter */
		_export.addList("annotation",_exportedAnnotations); /* Ajout de la liste à exporter à l'objet Source */
		content += _export.serialize();
		if (i < goal) {
			content += ",\n";
		}
		i++;
	});
	content += "]}";

    var el = $("<pre>")
            .addClass("exportContainer")
            .text(content)
            .dialog({
                title: "Annotation export",
                open: function( event, ui ) {
                    // Select text
                    var range;
                    if (document.selection) {
		                range = document.body.createTextRange();
                        range.moveToElementText(this[0]);
		                range.select();
		            } else if (window.getSelection) {
		                range = document.createRange();
		                range.selectNode(this[0]);
		                window.getSelection().addRange(range);
		            }
                },
                autoOpen: true,
                width: '80%',
                minHeight: '400',
                height: 400,
                buttons: [ { text: "Close", click: function() { $( this ).dialog( "close" ); } },
                           { text: "Download", click: function () {
								function encode_utf8( s ) {
								  return unescape( encodeURIComponent( s ) );
								}

								function decode_utf8( s ) {
								  return decodeURIComponent( escape( s ) );
								}
                               a = document.createElement('a');
                               a.setAttribute('href', 'data:text/plain;base64,' + btoa(encode_utf8(content)));
                               a.setAttribute('download', 'Annotations - ' + widget.media.title.replace(/[^ \w]/g, '') + '.json');
                               a.click();
                           } } ]
            });
};

/* Save a local annotation */
IriSP.Widgets.QuizCreator.prototype.onSave = function(should_publish) {
    // Either the annotation already exists (then we overwrite its
    // content) or it must be created.
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
        _annotation = this.current_annotation;
    } else {
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
    }

    /*
     * Nous remplissons les données de l'annotation
     * */
    this.player.localSource.getMedias().push(this.source.currentMedia);
    _annotation.setMedia(this.source.currentMedia.id); /* Id du média annoté */
    _annotation.setBegin(this.begin); /*Timecode de début */
    _annotation.setEnd(this.end); /* Timecode de fin */
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
    if (this.player.getLocalAnnotation(_annotation.id)) {
        // Update the annotation
        this.player.saveLocalAnnotations();
    } else {
        // Add the annotation to the localSource
        this.player.addLocalAnnotation(_annotation);
        // Update also the remote source
        this.source.merge([ _annotation ]);
    };
    this.current_annotation = _annotation;
    if (!should_publish) {
        this.player.trigger("AnnotationsList.update"); /* On force le rafraîchissement des widgets AnnotationsList */
        this.player.trigger("Annotation.create", _annotation);
    }
};

/* Publish an annotation */
IriSP.Widgets.QuizCreator.prototype.onPublish = function() {
    this.onSave(null, true);
    var _this = this,
        _exportedAnnotations = new IriSP.Model.List(this.player.sourceManager), /* Création d'une liste d'annotations contenant une annotation afin de l'envoyer au serveur */
        _export = this.player.sourceManager.newLocalSource({serializer: IriSP.serializers[this.api_serializer]}), /* Création d'un objet source utilisant un sérialiseur spécifique pour l'export */
        _url = Mustache.to_html(this.api_endpoint_template, {id: this.source.projectId}); /* Génération de l'URL à laquelle l'annotation doit être envoyée, qui doit inclure l'ID du projet */

    // Replace annotation type for public annotation
    if (_this.publish_type) {
        // If publish_type is specified, try to set the annotation type of the exported annotation
        var at = _this.source.getAnnotationTypes().filter(function(at) { return at.title == _this.publish_type; });
        if (at.length == 1) {
            this.current_annotation.setAnnotationType(at[0].id);
        }
    }
    _exportedAnnotations.push(this.current_annotation); /* Ajout de l'annotation à la liste à exporter */

    if (_url !== "") {
        _export.addList("annotation",_exportedAnnotations); /* Ajout de la liste à exporter à l'objet Source */
        /* Envoi de l'annotation via AJAX au serveur ! */
        IriSP.jQuery.ajax({
            url: _url,
            type: this.api_method,
            contentType: 'application/json',
            data: _export.serialize(), /* L'objet Source est sérialisé */
            success: function(_data) {

                _export.getAnnotations().removeElement(this.current_annotation, true); /* Pour éviter les doublons, on supprime l'annotation qui a été envoyée */
                _export.deSerialize(_data); /* On désérialise les données reçues pour les réinjecter */
                _this.source.merge(_export); /* On récupère les données réimportées dans l'espace global des données */
                if (_this.pause_on_write && _this.media.getPaused()) {
                    _this.media.play();
                }
                IriSP.jQuery(this).addClass("published");
				_this.player.trigger("AnnotationsList.refresh"); /* On force le rafraîchissement du widget AnnotationsList */
                _this.player.trigger("Annotation.publish", this.current_annotation);
                _this.player.trigger("CreateAnnotation.created", this.current_annotation.id);
                },
            error: function(_xhr, _error, _thrown) {
                IriSP.log("Error when sending annotation", _thrown);
                _export.getAnnotations().removeElement(this.current_annotation, true);
                window.setTimeout(function(){
                },
                                  (_this.after_send_timeout || 5000));
            }
        });
    };
    return false;
};
