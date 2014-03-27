var article, article_view, articles, article_view_html, article_edit, article_edit_html;

article_view_html = "<div class='editarticle article-button'></div><div class='deletearticle article-button'></div><p><strong>Nombre: </strong><%= nombre %></p><p><strong>Apellido: </strong><%= apellido %></p><p><strong>Edad: </strong><%= edad %></p><p><strong>Registro Creado: </strong><%= created %></p>";
article_edit_html = "<form><p><strong>Nombre: </strong><input type='text' name='nombre' placeholder='Nombre' id='editarticlenombre' value='<%= nombre %>' /></p><p><strong>Apellido: </strong><input type='text' name='apellido' placeholder='Apellido' id='editarticleapellido' value='<%= apellido %>' /></p><p><strong>Edad: </strong><input type='text' name='edad' placeholder='Edad' id='editarticleedad' value='<%= edad %>' /></p><input type='submit' class='updatearticle' value='Actualizar'/><input type='submit' class='cancelupdatearticle' value='Cancelar'/></form>";

article = Backbone.Model.extend();

article_view = Backbone.View.extend({
	events: {
		"click .deletearticle": "clear",
		"click .editarticle": "edit",
		"click .cancelupdatearticle": "cancelUpdateArticle",
		"click .updatearticle": "updateArticle"
	},
	tagName: "div",
	className: "article",
	initialize: function (model) {
		var self;
		self = this;
		self.model = model;
		self.model.on('change', self.render, this);
		self.template = _.template(article_view_html);
		self.editTemplate = _.template(article_edit_html);
	},	
	render: function (model) {
		var self, locals;
		self = this;
		locals = model ? model.toJSON() : self.model.toJSON();
		locals.created = new Date(locals.created);
		self.$el.html(self.template(locals));
		return this;
	},
	clear: function () {
		this.off();
		this.$el.remove();
		// this.model.destroy({
		// 	success: function(deletedmodel,unknown,xhr) {
		// 		console.log(arguments);
		// 	},
		// 	error: function(err) {
		// 		console.log(arguments);	
		// 	}
		// });
		this.model.destroy();
	},
	edit: function () {
		var self, locals;
		self = this;
		locals = self.model.toJSON();
		locals.created = new Date(locals.created);
		self.$el.html(self.editTemplate(locals));
		self.$el.addClass('editformarticle');
		return this;
	},
	cancelUpdateArticle: function(e) {
		e.preventDefault();
		var self;
		self = this;
		self.$el.removeClass('editformarticle');
		self.render();
	},
	updateArticle: function(e) {
		e.preventDefault();
		var obj,form,self;
		self = this;
		form = self.$el;
		obj = {
			nombre: form.find('#editarticlenombre').val(),
			apellido: form.find('#editarticleapellido').val(),
			edad: parseInt(form.find('#editarticleedad').val(),10),
		};
		// self.model.set(obj);
		self.model.save(obj,{wait:true});
	}
});

articles = Backbone.Collection.extend({
	initialize: function () {
		this.fetch();
	},
	model: article,
	url: '/articles',
	parse: function(models){
		models = _.map(models, function(val) {
			val.created = new Date(val.created);
			return val;
		});
		return models;
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
				created: new Date()
			};

			var model = articles_1.create(obj, {
				success: function(response){
					model.id = response.id;
				}
			});

			form.find('#articlenombre').val('');
			form.find('#articleapellido').val('');
			form.find('#articleedad').val('')
			form.find('#articlenombre').focus();
		}
	}
});