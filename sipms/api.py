import frappe
from sipms.services.beneficiary_scheme import BeneficaryScheme
from sipms.utils.misc import Misc
import json
@frappe.whitelist(allow_guest=True)
def execute(name=None):
    return BeneficaryScheme.get_schemes(name)

@frappe.whitelist(allow_guest=True)
def eligible_beneficiaries(scheme=None, columns=[], start=0, page_length=1000):
    columns = json.loads(columns)
    if scheme is None:
        return frappe.throw('Scheme not found.')

    cond_str= Misc.scheme_rules_to_condition(scheme)
    condtion = f"{('WHERE'+ cond_str) if cond_str else '' }"
    ben_sql = f"""
        SELECT
            distinct name as name
        FROM
            `tabBeneficiary Profiling`
        {condtion }
    """
    bens = frappe.db.sql(ben_sql, as_dict=True)
    total = len(bens)
    beneficiary_list = []
    if total:
        beneficiary_list = frappe.get_list("Beneficiary Profiling",
            fields=columns,
            filters={'name':('in', [ben.get('name') for ben in bens])},
            order_by='select_primary_member',
            start=0, page_length=page_length
        )
        count_sql = f"""
            select
                count(distinct select_primary_member) as family_count,
                count(distinct ward) as block_count,
                count(distinct name_of_the_settlement) as settlement_count
            from
                `tabBeneficiary Profiling`
            {condtion}
        """
        count_data = frappe.db.sql(count_sql, as_dict=True)
        if len(count_data):
            count_data = count_data[0]
    return {
        'data':beneficiary_list,
        'count':{
            'total':total,
            'total_family':count_data.family_count,
            'block_count':count_data.block_count,
            'settlement_count':count_data.settlement_count
        }
    }
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




@frappe.whitelist(allow_guest=True)
def top_schemes_of_milestone(milestone=None):
    if milestone is None:
        return frappe.throw('Milestone not found.')
    scheam_ben_count =[]
    scheame_query = f"""select name  from `tabScheme` where milestone = '{milestone}'"""
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