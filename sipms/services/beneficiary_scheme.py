import frappe
from sipms.utils.misc import Misc
class BeneficaryScheme:
  def run(beneficiary=None):
    schemes = frappe.get_list('Scheme', fields=['name', 'name_of_department', 'milestone'])
    for scheme in schemes:
        doc = frappe.get_doc("Scheme", scheme.name)
        if doc.rules and len(doc.rules):
            filters = Misc.rules_to_filters(doc.rules,True)
            rule_list = []
            matching_counter = 0
            for group in filters:
                sql_query = ' AND '.join([f"{condition[0]} {condition[1]} {condition[2]}" for condition in filters[group]])
                filter = filters[group]
                filter.append(['name','=',beneficiary])
                beneficiary_list = frappe.get_list("Beneficiary Profiling", filters=filter,page_length=1)
                check = True if len(beneficiary_list) else False
                if check:
                    matching_counter += 1
                rule_list.append({
                    'message':f"[{group if group else ''}]:({sql_query})",
                    'check':check
                })
        scheme['rules'] = rule_list
        
        scheme['total_rules'] = len(rule_list)
        scheme['matching_rules'] = matching_counter
        scheme['matching_rules_per'] = 0
        if matching_counter > 0:
            scheme['matching_rules_per'] = (matching_counter/scheme['total_rules'])*100
    return schemes
