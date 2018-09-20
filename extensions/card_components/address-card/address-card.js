define([
    'knockout',
    'underscore',
    'viewmodels/card-component',
    'bindings/mapbox-gl'
], function(ko, _, CardComponentViewModel) {
    return ko.components.register('address-card', {
        viewModel: function(params) {
            var self = this;
            CardComponentViewModel.apply(this, [params]);
            
            this.fc = ko.computed(function() {
                var fc = {
                    type: 'FeatureCollection',
                    features: []
                };
                _.each(self.getValuesByDatatype('address'), function(data, id) {
                    if (data.value && data.value.address) {
                        fc.features.push({
                            id: id,
                            properties: {
                                name: data.name,
                                address: data.value.address
                            },
                            geometry: {
                                "type": "Point",
                                "coordinates": [
                                    data.value.x,
                                    data.value.y
                                ]
                            }
                        })
                    }
                });
                return fc;
            });
            
            this.setupMap = function(map) {
                map.on('load', function () {
                    map.addSource('address-points', {
                        'type': 'geojson',
                        'data': self.fc()
                    });
                    map.addLayer({
                        'id': 'address-points',
                        'source': 'address-points',
                        'type': 'symbol',
                        'layout': {
                            'icon-image': 'star-15',
                            'text-field': '{name}: {address}',
                            'text-offset': [0, 0.6],
                            'text-anchor': "top"
                        }
                    });
                    
                    self.fc.subscribe(function(fc) {
                        map.getSource('address-points').setData(fc);
                    });
                });
            };
        },
        template: {
            require: 'text!templates/views/components/card_components/address-card.htm'
        }
    });
});
