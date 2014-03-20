var article, article_view, articles, article_view_html;

article_view_html = "<div class='deletearticle'></div><p><strong>Nombre: </strong><%= nombre %></p><p><strong>Apellido: </strong><%= apellido %></p><p><strong>Edad: </strong><%= edad %></p><p><strong>Registro Creado: </strong><%= creado %></p>";

article = Backbone.Model.extend();

article_view = Backbone.View.extend({
	routes
	events: {
		"click .deletearticle": "clear"
	},
	tagName: "div",
	className: "article",
	initialize: function (model) {
		var self;
		self = this;
		self.model = model;
		self.model.on('change', self.render, this);
		self.template = _.template(article_view_html);
	},
	render: function () {
		var self, locals;
		self = this;
		locals = self.model.toJSON();
		self.$el.html(self.template(locals));
		return this;
	},
	clear: function () {
		this.off();
		this.$el.remove();
		this.model.destroy();
	}
});

articles = Backbone.Collection.extend({
	initialize: function () {
		this.fetch();
	},
	model: article,
	url: '/db',
	parse: function(models){
		models.data = _.map(models.data, function(val) {
			val.creado = new Date();
			return val;
		});
		return models.data;
	}
});

$(function(){
	var formulario, articles_1;

	formulario = $('#newarticleform');
	formulario.on('submit', CancelDefault);

	articles_1 = new articles();
	articles_1.on('add', function (model) {
		var view = new article_view(model);
		view.render();
		$('#articles').prepend(view.$el);
	});

	function CancelDefault (e) {
		e.preventDefault();
		var form, obj;
		form = $(e.target);
		if (form.find('#articlenombre').val().length > 0 && form.find('#articleapellido').val().length > 0 && form.find('#articleedad').val().length > 0) {
			obj = {
				nombre: form.find('#articlenombre').val(),
				apellido: form.find('#articleapellido').val(),
				edad: form.find('#articleedad').val(),
				creado: new Date()
			};

			articles_1.add(obj);

			form.find('#articlenombre').val('');
			form.find('#articleapellido').val('');
			form.find('#articleedad').val('')
			form.find('#articlenombre').focus();
		}
	}
});