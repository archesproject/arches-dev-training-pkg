define([
    'knockout',
    'underscore',
    'mapbox-gl',
    'viewmodels/card-component',
    'bindings/mapbox-gl'
], function(ko, _, mapboxgl, CardComponentViewModel) {
    return ko.components.register('address-card', {
        viewModel: function(params) {
            var self = this;
            CardComponentViewModel.apply(this, [params]);
            
            this.geoJSON = ko.computed(function() {
                var geoJSON = {
                    'type': 'FeatureCollection',
                    'features': []
                };
                _.each(self.getValuesByDatatype('address'), function(data) {
                    var value = data.value;
                    if (value && value.address && value.x && value.y) {
                        geoJSON.features.push({
                            'properties': {
                                'name': data.name,
                                'address': value.address
                            },
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [value.x, value.y]
                            }
                        })
                    }
                });
                return geoJSON;
            });
            
            this.setupMap = function(map) {
                map.on('load', function () {
                    var zoomToGeoJSON = function () {
                        var features = self.geoJSON().features;
                        if (features.length > 0) {
                            var bounds = features.reduce(function(bounds, feature) {
                                return bounds.extend(feature.geometry.coordinates);
                            }, new mapboxgl.LngLatBounds(
                                features[0].geometry.coordinates,
                                features[0].geometry.coordinates
                            ));
                            
                            map.fitBounds(bounds, {
                                padding: 20,
                                maxZoom: 15
                            });
                        }
                    };
                    
                    map.addSource('address-points', {
                        'type': 'geojson',
                        'data': self.geoJSON()
                    });
                    map.addLayer({
                        'id': 'address-points',
                        'source': 'address-points',
                        'type': 'symbol',
                        'layout': {
                            'icon-image': self.card.model.get('config').icon(),
                            'text-field': '{name}: {address}',
                            'text-offset': [0, 0.6],
                            'text-anchor': 'top'
                        }
                    });
                    zoomToGeoJSON();
                    
                    self.geoJSON.subscribe(function(geoJSON) {
                        map.getSource('address-points').setData(geoJSON);
                        zoomToGeoJSON();
                    });
                    
                    self.card.model.get('config').icon.subscribe(function(icon) {
                        map.setLayoutProperty('address-points', 'icon-image', icon);
                    });
                });
            };
        },
        template: {
            require: 'text!templates/views/components/card_components/address-card.htm'
        }
    });
});
