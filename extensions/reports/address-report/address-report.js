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
            this.featureCollection = ko.computed({
                read: function() {
                    var features = [];
                    ko.unwrap(self.tiles).forEach(function(tile) {
                        _.each(tile.data, function(val) {
                            if ('features' in val) {
                                features = features.concat(koMapping.toJS(val.features));
                            }
                        }, this);
                    }, this);
                    return {
                        type: 'FeatureCollection',
                        features: features
                    };
                },
                write: function() {
                    return;
                }
            });
            
            this.geoJSON = ko.computed(function() {
                var geoJSON = {
                    'type': 'FeatureCollection',
                    'features': []
                };
                ko.unwrap(self.tiles).forEach(function(tile) {
                    _.each(tile.data, function(value) {
                        if (value && value.address && value.x && value.y) {
                            geoJSON.features.push({
                                'properties': {
                                    'address': ko.unwrap(value.address)
                                },
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': [
                                        ko.unwrap(value.x), 
                                        ko.unwrap(value.y)
                                    ]
                                }
                            })
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
