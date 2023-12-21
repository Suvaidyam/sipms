# Copyright (c) 2023, suvaidyam and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from sipms.services.family import family
 

class BeneficiaryProfiling(Document):
	def after_insert(self):
		print(self.has_anyone_from_your_family_visisted_before)
		if(self.has_anyone_from_your_family_visisted_before == "No"):
			family_doc = family.create(self)
			frappe.db.set_value('Beneficiary Profiling', self.name, 'family', family_doc.name, update_modified=False)
	

	def on_update(self):
		if(self.has_anyone_from_your_family_visisted_before == "No"):
			family_doc = family.update(self)
			frappe.db.set_value('Beneficiary Profiling', self.name, 'family', family_doc.name, update_modified=False)