import frappe
from sipms.utils.misc import Misc
class BeneficaryScheme:
    def run(beneficiary=None):
        schemes = frappe.get_list('Scheme', fields=['name', 'name_of_department', 'milestone'])
        for scheme in schemes:
            doc = frappe.get_doc("Scheme", scheme.name)
            rule_list = []
            matching_counter = 0
            if doc.rules and len(doc.rules):
                filters = Misc.rules_to_filters(doc.rules,True)
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
    def validate(condition):
        list = frappe.get_list("Beneficiary Profiling", filters=[condition],page_length=1)
        return True if len(list) > 0 else False

    def validate_conditions(key, conditions):
        obj = {'total':len(conditions), 'matched':0, 'percentage':0,'rules':[],'key':key}
        for condition in conditions:
            is_matched = BeneficaryScheme.validate(condition)
            obj['message'] = ' AND '.join([f"{condition[0]} {condition[1]} {condition[2]}"]) if is_matched else ''
            obj['matched'] = (obj['matched'] + 1) if is_matched else (obj['matched'] + 0)
            obj['rules'].append({'message':obj['message'],'matched':obj['matched']})
        obj['percentage'] = ((obj['matched']/obj['total'])*100) if obj['total'] > 0 else 0
        return obj

    def get_schemes(beneficiary=None):
        schemes = frappe.get_list('Scheme', fields=['name', 'name_of_department', 'milestone'])
        for scheme in schemes:
            doc = frappe.get_doc("Scheme", scheme.name)
            if doc.rules and len(doc.rules):
                filters = Misc.rules_to_filters(doc.rules,True)
                groups = []
                for key in filters:
                    groups.append(BeneficaryScheme.validate_conditions(key,filters[key]))
                denominator_sorted_list = sorted(groups, key=lambda x: x['total'], reverse=True)
                percentage_sorted_list = sorted(denominator_sorted_list, key=lambda x: x['percentage'], reverse=True)

                scheme['rules'] = percentage_sorted_list[0]['rules'] if len(percentage_sorted_list)>0 else []
                scheme['total_rules'] = percentage_sorted_list[0]['total'] if len(percentage_sorted_list)>0 else 0
                scheme['matching_rules'] = percentage_sorted_list[0]['matched'] if len(percentage_sorted_list)>0 else 0
                scheme['matching_rules_per'] = 0
                if scheme['matching_rules'] > 0:
                    scheme['matching_rules_per'] = ((scheme['matching_rules']/scheme['total_rules'])*100)
        res_schemes_denominator_sort = sorted(schemes, key=lambda x: x['total_rules'], reverse=True)
        res_schemes = sorted(res_schemes_denominator_sort, key=lambda x: x['matching_rules_per'], reverse=True)
        return res_schemes
