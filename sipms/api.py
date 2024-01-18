import frappe
from sipms.services.beneficiary_scheme import BeneficaryScheme
@frappe.whitelist(allow_guest=True)
def execute(name=None):
    return BeneficaryScheme.run(name)



@frappe.whitelist(allow_guest=True)
def eligible_beneficiaries():
    get_rules = """select name_of_the_scheme, rule_field, operator , data  from `tabScheme` as _ts JOIN `tabRule Engine Child` as _tsc on _tsc.parent = _ts.name
 where name_of_the_scheme = 'scheam 1';








"""
    # support rules get
    #  get list of beneficary according to support rules
    
    return ["aaaa", "bbbb" , "cccc"]