import frappe
from frappe.utils import now_datetime, getdate
from dateutil.relativedelta import relativedelta

def update_dob_of_ben(param1, param2):
    today = now_datetime().date()

    # Get beneficiaries with date of birth and month of birth matching today
    beneficiaries = frappe.db.get_list('Beneficiary Profiling' , filters ={'gender':"Female" , 'date_of_birth': ''})

    for beneficiary in beneficiaries:
        age = calculate_age(beneficiary.dob, today)
        frappe.db.set_value('Beneficiary', beneficiary.name, 'age', age)


def calculate_age(date_of_birth, reference_date):
    dob = getdate(date_of_birth)
    delta = relativedelta(reference_date, dob)
    age = delta.years
    return age

# directly pass the function
frappe.enqueue(update_dob_of_ben, queue='short', param1='A', param2='B')

# or pass the full module path as string
# frappe.enqueue('app.module.folder.update_dob_of_ben', queue='short', param1='A', param2='B')
