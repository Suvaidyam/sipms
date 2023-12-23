# Copyright (c) 2023, suvaidyam and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

def update_new_user_password(email , password):
	# frappe.db.set_value('User', email, 'new_password', password, update_modified=False)
	user_doc = frappe.get_doc("User", email)
	print("user ???????///////////////////////////////", user_doc)
	user_doc.new_password = password
	user_doc.save()
	return user_doc


class SipmsUser(Document):
	def after_insert(self):
		new_user = frappe.new_doc("User")
		new_user.email = self.email
		new_user.first_name = self.first_name
		new_user.last_name = self.last_name
		new_user.role_profile_name = self.role_profile
		new_user.new_password = self.password
		new_user.save()
		# update password of users
		# update_new_user_password(self.email , self.password)


