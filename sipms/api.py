import frappe
from sipms.services.beneficiary_scheme import BeneficaryScheme
from sipms.utils.misc import Misc
import json
@frappe.whitelist(allow_guest=True)
def execute(name=None):
    return BeneficaryScheme.get_schemes(name)

@frappe.whitelist(allow_guest=True)
def eligible_beneficiaries(scheme=None, columns=[]):
    columns = json.loads(columns)
    if scheme is None:
        return frappe.throw('Scheme not found.')
    # doc = frappe.get_doc("Scheme", scheme)
    # filters = Misc.rules_to_filters(doc.rules,True)
    # print("filters",filters)
    # beneficiary_list = frappe.get_list("Beneficiary Profiling", fields=columns, filters={},page_length=100)
    # return beneficiary_list

    cond_str= Misc.scheme_rules_to_condition(scheme)
    ben_sql = f"""
        SELECT
            distinct name as name
        FROM
            `tabBeneficiary Profiling`
        {('WHERE'+ cond_str) if cond_str else "" }
    """
    bens = frappe.db.sql(ben_sql, as_dict=True)
    beneficiary_list = frappe.get_list("Beneficiary Profiling", fields=columns, filters={'name':('in', [ben.get('name') for ben in bens])}, order_by='select_primary_member',page_length=100)
    return {'data':beneficiary_list, 'total':len(bens)}



    get_elegible_ben = f"""
        SELECT
            {','.join(columns)}
        FROM
            `tabBeneficiary Profiling`
        {('WHERE'+ cond_str) if cond_str else "" }
    """
    all_ben = frappe.db.sql(get_elegible_ben, as_dict=True)
    return all_ben

@frappe.whitelist(allow_guest=True)
def most_eligible_ben():
    scheam_ben_count =[]
    scheame_query = f"""select name  from `tabScheme` """
    get_all_scheame = frappe.db.sql(scheame_query, as_dict=True)
    for scheme in get_all_scheame:
        get_rules = f"""select  rule_field, operator, data from `tabScheme` as _ts JOIN `tabRule Engine Child` as _tsc on _tsc.parent = _ts.name where _ts.name_of_the_scheme ='{scheme.name.replace("'", "''")}';"""

        # get_rules = f"""select  rule_field, operator, data from `tabScheme` as _ts JOIN `tabRule Engine Child` as _tsc on _tsc.parent = _ts.name where _ts.name_of_the_scheme ='{scheme.name}';"""
        rules = frappe.db.sql(get_rules, as_dict=True)
        condition_str =""
        if rules:
            for rule in rules:
                condition_str = f"""{condition_str} {rule.rule_field} {rule.operator} '{rule.data}' AND"""
            # condition_str = f"{condition_str} "
        else:
            condition_str = ""
        get_elegible_ben = f""" SELECT count(name) as abc FROM `tabBeneficiary Profiling` WHERE{condition_str} 1=1 order by abc DESC"""
        all_ben = frappe.db.sql(get_elegible_ben, as_dict=True)
        sch_ben = {"scheam": scheme.name , "bencount": all_ben[0].abc}
        scheam_ben_count.append(sch_ben)
    sorted_schemes = sorted(scheam_ben_count, key=lambda x: x["bencount"], reverse=True)
    # Get the top 5 schemes
    top_5_schemes = sorted_schemes[:5]
    return top_5_schemes