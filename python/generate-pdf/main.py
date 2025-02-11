from fpdf import FPDF
from faker import Faker
import os
from datetime import datetime

fake = Faker()

class PDF(FPDF):
    def header(self):
        """Header with title."""
        self.set_font("Arial", "B", 16)
        self.cell(200, 10, "Employee Data", ln=True, align="C")
        self.ln(10)

    def chapter_title(self, title):
        """Formats section titles."""
        self.set_font("Arial", "B", 14)
        self.cell(0, 8, title, ln=True, align="L")
        self.ln(2)

    def chapter_subtitle(self, subtitle):
        """Formats week headers."""
        self.set_font("Arial", "B", 12)
        self.cell(0, 7, subtitle, ln=True, align="L")
        self.ln(2)

    def chapter_body(self, body):
        """Formats body text."""
        self.set_font("Arial", size=11)
        self.multi_cell(0, 6, body)
        self.ln(5)

    def add_separator(self):
        """Adds a horizontal separator line."""
        self.set_draw_color(150, 150, 150)
        self.set_line_width(0.5)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(7)
        
employees = []

for i in range(0,5):
    employee = {
        "name": fake.name(),
        "job": fake.job(),
        "email": fake.email(),
        "phone": fake.phone_number(),
        "department": fake.bs(),
        "salary": fake.random_int(min=30000, max=120000)
    }
    employees.append(employee)

pdf = PDF()

pdf.set_auto_page_break(auto=True, margin=15)
pdf.add_page()

# Start Date
pdf.set_font("Arial", "B", 12)
pdf.cell(200, 10, "List of our Top 5 Performing Employees", ln=True)
pdf.ln(5)


for employee in employees:
    # Phase 1
    pdf.add_separator()
    pdf.chapter_title(f"Employee: {employee['name']}")
    pdf.chapter_body(f"Job Title: {employee['job']}")

    # Week 1
    pdf.chapter_subtitle("Details")
    pdf.chapter_body(
        f"Email: {employee['email']}.\n"
        f"Phone: {employee['phone']}.\n"
        f"Department: {employee['department']}.\n"
        f"Salary {employee['salary']}.\n"
    )

# Final Notes
pdf.add_separator()
pdf.chapter_title("Final Notes")
pdf.chapter_body(
    "This is a list of our top 5 performing employees. \n"
    "Every employee has shown great dedication and commitment to their work. "
)

timestamp = datetime.now().strftime("%Y%m%d%H%M%S")

# Save the PDF
pdf_filename = f"{timestamp}.pdf"
output_dir = "./outputs"

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

pdf.output(f"{output_dir}/{pdf_filename}")
