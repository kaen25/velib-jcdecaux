(function($, undefined){

	function ajax(callback, datas, method) {

		method = method || 'GET';

		$.ajax({
			url: './proxy.php',
			data: datas,
			success: callback,
			dataType: 'JSON',
			type: method
		});

	};

	function ucfirst(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}


	function jcdecaux(contract) {
		this._contract = contract;
		this._stations = null;

	};

	jcdecaux.prototype.statistiques = function(name, callback){
		ajax(callback, {'action': 'stations'});
	};

	jcdecaux.prototype.contracts = function(callback){
		ajax(callback, {'action': 'contracts'});
	};


	jcdecaux.prototype.allStations = function(callback){
		ajax(callback, {'action': 'stations'});
	};

	jcdecaux.prototype.stations = function(contract, callback){
		ajax(callback, {'action': 'stations', 'contract': ucfirst(contract)});
	};

	jcdecaux.prototype.station = function(id, contract, callback){
		ajax(callback, {'action': 'stations', 'contract': ucfirst(contract), 'id': id});
	};

	jcdecaux.prototype.getStations = function(callback) {

		if(this._stations) {
			return this._stations;
		}

		this.stations(this._contract, function(data){
			this._stations = data; //cache
			if(callback) callback(data);
		});
	};

	jcdecaux.prototype.getStation = function(id, callback) {
		this.station(id, this._contract, callback);
	};


	function vlib() {
		this.map = L.map('map').setView([47.2336, 6.0303], 15);
		this.jcd = new jcdecaux('besancon');
		var self = this;

		L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
			maxZoom: 18,
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
		}).addTo(this.map);

		this.jcd.getStations(function(data){
			$.each(data, function(id, station){
				console.log(station);

				var d = new Date(station.last_update);
				var infos = '<ul>'+
					'<li>Adresse : '+ station.address +'</li>'+
					'<li>Etat : '+ (station.status === 'OPEN' ? 'Ouverte' : 'Fermée') +'</li>'+
					'<li>Système de paiement : '+ (station.banking === true ? 'Oui' : 'Non') +'</li>'+
					'<li>Station bonus : '+ (station.bonus === true ? 'Oui' : 'Non') +'</li>'+
					'<li>Disponibilitée : '+ station.available_bikes +' / '+ station.bike_stands +'</li>'//+
					//'<li>Mise à jour : ' + d.getDate() + '/' + d.getMonth() + '/' + d.getYear() + ' ' + d.getHours() + ':'  + d.getMinutes() + ':'  + d.getSeconds() + '</li>'

				L.marker([station.position.lat, station.position.lng], {'title': station.name}).addTo(self.map).bindPopup('<h1>' + station.name + '</h1>' + infos, {'keepInView': true});
			});
		});
	};

	window.vlib = new vlib;

})(jQuery)