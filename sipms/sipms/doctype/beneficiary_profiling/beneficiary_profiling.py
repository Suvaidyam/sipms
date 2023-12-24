# Copyright (c) 2023, suvaidyam and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from sipms.services.family import family
from sipms.utils.login_user_details import LoginUser
 
class BeneficiaryProfiling(Document):
	def after_insert(self):
		if not self.single_window:
			single_window = LoginUser.get_single_windows()
			frappe.db.set_value('Beneficiary Profiling', self.name, 'single_window', single_window, update_modified=False)
		if not self.help_desk:
			help_desk = LoginUser.get_helpdesk()
			frappe.db.set_value('Beneficiary Profiling', self.name, 'help_desk', help_desk, update_modified=False)
		if(self.new_source_of_information):
			new_source_of_information_doc = frappe.new_doc("Source Of Information")
			new_source_of_information_doc.source_name = self.new_source_of_information
			new_source_of_information_doc.save()
		if(self.add_house_type):
			current_house_type_doc = frappe.new_doc("House Types")
			current_house_type_doc.house_type_name = self.add_house_type
			current_house_type_doc.save()
		# print(self.has_anyone_from_your_family_visisted_before)
		if(self.has_anyone_from_your_family_visisted_before == "No"):
			""
			# family_doc = family.create(self)
			# frappe.db.set_value('Beneficiary Profiling', self.name, 'select_primary_member', family_doc.name, update_modified=False)
	

	def on_update(self):
		if(self.has_anyone_from_your_family_visisted_before == "No"):
			family_doc = family.update(self)
			frappe.db.set_value('Beneficiary Profiling', self.name, 'select_primary_member', family_doc.name, update_modified=False)
		else:
			family.delete_family(self)