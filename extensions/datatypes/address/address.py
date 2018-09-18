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
        return errors

    def append_to_document(self, document, nodevalue, nodeid, tile):
        return

    def transform_export_values(self, value, *args, **kwargs):
        if value is not None:
            return value

    def get_search_terms(self, nodevalue, nodeid=None):
        terms = []
        return terms
