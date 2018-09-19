define([
    'knockout',
    'viewmodels/widget',
    'arches',
    'bindings/select2-query'
], function (ko, WidgetViewModel, arches) {
    return ko.components.register('geocoder', {
        viewModel: function(params) {
            var self = this;
            this.valueProperties = ['placeName','x','y']
            WidgetViewModel.apply(this, [params]);
                        
            this.select2Config = {
                value: this.placeName,
                query: function (query) {
                    if (query.term.length < 3) {
                        query.callback({results: []});
                        return;
                    }
                    var url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' +
                        query.term + '.json';
                    $.getJSON(url, {
                        access_token: arches.mapboxApiKey,
                        types: 'address',
                        limit: 10
                    }, function (data) {
                        query.callback({results: data.features});
                    });
                },
                initSelection: function(element, callback) {
                    callback({
                        place_name: self.placeName(),
                        center: [
                            self.x(),
                            self.y()
                        ]
                    });
                },
                id: function(selection) {
                    return selection.place_name;
                },
                formatResult: function(selection) {
                    return selection.place_name;
                },
                formatSelection: function(selection) {
                    self.x(selection.center[0]);
                    self.y(selection.center[1]);
                    return selection.place_name;
                }
            };
        },
        template: {
            require: 'text!templates/views/components/widgets/geocoder.htm'
        }
    });
});
