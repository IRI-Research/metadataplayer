IriSP.I18n = function() {
    this.messages = {};
    this.base_lang = 'en';
}

IriSP.I18n.prototype.getLanguage = function(lang) {
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

IriSP.I18n.prototype.getMessages = function(lang) {
    var _lang = this.getLanguage(lang);
    return (
        _lang != null
        ? this.messages[_lang]
        : {}
    );
}

IriSP.I18n.prototype.getMessage = function(message, lang) {
    var _msgs = this.getMessages(lang);
    return (
        typeof _msgs[message] != "undefined"
        ? _msgs[message]
        : message
    )
}

IriSP.I18n.prototype.addMessage = function(lang, messagekey, messagevalue) {
    if (typeof this.messages[lang] == "undefined") {
        this.messages[lang] = {};
    }
    this.messages[lang][messagekey] = messagevalue;
}

IriSP.I18n.prototype.addMessages = function(messagesObj) {
    var _this = this;
    IriSP.underscore(messagesObj).each(function(_messages, _lang) {
        IriSP.underscore(_messages).each(function(_value, _key) {
            _this.addMessage(_lang, _key, _value);
        })
    });
}

IriSP.i18n = new IriSP.I18n();

IriSP.i18n.addMessages({
    "fr": {
        "loading_wait": "Chargement en cours, veuillez patienter&hellip;"
    },
    "en": {
        "loading_wait": "Loading, please wait&hellip;"
    }
})
