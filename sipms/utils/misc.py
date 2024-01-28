import frappe
class Misc:
    def scheme_rules_to_condition(scheme):
        sql = f"""
            select
                _tsc.rule_field,
                _tsc.operator,
                _tsc.data,
                _tsc.code,
                _tsc.group
            from
                `tabScheme` as _ts
            inner join `tabRule Engine Child` as _tsc on (_tsc.parent = _ts.name and _tsc.parenttype = 'Scheme')
            where
                _ts.name_of_the_scheme = %s
        """
        rules = frappe.db.sql(sql, (scheme,), as_dict=True)
        conditions = []
        if rules is not None and len(rules):
            groups = {}
            gIndex = 0
            for rule in rules:
                if not rule.group:
                    gIndex = (gIndex+1)
                    groups[f"G{gIndex}"] = [f"{rule.rule_field} {rule.operator} '{rule.data}'"]
                elif groups.get(rule.group) is None:
                    groups[rule.group] = [f"{rule.rule_field} {rule.operator} '{rule.data}'"]
                else:
                    groups[rule.group].append(f"{rule.rule_field} {rule.operator} '{rule.data}'")
            for key in groups.keys():
                conditions.append(f"({' OR '.join(groups[key])})")

        return f"{' AND '.join(conditions)}"