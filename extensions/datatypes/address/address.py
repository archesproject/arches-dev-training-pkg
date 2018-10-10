from arches.app.datatypes.base import BaseDataType
from arches.app.models import models

details = {
    'datatype': 'address',
    'iconclass': 'fa fa-file-code-o',
    'modulename': 'datatypes.py',
    'classname': 'AddressDataType',
    'defaultwidget': None,
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
            message = 'datatype: address, value: %s - missing required properties. data was not imported.'
            errors.append({
                'type': 'ERROR',
                'message': message.format(value)
            })

        return errors

    def append_to_document(self, document, nodevalue, nodeid, tile):
        document['strings'].append({
            'string': nodevalue['address'],
            'nodegroup_id': tile.nodegroup_id
        })

    def get_search_terms(self, nodevalue, nodeid=None):
        return [nodevalue['address']]
