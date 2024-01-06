import frappe
from sipms.utils.filter import Filter

class ReportFilter:
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
        query_filter = Filter.set_query_filters(None)
        if table_name:
            # new_filters.append(f"({query_filter})")
            csc_key = f"{table_name}.{csc_key}"
        user = frappe.session.user
        if csc_filter and ("Administrator" not in frappe.get_roles(user)):
            if str:
                str_list.append(f"({query_filter})")
            else:
                new_filters.append(f"({query_filter})")
        if str:
            return ' AND '.join(str_list)
        else:
            return new_filters
