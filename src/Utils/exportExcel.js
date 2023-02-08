export function exportExcel(data, companyName) {
  const formattedData = [];

  if (data?.length === 0) {
    alert('No Students have applied for this job!');
  }

  data.forEach((data) => {
    const { name, email, passing_year, phone, qualifications, skills, resume_url } = data;
    formattedData.push({ name, email, passing_year, phone, qualifications, skills, resume_url });
  });

  if (!formattedData.length) return;

  import('xlsx').then(({ utils, writeFileXLSX }) => {
    let wb = utils.book_new();
    let ws = utils.json_to_sheet(formattedData);
    utils.book_append_sheet(wb, ws, 'mySheet');
    writeFileXLSX(wb, `${companyName}Applicants.xlsx`);
  });
}
