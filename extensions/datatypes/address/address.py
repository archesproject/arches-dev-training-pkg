from arches.app.datatypes.base import BaseDataType
from arches.app.models import models
from arches.app.models.system_settings import settings

geocoder = models.Widget.objects.get(name='geocoder')

details = {
    'datatype': 'address',
    'iconclass': 'fa fa-file-code-o',
    'modulename': 'datatypes.py',
    'classname': 'AddressDataType',
    'defaultwidget': geocoder,
    'defaultconfig': None,
    'configcomponent': None,
    'configname': None,
    'isgeometric': False,
    'issearchable': False
}


class AddressDataType(BaseDataType):

    def validate(self, value, source=None):
        errors = []
        try:
            value['address']
            value['x']
            value['y']
        except KeyError:
            errors.append({
                'type': 'ERROR',
                'message': 'datatype: {0} value: {1} {2} - {3}. {4}'.format(
                    self.datatype_model.datatype,
                    value,
                    source,
                    'missing required properties',
                    'This data was not imported.'
                )
            })

        return errors

    def append_to_document(self, document, nodevalue, nodeid, tile):
        document['strings'].append({'string': nodevalue['address'], 'nodegroup_id': tile.nodegroup_id})

    def get_search_terms(self, nodevalue, nodeid=None):
        terms = [nodevalue['address']]
        return terms
