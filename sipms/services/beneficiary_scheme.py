import frappe
class BeneficaryScheme:
  def run(beneficiary=None):
    schemes = frappe.get_list('Scheme', fields=['name'])
    for scheme in schemes:
        doc = frappe.get_doc("Scheme", scheme.name)
        new_rules = []
        matching_counter = 0
        for rule in doc.rules:
            local_filters = [] if beneficiary is None else ['name','=',beneficiary]
            local_filters.append([rule.get('rule_field'),rule.get('operator'),rule.get('data')])
            beneficiary_list = frappe.get_list("Beneficiary Profiling", filters=local_filters)
            check = True if len(beneficiary_list) else False
            new_rules.append({
                'rule_field':rule.get('rule_field'),
                'operator':rule.get('operator'),
                'data':rule.get('data'),
                'check': check
            })
            if check:
                matching_counter += 1
        scheme['rules'] = new_rules
        scheme['total_rules'] = len(new_rules)
        scheme['matching_rules'] = matching_counter
        scheme['matching_rules_per'] = (matching_counter/len(new_rules))*100

    return schemes
