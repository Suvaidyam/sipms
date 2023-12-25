import frappe
from sipms.services.beneficiary_scheme import BeneficaryScheme
@frappe.whitelist(allow_guest=True)
def execute():
    return BeneficaryScheme.run()