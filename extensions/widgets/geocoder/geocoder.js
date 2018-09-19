define([
    'knockout',
    'viewmodels/widget',
    'arches'
], function (ko, WidgetViewModel, arches) {
    return ko.components.register('geocoder', {
        viewModel: function(params) {
            var self = this;
            WidgetViewModel.apply(this, [params]);
            
            if (ko.isObservable(this.value)){
                this.placeName = ko.observable();
                this.x = ko.observable();
                this.y = ko.observable();
                this.placeName.subscribe(function() {
                        this.value({
                            placeName: this.placeName(),
                            x: this.x(),
                            y: this.y()
                        });
                }, this);
            } else {
                this.placeName = this.value.placeName;
                this.x = this.value.x;
                this.y = this.value.y;
            }
                        
            var getAddressData = function(term, callback) {
                var url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' +
                    term + '.json';
                $.getJSON(url, {
                    access_token: arches.mapboxApiKey,
                    types: 'address',
                    limit: 10
                }, function (data) {
                    callback(data);
                });
            };
            
            this.select2Config = {
                value: this.placeName,
                clickBubble: true,
                multiple: false,
                placeholder: ko.observable('blah'),
                allowClear: true,
                query: function (query) {
                    if (query.term.length < 3) {
                        query.callback({results: []});
                        return;
                    }
                    getAddressData(query.term, function (data) {
                        query.callback({results: data.features});
                    });
                },
                initSelection: function(element, callback) {
                    getAddressData($(element).val(), function (data) {
                        if (data.features.length > 0) {
                            callback(data.features[0]);
                        }
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
