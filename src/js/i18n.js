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

IriSP.i18n_factory.prototype.addMessage = function(lang, messagekey, messagevalue) {
    if (typeof this.messages[lang] == "undefined") {
        this.messages[lang] = {};
    }
    this.messages[lang][messagekey] = messagevalue;
}

IriSP.i18n_factory.prototype.addMessages = function(messagesObj) {
    var _this = this;
    IriSP.underscore(messagesObj).each(function(_messages, _lang) {
        IriSP.underscore(_messages).each(function(_value, _key) {
            _this.addMessage(_lang, _key, _value);
        })
    });
}

IriSP.i18n = new IriSP.i18n_factory();
