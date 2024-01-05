import frappe
from sipms.utils.cache import Cache


class Filter:
    def set_query_filters(doctype=None):
        roles = frappe.get_roles(frappe.session.user)
        if doctype is not None and ("Administrator" not in roles):
            cond_str = ""
            if "Admin" in roles:
                cond_str = "state"
            elif "MIS executive" in roles:
                cond_str = "single_window"
            elif "CSC Member" in roles:
                cond_str = "single_window"
            elif "Help-desk member" in roles:
                cond_str = "help_desk"
            value = Cache.get_csc()
            return """(`tab{0}`.help_desk = '{1}')""".format(doctype , value)
            # return f"""`tab{doctype}`.{cond_str} = '{value}'"""
        return ""

    def set_report_filters(filters=None, date_column='creation', str=False, table_name='', csc_filter=True):
        new_filters = {}
        str_list = []
        if table_name:
            date_column = f"{table_name}.{date_column}"
        if filters is None:
            return new_filters
        if filters.from_date and filters.to_date:
            if str:
                str_list.append(
                    f"({date_column} between '{filters.from_date}' AND '{filters.to_date}')")
            else:
                new_filters[date_column] = ["between", [
                    filters.from_date, filters.to_date]]
        elif filters.from_date:
            if str:
                str_list.append(f"({date_column} >= '{filters.from_date}')")
            else:
                new_filters[date_column] = [">=", filters.from_date]
        elif filters.to_date:
            if str:
                str_list.append(f"({date_column} <= '{filters.to_date}')")
            else:
                new_filters[date_column] = ["<=", filters.to_date]

        for filter_key in filters:
            if filter_key not in ['from_date', 'to_date']:
                if str:
                    str_list.append(f"({filter_key}='{filters[filter_key]}')")
                else:
                    new_filters[filter_key] = filters[filter_key]

        csc = None
        csc_key = f"single_window"
        if table_name:
            csc_key = f"{table_name}.{csc_key}"
        user = frappe.session.user
        if csc_filter and "MIS executive" in frappe.get_roles(user) and ("Administrator" not in frappe.get_roles(user)):
            csc = Cache.get_csc()
            if str:
                str_list.append(f"({csc_key}='{csc}')")
            else:
                new_filters[csc_key] = csc
        if str:
            return ' AND '.join(str_list)
        else:
            return new_filters
