import frappe
def list_query(user):
    if not user:
        user = frappe.session.user
    
    if("Admin" in frappe.get_roles(user) and "Administrator" not in frappe.get_roles(user)):
        include_roles = ['CSC Member', 'MIS executive', 'Help-desk member']
        profile_condition = f"""(`tabSipms User`.name = '{user}' OR `tabSipms User`.role_profile IN ({', '.join(f"'{r}'" for r in include_roles)}))"""
        return profile_condition
    elif("MIS executive" in frappe.get_roles(user) and "Administrator" not in frappe.get_roles(user)):
        include_roles = ['CSC Member', 'Help-desk member']
        profile_condition = f"""(`tabSipms User`.name = '{user}' OR `tabSipms User`.role_profile IN ({', '.join(f"'{r}'" for r in include_roles)}))"""
        return profile_condition
    else:
        return ""
