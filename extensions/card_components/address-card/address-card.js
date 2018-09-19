define([
    'knockout',
    'viewmodels/card-component',
    'bindings/mapbox-gl'
], function(ko, CardComponentViewModel) {
    return ko.components.register('address-card', {
        viewModel: function(params) {
            CardComponentViewModel.apply(this, [params]);
            
            this.setupMap = function(map) {
                console.log(map);
            };
        },
        template: {
            require: 'text!templates/views/components/card_components/address-card.htm'
        }
    });
});
