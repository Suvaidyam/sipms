# Copyright (c) 2023, suvaidyam and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from sipms.services.family import family
 

class BeneficiaryProfiling(Document):
	def after_insert(self):
		# source of informtion other logics 

		# other logics for other house types
		print(self.has_anyone_from_your_family_visisted_before)
		if(self.has_anyone_from_your_family_visisted_before == "No"):
			family_doc = family.create(self)
			frappe.db.set_value('Beneficiary Profiling', self.name, 'select_primary_member', family_doc.name, update_modified=False)
	

	def on_update(self):
		if(self.has_anyone_from_your_family_visisted_before == "No"):
			family_doc = family.update(self)
			frappe.db.set_value('Beneficiary Profiling', self.name, 'select_primary_member', family_doc.name, update_modified=False)
		else:
			family.delete_family(self)