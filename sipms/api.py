import frappe
from sipms.services.beneficiary_scheme import BeneficaryScheme
@frappe.whitelist(allow_guest=True)
def execute(name=None):
    return BeneficaryScheme.run(name)



@frappe.whitelist(allow_guest=True)
def eligible_beneficiaries(scheme=''):
    get_rules = f"""select  rule_field, operator, data from `tabScheme` as _ts JOIN `tabRule Engine Child` as _tsc on _tsc.parent = _ts.name where name_of_the_scheme ='{scheme}';"""
    rules = frappe.db.sql(get_rules, as_dict=True)
    condition_str =""
    if rules:
        for rule in rules:
           condition_str = f"""{condition_str} {rule.rule_field} {rule.operator} '{rule.data}' AND"""
        # condition_str = f"{condition_str} "  
    else:
        condition_str = ""

    get_elegible_ben = f""" SELECT * FROM `tabBeneficiary Profiling` WHERE{condition_str} 1=1""" 
    all_ben = frappe.db.sql(get_elegible_ben, as_dict=True)

    return all_ben
