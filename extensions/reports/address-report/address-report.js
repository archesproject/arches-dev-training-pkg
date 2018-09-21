define([
    'knockout',
    'underscore',
    'mapbox-gl',
    'geojson-extent',
    'viewmodels/report',
    'bindings/mapbox-gl'
], function(ko, _, mapboxgl, geojsonExtent, ReportViewModel) {
    return ko.components.register('address-report', {
        viewModel: function(params) {
            var self = this;
            params.configKeys = ['icon'];
            
            ReportViewModel.apply(this, [params]);
            
            this.geoJSON = ko.computed(function() {
                var geoJSON = {
                    'type': 'FeatureCollection',
                    'features': []
                };
                ko.unwrap(self.tiles).forEach(function(tile) {
                    _.each(tile.data, function(value) {
                        value = ko.unwrap(value);
                        if (value) {
                            var address = ko.unwrap(value.address);
                            var x = ko.unwrap(value.x);
                            var y = ko.unwrap(value.y);
                            if (address && x && y) {
                                geoJSON.features.push({
                                    'properties': {
                                        'address': address
                                    },
                                    'geometry': {
                                        'type': 'Point',
                                        'coordinates': [
                                            x, 
                                            y
                                        ]
                                    }
                                })
                            }
                        }
                    }, this);
                }, this);
                return geoJSON;
            });
            
            this.setupMap = function(map) {
                map.on('load', function () {
                    var geoJSON = self.geoJSON();
                    var zoomToGeoJSON = function (geoJSON) {
                        if (geoJSON.features.length > 0) {
                            map.fitBounds(geojsonExtent(geoJSON), {
                                padding: 100,
                                maxZoom: 15
                            });
                        }
                    };
                    
                    map.addSource('address-points', {
                        'type': 'geojson',
                        'data': geoJSON
                    });
                    map.addLayer({
                        'id': 'address-points',
                        'source': 'address-points',
                        'type': 'symbol',
                        'layout': {
                            'icon-image': self.icon(),
                            'text-field': '{address}',
                            'text-offset': [0, 0.6],
                            'text-anchor': 'top'
                        }
                    });
                    zoomToGeoJSON(geoJSON);
                    
                    self.geoJSON.subscribe(function(geoJSON) {
                        map.getSource('address-points').setData(geoJSON);
                        zoomToGeoJSON(geoJSON);
                    });
                    
                    self.icon.subscribe(function(icon) {
                        map.setLayoutProperty('address-points', 'icon-image', icon);
                    });
                });
            };
        },
        template: {
            require: 'text!templates/views/components/reports/address-report.htm'
        }
    });
});
