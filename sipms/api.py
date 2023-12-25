import frappe
from sipms.services.beneficiary_scheme import BeneficaryScheme
@frappe.whitelist(allow_guest=True)
def execute(name=None):
    return BeneficaryScheme.run(name)