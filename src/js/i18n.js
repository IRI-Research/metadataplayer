IriSP.i18n_factory = function() {
    this.messages = {};
    this.base_lang = 'en';
}

IriSP.i18n_factory.prototype.getLanguage = function(lang) {
    var _lang = (
        typeof lang != "undefined"
        ? lang
        : (
            typeof IriSP.language != "undefined"
            ? IriSP.language
            : this.base_lang
        )
    );
    return (
        typeof this.messages[_lang] == "object"
        ? _lang
        : (
            typeof this.messages[this.base_lang] == "object"
            ? this.base_lang
            : null
        )
    )
}

IriSP.i18n_factory.prototype.getMessages = function(lang) {
    var _lang = this.getLanguage(lang);
    return (
        _lang != null
        ? this.messages[_lang]
        : {}
    );
}

IriSP.i18n_factory.prototype.getMessage = function(message, lang) {
    var _msgs = this.getMessages(lang);
    return (
        typeof _msgs[message] != "undefined"
        ? _msgs[message]
        : message
    )
}

IriSP.i18n_factory.prototype.addLanguage = function(lang, messages) {
    this.messages[lang] = messages;
}

IriSP.i18n_factory.prototype.addLanguages = function(messages) {
    var _this = this;
    IriSP.underscore(messages).each(function(_messages, _lang) {
        _this.addLanguage(_lang, _messages);
    });
}

IriSP.i18n = new IriSP.i18n_factory();

IriSP.i18n.addLanguages(
    {
        en: {
            submit: "Submit",
            add_keywords: "Add keywords",
            add_polemic_keywords: "Add polemic keywords",
            your_name: "Your name",
            type_here: "Type your annotation here.",
            wait_while_processed: "Please wait while your request is being processed...",
            error_while_contacting: "An error happened while contacting the server. Your annotation has not been saved.",
            empty_annotation: "Your annotation is empty. Please write something before submitting.",
            annotation_saved: "Thank you, your annotation has been saved.",
            share_annotation: "Would you like to share it on social networks ?",
            share_on: "Share on",
            play_pause: "Play/Pause",
            mute_unmute: "Mute/Unmute",
            play: "Play",
            pause: "Pause",
            mute: "Mute",
            unmute: "Unmute",
            annotate: "Annotate",
            search: "Search",
            elapsed_time: "Elapsed time",
            total_time: "Total time"
        },
        fr: {
            submit: "Envoyer",
            add_keywords: "Ajouter des mots-clés",
            add_polemic_keywords: "Ajouter des mots-clés polémiques",
            your_name: "Votre nom",
            type_here: "Rédigez votre annotation ici.",
            wait_while_processed: "Veuillez patienter pendant le traitement de votre requête...",
            error_while_contacting: "Une erreur s'est produite en contactant le serveur. Votre annotation n'a pas été enregistrée",
            empty_annotation: "Votre annotation est vide. Merci de rédiger un texte avant de l'envoyer.",
            annotation_saved: "Merci, votre annotation a été enregistrée.",
            share_annotation: "Souhaitez-vous la partager sur les réseaux sociaux ?",
            share_on: "Partager sur",
            play_pause: "Lecture/Pause",
            mute_unmute: "Couper/Activer le son",
            play: "Lecture",
            pause: "Pause",
            mute: "Couper le son",
            unmute: "Activer le son",
            annotate: "Annoter",
            search: "Rechercher",
            elapsed_time: "Durée écoulée",
            total_time: "Durée totale"
        }
    }
);
