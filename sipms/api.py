import frappe
from sipms.services.beneficiary_scheme import BeneficaryScheme
from sipms.utils.misc import Misc
from sipms.utils.filter import Filter
import json

def create_condition(scheme, _tbl_pre=""):
    if isinstance(scheme, str):
        raise "No rules"
    user_role_filter = Filter.set_query_filters()
    cond_str = Misc.create_condition(scheme.rules)
    filters = []
    if cond_str:
        filters.append(cond_str)
    if user_role_filter:
        filters.append(user_role_filter)
    return " WHERE  1=1 "+ (f"AND {' AND '.join(filters)}" if len(filters) else "")

def get_beneficiary_scheme_query(scheme_doc):
    availed_sql = f""
    if scheme_doc.get('how_many_times_can_this_scheme_be_availed') == 'Once':
        availed_sql = f"""
            AND name not in (
                select
                    distinct parent
                from
                    `tabScheme Child`
                where
                    parenttype='Beneficiary Profiling'
                    and
                    name_of_the_scheme = '{scheme_doc.name}'
                    and
                    status IN ('Completed','Previously availed')
            )
        """
    condition = create_condition(scheme_doc)
    sql = f"""
        select
            _ben.*,
            _pm.name_of_parents as name_of_parents,
            _bl.block_name as block_name,
            _vl.village_name as village_name
        from
        (select * from `tabBeneficiary Profiling` {condition} {availed_sql}) as _ben
        LEFT JOIN `tabPrimary Member` _pm ON _pm.name = _ben.select_primary_member
        LEFT JOIN `tabBlock` _bl ON _bl.name = _ben.ward
        LEFT JOIN `tabVillage` _vl ON _vl.name = _ben.name_of_the_settlement
        ORDER BY select_primary_member DESC
    """
    return sql

@frappe.whitelist(allow_guest=True)
def execute(name=None):
    return BeneficaryScheme.get_schemes(name)

@frappe.whitelist(allow_guest=True)
def eligible_beneficiaries(scheme=None, columns=[], filters=[], start=0, page_length=1000):
    # filter value is getting hear
    columns = json.loads(columns)
    if scheme is None:
        return frappe.throw('Scheme not found.')
    scheme_doc = frappe.get_doc('Scheme',scheme)
    res = {
        'data':[],
        'count':{
            'total':0,
            'total_family':0,
            'block_count':0,
            'settlement_count':0
        }
    }
    if not scheme_doc:
        return res

    ben_sql = get_beneficiary_scheme_query(scheme_doc)
    # print(ben_sql)
    res['data'] = frappe.db.sql(ben_sql, as_dict=True)
    count_sql = f"""
        select
            count(distinct _tbl.name) as total,
            count(distinct _tbl.select_primary_member) as family_count,
            count(distinct _tbl.ward) as block_count,
            count(distinct _tbl.name_of_the_settlement) as settlement_count
        from
            ({ben_sql}) _tbl
    """
    count_data = frappe.db.sql(count_sql, as_dict=True)
    if len(count_data):
        res['count'].update(count_data[0])
    return res

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
def top_schemes():
    milestones = frappe.get_list("Milestone category", fields=['name'])
    user_role_filter = Filter.set_query_filters()
    # user_grole_filter will apply on condtional string
    scheme_with_rule_sql = f"""
        select
            distinct parent
        from
            `tabRule Engine Child`
    """
    scheme_with_rules = frappe.db.sql(scheme_with_rule_sql, as_dict=True)
    scheme_list = [sc.get('parent') for sc in scheme_with_rules]
    for milestone in milestones:
        schemes = frappe.get_list("Scheme", filters={'milestone':milestone.name, 'name':["IN",scheme_list]}, fields=['name'])
        for scheme in schemes:
            scheme['ben_count'] = 0
            scheme_doc = frappe.get_doc('Scheme',scheme.name)
            ben_sql = get_beneficiary_scheme_query(scheme_doc)
            count_sql = f"""
                select
                    count(distinct _tbl.name) as total
                from
                    ({ben_sql}) as _tbl
            """
            # print(count_sql)
            count_data = frappe.db.sql(count_sql, as_dict=True)
            if len(count_data):
                scheme['ben_count'] = count_data[0].total
        sorted_schemes = sorted(schemes, key=lambda x: x.get('ben_count', 0), reverse=True)
        milestone['schemes'] = sorted_schemes[:5]
    return milestones

#Code is not reflecting


