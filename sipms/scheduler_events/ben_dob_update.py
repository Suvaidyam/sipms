import frappe

def update_dob_of_ben():
    query = """UPDATE `tabBeneficiary Profiling`
    SET completed_age = completed_age + 1
    WHERE DATE_FORMAT(date_of_birth, '%m-%d') = DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 1 DAY), '%m-%d');
    """
    data = frappe.db.sql(query, as_dict=True)

    return data

def update_dob_months():
    query = """UPDATE `tabBeneficiary Profiling`
        SET completed_age_month = 
            CASE 
                WHEN completed_age_month < 11 THEN completed_age_month + 1
                ELSE 0
            END
        WHERE DATE_FORMAT(date_of_birth, '%d') = DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 1 DAY), '%d');
    """
    data = frappe.db.sql(query, as_dict=True)
    return data

