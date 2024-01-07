import frappe
from sipms.utils.login_user_details import LoginUser
def list_query(user):
    if not user:
        user = frappe.session.user
    
    state = LoginUser.get_state()  # Assuming get_state is a method, so you need to call it
    if "Admin" in frappe.get_roles(user) and "Administrator" not in frappe.get_roles(user):
        include_roles = ['CSC Member', 'MIS executive', 'Help-desk member']
        profile_condition = f"""(`tabSipms User`.name = '{user}' OR `tabSipms User`.role_profile IN ({', '.join(f"'{r}'" for r in include_roles)}) And `tabSipms User`.state = '{state}')"""
        return profile_condition
    elif("MIS executive" in frappe.get_roles(user) and "Administrator" not in frappe.get_roles(user)):
        include_roles = ['CSC Member', 'Help-desk member']
        profile_condition = f"""(`tabSipms User`.name = '{user}' OR `tabSipms User`.role_profile IN ({', '.join(f"'{r}'" for r in include_roles)}) And `tabSipms User`.state = '{state}')"""
        return profile_condition
    else:
        return ""
