module.exports = function() {
	var db;

	db = {
		articulos: {
			id: {
				type:'increments',
				nullable:false,
				primary:true
			},
			nombre: {
				type:'string',
				nullable:false
			},
			apellido: {
				type:'string',
				nullable:false
			},
			edad: {
				type:'integer',
				nullable:false
			},
			created: {
				type:'integer',
				nullable:false
			}
		}
	};

	return db;
};