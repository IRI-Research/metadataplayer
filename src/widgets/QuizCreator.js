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
	+		' à <input type="text" placeholder="hh:mm:ss" size="6" class="Ldt-QuizCreator-Time" /><button class="Ldt-QuizCreator-Question-Save">Sauvegarder</button></p>'
	+ 	'<div class="Ldt-QuizCreator-Questions-Block">'
	+ 	'</div>'
	+	'<div><button class="Ldt-QuizCreator-Question-Add">Ajouter une réponse</button></div>'
	+ '</div>';

/* Hide and clear the interface is case of someone skipped or answer the current question in the Quiz panel*/
IriSP.Widgets.QuizCreator.prototype.skip = function() {
	$(".Ldt-QuizCreator-Time").val("");
	$(".Ldt-QuizCreator-Question-Area").val("");
	$(".Ldt-QuizCreator-Resource-Area").val("");
	$(".Ldt-QuizCreator-Questions-Block").html("");
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
	var numItems = $('.Ldt-QuizCreator-Questions-Answer').length;
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
	this.$.find(".Ldt-QuizCreator-Question-Save").bind("click", this.functionWrapper("onSubmit"));

	$(".Ldt-QuizCreator-Export-Link").click(function() {
		_this.exportAnnotations();
	});

	$(".Ldt-QuizCreator-Time").keyup(function() {
		var str = $(".Ldt-QuizCreator-Time").val();
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

	if (annotation.content.data.type == "multiple_choice") {
		this.question = new IriSP.Widgets.MultipleChoiceQuestion(annotation);
	}
	else if (annotation.content.data.type == "unique_choice") {
		this.question = new IriSP.Widgets.UniqueChoiceQuestion(annotation);
	}

	var answers = annotation.content.data.answers;

	this.answers = [];

	var output = '';
	$(".Ldt-QuizCreator-Questions-Block").html(output);

	$(".Ldt-QuizCreator-Time").val(annotation.begin);
	$(".Ldt-QuizCreator-Question-Area").val(annotation.content.data.question);
	$(".Ldt-QuizCreator-Resource-Area").val(annotation.content.data.resource);

	for (i = 0; i < answers.length; i++) {
		output += '<div class="Ldt-QuizCreator-Questions-Answer">'
		+	'<div class="Ldt-QuizCreator-Questions-Answer-Correct">'+ this.question.renderFullTemplate(answers[i], this.nbAnswers()) +'</div>'
		+ 	'<div class="Ldt-QuizCreator-Questions-Answer-Content">Réponse <br />'
		+		'<input type="text" class="Ldt-QuizCreator-Answer-Content" data-question="'+ this.nbAnswers() +'" id="question'+ this.nbAnswers() +'" value="'+ answers[i].content +'" /><br />'
		+		'Commentaire <br/><textarea class="Ldt-QuizCreator-Answer-Feedback" data-question="'+ this.nbAnswers() +'" id="feedback'+ this.nbAnswers() +'">'+ answers[i].feedback +'</textarea>'
		+	'</div>'
		+ 	'<div class="Ldt-QuizCreator-Questions-Answer-Delete"><div class="Ldt-QuizCreator-Remove" id="remove'+ this.nbAnswers() +'">&nbsp;</div></div>'
		+	'</div>';
	}
	$(".Ldt-QuizCreator-Questions-Block").append(output);
}

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

	$(".Ldt-QuizCreator-Questions-Block").html(output);

    this.pauseOnWrite();
};

IriSP.Widgets.QuizCreator.prototype.onQuestionAdd = function(e) {

	var output = '<div class="Ldt-QuizCreator-Questions-Answer">'
	+ 	'<div class="Ldt-QuizCreator-Questions-Answer-Correct">'+ this.question.renderTemplate(null, this.nbAnswers()) +'</div>'
	+ 	'<div class="Ldt-QuizCreator-Questions-Answer-Content">Réponse <br /><input class="Ldt-QuizCreator-Answer-Content" data-question="'+ this.nbAnswers() +'" type="text" id="question'+ this.nbAnswers() +'" /><br />'
	+	'Commentaire <br/><textarea class="class="Ldt-QuizCreator-Answer-Feedback" data-question="'+ this.nbAnswers() +'"id="feedback'+ this.nbAnswers()+'"></textarea></div>'
	+ 	'<div class="Ldt-QuizCreator-Questions-Answer-Delete"><div class="Ldt-QuizCreator-Remove" id="remove'+ this.nbAnswers() +'">&nbsp;</div></div>'
	+ '</div>';


	$(".Ldt-QuizCreator-Questions-Block").append(output);
	$(".Ldt-QuizCreator-Answer-Content").last().focus();

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
    $(".Ldt-QuizCreator-Time").val(this.begin.toString());
};

IriSP.Widgets.QuizCreator.prototype.load_local_annotations = function() {
    // Update local storage
    if (this.localSource === undefined) {
        // Initialize local source
        this.localSource = this.player.sourceManager.newLocalSource({serializer: IriSP.serializers['ldt_localstorage']});
    }
    // Load current local annotations
    this.localSource.deSerialize(window.localStorage[this.editable_storage]);
};

IriSP.Widgets.QuizCreator.prototype.get_local_annotation = function (ident) {
    load_local_annotations();
    // We cannot use .getElement since it fetches
    // elements from the global Directory
    return IriSP._.first(IriSP._.filter(this.localSource.getAnnotations(), function (a) { return a.id == ident; }));
};

IriSP.Widgets.QuizCreator.prototype.save_local_annotations = function() {
    // Save annotations back
    window.localStorage[widget.editable_storage] = this.localSource.serialize();
    // Merge modifications into widget source
    this.source.merge(this.localSource);
};

IriSP.Widgets.QuizCreator.prototype.delete_local_annotation = function(i) {
    load_local_annotations();
    this.localSource.getAnnotations().removeId(i);
    this.source.getAnnotations().removeId(i);
    save_local_annotations();
    this.refresh(true);
};

IriSP.Widgets.QuizCreator.prototype.show = function() {
	//do something
};

IriSP.Widgets.QuizCreator.prototype.hide = function() {
	$(".Ldt-QuizCreator-Questions-Block").html("");
	$(".Ldt-QuizCreator-Question-Area").val("");
	$(".Ldt-QuizCreator-Resource-Area").val("");
	$(".Ldt-QuizCreator-Time").val("");
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

/* Fonction effectuant l'envoi des annotations */
IriSP.Widgets.QuizCreator.prototype.onSubmit = function() {
	if (this.nbAnswers() <= 0) {
		alert("Vous devez spécifier au moins une réponse à votre question !");
		return false;
	};

    var _this = this,
        _exportedAnnotations = new IriSP.Model.List(this.player.sourceManager), /* Création d'une liste d'annotations contenant une annotation afin de l'envoyer au serveur */
        _export = this.player.sourceManager.newLocalSource({serializer: IriSP.serializers[this.api_serializer]}), /* Création d'un objet source utilisant un sérialiseur spécifique pour l'export */
        _local_export = this.player.sourceManager.newLocalSource({serializer: IriSP.serializers['ldt_localstorage']}), /* Création d'un objet source utilisant un sérialiseur spécifique pour l'export local */
        _annotation = new IriSP.Model.Annotation(false, _export), /* Création d'une annotation dans cette source avec un ID généré à la volée (param. false) */
        _annotationTypes = this.source.getAnnotationTypes().searchByTitle(this.annotation_type, true), /* Récupération du type d'annotation dans lequel l'annotation doit être ajoutée */
        _annotationType = (_annotationTypes.length ? _annotationTypes[0] : new IriSP.Model.AnnotationType(false, _export)), /* Si le Type d'Annotation n'existe pas, il est créé à la volée */
        _url = Mustache.to_html(this.api_endpoint_template, {id: this.source.projectId}); /* Génération de l'URL à laquelle l'annotation doit être envoyée, qui doit inclure l'ID du projet */

    /* Si nous avons dû générer un ID d'annotationType à la volée... */
    if (!_annotationTypes.length) {
        /* Il ne faudra pas envoyer l'ID généré au serveur */
        _annotationType.dont_send_id = true;
        /* Il faut inclure le titre dans le type d'annotation */
		_annotationType.id = "Quiz";
        _annotationType.title = this.annotation_type;
    }

    /*
     * Nous remplissons les données de l'annotation générée à la volée
     * */
    _annotation.setMedia(this.source.currentMedia.id); /* Id du média annoté */
    _annotation.setBegin(this.begin); /*Timecode de début */
    _annotation.setEnd(this.end); /* Timecode de fin */
    _annotation.created = new Date(); /* Date de création de l'annotation */

    _annotation.setAnnotationType(_annotationType.id); /* Id du type d'annotation */
    _annotation.description = _this.getDescription();
	_annotation.content = {};
	_annotation.content.data = {};
	_annotation.content.data.type = $(".Ldt-QuizCreator-Question-Type").val();
	_annotation.content.data.question = _annotation.description;
	_annotation.content.data.resource = $(".Ldt-QuizCreator-Resource-Area").val();
	_annotation.content.data.answers = [];

	for (var i = 0; i < this.nbAnswers(); i++) {
		if (typeof $("#question"+ i) != "undefined") {
			var answer = {
				correct : ($(".Ldt-Quiz-Question-Check-"+ i).is(':checked')) ? true : false,
				content : $("#question"+ i).val(),
				feedback : $("#feedback"+ i).val()
			};
			_annotation.content.data.answers.push(answer);
		}
	}

    _annotation.title = _annotation.description;

    var tagIds = Array.prototype.map.call(
        $(".Ldt-CreateAnnotation-TagLi.selected"),
        function(el) { return IriSP.jQuery(el).attr("tag-id"); }
    );

    IriSP._(_annotation.description.match(/#[^\s#.,;]+/g)).each(function(_tt) {
        var _tag,
            _tag_title = _tt.replace(/^#/,''),
            _tags = _this.source.getTags().searchByTitle(_tag_title, true);
        if (_tags.length) {
            _tag = _tags[0];
        } else {
            _tag = new IriSP.Model.Tag(false, _this.source);
            _this.source.getTags().push(_tag);
            _tag.title = _tag_title;
        }
        if (tagIds.indexOf(_tag.id) === -1) {
            tagIds.push(_tag.id);
        }

    });

    _annotation.setTags(IriSP._(tagIds).uniq()); /*Liste des ids de tags */
    _annotation.creator = this.creator_name;
    _exportedAnnotations.push(_annotation); /* Ajout de l'annotation à la liste à exporter */

    if (this.editable_storage != '') {
        // Append to localStorage annotations

        // FIXME: handle movie ids
        _local_export.addList("annotation", _exportedAnnotations); /* Ajout de la liste à exporter à l'objet Source */
        _this.source.merge(_local_export); /* On ajoute la nouvelle annotation au recueil original */
        // Import previously saved local annotations
        if (window.localStorage[this.editable_storage]) {
            _local_export.deSerialize(window.localStorage[this.editable_storage]);
        }
        // Save everything back
        window.localStorage[_this.editable_storage] = _local_export.serialize();
        _this.player.trigger("AnnotationsList.refresh"); /* On force le rafraîchissement du widget AnnotationsList */
        _this.player.trigger("Annotation.create", _annotation);
        $(".Ldt-CreateAnnotation-Description").val("");
    }

    if (_url !== "") {
        _export.addList("annotation",_exportedAnnotations); /* Ajout de la liste à exporter à l'objet Source */
        /* Envoi de l'annotation via AJAX au serveur ! */
        IriSP.jQuery.ajax({
            url: _url,
            type: this.api_method,
            contentType: 'application/json',
            data: _export.serialize(), /* L'objet Source est sérialisé */
            success: function(_data) {
				_this.player.trigger("AnnotationsList.refresh"); /* On force le rafraîchissement du widget AnnotationsList */
                _this.player.trigger("CreateAnnotation.created", _annotation.id);

                if (this.editable_storage == '') {
                    _export.getAnnotations().removeElement(_annotation, true); /* Pour éviter les doublons, on supprime l'annotation qui a été envoyée */
                    _export.deSerialize(_data); /* On désérialise les données reçues pour les réinjecter */
                    _this.source.merge(_export); /* On récupère les données réimportées dans l'espace global des données */
                    if (_this.pause_on_write && _this.media.getPaused()) {
                        _this.media.play();
                    }
                    _this.player.trigger("AnnotationsList.refresh"); /* On force le rafraîchissement du widget AnnotationsList */
                    _this.player.trigger("CreateAnnotation.created", _annotation.id);
                }

				_tabs.tabs("option", "active", get_tab_index('#tab-quiz'));

				//Refresh the quiz container
				_this.player.trigger("Quiz.refresh");
				_this.reloadAnnotations();
            },
            error: function(_xhr, _error, _thrown) {
                IriSP.log("Error when sending annotation", _thrown);
                _export.getAnnotations().removeElement(_annotation, true);
                window.setTimeout(function(){
                },
                                  (_this.after_send_timeout || 5000));
            }
        });
    };
    return false;
};
